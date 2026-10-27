const mongoose = require("mongoose");
const projectSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true, maxlength: 180 },
    key: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      maxlength: 12,
    },
    description: { type: String, trim: true, maxlength: 10000 },
    status: {
      type: String,
      enum: ["planning", "active", "on_hold", "completed", "archived"],
      default: "planning",
    },
    visibility: {
      type: String,
      enum: ["organization", "private"],
      default: "organization",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    startDate: Date,
    dueDate: Date,
    color: { type: String, default: "#8B5CF6" },
  },
  { timestamps: true, versionKey: false },
);
projectSchema.index({ organization: 1, key: 1 }, { unique: true });
projectSchema.index({ organization: 1, status: 1 });
module.exports = mongoose.model("Project", projectSchema);
