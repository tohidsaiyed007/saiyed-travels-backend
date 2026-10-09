// // // const mongoose = require("mongoose");

// // // const User = require("../models/User");
// // // const AgentWallet = require("../models/AgentWallet");
// // // const WalletTransaction = require("../models/WalletTransaction");

// // // // =====================================================
// // // // HELPERS
// // // // =====================================================

// // // const numberValue = (value) => {
// // //   const n = Number(value);
// // //   return Number.isFinite(n) ? n : 0;
// // // };

// // // // =====================================================
// // // // ADMIN - GET ALL AGENTS
// // // // =====================================================

// // // const getAgents = async (req, res) => {
// // //   try {
// // //     const agents = await User.find({
// // //       role: "agent",
// // //       isActive: true,
// // //     })
// // //       .select(
// // //         "_id firstName lastName email phone agencyName city state"
// // //       )
// // //       .sort({
// // //         agencyName: 1,
// // //         firstName: 1,
// // //       });

// // //     return res.status(200).json({
// // //       success: true,
// // //       count: agents.length,
// // //       agents,
// // //     });
// // //   } catch (error) {
// // //     console.error(
// // //       "GET WALLET AGENTS ERROR:",
// // //       error
// // //     );

// // //     return res.status(500).json({
// // //       success: false,
// // //       message:
// // //         error.message ||
// // //         "Unable to fetch agents.",
// // //     });
// // //   }
// // // };

// // // // =====================================================
// // // // ADMIN - GET AGENT WALLET
// // // // =====================================================

// // // const getAgentWallet = async (req, res) => {
// // //   try {
// // //     const { agentId } = req.params;

// // //     if (
// // //       !agentId ||
// // //       !mongoose.Types.ObjectId.isValid(agentId)
// // //     ) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         message: "Valid agent ID is required.",
// // //       });
// // //     }

// // //     const agent = await User.findOne({
// // //       _id: agentId,
// // //       role: "agent",
// // //     }).select(
// // //       "_id firstName lastName email phone agencyName"
// // //     );

// // //     if (!agent) {
// // //       return res.status(404).json({
// // //         success: false,
// // //         message: "Agent not found.",
// // //       });
// // //     }

// // //     let wallet = await AgentWallet.findOne({
// // //       agentId,
// // //     });

// // //     // Agar wallet abhi create nahi hua
// // //     if (!wallet) {
// // //       wallet = await AgentWallet.create({
// // //         agentId,
// // //         balance: 0,
// // //         totalCredit: 0,
// // //         totalDebit: 0,
// // //       });
// // //     }

// // //     return res.status(200).json({
// // //       success: true,
// // //       agent,
// // //       wallet,
// // //     });
// // //   } catch (error) {
// // //     console.error(
// // //       "GET AGENT WALLET ERROR:",
// // //       error
// // //     );

// // //     return res.status(500).json({
// // //       success: false,
// // //       message:
// // //         error.message ||
// // //         "Unable to fetch agent wallet.",
// // //     });
// // //   }
// // // };

// // // // =====================================================
// // // // ADMIN - ADD MONEY TO AGENT WALLET
// // // // =====================================================

// // // const addMoneyToAgentWallet = async (
// // //   req,
// // //   res
// // // ) => {
// // //   try {
// // //     const { agentId, amount, note } =
// // //       req.body;

// // //     if (
// // //       !agentId ||
// // //       !mongoose.Types.ObjectId.isValid(agentId)
// // //     ) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         message: "Valid agent ID is required.",
// // //       });
// // //     }

// // //     const numericAmount =
// // //       numberValue(amount);

// // //     if (
// // //       numericAmount <= 0
// // //     ) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         message:
// // //           "Amount must be greater than 0.",
// // //       });
// // //     }

// // //     const agent = await User.findOne({
// // //       _id: agentId,
// // //       role: "agent",
// // //       isActive: true,
// // //     });

// // //     if (!agent) {
// // //       return res.status(404).json({
// // //         success: false,
// // //         message:
// // //           "Active agent not found.",
// // //       });
// // //     }

// // //     let wallet =
// // //       await AgentWallet.findOne({
// // //         agentId,
// // //       });

// // //     if (!wallet) {
// // //       wallet =
// // //         await AgentWallet.create({
// // //           agentId,
// // //           balance: 0,
// // //           totalCredit: 0,
// // //           totalDebit: 0,
// // //         });
// // //     }

// // //     const balanceBefore =
// // //       numberValue(wallet.balance);

// // //     const balanceAfter =
// // //       balanceBefore + numericAmount;

// // //     wallet.balance =
// // //       balanceAfter;

// // //     wallet.totalCredit =
// // //       numberValue(
// // //         wallet.totalCredit
// // //       ) + numericAmount;

// // //     wallet.isActive = true;

// // //     await wallet.save();

// // //     // ================================================
// // //     // TRANSACTION HISTORY
// // //     // ================================================

// // //     const transaction =
// // //       await WalletTransaction.create({
// // //         agentId,

// // //         type: "credit",

// // //         amount:
// // //           numericAmount,

// // //         balanceBefore,

// // //         balanceAfter,

// // //         bookingId: null,

// // //         bookingNumber: "",

// // //         pnr: "",

// // //         note:
// // //           String(note || "").trim() ||
// // //           "Amount added by admin.",

// // //         performedBy:
// // //           req.user?._id ||
// // //           req.user?.id ||
// // //           null,

// // //         performedByRole:
// // //           "admin",
// // //       });

// // //     return res.status(200).json({
// // //       success: true,

// // //       message:
// // //         `₹${numericAmount.toLocaleString(
// // //           "en-IN"
// // //         )} added to agent wallet successfully.`,

// // //       wallet,

// // //       transaction,
// // //     });
// // //   } catch (error) {
// // //     console.error(
// // //       "ADD MONEY TO AGENT WALLET ERROR:",
// // //       error
// // //     );

// // //     return res.status(500).json({
// // //       success: false,
// // //       message:
// // //         error.message ||
// // //         "Unable to add money to agent wallet.",
// // //     });
// // //   }
// // // };

// // // // =====================================================
// // // // AGENT - GET OWN WALLET
// // // // =====================================================

// // // const getMyWallet = async (
// // //   req,
// // //   res
// // // ) => {
// // //   try {
// // //     const agentId =
// // //       req.user?._id ||
// // //       req.user?.id ||
// // //       req.headers["x-user-id"];

// // //     if (
// // //       !agentId ||
// // //       !mongoose.Types.ObjectId.isValid(
// // //         agentId
// // //       )
// // //     ) {
// // //       return res.status(401).json({
// // //         success: false,
// // //         message:
// // //           "Agent login required.",
// // //       });
// // //     }

