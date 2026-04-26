// ============================================================
// routes/admin.js - Admin Routes
// Protected routes for administrative tasks
// ============================================================

const express = require("express");
const { protect } = require("../middleware/auth");
const {
  cleanupExpiredRememberMeTokens,
  getRememberMeTokenStats,
  clearUserRememberMeTokens,
} = require("../src/jobs/rememberMeCleanupJob");

const router = express.Router();

// ============================================================
// Middleware: Check if user is admin
// ============================================================
const isAdmin = (req, res, next) => {
  // For now, we'll check if user role is admin
  // In production, you might want to add an isAdmin field to User model
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  }
};

// ============================================================
// POST /admin/cleanup-remember-me - Manually trigger cleanup
// ============================================================
router.post("/cleanup-remember-me", protect, isAdmin, async (req, res) => {
  try {
    const result = await cleanupExpiredRememberMeTokens();

    res.status(200).json({
      success: result.success,
      message: result.message,
      data: {
        cleanedCount: result.cleanedCount,
        timestamp: result.timestamp,
      },
    });
  } catch (error) {
    console.error("Admin cleanup error:", error);
    res.status(500).json({
      success: false,
      message: "Error running cleanup",
      error: error.message,
    });
  }
});

// ============================================================
// GET /admin/remember-me-stats - Get Remember Me token statistics\n// ============================================================\nrouter.get(\"/remember-me-stats\", protect, isAdmin, async (req, res) => {\n  try {\n    const result = await getRememberMeTokenStats();\n\n    res.status(200).json({\n      success: result.success,\n      data: result.stats,\n    });\n  } catch (error) {\n    console.error(\"Admin stats error:\", error);\n    res.status(500).json({\n      success: false,\n      message: \"Error getting statistics\",\n      error: error.message,\n    });\n  }\n});\n\n// ============================================================\n// POST /admin/clear-user-tokens/:userId - Clear tokens for specific user\n// ============================================================\nrouter.post(\"/clear-user-tokens/:userId\", protect, isAdmin, async (req, res) => {\n  try {\n    const { userId } = req.params;\n\n    if (!userId) {\n      return res.status(400).json({\n        success: false,\n        message: \"User ID is required\",\n      });\n    }\n\n    const result = await clearUserRememberMeTokens(userId);\n\n    res.status(200).json({\n      success: result.success,\n      message: result.message,\n      data: {\n        userId: result.userId,\n      },\n    });\n  } catch (error) {\n    console.error(\"Admin clear tokens error:\", error);\n    res.status(500).json({\n      success: false,\n      message: \"Error clearing user tokens\",\n      error: error.message,\n    });\n  }\n});\n\nmodule.exports = router;\n