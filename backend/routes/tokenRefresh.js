// ============================================================
// backend/routes/tokenRefresh.js
// Token Refresh Endpoints
// Handles JWT refresh token validation and new access token generation
// ============================================================

const express = require("express");
const User = require("../models/User");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  decodeToken,
} = require("../src/utils/jwtService");

const router = express.Router();

// ============================================================
// POST /auth/refresh-token - Generate new access token
// ============================================================
router.post("/refresh-token", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    // Validate input
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    // Verify refresh token signature and expiration
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify refresh token matches stored token
    if (user.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token mismatch - possible token reuse attack",
      });
    }

    // Verify token family matches (for rotation detection)
    if (user.refreshTokenFamily !== decoded.family) {
      // Token family mismatch - possible token reuse attack
      console.warn(`[Token Refresh] Token reuse attack detected for user ${user._id}`);

      // Clear all tokens for security
      user.refreshToken = null;
      user.refreshTokenExpiry = null;
      user.refreshTokenFamily = null;
      user.refreshTokenRotationCount = 0;
      await user.save();

      return res.status(401).json({
        success: false,
        message: "Token reuse detected - please log in again",
      });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user._id, user.email, user.role);

    // Generate new refresh token (token rotation)
    const newRefreshTokenData = generateRefreshToken(user._id, decoded.family);

    // Update user with new refresh token
    user.refreshToken = newRefreshTokenData.token;
    user.refreshTokenExpiry = newRefreshTokenData.expiresAt;
    user.refreshTokenRotationCount += 1;
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshTokenData.token,
        expiresIn: "15m",
        user: {
          userId: user._id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error("[Token Refresh] Error:", error);
    res.status(500).json({
      success: false,
      message: "Error refreshing token",
      error: error.message,
    });
  }
});

// ============================================================
// POST /auth/validate-token - Validate access token
// ============================================================
router.post("/validate-token", async (req, res) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({
        success: false,
        message: "Access token is required",
      });
    }

    // Decode token without verification (to check expiration)
    const decoded = decodeToken(accessToken);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid token format",
      });
    }

    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    const isExpired = decoded.exp < now;

    res.status(200).json({
      success: true,
      data: {
        isValid: !isExpired,
        isExpired,
        expiresAt: new Date(decoded.exp * 1000),
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      },
    });
  } catch (error) {
    console.error("[Token Validation] Error:", error);
    res.status(500).json({
      success: false,
      message: "Error validating token",
      error: error.message,
    });
  }
});

// ============================================================
// POST /auth/revoke-refresh-token - Revoke refresh token
// ============================================================
router.post("/revoke-refresh-token", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    // Verify token to get user ID
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    // Find user and clear refresh token
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Clear refresh token
    user.refreshToken = null;
    user.refreshTokenExpiry = null;
    user.refreshTokenFamily = null;
    user.refreshTokenRotationCount = 0;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Refresh token revoked successfully",
    });
  } catch (error) {
    console.error("[Token Revocation] Error:", error);
    res.status(500).json({
      success: false,
      message: "Error revoking token",
      error: error.message,
    });
  }
});

module.exports = router;
