// ============================================================
// backend/src/utils/jwtService.js
// JWT Token Generation and Validation Service
// Handles access tokens, refresh tokens, and token rotation
// ============================================================

const jwt = require("jsonwebtoken");
const crypto = require("crypto");

/**
 * Generate JWT Access Token
 * Short-lived token (15 minutes) for API authentication
 *
 * @param {string} userId - User ID
 * @param {string} email - User email
 * @param {string} role - User role (elder, caregiver, volunteer)
 * @returns {string} Signed JWT access token
 */
const generateAccessToken = (userId, email, role) => {
  const payload = {
    userId,
    email,
    role,
    type: "access",
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "15m", // 15 minutes
    issuer: "smart-assistant",
    audience: "smart-assistant-app",
  });

  return token;
};

/**
 * Generate JWT Refresh Token
 * Long-lived token (7 days) for generating new access tokens
 * Stored in database for validation and rotation
 *
 * @param {string} userId - User ID
 * @param {string} tokenFamily - Token family ID for rotation detection
 * @returns {Object} { token, expiresAt, family }
 */
const generateRefreshToken = (userId, tokenFamily = null) => {
  // Generate token family if not provided (for first refresh token)
  const family = tokenFamily || crypto.randomBytes(16).toString("hex");

  const payload = {
    userId,
    type: "refresh",
    family, // Token family for rotation detection
  };

  const token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d", // 7 days
    issuer: "smart-assistant",
    audience: "smart-assistant-app",
  });

  // Calculate expiration date
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

  return {
    token,
    expiresAt,
    family,
  };
};

/**
 * Verify JWT Access Token
 * Validates token signature and expiration
 *
 * @param {string} token - JWT token to verify
 * @returns {Object|null} Decoded token payload or null if invalid
 */
const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: "smart-assistant",
      audience: "smart-assistant-app",
    });

    // Ensure it's an access token
    if (decoded.type !== "access") {
      return null;
    }

    return decoded;
  } catch (error) {
    console.error("[JWT Service] Access token verification failed:", error.message);
    return null;
  }
};

/**
 * Verify JWT Refresh Token
 * Validates token signature and expiration
 *
 * @param {string} token - JWT refresh token to verify
 * @returns {Object|null} Decoded token payload or null if invalid
 */
const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET, {
      issuer: "smart-assistant",
      audience: "smart-assistant-app",
    });

    // Ensure it's a refresh token
    if (decoded.type !== "refresh") {
      return null;
    }

    return decoded;
  } catch (error) {
    console.error("[JWT Service] Refresh token verification failed:", error.message);
    return null;
  }
};

/**
 * Decode JWT without verification
 * Used to extract payload from expired tokens
 *
 * @param {string} token - JWT token to decode
 * @returns {Object|null} Decoded payload or null if invalid
 */
const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    console.error("[JWT Service] Token decode failed:", error.message);
    return null;
  }
};

/**
 * Check if token is expired
 *
 * @param {string} token - JWT token
 * @returns {boolean} True if token is expired
 */
const isTokenExpired = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) {
      return true;
    }

    // exp is in seconds, Date.now() is in milliseconds
    const expirationTime = decoded.exp * 1000;
    return Date.now() >= expirationTime;
  } catch (error) {
    return true;
  }
};

/**
 * Get time until token expiration
 *
 * @param {string} token - JWT token
 * @returns {number} Milliseconds until expiration (0 if expired)
 */
const getTokenExpirationTime = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) {
      return 0;
    }

    const expirationTime = decoded.exp * 1000;
    const timeRemaining = expirationTime - Date.now();
    return Math.max(0, timeRemaining);
  } catch (error) {
    return 0;
  }
};

/**
 * Generate secure random token for token blacklist
 * Used for logout token revocation
 *
 * @returns {string} 64-character hex token
 */
const generateTokenBlacklistId = () => {
  return crypto.randomBytes(32).toString("hex");
};

/**
 * Validate token format
 * Checks if token is a valid JWT structure
 *
 * @param {string} token - Token to validate
 * @returns {boolean} True if token has valid JWT format
 */
const isValidTokenFormat = (token) => {
  if (!token || typeof token !== "string") {
    return false;
  }

  // JWT format: header.payload.signature
  const parts = token.split(".");
  return parts.length === 3;
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken,
  isTokenExpired,
  getTokenExpirationTime,
  generateTokenBlacklistId,
  isValidTokenFormat,
};