// // //     const agent =
// // //       await User.findOne({
// // //         _id: agentId,
// // //         role: "agent",
// // //       }).select(
// // //         "_id firstName lastName email phone agencyName"
// // //       );

// // //     if (!agent) {
// // //       return res.status(403).json({
// // //         success: false,
// // //         message:
// // //           "Only an agent can access this wallet.",
// // //       });
// // //     }

// // //     let wallet =
// // //       await AgentWallet.findOne({
// // //         agentId,
// // //       });

// // //     if (!wallet) {
// // //       wallet =
// // //         await AgentWallet.create({
// // //           agentId,
// // //           balance: 0,
// // //           totalCredit: 0,
// // //           totalDebit: 0,
// // //         });
// // //     }

// // //     return res.status(200).json({
// // //       success: true,
// // //       agent,
// // //       wallet,
// // //     });
// // //   } catch (error) {
// // //     console.error(
// // //       "GET MY WALLET ERROR:",
// // //       error
// // //     );

// // //     return res.status(500).json({
// // //       success: false,
// // //       message:
// // //         error.message ||
// // //         "Unable to fetch wallet.",
// // //     });
// // //   }
// // // };

// // // // =====================================================
// // // // AGENT / ADMIN - GET TRANSACTIONS
// // // // =====================================================

// // // const getWalletTransactions =
// // //   async (req, res) => {
// // //     try {
// // //       const requestedAgentId =
// // //         req.params.agentId;

// // //       let agentId;

// // //       // ==============================================
// // //       // ADMIN
// // //       // ==============================================

// // //       if (
// // //         String(
// // //           req.user?.role || ""
// // //         ).toLowerCase() === "admin"
// // //       ) {
// // //         agentId =
// // //           requestedAgentId;
// // //       }

// // //       // ==============================================
// // //       // AGENT
// // //       // ==============================================

// // //       else {
// // //         agentId =
// // //           req.user?._id ||
// // //           req.user?.id ||
// // //           req.headers["x-user-id"];
// // //       }

// // //       if (
// // //         !agentId ||
// // //         !mongoose.Types.ObjectId.isValid(
// // //           agentId
// // //         )
// // //       ) {
// // //         return res.status(400).json({
// // //           success: false,
// // //           message:
// // //             "Valid agent ID is required.",
// // //         });
// // //       }

// // //       const agent =
// // //         await User.findOne({
// // //           _id: agentId,
// // //           role: "agent",
// // //         }).select(
// // //           "_id firstName lastName email agencyName"
// // //         );

// // //       if (!agent) {
// // //         return res.status(404).json({
// // //           success: false,
// // //           message:
// // //             "Agent not found.",
// // //         });
// // //       }

// // //       const transactions =
// // //         await WalletTransaction.find({
// // //           agentId,
// // //         })
// // //           .populate(
// // //             "performedBy",
// // //             "firstName lastName email role"
// // //           )
// // //           .populate(
// // //             "bookingId",
// // //             "bookingId pnr total finalAmount"
// // //           )
// // //           .sort({
// // //             createdAt: -1,
// // //           });

// // //       return res.status(200).json({
// // //         success: true,

// // //         count:
// // //           transactions.length,

// // //         transactions,
// // //       });
// // //     } catch (error) {
// // //       console.error(
// // //         "GET WALLET TRANSACTIONS ERROR:",
// // //         error
// // //       );

// // //       return res.status(500).json({
// // //         success: false,
// // //         message:
// // //           error.message ||
// // //           "Unable to fetch wallet transactions.",
// // //       });
// // //     }
// // //   };

// // // // =====================================================
// // // // EXPORT
// // // // =====================================================

// // // module.exports = {
// // //   getAgents,
// // //   getAgentWallet,
// // //   addMoneyToAgentWallet,
// // //   getMyWallet,
// // //   getWalletTransactions,
// // // };







































































// // const mongoose = require("mongoose");

// // const User = require("../models/User");
// // const AgentWallet = require("../models/AgentWallet");
// // const WalletTransaction = require("../models/WalletTransaction");

// // // =====================================================
// // // HELPERS
// // // =====================================================

// // const numberValue = (value) => {
// //   const n = Number(value);

// //   return Number.isFinite(n) ? n : 0;
// // };

// // const getRequestUserId = (req) => {
// //   return (
// //     req.user?._id ||
// //     req.user?.id ||
// //     req.headers["x-user-id"] ||
// //     null
// //   );
// // };

// // // =====================================================
// // // ADMIN - GET ALL AGENTS
// // // =====================================================

// // const getAgents = async (req, res) => {
// //   try {
// //     console.log(
// //       "=========================================="
// //     );

// //     console.log(
// //       "GET WALLET AGENTS REQUEST"
// //     );

// //     console.log(
// //       "=========================================="
// //     );

// //     const agents = await User.find({
// //       role: "agent",
// //       isActive: true,
// //     })
// //       .select(
// //         "_id firstName lastName email phone agencyName city state"
// //       )
// //       .sort({
// //         agencyName: 1,
// //         firstName: 1,
// //       });

// //     console.log(
// //       "WALLET AGENTS FOUND:",
// //       agents.length
// //     );

// //     return res.status(200).json({
// //       success: true,
// //       count: agents.length,
// //       agents,
// //     });
// //   } catch (error) {
// //     console.error(
// //       "GET WALLET AGENTS ERROR:",
// //       error
// //     );

// //     return res.status(500).json({
// //       success: false,
// //       message:
// //         error.message ||
// //         "Unable to fetch agents.",
// //     });
// //   }
// // };

// // // =====================================================
// // // ADMIN - GET AGENT WALLET
// // // =====================================================

// // const getAgentWallet = async (req, res) => {
// //   try {
// //     const { agentId } = req.params;

// //     console.log(
// //       "=========================================="
// //     );

// //     console.log(
// //       "GET AGENT WALLET REQUEST"
// //     );

// //     console.log(
// //       "AGENT ID:",
// //       agentId
// //     );

// //     console.log(
// //       "=========================================="
// //     );

// //     if (
// //       !agentId ||
// //       !mongoose.Types.ObjectId.isValid(agentId)
// //     ) {
// //       return res.status(400).json({
// //         success: false,
// //         message:
// //           "Valid agent ID is required.",
// //       });
// //     }

// //     const agent = await User.findOne({
// //       _id: agentId,
// //       role: "agent",
// //     }).select(
// //       "_id firstName lastName email phone agencyName city state"
// //     );

// //     if (!agent) {
// //       return res.status(404).json({
// //         success: false,
// //         message:
// //           "Agent not found.",
// //       });
// //     }

