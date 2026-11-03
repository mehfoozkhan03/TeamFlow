
const mongoose = require("mongoose");

const OrganizationMember = require("../Model/organizationMembers.model");

// Helper: validate organization membership
async function getActiveMembership(organizationId, userId) {
  return OrganizationMember.findOne({
    organization: organizationId,
    user: userId,
    status: "active",
  });
}

// LIST ORGANIZATION MEMBERS
exports.listMembers = async (req, res) => {
  try {
    const { organizationId } = req.params;

    if (!mongoose.isValidObjectId(organizationId)) {
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

    const members = await OrganizationMember.find({
      organization: organizationId,
    })
      .populate("user", "name email")
      .populate("invitedBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: members.length,
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

// GET A SPECIFIC MEMBER
exports.getMember = async (req, res) => {
  try {
    const { organizationId, memberId } = req.params;

    if (
      !mongoose.isValidObjectId(organizationId) ||
      !mongoose.isValidObjectId(memberId)
    ) {
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
      .populate("user", "name email")
      .populate("invitedBy", "name email");

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
exports.updateMemberRole = async (req, res) => {
  try {
    const { organizationId, memberId } = req.params;
    const { role } = req.body;

    const allowedRoles = ["admin", "manager", "member"];

    if (
      !mongoose.isValidObjectId(organizationId) ||
      !mongoose.isValidObjectId(memberId)
    ) {
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

    if (!currentMember || currentMember.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Only the organization owner can change member roles",
      });
    }

    const member = await OrganizationMember.findOne({
      _id: memberId,
      organization: organizationId,
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    if (member.role === "owner") {
      return res.status(403).json({
        success: false,
        message: "Owner role cannot be changed here",
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
    console.error("Update member role error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update member role",
    });
  }
};

// REMOVE MEMBER
exports.removeMember = async (req, res) => {
  try {
    const { organizationId, memberId } = req.params;

    if (
      !mongoose.isValidObjectId(organizationId) ||
      !mongoose.isValidObjectId(memberId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid organization or member ID",
      });
    }

    const currentMember = await getActiveMembership(
      organizationId,
      req.user._id
    );

    if (!currentMember || currentMember.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Only the organization owner can remove members",
      });
    }

    const member = await OrganizationMember.findOne({
      _id: memberId,
      organization: organizationId,
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
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
exports.leaveOrganization = async (req, res) => {
  try {
    const { organizationId } = req.params;

    if (!mongoose.isValidObjectId(organizationId)) {
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
