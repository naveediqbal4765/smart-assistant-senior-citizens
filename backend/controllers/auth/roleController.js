// ============================================================
// controllers/auth/roleController.js - Role Management Controller
// Handles setting user role after OAuth signup
// ============================================================

const User = require('../../models/User');

/**
 * POST /api/auth/set-role
 * Set user role after OAuth signup
 * 
 * Request body:
 * {
 *   "userId": "user_id",
 *   "role": "elder|caregiver|volunteer"
 * }
 */
const setRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    // ============================================================
    // Step 1: Validate input
    // ============================================================
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    if (!role) {
      return res.status(400).json({
        success: false,
        message: 'Role is required',
      });
    }

    // Validate role value
    const validRoles = ['elder', 'caregiver', 'volunteer'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be one of: elder, caregiver, volunteer',
      });
    }

    // ============================================================
    // Step 2: Find user
    // ============================================================
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // ============================================================
    // Step 3: Check if user already has a role
    // ============================================================
    if (user.role) {
      return res.status(400).json({
        success: false,
        message: 'User already has a role assigned',
      });
    }

    // ============================================================
    // Step 4: Set role
    // ============================================================
    user.role = role;
    await user.save();

    console.log(`✅ Role set for user ${userId}: ${role}`);

    // ============================================================
    // Step 5: Return success response
    // ============================================================
    return res.status(200).json({
      success: true,
      message: `Role set to ${role} successfully`,
      data: {
        userId: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error('❌ Set role error:', error);
    res.status(500).json({
      success: false,
      message: 'Error setting role. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

module.exports = {
  setRole,
};
