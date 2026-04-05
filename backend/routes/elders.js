// ============================================================
// routes/elders.js - Elder Routes
// ============================================================

const express = require("express");
const Elder = require("../models/Elder");
const User = require("../models/User");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// ============================================================
// GET /elders/:id - Get Elder Profile
// ============================================================
router.get("/:id", protect, async (req, res) => {
  try {
    const elder = await Elder.findOne({ userId: req.params.id }).populate("userId", "fullName email phone");

    if (!elder) {
      return res.status(404).json({
        success: false,
        message: "Elder profile not found",
      });
    }

    res.status(200).json({
      success: true,
      data: elder,
    });
  } catch (error) {
    console.error("Get elder profile error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching elder profile",
      error: error.message,
    });
  }
});

// ============================================================
// PUT /elders/:id - Update Elder Profile
// ============================================================
router.put("/:id", protect, async (req, res) => {
  try {
    // Check authorization
    if (req.user._id.toString() !== req.params.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this profile",
      });
    }

    const { livesAlone, medicalConditions, hasMedicalIssues, locationPermission } = req.body;

    let elder = await Elder.findOne({ userId: req.params.id });
    if (!elder) {
      return res.status(404).json({
        success: false,
        message: "Elder profile not found",
      });
    }

    // Update fields
    if (livesAlone !== undefined) elder.livesAlone = livesAlone;
    if (medicalConditions) elder.medicalConditions = medicalConditions;
    if (hasMedicalIssues !== undefined) elder.hasMedicalIssues = hasMedicalIssues;
    if (locationPermission !== undefined) elder.locationPermission = locationPermission;

    elder.updatedAt = new Date();
    await elder.save();

    res.status(200).json({
      success: true,
      message: "Elder profile updated successfully",
      data: elder,
    });
  } catch (error) {
    console.error("Update elder profile error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating elder profile",
      error: error.message,
    });
  }
});

// ============================================================
// POST /elders/:id/emergency-contacts - Add Emergency Contact
// ============================================================
router.post("/:id/emergency-contacts", protect, async (req, res) => {
  try {
    const { name, phone, relationship } = req.body;

    if (!name || !phone || !relationship) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, phone, and relationship",
      });
    }

    const elder = await Elder.findOne({ userId: req.params.id });
    if (!elder) {
      return res.status(404).json({
        success: false,
        message: "Elder profile not found",
      });
    }

    // Check max contacts
    if (elder.emergencyContacts.length >= 5) {
      return res.status(409).json({
        success: false,
        message: "Maximum emergency contacts reached",
      });
    }

    // Add contact
    elder.emergencyContacts.push({
      name,
      phone,
      relationship,
    });

    await elder.save();

    res.status(201).json({
      success: true,
      message: "Emergency contact added successfully",
      data: elder.emergencyContacts,
    });
  } catch (error) {
    console.error("Add emergency contact error:", error);
    res.status(500).json({
      success: false,
      message: "Error adding emergency contact",
      error: error.message,
    });
  }
});

// ============================================================
// GET /elders/:id/medical-history - Get Medical History
// ============================================================
router.get("/:id/medical-history", protect, async (req, res) => {
  try {
    const elder = await Elder.findOne({ userId: req.params.id });

    if (!elder) {
      return res.status(404).json({
        success: false,
        message: "Elder profile not found",
      });
    }

    const medicalHistory = {
      elderId: elder._id,
      medicalConditions: elder.medicalConditions,
      medications: elder.medications,
      allergies: elder.allergies,
      healthMetrics: elder.healthMetrics,
      lastCheckup: elder.healthMetrics?.lastCheckup || null,
    };

    res.status(200).json({
      success: true,
      data: medicalHistory,
    });
  } catch (error) {
    console.error("Get medical history error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching medical history",
      error: error.message,
    });
  }
});

// ============================================================
// DELETE /elders/:id/emergency-contacts/:contactIndex - Delete Emergency Contact
// ============================================================
router.delete("/:id/emergency-contacts/:contactIndex", protect, async (req, res) => {
  try {
    const elder = await Elder.findOne({ userId: req.params.id });
    if (!elder) {
      return res.status(404).json({
        success: false,
        message: "Elder profile not found",
      });
    }

    const index = parseInt(req.params.contactIndex);
    if (index < 0 || index >= elder.emergencyContacts.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact index",
      });
    }

    elder.emergencyContacts.splice(index, 1);
    await elder.save();

    res.status(200).json({
      success: true,
      message: "Emergency contact deleted successfully",
      data: elder.emergencyContacts,
    });
  } catch (error) {
    console.error("Delete emergency contact error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting emergency contact",
      error: error.message,
    });
  }
});

module.exports = router;
