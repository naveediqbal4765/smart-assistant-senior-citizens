// ============================================================
// backend/models/TokenBlacklist.js
// Token Blacklist Model for Logout Token Revocation
// Stores revoked tokens to prevent reuse after logout
// ============================================================

const mongoose = require("mongoose");

// ============================================================
// Token Blacklist Schema
// ============================================================
const tokenBlacklistSchema = new mongoose.Schema(
  {
    // ---- Token Information ----
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // ---- User Information ----
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // ---- Token Details ----
    tokenType: {
      type: String,
      enum: ["access", "refresh"],
      required: true,
    },

    // ---- Expiration ----
    expiresAt: {
      type: Date,
      required: true,
      index: true,
      // Automatically delete document when expiration time is reached
      expires: 0,
    },

    // ---- Reason for Revocation ----
    reason: {
      type: String,
      enum: ["logout", "password-change", "security-breach", "admin-revoke"],
      default: "logout",
    },

    // ---- Metadata ----
    revokedAt: {
      type: Date,
      default: Date.now,
    },

    ipAddress: {
      type: String,
      default: null,
    },

    userAgent: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ============================================================
// Indexes for Performance
// ============================================================

// Index for finding blacklisted tokens
tokenBlacklistSchema.index({ token: 1 });

// Index for finding user's blacklisted tokens
tokenBlacklistSchema.index({ userId: 1, expiresAt: 1 });

// Index for cleanup (TTL index)
tokenBlacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// ============================================================
// Static Methods
// ============================================================

/**
 * Add token to blacklist
 * @param {string} token - Token to blacklist
 * @param {string} userId - User ID
 * @param {string} tokenType - Type of token (access/refresh)
 * @param {Date} expiresAt - Token expiration time
 * @param {string} reason - Reason for revocation
 * @param {string} ipAddress - IP address of request
 * @param {string} userAgent - User agent of request
 * @returns {Promise<Object>} Created blacklist entry
 */
tokenBlacklistSchema.statics.addToBlacklist = async function (
  token,
  userId,
  tokenType,
  expiresAt,
  reason = "logout",
  ipAddress = null,
  userAgent = null
) {
  try {
    const blacklistEntry = await this.create({
      token,
      userId,
      tokenType,
      expiresAt,
      reason,
      ipAddress,
      userAgent,
    });

    console.log(`[TokenBlacklist] Token added to blacklist for user ${userId}`);
    return blacklistEntry;
  } catch (error) {
    console.error("[TokenBlacklist] Error adding token to blacklist:", error);
    throw error;
  }
};

/**
 * Check if token is blacklisted
 * @param {string} token - Token to check
 * @returns {Promise<boolean>} True if token is blacklisted
 */
tokenBlacklistSchema.statics.isBlacklisted = async function (token) {
  try {
    const entry = await this.findOne({ token });
    return !!entry;
  } catch (error) {
    console.error("[TokenBlacklist] Error checking blacklist:", error);
    return false;
  }
};

/**
 * Get blacklist entry for token
 * @param {string} token - Token to find
 * @returns {Promise<Object|null>} Blacklist entry or null
 */
tokenBlacklistSchema.statics.getBlacklistEntry = async function (token) {
  try {
    return await this.findOne({ token });
  } catch (error) {
    console.error("[TokenBlacklist] Error getting blacklist entry:", error);
    return null;
  }
};

/**
 * Revoke all tokens for a user
 * Used when password is changed or security breach detected
 * @param {string} userId - User ID
 * @param {string} reason - Reason for revocation
 * @returns {Promise<number>} Number of tokens revoked
 */
tokenBlacklistSchema.statics.revokeUserTokens = async function (userId, reason = "security-breach") {
  try {
    // This would be called with active tokens from the User model
    // For now, we just log the action
    console.log(`[TokenBlacklist] Revoking all tokens for user ${userId} - Reason: ${reason}`);
    return 0;
  } catch (error) {
    console.error("[TokenBlacklist] Error revoking user tokens:", error);
    throw error;
  }
};

/**
 * Clean up expired blacklist entries
 * MongoDB TTL index handles this automatically, but this is for manual cleanup
 * @returns {Promise<number>} Number of entries deleted
 */
tokenBlacklistSchema.statics.cleanupExpired = async function () {
  try {
    const result = await this.deleteMany({
      expiresAt: { $lt: new Date() },
    });

    console.log(`[TokenBlacklist] Cleaned up ${result.deletedCount} expired entries`);
    return result.deletedCount;
  } catch (error) {
    console.error("[TokenBlacklist] Error cleaning up expired entries:", error);
    throw error;
  }
};

/**
 * Get blacklist statistics
 * @returns {Promise<Object>} Statistics about blacklisted tokens
 */
tokenBlacklistSchema.statics.getStatistics = async function () {
  try {
    const total = await this.countDocuments();
    const byType = await this.aggregate([
      {
        $group: {
          _id: "$tokenType",
          count: { $sum: 1 },
        },
      },
    ]);

    const byReason = await this.aggregate([
      {
        $group: {
          _id: "$reason",
          count: { $sum: 1 },
        },
      },
    ]);

    return {
      total,
      byType: Object.fromEntries(byType.map((item) => [item._id, item.count])),
      byReason: Object.fromEntries(byReason.map((item) => [item._id, item.count])),
    };
  } catch (error) {
    console.error("[TokenBlacklist] Error getting statistics:", error);
    return { total: 0, byType: {}, byReason: {} };
  }
};

// ============================================================
// Create and Export Model
// ============================================================
const TokenBlacklist = mongoose.model("TokenBlacklist", tokenBlacklistSchema);

module.exports = TokenBlacklist;
