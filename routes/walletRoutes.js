// // // // const express = require("express");

// // // // // const {
// // // // //   getAgents,
// // // // //   getAgentWallet,
// // // // //   addMoneyToAgentWallet,
// // // // //   getMyWallet,
// // // // //   getWalletTransactions,
// // // // // } = require("../controllers/walletController");


// // // // const router = express.Router();

// // // // // ==========================================
// // // // // ADMIN
// // // // // ==========================================

// // // // router.get(
// // // //   "/admin/agents",
// // // //   getAgents
// // // // );

// // // // router.get(
// // // //   "/admin/agent/:agentId",
// // // //   getAgentWallet
// // // // );

// // // // router.post(
// // // //   "/admin/add-money",
// // // //   addMoneyToAgentWallet
// // // // );

// // // // router.get(
// // // //   "/admin/transactions/:agentId",
// // // //   getWalletTransactions
// // // // );

// // // // // ==========================================
// // // // // AGENT
// // // // // ==========================================

// // // // router.get(
// // // //   "/agent",
// // // //   getMyWallet
// // // // );

// // // // router.get(
// // // //   "/agent/transactions",
// // // //   getWalletTransactions
// // // // );



// // // // router.post(
// // // //   "/admin/correct-credit",
// // // //   correctTotalCredit
// // // // );

// // // // module.exports = router;



// // // const express = require("express");

// // // const {
// // //   getAgents,
// // //   getAgentWallet,
// // //   addMoneyToAgentWallet,
// // //   getMyWallet,
// // //   getWalletTransactions,
// // //   correctTotalCredit,
// // // } = require("../controllers/walletController");

// // // const router = express.Router();

// // // // ==========================================
// // // // ADMIN
// // // // ==========================================

// // // // Get all agents
// // // router.get(
// // //   "/admin/agents",
// // //   getAgents
// // // );

// // // // Get selected agent wallet
// // // router.get(
// // //   "/admin/agent/:agentId",
// // //   getAgentWallet
// // // );

// // // // Add money to agent wallet
// // // router.post(
// // //   "/admin/add-money",
// // //   addMoneyToAgentWallet
// // // );

// // // // Transaction history
// // // router.get(
// // //   "/admin/transactions/:agentId",
// // //   getWalletTransactions
// // // );

// // // // Correct ONLY totalCredit
// // // // Available balance will NOT change
// // // router.post(
// // //   "/admin/correct-credit",
// // //   correctTotalCredit
// // // );

// // // // ==========================================
// // // // AGENT
// // // // ==========================================

// // // // Agent wallet
// // // router.get(
// // //   "/agent",
// // //   getMyWallet
// // // );

// // // // Agent transaction history
// // // router.get(
// // //   "/agent/transactions",
// // //   getWalletTransactions
// // // );

// // // module.exports = router;



// // const express = require("express");

// // const {
// //   getAgents,
// //   getAgentWallet,
// //   addMoneyToAgentWallet,
// //   getMyWallet,
// //   getWalletTransactions,
// //   correctTotalCredit,
// //   deleteWalletTransaction,
// // } = require("../controllers/walletController");

// // const router = express.Router();

// // // ==========================================
// // // ADMIN
// // // ==========================================

// // router.get(
// //   "/admin/agents",
// //   getAgents
// // );

// // router.get(
// //   "/admin/agent/:agentId",
// //   getAgentWallet
// // );

// // router.post(
// //   "/admin/add-money",
// //   addMoneyToAgentWallet
// // );

// // router.get(
// //   "/admin/transactions/:agentId",
// //   getWalletTransactions
// // );

// // // ==========================================
// // // CORRECT TOTAL CREDIT
// // // ==========================================

// // router.post(
// //   "/admin/correct-credit",
// //   correctTotalCredit
// // );

// // // ==========================================
// // // DELETE TRANSACTION
// // // ==========================================

// // router.delete(
// //   "/admin/transactions/:transactionId",
// //   deleteWalletTransaction
// // );

// // // ==========================================
// // // AGENT
// // // ==========================================

// // router.get(
// //   "/agent",
// //   getMyWallet
// // );

// // router.get(
// //   "/agent/transactions",
// //   getWalletTransactions
// // );

// // module.exports = router;














// const express = require("express");

// const {
//   getAgents,
//   getAgentWallet,
//   addMoneyToAgentWallet,
//   getMyWallet,
//   getWalletTransactions,
//   correctTotalCredit,
//   deleteWalletTransaction,
//   correctWalletBalance,
// } = require("../controllers/walletController");

// const router = express.Router();

// // ==========================================
// // ADMIN
// // ==========================================

// router.get(
//   "/admin/agents",
//   getAgents
// );

// router.get(
//   "/admin/agent/:agentId",
//   getAgentWallet
// );

// router.post(
//   "/admin/add-money",
//   addMoneyToAgentWallet
// );

// router.get(
//   "/admin/transactions/:agentId",
//   getWalletTransactions
// );

// // ==========================================
// // CORRECT TOTAL CREDIT
// // ==========================================

// router.post(
//   "/admin/correct-credit",
//   correctTotalCredit
// );

// // ==========================================
// // CORRECT AVAILABLE BALANCE
// // ==========================================

// router.post(
//   "/admin/correct-balance",
//   correctWalletBalance
// );

// // ==========================================
// // DELETE TRANSACTION
// // ==========================================

// router.delete(
//   "/admin/transactions/:transactionId",
//   deleteWalletTransaction
// );

// // ==========================================
// // AGENT
// // ==========================================

// router.get(
//   "/agent",
//   getMyWallet
// );

// router.get(
//   "/agent/transactions",
//   getWalletTransactions
// );

// module.exports = router;



const express = require("express");

const {
  getAgents,
  getAgentWallet,
  addMoneyToAgentWallet,
  getMyWallet,
  getWalletTransactions,
  correctTotalCredit,
  deleteWalletTransaction,
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
// CORRECT TOTAL CREDIT
// ==========================================

router.post(
  "/admin/correct-credit",
  correctTotalCredit
);

// ==========================================
// DELETE TRANSACTION
// ==========================================

router.delete(
  "/admin/transactions/:transactionId",
  deleteWalletTransaction
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