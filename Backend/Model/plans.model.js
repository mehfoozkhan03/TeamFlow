const mongoose = require("mongoose");
const planSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    code: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 }, // smallest currency unit, e.g. paise
    currency: {
      type: String,
      default: "INR",
      uppercase: true,
      minlength: 3,
      maxlength: 3,
    },
    interval: {
      type: String,
      enum: ["month", "year", "lifetime"],
      default: "month",
    },
    limits: {
      members: { type: Number, default: 5, min: 0 }, // -1 can mean unlimited if app enforces it
      projects: { type: Number, default: 10, min: 0 },
      storageMB: { type: Number, default: 1024, min: 0 },
    },
    features: [{ type: String, trim: true }],
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false },
);
module.exports = mongoose.model("Plan", planSchema);
