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
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../src/utils/jwtService");

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
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.substring(7) : null; // Remove "Bearer " prefix

    // Clear remember me token for this user
    const user = await User.findById(req.user.userId);
    if (user) {
      user.rememberMeToken = null;
      user.rememberMeExpiry = null;
      user.rememberMeLastUsed = null;
      user.refreshToken = null;
      user.refreshTokenExpiry = null;
      user.refreshTokenFamily = null;
      user.refreshTokenRotationCount = 0;
      await user.save();
    }

    // Add token to blacklist if available
    if (token && user) {
      try {
        const { revokeToken } = require("../middleware/tokenRevocation");
        const { decodeToken } = require("../src/utils/jwtService");

        const decoded = decodeToken(token);
        if (decoded && decoded.exp) {
          const expiresAt = new Date(decoded.exp * 1000);
          const ipAddress = req.ip || req.connection.remoteAddress;
          const userAgent = req.headers["user-agent"];

          await revokeToken(
            token,
            user._id,
            "access",
            expiresAt,
            "logout",
            ipAddress,
            userAgent
          );
        }
      } catch (error) {
        console.error("[Auth] Error adding token to blacklist:", error);
        // Continue with logout even if blacklist fails
      }
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

// ============================================================
// POST /auth/google - Google OAuth Login
// ============================================================
router.post("/google", async (req, res) => {
  try {
    const { token, rememberMe } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Google token is required",
      });
    }

    // Verify Google token
    let googleUser;
    try {
      // The token from Google Sign-In is a JWT
      // We'll decode it without verification for development
      // In production, verify with Google's API
      const parts = token.split('.');
      
      if (parts.length !== 3) {
        throw new Error("Invalid token format");
      }
      
      // Decode the payload (second part)
      const payload = parts[1];
      // Add padding if needed
      const padded = payload + '='.repeat((4 - payload.length % 4) % 4);
      const decoded = JSON.parse(Buffer.from(padded, 'base64').toString());
      
      console.log('Google token decoded:', decoded);
      
      googleUser = {
        googleId: decoded.sub,
        email: decoded.email,
        fullName: decoded.name,
        profilePicture: decoded.picture,
      };
    } catch (error) {
      console.error("Token decode error:", error);
      return res.status(401).json({
        success: false,
        message: "Invalid Google token: " + error.message,
      });
    }

    // Find or create user
    let user = await User.findOne({ 
      $or: [
        { email: googleUser.email },
        { googleId: googleUser.googleId }
      ]
    });

    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      // Create new user WITHOUT role-specific profile
      // User will complete role selection in step 2
      user = new User({
        email: googleUser.email,
        fullName: googleUser.fullName,
        googleId: googleUser.googleId,
        profilePicture: googleUser.profilePicture,
        isVerified: true, // Google verified
        password: null, // No password for OAuth users
        // role will be set in step 2 after user selects
      });

      await user.save();
    } else {
      // Link Google account if not already linked
      if (!user.googleId) {
        user.googleId = googleUser.googleId;
        await user.save();
      }
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Handle remember me
    let rememberMeToken = null;
    if (rememberMe) {
      rememberMeToken = generateRememberMeToken();
      user.rememberMeToken = rememberMeToken;
      user.rememberMeExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      await user.save();
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Google login successful",
      data: {
        accessToken,
        refreshToken,
        rememberMeToken,
        expiresIn: "15m",
        user: {
          userId: user._id,
          email: user.email,
          fullName: user.fullName,
          role: "elder",
          profilePicture: user.profilePicture,
          isNewUser,
        },
      },
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({
      success: false,
      message: "Google login failed: " + error.message,
      error: error.message,
    });
  }
});

// ============================================================
// POST /auth/facebook - Facebook OAuth Login
// ============================================================
router.post("/facebook", async (req, res) => {
  try {
    const { token, rememberMe } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Facebook token is required",
      });
    }

    // Verify Facebook token (in production, verify with Facebook's API)
    // For now, we'll extract the token payload
    let facebookUser;
    try {
      // Decode JWT token (without verification for now)
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error("Invalid token format");
      }
      
      const decoded = JSON.parse(Buffer.from(parts[1], 'base64').toString());
      facebookUser = {
        facebookId: decoded.sub || decoded.id,
        email: decoded.email,
        fullName: decoded.name,
        profilePicture: decoded.picture,
      };
    } catch (error) {
      console.error("Token decode error:", error);
      return res.status(401).json({
        success: false,
        message: "Invalid Facebook token",
      });
    }

    // Find or create user
    let user = await User.findOne({ 
      $or: [
        { email: facebookUser.email },
        { facebookId: facebookUser.facebookId }
      ]
    });

    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      // Create new user
      user = new User({
        email: facebookUser.email,
        fullName: facebookUser.fullName,
        facebookId: facebookUser.facebookId,
        profilePicture: facebookUser.profilePicture,
        isVerified: true, // Facebook verified
        password: null, // No password for OAuth users
      });

      // Create Elder profile by default
      const Elder = require("../models/Elder");
      const elder = new Elder({
        userId: user._id,
        email: facebookUser.email,
        livesAlone: false, // Default value for OAuth users
        emergencyContacts: [],
        medicalConditions: [],
        hasMedicalIssues: false,
        locationPermission: false,
      });
      await elder.save();

      await user.save();
    } else {
      // Link Facebook account if not already linked
      if (!user.facebookId) {
        user.facebookId = facebookUser.facebookId;
        await user.save();
      }
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Handle remember me
    let rememberMeToken = null;
    if (rememberMe) {
      rememberMeToken = generateRememberMeToken();
      user.rememberMeToken = rememberMeToken;
      user.rememberMeExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      await user.save();
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Facebook login successful",
      data: {
        accessToken,
        refreshToken,
        rememberMeToken,
        expiresIn: "15m",
        user: {
          userId: user._id,
          email: user.email,
          fullName: user.fullName,
          role: "elder",
          profilePicture: user.profilePicture,
          isNewUser,
        },
      },
    });
  } catch (error) {
    console.error("Facebook login error:", error);
    res.status(500).json({
      success: false,
      message: "Facebook login failed",
      error: error.message,
    });
  }
});

// ============================================================
// POST /auth/set-role - Set User Role After OAuth Signup
// ============================================================
router.post("/set-role", async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!userId || !role) {
      return res.status(400).json({
        success: false,
        message: "userId and role are required",
      });
    }

    if (!["elder", "caregiver", "volunteer"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be elder, caregiver, or volunteer",
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

    // Update user role
    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Role set successfully",
      data: {
        userId: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Set role error:", error);
    res.status(500).json({
      success: false,
      message: "Error setting role",
      error: error.message,
    });
  }
});
