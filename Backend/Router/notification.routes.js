
const router = require("express").Router();

const c = require("../Controller/notifications.controller");
const { protect } = require("../Middleware/AuthMiddleware");

router.get("/", protect, c.getNotifications);

router.patch(
  "/read-all",
  protect,
  c.markAllNotificationsRead
);

router.patch(
  "/:notificationId/read",
  protect,
  c.markNotificationRead
);

router.delete(
  "/:notificationId",
  protect,
  c.deleteNotification
);

module.exports = router;
