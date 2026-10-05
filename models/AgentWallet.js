const mongoose = require("mongoose");

const agentWalletSchema = new mongoose.Schema(
  {
    // ==========================================
    // AGENT USER
    // ==========================================

    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    // ==========================================
    // CURRENT WALLET BALANCE
    // ==========================================

    balance: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ==========================================
    // TOTAL MONEY ADDED BY ADMIN
    // ==========================================

    totalCredit: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ==========================================
    // TOTAL MONEY USED FOR TICKETS
    // ==========================================

    totalDebit: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ==========================================
    // WALLET STATUS
    // ==========================================

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "AgentWallet",
  agentWalletSchema
);