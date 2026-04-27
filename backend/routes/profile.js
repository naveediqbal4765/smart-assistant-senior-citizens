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
const googleMapsService = require("../services/googleMapsService");

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

// POST /api/profile/address-suggestions - Get address suggestions
router.post("/address-suggestions", protect, async (req, res) => {
  try {
    const { input, sessionToken } = req.body;

    if (!input) {
      return res.status(400).json({
        success: false,
        message: "Please provide an address input",
      });
    }

    const result = await googleMapsService.getAddressSuggestions(input, sessionToken);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    res.status(200).json({
      success: true,
      suggestions: result.suggestions,
      sessionToken: result.sessionToken,
    });
  } catch (error) {
    console.error("Address suggestions error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching address suggestions",
      error: error.message,
    });
  }
});

// POST /api/profile/place-details - Get place details
router.post("/place-details", protect, async (req, res) => {
  try {
    const { placeId, sessionToken } = req.body;

    if (!placeId) {
      return res.status(400).json({
        success: false,
        message: "Please provide a place ID",
      });
    }

    const result = await googleMapsService.getPlaceDetails(placeId, sessionToken);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    // Verify address is in Pakistan
    const isInPakistan = googleMapsService.verifyAddressInPakistan(
      result.addressComponents
    );

    if (!isInPakistan) {
      return res.status(400).json({
        success: false,
        message: "Address must be in Pakistan",
      });
    }

    // Extract address components
    const addressComponents = googleMapsService.extractAddressComponents(
      result.addressComponents
    );

    res.status(200).json({
      success: true,
      formattedAddress: result.formattedAddress,
      latitude: result.latitude,
      longitude: result.longitude,
      placeId: result.placeId,
      addressComponents: addressComponents,
      geometry: result.geometry,
    });
  } catch (error) {
    console.error("Place details error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching place details",
      error: error.message,
    });
  }
});

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
