// ============================================================
// models/SOS.js - SOS Alert Model
// ============================================================

const mongoose = require("mongoose");

const sosSchema = new mongoose.Schema(
  {
    // Elder Information
    elderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Elder",
      required: true,
    },

    // Alert Details
    description: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "high",
    },

    // Location
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
      address: String,
    },

    // Status
    status: {
      type: String,
      enum: ["active", "acknowledged", "resolved", "cancelled"],
      default: "active",
    },

    // Responders
    respondingCaregivers: [
      {
        caregiverId: mongoose.Schema.Types.ObjectId,
        status: {
          type: String,
          enum: ["notified", "acknowledged", "arrived", "resolved"],
          default: "notified",
        },
        arrivedAt: Date,
        _id: false,
      },
    ],
    respondingVolunteers: [
      {
        volunteerId: mongoose.Schema.Types.ObjectId,
        status: {
          type: String,
          enum: ["notified", "acknowledged", "arrived", "resolved"],
          default: "notified",
        },
        arrivedAt: Date,
        _id: false,
      },
    ],

    // Resolution
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    resolutionNotes: String,
    resolutionTime: Date,

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    resolvedAt: Date,

    // Expiry (auto-delete after 30 days)
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      index: { expireAfterSeconds: 0 },
    },
  },
  { timestamps: true }
);

// ============================================================
// Indexes
// ============================================================
sosSchema.index({ elderId: 1 });
sosSchema.index({ status: 1 });
sosSchema.index({ "location.coordinates": "2dsphere" });
sosSchema.index({ createdAt: -1 });

// ============================================================
// Model
// ============================================================
module.exports = mongoose.model("SOS", sosSchema);
