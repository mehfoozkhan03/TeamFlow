const router = require("express").Router();

const c = require("../Controller/Activities.Controller");
const { protect } = require("../Middleware/AuthMiddleware");

// Get organization activities
router.get(
  "/organizations/:organizationId/activities",
  protect,
  c.listOrganizationActivities,
);

// Get project activities
router.get(
  "/organizations/:organizationId/projects/:projectId/activities",
  protect,
  c.listProjectActivities,
);

module.exports = router;
