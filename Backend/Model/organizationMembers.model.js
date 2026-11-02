const mongoose = require("mongoose");
const organizationMemberSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: {
      type: String,
      enum: ["owner", "admin", "manager", "member"],
      default: "member",
    },
    status: { type: String, enum: ["active", "suspended"], default: "active" },
    joinedAt: { type: Date, default: Date.now },
    invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true, versionKey: false },
);
organizationMemberSchema.index({ organization: 1, user: 1 }, { unique: true });
organizationMemberSchema.index({ user: 1, status: 1 });
module.exports = mongoose.model("OrganizationMember", organizationMemberSchema);
