// ============================================================
// models/Caregiver.js - Caregiver Model
// ============================================================

const mongoose = require("mongoose");

const caregiverSchema = new mongoose.Schema(
  {
    // Reference to User
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Relationship Information
    relationshipToElder: {
      type: String,
      required: true,
      enum: ["Son", "Daughter", "Spouse", "Sibling", "Friend", "Professional", "Other"],
    },

    // Assigned Elders
    assignedElders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Elder",
      },
    ],

    // Pairing Information
    pairingCode: {
      type: String,
      default: null,
    },
    pairingCodeExpiry: {
      type: Date,
      default: null,
    },

    // Notification Settings
    notificationsEnabled: {
      type: Boolean,
      default: true,
    },
    notificationPreferences: {
      sosAlerts: { type: Boolean, default: true },
      healthUpdates: { type: Boolean, default: true },
      scheduleReminders: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
    },

    // Availability
    isAvailable: {
      type: Boolean,
      default: true,
    },
    availabilitySchedule: {
      monday: { start: String, end: String },
      tuesday: { start: String, end: String },
      wednesday: { start: String, end: String },
      thursday: { start: String, end: String },
      friday: { start: String, end: String },
      saturday: { start: String, end: String },
      sunday: { start: String, end: String },
    },

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
caregiverSchema.index({ assignedElders: 1 });
caregiverSchema.index({ isAvailable: 1 });

// ============================================================
// Model
// ============================================================
module.exports = mongoose.model("Caregiver", caregiverSchema);
