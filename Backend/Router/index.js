
const router = require("express").Router();

// User routes
router.use("/users", require("./users.routes").UserRoutes);

// Organization routes
router.use("/organizations", require("./organizations.routes"));

// Organization member routes
router.use("/", require("./organizationMembers.routes"));

// Project routes
router.use("/", require("./projects.routes"));

// Task routes
router.use("/", require("./tasks.routes"));

// Comment routes
router.use("/", require("./comments.routes"));

// Notification routes
router.use("/notifications", require("./notifications.routes"));

// Activity routes
router.use("/", require("./activities.routes"));

// Plan routes
router.use("/plans", require("./plans.routes"));

// Subscription routes
router.use("/", require("./subscriptions.routes"));

// Invitation routes
router.use("/", require("./invitations.routes"));

module.exports = router;
