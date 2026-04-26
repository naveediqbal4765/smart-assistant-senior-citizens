// ============================================================
// models/User.js - Mongoose User Schema
// Handles all three roles: elder, caregiver, volunteer
// Includes role-specific sub-schemas for each user type
// ============================================================

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// ---- Sub-schema: Emergency Contact (for Elder role) ----
const emergencyContactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },           // Contact's full name
  phone: { type: String, required: true, trim: true },          // Contact's phone number
  email: { type: String, trim: true, lowercase: true },         // Contact's email (optional)
  relationship: { type: String, required: true, trim: true },   // e.g., Son, Daughter, Spouse
});

// ---- Sub-schema: Elder-specific fields ----
const elderSchema = new mongoose.Schema({
  seniorId: { type: String, unique: true, sparse: true },       // Auto-generated unique Senior ID
  livesAlone: { type: Boolean, default: false },                // Does elder live alone?
  emergencyContacts: {                                          // Family contacts (1-3 persons)
    type: [emergencyContactSchema],
    validate: {
      validator: (arr) => arr.length <= 3,                      // Max 3 emergency contacts
      message: "Maximum 3 emergency contacts allowed",
    },
  },
  medicalConditions: [{ type: String, trim: true }],           // List of medical conditions
  hasMedicalIssues: { type: Boolean, default: false },         // Does elder have medical issues?
  locationPermission: { type: Boolean, default: false },        // Has granted location access?
  pairingCode: { type: String },                               // 6-digit code for caregiver pairing
  pairingCodeExpiry: { type: Date },                           // Expiry time for pairing code
  priorityMonitor: { type: Boolean, default: false },          // True if lives alone (high priority)
});

// ---- Sub-schema: Caregiver-specific fields ----
const caregiverSchema = new mongoose.Schema({
  relationshipToElder: { type: String, trim: true },           // e.g., Son, Daughter, Nurse
  linkedElderEmail: { type: String, trim: true, lowercase: true }, // Elder's email for pairing
  linkedElderId: {                                             // Reference to linked Elder user
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  isPaired: { type: Boolean, default: false },                 // Has successfully paired with elder?
  notificationsEnabled: { type: Boolean, default: false },     // Push notification consent
  isAvailable: { type: Boolean, default: true },              // Currently available to monitor?
  accessLevel: {                                               // RBAC: view-only or full action
    type: String,
    enum: ["view-only", "action"],
    default: "view-only",
  },
});

// ---- Sub-schema: Volunteer-specific fields ----
const volunteerSchema = new mongoose.Schema({
  affiliation: { type: String, trim: true },                   // NGO name (e.g., Edhi, Al-Khidmat)
  ngoId: { type: String, trim: true },                         // NGO ID number (if applicable)
  serviceRadius: { type: Number, default: 5, min: 1, max: 10 }, // Service range in km (1-10)
  skills: [{                                                   // Multi-select skills
    type: String,
    enum: ["Medical", "Errands", "Physical Help"],
  }],
  availability: {                                              // Weekly availability schedule
    days: [{                                                   // Days of the week available
      type: String,
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    }],
    timeSlots: [{                                              // Preferred time slots
      type: String,
      enum: ["Morning", "Afternoon", "Evening", "Night"],
    }],
  },
  locationPermission: { type: Boolean, default: false },       // Has granted location access?
  isLive: { type: Boolean, default: false },                   // Currently online/available?
  totalPoints: { type: Number, default: 0 },                   // Reward points earned
  badges: [{ type: String }],                                  // Earned badges
});

// ---- Main User Schema ----
const userSchema = new mongoose.Schema(
  {
    // ---- Basic Info (All Roles) ----
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\+?[\d\s\-()]{7,15}$/, "Please enter a valid phone number"],
    },
    password: {
      type: String,
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // Never return password in queries by default
    },
    profilePicture: {
      type: String,                                            // URL to uploaded profile picture
      default: "",
    },
    dateOfBirth: { type: Date },                              // User's date of birth
    address: {
      text: { type: String, trim: true },                    // Human-readable address
      lat: { type: Number },                                  // Latitude coordinate
      lng: { type: Number },                                  // Longitude coordinate
    },
    nationalId: {
      type: String,
      trim: true,
      match: [/^\d{13}$/, "National ID must be exactly 13 digits"], // Pakistani CNIC format
    },

    // ---- Role Assignment ----
    role: {
      type: String,
      enum: ["elder", "caregiver", "volunteer"],
      required: [true, "Role is required"],
    },

    // ---- OAuth Provider Info ----
    authProvider: {
      type: String,
      enum: ["local", "google", "facebook", "apple"],
      default: "local",
    },
    providerId: { type: String },                             // OAuth provider's user ID

    // ---- Account Status ----
    isVerified: { type: Boolean, default: false },            // Email/phone verified?
    isActive: { type: Boolean, default: true },               // Account active (not deleted)?
    isDeleted: { type: Boolean, default: false },             // Soft delete flag

    // ---- OTP for Email Verification & Password Reset ----
    otp: { type: String, select: false },                     // Hashed OTP value
    otpExpiry: { type: Date, select: false },                 // OTP expiration timestamp
    otpPurpose: {                                             // What the OTP is for
      type: String,
      enum: ["email-verification", "password-reset", "login"],
      select: false,
    },

    // ---- Remember Me / Session ----
    rememberMe: { type: Boolean, default: false },

    // ---- Password Reset Data ----
    passwordReset: {
      otp: { type: String, select: false },                   // 6-digit OTP for password reset
      expiresAt: { type: Date, select: false },               // OTP expiration time (5 minutes)
      verified: { type: Boolean, default: false, select: false }, // Has OTP been verified?
      verificationToken: { type: String, select: false },     // Token for password reset confirmation
    },

    // ---- Role-Specific Data (only one will be populated based on role) ----
    elderData: { type: elderSchema, default: null },
    caregiverData: { type: caregiverSchema, default: null },
    volunteerData: { type: volunteerSchema, default: null },

    // ---- Geospatial Location (for volunteer matching) ----
    location: {
      type: {
        type: String,
        enum: ["Point"],                                      // GeoJSON Point type
        default: "Point",
      },
      coordinates: {
        type: [Number],                                       // [longitude, latitude]
        default: [0, 0],
      },
    },

    // ---- Timestamps ----
    lastLogin: { type: Date },                                // Last successful login time
    passwordChangedAt: { type: Date },                        // When password was last changed
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// ---- Geospatial Index for volunteer proximity matching ----
userSchema.index({ location: "2dsphere" });

// ---- Index on role for filtering ----
userSchema.index({ role: 1 });

// ============================================================
// PRE-SAVE HOOK: Hash password before saving to database
// ============================================================
userSchema.pre("save", async function (next) {
  // Only hash if password was modified (not on other updates)
  if (!this.isModified("password") || !this.password) return next();

  // Generate salt with cost factor 12 (secure but not too slow)
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);

  // Record when password was changed (for JWT invalidation)
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// ============================================================
// INSTANCE METHOD: Compare entered password with hashed password
// ============================================================
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ============================================================
// INSTANCE METHOD: Check if JWT was issued before password change
// ============================================================
userSchema.methods.changedPasswordAfter = function (jwtIssuedAt) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return jwtIssuedAt < changedTimestamp; // True = password changed after token issued
  }
  return false; // Password not changed
};

// ============================================================
// STATIC METHOD: Find active (non-deleted) user by email
// ============================================================
userSchema.statics.findActiveByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase(), isDeleted: false });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