// //     let wallet =
// //       await AgentWallet.findOne({
// //         agentId,
// //       });

// //     // ================================================
// //     // CREATE WALLET IF NOT EXISTS
// //     // ================================================

// //     if (!wallet) {
// //       wallet =
// //         await AgentWallet.create({
// //           agentId,
// //           balance: 0,
// //           totalCredit: 0,
// //           totalDebit: 0,
// //           isActive: true,
// //         });

// //       console.log(
// //         "NEW AGENT WALLET CREATED:",
// //         agentId
// //       );
// //     }

// //     console.log(
// //       "AGENT WALLET BALANCE:",
// //       wallet.balance
// //     );

// //     return res.status(200).json({
// //       success: true,
// //       agent,
// //       wallet,
// //     });
// //   } catch (error) {
// //     console.error(
// //       "GET AGENT WALLET ERROR:",
// //       error
// //     );

// //     return res.status(500).json({
// //       success: false,
// //       message:
// //         error.message ||
// //         "Unable to fetch agent wallet.",
// //     });
// //   }
// // };

// // // =====================================================
// // // ADMIN - ADD MONEY TO AGENT WALLET
// // // =====================================================

// // const addMoneyToAgentWallet = async (
// //   req,
// //   res
// // ) => {
// //   try {
// //     const {
// //       agentId,
// //       amount,
// //       note,
// //     } = req.body;

// //     console.log(
// //       "=========================================="
// //     );

// //     console.log(
// //       "ADD MONEY TO AGENT WALLET"
// //     );

// //     console.log(
// //       "AGENT ID:",
// //       agentId
// //     );

// //     console.log(
// //       "AMOUNT:",
// //       amount
// //     );

// //     console.log(
// //       "=========================================="
// //     );

// //     if (
// //       !agentId ||
// //       !mongoose.Types.ObjectId.isValid(agentId)
// //     ) {
// //       return res.status(400).json({
// //         success: false,
// //         message:
// //           "Valid agent ID is required.",
// //       });
// //     }

// //     const numericAmount =
// //       numberValue(amount);

// //     if (
// //       numericAmount <= 0
// //     ) {
// //       return res.status(400).json({
// //         success: false,
// //         message:
// //           "Amount must be greater than 0.",
// //       });
// //     }

// //     const agent =
// //       await User.findOne({
// //         _id: agentId,
// //         role: "agent",
// //         isActive: true,
// //       });

// //     if (!agent) {
// //       return res.status(404).json({
// //         success: false,
// //         message:
// //           "Active agent not found.",
// //       });
// //     }

// //     let wallet =
// //       await AgentWallet.findOne({
// //         agentId,
// //       });

// //     // ================================================
// //     // CREATE WALLET
// //     // ================================================

// //     if (!wallet) {
// //       wallet =
// //         await AgentWallet.create({
// //           agentId,
// //           balance: 0,
// //           totalCredit: 0,
// //           totalDebit: 0,
// //           isActive: true,
// //         });
// //     }

// //     const balanceBefore =
// //       numberValue(
// //         wallet.balance
// //       );

// //     const balanceAfter =
// //       balanceBefore +
// //       numericAmount;

// //     // ================================================
// //     // UPDATE WALLET
// //     // ================================================

// //     wallet.balance =
// //       balanceAfter;

// //     wallet.totalCredit =
// //       numberValue(
// //         wallet.totalCredit
// //       ) + numericAmount;

// //     wallet.isActive = true;

// //     await wallet.save();

// //     // ================================================
// //     // TRANSACTION
// //     // ================================================

// //     const performedBy =
// //       getRequestUserId(req);

// //     const transaction =
// //       await WalletTransaction.create({
// //         agentId,

// //         type: "credit",

// //         amount:
// //           numericAmount,

// //         balanceBefore,

// //         balanceAfter,

// //         bookingId: null,

// //         bookingNumber: "",

// //         pnr: "",

// //         note:
// //           String(note || "").trim() ||
// //           "Amount added by admin.",

// //         performedBy:
// //           performedBy || null,

// //         performedByRole:
// //           "admin",
// //       });

// //     console.log(
// //       "WALLET CREDIT SUCCESS"
// //     );

// //     console.log(
// //       "BALANCE BEFORE:",
// //       balanceBefore
// //     );

// //     console.log(
// //       "AMOUNT ADDED:",
// //       numericAmount
// //     );

// //     console.log(
// //       "BALANCE AFTER:",
// //       balanceAfter
// //     );

// //     return res.status(200).json({
// //       success: true,

// //       message:
// //         `₹${numericAmount.toLocaleString(
// //           "en-IN"
// //         )} added to agent wallet successfully.`,

// //       wallet,

// //       transaction,
// //     });
// //   } catch (error) {
// //     console.error(
// //       "ADD MONEY TO AGENT WALLET ERROR:",
// //       error
// //     );

// //     return res.status(500).json({
// //       success: false,
// //       message:
// //         error.message ||
// //         "Unable to add money to agent wallet.",
// //     });
// //   }
// // };

// // // =====================================================
// // // AGENT - GET OWN WALLET
// // // =====================================================

// // const getMyWallet = async (
// //   req,
// //   res
// // ) => {
// //   try {
// //     const agentId =
// //       getRequestUserId(req);

// //     console.log(
// //       "GET MY WALLET:",
// //       agentId
// //     );

// //     if (
// //       !agentId ||
// //       !mongoose.Types.ObjectId.isValid(
// //         agentId
// //       )
// //     ) {
// //       return res.status(401).json({
// //         success: false,
// //         message:
// //           "Agent login required.",
// //       });
// //     }

// //     const agent =
// //       await User.findOne({
// //         _id: agentId,
// //         role: "agent",
// //       }).select(
// //         "_id firstName lastName email phone agencyName city state"
// //       );

// //     if (!agent) {
// //       return res.status(403).json({
// //         success: false,
// //         message:
// //           "Only an agent can access this wallet.",
// //       });
// //     }

// //     let wallet =
// //       await AgentWallet.findOne({
// //         agentId,
// //       });

// //     if (!wallet) {
// //       wallet =
// //         await AgentWallet.create({
// //           agentId,
// //           balance: 0,
// //           totalCredit: 0,
// //           totalDebit: 0,
// //           isActive: true,
// //         });
// //     }

// //     return res.status(200).json({
// //       success: true,
// //       agent,
// //       wallet,
// //     });
// //   } catch (error) {
// //     console.error(
// //       "GET MY WALLET ERROR:",
// //       error
// //     );

// //     return res.status(500).json({
// //       success: false,
// //       message:
// //         error.message ||
// //         "Unable to fetch wallet.",
// //     });
// //   }
// // };

