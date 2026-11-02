
const router = require("express").Router();

const c = require("../Controller/Organizations.Controller");
const { protect } = require("../Middleware/AuthMiddleware");

// Create an organization
router.post("/", protect, c.createOrganization);

// Get my organizations
router.get("/", protect, c.getMyOrganizations);

// Get organization details
router.get("/:organizationId", protect, c.getOrganization);

// Update organization
router.patch("/:organizationId", protect, c.updateOrganization);

// Archive organization
router.delete("/:organizationId", protect, c.archiveOrganization);

module.exports = router;
