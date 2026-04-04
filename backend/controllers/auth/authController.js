// ============================================================
// controllers/auth/authController.js - Authentication Controller
// Handles: Login, Signup, OTP, Password Reset, OAuth, Account Deletion
// ============================================================

const User = require("../../models/User");
const { sendTokenResponse } = require("../../utils/jwtUtils");
const { generateOTP, getOTPExpiry, sendOTPEmail } = require("../../utils/emailUtils");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

// ============================================================
// @desc    Login user with email and password
// @route   POST /api/auth/login
// @access  Public
// ============================================================
const login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    // Find user by email (include password field which is normally excluded)
    const user = await User.findOne({
      email: email.toLowerCase(),
      isDeleted: false,
      authProvider: "local", // Only local accounts use password login
    }).select("+password");

    // Check if user exists and password is correct
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Entered wrong email or password", // Exact message as per requirements
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Your account has been deactivated. Please contact support.",
      });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Please verify your email address before logging in.",
        requiresVerification: true,
        email: user.email,
      });
    }

    // Update last login timestamp
    user.lastLogin = new Date();
    user.rememberMe = rememberMe || false;
    await user.save({ validateBeforeSave: false });

    // Send JWT token response
    sendTokenResponse(user, 200, res, "Login successful");
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
    });
  }
};

// ============================================================
// @desc    Register new user (Elder, Caregiver, or Volunteer)
// @route   POST /api/auth/signup
// @access  Public
// ============================================================
const signup = async (req, res) => {
  try {
    const {
      fullName, email, phone, password, role,
      dateOfBirth, address, nationalId,
      // Elder-specific
      livesAlone, emergencyContacts, medicalConditions, hasMedicalIssues, locationPermission,
      // Caregiver-specific
      relationshipToElder, linkedElderEmail, pairingCode,
      // Volunteer-specific
      affiliation, ngoId, serviceRadius, skills, availability,
    } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists. Please login.",
      });
    }

    // Build role-specific data object
    let elderData = null;
    let caregiverData = null;
    let volunteerData = null;

    if (role === "elder") {
      // Generate unique Senior ID for elder
      const seniorId = `SR-${uuidv4().split("-")[0].toUpperCase()}`;

      // Generate 6-digit pairing code for caregiver linking
      const pairingCodeValue = Math.floor(100000 + Math.random() * 900000).toString();
      const pairingCodeExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      elderData = {
        seniorId,
        livesAlone: livesAlone || false,
        emergencyContacts: emergencyContacts || [],
        medicalConditions: medicalConditions || [],
        hasMedicalIssues: hasMedicalIssues || false,
        locationPermission: locationPermission || false,
        pairingCode: pairingCodeValue,
        pairingCodeExpiry,
        priorityMonitor: livesAlone || false, // Priority if lives alone
      };
    } else if (role === "caregiver") {
      // Verify pairing code with elder if provided
      if (linkedElderEmail && pairingCode) {
        const elder = await User.findOne({
          email: linkedElderEmail.toLowerCase(),
          role: "elder",
          isDeleted: false,
        });

        if (!elder) {
          return res.status(400).json({
            success: false,
            message: "No elder found with that email address.",
          });
        }

        // Check if pairing code matches and is not expired
        if (
          elder.elderData.pairingCode !== pairingCode ||
          elder.elderData.pairingCodeExpiry < new Date()
        ) {
          return res.status(400).json({
            success: false,
            message: "Invalid or expired pairing code. Please ask the elder to generate a new one.",
          });
        }

        caregiverData = {
          relationshipToElder: relationshipToElder || "",
          linkedElderEmail: linkedElderEmail.toLowerCase(),
          linkedElderId: elder._id,
          isPaired: true,
          accessLevel: "view-only",
        };
      } else {
        caregiverData = {
          relationshipToElder: relationshipToElder || "",
          isPaired: false,
        };
      }
    } else if (role === "volunteer") {
      volunteerData = {
        affiliation: affiliation || "",
        ngoId: ngoId || "",
        serviceRadius: serviceRadius || 5,
        skills: skills || [],
        availability: availability || { days: [], timeSlots: [] },
        locationPermission: locationPermission || false,
      };
    }

    // Create new user in database
    const newUser = await User.create({
      fullName,
      email: email.toLowerCase(),
      phone,
      password,
      role,
      dateOfBirth: dateOfBirth || null,
      address: address || {},
      nationalId: nationalId || null,
      authProvider: "local",
      isVerified: false, // Requires email verification
      elderData,
      caregiverData,
      volunteerData,
    });

    // Generate OTP for email verification
    const otp = generateOTP();
    const otpExpiry = getOTPExpiry();

    // Hash OTP before storing (security best practice)
    const salt = await bcrypt.genSalt(10);
    newUser.otp = await bcrypt.hash(otp, salt);
    newUser.otpExpiry = otpExpiry;
    newUser.otpPurpose = "email-verification";
    await newUser.save({ validateBeforeSave: false });

    // Send OTP verification email
    await sendOTPEmail(newUser.email, otp, "verification", newUser.fullName);

    res.status(201).json({
      success: true,
      message: "Account created successfully! Please check your email for the verification OTP.",
      email: newUser.email,
      requiresVerification: true,
      // Include senior ID for elder role (needed for caregiver pairing)
      ...(role === "elder" && { seniorId: elderData.seniorId }),
    });
  } catch (error) {
    console.error("Signup Error:", error);
    // Handle duplicate key error (email already exists)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }
    res.status(500).json({
      success: false,
      message: "Registration failed. Please try again.",
    });
  }
};

