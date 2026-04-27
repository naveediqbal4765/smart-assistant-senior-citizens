// ============================================================
// middleware/signupValidation.js - Signup Validation Rules
// ============================================================

const { body, validationResult } = require("express-validator");

// ============================================================
// Signup Validation Rules
// ============================================================
exports.validateSignup = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Full name must be between 2 and 100 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain uppercase, lowercase, and numbers"),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Password confirmation is required")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),

  body("phone")
    .optional()
    .trim()
    .matches(/^[0-9]{11}$/)
    .withMessage("Phone number must be exactly 11 digits"),

  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["elder", "caregiver", "volunteer"])
    .withMessage("Invalid role. Must be elder, caregiver, or volunteer"),

  body("locationPermission")
    .optional()
    .isBoolean()
    .withMessage("Location permission must be a boolean"),

  body("latitude")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be between -90 and 90"),

  body("longitude")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be between -180 and 180"),

  body("accuracy")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Accuracy must be a positive number"),

  body("address")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Address cannot exceed 500 characters"),
];

// ============================================================
// Signup with Location Validation
// ============================================================
exports.validateSignupWithLocation = [
  ...exports.validateSignup,

  // Additional validation for location fields
  body("latitude")
    .if(() => body("locationPermission").equals("true"))
    .notEmpty()
    .withMessage("Latitude is required when location permission is granted")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be between -90 and 90"),

  body("longitude")
    .if(() => body("locationPermission").equals("true"))
    .notEmpty()
    .withMessage("Longitude is required when location permission is granted")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be between -180 and 180"),
];

// ============================================================
// Validation Error Handler
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
