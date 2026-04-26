// ============================================================
// models/Volunteer.js - Volunteer Model
// ============================================================

const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema(
  {
    // Reference to User
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // NGO/Organization Information
    affiliation: {
      type: String,
      required: true,
      enum: ["Edhi", "Akhuwat", "SKMH", "Shaukat Khanum", "Other"],
    },
    ngoId: {
      type: String,
      required: true,
    },

    // Service Information
    serviceRadius: {
      type: Number,
      default: 5, // in kilometers
    },
    skills: [
      {
        type: String,
        enum: ["Medical", "Errands", "Companionship", "Transportation", "Cooking", "Cleaning", "Other"],
      },
    ],

    // Location & Permissions
    locationPermission: {
      type: Boolean,
      default: false,
    },
    currentLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },

    // Availability
    availabilityDays: [
      {
        type: String,
        enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      },
    ],
    availabilityTimeSlots: [
      {
        type: String,
        enum: ["Morning", "Afternoon", "Evening", "Night"],
      },
    ],

    // Assignments
    assignedTasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],

    // Performance Metrics
    totalAssignments: {
      type: Number,
      default: 0,
    },
    completedAssignments: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: [
      {
        elderId: mongoose.Schema.Types.ObjectId,
        rating: Number,
        comment: String,
        date: { type: Date, default: Date.now },
        _id: false,
      },
    ],

    // Verification
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationDocuments: [String],

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// ============================================================
// Indexes
// ============================================================
volunteerSchema.index({ "currentLocation.coordinates": "2dsphere" });
volunteerSchema.index({ skills: 1 });
volunteerSchema.index({ availabilityDays: 1 });
volunteerSchema.index({ isVerified: 1 });

// ============================================================
// Model
// ============================================================
module.exports = mongoose.model("Volunteer", volunteerSchema);
