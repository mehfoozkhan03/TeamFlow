
const router = require("express").Router();

const c = require("../Controller/organizations.controller");
const { protect } = require("../Middleware/AuthMiddleware");

// Create organization
router.post("/", protect, c.createOrganization);

// Get my organizations
router.get("/", protect, c.getMyOrganizations);

// Get organization details
router.get("/:organizationId", protect, c.getOrganizationById);

// Update organization
router.patch("/:organizationId", protect, c.updateOrganization);

// Archive organization
router.delete("/:organizationId", protect, c.deleteOrganization);

module.exports = router;
