
const mongoose = require("mongoose");

const Task = require("../Model/tasks.model");
const Project = require("../Model/projects.model");
const Organization = require("../Model/organizations.model");
const OrganizationMember = require("../Model/organizationMembers.model");
const Activity = require("../Model/activities.model");
const Notification = require("../Model/notifications.model");

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

const isValidId = (id) => mongoose.isValidObjectId(id);

const taskStatuses = [
  "todo",
  "in_progress",
  "in_review",
  "blocked",
  "done",
];

const taskPriorities = ["low", "medium", "high", "urgent"];

const getOrganization = (organizationId) =>
  Organization.findOne({
    _id: organizationId,
    status: "active",
  });

const getMembership = (organizationId, userId) =>
  OrganizationMember.findOne({
    organization: organizationId,
    user: userId,
    status: "active",
  });

const canAccessProject = (project, userId) => {
  if (project.visibility === "organization") return true;

  return (
    project.owner.toString() === userId.toString() ||
    project.members.some(
      (member) => member.toString() === userId.toString()
    )
  );
};

const canManageProject = (project, membership, userId) => {
  return (
    project.owner.toString() === userId.toString() ||
    ["owner", "admin", "manager"].includes(membership.role)
  );
};

const validDate = (value) => {
  if (value === null || value === "") return true;
  return !Number.isNaN(new Date(value).getTime());
};

const normalizeIds = (ids) => [
  ...new Set(ids.map((id) => id.toString())),
];

const validateAssignees = async (organizationId, assignees) => {
  if (!Array.isArray(assignees)) {
    return {
      valid: false,
      message: "Assignees must be an array",
    };
  }

  if (!assignees.every(isValidId)) {
    return {
      valid: false,
      message: "Invalid assignee ID",
    };
  }

  const uniqueIds = normalizeIds(assignees);

  if (!uniqueIds.length) {
    return {
      valid: true,
      ids: [],
    };
  }

  const members = await OrganizationMember.find({
    organization: organizationId,
    user: { $in: uniqueIds },
    status: "active",
  }).select("user");

  if (members.length !== uniqueIds.length) {
    return {
      valid: false,
      message: "All assignees must be active organization members",
    };
  }

  return {
    valid: true,
    ids: uniqueIds,
  };
};

// Record activity without failing the primary operation.
// Production systems should use a durable event/outbox strategy.
const recordActivity = async ({
  organization,
  project,
  task,
  actor,
  action,
  summary,
  metadata = {},
}) => {
  try {
    await Activity.create({
      organization,
      project,
      task,
      actor,
      action,
      entityType: "task",
      entityId: task,
      summary,
      metadata,
    });
  } catch (error) {
    console.error("Task activity logging failed:", error);
  }
};

// --------------------------------------------------
// CREATE TASK
// POST /organizations/:organizationId/projects/:projectId/tasks
// --------------------------------------------------

