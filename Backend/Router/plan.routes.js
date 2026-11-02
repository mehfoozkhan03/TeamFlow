
const router = require("express").Router();

const c = require("../Controller/Plans.Controller");
const { protect } = require("../Middleware/AuthMiddleware");

// Public routes: List and view active plans
router.get("/", c.listActivePlans);
router.get("/:planId", c.getActivePlan);

// Protected routes: Platform-admin authorization required
router.post("/", protect, c.createPlan);
router.patch("/:planId", protect, c.updatePlan);
router.delete("/:planId", protect, c.deletePlan);

module.exports = router;
