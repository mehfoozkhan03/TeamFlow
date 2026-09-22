const mongoose = require("mongoose");




const UserSchema = mongoose.Schema(
  {
    name: String,
    dob: String,
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    email: {
      type: String,
      required: true,
      //sparse: true, // Allows multiple documents to have no email field
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: Number,
    password: {
      type: String,
      // require: true,
      trim: true,
    },
  },
  {
    versionKey: false, // Completely disables versioning
  },
);

const UserModel = mongoose.model("User", UserSchema);

module.exports = { UserModel };
