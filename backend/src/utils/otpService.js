// ============================================================
// backend/src/utils/otpService.js - OTP Generation & Validation
// ============================================================

const crypto = require('crypto');

/**
 * Generate a 6-digit OTP code
 * @returns {string} - 6-digit OTP code
 */
const generateOTP = () => {
  // Generate random 6-digit number (000000-999999)
  const otp = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0');
  return otp;
};

/**
 * Generate OTP expiration time (5 minutes from now)
 * @returns {Date} - Expiration timestamp
 */
const getOTPExpiration = () => {
  const expirationTime = new Date();
  expirationTime.setMinutes(expirationTime.getMinutes() + 5); // 5 minutes
  return expirationTime;
};

/**
 * Check if OTP is expired
 * @param {Date} expirationTime - OTP expiration timestamp
 * @returns {boolean} - True if expired, false otherwise
 */
const isOTPExpired = (expirationTime) => {
  return new Date() > expirationTime;
};

/**
 * Validate OTP format (must be 6 digits)
 * @param {string} otp - OTP code to validate
 * @returns {boolean} - True if valid format, false otherwise
 */
const validateOTPFormat = (otp) => {
  const otpRegex = /^\d{6}$/;
  return otpRegex.test(otp);
};

/**
 * Generate verification token for password reset
 * @returns {string} - Random verification token
 */
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

module.exports = {
  generateOTP,
  getOTPExpiration,
  isOTPExpired,
  validateOTPFormat,
  generateVerificationToken,
};
