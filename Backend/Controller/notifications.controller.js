
const mongoose = require("mongoose");

const Notification = require("../Model/notifications.model");

// GET NOTIFICATIONS
// GET /
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login.",
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
      recipient: userId,
    };

    // Optional filter: unread / read / all
    if (req.query.read === "false") {
      filter.readAt = null;
    } else if (req.query.read === "true") {
      filter.readAt = { $ne: null };
    }

    const [notifications, total, unreadCount] =
      await Promise.all([
        Notification.find(filter)
          .populate("actor", "name email")
          .sort({ createdAt: -1, _id: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),

        Notification.countDocuments(filter),

        Notification.countDocuments({
          recipient: userId,
          readAt: null,
        }),
      ]);

    return res.status(200).json({
      success: true,
      message: "Notifications fetched successfully.",
      data: notifications,
      unreadCount,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get notifications error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications.",
    });
  }
};

// MARK ALL NOTIFICATIONS AS READ
// PATCH /read-all
exports.markAllNotificationsRead = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login.",
      });
    }

    const result = await Notification.updateMany(
      {
        recipient: userId,
        readAt: null,
      },
      {
        $set: {
          readAt: new Date(),
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read.",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Mark all notifications read error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to mark notifications as read.",
    });
  }
};

// MARK ONE NOTIFICATION AS READ
// PATCH /:notificationId/read
exports.markNotificationRead = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { notificationId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login.",
      });
    }

    if (!mongoose.isValidObjectId(notificationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID.",
      });
    }

    const notification = await Notification.findOneAndUpdate(
      {
        _id: notificationId,
        recipient: userId,
      },
      {
        $set: {
          readAt: new Date(),
        },
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("actor", "name email")
      .lean();

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification marked as read.",
      data: notification,
    });
  } catch (error) {
    console.error("Mark notification read error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to mark notification as read.",
    });
  }
};

// DELETE ONE NOTIFICATION
// DELETE /:notificationId
exports.deleteNotification = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { notificationId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login.",
      });
    }

    if (!mongoose.isValidObjectId(notificationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID.",
      });
    }

    // Only the recipient can delete their notification
    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      recipient: userId,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully.",
    });
  } catch (error) {
    console.error("Delete notification error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete notification.",
    });
  }
};
