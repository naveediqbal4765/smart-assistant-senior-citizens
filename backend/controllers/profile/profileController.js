// ============================================================
// controllers/profile/profileController.js - Profile Management
// ============================================================

const User = require("../../models/User");
const Elder = require("../../models/Elder");
const Caregiver = require("../../models/Caregiver");
const Volunteer = require("../../models/Volunteer");
const fs = require("fs");
const path = require("path");

// ============================================================
// GET /api/profile - Fetch User Profile
// ============================================================
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user data
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get role-specific data
    let roleData = null;
    if (user.role === "elder") {
      roleData = await Elder.findOne({ userId });
    } else if (user.role === "caregiver") {
      roleData = await Caregiver.findOne({ userId });
    } else if (user.role === "volunteer") {
      roleData = await Volunteer.findOne({ userId });
    }

    res.status(200).json({
      success: true,
      data: {
        user,
        roleData,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching profile",
      error: error.message,
    });
  }
};

// ============================================================
// PUT /api/profile - Update User Profile
// ============================================================
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      fullName,
      phone,
      dateOfBirth,
      address,
      // Privacy settings
      privacySettings,
      // Elder fields
      livesAlone,
      hasMedicalIssues,
      medicalConditions,
      locationPermission,
      emergencyContacts,
      // Caregiver fields
      relationshipToElder,
      linkedElderEmail,
      notificationsEnabled,
      // Volunteer fields
      affiliation,
      skills,
      serviceRadius,
      availabilityDays,
      volunteerLocationPermission,
    } = req.body;

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update personal information
    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (address) user.address = address;

    // Update privacy settings
    if (privacySettings) {
      user.privacySettings = {
        ...user.privacySettings,
        ...privacySettings,
      };
    }

    // Save user
    await user.save();

    // Update role-specific data
    let roleData = null;
    if (user.role === "elder") {
      roleData = await Elder.findOne({ userId });
      if (roleData) {
        if (livesAlone !== undefined) roleData.livesAlone = livesAlone;
        if (hasMedicalIssues !== undefined) roleData.hasMedicalIssues = hasMedicalIssues;
        if (medicalConditions) roleData.medicalConditions = medicalConditions;
        if (locationPermission !== undefined) roleData.locationPermission = locationPermission;
        if (emergencyContacts) roleData.emergencyContacts = emergencyContacts;
        await roleData.save();
      }
    } else if (user.role === "caregiver") {
      roleData = await Caregiver.findOne({ userId });
      if (roleData) {
        if (relationshipToElder) roleData.relationshipToElder = relationshipToElder;
        if (linkedElderEmail) roleData.linkedElderEmail = linkedElderEmail;
        if (notificationsEnabled !== undefined) roleData.notificationsEnabled = notificationsEnabled;
        await roleData.save();
      }
    } else if (user.role === "volunteer") {
      roleData = await Volunteer.findOne({ userId });
      if (roleData) {
        if (affiliation) roleData.affiliation = affiliation;
        if (skills) roleData.skills = skills;
        if (serviceRadius) roleData.serviceRadius = serviceRadius;
        if (availabilityDays) roleData.availabilityDays = availabilityDays;
        if (volunteerLocationPermission !== undefined) roleData.volunteerLocationPermission = volunteerLocationPermission;
        await roleData.save();
      }
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user,
        roleData,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};

// ============================================================
// POST /api/profile/picture - Upload Profile Picture
// ============================================================
exports.uploadProfilePicture = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Validate file type
    const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedMimes.includes(req.file.mimetype)) {
      // Delete uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed",
      });
    }

    // Validate file size (max 5MB)
    if (req.file.size > 5 * 1024 * 1024) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: "File size exceeds 5MB limit",
      });
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete old profile picture if exists
    if (user.profilePicture) {
      const oldPath = path.join(__dirname, "../../", user.profilePicture);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // Save new profile picture path
    const relativePath = `/uploads/profiles/${req.file.filename}`;
    user.profilePicture = relativePath;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile picture uploaded successfully",
      data: {
        profilePicture: relativePath,
      },
    });
  } catch (error) {
    console.error("Upload profile picture error:", error);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      message: "Error uploading profile picture",
      error: error.message,
    });
  }
};

// ============================================================
// POST /api/profile/validate-address - Validate Address with Google Maps
// ============================================================
const googleMapsService = require("../../services/googleMapsService");

exports.validateAddress = async (req, res) => {
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Please provide an address",
      });
    }

    // Validate address using Google Maps Geocoding API
    const validationResult = await googleMapsService.validateAddress(address);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: validationResult.message,
      });
    }

    // Verify address is in Pakistan
    const isInPakistan = googleMapsService.verifyAddressInPakistan(
      validationResult.addressComponents
    );

    if (!isInPakistan) {
      return res.status(400).json({
        success: false,
        message: "Address must be in Pakistan",
      });
    }

    // Extract address components
    const addressComponents = googleMapsService.extractAddressComponents(
      validationResult.addressComponents
    );

    res.status(200).json({
      success: true,
      isValid: true,
      formattedAddress: validationResult.formattedAddress,
      latitude: validationResult.latitude,
      longitude: validationResult.longitude,
      placeId: validationResult.placeId,
      addressComponents: addressComponents,
      geometry: validationResult.geometry,
    });
  } catch (error) {
    console.error("Validate address error:", error);
    res.status(500).json({
      success: false,
      message: "Error validating address",
      error: error.message,
    });
  }
};

// ============================================================
// POST /api/auth/change-password - Change Password
// ============================================================
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user._id;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide current password, new password, and confirmation",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New passwords do not match",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters",
      });
    }

    // Get user with password field
    const user = await User.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify current password
    const isPasswordCorrect = await user.comparePassword(currentPassword);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Verification failed: Incorrect current password",
      });
    }

    // Update password
    user.password = newPassword;
    user.passwordChangedAt = Date.now();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully. Please log in again with your new password.",
      data: {
        userId: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: "Error changing password",
      error: error.message,
    });
  }
};

// ============================================================
// POST /api/auth/delete-account - Delete User Account
// ============================================================
exports.deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user._id;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Please provide your password to confirm deletion",
      });
    }

    // Get user with password field
    const user = await User.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify password
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Verification failed: Incorrect password",
      });
    }

    // Delete profile picture if exists
    if (user.profilePicture) {
      const picturePath = path.join(__dirname, "../../", user.profilePicture);
      if (fs.existsSync(picturePath)) {
        fs.unlinkSync(picturePath);
      }
    }

    // Delete role-specific profiles
    if (user.role === "elder") {
      await Elder.deleteMany({ userId: user._id });
    } else if (user.role === "caregiver") {
      await Caregiver.deleteMany({ userId: user._id });
    } else if (user.role === "volunteer") {
      await Volunteer.deleteMany({ userId: user._id });
    }

    // Delete user
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "Account deleted successfully. All your data has been removed from our system.",
      data: {
        accountDeleted: true,
      },
    });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting account",
      error: error.message,
    });
  }
};