// // // =====================================================
// // // ADMIN - GET AGENT TRANSACTIONS
// // // =====================================================

// // const getWalletTransactions =
// //   async (req, res) => {
// //     try {
// //       // ==============================================
// //       // IMPORTANT
// //       // ADMIN ROUTE:
// //       // /admin/transactions/:agentId
// //       //
// //       // Is route mein agentId directly params se
// //       // liya jayega.
// //       // req.user ki zarurat nahi.
// //       // ==============================================

// //       const requestedAgentId =
// //         req.params.agentId;

// //       console.log(
// //         "=========================================="
// //       );

// //       console.log(
// //         "GET WALLET TRANSACTIONS"
// //       );

// //       console.log(
// //         "REQUESTED AGENT ID:",
// //         requestedAgentId
// //       );

// //       console.log(
// //         "=========================================="
// //       );

// //       if (
// //         !requestedAgentId ||
// //         !mongoose.Types.ObjectId.isValid(
// //           requestedAgentId
// //         )
// //       ) {
// //         return res.status(400).json({
// //           success: false,
// //           message:
// //             "Valid agent ID is required.",
// //         });
// //       }

// //       const agentId =
// //         requestedAgentId;

// //       const agent =
// //         await User.findOne({
// //           _id: agentId,
// //           role: "agent",
// //         }).select(
// //           "_id firstName lastName email agencyName"
// //         );

// //       if (!agent) {
// //         return res.status(404).json({
// //           success: false,
// //           message:
// //             "Agent not found.",
// //         });
// //       }

// //       const transactions =
// //         await WalletTransaction.find({
// //           agentId,
// //         })
// //           .populate(
// //             "performedBy",
// //             "firstName lastName email role"
// //           )
// //           .populate(
// //             "bookingId",
// //             "bookingId pnr total finalAmount"
// //           )
// //           .sort({
// //             createdAt: -1,
// //           });

// //       console.log(
// //         "WALLET TRANSACTIONS FOUND:",
// //         transactions.length
// //       );

// //       return res.status(200).json({
// //         success: true,

// //         count:
// //           transactions.length,

// //         transactions,
// //       });
// //     } catch (error) {
// //       console.error(
// //         "GET WALLET TRANSACTIONS ERROR:",
// //         error
// //       );

// //       return res.status(500).json({
// //         success: false,
// //         message:
// //           error.message ||
// //           "Unable to fetch wallet transactions.",
// //       });
// //     }
// //   };


// //   // =====================================================
// // // CORRECT TOTAL CREDIT ONLY
// // // IMPORTANT:
// // // balance      -> NO CHANGE
// // // totalDebit   -> NO CHANGE
// // // transactions -> NO CHANGE
// // // =====================================================

// // const correctTotalCredit = async (req, res) => {
// //   try {
// //     const {
// //       agentId,
// //       totalCredit,
// //     } = req.body;

// //     if (!agentId) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Agent ID is required.",
// //       });
// //     }

// //     const newTotalCredit =
// //       Number(totalCredit);

// //     if (
// //       !Number.isFinite(
// //         newTotalCredit
// //       ) ||
// //       newTotalCredit < 0
// //     ) {
// //       return res.status(400).json({
// //         success: false,
// //         message:
// //           "Please enter a valid Total Credit.",
// //       });
// //     }

// //     const wallet =
// //       await AgentWallet.findOne({
// //         agentId,
// //         isActive: true,
// //       });

// //     if (!wallet) {
// //       return res.status(404).json({
// //         success: false,
// //         message:
// //           "Agent wallet not found.",
// //       });
// //     }

// //     const oldTotalCredit =
// //       Number(wallet.totalCredit || 0);

// //     // ONLY totalCredit changes
// //     wallet.totalCredit =
// //       newTotalCredit;

// //     // DO NOT CHANGE:
// //     // wallet.balance
// //     // wallet.totalDebit

// //     await wallet.save();

// //     return res.status(200).json({
// //       success: true,

// //       message:
// //         `Total Credit corrected from ₹${oldTotalCredit.toLocaleString(
// //           "en-IN"
// //         )} to ₹${newTotalCredit.toLocaleString(
// //           "en-IN"
// //         )}. Available Balance was not changed.`,

// //       wallet,
// //     });
// //   } catch (error) {
// //     console.error(
// //       "CORRECT TOTAL CREDIT ERROR:",
// //       error
// //     );

// //     return res.status(500).json({
// //       success: false,
// //       message:
// //         "Unable to correct Total Credit.",
// //       error: error.message,
// //     });
// //   }
// // };

// // // =====================================================
// // // EXPORT
// // // =====================================================

// // module.exports = {
// //   getAgents,
// //   getAgentWallet,
// //   addMoneyToAgentWallet,
// //   getMyWallet,
// //   getWalletTransactions,
// //   correctTotalCredit,
// // };
























































// const mongoose = require("mongoose");

// const User = require("../models/User");
// const AgentWallet = require("../models/AgentWallet");
// const WalletTransaction = require("../models/WalletTransaction");

// // =====================================================
// // HELPERS
// // =====================================================

// const numberValue = (value) => {
//   const n = Number(value);

//   return Number.isFinite(n) ? n : 0;
// };

// const getRequestUserId = (req) => {
//   return (
//     req.user?._id ||
//     req.user?.id ||
//     req.headers["x-user-id"] ||
//     null
//   );
// };

// // =====================================================
// // ADMIN - GET ALL AGENTS
// // =====================================================

// const getAgents = async (req, res) => {
//   try {
//     console.log(
//       "=========================================="
//     );

//     console.log(
//       "GET WALLET AGENTS REQUEST"
//     );

//     console.log(
//       "=========================================="
//     );

//     const agents = await User.find({
//       role: "agent",
//       isActive: true,
//     })
//       .select(
//         "_id firstName lastName email phone agencyName city state"
//       )
//       .sort({
//         agencyName: 1,
//         firstName: 1,
//       });

//     console.log(
//       "WALLET AGENTS FOUND:",
//       agents.length
//     );

//     return res.status(200).json({
//       success: true,
//       count: agents.length,
//       agents,
//     });
//   } catch (error) {
//     console.error(
//       "GET WALLET AGENTS ERROR:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         error.message ||
//         "Unable to fetch agents.",
//     });
//   }
// };

// // =====================================================
// // ADMIN - GET AGENT WALLET
// // =====================================================

// const getAgentWallet = async (req, res) => {
//   try {
//     const { agentId } = req.params;

//     console.log(
//       "=========================================="
//     );

//     console.log(
//       "GET AGENT WALLET REQUEST"
//     );

