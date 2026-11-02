const mongoose = require("mongoose");
const activitySchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    task: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
    actor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    action: { type: String, required: true, trim: true, maxlength: 120 },
    entityType: {
      type: String,
      enum: [
        "organization",
        "project",
        "task",
        "comment",
        "member",
        "invitation",
        "subscription",
      ],
      required: true,
    },
    entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
    summary: { type: String, trim: true, maxlength: 1000 },
    // Keep only safe, non-secret change metadata.
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true, versionKey: false },
);
activitySchema.index({ organization: 1, createdAt: -1 });
activitySchema.index({ entityType: 1, entityId: 1, createdAt: -1 });
module.exports = mongoose.model("Activity", activitySchema);
