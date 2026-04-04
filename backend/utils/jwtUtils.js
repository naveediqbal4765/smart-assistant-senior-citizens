// ============================================================
// utils/jwtUtils.js - JWT Token Generation Utilities
// Handles creation of access tokens and refresh tokens
// ============================================================

const jwt = require("jsonwebtoken");

// ============================================================
// generateAccessToken - Creates a short-lived JWT access token
// @param {string} userId - MongoDB user _id
// @param {string} role - User role (elder/caregiver/volunteer)
// @returns {string} Signed JWT token
// ============================================================
const generateAccessToken = (userId, role) => {
  return jwt.sign(
    {
      id: userId,   // User's MongoDB ObjectId
      role: role,   // User's role for RBAC
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || "7d", // Token expires in 7 days by default
    }
  );
};

// ============================================================
// generateRefreshToken - Creates a long-lived refresh token
// Used to get new access tokens without re-login
// @param {string} userId - MongoDB user _id
// @returns {string} Signed refresh JWT token
// ============================================================
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRE || "30d", // Refresh token lasts 30 days
    }
  );
};

// ============================================================
// sendTokenResponse - Sends JWT token in response
// Attaches token to response and sends user data
// @param {Object} user - Mongoose user document
// @param {number} statusCode - HTTP status code
// @param {Object} res - Express response object
// @param {string} message - Success message
// ============================================================
const sendTokenResponse = (user, statusCode, res, message = "Success") => {
  // Generate access token
  const accessToken = generateAccessToken(user._id, user.role);

  // Generate refresh token
  const refreshToken = generateRefreshToken(user._id);

  // Remove sensitive fields before sending user data
  const userResponse = {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    profilePicture: user.profilePicture,
    isVerified: user.isVerified,
    authProvider: user.authProvider,
    // Include role-specific data
    ...(user.role === "elder" && { elderData: user.elderData }),
    ...(user.role === "caregiver" && { caregiverData: user.caregiverData }),
    ...(user.role === "volunteer" && { volunteerData: user.volunteerData }),
  };

  res.status(statusCode).json({
    success: true,
    message,
    accessToken,
    refreshToken,
    user: userResponse,
  });
};

module.exports = { generateAccessToken, generateRefreshToken, sendTokenResponse };
