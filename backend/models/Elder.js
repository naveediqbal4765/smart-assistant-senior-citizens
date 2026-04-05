// ============================================================
// models/Elder.js - Elder Model
// ============================================================

const mongoose = require("mongoose");

const elderSchema = new mongoose.Schema(
  {
    // Reference to User
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Living Situation
    livesAlone: {
      type: Boolean,
      required: true,
    },

    // Emergency Contacts
    emergencyContacts: [
      {
        name: {
          type: String,
          required: true,
        },
        phone: {
          type: String,
          required: true,
        },
        relationship: {
          type: String,
          required: true,
        },
        _id: false,
      },
    ],

    // Medical Information
    medicalConditions: [
      {
        type: String,
      },
    ],
    hasMedicalIssues: {
      type: Boolean,
      default: false,
    },
    medications: [
      {
        name: String,
        dosage: String,
        frequency: String,
        _id: false,
      },
    ],
    allergies: [String],

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

    // Caregiver Assignment
    assignedCaregivers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Health Metrics
    healthMetrics: {
      bloodPressure: String,
      heartRate: Number,
      temperature: Number,
      bloodSugar: Number,
      lastCheckup: Date,
    },

    // SOS Settings
    sosEnabled: {
      type: Boolean,
      default: true,
    },
    fallDetectionEnabled: {
      type: Boolean,
      default: true,
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// ============================================================
// Indexes
// ============================================================
elderSchema.index({ userId: 1 });
elderSchema.index({ "currentLocation.coordinates": "2dsphere" });
elderSchema.index({ assignedCaregivers: 1 });

// ============================================================
// Model
// ============================================================
module.exports = mongoose.model("Elder", elderSchema);
