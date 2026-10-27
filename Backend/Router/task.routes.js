
const router = require("express").Router();

const c = require("../Controller/Tasks.Controller");
const { protect } = require("../Middleware/AuthMiddleware");

// Create task
router.post(
  "/organizations/:organizationId/projects/:projectId/tasks",
  protect,
  c.createTask
);

// List project tasks
router.get(
  "/organizations/:organizationId/projects/:projectId/tasks",
  protect,
  c.listProjectTasks
);

// Get task details
router.get(
  "/organizations/:organizationId/tasks/:taskId",
  protect,
  c.getTask
);

// Update task
router.patch(
  "/organizations/:organizationId/tasks/:taskId",
  protect,
  c.updateTask
);

// Delete task
router.delete(
  "/organizations/:organizationId/tasks/:taskId",
  protect,
  c.deleteTask
);

// Update task assignees
router.patch(
  "/organizations/:organizationId/tasks/:taskId/assignees",
  protect,
  c.updateAssignees
);

module.exports = router;
