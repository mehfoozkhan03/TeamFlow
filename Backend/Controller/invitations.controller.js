
const crypto = require("crypto");
const mongoose = require("mongoose");

const Invitation = require("../Model/invitations.model");
const OrganizationMember = require("../Model/organizationMembers.model");
const User = require("../Model/User.model");

// Generate secure random invitation token
const generateInvitationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Hash token before storing
const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

// Check active organization membership
const getMembership = async (organizationId, userId) => {
  return OrganizationMember.findOne({
    organization: organizationId,
    user: userId,
    status: "active",
  });
};

// Admin/manager permission
const canManageInvitations = (membership) => {
  return ["admin", "manager"].includes(membership?.role);
};

// CREATE INVITATION
// POST /organizations/:organizationId/invitations
exports.createInvitation = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const userId = req.user?._id;
    const { email, role = "member" } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    if (!mongoose.isValidObjectId(organizationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid organization ID.",
      });
    }

    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address.",
      });
    }

    const allowedRoles = ["admin", "manager", "member"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid invitation role.",
      });
    }

    const membership = await getMembership(
      organizationId,
      userId
    );

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: "You are not an active organization member.",
      });
    }

    if (!canManageInvitations(membership)) {
      return res.status(403).json({
        success: false,
        message: "You cannot manage invitations.",
      });
    }

    // Prevent unauthorized admin invitation creation
    if (role === "admin" && membership.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only an admin can invite another admin.",
      });
    }

    // Do not invite someone already active
    const existingUser = await User.findOne({
      email: normalizedEmail,
    }).select("_id");

    if (existingUser) {
      const existingMembership = await OrganizationMember.findOne({
        organization: organizationId,
        user: existingUser._id,
        status: "active",
      });

      if (existingMembership) {
        return res.status(409).json({
          success: false,
          message: "This user is already an organization member.",
        });
      }
    }

    // Check for an existing pending invitation
    const existingInvitation = await Invitation.findOne({
      organization: organizationId,
      email: normalizedEmail,
      status: "pending",
      expiresAt: { $gt: new Date() },
    });

    if (existingInvitation) {
      return res.status(409).json({
        success: false,
        message: "A pending invitation already exists.",
      });
    }

    const invitationToken = generateInvitationToken();
    const tokenHash = hashToken(invitationToken);

    const expiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    );

    const invitation = await Invitation.create({
      organization: organizationId,
      email: normalizedEmail,
      role,
      invitedBy: userId,
      tokenHash,
      expiresAt,
      status: "pending",
    });

    // IMPORTANT:
    // This returns the raw token for development/integration.
    // In production, email the invitation link and do not
    // expose the token through a normal API response.
    return res.status(201).json({
      success: true,
      message: "Invitation created successfully.",
      data: {
        invitationId: invitation._id,
        email: invitation.email,
        role: invitation.role,
        status: invitation.status,
        expiresAt: invitation.expiresAt,
        invitationToken,
      },
    });
  } catch (error) {
    console.error("Create invitation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create invitation.",
    });
  }
};

// LIST INVITATIONS
// GET /organizations/:organizationId/invitations
exports.listInvitations = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    if (!mongoose.isValidObjectId(organizationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid organization ID.",
      });
    }

    const membership = await getMembership(
      organizationId,
      userId
    );

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: "You are not an active organization member.",
      });
    }

    if (!canManageInvitations(membership)) {
      return res.status(403).json({
        success: false,
        message: "You cannot view organization invitations.",
      });
    }

    const page = Math.max(
      1,
      parseInt(req.query.page, 10) || 1
    );

    const limit = Math.min(
      100,
      Math.max(1, parseInt(req.query.limit, 10) || 20)
    );

    const skip = (page - 1) * limit;

    const filter = {
      organization: organizationId,
    };

    if (
      req.query.status &&
      ["pending", "accepted", "revoked", "expired"].includes(
        req.query.status
      )
    ) {
      filter.status = req.query.status;
    }

    // Treat pending invitations past their expiration
    // as expired, even before MongoDB TTL cleanup.
    await Invitation.updateMany(
      {
        organization: organizationId,
        status: "pending",
        expiresAt: { $lte: new Date() },
      },
      {
        $set: { status: "expired" },
      }
    );

    const [invitations, total] = await Promise.all([
      Invitation.find(filter)
        .select("-tokenHash")
        .populate("invitedBy", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Invitation.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      message: "Invitations fetched successfully.",
      data: invitations,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("List invitations error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch invitations.",
    });
  }
};