exports.createTask = async (req, res) => {
  try {
    const { organizationId, projectId } = req.params;
    const userId = req.user._id;

    const {
      title,
      description,
      status,
      priority,
      assignees,
      dueDate,
      startDate,
      labels,
      order,
      parentTask,
    } = req.body;

    if (!isValidId(organizationId) || !isValidId(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid organization or project ID",
      });
    }

    const organization = await getOrganization(organizationId);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found or inactive",
      });
    }

    const membership = await getMembership(
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

    if (!canAccessProject(project, userId)) {
      return res.status(403).json({
        success: false,
        message: "You cannot access this project",
      });
    }

    if (
      typeof title !== "string" ||
      !title.trim() ||
      title.trim().length > 300
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid task title is required",
      });
    }

    if (
      description !== undefined &&
      (typeof description !== "string" ||
        description.length > 20000)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid task description",
      });
    }

    if (
      status !== undefined &&
      !taskStatuses.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid task status",
      });
    }

    if (
      priority !== undefined &&
      !taskPriorities.includes(priority)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid task priority",
      });
    }

    if (
      (dueDate !== undefined && !validDate(dueDate)) ||
      (startDate !== undefined && !validDate(startDate))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid task date",
      });
    }

    const parsedStartDate = startDate
      ? new Date(startDate)
      : undefined;

    const parsedDueDate = dueDate
      ? new Date(dueDate)
      : undefined;

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

    if (
      order !== undefined &&
      (!Number.isFinite(order) || order < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid task order",
      });
    }

    if (
      labels !== undefined &&
      (!Array.isArray(labels) ||
        !labels.every(
          (label) =>
            typeof label === "string" && label.trim().length <= 40
        ))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid task labels",
      });
    }

    let validatedAssignees = [];

    if (assignees !== undefined) {
      const result = await validateAssignees(
        organizationId,
        assignees
      );

      if (!result.valid) {
        return res.status(400).json({
          success: false,
          message: result.message,
        });
      }

      validatedAssignees = result.ids;
    }

    // Validate parent task belongs to the same project.
    let parentTaskId = null;

    if (parentTask) {
      if (!isValidId(parentTask)) {
        return res.status(400).json({
          success: false,
          message: "Invalid parent task ID",
        });
      }

      const parent = await Task.findOne({
        _id: parentTask,
        organization: organizationId,
        project: projectId,
      }).select("_id");

      if (!parent) {
        return res.status(400).json({
          success: false,
          message: "Parent task must belong to this project",
        });
      }

      parentTaskId = parent._id;
    }

    const taskStatus = status || "todo";

    const task = await Task.create({
      organization: organizationId,
      project: projectId,
      title: title.trim(),
      description,
      status: taskStatus,
      priority: priority || "medium",
      assignees: validatedAssignees,
      createdBy: userId,
      dueDate: parsedDueDate,
      startDate: parsedStartDate,
      labels: labels?.map((label) => label.trim()),
      order: order ?? 0,
      parentTask: parentTaskId,
      completedAt:
        taskStatus === "done" ? new Date() : undefined,
    });

    await recordActivity({
      organization: organizationId,
      project: projectId,
      task: task._id,
      actor: userId,
      action: "task_created",
      summary: `Created task: ${task.title}`,
    });

    // Notification delivery is best-effort here.
    // Use a queue/outbox for reliable delivery.
    const recipientIds = validatedAssignees.filter(
      (id) => id.toString() !== userId.toString()
    );

    if (recipientIds.length) {
      try {
        await Notification.insertMany(
          recipientIds.map((recipient) => ({
            organization: organizationId,
            recipient,
            actor: userId,
            type: "task_assigned",
            title: "Task assigned",
            message: `You were assigned to ${task.title}`,
            resourceType: "task",
            resourceId: task._id,
          }))
        );
      } catch (notificationError) {
        console.error(
          "Task notification failed:",
          notificationError
        );
      }
    }

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("Create task:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create task",
    });
  }
};

// --------------------------------------------------
// LIST PROJECT TASKS
// GET /organizations/:organizationId/projects/:projectId/tasks
// --------------------------------------------------

exports.listProjectTasks = async (req, res) => {
  try {
    const { organizationId, projectId } = req.params;
    const userId = req.user._id;

    if (!isValidId(organizationId) || !isValidId(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID",
      });
    }

    const organization = await getOrganization(organizationId);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found or inactive",
      });
    }

    const membership = await getMembership(
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

    if (!canAccessProject(project, userId)) {
      return res.status(403).json({
        success: false,
        message: "You cannot access this project",
      });
    }

    const filter = {
      organization: organizationId,
      project: projectId,
    };

    if (req.query.status) {
      if (!taskStatuses.includes(req.query.status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status filter",
        });
      }

      filter.status = req.query.status;
    }

    if (req.query.priority) {
      if (!taskPriorities.includes(req.query.priority)) {
        return res.status(400).json({
          success: false,
          message: "Invalid priority filter",
        });
      }

      filter.priority = req.query.priority;
    }

    if (req.query.assignee) {
      if (!isValidId(req.query.assignee)) {
        return res.status(400).json({
          success: false,
          message: "Invalid assignee ID",
        });
      }

      filter.assignees = req.query.assignee;
    }

    const page = Math.max(
      1,
      parseInt(req.query.page, 10) || 1
    );

    const limit = Math.min(
      100,
      Math.max(1, parseInt(req.query.limit, 10) || 20)
    );

    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .populate("createdBy", "name email")
        .populate("assignees", "name email")
        .sort({ order: 1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      Task.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      tasks,
    });
  } catch (error) {
    console.error("List project tasks:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
    });
  }
};

// --------------------------------------------------
// GET TASK
// GET /organizations/:organizationId/tasks/:taskId
// --------------------------------------------------

