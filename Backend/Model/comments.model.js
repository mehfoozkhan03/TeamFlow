const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
      index: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    body: { type: String, required: true, trim: true, maxlength: 10000 },
    editedAt: Date,
    deletedAt: Date,
  },
  { timestamps: true, versionKey: false },
);
commentSchema.index({ task: 1, createdAt: 1 });
module.exports = mongoose.model("Comment", commentSchema);
