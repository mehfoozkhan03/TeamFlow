const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 300 },
    description: { type: String, trim: true, maxlength: 20000 },
    status: {
      type: String,
      enum: ["todo", "in_progress", "in_review", "blocked", "done"],
      default: "todo",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dueDate: Date,
    startDate: Date,
    labels: [{ type: String, trim: true, maxlength: 40 }],
    order: { type: Number, default: 0 },
    completedAt: Date,
    parentTask: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      default: null,
    },
  },
  { timestamps: true, versionKey: false },
);
taskSchema.index({ project: 1, status: 1, order: 1 });
taskSchema.index({ organization: 1, assignees: 1, dueDate: 1 });
module.exports = mongoose.model("Task", taskSchema);