//     console.log(
//       "AGENT ID:",
//       agentId
//     );

//     console.log(
//       "=========================================="
//     );

//     if (
//       !agentId ||
//       !mongoose.Types.ObjectId.isValid(agentId)
//     ) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Valid agent ID is required.",
//       });
//     }

//     const agent = await User.findOne({
//       _id: agentId,
//       role: "agent",
//     }).select(
//       "_id firstName lastName email phone agencyName city state"
//     );

//     if (!agent) {
//       return res.status(404).json({
//         success: false,
//         message:
//           "Agent not found.",
//       });
//     }

//     let wallet =
//       await AgentWallet.findOne({
//         agentId,
//       });

//     // ================================================
//     // CREATE WALLET IF NOT EXISTS
//     // ================================================

//     if (!wallet) {
//       wallet =
//         await AgentWallet.create({
//           agentId,
//           balance: 0,
//           totalCredit: 0,
//           totalDebit: 0,
//           isActive: true,
//         });

//       console.log(
//         "NEW AGENT WALLET CREATED:",
//         agentId
//       );
//     }

//     console.log(
//       "AGENT WALLET BALANCE:",
//       wallet.balance
//     );

//     return res.status(200).json({
//       success: true,
//       agent,
//       wallet,
//     });
//   } catch (error) {
//     console.error(
//       "GET AGENT WALLET ERROR:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         error.message ||
//         "Unable to fetch agent wallet.",
//     });
//   }
// };

// // =====================================================
// // ADMIN - ADD MONEY TO AGENT WALLET
// // =====================================================

// const addMoneyToAgentWallet = async (
//   req,
//   res
// ) => {
//   try {
//     const {
//       agentId,
//       amount,
//       note,
//     } = req.body;

//     console.log(
//       "=========================================="
//     );

//     console.log(
//       "ADD MONEY TO AGENT WALLET"
//     );

//     console.log(
//       "AGENT ID:",
//       agentId
//     );

//     console.log(
//       "AMOUNT:",
//       amount
//     );

//     console.log(
//       "=========================================="
//     );

//     if (
//       !agentId ||
//       !mongoose.Types.ObjectId.isValid(agentId)
//     ) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Valid agent ID is required.",
//       });
//     }

//     const numericAmount =
//       numberValue(amount);

//     if (
//       numericAmount <= 0
//     ) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Amount must be greater than 0.",
//       });
//     }

//     const agent =
//       await User.findOne({
//         _id: agentId,
//         role: "agent",
//         isActive: true,
//       });

//     if (!agent) {
//       return res.status(404).json({
//         success: false,
//         message:
//           "Active agent not found.",
//       });
//     }

//     let wallet =
//       await AgentWallet.findOne({
//         agentId,
//       });

//     // ================================================
//     // CREATE WALLET
//     // ================================================

//     if (!wallet) {
//       wallet =
//         await AgentWallet.create({
//           agentId,
//           balance: 0,
//           totalCredit: 0,
//           totalDebit: 0,
//           isActive: true,
//         });
//     }

//     const balanceBefore =
//       numberValue(
//         wallet.balance
//       );

//     const balanceAfter =
//       balanceBefore +
//       numericAmount;

//     // ================================================
//     // UPDATE WALLET
//     // ================================================

//     wallet.balance =
//       balanceAfter;

//     wallet.totalCredit =
//       numberValue(
//         wallet.totalCredit
//       ) + numericAmount;

//     wallet.isActive = true;

//     await wallet.save();

//     // ================================================
//     // TRANSACTION
//     // ================================================

//     const performedBy =
//       getRequestUserId(req);

//     const transaction =
//       await WalletTransaction.create({
//         agentId,

//         type: "credit",

//         amount:
//           numericAmount,

//         balanceBefore,

//         balanceAfter,

//         bookingId: null,

//         bookingNumber: "",

//         pnr: "",

//         note:
//           String(note || "").trim() ||
//           "Amount added by admin.",

//         performedBy:
//           performedBy || null,

//         performedByRole:
//           "admin",
//       });

//     console.log(
//       "WALLET CREDIT SUCCESS"
//     );

//     console.log(
//       "BALANCE BEFORE:",
//       balanceBefore
//     );

//     console.log(
//       "AMOUNT ADDED:",
//       numericAmount
//     );

//     console.log(
//       "BALANCE AFTER:",
//       balanceAfter
//     );

//     return res.status(200).json({
//       success: true,

//       message:
//         `₹${numericAmount.toLocaleString(
//           "en-IN"
//         )} added to agent wallet successfully.`,

//       wallet,

//       transaction,
//     });
//   } catch (error) {
//     console.error(
//       "ADD MONEY TO AGENT WALLET ERROR:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         error.message ||
//         "Unable to add money to agent wallet.",
//     });
//   }
// };

// // =====================================================
// // AGENT - GET OWN WALLET
// // =====================================================

// const getMyWallet = async (
//   req,
//   res
// ) => {
//   try {
//     const agentId =
//       getRequestUserId(req);

//     console.log(
//       "GET MY WALLET:",
//       agentId
//     );

//     if (
//       !agentId ||
//       !mongoose.Types.ObjectId.isValid(
//         agentId
//       )
//     ) {
//       return res.status(401).json({
//         success: false,
//         message:
//           "Agent login required.",
//       });
//     }

//     const agent =
//       await User.findOne({
//         _id: agentId,
//         role: "agent",
//       }).select(
//         "_id firstName lastName email phone agencyName city state"
//       );

//     if (!agent) {
//       return res.status(403).json({
//         success: false,
//         message:
//           "Only an agent can access this wallet.",
//       });
//     }

//     let wallet =
//       await AgentWallet.findOne({
//         agentId,
//       });

//     if (!wallet) {
//       wallet =
//         await AgentWallet.create({
//           agentId,
//           balance: 0,
//           totalCredit: 0,
//           totalDebit: 0,
//           isActive: true,
//         });
//     }

//     return res.status(200).json({
//       success: true,
//       agent,
//       wallet,
//     });
//   } catch (error) {
//     console.error(
//       "GET MY WALLET ERROR:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         error.message ||
//         "Unable to fetch wallet.",
//     });
//   }
// };

// // =====================================================
// // ADMIN - GET AGENT TRANSACTIONS
// // =====================================================

// const getWalletTransactions =
//   async (req, res) => {
//     try {
//       // ==============================================
//       // ADMIN ROUTE:
//       // /admin/transactions/:agentId
//       //
//       // agentId params se liya jayega.
//       // req.user ki zarurat nahi.
//       // ==============================================

//       const requestedAgentId =
//         req.params.agentId;

