
const router = require("express").Router();

const c = require("../Controller/OrganizationMembers.Controller");
const { protect } = require("../Middleware/AuthMiddleware");

// List organization members
router.get(
  "/organizations/:organizationId/members",
  protect,
  c.listMembers
);

// Get a specific member
router.get(
  "/organizations/:organizationId/members/:memberId",
  protect,
  c.getMember
);

// Update a member's role
router.patch(
  "/organizations/:organizationId/members/:memberId",
  protect,
  c.updateMemberRole
);

// Remove a member
router.delete(
  "/organizations/:organizationId/members/:memberId",
  protect,
  c.removeMember
);

// Leave an organization
router.post(
  "/organizations/:organizationId/leave",
  protect,
  c.leaveOrganization
);

module.exports = router;
