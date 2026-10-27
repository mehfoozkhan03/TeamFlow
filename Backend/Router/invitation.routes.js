
const router = require("express").Router();

const c = require("../Controller/Invitations.Controller");
const { protect } = require("../Middleware/AuthMiddleware");

// Create an organization invitation
router.post(
  "/organizations/:organizationId/invitations",
  protect,
  c.createInvitation
);

// Get organization invitations
router.get(
  "/organizations/:organizationId/invitations",
  protect,
  c.listInvitations
);

// Revoke an invitation
router.delete(
  "/organizations/:organizationId/invitations/:invitationId",
  protect,
  c.revokeInvitation
);

// Accept an invitation
router.post(
  "/accept",
  protect,
  c.acceptInvitation
);

module.exports = router;
