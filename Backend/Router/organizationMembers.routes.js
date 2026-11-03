
const express = require("express");
const router = express.Router();

const {
  listMembers,
  getMember,
  updateMemberRole,
  removeMember,
  leaveOrganization,
} = require("../Controller/organizationMembers.controller");

const { protect } = require("../Middleware/AuthMiddleware");

// List organization members
router.get(
  "/organizations/:organizationId/members",
  protect,
  listMembers
);

// Get a specific member
router.get(
  "/organizations/:organizationId/members/:memberId",
  protect,
  getMember
);

// Update member role
router.patch(
  "/organizations/:organizationId/members/:memberId/role",
  protect,
  updateMemberRole
);

// Remove a member
router.delete(
  "/organizations/:organizationId/members/:memberId",
  protect,
  removeMember
);

// Leave organization
router.delete(
  "/organizations/:organizationId/leave",
  protect,
  leaveOrganization
);

module.exports = router;
