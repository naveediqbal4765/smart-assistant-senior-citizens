// ============================================================
// controllers/auth/signupController.js - Signup with Location
// ============================================================

const User = require("../../models/User");
const Elder = require("../../models/Elder");
const Caregiver = require("../../models/Caregiver");
const Volunteer = require("../../models/Volunteer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { sendWelcomeEmail } = require("../../services/emailService");

// ============================================================
// POST /api/auth/signup - User Registration
// ============================================================
exports.signup = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      confirmPassword,
      phone,
      role,
      locationPermission,
      latitude,
      longitude,
    } = req.body;

    // Validation
    if (!fullName || !email || !password || !confirmPassword || !role) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Validate role
    if (!["elder", "caregiver", "volunteer"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    // Create user
    const user = new User({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      password: password,
      phone: phone || "",
      role: role,
      isVerified: false,
      authProvider: "local",
    });

    // Save user
    await user.save();

    // Create role-specific data
    let roleData = null;

    if (role === "elder") {
      roleData = new Elder({
        userId: user._id,
        locationPermission: locationPermission || false,
      });
      await roleData.save();
    } else if (role === "caregiver") {
      user.privacySettings.locationSharing = locationPermission || false;
      await user.save();
    } else if (role === "volunteer") {
      roleData = new Volunteer({
        userId: user._id,
        volunteerLocationPermission: locationPermission || false,
      });
      await roleData.save();
    }

    // If location permission granted, store initial location
    if (locationPermission && latitude !== undefined && longitude !== undefined) {
      // Validate coordinates
      if (latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180) {
        user.currentLocation = {
          latitude: latitude,
          longitude: longitude,
          accuracy: null,
          timestamp: new Date(),
        };

        user.locationHistory = [
          {
            latitude: latitude,
            longitude: longitude,
            accuracy: null,
            timestamp: new Date(),
          },
        ];

        user.locationTrackingEnabled = true;
        user.locationTrackingEnabledAt = new Date();

        await user.save();
      }
    }

    // Generate JWT tokens
    const accessToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "7d" }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRE || "30d" }
    );

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          profilePicture: user.profilePicture,
          locationTrackingEnabled: user.locationTrackingEnabled,
          currentLocation: user.currentLocation,
        },
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Error during signup",
      error: error.message,
    });
  }
};

// ============================================================
// POST /api/auth/signup-with-location - Signup with Location Details
// ============================================================
exports.signupWithLocation = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      confirmPassword,
      phone,
      role,
      locationPermission,
      latitude,
      longitude,
      accuracy,
      address,
    } = req.body;

    // Validation
    if (!fullName || !email || !password || !confirmPassword || !role) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Validate role
    if (!["elder", "caregiver", "volunteer"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    // Validate coordinates if location permission granted
    if (locationPermission) {
      if (latitude === undefined || longitude === undefined) {
        return res.status(400).json({
          success: false,
          message: "Latitude and longitude required when location permission is granted",
        });
      }

      if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
        return res.status(400).json({
          success: false,
          message: "Invalid coordinates",
        });
      }
    }

    // Create user
    const user = new User({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      password: password,
      phone: phone || "",
      role: role,
      address: {
        text: address || "",
        lat: latitude,
        lng: longitude,
      },
      isVerified: false,
      authProvider: "local",
    });

    // Save user
    await user.save();

    // Create role-specific data
    let roleData = null;

    if (role === "elder") {
      roleData = new Elder({
        userId: user._id,
        locationPermission: locationPermission || false,
      });
      await roleData.save();
    } else if (role === "caregiver") {
      user.privacySettings.locationSharing = locationPermission || false;
      await user.save();
    } else if (role === "volunteer") {
      roleData = new Volunteer({
        userId: user._id,
        volunteerLocationPermission: locationPermission || false,
      });
      await roleData.save();
    }

    // If location permission granted, store initial location
    if (locationPermission && latitude !== undefined && longitude !== undefined) {
      user.currentLocation = {
        latitude: latitude,
        longitude: longitude,
        accuracy: accuracy || null,
        timestamp: new Date(),
      };

      user.locationHistory = [
        {
          latitude: latitude,
          longitude: longitude,
          accuracy: accuracy || null,
          timestamp: new Date(),
        },
      ];

      user.locationTrackingEnabled = true;
      user.locationTrackingEnabledAt = new Date();

      await user.save();
    }

    // Generate JWT tokens
    const accessToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "7d" }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRE || "30d" }
    );

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully with location",
      data: {
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          profilePicture: user.profilePicture,
          address: user.address,
          locationTrackingEnabled: user.locationTrackingEnabled,
          currentLocation: user.currentLocation,
        },
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    });
  } catch (error) {
    console.error("Signup with location error:", error);
    res.status(500).json({
      success: false,
      message: "Error during signup",
      error: error.message,
    });
  }
};

// ============================================================
// POST /api/auth/verify-location-permission - Verify Location Permission
// ============================================================
exports.verifyLocationPermission = async (req, res) => {
  try {
    const userId = req.user._id;
    const { latitude, longitude, accuracy } = req.body;

    // Validation
    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

    // Validate coordinates
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return res.status(400).json({
        success: false,
        message: "Invalid coordinates",
      });
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user has location permission
    let hasLocationPermission = false;

    if (user.role === "elder") {
      const elder = await Elder.findOne({ userId });
      hasLocationPermission = elder?.locationPermission || false;
    } else if (user.role === "caregiver") {
      hasLocationPermission = user.privacySettings?.locationSharing || false;
    } else if (user.role === "volunteer") {
      const volunteer = await Volunteer.findOne({ userId });
      hasLocationPermission = volunteer?.volunteerLocationPermission || false;
    }

    if (!hasLocationPermission) {
      return res.status(400).json({
        success: false,
        message: "User has not granted location permission",
      });
    }

    // Store location
    user.currentLocation = {
      latitude: latitude,
      longitude: longitude,
      accuracy: accuracy || null,
      timestamp: new Date(),
    };

    // Add to history
    if (!user.locationHistory) {
      user.locationHistory = [];
    }

    user.locationHistory.push({
      latitude: latitude,
      longitude: longitude,
      accuracy: accuracy || null,
      timestamp: new Date(),
    });

    // Keep only last 100 locations
    if (user.locationHistory.length > 100) {
      user.locationHistory = user.locationHistory.slice(-100);
    }

    user.locationTrackingEnabled = true;
    user.locationTrackingEnabledAt = new Date();

    await user.save();

    res.status(200).json({
      success: true,
      message: "Location permission verified and stored",
      data: {
        locationTrackingEnabled: true,
        currentLocation: user.currentLocation,
      },
    });
  } catch (error) {
    console.error("Verify location permission error:", error);
    res.status(500).json({
      success: false,
      message: "Error verifying location permission",
      error: error.message,
    });
  }
};