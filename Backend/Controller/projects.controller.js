
const mongoose = require("mongoose");

const Project = require("../Model/projects.model");
const Organization = require("../Model/organizations.model");
const OrganizationMember = require("../Model/organizationMembers.model");

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

const isValidId = (id) => mongoose.isValidObjectId(id);

const getActiveMembership = async (organizationId, userId) => {
  return OrganizationMember.findOne({
    organization: organizationId,
    user: userId,
    status: "active",
  });
};

const getActiveOrganization = async (organizationId) => {
  return Organization.findOne({
    _id: organizationId,
    status: "active",
  });
};

const canAccessProject = (project, userId) => {
  if (project.visibility === "organization") {
    return true;
  }

  return (
    project.owner.toString() === userId.toString() ||
    project.members.some(
      (member) => member.toString() === userId.toString()
    )
  );
};

const validDate = (value) => {
  if (value === null || value === "") return true;

  return !Number.isNaN(new Date(value).getTime());
};

// --------------------------------------------------
// CREATE PROJECT
// POST /organizations/:organizationId/projects
// --------------------------------------------------

exports.createProject = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const userId = req.user._id;

    const {
      name,
      key,
      description,
      status,
      visibility,
      members,
      startDate,
      dueDate,
      color,
    } = req.body;

    if (!isValidId(organizationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid organization ID",
      });
    }

    const organization = await getActiveOrganization(organizationId);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found or inactive",
      });
    }

    const membership = await getActiveMembership(
      organizationId,
      userId
    );

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: "You are not an active member of this organization",
      });
    }

    if (
      typeof name !== "string" ||
      !name.trim() ||
      name.trim().length > 180
    ) {
      return res.status(400).json({
        success: false,
        message: "Project name is required (maximum 180 characters)",
      });
    }

    if (
      typeof key !== "string" ||
      !key.trim() ||
      key.trim().length > 12
    ) {
      return res.status(400).json({
        success: false,
        message: "Project key is required (maximum 12 characters)",
      });
    }

    const normalizedKey = key.trim().toUpperCase();

    if (!/^[A-Z0-9_-]+$/.test(normalizedKey)) {
      return res.status(400).json({
        success: false,
        message: "Project key can contain letters, numbers, _ and -",
      });
    }

    if (
      description !== undefined &&
      (typeof description !== "string" ||
        description.length > 10000)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid project description",
      });
    }

    const validStatuses = [
      "planning",
      "active",
      "on_hold",
      "completed",
      "archived",
    ];

    if (
      status !== undefined &&
      !validStatuses.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid project status",
      });
    }

    if (
      visibility !== undefined &&
      !["organization", "private"].includes(visibility)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid project visibility",
      });
    }

    if (
      members !== undefined &&
      (!Array.isArray(members) ||
        !members.every((id) => isValidId(id)))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid project members",
      });
    }

    if (
      startDate !== undefined &&
      !validDate(startDate)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid start date",
      });
    }

    if (
      dueDate !== undefined &&
      !validDate(dueDate)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid due date",
      });
    }

    const parsedStartDate =
      startDate ? new Date(startDate) : undefined;

    const parsedDueDate =
      dueDate ? new Date(dueDate) : undefined;

    if (
      parsedStartDate &&
      parsedDueDate &&
      parsedDueDate < parsedStartDate
    ) {
      return res.status(400).json({
        success: false,
        message: "Due date cannot be before start date",
      });
    }

    // Validate that selected project members
    // are active organization members.
    const uniqueMembers = [
      ...new Set((members || []).map((id) => id.toString())),
    ];

    if (uniqueMembers.length > 0) {
      const activeMembers = await OrganizationMember.find({
        organization: organizationId,
        user: { $in: uniqueMembers },
        status: "active",
      }).select("user");

      if (activeMembers.length !== uniqueMembers.length) {
        return res.status(400).json({
          success: false,
          message:
            "One or more selected users are not active organization members",
        });
      }
    }

    // Ensure project creator is included.
    const projectMembers = [
      ...new Set([...uniqueMembers, userId.toString()]),
    ];

    const project = await Project.create({
      organization: organizationId,
      name: name.trim(),
      key: normalizedKey,
      description: description?.trim(),
      status: status || "planning",
      visibility: visibility || "organization",
      owner: userId,
      members: projectMembers,
      startDate: parsedStartDate,
      dueDate: parsedDueDate,
      color,
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.error("Create project error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This project key already exists in the organization",
      });
    }

    if (
      error.name === "ValidationError" ||
      error.name === "CastError"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create project",
    });
  }
};

