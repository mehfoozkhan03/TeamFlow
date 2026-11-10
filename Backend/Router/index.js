
const router = require("express").Router();
<<<<<<< HEAD
=======

>>>>>>> 0b3ef3d0df5a464195e662fe9c458487785e5f7d

// Users
router.use("/users", require("./User.routes").UserRoutes);

// Organizations
router.use("/organizations", require("./organization.routes"));

// Organization members
router.use("/", require("./organizationMembers.routes"));

// Projects
router.use("/", require("./project.routes"));

// Tasks
router.use("/", require("./task.routes"));

// Comments
router.use("/", require("./comment.routes"));

// Activities
router.use("/", require("./activity.routes"));

// Notifications
router.use("/notifications", require("./notification.routes"));

// Plans
router.use("/plans", require("./plan.routes"));

// Subscriptions
router.use("/", require("./subscription.routes"));

// Invitations
router.use("/", require("./invitation.routes"));

router.use("/chatbot", require("./chatbotRoutes"));
console.log("Chatbot routes registered");



module.exports = router;
