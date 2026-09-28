const express = require("express");

const {
  signup,
  login,
  forgotPassword,
  verifyOTP,
  resetPassword,
} = require("../controllers/authController");

const router =
  express.Router();

// ==========================================
// SIGNUP
// AGENT USES THIS
// ==========================================

router.post(
  "/signup",
  signup
);

// ==========================================
// LOGIN
// CUSTOMER / AGENT / ADMIN
// ==========================================

router.post(
  "/login",
  login
);

// ==========================================
// FORGOT PASSWORD
// ==========================================

router.post(
  "/forgot-password",
  forgotPassword
);

// ==========================================
// VERIFY OTP
// ==========================================

router.post(
  "/verify-otp",
  verifyOTP
);

// ==========================================
// RESET PASSWORD
// ==========================================

router.post(
  "/reset-password",
  resetPassword
);

module.exports = router;