// --------------------------------------------------
// LIST PROJECTS
// GET /organizations/:organizationId/projects
// --------------------------------------------------

exports.listProjects = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const userId = req.user._id;

    if (!isValidId(organizationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid organization ID",
      });
    }

    const organization = await getActiveOrganization(organizationId);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found or inactive",
      });
    }

    const membership = await getActiveMembership(
      organizationId,
      userId
    );

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: "Organization membership required",
      });
    }

    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, Number.parseInt(req.query.limit, 10) || 10)
    );

    const filter = {
      organization: organizationId,
      status: { $ne: "archived" },
      $or: [
        { visibility: "organization" },
        { owner: userId },
        { members: userId },
      ],
    };

    if (req.query.status) {
      const allowedStatuses = [
        "planning",
        "active",
        "on_hold",
        "completed",
      ];

      if (!allowedStatuses.includes(req.query.status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status filter",
        });
      }

      filter.status = req.query.status;
    }

    const [projects, total] = await Promise.all([
      Project.find(filter)
        .populate("owner", "name email")
        .sort({ updatedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      Project.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      projects,
    });
  } catch (error) {
    console.error("List projects error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
    });
  }
};

// --------------------------------------------------
// GET SINGLE PROJECT
// GET /organizations/:organizationId/projects/:projectId
// --------------------------------------------------

exports.getProject = async (req, res) => {
  try {
    const { organizationId, projectId } = req.params;
    const userId = req.user._id;

    if (!isValidId(organizationId) || !isValidId(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid organization or project ID",
      });
    }

    const organization = await getActiveOrganization(organizationId);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found or inactive",
      });
    }

    const membership = await getActiveMembership(
      organizationId,
      userId
    );

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: "Organization membership required",
      });
    }

    const project = await Project.findOne({
      _id: projectId,
      organization: organizationId,
      status: { $ne: "archived" },
    })
      .populate("owner", "name email")
      .populate("members", "name email");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (!canAccessProject(project, userId)) {
      return res.status(403).json({
        success: false,
        message: "You cannot access this private project",
      });
    }

    return res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    console.error("Get project error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch project",
    });
  }
};

// --------------------------------------------------
// UPDATE PROJECT
// PATCH /organizations/:organizationId/projects/:projectId
// --------------------------------------------------

