
const router = require("express").Router();

const c = require("../Controller/Notifications.Controller");
const { protect } = require("../Middleware/AuthMiddleware");

// Get my notifications
router.get("/", protect, c.listMyNotifications);

// Mark all notifications as read
router.patch("/read-all", protect, c.markAllRead);

// Mark a single notification as read
router.patch("/:notificationId/read", protect, c.markRead);

// Delete a notification
router.delete("/:notificationId", protect, c.deleteNotification);

module.exports = router;
