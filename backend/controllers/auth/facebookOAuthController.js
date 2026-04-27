// ============================================================
// controllers/auth/facebookOAuthController.js - Facebook OAuth Controller
// Handles Facebook OAuth login and signup
// ============================================================

const User = require('../../models/User');
const { verifyFacebookAccessToken, exchangeCodeForToken, verifyFacebookIdToken } = require('../../services/facebookOAuthService');
const { generateAccessToken, generateRefreshToken } = require('../../src/utils/jwtService');
const { normalizeEmail } = require('../../services/emailValidationService');

/**
 * POST /api/auth/facebook
 * Login or signup user with Facebook OAuth
 * 
 * Request body:
 * {
 *   "accessToken": "facebook_access_token",
 *   "rememberMe": true
 * }
 */
const facebookLogin = async (req, res) => {
  try {
    const { accessToken, idToken, rememberMe } = req.body;

    // ============================================================
    // Step 1: Validate input
    // ============================================================
    if (!accessToken && !idToken) {
      return res.status(400).json({
        success: false,
        message: 'Please provide Facebook access token or ID token',
      });
    }

    // ============================================================
    // Step 2: Verify Facebook token
    // ============================================================
    let facebookUserData;

    if (accessToken) {
      // Verify access token (preferred method)
      const verification = await verifyFacebookAccessToken(accessToken);
      if (!verification.success) {
        return res.status(401).json({
          success: false,
          message: 'Invalid Facebook access token',
        });
      }
      facebookUserData = verification.data;
    } else if (idToken) {
      // Verify ID token (fallback method)
      const verification = await verifyFacebookIdToken(idToken);
      if (!verification.success) {
        return res.status(401).json({
          success: false,
          message: 'Invalid Facebook ID token',
        });
      }
      facebookUserData = verification.data;
    }

    // ============================================================
    // Step 3: Normalize email
    // ============================================================
    const normalizedEmail = normalizeEmail(facebookUserData.email);

    // ============================================================
    // Step 4: Check if user exists
    // ============================================================
    let user = await User.findOne({
      $or: [
        { email: normalizedEmail },
        { facebookId: facebookUserData.facebookId },
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

      // Update Facebook ID if not set
      if (!user.facebookId) {
        user.facebookId = facebookUserData.facebookId;
      }

      // Update profile picture if not set
      if (!user.profilePicture && facebookUserData.profilePicture) {
        user.profilePicture = facebookUserData.profilePicture;
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
        message: 'Facebook login successful',
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
    // Create new user with Facebook data
    const crypto = require('crypto');
    const newUser = new User({
      email: normalizedEmail,
      fullName: facebookUserData.fullName,
      profilePicture: facebookUserData.profilePicture,
      facebookId: facebookUserData.facebookId,
      authProvider: 'facebook',
      isVerified: true, // Facebook emails are verified
      isActive: true,
      isDeleted: false,
      // Password is not set for OAuth users
      password: crypto.randomBytes(32).toString('hex'),
    });

    // Generate tokens
    const newAccessToken = generateAccessToken(newUser._id);
    const newRefreshToken = generateRefreshToken(newUser._id);

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
      message: 'Facebook signup successful. Please select your role.',
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
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
    console.error('❌ Facebook login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in with Facebook. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * POST /api/auth/facebook/callback
 * Facebook OAuth callback endpoint
 * 
 * Request body:
 * {
 *   "code": "authorization_code",
 *   "rememberMe": true
 * }
 */
const facebookCallback = async (req, res) => {
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
    // Step 2: Exchange code for access token
    // ============================================================
    const codeExchange = await exchangeCodeForToken(code);

    if (!codeExchange.success) {
      return res.status(401).json({
        success: false,
        message: 'Failed to exchange authorization code',
      });
    }

    const facebookUserData = codeExchange.data.facebookUser;

    // ============================================================
    // Step 3: Normalize email
    // ============================================================
    const normalizedEmail = normalizeEmail(facebookUserData.email);

    // ============================================================
    // Step 4: Check if user exists
    // ============================================================
    let user = await User.findOne({
      $or: [
        { email: normalizedEmail },
        { facebookId: facebookUserData.facebookId },
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

      // Update Facebook ID if not set
      if (!user.facebookId) {
        user.facebookId = facebookUserData.facebookId;
      }

      // Update profile picture if not set
      if (!user.profilePicture && facebookUserData.profilePicture) {
        user.profilePicture = facebookUserData.profilePicture;
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
        message: 'Facebook login successful',
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
      fullName: facebookUserData.fullName,
      profilePicture: facebookUserData.profilePicture,
      facebookId: facebookUserData.facebookId,
      authProvider: 'facebook',
      isVerified: true,
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
      message: 'Facebook signup successful. Please select your role.',
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
    console.error('❌ Facebook callback error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing Facebook callback. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

module.exports = {
  facebookLogin,
  facebookCallback,
};
