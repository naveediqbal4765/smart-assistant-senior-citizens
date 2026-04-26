// ============================================================
// backend/src/utils/rememberMeService.js
// Remember Me Token Generation and Validation Service
// ============================================================

const crypto = require("crypto");

/**
 * Generate a secure Remember Me token
 * Token is a 64-character hex string (256 bits of randomness)
 * @returns {string} Secure random token
 */
const generateRememberMeToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

/**
 * Get Remember Me token expiration date (30 days from now)
 * @returns {Date} Expiration date 30 days in the future
 */
const getRememberMeExpiration = () => {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 30); // 30 days
  return expirationDate;
};

/**
 * Check if Remember Me token is expired
 * @param {Date} expiryDate - Token expiration date
 * @returns {boolean} True if token is expired, false otherwise
 */
const isRememberMeTokenExpired = (expiryDate) => {
  if (!expiryDate) return true;
  return new Date() > expiryDate;
};

/**
 * Refresh Remember Me token expiration
 * Extends the token expiration by 30 days from current time
 * This is called every time the token is used for auto-login
 * @param {Date} currentExpiry - Current expiration date
 * @returns {Date} New expiration date (30 days from now)
 */
const refreshRememberMeExpiration = (currentExpiry) => {
  // Only refresh if token is still valid (not expired)
  if (isRememberMeTokenExpired(currentExpiry)) {
    return null; // Token is expired, cannot refresh
  }

  const newExpiryDate = new Date();
  newExpiryDate.setDate(newExpiryDate.getDate() + 30); // Extend by 30 days
  return newExpiryDate;
};

/**
 * Validate Remember Me token format
 * Token should be a 64-character hex string
 * @param {string} token - Token to validate
 * @returns {boolean} True if token format is valid
 */
const validateRememberMeTokenFormat = (token) => {
  if (!token || typeof token !== "string") return false;
  // Token should be 64 hex characters (32 bytes * 2)
  return /^[a-f0-9]{64}$/.test(token);
};

module.exports = {
  generateRememberMeToken,
  getRememberMeExpiration,
  isRememberMeTokenExpired,
  refreshRememberMeExpiration,
  validateRememberMeTokenFormat,
};
