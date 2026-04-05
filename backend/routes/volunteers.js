// ============================================================
// routes/volunteers.js - Volunteer Routes
// ============================================================

const express = require("express");
const Volunteer = require("../models/Volunteer");
const { protect } = require("../middleware/auth");

const router = express.Router();

// ============================================================
// GET /volunteers/:id - Get Volunteer Profile
// ============================================================
router.get("/:id", protect, async (req, res) => {
  try {
    const volunteer = await Volunteer.findOne({ userId: req.params.id }).populate("userId", "fullName email phone");

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: "Volunteer profile not found",
      });
    }

    res.status(200).json({
      success: true,
      data: volunteer,
    });
  } catch (error) {
    console.error("Get volunteer profile error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching volunteer profile",
      error: error.message,
    });
  }
});

// ============================================================
// PUT /volunteers/:id - Update Volunteer Profile
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

    const { skills, serviceRadius } = req.body;

    let volunteer = await Volunteer.findOne({ userId: req.params.id });
    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: "Volunteer profile not found",
      });
    }

    // Update fields
    if (skills) volunteer.skills = skills;
    if (serviceRadius) volunteer.serviceRadius = serviceRadius;

    volunteer.updatedAt = new Date();
    await volunteer.save();

    res.status(200).json({
      success: true,
      message: "Volunteer profile updated successfully",
      data: volunteer,
    });
  } catch (error) {
    console.error("Update volunteer profile error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating volunteer profile",
      error: error.message,
    });
  }
});

// ============================================================
// PUT /volunteers/:id/availability - Update Availability
// ============================================================
router.put("/:id/availability", protect, async (req, res) => {
  try {
    // Check authorization
    if (req.user._id.toString() !== req.params.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this profile",
      });
    }

    const { availabilityDays, availabilityTimeSlots, serviceRadius } = req.body;

    let volunteer = await Volunteer.findOne({ userId: req.params.id });
    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: "Volunteer profile not found",
      });
    }

    // Update fields
    if (availabilityDays) volunteer.availabilityDays = availabilityDays;
    if (availabilityTimeSlots) volunteer.availabilityTimeSlots = availabilityTimeSlots;
    if (serviceRadius) volunteer.serviceRadius = serviceRadius;

    volunteer.updatedAt = new Date();
    await volunteer.save();

    res.status(200).json({
      success: true,
      message: "Availability updated successfully",
      data: {
        volunteerId: volunteer._id,
        availabilityDays: volunteer.availabilityDays,
        availabilityTimeSlots: volunteer.availabilityTimeSlots,
        serviceRadius: volunteer.serviceRadius,
      },
    });
  } catch (error) {
    console.error("Update availability error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating availability",
      error: error.message,
    });
  }
});

// ============================================================
// GET /volunteers/nearby - Get Nearby Volunteers
// ============================================================
router.get("/nearby", async (req, res) => {
  try {
    const { latitude, longitude, radius = 5, skills } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Please provide latitude and longitude",
      });
    }

    // Build query
    let query = {
      locationPermission: true,
      isVerified: true,
    };

    // Add location query
    query["currentLocation.coordinates"] = {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        $maxDistance: radius * 1000, // Convert km to meters
      },
    };

    // Add skills filter if provided
    if (skills) {
      const skillsArray = skills.split(",");
      query.skills = { $in: skillsArray };
    }

    const volunteers = await Volunteer.find(query)
      .populate("userId", "fullName email phone")
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        volunteers: volunteers.map((v) => ({
          volunteerId: v._id,
          fullName: v.userId.fullName,
          skills: v.skills,
          rating: v.rating,
          distance: "Calculated from coordinates",
          isAvailable: true,
          currentLocation: v.currentLocation,
        })),
        totalFound: volunteers.length,
      },
    });
  } catch (error) {
    console.error("Get nearby volunteers error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching nearby volunteers",
      error: error.message,
    });
  }
});

module.exports = router;