// ============================================================
// @desc    Verify email with OTP
// @route   POST /api/auth/verify-otp
// @access  Public
// ============================================================
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find user with OTP fields (normally excluded)
    const user = await User.findOne({
      email: email.toLowerCase(),
      isDeleted: false,
    }).select("+otp +otpExpiry +otpPurpose");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email address.",
      });
    }

    // Check if OTP exists
    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "No OTP found. Please request a new one.",
      });
    }

    // Check if OTP has expired
    if (user.otpExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    // Compare entered OTP with hashed OTP in database
    const isOTPValid = await bcrypt.compare(otp, user.otp);
    if (!isOTPValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP. Please check and try again.",
      });
    }

    // Mark email as verified and clear OTP fields
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.otpPurpose = undefined;
    await user.save({ validateBeforeSave: false });

    // Send token and log user in after verification
    sendTokenResponse(user, 200, res, "Email verified successfully! Welcome to Smart Assistant.");
  } catch (error) {
    console.error("OTP Verification Error:", error);
    res.status(500).json({
      success: false,
      message: "OTP verification failed. Please try again.",
    });
  }
};

// ============================================================
// @desc    Request password reset OTP
// @route   POST /api/auth/forgot-password
// @access  Public
// ============================================================
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({
      email: email.toLowerCase(),
      isDeleted: false,
      authProvider: "local", // Only local accounts can reset password
    });

    // Always return success to prevent email enumeration attacks
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If an account with this email exists, an OTP has been sent.",
      });
    }

    // Generate OTP for password reset
    const otp = generateOTP();
    const otpExpiry = getOTPExpiry();

    // Hash and store OTP
    const salt = await bcrypt.genSalt(10);
    user.otp = await bcrypt.hash(otp, salt);
    user.otpExpiry = otpExpiry;
    user.otpPurpose = "password-reset";
    await user.save({ validateBeforeSave: false });

    // Send OTP email
    await sendOTPEmail(user.email, otp, "password-reset", user.fullName);

    res.status(200).json({
      success: true,
      message: "If an account with this email exists, an OTP has been sent.",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send reset OTP. Please try again.",
    });
  }
};

// ============================================================
// @desc    Verify password reset OTP
// @route   POST /api/auth/verify-reset-otp
// @access  Public
// ============================================================
const verifyResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase(),
      isDeleted: false,
    }).select("+otp +otpExpiry +otpPurpose");

    if (!user || !user.otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP.",
      });
    }

    // Check OTP expiry
    if (user.otpExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    // Verify OTP purpose is password-reset
    if (user.otpPurpose !== "password-reset") {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP for this action.",
      });
    }

    // Compare OTP
    const isOTPValid = await bcrypt.compare(otp, user.otp);
    if (!isOTPValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP. Please check and try again.",
      });
    }

    // OTP is valid - generate a temporary reset token
    // Clear OTP but mark as reset-verified
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.otpPurpose = "password-reset-verified"; // Mark as verified for next step
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "OTP verified. You can now set a new password.",
      email: user.email,
    });
  } catch (error) {
    console.error("Verify Reset OTP Error:", error);
    res.status(500).json({
      success: false,
      message: "OTP verification failed. Please try again.",
    });
  }
};

