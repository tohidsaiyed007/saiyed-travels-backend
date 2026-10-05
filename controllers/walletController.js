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

// =====================================================
// ADMIN - GET ALL AGENTS
// =====================================================

const getAgents = async (req, res) => {
  try {
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
      "_id firstName lastName email phone agencyName"
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

    // Agar wallet abhi create nahi hua
    if (!wallet) {
      wallet = await AgentWallet.create({
        agentId,
        balance: 0,
        totalCredit: 0,
        totalDebit: 0,
      });
    }

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
    const { agentId, amount, note } =
      req.body;

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

    if (
      numericAmount <= 0
    ) {
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
        message:
          "Active agent not found.",
      });
    }

    let wallet =
      await AgentWallet.findOne({
        agentId,
      });

    if (!wallet) {
      wallet =
        await AgentWallet.create({
          agentId,
          balance: 0,
          totalCredit: 0,
          totalDebit: 0,
        });
    }

    const balanceBefore =
      numberValue(wallet.balance);

    const balanceAfter =
      balanceBefore + numericAmount;

    wallet.balance =
      balanceAfter;

    wallet.totalCredit =
      numberValue(
        wallet.totalCredit
      ) + numericAmount;

    wallet.isActive = true;

    await wallet.save();

    // ================================================
    // TRANSACTION HISTORY
    // ================================================

    const transaction =
      await WalletTransaction.create({
        agentId,

        type: "credit",

        amount:
          numericAmount,

        balanceBefore,

        balanceAfter,

        bookingId: null,

        bookingNumber: "",

        pnr: "",

        note:
          String(note || "").trim() ||
          "Amount added by admin.",

        performedBy:
          req.user?._id ||
          req.user?.id ||
          null,

        performedByRole:
          "admin",
      });

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
      req.user?._id ||
      req.user?.id ||
      req.headers["x-user-id"];

    if (
      !agentId ||
      !mongoose.Types.ObjectId.isValid(
        agentId
      )
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Agent login required.",
      });
    }

    const agent =
      await User.findOne({
        _id: agentId,
        role: "agent",
      }).select(
        "_id firstName lastName email phone agencyName"
      );

    if (!agent) {
      return res.status(403).json({
        success: false,
        message:
          "Only an agent can access this wallet.",
      });
    }

    let wallet =
      await AgentWallet.findOne({
        agentId,
      });

    if (!wallet) {
      wallet =
        await AgentWallet.create({
          agentId,
          balance: 0,
          totalCredit: 0,
          totalDebit: 0,
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
// AGENT / ADMIN - GET TRANSACTIONS
// =====================================================

const getWalletTransactions =
  async (req, res) => {
    try {
      const requestedAgentId =
        req.params.agentId;

      let agentId;

      // ==============================================
      // ADMIN
      // ==============================================

      if (
        String(
          req.user?.role || ""
        ).toLowerCase() === "admin"
      ) {
        agentId =
          requestedAgentId;
      }

      // ==============================================
      // AGENT
      // ==============================================

      else {
        agentId =
          req.user?._id ||
          req.user?.id ||
          req.headers["x-user-id"];
      }

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
          message:
            "Agent not found.",
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

      return res.status(200).json({
        success: true,

        count:
          transactions.length,

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
// EXPORT
// =====================================================

module.exports = {
  getAgents,
  getAgentWallet,
  addMoneyToAgentWallet,
  getMyWallet,
  getWalletTransactions,
};