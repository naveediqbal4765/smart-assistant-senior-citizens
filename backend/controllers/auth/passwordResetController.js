// ============================================================
// controllers/auth/passwordResetController.js - Password Reset Controller
// Handles password reset with OTP verification
// ============================================================

const User = require('../../models/User');
const {
  generateOTP,
  hashOTP,
  verifyOTP,
  isOTPExpired,
  getOTPExpiryTime,
  generateResetToken,
  hashResetToken,
  verifyResetToken,
  isResetTokenExpired,
  getResetTokenExpiryTime,
} = require('../../services/passwordResetService');
const { sendPasswordResetOTPEmail, sendPasswordChangedEmail } = require('../../services/emailService');
const { validateEmailFormat, normalizeEmail } = require('../../services/emailValidationService');

/**
 * POST /api/auth/forgot-password
 * Request password reset OTP
 * 
 * Request body:
 * {
 *   "email": "user@example.com"
 * }
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // ============================================================
    // Step 1: Validate email input
    // ============================================================
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your email address',
      });
    }

    // ============================================================
    // Step 2: Validate email format
    // ============================================================
    const emailValidation = validateEmailFormat(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: emailValidation.error,
      });
    }

    // ============================================================
    // Step 3: Normalize email
    // ============================================================
    const normalizedEmail = normalizeEmail(email);

    // ============================================================
    // Step 4: Find user
    // ============================================================
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      // User not found - return generic message for security
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, you will receive a password reset OTP.',
        data: {
          otpSent: true,
        },
      });
    }

    // ============================================================
    // Step 5: Check if user is verified
    // ============================================================
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email first before resetting password.',
      });
    }

    // ============================================================
    // Step 6: Generate OTP
    // ============================================================
    const otp = generateOTP();
    const hashedOTP = hashOTP(otp);

    // ============================================================
    // Step 7: Save OTP to database
    // ============================================================
    user.passwordReset = {
      otp: hashedOTP,
      expiresAt: getOTPExpiryTime(),
      verified: false,
    };
    await user.save();

    // ============================================================
    // Step 8: Send OTP via email
    // ============================================================
    const emailSent = await sendPasswordResetOTPEmail(user.email, otp);

    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: 'Error sending OTP. Please try again later.',
      });
    }

    // ============================================================
    // Step 9: Return success response
    // ============================================================
    res.status(200).json({
      success: true,
      message: 'Password reset OTP sent to your email. It will expire in 5 minutes.',
      data: {
        email: user.email,
        otpSent: true,
        expiresIn: '5 minutes',
      },
    });
  } catch (error) {
    console.error('❌ Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error requesting password reset. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * POST /api/auth/verify-reset-otp
 * Verify password reset OTP
 * 
 * Request body:
 * {
 *   "email": "user@example.com",
 *   "otp": "123456"
 * }
 */
const verifyResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // ============================================================
    // Step 1: Validate input
    // ============================================================
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and OTP',
      });
    }

    // ============================================================
    // Step 2: Validate email format
    // ============================================================
    const emailValidation = validateEmailFormat(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: emailValidation.error,
      });
    }

    // ============================================================
    // Step 3: Normalize email
    // ============================================================
    const normalizedEmail = normalizeEmail(email);

    // ============================================================
    // Step 4: Find user
    // ============================================================
    const user = await User.findOne({ email: normalizedEmail }).select('+passwordReset');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // ============================================================
    // Step 5: Check if OTP exists
    // ============================================================
    if (!user.passwordReset || !user.passwordReset.otp) {
      return res.status(400).json({
        success: false,
        message: 'No password reset request found. Please request a new OTP.',
      });
    }

    // ============================================================
    // Step 6: Check if OTP has expired
    // ============================================================
    if (isOTPExpired(user.passwordReset.expiresAt)) {
      user.passwordReset = null;
      await user.save();

      return res.status(401).json({
        success: false,
        message: 'OTP has expired. Please request a new one.',
      });
    }

    // ============================================================
    // Step 7: Verify OTP
    // ============================================================
    const isOTPValid = verifyOTP(otp, user.passwordReset.otp);

    if (!isOTPValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid OTP. Please try again.',
      });
    }

    // ============================================================
    // Step 8: Generate reset token
    // ============================================================
    const resetToken = generateResetToken();
    const hashedResetToken = hashResetToken(resetToken);

    // ============================================================
    // Step 9: Mark OTP as verified and save reset token
    // ============================================================
    user.passwordReset.verified = true;
    user.passwordReset.verificationToken = hashedResetToken;
    await user.save();

    // ============================================================
    // Step 10: Return success response with reset token
    // ============================================================
    res.status(200).json({
      success: true,
      message: 'OTP verified successfully. You can now reset your password.',
      data: {
        resetToken,
        verified: true,
      },
    });
  } catch (error) {
    console.error('❌ Verify reset OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying OTP. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * POST /api/auth/reset-password
 * Reset password with verified OTP
 * 
 * Request body:
 * {
 *   "email": "user@example.com",
 *   "resetToken": "reset_token",
 *   "newPassword": "newpassword123",
 *   "confirmPassword": "newpassword123"
 * }
 */
const resetPassword = async (req, res) => {
  try {
    const { email, resetToken, newPassword, confirmPassword } = req.body;

    // ============================================================
    // Step 1: Validate input
    // ============================================================
    if (!email || !resetToken || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // ============================================================
    // Step 2: Validate email format
    // ============================================================
    const emailValidation = validateEmailFormat(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: emailValidation.error,
      });
    }

    // ============================================================
    // Step 3: Check if passwords match
    // ============================================================
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
    }

    // ============================================================
    // Step 4: Validate password length
    // ============================================================
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters',
      });
    }

    if (newPassword.length > 128) {
      return res.status(400).json({
        success: false,
        message: 'Password is too long',
      });
    }

    // ============================================================
    // Step 5: Normalize email
    // ============================================================
    const normalizedEmail = normalizeEmail(email);

    // ============================================================
    // Step 6: Find user
    // ============================================================
    const user = await User.findOne({ email: normalizedEmail }).select('+passwordReset');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // ============================================================
    // Step 7: Check if password reset is verified
    // ============================================================
    if (!user.passwordReset || !user.passwordReset.verified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your OTP first',
      });
    }

    // ============================================================
    // Step 8: Verify reset token
    // ============================================================
    const isTokenValid = verifyResetToken(resetToken, user.passwordReset.verificationToken);

    if (!isTokenValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid reset token',
      });
    }

    // ============================================================
    // Step 9: Update password
    // ============================================================
    user.password = newPassword;
    user.passwordChangedAt = new Date();
    user.passwordReset = null; // Clear password reset data
    await user.save();

    // ============================================================
    // Step 10: Send password changed confirmation email
    // ============================================================
    await sendPasswordChangedEmail(user.email, user.fullName);

    // ============================================================
    // Step 11: Return success response
    // ============================================================
    res.status(200).json({
      success: true,
      message: 'Password reset successfully. Please log in with your new password.',
      data: {
        passwordReset: true,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('❌ Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting password. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * POST /api/auth/resend-reset-otp
 * Resend password reset OTP
 * 
 * Request body:
 * {
 *   "email": "user@example.com"
 * }
 */
const resendResetOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // ============================================================
    // Step 1: Validate email input
    // ============================================================
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your email address',
      });
    }

    // ============================================================
    // Step 2: Validate email format
    // ============================================================
    const emailValidation = validateEmailFormat(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: emailValidation.error,
      });
    }

    // ============================================================
    // Step 3: Normalize email
    // ============================================================
    const normalizedEmail = normalizeEmail(email);

    // ============================================================
    // Step 4: Find user
    // ============================================================
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, you will receive a password reset OTP.',
        data: {
          otpSent: true,
        },
      });
    }

    // ============================================================
    // Step 5: Generate new OTP
    // ============================================================
    const otp = generateOTP();
    const hashedOTP = hashOTP(otp);

    // ============================================================
    // Step 6: Save OTP to database
    // ============================================================
    user.passwordReset = {
      otp: hashedOTP,
      expiresAt: getOTPExpiryTime(),
      verified: false,
    };
    await user.save();

    // ============================================================
    // Step 7: Send OTP via email
    // ============================================================
    const emailSent = await sendPasswordResetOTPEmail(user.email, otp);

    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: 'Error sending OTP. Please try again later.',
      });
    }

    // ============================================================
    // Step 8: Return success response
    // ============================================================
    res.status(200).json({
      success: true,
      message: 'New OTP sent to your email. It will expire in 5 minutes.',
      data: {
        email: user.email,
        otpSent: true,
        expiresIn: '5 minutes',
      },
    });
  } catch (error) {
    console.error('❌ Resend reset OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resending OTP. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

module.exports = {
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  resendResetOTP,
};
