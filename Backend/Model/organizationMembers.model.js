
const mongoose = require("mongoose");

const OrganizationMember = require("../Model/organizationMembers.model");
const Organization = require("../Model/organizations.model");
const User = require("../Model/user.model");

// ADD ORGANIZATION MEMBER
exports.addOrganizationMember = async (req, res) => {
  try {
    const { organization, user, role } = req.body;

    if (
      !mongoose.isValidObjectId(organization) ||
      !mongoose.isValidObjectId(user)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid organization or user ID",
      });
    }

    // Only authorized organization admins should reach this controller.
    // Do not allow arbitrary owner assignment.
    const allowedRoles = ["admin", "manager", "member"];

    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const organizationExists = await Organization.findById(organization);

    if (!organizationExists) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    const userExists = await User.findById(user);

    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const existingMember = await OrganizationMember.findOne({
      organization,
      user,
    });

    if (existingMember) {
      return res.status(409).json({
        success: false,
        message: "User is already associated with this organization",
      });
    }

    const member = await OrganizationMember.create({
      organization,
      user,
      role: role || "member",
      status: "active",
      joinedAt: new Date(),
      invitedBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Organization member added successfully",
      member,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Organization membership already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL MEMBERS OF AN ORGANIZATION
exports.getOrganizationMembers = async (req, res) => {
  try {
    const { organizationId } = req.params;

    if (!mongoose.isValidObjectId(organizationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid organization ID",
      });
    }

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, parseInt(req.query.limit, 10) || 10),
    );

    const filter = {
      organization: organizationId,
    };

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
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),

      OrganizationMember.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      members,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SINGLE ORGANIZATION MEMBER
exports.getOrganizationMember = async (req, res) => {
  try {
    const { memberId } = req.params;

    if (!mongoose.isValidObjectId(memberId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid member ID",
      });
    }

    const member = await OrganizationMember.findById(memberId)
      .populate("user", "name email avatar")
      .populate("organization")
      .populate("invitedBy", "name email");

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Organization member not found",
      });
    }

    return res.status(200).json({
      success: true,
      member,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE MEMBER ROLE
exports.updateMemberRole = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { role } = req.body;

    const allowedRoles = ["owner", "admin", "manager", "member"];

    if (!mongoose.isValidObjectId(memberId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid member ID",
      });
    }

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const member = await OrganizationMember.findById(memberId);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Organization member not found",
      });
    }

    // Protect ownership transfers.
    // Owner transfer requires a dedicated, atomic workflow.
    if (role === "owner" || member.role === "owner") {
      return res.status(403).json({
        success: false,
        message: "Owner role changes require an ownership transfer workflow",
      });
    }

    member.role = role;
    await member.save();

    return res.status(200).json({
      success: true,
      message: "Member role updated successfully",
      member,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// SUSPEND MEMBER
exports.suspendOrganizationMember = async (req, res) => {
  try {
    const { memberId } = req.params;

    if (!mongoose.isValidObjectId(memberId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid member ID",
      });
    }

    const member = await OrganizationMember.findById(memberId);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Organization member not found",
      });
    }

    if (member.role === "owner") {
      return res.status(403).json({
        success: false,
        message: "Organization owner cannot be suspended here",
      });
    }

    if (member.status === "suspended") {
      return res.status(409).json({
        success: false,
        message: "Member is already suspended",
      });
    }

    member.status = "suspended";
    await member.save();

    return res.status(200).json({
      success: true,
      message: "Organization member suspended successfully",
      member,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// REACTIVATE MEMBER
exports.reactivateOrganizationMember = async (req, res) => {
  try {
    const { memberId } = req.params;

    if (!mongoose.isValidObjectId(memberId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid member ID",
      });
    }

    const member = await OrganizationMember.findById(memberId);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Organization member not found",
      });
    }

    member.status = "active";
    await member.save();

    return res.status(200).json({
      success: true,
      message: "Organization member reactivated successfully",
      member,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// REMOVE ORGANIZATION MEMBER
exports.removeOrganizationMember = async (req, res) => {
  try {
    const { memberId } = req.params;

    if (!mongoose.isValidObjectId(memberId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid member ID",
      });
    }

    const member = await OrganizationMember.findById(memberId);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Organization member not found",
      });
    }

    if (member.role === "owner") {
      return res.status(403).json({
        success: false,
        message: "Transfer ownership before removing the owner",
      });
    }

    await OrganizationMember.deleteOne({
      _id: member._id,
    });

    return res.status(200).json({
      success: true,
      message: "Organization member removed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
