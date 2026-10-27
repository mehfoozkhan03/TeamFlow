
const router = require("express").Router();

const c = require("../Controller/Projects.Controller");
const { protect } = require("../Middleware/AuthMiddleware");

// Create a project
router.post(
  "/organizations/:organizationId/projects",
  protect,
  c.createProject
);

// List organization projects
router.get(
  "/organizations/:organizationId/projects",
  protect,
  c.listProjects
);

// Get project details
router.get(
  "/organizations/:organizationId/projects/:projectId",
  protect,
  c.getProject
);

// Update project
router.patch(
  "/organizations/:organizationId/projects/:projectId",
  protect,
  c.updateProject
);

// Archive project
router.delete(
  "/organizations/:organizationId/projects/:projectId",
  protect,
  c.archiveProject
);

module.exports = router;
