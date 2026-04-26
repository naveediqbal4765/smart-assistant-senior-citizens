// ============================================================
// routes/auth.js - Authentication Routes
// ============================================================

const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Elder = require("../models/Elder");
const Caregiver = require("../models/Caregiver");
const Volunteer = require("../models/Volunteer");
const { protect } = require("../middleware/auth");
const {
  generateRememberMeToken,
  getRememberMeExpiration,
} = require("../src/utils/rememberMeService");

const router = express.Router();

// ============================================================
// Helper Functions
// ============================================================

// Generate JWT Token
const generateToken = (userId, email, role) => {
  return jwt.sign(
    {
      userId,
      email,
      role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || "7d",
    }
  );
};

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ============================================================
// POST /auth/signup - Register New User
// ============================================================
router.post("/signup", async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      password,
      role,
      dateOfBirth,
      address,
      nationalId,
      // Elder fields
      livesAlone,
      emergencyContacts,
      medicalConditions,
      hasMedicalIssues,
      locationPermission,
      // Caregiver fields
      relationshipToElder,
      linkedElderEmail,
      pairingCode,
      notificationsEnabled,
      // Volunteer fields
      affiliation,
      ngoId,
      serviceRadius,
      skills,
      availabilityDays,
      availabilityTimeSlots,
      volunteerLocationPermission,
    } = req.body;

    // Validate required fields
    if (!fullName || !email || !phone || !password || !role || !dateOfBirth || !address || !nationalId) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Create user
    const user = await User.create({
      fullName,
      email,
      phone,
      password,
      role,
      dateOfBirth,
      address,
      nationalId,
    });

    // Generate OTP
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    // Create role-specific profile
    if (role === "elder") {
      await Elder.create({
        userId: user._id,
        livesAlone,
        emergencyContacts: emergencyContacts || [],
        medicalConditions: medicalConditions || [],
        hasMedicalIssues,
        locationPermission,
      });
    } else if (role === "caregiver") {
      await Caregiver.create({
        userId: user._id,
        relationshipToElder,
        notificationsEnabled,
      });
    } else if (role === "volunteer") {
      await Volunteer.create({
        userId: user._id,
        affiliation,
        ngoId,
        serviceRadius,
        skills: skills || [],
        availabilityDays: availabilityDays || [],
        availabilityTimeSlots: availabilityTimeSlots || [],
        locationPermission: volunteerLocationPermission,
      });
    }

    // TODO: Send OTP via email
    console.log(`OTP for ${email}: ${otp}`);

    res.status(201).json({
      success: true,
      message: "Account created successfully. Please verify your email with OTP.",
      data: {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating account",
      error: error.message,
    });
  }
});

// ============================================================
// POST /auth/verify-otp - Verify Email with OTP
// ============================================================
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and OTP",
      });
    }

    const user = await User.findOne({ email }).select("+otp");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check OTP
    if (user.otp !== otp) {
      return res.status(401).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Check OTP expiry
    if (new Date() > user.otpExpiry) {
      return res.status(401).json({
        success: false,
        message: "OTP expired",
      });
    }

    // Mark as verified
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      data: {
        userId: user._id,
        verified: true,
      },
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({
      success: false,
      message: "Error verifying OTP",
      error: error.message,
    });
  }
});

// ============================================================
// POST /auth/login - Login User
// ============================================================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if verified
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate token
    const token = generateToken(user._id, user.email, user.role);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          userId: user._id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Error logging in",
      error: error.message,
    });
  }
});

// ============================================================
// POST /auth/forgot-password - Request Password Reset
// ============================================================
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide email",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate reset token
    const resetToken = generateToken(user._id, user.email, user.role);
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    await user.save();

    // TODO: Send reset email with token
    console.log(`Reset token for ${email}: ${resetToken}`);

    res.status(200).json({
      success: true,
      message: "Password reset email sent",
      data: {
        resetTokenSent: true,
      },
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Error requesting password reset",
      error: error.message,
    });
  }
});

// ============================================================
// POST /auth/reset-password - Reset Password
// ============================================================
router.post("/reset-password", async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide reset token and new password",
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check token expiry
    if (new Date() > user.resetPasswordExpiry) {
      return res.status(401).json({
        success: false,
        message: "Reset token expired",
      });
    }

    // Update password
    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpiry = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
      data: {
        passwordReset: true,
      },
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Error resetting password",
      error: error.message,
    });
  }
});

// ============================================================
// POST /auth/resend-otp - Resend OTP
// ============================================================
router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide email",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    // TODO: Send OTP via email
    console.log(`OTP for ${email}: ${otp}`);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      data: {
        otpSent: true,
      },
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Error resending OTP",
      error: error.message,
    });
  }
});

module.exports = router;

// ============================================================
// POST /auth/login-with-remember-me - Login with Remember Me
// ============================================================
router.post("/login-with-remember-me", async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if verified
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = generateToken(user._id, user.email, user.role);

    // Generate Remember Me token if requested
    let rememberMeToken = null;
    if (rememberMe) {
      rememberMeToken = generateRememberMeToken();
      user.rememberMeToken = rememberMeToken;
      user.rememberMeExpiry = getRememberMeExpiration();
      user.rememberMeLastUsed = new Date();
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        rememberMeToken: rememberMe ? rememberMeToken : null,
        user: {
          userId: user._id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error("Login with remember me error:", error);
    res.status(500).json({
      success: false,
      message: "Error logging in",
      error: error.message,
    });
  }
});

// ============================================================
// POST /auth/verify-remember-me - Verify Remember Me Token
// ============================================================
router.post("/verify-remember-me", async (req, res) => {
  try {
    const { rememberMeToken } = req.body;

    if (!rememberMeToken) {
      return res.status(400).json({
        success: false,
        message: "Remember Me token is required",
      });
    }

    // Find user with this remember me token
    const user = await User.findOne({ rememberMeToken }).select("+rememberMeExpiry +rememberMeLastUsed");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid Remember Me token",
      });
    }

    // Check if token is expired
    if (new Date() > user.rememberMeExpiry) {
      // Clear expired token
      user.rememberMeToken = null;
      user.rememberMeExpiry = null;
      user.rememberMeLastUsed = null;
      await user.save();

      return res.status(401).json({
        success: false,
        message: "Remember Me token expired",
      });
    }

    // Generate new JWT token
    const token = generateToken(user._id, user.email, user.role);

    // Update last used time and extend expiration
    user.rememberMeLastUsed = new Date();
    user.rememberMeExpiry = getRememberMeExpiration();
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Auto-login successful",
      data: {
        token,
        user: {
          userId: user._id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error("Verify remember me error:", error);
    res.status(500).json({
      success: false,
      message: "Error verifying Remember Me token",
      error: error.message,
    });
  }
});

// ============================================================
// POST /auth/logout - Logout User (Clear Remember Me Token)
// ============================================================
router.post("/logout", protect, async (req, res) => {
  try {
    // Clear remember me token for this user
    const user = await User.findById(req.user.userId);
    if (user) {
      user.rememberMeToken = null;
      user.rememberMeExpiry = null;
      user.rememberMeLastUsed = null;
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Error logging out",
      error: error.message,
    });
  }
});