exports.updateProject = async (req, res) => {
  try {
    const { organizationId, projectId } = req.params;
    const userId = req.user._id;

    if (!isValidId(organizationId) || !isValidId(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid organization or project ID",
      });
    }

    const organization = await getActiveOrganization(organizationId);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found or inactive",
      });
    }

    const membership = await getActiveMembership(
      organizationId,
      userId
    );

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: "Organization membership required",
      });
    }

    const project = await Project.findOne({
      _id: projectId,
      organization: organizationId,
      status: { $ne: "archived" },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Owner or organization admin/manager may update.
    const canUpdate =
      project.owner.toString() === userId.toString() ||
      ["owner", "admin", "manager"].includes(membership.role);

    if (!canUpdate) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to update this project",
      });
    }

    const allowedFields = [
      "name",
      "key",
      "description",
      "status",
      "visibility",
      "members",
      "startDate",
      "dueDate",
      "color",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (!Object.keys(updates).length) {
      return res.status(400).json({
        success: false,
        message: "No valid update fields provided",
      });
    }

    if (updates.name !== undefined) {
      if (
        typeof updates.name !== "string" ||
        !updates.name.trim() ||
        updates.name.trim().length > 180
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid project name",
        });
      }

      updates.name = updates.name.trim();
    }

    if (updates.key !== undefined) {
      if (typeof updates.key !== "string") {
        return res.status(400).json({
          success: false,
          message: "Invalid project key",
        });
      }

      updates.key = updates.key.trim().toUpperCase();

      if (
        !/^[A-Z0-9_-]{1,12}$/.test(updates.key)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid project key format",
        });
      }
    }

    if (updates.description !== undefined) {
      if (
        typeof updates.description !== "string" ||
        updates.description.length > 10000
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid description",
        });
      }

      updates.description = updates.description.trim();
    }

    if (
      updates.status !== undefined &&
      !["planning", "active", "on_hold", "completed", "archived"].includes(
        updates.status
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid project status",
      });
    }

    if (
      updates.visibility !== undefined &&
      !["organization", "private"].includes(updates.visibility)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid project visibility",
      });
    }

    if (updates.members !== undefined) {
      if (
        !Array.isArray(updates.members) ||
        !updates.members.every((id) => isValidId(id))
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid project members",
        });
      }

      const uniqueMembers = [
        ...new Set(updates.members.map((id) => id.toString())),
      ];

      const activeMembers = await OrganizationMember.find({
        organization: organizationId,
        user: { $in: uniqueMembers },
        status: "active",
      }).select("user");

      if (activeMembers.length !== uniqueMembers.length) {
        return res.status(400).json({
          success: false,
          message: "All project members must be active organization members",
        });
      }

      updates.members = [
        ...new Set([...uniqueMembers, project.owner.toString()]),
      ];
    }

    if (
      updates.startDate !== undefined &&
      !validDate(updates.startDate)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid start date",
      });
    }

    if (
      updates.dueDate !== undefined &&
      !validDate(updates.dueDate)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid due date",
      });
    }

    const finalStartDate =
      updates.startDate !== undefined
        ? (updates.startDate ? new Date(updates.startDate) : null)
        : project.startDate;

    const finalDueDate =
      updates.dueDate !== undefined
        ? (updates.dueDate ? new Date(updates.dueDate) : null)
        : project.dueDate;

    if (
      finalStartDate &&
      finalDueDate &&
      finalDueDate < finalStartDate
    ) {
      return res.status(400).json({
        success: false,
        message: "Due date cannot be before start date",
      });
    }

    if (updates.startDate !== undefined) {
      updates.startDate = finalStartDate;
    }

    if (updates.dueDate !== undefined) {
      updates.dueDate = finalDueDate;
    }

    if (updates.color !== undefined) {
      if (
        typeof updates.color !== "string" ||
        !/^#[0-9A-Fa-f]{6}$/.test(updates.color)
      ) {
        return res.status(400).json({
          success: false,
          message: "Color must be a valid hex color",
        });
      }
    }

    Object.assign(project, updates);
    await project.save();

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    console.error("Update project error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Project key already exists in this organization",
      });
    }

    if (
      error.name === "ValidationError" ||
      error.name === "CastError"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update project",
    });
  }
};

// --------------------------------------------------
// ARCHIVE PROJECT
// DELETE /organizations/:organizationId/projects/:projectId
// --------------------------------------------------

exports.archiveProject = async (req, res) => {
  try {
    const { organizationId, projectId } = req.params;
    const userId = req.user._id;

    if (!isValidId(organizationId) || !isValidId(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid organization or project ID",
      });
    }

    const organization = await getActiveOrganization(organizationId);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found or inactive",
      });
    }

    const membership = await getActiveMembership(
      organizationId,
      userId
    );

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: "Organization membership required",
      });
    }

    const project = await Project.findOne({
      _id: projectId,
      organization: organizationId,
      status: { $ne: "archived" },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const canArchive =
      project.owner.toString() === userId.toString() ||
      ["owner", "admin", "manager"].includes(membership.role);

    if (!canArchive) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to archive this project",
      });
    }

    project.status = "archived";
    await project.save();

    return res.status(200).json({
      success: true,
      message: "Project archived successfully",
    });
  } catch (error) {
    console.error("Archive project error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to archive project",
    });
  }
};
