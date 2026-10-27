const mongoose = require("mongoose");
const organizationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, required: true, lowercase: true, trim: true },
    logoUrl: { type: String, trim: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "suspended", "deleted"],
      default: "active",
    },
    timezone: { type: String, default: "UTC" },
  },
  { timestamps: true, versionKey: false },
);
organizationSchema.index({ slug: 1 }, { unique: true });
module.exports = mongoose.model("Organization", organizationSchema);
