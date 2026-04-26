// ============================================================
// backend/src/routes/passwordReset.js - Password Reset Routes
// ============================================================

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { sendOTPEmail, sendPasswordResetConfirmation } = require('../utils/emailService');
const { generateOTP, getOTPExpiration, isOTPExpired, validateOTPFormat, generateVerificationToken } = require('../utils/otpService');
const rateLimit = require('express-rate-limit');

// Rate limiting for password reset requests (3 attempts per hour)
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: 'Too many password reset requests. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for OTP verification (5 attempts per 15 minutes)
const otpVerificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: 'Too many OTP verification attempts. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * POST /api/auth/password-reset/request
 * Request password reset - Send OTP to email
 */
router.post('/request', passwordResetLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal if email exists (security best practice)
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, an OTP has been sent.',
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiration = getOTPExpiration();

    // Save OTP to database
    user.passwordReset = {
      otp: otp,
      expiresAt: otpExpiration,
      verified: false,
    };
    await user.save();

    // Send OTP email
    await sendOTPEmail(email, otp);

    // Return success (don't reveal OTP in response)
    return res.status(200).json({
      success: true,
      message: 'OTP has been sent to your email. It will expire in 5 minutes.',
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process password reset request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * POST /api/auth/password-reset/verify-otp
 * Verify OTP code
 */
router.post('/verify-otp', otpVerificationLimiter, async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validate inputs
    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    if (!otp || !otp.trim()) {
      return res.status(400).json({
        success: false,
        message: 'OTP is required',
      });
    }

    // Validate OTP format
    if (!validateOTPFormat(otp)) {
      return res.status(400).json({
        success: false,
        message: 'OTP must be 6 digits',
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if password reset data exists
    if (!user.passwordReset) {
      return res.status(400).json({
        success: false,
        message: 'No password reset request found. Please request a new OTP.',
      });
    }

    // Check if OTP is expired
    if (isOTPExpired(user.passwordReset.expiresAt)) {
      user.passwordReset = undefined;
      await user.save();
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.',
      });
    }

    // Check if OTP matches (trim whitespace for comparison)
    const trimmedOTP = otp.trim();
    const storedOTP = user.passwordReset.otp.trim();
    
    if (storedOTP !== trimmedOTP) {
      console.log('OTP Mismatch Debug:', {
        received: trimmedOTP,
        stored: storedOTP,
        receivedLength: trimmedOTP.length,
        storedLength: storedOTP.length,
      });
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please try again.',
      });
    }

    // Mark OTP as verified
    user.passwordReset.verified = true;
    const verificationToken = generateVerificationToken();
    user.passwordReset.verificationToken = verificationToken;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      verificationToken: verificationToken,
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to verify OTP',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * POST /api/auth/password-reset/reset
 * Reset password with verification token
 */
router.post('/reset', async (req, res) => {
  try {
    const { email, verificationToken, newPassword, confirmPassword } = req.body;

    // Validate inputs
    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    if (!verificationToken || !verificationToken.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required',
      });
    }

    if (!newPassword || !newPassword.trim()) {
      return res.status(400).json({
        success: false,
        message: 'New password is required',
      });
    }

    if (!confirmPassword || !confirmPassword.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Confirm password is required',
      });
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least 8 characters, 1 uppercase, 1 number, and 1 symbol',
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if password reset data exists
    if (!user.passwordReset || !user.passwordReset.verified) {
      return res.status(400).json({
        success: false,
        message: 'Invalid password reset request. Please start over.',
      });
    }

    // Verify token
    if (user.passwordReset.verificationToken !== verificationToken) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification token',
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear password reset data
    user.password = hashedPassword;
    user.passwordReset = undefined;
    await user.save();

    // Send confirmation email
    await sendPasswordResetConfirmation(email);

    return res.status(200).json({
      success: true,
      message: 'Password has been reset successfully. Please log in with your new password.',
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to reset password',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

module.exports = router;