//       console.log(
//         "=========================================="
//       );

//       console.log(
//         "GET WALLET TRANSACTIONS"
//       );

//       console.log(
//         "REQUESTED AGENT ID:",
//         requestedAgentId
//       );

//       console.log(
//         "=========================================="
//       );

//       if (
//         !requestedAgentId ||
//         !mongoose.Types.ObjectId.isValid(
//           requestedAgentId
//         )
//       ) {
//         return res.status(400).json({
//           success: false,
//           message:
//             "Valid agent ID is required.",
//         });
//       }

//       const agentId =
//         requestedAgentId;

//       const agent =
//         await User.findOne({
//           _id: agentId,
//           role: "agent",
//         }).select(
//           "_id firstName lastName email agencyName"
//         );

//       if (!agent) {
//         return res.status(404).json({
//           success: false,
//           message:
//             "Agent not found.",
//         });
//       }

//       const transactions =
//         await WalletTransaction.find({
//           agentId,
//         })
//           .populate(
//             "performedBy",
//             "firstName lastName email role"
//           )
//           .populate(
//             "bookingId",
//             "bookingId pnr total finalAmount"
//           )
//           .sort({
//             createdAt: -1,
//           });

//       console.log(
//         "WALLET TRANSACTIONS FOUND:",
//         transactions.length
//       );

//       return res.status(200).json({
//         success: true,

//         count:
//           transactions.length,

//         transactions,
//       });
//     } catch (error) {
//       console.error(
//         "GET WALLET TRANSACTIONS ERROR:",
//         error
//       );

//       return res.status(500).json({
//         success: false,
//         message:
//           error.message ||
//           "Unable to fetch wallet transactions.",
//       });
//     }
//   };

// // =====================================================
// // CORRECT TOTAL CREDIT ONLY
// // =====================================================
// // IMPORTANT:
// //
// // balance      -> NO CHANGE
// // totalDebit   -> NO CHANGE
// // transactions -> NO CHANGE
// //
// // Example:
// //
// // Available Balance = ₹3,24,009
// // Total Credit      = ₹3,65,009
// // Total Debit       = ₹41,000
// //
// // Correction:
// //
// // Total Credit      = ₹3,65,005
// //
// // Available Balance and Total Debit
// // remain exactly the same.
// // =====================================================

// const correctTotalCredit = async (
//   req,
//   res
// ) => {
//   try {
//     const {
//       agentId,
//       totalCredit,
//     } = req.body;

//     if (
//       !agentId ||
//       !mongoose.Types.ObjectId.isValid(
//         agentId
//       )
//     ) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Valid agent ID is required.",
//       });
//     }

//     const newTotalCredit =
//       Number(totalCredit);

//     if (
//       !Number.isFinite(
//         newTotalCredit
//       ) ||
//       newTotalCredit < 0
//     ) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Please enter a valid Total Credit.",
//       });
//     }

//     const wallet =
//       await AgentWallet.findOne({
//         agentId,
//         isActive: true,
//       });

//     if (!wallet) {
//       return res.status(404).json({
//         success: false,
//         message:
//           "Agent wallet not found.",
//       });
//     }

//     const oldTotalCredit =
//       Number(
//         wallet.totalCredit || 0
//       );

//     // ================================================
//     // ONLY TOTAL CREDIT CHANGES
//     // ================================================

//     wallet.totalCredit =
//       newTotalCredit;

//     // ================================================
//     // DO NOT CHANGE
//     // ================================================

//     // wallet.balance
//     // wallet.totalDebit
//     // WalletTransaction

//     await wallet.save();

//     console.log(
//       "=========================================="
//     );

//     console.log(
//       "TOTAL CREDIT CORRECTED"
//     );

//     console.log(
//       "AGENT ID:",
//       agentId
//     );

//     console.log(
//       "OLD TOTAL CREDIT:",
//       oldTotalCredit
//     );

//     console.log(
//       "NEW TOTAL CREDIT:",
//       newTotalCredit
//     );

//     console.log(
//       "AVAILABLE BALANCE:",
//       wallet.balance
//     );

//     console.log(
//       "TOTAL DEBIT:",
//       wallet.totalDebit
//     );

//     console.log(
//       "=========================================="
//     );

//     return res.status(200).json({
//       success: true,

//       message:
//         `Total Credit corrected from ₹${oldTotalCredit.toLocaleString(
//           "en-IN"
//         )} to ₹${newTotalCredit.toLocaleString(
//           "en-IN"
//         )}. Available Balance was not changed.`,

//       wallet,
//     });
//   } catch (error) {
//     console.error(
//       "CORRECT TOTAL CREDIT ERROR:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         "Unable to correct Total Credit.",
//       error: error.message,
//     });
//   }
// };

// // =====================================================
// // ADMIN - DELETE WALLET TRANSACTION
// // =====================================================
// //
// // IMPORTANT:
// //
// // Ye sirf transaction history ki entry delete karega.
// //
// // Ye:
// // - wallet.balance change nahi karega
// // - wallet.totalCredit change nahi karega
// // - wallet.totalDebit change nahi karega
// //
// // Isliye galti se transaction history ki entry
// // remove karne ke liye use kiya ja sakta hai.
// // =====================================================

// const deleteWalletTransaction = async (
//   req,
//   res
// ) => {
//   try {
//     const {
//       transactionId,
//     } = req.params;

//     console.log(
//       "=========================================="
//     );

//     console.log(
//       "DELETE WALLET TRANSACTION"
//     );

//     console.log(
//       "TRANSACTION ID:",
//       transactionId
//     );

//     console.log(
//       "=========================================="
//     );

//     if (
//       !transactionId ||
//       !mongoose.Types.ObjectId.isValid(
//         transactionId
//       )
//     ) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Valid transaction ID is required.",
//       });
//     }

//     const transaction =
//       await WalletTransaction.findById(
//         transactionId
//       );

//     if (!transaction) {
//       return res.status(404).json({
//         success: false,
//         message:
//           "Transaction not found.",
//       });
//     }

//     await WalletTransaction.findByIdAndDelete(
//       transactionId
//     );

//     console.log(
//       "WALLET TRANSACTION DELETED:",
//       transactionId
//     );

//     return res.status(200).json({
//       success: true,
//       message:
//         "Transaction deleted successfully.",
//     });
//   } catch (error) {
//     console.error(
//       "DELETE WALLET TRANSACTION ERROR:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         error.message ||
//         "Unable to delete wallet transaction.",
//     });
//   }
// };

// // =====================================================
// // EXPORT
// // =====================================================

// module.exports = {
//   getAgents,
//   getAgentWallet,
//   addMoneyToAgentWallet,
//   getMyWallet,
//   getWalletTransactions,

