
const mongoose = require("mongoose");

const paymentRequestSchema = new mongoose.Schema(
  {
    bookingData: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    bankName: {
      type: String,
      enum: ["ICICI Bank", "Bank of Baroda"],
      required: true,
    },

    paymentId: {
      type: String,
      required: true,
      trim: true,
    },

    screenshot: {
      type: String,
      required: true,
    },

    paymentDateTime: {
      type: Date,
      required: true,
    },

    // Customer email
    customerEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    // Customer WhatsApp number
    whatsappNumber: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },

    adminNote: {
      type: String,
      default: "",
      trim: true,
    },

    approvedBookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },

    processedAt: {
      type: Date,
      default: null,
    },

    // Admin email action token
    adminActionToken: {
      type: String,
      default: null,
    },

    adminActionTokenExpiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const PaymentRequest = mongoose.model(
  "PaymentRequest",
  paymentRequestSchema
);

module.exports = PaymentRequest;