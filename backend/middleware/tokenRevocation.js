// ============================================================
// backend/middleware/tokenRevocation.js
// Token Revocation Middleware
// Checks if token is blacklisted before allowing access
// ============================================================

const TokenBlacklist = require("../models/TokenBlacklist");

/**
 * Middleware to check if token is revoked
 * Should be used after JWT verification
 * 
 * Usage:
 * router.get("/protected", protect, checkTokenRevocation, handler);
 */
const checkTokenRevocation = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(); // No token, let other middleware handle it
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Check if token is blacklisted
    const isBlacklisted = await TokenBlacklist.isBlacklisted(token);

    if (isBlacklisted) {
      console.warn(`[TokenRevocation] Blacklisted token used by user ${req.user?.userId}`);

      return res.status(401).json({
        success: false,
        message: "Token has been revoked. Please log in again.",
      });
    }

    // Token is valid, continue
    next();
  } catch (error) {
    console.error("[TokenRevocation] Error checking token revocation:", error);

    // On error, allow request to continue (fail open)
    // This prevents service disruption if blacklist check fails
    next();
  }
};

/**
 * Revoke a token by adding it to blacklist
 * @param {string} token - Token to revoke
 * @param {string} userId - User ID
 * @param {string} tokenType - Type of token (access/refresh)
 * @param {Date} expiresAt - Token expiration time
 * @param {string} reason - Reason for revocation
 * @param {string} ipAddress - IP address of request
 * @param {string} userAgent - User agent of request
 * @returns {Promise<Object>} Blacklist entry
 */
const revokeToken = async (token, userId, tokenType, expiresAt, reason = "logout", ipAddress = null, userAgent = null) => {
  try {
    return await TokenBlacklist.addToBlacklist(
      token,
      userId,
      tokenType,
      expiresAt,
      reason,
      ipAddress,
      userAgent
    );
  } catch (error) {
    console.error("[TokenRevocation] Error revoking token:", error);
    throw error;
  }
};

/**
 * Revoke all tokens for a user
 * Used when password is changed or security breach detected
 * @param {string} userId - User ID
 * @param {string} reason - Reason for revocation
 * @returns {Promise<number>} Number of tokens revoked
 */
const revokeUserTokens = async (userId, reason = "security-breach") => {
  try {
    return await TokenBlacklist.revokeUserTokens(userId, reason);
  } catch (error) {
    console.error("[TokenRevocation] Error revoking user tokens:", error);
    throw error;
  }
};

module.exports = {
  checkTokenRevocation,
  revokeToken,
  revokeUserTokens,
};
