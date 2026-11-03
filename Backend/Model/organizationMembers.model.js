
const mongoose = require("mongoose");

const organizationMemberSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    role: {
      type: String,
      enum: ["owner", "admin", "manager", "member"],
      default: "member",
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
      required: true,
    },

    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    joinedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// One membership record per user per organization
organizationMemberSchema.index(
  { organization: 1, user: 1 },
  { unique: true }
);

// Useful for listing members by organization and status
organizationMemberSchema.index({
  organization: 1,
  status: 1,
  createdAt: -1,
});

const OrganizationMember = mongoose.model(
  "OrganizationMember",
  organizationMemberSchema
);

module.exports = OrganizationMember;
