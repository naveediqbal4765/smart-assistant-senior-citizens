// ============================================================
// backend/routes/facebookAuth.js
// Facebook OAuth Authentication Routes
// Handles Facebook token verification and user creation/login
// ============================================================

const express = require("express");
const axios = require("axios");
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

// ============================================================
// POST /auth/facebook - Facebook OAuth Login/Signup
// ============================================================
router.post("/facebook", async (req, res) => {
  try {
    const { token, rememberMe } = req.body;

    // Validate input
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Facebook token is required",
      });
    }

    // Verify Facebook token
    let facebookUser;
    try {
      // Get user info from Facebook Graph API
      const response = await axios.get(
        `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${token}`
      );

      facebookUser = response.data;

      if (!facebookUser.id) {
        throw new Error("Invalid Facebook token");
      }
    } catch (error) {
      console.error("[Facebook Auth] Token verification failed:", error.message);
      return res.status(401).json({
        success: false,
        message: "Invalid Facebook token",
      });
    }

    // Extract user information
    const { id: facebookId, name, email, picture } = facebookUser;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email not provided by Facebook",
      });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // User exists - login
      console.log(`[Facebook Auth] User ${email} logged in via Facebook`);

      // Update last login
      user.lastLogin = new Date();
      user.facebookId = facebookId; // Store Facebook ID if not already stored
      await user.save();
    } else {
      // User doesn't exist - create new user
      console.log(`[Facebook Auth] Creating new user ${email} via Facebook`);

      // Create user
      user = await User.create({
        fullName: name || email.split("@")[0],
        email,
        facebookId,
        profilePicture: picture?.data?.url || null,
        isVerified: true, // Facebook verified email
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
      message: "Facebook login successful",
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
    console.error("[Facebook Auth] Error:", error);
    res.status(500).json({
      success: false,
      message: "Error processing Facebook login",
      error: error.message,
    });
  }
});

// ============================================================
// POST /auth/facebook/verify - Verify Facebook Token
// ============================================================
router.post("/facebook/verify", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Facebook token is required",
      });
    }

    // Verify token
    let facebookUser;
    try {
      const response = await axios.get(
        `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${token}`
      );

      facebookUser = response.data;

      if (!facebookUser.id) {
        throw new Error("Invalid token");
      }
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid Facebook token",
      });
    }

    res.status(200).json({
      success: true,
      message: "Token verified successfully",
      data: {
        facebookId: facebookUser.id,
        email: facebookUser.email,
        name: facebookUser.name,
        picture: facebookUser.picture?.data?.url,
        isVerified: true,
      },
    });
  } catch (error) {
    console.error("[Facebook Auth] Verification error:", error);
    res.status(500).json({
      success: false,
      message: "Error verifying token",
      error: error.message,
    });
  }
});

// ============================================================
// POST /auth/facebook/link - Link Facebook Account to Existing User
// ============================================================
router.post("/facebook/link", async (req, res) => {
  try {
    const { token, userId } = req.body;

    if (!token || !userId) {
      return res.status(400).json({
        success: false,
        message: "Token and userId are required",
      });
    }

    // Verify Facebook token
    let facebookUser;
    try {
      const response = await axios.get(
        `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${token}`
      );

      facebookUser = response.data;

      if (!facebookUser.id) {
        throw new Error("Invalid token");
      }
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid Facebook token",
      });
    }

    const { id: facebookId } = facebookUser;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if Facebook ID is already linked to another user
    const existingUser = await User.findOne({ facebookId });
    if (existingUser && existingUser._id.toString() !== userId) {
      return res.status(409).json({
        success: false,
        message: "This Facebook account is already linked to another user",
      });
    }

    // Link Facebook account
    user.facebookId = facebookId;
    if (!user.profilePicture && facebookUser.picture?.data?.url) {
      user.profilePicture = facebookUser.picture.data.url;
    }
    await user.save();

    res.status(200).json({
      success: true,
      message: "Facebook account linked successfully",
      data: {
        userId: user._id,
        email: user.email,
        facebookId: user.facebookId,
      },
    });
  } catch (error) {
    console.error("[Facebook Auth] Link error:", error);
    res.status(500).json({
      success: false,
      message: "Error linking Facebook account",
      error: error.message,
    });
  }
});

// ============================================================
// POST /auth/facebook/unlink - Unlink Facebook Account
// ============================================================
router.post("/facebook/unlink", async (req, res) => {
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
        message: "Cannot unlink Facebook account without a password set",
      });
    }

    // Unlink Facebook account
    user.facebookId = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Facebook account unlinked successfully",
      data: {
        userId: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("[Facebook Auth] Unlink error:", error);
    res.status(500).json({
      success: false,
      message: "Error unlinking Facebook account",
      error: error.message,
    });
  }
});

module.exports = router;
