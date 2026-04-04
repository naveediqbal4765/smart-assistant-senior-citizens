// ============================================================
// routes/authRoutes.js - Authentication API Routes
// All routes prefixed with /api/auth
// ============================================================

const express = require("express");
const router = express.Router();

// Import controller functions
const {
  login,
  signup,
  verifyOTP,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  resendOTP,
  oauthLogin,
  getMe,
  deleteAccount,
} = require("../controllers/auth/authController");

// Import middleware
const { protect } = require("../middleware/authMiddleware");
const {
  validateLogin,
  validateSignup,
  validateOTP,
  validatePasswordReset,
  validateNewPassword,
} = require("../middleware/validateMiddleware");

// ============================================================
// PUBLIC ROUTES (No authentication required)
// ============================================================

// POST /api/auth/login - Login with email and password
router.post("/login", validateLogin, login);

// POST /api/auth/signup - Register new user (elder/caregiver/volunteer)
router.post("/signup", validateSignup, signup);

// POST /api/auth/verify-otp - Verify email with OTP after signup
router.post("/verify-otp", validateOTP, verifyOTP);

// POST /api/auth/forgot-password - Request password reset OTP
router.post("/forgot-password", validatePasswordReset, forgotPassword);

// POST /api/auth/verify-reset-otp - Verify OTP for password reset
router.post("/verify-reset-otp", validateOTP, verifyResetOTP);

// POST /api/auth/reset-password - Set new password after OTP verification
router.post("/reset-password", validateNewPassword, resetPassword);

// POST /api/auth/resend-otp - Resend OTP to email
router.post("/resend-otp", resendOTP);

// POST /api/auth/oauth - OAuth login/signup (Google, Facebook, Apple)
router.post("/oauth", oauthLogin);

// ============================================================
// PRIVATE ROUTES (Require valid JWT token)
// ============================================================

// GET /api/auth/me - Get current logged-in user's profile
router.get("/me", protect, getMe);

// DELETE /api/auth/delete-account - Soft delete user account
router.delete("/delete-account", protect, deleteAccount);

module.exports = router;