// ============================================================
// @desc    Reset password with new password
// @route   POST /api/auth/reset-password
// @access  Public
// ============================================================
const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase(),
      isDeleted: false,
    }).select("+otpPurpose");

    // Ensure user went through OTP verification
    if (!user || user.otpPurpose !== "password-reset-verified") {
      return res.status(400).json({
        success: false,
        message: "Please verify your OTP before resetting password.",
      });
    }

    // Set new password (pre-save hook will hash it)
    user.password = password;
    user.otpPurpose = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully! Please login with your new password.",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({
      success: false,
      message: "Password reset failed. Please try again.",
    });
  }
};

// ============================================================
// @desc    Resend OTP to email
// @route   POST /api/auth/resend-otp
// @access  Public
// ============================================================
const resendOTP = async (req, res) => {
  try {
    const { email, purpose } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase(),
      isDeleted: false,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email.",
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = getOTPExpiry();

    const salt = await bcrypt.genSalt(10);
    user.otp = await bcrypt.hash(otp, salt);
    user.otpExpiry = otpExpiry;
    user.otpPurpose = purpose || "email-verification";
    await user.save({ validateBeforeSave: false });

    await sendOTPEmail(user.email, otp, purpose || "verification", user.fullName);

    res.status(200).json({
      success: true,
      message: "A new OTP has been sent to your email.",
    });
  } catch (error) {
    console.error("Resend OTP Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to resend OTP. Please try again.",
    });
  }
};

// ============================================================
// @desc    OAuth Login/Signup (Google, Facebook, Apple)
// @route   POST /api/auth/oauth
// @access  Public
// ============================================================
const oauthLogin = async (req, res) => {
  try {
    const { provider, providerId, email, fullName, profilePicture, role } = req.body;

    // Validate provider
    if (!["google", "facebook", "apple"].includes(provider)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OAuth provider.",
      });
    }

    // Check if user already exists with this email
    let user = await User.findOne({
      email: email.toLowerCase(),
      isDeleted: false,
    });

    if (user) {
      // User exists - log them in
      user.lastLogin = new Date();
      // Update provider info if logging in via OAuth for first time
      if (user.authProvider === "local") {
        user.authProvider = provider;
        user.providerId = providerId;
      }
      await user.save({ validateBeforeSave: false });

      return sendTokenResponse(user, 200, res, "Login successful");
    }

    // User doesn't exist - they need to complete signup
    // Return their basic info so frontend can pre-fill signup form
    res.status(200).json({
      success: false,
      requiresSignup: true,
      message: "Account not found. Please complete your registration.",
      prefillData: {
        fullName: fullName || "",
        email: email || "",
        profilePicture: profilePicture || "",
        provider,
        providerId,
      },
    });
  } catch (error) {
    console.error("OAuth Login Error:", error);
    res.status(500).json({
      success: false,
      message: "OAuth authentication failed. Please try again.",
    });
  }
};

// ============================================================
// @desc    Get current logged-in user profile
// @route   GET /api/auth/me
// @access  Private (requires JWT)
// ============================================================
const getMe = async (req, res) => {
  try {
    // req.user is set by the protect middleware
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get Me Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user profile.",
    });
  }
};

// ============================================================
// @desc    Soft delete user account
// @route   DELETE /api/auth/delete-account
// @access  Private (requires JWT)
// ============================================================
const deleteAccount = async (req, res) => {
  try {
    const { password, confirmDelete } = req.body;

    // Require explicit confirmation
    if (!confirmDelete) {
      return res.status(400).json({
        success: false,
        message: "Please confirm account deletion.",
      });
    }

    // For local accounts, verify password before deletion
    if (req.user.authProvider === "local") {
      const user = await User.findById(req.user._id).select("+password");
      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Incorrect password. Account deletion cancelled.",
        });
      }
    }

    // Soft delete - mark as deleted instead of removing from DB
    await User.findByIdAndUpdate(req.user._id, {
      isDeleted: true,
      isActive: false,
      email: `deleted_${Date.now()}_${req.user.email}`, // Free up email for re-registration
    });

    res.status(200).json({
      success: true,
      message: "Your account has been successfully deleted.",
    });
  } catch (error) {
    console.error("Delete Account Error:", error);
    res.status(500).json({
      success: false,
      message: "Account deletion failed. Please try again.",
    });
  }
};

module.exports = {
  login,
  signup,
  verifyOTP,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  resendOTP,
  oauthLogin,
  getMe,
  deleteAccount,
};
