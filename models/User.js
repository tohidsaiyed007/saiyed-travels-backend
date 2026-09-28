const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      default: "",
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    password: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: [
        "customer",
        "agent",
        "admin",
      ],
      default: "customer",
    },

    agencyName: {
      type: String,
      default: "",
      trim: true,
    },

    city: {
      type: String,
      default: "",
      trim: true,
    },

    state: {
      type: String,
      default: "",
      trim: true,
    },

    gstNumber: {
      type: String,
      default: "",
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // ==========================================
    // FORGOT PASSWORD
    // ==========================================

    resetPasswordOTP: {
      type: String,
      default: null,
    },

    resetPasswordOTPExpires: {
      type: Date,
      default: null,
    },

    resetPasswordVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.model(
    "User",
    userSchema
  );