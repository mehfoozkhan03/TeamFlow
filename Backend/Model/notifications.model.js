const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      index: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    actor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: {
      type: String,
      enum: [
        "task_assigned",
        "task_updated",
        "comment_added",
        "project_invitation",
        "invitation_accepted",
        "due_date_reminder",
        "system",
      ],
      required: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    message: { type: String, trim: true, maxlength: 2000 },
    resourceType: {
      type: String,
      enum: ["task", "project", "invitation", "organization", "other"],
    },
    resourceId: mongoose.Schema.Types.ObjectId,
    readAt: Date,
  },
  { timestamps: true, versionKey: false },
);
notificationSchema.index({ recipient: 1, readAt: 1, createdAt: -1 });
module.exports = mongoose.model("Notification", notificationSchema);
