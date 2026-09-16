
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const protect = async (req, res, next) => {

  try {

    // --------------------------------------
    // Get Authorization Header
    // --------------------------------------

    const authHeader =
      req.headers.authorization;


    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {

      return res.status(401).json({

        success: false,

        message:
          "Not authorized. Please login.",

      });

    }


    // --------------------------------------
    // Get Token
    // --------------------------------------

    const token =
      authHeader.split(" ")[1];


    if (!token) {

      return res.status(401).json({

        success: false,

        message:
          "Authentication token is missing.",

      });

    }


    // --------------------------------------
    // Verify JWT
    // --------------------------------------

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );


    // --------------------------------------
    // Find User
    // --------------------------------------

    const user =
      await User.findById(
        decoded.id
      ).select("-password");


    if (!user) {

      return res.status(401).json({

        success: false,

        message:
          "User account not found.",

      });

    }


    // --------------------------------------
    // Active Account Check
    // --------------------------------------

    if (!user.isActive) {

      return res.status(403).json({

        success: false,

        message:
          "Your account has been disabled.",

      });

    }


    // --------------------------------------
    // Attach User To Request
    // --------------------------------------

    req.user = user;


    // --------------------------------------
    // Continue
    // --------------------------------------

    next();


  } catch (error) {

    console.error(
      "Authentication Error:",
      error
    );


    // Invalid / expired token

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {

      return res.status(401).json({

        success: false,

        message:
          "Invalid or expired authentication token.",

      });

    }


    return res.status(500).json({

      success: false,

      message:
        "Server error during authentication.",

    });

  }

};



// ==========================================
// ADMIN ONLY
// ==========================================

const adminOnly = (
  req,
  res,
  next
) => {

  if (
    !req.user ||
    req.user.role !== "admin"
  ) {

    return res.status(403).json({

      success: false,

      message:
        "Admin access required.",

    });

  }


  next();

};



// ==========================================
// AGENT ONLY
// ==========================================

const agentOnly = (
  req,
  res,
  next
) => {

  if (
    !req.user ||
    req.user.role !== "agent"
  ) {

    return res.status(403).json({

      success: false,

      message:
        "Travel Agent access required.",

    });

  }


  next();

};



// ==========================================
// CUSTOMER ONLY
// ==========================================

const customerOnly = (
  req,
  res,
  next
) => {

  if (
    !req.user ||
    req.user.role !== "customer"
  ) {

    return res.status(403).json({

      success: false,

      message:
        "Customer access required.",

    });

  }


  next();

};



// ==========================================
// EXPORT
// ==========================================

module.exports = {

  protect,

  adminOnly,

  agentOnly,

  customerOnly,

};