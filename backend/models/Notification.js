// ============================================================
// models/Notification.js - Notification Model
// ============================================================

const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    // Recipient
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Notification Details
    type: {
      type: String,
      enum: ["sos_alert", "health_update", "schedule_reminder", "pairing_request", "message", "system"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    description: String,

    // Related Data
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    relatedType: {
      type: String,
      enum: ["sos", "elder", "caregiver", "volunteer", "task", "user"],
      default: null,
    },

    // Status
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: Date,

    // Delivery Channels
    channels: {
      push: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
    },
    deliveryStatus: {
      push: {
        sent: { type: Boolean, default: false },
        sentAt: Date,
      },
      email: {
        sent: { type: Boolean, default: false },
        sentAt: Date,
      },
      sms: {
        sent: { type: Boolean, default: false },
        sentAt: Date,
      },
    },

    // Priority
    priority: {
      type: String,
      enum: ["low", "normal", "high", "critical"],
      default: "normal",
    },

    // Action
    actionUrl: String,
    actionLabel: String,

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },

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
notificationSchema.index({ userId: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ isRead: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// ============================================================
// Model
// ============================================================
module.exports = mongoose.model("Notification", notificationSchema);
