
const mongoose = require("mongoose");

const OrganizationMember = require("../Model/organizationMembers.model");

const getActiveMembership = async (organizationId, userId) => {
  return OrganizationMember.findOne({
    organization: organizationId,
    user: userId,
    status: "active",
  });
};

const validId = (id) => mongoose.isValidObjectId(id);

const canManageMembers = (member) =>
  ["owner", "admin"].includes(member?.role);

// LIST MEMBERS
// GET /organizations/:organizationId/members
exports.listMembers = async (req, res) => {
  try {
    const { organizationId } = req.params;

    if (!validId(organizationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid organization ID",
      });
    }

    const currentMember = await getActiveMembership(
      organizationId,
      req.user._id
    );

    if (!currentMember) {
      return res.status(403).json({
        success: false,
        message: "Organization access denied",
      });
    }

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, parseInt(req.query.limit, 10) || 20)
    );

    const filter = { organization: organizationId };

    if (req.query.status) {
      if (!["active", "suspended"].includes(req.query.status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid member status",
        });
      }

      filter.status = req.query.status;
    }

    const [members, total] = await Promise.all([
      OrganizationMember.find(filter)
        .select("-__v")
        .populate("user", "name email avatar")
        .populate("invitedBy", "name email")
        .sort({ createdAt: -1, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      OrganizationMember.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      members,
    });
  } catch (error) {
    console.error("List members error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch organization members",
    });
  }
};

// GET SINGLE MEMBER
// GET /organizations/:organizationId/members/:memberId
exports.getMember = async (req, res) => {
  try {
    const { organizationId, memberId } = req.params;

    if (!validId(organizationId) || !validId(memberId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid organization or member ID",
      });
    }

    const currentMember = await getActiveMembership(
      organizationId,
      req.user._id
    );

    if (!currentMember) {
      return res.status(403).json({
        success: false,
        message: "Organization access denied",
      });
    }

    const member = await OrganizationMember.findOne({
      _id: memberId,
      organization: organizationId,
    })
      .populate("user", "name email avatar")
      .populate("invitedBy", "name email")
      .lean();

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    return res.status(200).json({
      success: true,
      member,
    });
  } catch (error) {
    console.error("Get member error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch member",
    });
  }
};

// UPDATE MEMBER ROLE
// PATCH /organizations/:organizationId/members/:memberId/role
exports.updateMemberRole = async (req, res) => {
  try {
    const { organizationId, memberId } = req.params;
    const { role } = req.body;

    const allowedRoles = ["admin", "manager", "member"];

    if (!validId(organizationId) || !validId(memberId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid organization or member ID",
      });
    }

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const currentMember = await getActiveMembership(
      organizationId,
      req.user._id
    );

    // Only owner can change roles
    if (!currentMember || currentMember.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Only the organization owner can change member roles",
      });
    }

    const targetMember = await OrganizationMember.findOne({
      _id: memberId,
      organization: organizationId,
    });

    if (!targetMember) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    if (targetMember.role === "owner") {
      return res.status(403).json({
        success: false,
        message: "Owner role cannot be changed here",
      });
    }

    targetMember.role = role;
    await targetMember.save();

    return res.status(200).json({
      success: true,
      message: "Member role updated successfully",
      member: targetMember,
    });
  } catch (error) {
    console.error("Update member role error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update member role",
    });
  }
};

// REMOVE MEMBER
// DELETE /organizations/:organizationId/members/:memberId
exports.removeMember = async (req, res) => {
  try {
    const { organizationId, memberId } = req.params;

    if (!validId(organizationId) || !validId(memberId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid organization or member ID",
      });
    }

    const currentMember = await getActiveMembership(
      organizationId,
      req.user._id
    );

    // Only owner can remove members
    if (!currentMember || currentMember.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Only the organization owner can remove members",
      });
    }

    const targetMember = await OrganizationMember.findOne({
      _id: memberId,
      organization: organizationId,
    });

    if (!targetMember) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    if (targetMember.role === "owner") {
      return res.status(403).json({
        success: false,
        message: "Transfer ownership before removing the owner",
      });
    }

    await OrganizationMember.deleteOne({
      _id: targetMember._id,
      organization: organizationId,
    });

    return res.status(200).json({
      success: true,
      message: "Member removed successfully",
    });
  } catch (error) {
    console.error("Remove member error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove member",
    });
  }
};

// LEAVE ORGANIZATION
// DELETE /organizations/:organizationId/leave
exports.leaveOrganization = async (req, res) => {
  try {
    const { organizationId } = req.params;

    if (!validId(organizationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid organization ID",
      });
    }

    const member = await getActiveMembership(
      organizationId,
      req.user._id
    );

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Active membership not found",
      });
    }

    if (member.role === "owner") {
      return res.status(403).json({
        success: false,
        message: "Transfer ownership before leaving the organization",
      });
    }

    await OrganizationMember.deleteOne({
      _id: member._id,
      organization: organizationId,
      user: req.user._id,
    });

    return res.status(200).json({
      success: true,
      message: "You have left the organization",
    });
  } catch (error) {
    console.error("Leave organization error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to leave organization",
    });
  }
};
