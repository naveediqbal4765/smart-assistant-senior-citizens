// ============================================================
// middleware/profileValidation.js - Profile Data Validation
// ============================================================

const { body, validationResult } = require("express-validator");

// ============================================================
// Validation Rules
// ============================================================

// Personal Information Validation
exports.validatePersonalInfo = [
  body("fullName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Full name must be between 2 and 100 characters"),
  body("phone")
    .optional()
    .matches(/^[0-9]{11}$/)
    .withMessage("Phone number must be exactly 11 digits"),
  body("dateOfBirth")
    .optional()
    .isISO8601()
    .withMessage("Invalid date of birth format"),
  body("address")
    .optional()
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage("Address must be between 5 and 500 characters"),
];

// Elder Role Validation
exports.validateElderRole = [
  body("livesAlone")
    .optional()
    .isBoolean()
    .withMessage("livesAlone must be a boolean"),
  body("hasMedicalIssues")
    .optional()
    .isBoolean()
    .withMessage("hasMedicalIssues must be a boolean"),
  body("medicalConditions")
    .optional()
    .isArray()
    .withMessage("medicalConditions must be an array"),
  body("locationPermission")
    .optional()
    .isBoolean()
    .withMessage("locationPermission must be a boolean"),
  body("emergencyContacts")
    .optional()
    .isArray()
    .withMessage("emergencyContacts must be an array"),
];

// Caregiver Role Validation
exports.validateCaregiverRole = [
  body("relationshipToElder")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Relationship must be between 2 and 100 characters"),
  body("linkedElderEmail")
    .optional()
    .isEmail()
    .withMessage("Invalid email format"),
  body("notificationsEnabled")
    .optional()
    .isBoolean()
    .withMessage("notificationsEnabled must be a boolean"),
];

// Volunteer Role Validation
exports.validateVolunteerRole = [
  body("affiliation")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Affiliation must be between 2 and 100 characters"),
  body("skills")
    .optional()
    .isArray()
    .withMessage("skills must be an array"),
  body("serviceRadius")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Service radius must be between 1 and 50 km"),
  body("availabilityDays")
    .optional()
    .isArray()
    .withMessage("availabilityDays must be an array"),
  body("volunteerLocationPermission")
    .optional()
    .isBoolean()
    .withMessage("volunteerLocationPermission must be a boolean"),
];

// Privacy Settings Validation
exports.validatePrivacySettings = [
  body("privacySettings.profileVisibility")
    .optional()
    .isIn(["public", "private", "friends-only"])
    .withMessage("Invalid profile visibility option"),
  body("privacySettings.healthDataSharing")
    .optional()
    .isBoolean()
    .withMessage("healthDataSharing must be a boolean"),
  body("privacySettings.locationSharing")
    .optional()
    .isBoolean()
    .withMessage("locationSharing must be a boolean"),
  body("privacySettings.emailNotifications")
    .optional()
    .isBoolean()
    .withMessage("emailNotifications must be a boolean"),
  body("privacySettings.smsNotifications")
    .optional()
    .isBoolean()
    .withMessage("smsNotifications must be a boolean"),
];

// Password Change Validation
exports.validatePasswordChange = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain uppercase, lowercase, and numbers"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Password confirmation is required")
    .custom((value, { req }) => value === req.body.newPassword)
    .withMessage("Passwords do not match"),
];

// Address Validation
exports.validateAddress = [
  body("address")
    .notEmpty()
    .withMessage("Address is required")
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage("Address must be between 5 and 500 characters"),
];

// ============================================================
// Validation Error Handler Middleware
// ============================================================
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};
