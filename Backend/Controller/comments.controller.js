
const mongoose = require("mongoose");

const Comment = require("../Model/comments.model");
const Task = require("../Model/tasks.model");
const OrganizationMember = require("../Model/organizationMembers.model");
const Activity = require("../Model/activities.model");

// Check active organization membership
const checkMembership = async (organizationId, userId) => {
  return OrganizationMember.findOne({
    organization: organizationId,
    user: userId,
    status: "active",
  });
};

// Verify task belongs to organization
const checkTask = async (taskId, organizationId) => {
  return Task.findOne({
    _id: taskId,
    organization: organizationId,
  }).select("_id project organization");
};

// CREATE COMMENT
// POST /organizations/:organizationId/tasks/:taskId/comments
exports.createComment = async (req, res) => {
  try {
    const { organizationId, taskId } = req.params;
    const userId = req.user?._id;
    const { body } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    if (
      !mongoose.isValidObjectId(organizationId) ||
      !mongoose.isValidObjectId(taskId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid organization or task ID.",
      });
    }

    if (typeof body !== "string" || !body.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment body is required.",
      });
    }

    if (body.trim().length > 10000) {
      return res.status(400).json({
        success: false,
        message: "Comment cannot exceed 10000 characters.",
      });
    }

    const membership = await checkMembership(
      organizationId,
      userId
    );

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: "You are not an active organization member.",
      });
    }

    const task = await checkTask(taskId, organizationId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found in this organization.",
      });
    }

    const comment = await Comment.create({
      organization: organizationId,
      task: taskId,
      author: userId,
      body: body.trim(),
    });

    // Record activity
    try {
      await Activity.create({
        organization: organizationId,
        project: task.project,
        task: taskId,
        actor: userId,
        action: "created_comment",
        entityType: "comment",
        entityId: comment._id,
        summary: "Added a comment to a task.",
      });
    } catch (activityError) {
      console.error("Comment activity error:", activityError);
    }

    const populatedComment = await Comment.findById(comment._id)
      .populate("author", "name email")
      .lean();

    return res.status(201).json({
      success: true,
      message: "Comment created successfully.",
      data: populatedComment,
    });
  } catch (error) {
    console.error("Create comment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create comment.",
    });
  }
};

// LIST COMMENTS
// GET /organizations/:organizationId/tasks/:taskId/comments
exports.listComments = async (req, res) => {
  try {
    const { organizationId, taskId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    if (
      !mongoose.isValidObjectId(organizationId) ||
      !mongoose.isValidObjectId(taskId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid organization or task ID.",
      });
    }

    const membership = await checkMembership(
      organizationId,
      userId
    );

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: "You are not an active organization member.",
      });
    }

    const task = await checkTask(taskId, organizationId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found in this organization.",
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
      task: taskId,
      deletedAt: null,
    };

    const [comments, total] = await Promise.all([
      Comment.find(filter)
        .populate("author", "name email")
        .sort({ createdAt: 1, _id: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Comment.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      message: "Comments fetched successfully.",
      data: comments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("List comments error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch comments.",
    });
  }
};

// UPDATE COMMENT
// PATCH /organizations/:organizationId/comments/:commentId
exports.updateComment = async (req, res) => {
  try {
    const { organizationId, commentId } = req.params;
    const userId = req.user?._id;
    const { body } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    if (
      !mongoose.isValidObjectId(organizationId) ||
      !mongoose.isValidObjectId(commentId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid organization or comment ID.",
      });
    }

    if (typeof body !== "string" || !body.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment body is required.",
      });
    }

    if (body.trim().length > 10000) {
      return res.status(400).json({
        success: false,
        message: "Comment cannot exceed 10000 characters.",
      });
    }

    const membership = await checkMembership(
      organizationId,
      userId
    );

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: "You are not an active organization member.",
      });
    }

    // Only the original author can edit
    const comment = await Comment.findOneAndUpdate(
      {
        _id: commentId,
        organization: organizationId,
        author: userId,
        deletedAt: null,
      },
      {
        $set: {
          body: body.trim(),
          editedAt: new Date(),
        },
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("author", "name email");

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found or you cannot edit it.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Comment updated successfully.",
      data: comment,
    });
  } catch (error) {
    console.error("Update comment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update comment.",
    });
  }
};

// DELETE COMMENT
// DELETE /organizations/:organizationId/comments/:commentId
exports.deleteComment = async (req, res) => {
  try {
    const { organizationId, commentId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    if (
      !mongoose.isValidObjectId(organizationId) ||
      !mongoose.isValidObjectId(commentId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid organization or comment ID.",
      });
    }

    const membership = await checkMembership(
      organizationId,
      userId
    );

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: "You are not an active organization member.",
      });
    }

    // Only the original author can delete
    const comment = await Comment.findOneAndUpdate(
      {
        _id: commentId,
        organization: organizationId,
        author: userId,
        deletedAt: null,
      },
      {
        $set: {
          deletedAt: new Date(),
        },
      },
      {
        new: true,
      }
    );

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found or you cannot delete it.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully.",
    });
  } catch (error) {
    console.error("Delete comment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete comment.",
    });
  }
};
