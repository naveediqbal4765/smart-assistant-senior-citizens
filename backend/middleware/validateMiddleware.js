// ============================================================
// middleware/validateMiddleware.js - Request Validation Middleware
// Uses express-validator to validate and sanitize incoming data
// ============================================================

const { validationResult, body } = require("express-validator");

// ============================================================
// handleValidationErrors - Checks for validation errors and returns them
// Must be placed AFTER validation rules in route definitions
// ============================================================
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req); // Collect all validation errors

  if (!errors.isEmpty()) {
    // Return all validation errors as an array
    return res.status(400).json({
      success: false,
      message: "Validation failed. Please check your input.",
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next(); // No errors, proceed to controller
};

// ============================================================
// VALIDATION RULES - Reusable validation chains
// ============================================================

// Validate login request body
const validateLogin = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please enter a valid email address")
    .normalizeEmail(), // Lowercase and sanitize email

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 1 }).withMessage("Password cannot be empty"),

  handleValidationErrors, // Run error check after rules
];

// Validate signup request body (common fields for all roles)
const validateSignup = [
  body("fullName")
    .trim()
    .notEmpty().withMessage("Full name is required")
    .isLength({ min: 2, max: 100 }).withMessage("Name must be between 2 and 100 characters"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please enter a valid email address")
    .normalizeEmail(),

  body("phone")
    .trim()
    .notEmpty().withMessage("Phone number is required")
    .matches(/^\+?[\d\s\-()]{7,15}$/).withMessage("Please enter a valid phone number"),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    .matches(/[0-9]/).withMessage("Password must contain at least one number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage("Password must contain at least one special character"),

  body("confirmPassword")
    .notEmpty().withMessage("Please confirm your password")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match"); // Custom validator for password match
      }
      return true;
    }),

  body("role")
    .notEmpty().withMessage("Role is required")
    .isIn(["elder", "caregiver", "volunteer"]).withMessage("Role must be elder, caregiver, or volunteer"),

  body("nationalId")
    .optional()
    .matches(/^\d{13}$/).withMessage("National ID must be exactly 13 digits"), // Pakistani CNIC

  body("dateOfBirth")
    .optional()
    .isISO8601().withMessage("Please enter a valid date of birth"),

  handleValidationErrors,
];

// Validate OTP verification request
const validateOTP = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please enter a valid email address")
    .normalizeEmail(),

  body("otp")
    .trim()
    .notEmpty().withMessage("OTP is required")
    .isLength({ min: 6, max: 6 }).withMessage("OTP must be exactly 6 digits")
    .isNumeric().withMessage("OTP must contain only numbers"),

  handleValidationErrors,
];

// Validate password reset request
const validatePasswordReset = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please enter a valid email address")
    .normalizeEmail(),

  handleValidationErrors,
];

// Validate new password after OTP verification
const validateNewPassword = [
  body("password")
    .notEmpty().withMessage("New password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    .matches(/[0-9]/).withMessage("Password must contain at least one number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage("Password must contain at least one special character"),

  body("confirmPassword")
    .notEmpty().withMessage("Please confirm your new password")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  handleValidationErrors,
];

module.exports = {
  handleValidationErrors,
  validateLogin,
  validateSignup,
  validateOTP,
  validatePasswordReset,
  validateNewPassword,
};