exports.getTask = async (req, res) => {
  try {
    const { organizationId, taskId } = req.params;
    const userId = req.user._id;

    if (!isValidId(organizationId) || !isValidId(taskId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID",
      });
    }

    const organization = await getOrganization(organizationId);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found or inactive",
      });
    }

    const membership = await getMembership(
      organizationId,
      userId
    );

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: "Organization membership required",
      });
    }

    const task = await Task.findOne({
      _id: taskId,
      organization: organizationId,
    })
      .populate("createdBy", "name email")
      .populate("assignees", "name email")
      .populate("project", "name key visibility owner members");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (!canAccessProject(task.project, userId)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    return res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    console.error("Get task:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch task",
    });
  }
};

// --------------------------------------------------
// UPDATE TASK
// PATCH /organizations/:organizationId/tasks/:taskId
// --------------------------------------------------

exports.updateTask = async (req, res) => {
  try {
    const { organizationId, taskId } = req.params;
    const userId = req.user._id;

    if (!isValidId(organizationId) || !isValidId(taskId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID",
      });
    }

    const organization = await getOrganization(organizationId);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found or inactive",
      });
    }

    const membership = await getMembership(
      organizationId,
      userId
    );

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: "Organization membership required",
      });
    }

    const task = await Task.findOne({
      _id: taskId,
      organization: organizationId,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const project = await Project.findOne({
      _id: task.project,
      organization: organizationId,
      status: { $ne: "archived" },
    });

    if (!project || !canAccessProject(project, userId)) {
      return res.status(403).json({
        success: false,
        message: "Project access denied",
      });
    }

    // Task owner, assignee, or project manager can edit.
    const isAssignee = task.assignees.some(
      (id) => id.toString() === userId.toString()
    );

    const canEdit =
      task.createdBy.toString() === userId.toString() ||
      isAssignee ||
      canManageProject(project, membership, userId);

    if (!canEdit) {
      return res.status(403).json({
        success: false,
        message: "You cannot update this task",
      });
    }

    const allowed = [
      "title",
      "description",
      "status",
      "priority",
      "dueDate",
      "startDate",
      "labels",
      "order",
      "parentTask",
    ];

    const updates = {};

    for (const field of allowed) {
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

    if (updates.title !== undefined) {
      if (
        typeof updates.title !== "string" ||
        !updates.title.trim() ||
        updates.title.trim().length > 300
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid task title",
        });
      }

      updates.title = updates.title.trim();
    }

    if (updates.description !== undefined) {
      if (
        typeof updates.description !== "string" ||
        updates.description.length > 20000
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid task description",
        });
      }

      updates.description = updates.description.trim();
    }

    if (
      updates.status !== undefined &&
      !taskStatuses.includes(updates.status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid task status",
      });
    }

    if (
      updates.priority !== undefined &&
      !taskPriorities.includes(updates.priority)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid task priority",
      });
    }

    if (
      (updates.dueDate !== undefined && !validDate(updates.dueDate)) ||
      (updates.startDate !== undefined && !validDate(updates.startDate))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid task date",
      });
    }

    const startDate =
      updates.startDate !== undefined
        ? updates.startDate
          ? new Date(updates.startDate)
          : null
        : task.startDate;

    const dueDate =
      updates.dueDate !== undefined
        ? updates.dueDate
          ? new Date(updates.dueDate)
          : null
        : task.dueDate;

    if (startDate && dueDate && dueDate < startDate) {
      return res.status(400).json({
        success: false,
        message: "Due date cannot be before start date",
      });
    }

    if (updates.startDate !== undefined) {
      updates.startDate = startDate;
    }

    if (updates.dueDate !== undefined) {
      updates.dueDate = dueDate;
    }

    if (updates.labels !== undefined) {
      if (
        !Array.isArray(updates.labels) ||
        !updates.labels.every(
          (label) =>
            typeof label === "string" && label.trim().length <= 40
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid task labels",
        });
      }

      updates.labels = updates.labels.map((label) => label.trim());
    }

    if (
      updates.order !== undefined &&
      (!Number.isFinite(updates.order) || updates.order < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid task order",
      });
    }

    if (updates.parentTask !== undefined) {
      if (updates.parentTask === null) {
        updates.parentTask = null;
      } else {
        if (!isValidId(updates.parentTask)) {
          return res.status(400).json({
            success: false,
            message: "Invalid parent task",
          });
        }

        if (updates.parentTask.toString() === taskId.toString()) {
          return res.status(400).json({
            success: false,
            message: "Task cannot be its own parent",
          });
        }

        const parent = await Task.findOne({
          _id: updates.parentTask,
          organization: organizationId,
          project: task.project,
        }).select("_id");

        if (!parent) {
          return res.status(400).json({
            success: false,
            message: "Parent task must belong to the same project",
          });
        }

        updates.parentTask = parent._id;
      }
    }

    const previousStatus = task.status;

    Object.assign(task, updates);

    if (task.status === "done" && previousStatus !== "done") {
      task.completedAt = new Date();
    } else if (task.status !== "done") {
      task.completedAt = undefined;
    }

    await task.save();

    if (previousStatus !== task.status) {
      await recordActivity({
        organization: organizationId,
        project: task.project,
        task: task._id,
        actor: userId,
        action: "task_status_updated",
        summary: `Task status changed to ${task.status}`,
        metadata: {
          previousStatus,
          newStatus: task.status,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    console.error("Update task:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update task",
    });
  }
};

// --------------------------------------------------
// DELETE TASK
// DELETE /organizations/:organizationId/tasks/:taskId
// --------------------------------------------------

exports.deleteTask = async (req, res) => {
  try {
    const { organizationId, taskId } = req.params;
    const userId = req.user._id;

    if (!isValidId(organizationId) || !isValidId(taskId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID",
      });
    }

    const organization = await getOrganization(organizationId);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found or inactive",
      });
    }

    const membership = await getMembership(
      organizationId,
      userId
    );

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: "Organization membership required",
      });
    }

    const task = await Task.findOne({
      _id: taskId,
      organization: organizationId,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const project = await Project.findOne({
      _id: task.project,
      organization: organizationId,
    });

    if (!project || !canAccessProject(project, userId)) {
      return res.status(403).json({
        success: false,
        message: "Project access denied",
      });
    }

    if (!canManageProject(project, membership, userId)) {
      return res.status(403).json({
        success: false,
        message: "Only project owners or managers can delete tasks",
      });
    }

    // Permanent deletion. This may affect comments and activity history.
    await Task.deleteOne({ _id: task._id });

    await recordActivity({
      organization: organizationId,
      project: project._id,
      task: task._id,
      actor: userId,
      action: "task_deleted",
      summary: `Deleted task: ${task.title}`,
    });

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete task",
    });
  }
};

