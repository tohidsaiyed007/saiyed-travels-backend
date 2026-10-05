const mongoose = require("mongoose");

const walletTransactionSchema =
  new mongoose.Schema(
    {
      // ==========================================
      // AGENT
      // ==========================================

      agentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      // ==========================================
      // TRANSACTION TYPE
      // ==========================================

      type: {
        type: String,
        enum: [
          "credit",
          "debit",
          "refund",
        ],
        required: true,
      },

      // ==========================================
      // AMOUNT
      // ==========================================

      amount: {
        type: Number,
        required: true,
        min: 0,
      },

      // ==========================================
      // BALANCE BEFORE TRANSACTION
      // ==========================================

      balanceBefore: {
        type: Number,
        required: true,
        min: 0,
      },

      // ==========================================
      // BALANCE AFTER TRANSACTION
      // ==========================================

      balanceAfter: {
        type: Number,
        required: true,
        min: 0,
      },

      // ==========================================
      // BOOKING REFERENCE
      // ==========================================

      bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        default: null,
      },

      bookingNumber: {
        type: String,
        default: "",
        trim: true,
      },

      pnr: {
        type: String,
        default: "",
        trim: true,
        uppercase: true,
      },

      // ==========================================
      // ADMIN NOTE
      // ==========================================

      note: {
        type: String,
        default: "",
        trim: true,
      },

      // ==========================================
      // WHO PERFORMED TRANSACTION
      // ==========================================

      performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },

      performedByRole: {
        type: String,
        enum: [
          "admin",
          "agent",
          "system",
        ],
        default: "system",
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "WalletTransaction",
    walletTransactionSchema
  );