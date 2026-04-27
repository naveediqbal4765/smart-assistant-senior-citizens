// ============================================================
// services/passwordResetService.js - Password Reset Service
// Handles OTP generation, verification, and password reset
// ============================================================

const crypto = require('crypto');

/**
 * Generate a 6-digit OTP
 * @returns {string} - 6-digit OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Hash OTP for secure storage
 * @param {string} otp - OTP to hash
 * @returns {string} - Hashed OTP
 */
const hashOTP = (otp) => {
  return crypto.createHash('sha256').update(otp).digest('hex');
};

/**
 * Verify OTP by comparing with hashed version
 * @param {string} enteredOTP - OTP entered by user
 * @param {string} hashedOTP - Hashed OTP from database
 * @returns {boolean} - True if OTP matches
 */
const verifyOTP = (enteredOTP, hashedOTP) => {
  const enteredHash = crypto.createHash('sha256').update(enteredOTP).digest('hex');
  return enteredHash === hashedOTP;
};

/**
 * Check if OTP has expired
 * @param {Date} expiryTime - OTP expiry time
 * @returns {boolean} - True if OTP has expired
 */
const isOTPExpired = (expiryTime) => {
  return new Date() > expiryTime;
};

/**
 * Get OTP expiry time (5 minutes from now)
 * @returns {Date} - OTP expiry time
 */
const getOTPExpiryTime = () => {
  return new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
};

/**
 * Generate reset token
 * @returns {string} - Reset token
 */
const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Hash reset token for secure storage
 * @param {string} token - Token to hash
 * @returns {string} - Hashed token
 */
const hashResetToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Verify reset token
 * @param {string} enteredToken - Token entered by user
 * @param {string} hashedToken - Hashed token from database
 * @returns {boolean} - True if token matches
 */
const verifyResetToken = (enteredToken, hashedToken) => {
  const enteredHash = crypto.createHash('sha256').update(enteredToken).digest('hex');
  return enteredHash === hashedToken;
};

/**
 * Get reset token expiry time (30 minutes from now)
 * @returns {Date} - Reset token expiry time
 */
const getResetTokenExpiryTime = () => {
  return new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
};

/**
 * Check if reset token has expired
 * @param {Date} expiryTime - Token expiry time
 * @returns {boolean} - True if token has expired
 */
const isResetTokenExpired = (expiryTime) => {
  return new Date() > expiryTime;
};

module.exports = {
  generateOTP,
  hashOTP,
  verifyOTP,
  isOTPExpired,
  getOTPExpiryTime,
  generateResetToken,
  hashResetToken,
  verifyResetToken,
  isResetTokenExpired,
  getResetTokenExpiryTime
};
