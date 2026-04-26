// ============================================================
// backend/src/jobs/rememberMeCleanupJob.js
// Scheduled Job to Clean Up Expired Remember Me Tokens
// Runs every hour to remove expired tokens from database
// ============================================================

const User = require("../models/User");

/**
 * Clean up expired Remember Me tokens from database
 * This job runs periodically to remove tokens that have expired
 * Prevents database bloat and improves query performance
 *
 * @returns {Promise<Object>} Result with count of cleaned tokens
 */
const cleanupExpiredRememberMeTokens = async () => {
  try {
    const now = new Date();

    // Find all users with expired Remember Me tokens
    const result = await User.updateMany(
      {
        rememberMeExpiry: { $lt: now }, // Token expiry is in the past
        rememberMeToken: { $exists: true, $ne: null }, // Token exists
      },
      {
        // Clear the expired token and related fields
        $set: {
          rememberMeToken: null,
          rememberMeExpiry: null,
          rememberMeLastUsed: null,
        },
      }
    );

    console.log(
      `[Remember Me Cleanup] Cleaned up ${result.modifiedCount} expired tokens at ${now.toISOString()}`
    );

    return {
      success: true,
      message: `Cleaned up ${result.modifiedCount} expired Remember Me tokens`,
      cleanedCount: result.modifiedCount,
      timestamp: now,
    };
  } catch (error) {
    console.error("[Remember Me Cleanup] Error cleaning up tokens:", error);
    return {
      success: false,
      message: "Error cleaning up expired Remember Me tokens",
      error: error.message,
    };
  }
};

/**
 * Get statistics about Remember Me tokens in database
 * Useful for monitoring and debugging
 *
 * @returns {Promise<Object>} Statistics about Remember Me tokens
 */
const getRememberMeTokenStats = async () => {
  try {
    const now = new Date();

    // Count active tokens
    const activeTokens = await User.countDocuments({
      rememberMeToken: { $exists: true, $ne: null },
      rememberMeExpiry: { $gt: now },
    });

    // Count expired tokens
    const expiredTokens = await User.countDocuments({
      rememberMeToken: { $exists: true, $ne: null },
      rememberMeExpiry: { $lt: now },
    });

    // Get oldest active token
    const oldestToken = await User.findOne(
      {
        rememberMeToken: { $exists: true, $ne: null },
        rememberMeExpiry: { $gt: now },
      },
      { rememberMeLastUsed: 1 }
    ).sort({ rememberMeLastUsed: 1 });

    // Get most recently used token
    const newestToken = await User.findOne(
      {
        rememberMeToken: { $exists: true, $ne: null },
        rememberMeExpiry: { $gt: now },
      },
      { rememberMeLastUsed: 1 }
    ).sort({ rememberMeLastUsed: -1 });

    return {
      success: true,
      stats: {
        activeTokens,
        expiredTokens,
        totalTokens: activeTokens + expiredTokens,
        oldestTokenLastUsed: oldestToken?.rememberMeLastUsed || null,
        newestTokenLastUsed: newestToken?.rememberMeLastUsed || null,
        timestamp: now,
      },
    };
  } catch (error) {
    console.error("[Remember Me Stats] Error getting stats:", error);
    return {
      success: false,
      message: "Error getting Remember Me token statistics",
      error: error.message,
    };
  }
};

/**
 * Force cleanup of all Remember Me tokens for a specific user
 * Used when user deletes account or requests data deletion
 *
 * @param {string} userId - User ID to clear tokens for
 * @returns {Promise<Object>} Result of cleanup operation
 */
const clearUserRememberMeTokens = async (userId) => {
  try {
    const result = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          rememberMeToken: null,
          rememberMeExpiry: null,
          rememberMeLastUsed: null,
        },
      },
      { new: true }
    );

    if (!result) {
      return {
        success: false,
        message: "User not found",
      };
    }

    console.log(`[Remember Me Cleanup] Cleared tokens for user ${userId}`);

    return {
      success: true,
      message: "Remember Me tokens cleared for user",
      userId,
    };
  } catch (error) {
    console.error("[Remember Me Cleanup] Error clearing user tokens:", error);
    return {
      success: false,
      message: "Error clearing user Remember Me tokens",
      error: error.message,
    };
  }
};

module.exports = {
  cleanupExpiredRememberMeTokens,
  getRememberMeTokenStats,
  clearUserRememberMeTokens,
};
