// ============================================================
// routes/profile.js - Profile Management Routes
// ============================================================

const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  getProfile,
  updateProfile,
  uploadProfilePicture,
  validateAddress,
  changePassword,
  deleteAccount,
} = require("../controllers/profile/profileController");
const {
  validatePersonalInfo,
  validateElderRole,
  validateCaregiverRole,
  validateVolunteerRole,
  validatePrivacySettings,
  validatePasswordChange,
  validateAddress: validateAddressRule,
  handleValidationErrors,
} = require("../middleware/profileValidation");
const { uploadProfilePicture: uploadMiddleware } = require("../middleware/fileUpload");

// ============================================================
// Profile Routes - All Protected
// ============================================================

// GET /api/profile - Fetch user profile
router.get("/", protect, getProfile);

// PUT /api/profile - Update user profile
router.put(
  "/",
  protect,
  [
    ...validatePersonalInfo,
    ...validatePrivacySettings,
    ...validateElderRole,
    ...validateCaregiverRole,
    ...validateVolunteerRole,
  ],
  handleValidationErrors,
  updateProfile
);

// POST /api/profile/picture - Upload profile picture
router.post(
  "/picture",
  protect,
  uploadMiddleware,
  uploadProfilePicture
);

// POST /api/profile/validate-address - Validate address with Google Maps
router.post(
  "/validate-address",
  protect,
  validateAddressRule,
  handleValidationErrors,
  validateAddress
);

// ============================================================
// Authentication Routes - Password & Account Management
// ============================================================

// POST /api/auth/change-password - Change password
router.post(
  "/auth/change-password",
  protect,
  validatePasswordChange,
  handleValidationErrors,
  changePassword
);

// POST /api/auth/delete-account - Delete account
router.post(
  "/auth/delete-account",
  protect,
  deleteAccount
);

module.exports = router;
