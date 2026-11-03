
const mongoose = require("mongoose");

const Subscription = require("../Model/subscriptions.model");
const Plan = require("../Model/plans.model");
const Organization = require("../Model/organizations.model");
const OrganizationMember = require("../Model/organizationMembers.model");

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

const isValidId = (id) => mongoose.isValidObjectId(id);

const getOrganization = (organizationId) => {
  return Organization.findOne({
    _id: organizationId,
    status: "active",
  });
};

const getMembership = (organizationId, userId) => {
  return OrganizationMember.findOne({
    organization: organizationId,
    user: userId,
    status: "active",
  });
};

const canManageSubscription = (membership) => {
  return ["owner", "admin"].includes(membership.role);
};

// --------------------------------------------------
// GET ORGANIZATION SUBSCRIPTION
// GET /organizations/:organizationId/subscription
// --------------------------------------------------

exports.getSubscription = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const userId = req.user._id;

    if (!isValidId(organizationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid organization ID",
      });
    }

    const organization = await getOrganization(organizationId);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found or inactive",
      });
    }

    const membership = await getMembership(
      organizationId,
      userId
    );

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: "Organization membership required",
      });
    }

    const subscription = await Subscription.findOne({
      organization: organizationId,
    }).populate("plan");

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "No subscription found for this organization",
      });
    }

    return res.status(200).json({
      success: true,
      subscription,
    });
  } catch (error) {
    console.error("Get subscription:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch subscription",
    });
  }
};

// --------------------------------------------------
// CREATE CHECKOUT
// POST /organizations/:organizationId/subscription/checkout
//
// Body:
// {
//   "planId": "PLAN_ID"
// }
//
// Payment provider integration is required.
// --------------------------------------------------

exports.createCheckout = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const { planId } = req.body;
    const userId = req.user._id;

    if (!isValidId(organizationId) || !isValidId(planId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid organization ID or plan ID",
      });
    }

    const organization = await getOrganization(organizationId);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found or inactive",
      });
    }

    const membership = await getMembership(
      organizationId,
      userId
    );

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: "Organization membership required",
      });
    }

    if (!canManageSubscription(membership)) {
      return res.status(403).json({
        success: false,
        message: "Only organization owners or admins can manage billing",
      });
    }

    const plan = await Plan.findOne({
      _id: planId,
      isActive: true,
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Active plan not found",
      });
    }

    const existingSubscription = await Subscription.findOne({
      organization: organizationId,
    });

    // Do not create duplicate checkout sessions or
    // replace an existing subscription without billing logic.
    if (
      existingSubscription &&
      ["active", "trialing", "past_due", "incomplete"].includes(
        existingSubscription.status
      )
    ) {
      return res.status(409).json({
        success: false,
        message:
          "An existing subscription requires billing management or a plan-change flow",
        subscriptionStatus: existingSubscription.status,
      });
    }

    // Checkout cannot be completed until a payment provider
    // adapter is implemented and configured.
    return res.status(501).json({
      success: false,
      message: "Payment checkout integration is not configured",
      plan: {
        id: plan._id,
        name: plan.name,
        code: plan.code,
        price: plan.price,
        currency: plan.currency,
        interval: plan.interval,
      },
      nextStep:
        "Integrate Stripe Checkout or Razorpay Subscription APIs",
    });
  } catch (error) {
    console.error("Create checkout:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to prepare checkout",
    });
  }
};

// --------------------------------------------------
// CANCEL SUBSCRIPTION
// POST /organizations/:organizationId/subscription/cancel
//
// Body:
// {
//   "immediate": true
// }
// --------------------------------------------------

exports.cancelSubscription = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const userId = req.user._id;

    const immediate = req.body.immediate ?? true;

    if (typeof immediate !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "immediate must be a boolean",
      });
    }

    if (!isValidId(organizationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid organization ID",
      });
    }

    const organization = await getOrganization(organizationId);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found or inactive",
      });
    }

    const membership = await getMembership(
      organizationId,
      userId
    );

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: "Organization membership required",
      });
    }

    if (!canManageSubscription(membership)) {
      return res.status(403).json({
        success: false,
        message: "Only organization owners or admins can cancel subscriptions",
      });
    }

    const subscription = await Subscription.findOne({
      organization: organizationId,
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }

    if (
      ["canceled", "expired"].includes(subscription.status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Subscription is already canceled or expired",
      });
    }

    // External provider cancellation must happen through
    // the provider API. Do not fake cancellation locally.
    if (
      ["stripe", "razorpay"].includes(
        subscription.billingProvider
      )
    ) {
      return res.status(501).json({
        success: false,
        message:
          "Provider cancellation is not integrated. Subscription was not changed.",
        billingProvider: subscription.billingProvider,
        nextStep:
          "Cancel through the payment provider API and synchronize the resulting status through verified webhooks.",
      });
    }

    // Manual billing only.
    // This does not contact any payment provider.
    if (immediate) {
      subscription.status = "canceled";
      subscription.canceledAt = new Date();
      subscription.cancelAtPeriodEnd = false;
    } else {
      // Schedule cancellation only if a valid end date exists.
      if (
        !subscription.currentPeriodEnd ||
        subscription.currentPeriodEnd <= new Date()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Cannot schedule cancellation without a future billing period end",
        });
      }

      subscription.cancelAtPeriodEnd = true;
    }

    await subscription.save();

    return res.status(200).json({
      success: true,
      message: immediate
        ? "Manual subscription canceled"
        : "Manual subscription cancellation scheduled",
      subscription,
    });
  } catch (error) {
    console.error("Cancel subscription:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to cancel subscription",
    });
  }
};
