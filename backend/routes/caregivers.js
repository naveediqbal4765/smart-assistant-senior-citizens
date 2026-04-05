// ============================================================
// routes/caregivers.js - Caregiver Routes
// ============================================================

const express = require("express");
const Caregiver = require("../models/Caregiver");
const Elder = require("../models/Elder");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

const router = express.Router();

// ============================================================
// GET /caregivers/:id - Get Caregiver Profile
// ============================================================
router.get("/:id", protect, async (req, res) => {
  try {
    const caregiver = await Caregiver.findOne({ userId: req.params.id })
      .populate("userId", "fullName email phone")
      .populate("assignedElders", "userId");

    if (!caregiver) {
      return res.status(404).json({
        success: false,
        message: "Caregiver profile not found",
      });
    }

    res.status(200).json({
      success: true,
      data: caregiver,
    });
  } catch (error) {
    console.error("Get caregiver profile error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching caregiver profile",
      error: error.message,
    });
  }
});

// ============================================================
// PUT /caregivers/:id - Update Caregiver Profile
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

    const { notificationsEnabled, isAvailable, availabilitySchedule } = req.body;

    let caregiver = await Caregiver.findOne({ userId: req.params.id });
    if (!caregiver) {
      return res.status(404).json({
        success: false,
        message: "Caregiver profile not found",
      });
    }

    // Update fields
    if (notificationsEnabled !== undefined) caregiver.notificationsEnabled = notificationsEnabled;
    if (isAvailable !== undefined) caregiver.isAvailable = isAvailable;
    if (availabilitySchedule) caregiver.availabilitySchedule = availabilitySchedule;

    caregiver.updatedAt = new Date();
    await caregiver.save();

    res.status(200).json({
      success: true,
      message: "Caregiver profile updated successfully",
      data: caregiver,
    });
  } catch (error) {
    console.error("Update caregiver profile error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating caregiver profile",
      error: error.message,
    });
  }
});

// ============================================================
// POST /caregivers/pair - Pair Caregiver with Elder
// ============================================================
router.post("/pair", protect, async (req, res) => {
  try {
    const { pairingCode, elderEmail } = req.body;

    if (!pairingCode || !elderEmail) {
      return res.status(400).json({
        success: false,
        message: "Please provide pairing code and elder email",
      });
    }

    // Find caregiver
    const caregiver = await Caregiver.findOne({ userId: req.user._id });
    if (!caregiver) {
      return res.status(404).json({
        success: false,
        message: "Caregiver profile not found",
      });
    }

    // Find elder by email
    const elderUser = await User.findOne({ email: elderEmail });
    if (!elderUser) {
      return res.status(404).json({
        success: false,
        message: "Elder not found",
      });
    }

    // Find elder profile
    const elder = await Elder.findOne({ userId: elderUser._id });
    if (!elder) {
      return res.status(404).json({
        success: false,
        message: "Elder profile not found",
      });
    }

    // TODO: Validate pairing code (should be generated and sent to elder)
    // For now, accept any code
    if (!pairingCode) {
      return res.status(400).json({
        success: false,
        message: "Invalid pairing code",
      });
    }

    // Check if already paired
    if (caregiver.assignedElders.includes(elder._id)) {
      return res.status(409).json({
        success: false,
        message: "Already paired with this elder",
      });
    }

    // Add pairing
    caregiver.assignedElders.push(elder._id);
    if (!elder.assignedCaregivers.includes(req.user._id)) {
      elder.assignedCaregivers.push(req.user._id);
    }

    await caregiver.save();
    await elder.save();

    res.status(200).json({
      success: true,
      message: "Pairing successful",
      data: {
        pairingId: `${caregiver._id}-${elder._id}`,
        elderId: elder._id,
        caregiverId: caregiver._id,
        status: "active",
      },
    });
  } catch (error) {
    console.error("Pair caregiver error:", error);
    res.status(500).json({
      success: false,
      message: "Error pairing caregiver",
      error: error.message,
    });
  }
});

// ============================================================
// GET /caregivers/:id/assigned-elders - Get Assigned Elders
// ============================================================
router.get("/:id/assigned-elders", protect, async (req, res) => {
  try {
    const caregiver = await Caregiver.findOne({ userId: req.params.id }).populate({
      path: "assignedElders",
      populate: {
        path: "userId",
        select: "fullName email phone address",
      },
    });

    if (!caregiver) {
      return res.status(404).json({
        success: false,
        message: "Caregiver profile not found",
      });
    }

    const assignedElders = caregiver.assignedElders.map((elder) => ({
      elderId: elder._id,
      elderName: elder.userId.fullName,
      email: elder.userId.email,
      phone: elder.userId.phone,
      address: elder.userId.address,
      medicalConditions: elder.medicalConditions,
      emergencyContacts: elder.emergencyContacts.length,
      lastActive: elder.updatedAt,
    }));

    res.status(200).json({
      success: true,
      data: {
        caregiverId: caregiver._id,
        assignedElders,
      },
    });
  } catch (error) {
    console.error("Get assigned elders error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching assigned elders",
      error: error.message,
    });
  }
});

module.exports = router;
