// ============================================================
// controllers/auth/googleOAuthController.js - Google OAuth Controller
// Handles Google OAuth login and signup
// ============================================================

const User = require('../../models/User');
const { verifyGoogleToken, verifyGoogleAccessToken } = require('../../services/googleOAuthService');
const { generateAccessToken, generateRefreshToken } = require('../../src/utils/jwtService');
const { normalizeEmail } = require('../../services/emailValidationService');

/**
 * POST /api/auth/google
 * Login or signup user with Google OAuth
 * 
 * Request body:
 * {
 *   "token": "google_id_token",
 *   "rememberMe": true
 * }
 */
const googleLogin = async (req, res) => {
  try {
    const { token, accessToken, rememberMe } = req.body;

    // ============================================================
    // Step 1: Validate input
    // ============================================================
    if (!token && !accessToken) {
      return res.status(400).json({
        success: false,
        message: 'Please provide Google token or access token',
      });
    }

    // ============================================================
    // Step 2: Verify Google token
    // ============================================================
    let googleUserData;

    if (token) {
      // Verify ID token (preferred method)
      const verification = await verifyGoogleToken(token);
      if (!verification.success) {
        return res.status(401).json({
          success: false,
          message: 'Invalid Google token',
        });
      }
      googleUserData = verification.data;
    } else if (accessToken) {
      // Verify access token (fallback method)
      const verification = await verifyGoogleAccessToken(accessToken);
      if (!verification.success) {
        return res.status(401).json({
          success: false,
          message: 'Invalid Google access token',
        });
      }
      googleUserData = verification.data;
    }

    // ============================================================
    // Step 3: Normalize email
    // ============================================================
    const normalizedEmail = normalizeEmail(googleUserData.email);

    // ============================================================
    // Step 4: Check if user exists
    // ============================================================
    let user = await User.findOne({
      $or: [
        { email: normalizedEmail },
        { googleId: googleUserData.googleId },
      ],
    });

    // ============================================================
    // Step 5: Handle existing user
    // ============================================================
    if (user) {
      // User exists - login
      
      // Check if account is active
      if (!user.isActive || user.isDeleted) {
        return res.status(403).json({
          success: false,
          message: 'Your account has been deactivated. Please contact support.',
        });
      }

      // Update Google ID if not set
      if (!user.googleId) {
        user.googleId = googleUserData.googleId;
      }

      // Update profile picture if not set
      if (!user.profilePicture && googleUserData.profilePicture) {
        user.profilePicture = googleUserData.profilePicture;
      }

      // Update last login
      user.lastLogin = new Date();

      // Generate tokens
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      // Handle Remember Me
      let rememberMeToken = null;
      if (rememberMe) {
        const crypto = require('crypto');
        rememberMeToken = crypto.randomBytes(32).toString('hex');
        user.rememberMeToken = rememberMeToken;
        user.rememberMeExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      }

      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Google login successful',
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
            isNewUser: false,
          },
        },
      });
    }

    // ============================================================
    // Step 6: Handle new user
    // ============================================================
    // Create new user with Google data
    const newUser = new User({
      email: normalizedEmail,
      fullName: googleUserData.fullName,
      profilePicture: googleUserData.profilePicture,
      googleId: googleUserData.googleId,
      authProvider: 'google',
      isVerified: googleUserData.emailVerified || true, // Google emails are verified
      isActive: true,
      isDeleted: false,
      // Password is not set for OAuth users
      password: undefined,
    });

    // Generate temporary password for OAuth users
    const crypto = require('crypto');
    newUser.password = crypto.randomBytes(32).toString('hex');

    // Generate tokens
    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    // Handle Remember Me
    let rememberMeToken = null;
    if (rememberMe) {
      rememberMeToken = crypto.randomBytes(32).toString('hex');
      newUser.rememberMeToken = rememberMeToken;
      newUser.rememberMeExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    }

    // Save new user
    await newUser.save();

    // ============================================================
    // Step 7: Return response for new user
    // ============================================================
    return res.status(201).json({
      success: true,
      message: 'Google signup successful. Please select your role.',
      data: {
        accessToken,
        refreshToken,
        rememberMeToken: rememberMe ? rememberMeToken : null,
        expiresIn: '15m',
        user: {
          userId: newUser._id,
          email: newUser.email,
          fullName: newUser.fullName,
          role: null, // New user needs to select role
          profilePicture: newUser.profilePicture,
          isNewUser: true,
        },
      },
    });
  } catch (error) {
    console.error('❌ Google login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in with Google. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * POST /api/auth/google/callback
 * Google OAuth callback endpoint
 * 
 * Request body:
 * {
 *   "code": "authorization_code",
 *   "rememberMe": true
 * }
 */
const googleCallback = async (req, res) => {
  try {
    const { code, rememberMe } = req.body;

    // ============================================================
    // Step 1: Validate code
    // ============================================================
    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Authorization code is required',
      });
    }

    // ============================================================
    // Step 2: Exchange code for tokens
    // ============================================================
    const { exchangeCodeForToken } = require('../../services/googleOAuthService');
    const codeExchange = await exchangeCodeForToken(code);

    if (!codeExchange.success) {
      return res.status(401).json({
        success: false,
        message: 'Failed to exchange authorization code',
      });
    }

    const googleUserData = codeExchange.data.googleUser;

    // ============================================================
    // Step 3: Normalize email
    // ============================================================
    const normalizedEmail = normalizeEmail(googleUserData.email);

    // ============================================================
    // Step 4: Check if user exists
    // ============================================================
    let user = await User.findOne({
      $or: [
        { email: normalizedEmail },
        { googleId: googleUserData.googleId },
      ],
    });

    // ============================================================
    // Step 5: Handle existing user
    // ============================================================
    if (user) {
      // User exists - login
      
      if (!user.isActive || user.isDeleted) {
        return res.status(403).json({
          success: false,
          message: 'Your account has been deactivated. Please contact support.',
        });
      }

      // Update Google ID if not set
      if (!user.googleId) {
        user.googleId = googleUserData.googleId;
      }

      // Update profile picture if not set
      if (!user.profilePicture && googleUserData.profilePicture) {
        user.profilePicture = googleUserData.profilePicture;
      }

      // Update last login
      user.lastLogin = new Date();

      // Generate tokens
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      // Handle Remember Me
      let rememberMeToken = null;
      if (rememberMe) {
        const crypto = require('crypto');
        rememberMeToken = crypto.randomBytes(32).toString('hex');
        user.rememberMeToken = rememberMeToken;
        user.rememberMeExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      }

      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Google login successful',
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
            isNewUser: false,
          },
        },
      });
    }

    // ============================================================
    // Step 6: Handle new user
    // ============================================================
    const crypto = require('crypto');
    const newUser = new User({
      email: normalizedEmail,
      fullName: googleUserData.fullName,
      profilePicture: googleUserData.profilePicture,
      googleId: googleUserData.googleId,
      authProvider: 'google',
      isVerified: googleUserData.emailVerified || true,
      isActive: true,
      isDeleted: false,
      password: crypto.randomBytes(32).toString('hex'),
    });

    // Generate tokens
    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    // Handle Remember Me
    let rememberMeToken = null;
    if (rememberMe) {
      rememberMeToken = crypto.randomBytes(32).toString('hex');
      newUser.rememberMeToken = rememberMeToken;
      newUser.rememberMeExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: 'Google signup successful. Please select your role.',
      data: {
        accessToken,
        refreshToken,
        rememberMeToken: rememberMe ? rememberMeToken : null,
        expiresIn: '15m',
        user: {
          userId: newUser._id,
          email: newUser.email,
          fullName: newUser.fullName,
          role: null,
          profilePicture: newUser.profilePicture,
          isNewUser: true,
        },
      },
    });
  } catch (error) {
    console.error('❌ Google callback error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing Google callback. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

module.exports = {
  googleLogin,
  googleCallback,
};
