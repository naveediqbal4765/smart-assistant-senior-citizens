// ============================================================
// backend/routes/googleAuth.js
// Google OAuth Authentication Routes
// Handles Google token verification and user creation/login
// ============================================================

const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const Elder = require("../models/Elder");
const Caregiver = require("../models/Caregiver");
const Volunteer = require("../models/Volunteer");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../src/utils/jwtService");
const {
  generateRememberMeToken,
  getRememberMeExpiration,
} = require("../src/utils/rememberMeService");

const router = express.Router();

// Initialize Google OAuth Client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ============================================================
// POST /auth/google - Google OAuth Login/Signup
// ============================================================
router.post("/google", async (req, res) => {
  try {
    const { token, rememberMe } = req.body;

    // Validate input
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Google token is required",
      });
    }

    // Verify Google token
    let ticket;
    try {
      ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
    } catch (error) {
      console.error("[Google Auth] Token verification failed:", error.message);
      return res.status(401).json({
        success: false,
        message: "Invalid Google token",
      });
    }

    // Extract user information from token
    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email not provided by Google",
      });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // User exists - login
      console.log(`[Google Auth] User ${email} logged in via Google`);

      // Update last login
      user.lastLogin = new Date();
      user.googleId = googleId; // Store Google ID if not already stored
      await user.save();
    } else {
      // User doesn't exist - create new user
      console.log(`[Google Auth] Creating new user ${email} via Google`);

      // Create user
      user = await User.create({
        fullName: name || email.split("@")[0],
        email,
        googleId,
        profilePicture: picture,
        isVerified: true, // Google verified email
        password: null, // No password for OAuth users
      });

      // Create default Elder profile (can be changed later)
      await Elder.create({
        userId: user._id,
        livesAlone: true,
        emergencyContacts: [],
        medicalConditions: [],
        hasMedicalIssues: false,
        locationPermission: false,
      });
    }

    // Generate JWT tokens
    const accessToken = generateAccessToken(user._id, user.email, user.role);
    const refreshTokenData = generateRefreshToken(user._id);

    // Update user with refresh token
    user.refreshToken = refreshTokenData.token;
    user.refreshTokenExpiry = refreshTokenData.expiresAt;
    user.refreshTokenFamily = refreshTokenData.family;
    user.refreshTokenRotationCount = 0;

    // Generate Remember Me token if requested
    let rememberMeToken = null;
    if (rememberMe) {
      rememberMeToken = generateRememberMeToken();
      user.rememberMeToken = rememberMeToken;
      user.rememberMeExpiry = getRememberMeExpiration();
      user.rememberMeLastUsed = new Date();
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Google login successful",
      data: {
        accessToken,
        refreshToken: refreshTokenData.token,
        rememberMeToken: rememberMe ? rememberMeToken : null,
        expiresIn: "15m",
        user: {
          userId: user._id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          profilePicture: user.profilePicture,
          isNewUser: !user.lastLogin || user.lastLogin === new Date(),
        },
      },
    });
  } catch (error) {
    console.error("[Google Auth] Error:", error);
    res.status(500).json({
      success: false,
      message: "Error processing Google login",
      error: error.message,
    });
  }
});

// ============================================================
// POST /auth/google/verify - Verify Google Token
// ============================================================
router.post("/google/verify", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Google token is required",
      });
    }

    // Verify token
    let ticket;
    try {
      ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid Google token",
      });
    }

    const payload = ticket.getPayload();

    res.status(200).json({
      success: true,
      message: "Token verified successfully",
      data: {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        googleId: payload.sub,
        isVerified: true,
      },
    });
  } catch (error) {
    console.error("[Google Auth] Verification error:", error);
    res.status(500).json({
      success: false,
      message: "Error verifying token",
      error: error.message,
    });
  }
});

// ============================================================
// POST /auth/google/link - Link Google Account to Existing User
// ============================================================
router.post("/google/link", async (req, res) => {
  try {
    const { token, userId } = req.body;

    if (!token || !userId) {
      return res.status(400).json({
        success: false,
        message: "Token and userId are required",
      });
    }

    // Verify Google token
    let ticket;
    try {
      ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid Google token",
      });
    }

    const payload = ticket.getPayload();
    const { email: googleEmail, sub: googleId } = payload;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if Google ID is already linked to another user
    const existingUser = await User.findOne({ googleId });
    if (existingUser && existingUser._id.toString() !== userId) {
      return res.status(409).json({
        success: false,
        message: "This Google account is already linked to another user",
      });
    }

    // Link Google account
    user.googleId = googleId;
    if (!user.profilePicture && payload.picture) {
      user.profilePicture = payload.picture;
    }
    await user.save();

    res.status(200).json({
      success: true,
      message: "Google account linked successfully",
      data: {
        userId: user._id,
        email: user.email,
        googleId: user.googleId,
      },
    });
  } catch (error) {
    console.error("[Google Auth] Link error:", error);
    res.status(500).json({
      success: false,
      message: "Error linking Google account",
      error: error.message,
    });
  }
});

// ============================================================
// POST /auth/google/unlink - Unlink Google Account
// ============================================================
router.post("/google/unlink", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user has password (can't unlink if no password)
    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "Cannot unlink Google account without a password set",
      });
    }

    // Unlink Google account
    user.googleId = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Google account unlinked successfully",
      data: {
        userId: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("[Google Auth] Unlink error:", error);
    res.status(500).json({
      success: false,
      message: "Error unlinking Google account",
      error: error.message,
    });
  }
});

module.exports = router;
