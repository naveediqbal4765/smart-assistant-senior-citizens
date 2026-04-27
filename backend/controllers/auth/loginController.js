// ============================================================
// controllers/auth/loginController.js - Login Controller
// Handles email/password login with strict validation
// ============================================================

const User = require('../../models/User');
const { validateEmailFormat, validatePasswordFormat, normalizeEmail } = require('../../services/emailValidationService');
const { generateAccessToken, generateRefreshToken } = require('../../src/utils/jwtService');

/**
 * POST /api/auth/login
 * Login user with email and password
 * 
 * Request body:
 * {
 *   "email": "user@example.com",
 *   "password": "password123",
 *   "rememberMe": true
 * }
 */
const login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    // ============================================================
    // Step 1: Validate input
    // ============================================================
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // ============================================================
    // Step 2: Validate email format (STRICT)
    // ============================================================
    const emailValidation = validateEmailFormat(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: emailValidation.error, // "Invalid email or password"
      });
    }

    // ============================================================
    // Step 3: Validate password format
    // ============================================================
    const passwordValidation = validatePasswordFormat(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // ============================================================
    // Step 4: Normalize email
    // ============================================================
    const normalizedEmail = normalizeEmail(email);

    // ============================================================
    // Step 5: Check if user exists
    // ============================================================
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      // User not found - return generic error message for security
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // ============================================================
    // Step 6: Check if user is verified
    // ============================================================
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email first. Check your inbox for the verification OTP.',
        data: {
          email: user.email,
          needsVerification: true,
        },
      });
    }

    // ============================================================
    // Step 7: Check if user account is active
    // ============================================================
    if (!user.isActive || user.isDeleted) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.',
      });
    }

    // ============================================================
    // Step 8: Verify password
    // ============================================================
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      // Password is incorrect - return specific error message
      return res.status(401).json({
        success: false,
        message: 'Incorrect password. Do you want to reset?',
        data: {
          email: user.email,
          passwordIncorrect: true,
        },
      });
    }

    // ============================================================
    // Step 9: Check if user has selected a role
    // ============================================================
    if (!user.role) {
      return res.status(403).json({
        success: false,
        message: 'Please complete your profile by selecting a role.',
        data: {
          userId: user._id,
          email: user.email,
          needsRoleSelection: true,
        },
      });
    }

    // ============================================================
    // Step 10: Generate tokens
    // ============================================================
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // ============================================================
    // Step 11: Handle Remember Me
    // ============================================================
    let rememberMeToken = null;
    if (rememberMe) {
      const crypto = require('crypto');
      rememberMeToken = crypto.randomBytes(32).toString('hex');
      user.rememberMeToken = rememberMeToken;
      user.rememberMeExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      user.rememberMeLastUsed = new Date();
    }

    // ============================================================
    // Step 12: Update last login
    // ============================================================
    user.lastLogin = new Date();
    await user.save();

    // ============================================================
    // Step 13: Return success response
    // ============================================================
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        accessToken,
        refreshToken,
        rememberMeToken: rememberMe ? rememberMeToken : null,
        expiresIn: '15m',
        user: {
          userId: user._id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          profilePicture: user.profilePicture,
        },
      },
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

module.exports = {
  login,
};