// --------------------------------------------------
// UPDATE ASSIGNEES
// PATCH /organizations/:organizationId/tasks/:taskId/assignees
//
// Body:
// {
//   "assignees": ["USER_ID_1", "USER_ID_2"]
// }
// --------------------------------------------------

exports.updateAssignees = async (req, res) => {
  try {
    const { organizationId, taskId } = req.params;
    const userId = req.user._id;
    const { assignees } = req.body;

    if (!isValidId(organizationId) || !isValidId(taskId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID",
      });
    }

    const organization = await getOrganization(organizationId);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found or inactive",
      });
    }

    const membership = await getMembership(
      organizationId,
      userId
    );

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: "Organization membership required",
      });
    }

    const task = await Task.findOne({
      _id: taskId,
      organization: organizationId,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const project = await Project.findOne({
      _id: task.project,
      organization: organizationId,
      status: { $ne: "archived" },
    });

    if (!project || !canAccessProject(project, userId)) {
      return res.status(403).json({
        success: false,
        message: "Project access denied",
      });
    }

    if (!canManageProject(project, membership, userId)) {
      return res.status(403).json({
        success: false,
        message: "Only project owners or managers can assign tasks",
      });
    }

    const result = await validateAssignees(
      organizationId,
      assignees
    );

    if (!result.valid) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    const previousAssignees = task.assignees.map(String);

    task.assignees = result.ids;
    await task.save();

    const addedAssignees = result.ids.filter(
      (id) => !previousAssignees.includes(id)
    );

    await recordActivity({
      organization: organizationId,
      project: project._id,
      task: task._id,
      actor: userId,
      action: "task_assignees_updated",
      summary: "Task assignees updated",
      metadata: {
        previousAssignees,
        newAssignees: result.ids,
      },
    });

    if (addedAssignees.length) {
      try {
        await Notification.insertMany(
          addedAssignees
            .filter((id) => id !== userId.toString())
            .map((recipient) => ({
              organization: organizationId,
              recipient,
              actor: userId,
              type: "task_assigned",
              title: "Task assigned",
              message: `You were assigned to ${task.title}`,
              resourceType: "task",
              resourceId: task._id,
            }))
        );
      } catch (notificationError) {
        console.error(
          "Assignment notification failed:",
          notificationError
        );
      }
    }

    return res.status(200).json({
      success: true,
      message: "Task assignees updated",
      task,
    });
  } catch (error) {
    console.error("Update assignees:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update task assignees",
    });
  }
};