//   // Total Credit correction
//   correctTotalCredit,

//   // Transaction delete
//   deleteWalletTransaction,
// };




























const mongoose = require("mongoose");

const User = require("../models/User");
const AgentWallet = require("../models/AgentWallet");
const WalletTransaction = require("../models/WalletTransaction");

// =====================================================
// HELPERS
// =====================================================

const numberValue = (value) => {
  const n = Number(value);

  return Number.isFinite(n) ? n : 0;
};

const getRequestUserId = (req) => {
  return (
    req.user?._id ||
    req.user?.id ||
    req.headers["x-user-id"] ||
    null
  );
};

// =====================================================
// ADMIN - GET ALL AGENTS
// =====================================================

const getAgents = async (req, res) => {
  try {
    console.log("==========================================");
    console.log("GET WALLET AGENTS REQUEST");
    console.log("==========================================");

    const agents = await User.find({
      role: "agent",
      isActive: true,
    })
      .select(
        "_id firstName lastName email phone agencyName city state"
      )
      .sort({
        agencyName: 1,
        firstName: 1,
      });

    console.log(
      "WALLET AGENTS FOUND:",
      agents.length
    );

    return res.status(200).json({
      success: true,
      count: agents.length,
      agents,
    });
  } catch (error) {
    console.error(
      "GET WALLET AGENTS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to fetch agents.",
    });
  }
};

// =====================================================
// ADMIN - GET AGENT WALLET
// =====================================================

const getAgentWallet = async (req, res) => {
  try {
    const { agentId } = req.params;

    console.log("==========================================");
    console.log("GET AGENT WALLET REQUEST");
    console.log("AGENT ID:", agentId);
    console.log("==========================================");

    if (
      !agentId ||
      !mongoose.Types.ObjectId.isValid(agentId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid agent ID is required.",
      });
    }

    const agent = await User.findOne({
      _id: agentId,
      role: "agent",
    }).select(
      "_id firstName lastName email phone agencyName city state"
    );

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found.",
      });
    }

    let wallet = await AgentWallet.findOne({
      agentId,
    });

    // CREATE WALLET IF NOT EXISTS
    if (!wallet) {
      wallet = await AgentWallet.create({
        agentId,
        balance: 0,
        totalCredit: 0,
        totalDebit: 0,
        isActive: true,
      });

      console.log(
        "NEW AGENT WALLET CREATED:",
        agentId
      );
    }

    console.log(
      "AGENT WALLET BALANCE:",
      wallet.balance
    );

    return res.status(200).json({
      success: true,
      agent,
      wallet,
    });
  } catch (error) {
    console.error(
      "GET AGENT WALLET ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to fetch agent wallet.",
    });
  }
};

// =====================================================
// ADMIN - ADD MONEY TO AGENT WALLET
// =====================================================

const addMoneyToAgentWallet = async (
  req,
  res
) => {
  try {
    const {
      agentId,
      amount,
      note,
    } = req.body;

    console.log("==========================================");
    console.log("ADD MONEY TO AGENT WALLET");
    console.log("AGENT ID:", agentId);
    console.log("AMOUNT:", amount);
    console.log("==========================================");

    if (
      !agentId ||
      !mongoose.Types.ObjectId.isValid(agentId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid agent ID is required.",
      });
    }

    const numericAmount =
      numberValue(amount);

    if (numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message:
          "Amount must be greater than 0.",
      });
    }

    const agent = await User.findOne({
      _id: agentId,
      role: "agent",
      isActive: true,
    });

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Active agent not found.",
      });
    }

    let wallet = await AgentWallet.findOne({
      agentId,
    });

    // CREATE WALLET
    if (!wallet) {
      wallet = await AgentWallet.create({
        agentId,
        balance: 0,
        totalCredit: 0,
        totalDebit: 0,
        isActive: true,
      });
    }

    const balanceBefore =
      numberValue(wallet.balance);

    const balanceAfter =
      balanceBefore + numericAmount;

    // UPDATE WALLET
    wallet.balance = balanceAfter;

    wallet.totalCredit =
      numberValue(wallet.totalCredit) +
      numericAmount;

    wallet.isActive = true;

    await wallet.save();

    // TRANSACTION
    const performedBy =
      getRequestUserId(req);

    const transaction =
      await WalletTransaction.create({
        agentId,

        type: "credit",

        amount: numericAmount,

        balanceBefore,

        balanceAfter,

        bookingId: null,

        bookingNumber: "",

        pnr: "",

        note:
          String(note || "").trim() ||
          "Amount added by admin.",

        performedBy:
          performedBy || null,

        performedByRole: "admin",
      });

    console.log(
      "WALLET CREDIT SUCCESS"
    );

    console.log(
      "BALANCE BEFORE:",
      balanceBefore
    );

    console.log(
      "AMOUNT ADDED:",
      numericAmount
    );

    console.log(
      "BALANCE AFTER:",
      balanceAfter
    );

    return res.status(200).json({
      success: true,

      message:
        `₹${numericAmount.toLocaleString(
          "en-IN"
        )} added to agent wallet successfully.`,

      wallet,

      transaction,
    });
  } catch (error) {
    console.error(
      "ADD MONEY TO AGENT WALLET ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to add money to agent wallet.",
    });
  }
};

// =====================================================
// AGENT - GET OWN WALLET
// =====================================================

const getMyWallet = async (
  req,
  res
) => {
  try {
    const agentId =
      getRequestUserId(req);

    console.log(
      "GET MY WALLET:",
      agentId
    );

    if (
      !agentId ||
      !mongoose.Types.ObjectId.isValid(
        agentId
      )
    ) {
      return res.status(401).json({
        success: false,
        message: "Agent login required.",
      });
    }

    const agent = await User.findOne({
      _id: agentId,
      role: "agent",
    }).select(
      "_id firstName lastName email phone agencyName city state"
    );

    if (!agent) {
      return res.status(403).json({
        success: false,
        message:
          "Only an agent can access this wallet.",
      });
    }

    let wallet = await AgentWallet.findOne({
      agentId,
    });

    if (!wallet) {
      wallet = await AgentWallet.create({
        agentId,
        balance: 0,
        totalCredit: 0,
        totalDebit: 0,
        isActive: true,
      });
    }

    return res.status(200).json({
      success: true,
      agent,
      wallet,
    });
  } catch (error) {
    console.error(
      "GET MY WALLET ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to fetch wallet.",
    });
  }
};

// =====================================================
// ADMIN - GET AGENT TRANSACTIONS
// =====================================================

