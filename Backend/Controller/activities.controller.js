
const mongoose = require("mongoose");

const Activity = require("../Model/activities.model");
const OrganizationMember = require("../Model/organizationMembers.model");
const Project = require("../Model/projects.model");

// GET /organizations/:organizationId/activities
// GET /organizations/:organizationId/projects/:projectId/activities

// Check whether the logged-in user is an active organization member
const checkOrganizationMembership = async (organizationId, userId) => {
  return OrganizationMember.findOne({
    organization: organizationId,
    user: userId,
    status: "active",
  });
};

// Get organization activities
exports.listOrganizationActivities = async (req, res) => {
  try {
    const { organizationId } = req.params;

    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login.",
      });
    }

    if (!mongoose.isValidObjectId(organizationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid organization ID.",
      });
    }

    // Verify active membership
    const membership = await checkOrganizationMembership(
      organizationId,
      userId
    );

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: "You are not an active member of this organization.",
      });
    }

    // Pagination
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, parseInt(req.query.limit, 10) || 20)
    );

    const skip = (page - 1) * limit;

    const filter = {
      organization: organizationId,
    };

    const [activities, total] = await Promise.all([
      Activity.find(filter)
        .populate("actor", "name email")
        .populate("project", "name")
        .populate("task", "title")
        .sort({ createdAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Activity.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      message: "Organization activities fetched successfully.",
      data: activities,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("List organization activities error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch organization activities.",
    });
  }
};

// Get project activities
exports.listProjectActivities = async (req, res) => {
  try {
    const { organizationId, projectId } = req.params;

    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login.",
      });
    }

    if (
      !mongoose.isValidObjectId(organizationId) ||
      !mongoose.isValidObjectId(projectId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid organization or project ID.",
      });
    }

    // Verify active organization membership
    const membership = await checkOrganizationMembership(
      organizationId,
      userId
    );

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: "You are not an active member of this organization.",
      });
    }

    // Verify project belongs to this organization
    const project = await Project.findOne({
      _id: projectId,
      organization: organizationId,
    }).select("_id");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found in this organization.",
      });
    }

    // Pagination
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, parseInt(req.query.limit, 10) || 20)
    );

    const skip = (page - 1) * limit;

    const filter = {
      organization: organizationId,
      project: projectId,
    };

    const [activities, total] = await Promise.all([
      Activity.find(filter)
        .populate("actor", "name email")
        .populate("project", "name")
        .populate("task", "title")
        .sort({ createdAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Activity.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      message: "Project activities fetched successfully.",
      data: activities,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("List project activities error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch project activities.",
    });
  }
};
