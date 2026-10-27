const mongoose = require("mongoose");
const subscriptionSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      unique: true,
    },
    plan: { type: mongoose.Schema.Types.ObjectId, ref: "Plan", required: true },
    status: {
      type: String,
      enum: [
        "trialing",
        "active",
        "past_due",
        "canceled",
        "incomplete",
        "expired",
      ],
      default: "trialing",
    },
    billingProvider: {
      type: String,
      enum: ["manual", "stripe", "razorpay"],
      default: "manual",
    },
    providerCustomerId: String,
    providerSubscriptionId: String,
    currentPeriodStart: Date,
    currentPeriodEnd: Date,
    trialEndsAt: Date,
    cancelAtPeriodEnd: { type: Boolean, default: false },
    canceledAt: Date,
  },
  { timestamps: true, versionKey: false },
);
subscriptionSchema.index({ status: 1, currentPeriodEnd: 1 });
module.exports = mongoose.model("Subscription", subscriptionSchema);
