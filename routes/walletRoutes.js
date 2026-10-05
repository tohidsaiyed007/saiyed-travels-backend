const express = require("express");

const {
  getAgents,
  getAgentWallet,
  addMoneyToAgentWallet,
  getMyWallet,
  getWalletTransactions,
} = require("../controllers/walletController");

const router = express.Router();

// ==========================================
// ADMIN
// ==========================================

router.get(
  "/admin/agents",
  getAgents
);

router.get(
  "/admin/agent/:agentId",
  getAgentWallet
);

router.post(
  "/admin/add-money",
  addMoneyToAgentWallet
);

router.get(
  "/admin/transactions/:agentId",
  getWalletTransactions
);

// ==========================================
// AGENT
// ==========================================

router.get(
  "/agent",
  getMyWallet
);

router.get(
  "/agent/transactions",
  getWalletTransactions
);

module.exports = router;