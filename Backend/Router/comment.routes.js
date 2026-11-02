
const router = require("express").Router();

const c = require("../Controller/Comments.Controller");
const { protect } = require("../Middleware/AuthMiddleware");

// Create a comment
router.post(
  "/organizations/:organizationId/tasks/:taskId/comments",
  protect,
  c.createComment
);

// Get task comments
router.get(
  "/organizations/:organizationId/tasks/:taskId/comments",
  protect,
  c.listComments
);

// Update a comment
router.patch(
  "/organizations/:organizationId/comments/:commentId",
  protect,
  c.updateComment
);

// Delete a comment
router.delete(
  "/organizations/:organizationId/comments/:commentId",
  protect,
  c.deleteComment
);

module.exports = router;
