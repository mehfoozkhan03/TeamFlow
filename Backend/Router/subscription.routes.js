
const router = require("express").Router();

const c = require("../Controller/Subscriptions.Controller");
const { protect } = require("../Middleware/AuthMiddleware");

// Get organization subscription
router.get(
  "/organizations/:organizationId/subscription",
  protect,
  c.getSubscription
);

// Create checkout session
router.post(
  "/organizations/:organizationId/subscription/checkout",
  protect,
  c.createCheckout
);

// Cancel subscription
router.post(
  "/organizations/:organizationId/subscription/cancel",
  protect,
  c.cancelSubscription
);

// Add payment-provider webhook separately
// with raw-body/signature verification.

module.exports = router;