// REVOKE INVITATION
// DELETE /organizations/:organizationId/invitations/:invitationId
exports.revokeInvitation = async (req, res) => {
  try {
    const { organizationId, invitationId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    if (
      !mongoose.isValidObjectId(organizationId) ||
      !mongoose.isValidObjectId(invitationId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid organization or invitation ID.",
      });
    }

    const membership = await getMembership(
      organizationId,
      userId
    );

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: "You are not an active organization member.",
      });
    }

    if (!canManageInvitations(membership)) {
      return res.status(403).json({
        success: false,
        message: "You cannot revoke invitations.",
      });
    }

    const invitation = await Invitation.findOneAndUpdate(
      {
        _id: invitationId,
        organization: organizationId,
        status: "pending",
        expiresAt: { $gt: new Date() },
      },
      {
        $set: { status: "revoked" },
      },
      { new: true }
    ).select("-tokenHash");

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message: "Pending invitation not found or expired.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Invitation revoked successfully.",
      data: invitation,
    });
  } catch (error) {
    console.error("Revoke invitation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to revoke invitation.",
    });
  }
};

// ACCEPT INVITATION
// POST /accept
// Body: { "token": "INVITATION_TOKEN" }
exports.acceptInvitation = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const userId = req.user?._id;
    const { token } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    if (
      typeof token !== "string" ||
      !/^[a-f0-9]{64}$/i.test(token)
    ) {
      return res.status(400).json({
        success: false,
        message: "A valid invitation token is required.",
      });
    }

    const user = await User.findById(userId).select("email");

    if (!user?.email) {
      return res.status(404).json({
        success: false,
        message: "User account email not found.",
      });
    }

    const tokenHash = hashToken(token);
    const userEmail = user.email.trim().toLowerCase();

    let acceptedInvitation;

    await session.withTransaction(async () => {
      const invitation = await Invitation.findOne({
        tokenHash,
        email: userEmail,
        status: "pending",
        expiresAt: { $gt: new Date() },
      })
        .select("+tokenHash")
        .session(session);

      if (!invitation) {
        const error = new Error(
          "Invitation is invalid, expired, revoked, or belongs to another email."
        );
        error.statusCode = 400;
        throw error;
      }

      // Prevent duplicate membership
      const existingMembership = await OrganizationMember.findOne({
        organization: invitation.organization,
        user: userId,
        status: "active",
      }).session(session);

      if (existingMembership) {
        const error = new Error(
          "You are already an active organization member."
        );
        error.statusCode = 409;
        throw error;
      }

      // Create membership
      await OrganizationMember.create(
        [
          {
            organization: invitation.organization,
            user: userId,
            role: invitation.role,
            status: "active",
          },
        ],
        { session }
      );

      // Mark invitation accepted atomically
      const result = await Invitation.updateOne(
        {
          _id: invitation._id,
          status: "pending",
          expiresAt: { $gt: new Date() },
        },
        {
          $set: {
            status: "accepted",
            acceptedAt: new Date(),
            acceptedBy: userId,
          },
        },
        { session }
      );

      if (result.modifiedCount !== 1) {
        throw new Error(
          "Invitation was already used or is no longer valid."
        );
      }

      acceptedInvitation = {
        invitationId: invitation._id,
        organization: invitation.organization,
        role: invitation.role,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Invitation accepted successfully.",
      data: acceptedInvitation,
    });
  } catch (error) {
    console.error("Accept invitation error:", error);

    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Membership or invitation already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to accept invitation.",
    });
  } finally {
    await session.endSession();
  }
};