const getWalletTransactions =
  async (req, res) => {
    try {
      const requestedAgentId =
        req.params.agentId;

      console.log("==========================================");
      console.log("GET WALLET TRANSACTIONS");
      console.log(
        "REQUESTED AGENT ID:",
        requestedAgentId
      );
      console.log("==========================================");

      if (
        !requestedAgentId ||
        !mongoose.Types.ObjectId.isValid(
          requestedAgentId
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Valid agent ID is required.",
        });
      }

      const agentId =
        requestedAgentId;

      const agent =
        await User.findOne({
          _id: agentId,
          role: "agent",
        }).select(
          "_id firstName lastName email agencyName"
        );

      if (!agent) {
        return res.status(404).json({
          success: false,
          message: "Agent not found.",
        });
      }

      const transactions =
        await WalletTransaction.find({
          agentId,
        })
          .populate(
            "performedBy",
            "firstName lastName email role"
          )
          .populate(
            "bookingId",
            "bookingId pnr total finalAmount"
          )
          .sort({
            createdAt: -1,
          });

      console.log(
        "WALLET TRANSACTIONS FOUND:",
        transactions.length
      );

      return res.status(200).json({
        success: true,
        count: transactions.length,
        transactions,
      });
    } catch (error) {
      console.error(
        "GET WALLET TRANSACTIONS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Unable to fetch wallet transactions.",
      });
    }
  };

// =====================================================
// CORRECT TOTAL CREDIT ONLY
// =====================================================

const correctTotalCredit = async (
  req,
  res
) => {
  try {
    const {
      agentId,
      totalCredit,
    } = req.body;

    if (
      !agentId ||
      !mongoose.Types.ObjectId.isValid(
        agentId
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Valid agent ID is required.",
      });
    }

    const newTotalCredit =
      Number(totalCredit);

    if (
      !Number.isFinite(
        newTotalCredit
      ) ||
      newTotalCredit < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a valid Total Credit.",
      });
    }

    const wallet =
      await AgentWallet.findOne({
        agentId,
        isActive: true,
      });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message:
          "Agent wallet not found.",
      });
    }

    const oldTotalCredit =
      Number(
        wallet.totalCredit || 0
      );

    // ONLY TOTAL CREDIT CHANGES
    wallet.totalCredit =
      newTotalCredit;

    // DO NOT CHANGE:
    // wallet.balance
    // wallet.totalDebit
    // WalletTransaction

    await wallet.save();

    console.log("==========================================");
    console.log("TOTAL CREDIT CORRECTED");
    console.log("AGENT ID:", agentId);
    console.log(
      "OLD TOTAL CREDIT:",
      oldTotalCredit
    );
    console.log(
      "NEW TOTAL CREDIT:",
      newTotalCredit
    );
    console.log(
      "AVAILABLE BALANCE:",
      wallet.balance
    );
    console.log(
      "TOTAL DEBIT:",
      wallet.totalDebit
    );
    console.log("==========================================");

    return res.status(200).json({
      success: true,

      message:
        `Total Credit corrected from ₹${oldTotalCredit.toLocaleString(
          "en-IN"
        )} to ₹${newTotalCredit.toLocaleString(
          "en-IN"
        )}. Available Balance was not changed.`,

      wallet,
    });
  } catch (error) {
    console.error(
      "CORRECT TOTAL CREDIT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to correct Total Credit.",
      error: error.message,
    });
  }
};

// =====================================================
// CORRECT AVAILABLE BALANCE ONLY
// =====================================================

const correctWalletBalance = async (
  req,
  res
) => {
  try {
    const {
      agentId,
      balance,
    } = req.body;

    console.log("==========================================");
    console.log(
      "CORRECT AVAILABLE BALANCE"
    );
    console.log("AGENT ID:", agentId);
    console.log("NEW BALANCE:", balance);
    console.log("==========================================");

    if (
      !agentId ||
      !mongoose.Types.ObjectId.isValid(
        agentId
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Valid agent ID is required.",
      });
    }

    const newBalance =
      Number(balance);

    if (
      !Number.isFinite(newBalance) ||
      newBalance < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a valid Available Balance.",
      });
    }

    const wallet =
      await AgentWallet.findOne({
        agentId,
        isActive: true,
      });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message:
          "Agent wallet not found.",
      });
    }

    const oldBalance =
      Number(wallet.balance || 0);

    // =================================================
    // ONLY AVAILABLE BALANCE CHANGES
    // =================================================

    wallet.balance =
      newBalance;

    // =================================================
    // DO NOT CHANGE
    // =================================================

    // wallet.totalCredit
    // wallet.totalDebit
    // WalletTransaction

    await wallet.save();

    console.log(
      "AVAILABLE BALANCE CORRECTED"
    );

    console.log(
      "OLD BALANCE:",
      oldBalance
    );

    console.log(
      "NEW BALANCE:",
      newBalance
    );

    console.log(
      "TOTAL CREDIT:",
      wallet.totalCredit
    );

    console.log(
      "TOTAL DEBIT:",
      wallet.totalDebit
    );

    return res.status(200).json({
      success: true,

      message:
        `Available Balance corrected from ₹${oldBalance.toLocaleString(
          "en-IN"
        )} to ₹${newBalance.toLocaleString(
          "en-IN"
        )}.`,

      wallet,
    });
  } catch (error) {
    console.error(
      "CORRECT AVAILABLE BALANCE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to correct Available Balance.",
      error: error.message,
    });
  }
};

// =====================================================
// ADMIN - DELETE WALLET TRANSACTION
// =====================================================

const deleteWalletTransaction = async (
  req,
  res
) => {
  try {
    const {
      transactionId,
    } = req.params;

    console.log("==========================================");
    console.log(
      "DELETE WALLET TRANSACTION"
    );
    console.log(
      "TRANSACTION ID:",
      transactionId
    );
    console.log("==========================================");

    if (
      !transactionId ||
      !mongoose.Types.ObjectId.isValid(
        transactionId
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Valid transaction ID is required.",
      });
    }

    const transaction =
      await WalletTransaction.findById(
        transactionId
      );

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message:
          "Transaction not found.",
      });
    }

    await WalletTransaction.findByIdAndDelete(
      transactionId
    );

    console.log(
      "WALLET TRANSACTION DELETED:",
      transactionId
    );

    return res.status(200).json({
      success: true,
      message:
        "Transaction deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE WALLET TRANSACTION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to delete wallet transaction.",
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getAgents,
  getAgentWallet,
  addMoneyToAgentWallet,
  getMyWallet,
  getWalletTransactions,

  // Total Credit correction
  correctTotalCredit,

  // Available Balance correction
  correctWalletBalance,

  // Transaction delete
  deleteWalletTransaction,
};
