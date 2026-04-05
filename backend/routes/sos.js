// ============================================================
// routes/sos.js - SOS Alert Routes
// ============================================================

const express = require("express");
const SOS = require("../models/SOS");
const Elder = require("../models/Elder");
const { protect } = require("../middleware/auth");

const router = express.Router();

// ============================================================
// POST /sos/trigger - Trigger SOS Alert
// ============================================================
router.post("/trigger", protect, async (req, res) => {
  try {
    const { location, description, severity = "high" } = req.body;

    if (!location || !description) {
      return res.status(400).json({
        success: false,
        message: "Please provide location and description",
      });
    }

    // Find elder profile
    const elder = await Elder.findOne({ userId: req.user._id });
    if (!elder) {
      return res.status(404).json({
        success: false,
        message: "Elder profile not found",
      });
    }

    // Create SOS alert
    const sos = await SOS.create({
      elderId: elder._id,
      description,
      severity,
      location: {
        type: "Point",
        coordinates: [location.longitude, location.latitude],
        address: location.address || "Unknown location",
      },
      status: "active",
    });

    // TODO: Send notifications to caregivers and volunteers
    console.log(`SOS Alert triggered for elder ${elder._id}`);

    res.status(201).json({
      success: true,
      message: "SOS alert triggered successfully",
      data: {
        sosId: sos._id,
        elderId: sos.elderId,
        status: sos.status,
        createdAt: sos.createdAt,
        notificationsSent: 0, // TODO: Count actual notifications
      },
    });
  } catch (error) {
    console.error("Trigger SOS error:", error);
    res.status(500).json({
      success: false,
      message: "Error triggering SOS alert",
      error: error.message,
    });
  }
});

// ============================================================
// GET /sos/history - Get SOS History
// ============================================================
router.get("/history", protect, async (req, res) => {
  try {
    const { limit = 10, offset = 0, status } = req.query;

    // Find elder profile
    const elder = await Elder.findOne({ userId: req.user._id });
    if (!elder) {
      return res.status(404).json({
        success: false,
        message: "Elder profile not found",
      });
    }

    // Build query
    let query = { elderId: elder._id };
    if (status) {
      query.status = status;
    }

    // Get SOS alerts
    const sosAlerts = await SOS.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .populate("resolvedBy", "fullName email");

    // Get total count
    const total = await SOS.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        sosAlerts: sosAlerts.map((sos) => ({
          sosId: sos._id,
          elderId: sos.elderId,
          description: sos.description,
          severity: sos.severity,
          status: sos.status,
          location: sos.location,
          createdAt: sos.createdAt,
          resolvedAt: sos.resolvedAt,
          resolvedBy: sos.resolvedBy?.fullName || null,
        })),
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    console.error("Get SOS history error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching SOS history",
      error: error.message,
    });
  }
});

// ============================================================
// PUT /sos/:id/resolve - Resolve SOS Alert
// ============================================================
router.put("/:id/resolve", protect, async (req, res) => {
  try {
    const { status = "resolved", notes } = req.body;

    if (!["resolved", "cancelled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be 'resolved' or 'cancelled'",
      });
    }

    const sos = await SOS.findById(req.params.id);
    if (!sos) {
      return res.status(404).json({
        success: false,
        message: "SOS alert not found",
      });
    }

    // Update SOS
    sos.status = status;
    sos.resolvedBy = req.user._id;
    sos.resolutionNotes = notes || "";
    sos.resolvedAt = new Date();
    await sos.save();

    res.status(200).json({
      success: true,
      message: "SOS alert resolved successfully",
      data: {
        sosId: sos._id,
        status: sos.status,
        resolvedAt: sos.resolvedAt,
        notes: sos.resolutionNotes,
      },
    });
  } catch (error) {
    console.error("Resolve SOS error:", error);
    res.status(500).json({
      success: false,
      message: "Error resolving SOS alert",
      error: error.message,
    });
  }
});

// ============================================================
// GET /sos/:id - Get SOS Alert Details
// ============================================================
router.get("/:id", protect, async (req, res) => {
  try {
    const sos = await SOS.findById(req.params.id)
      .populate("elderId")
      .populate("resolvedBy", "fullName email");

    if (!sos) {
      return res.status(404).json({
        success: false,
        message: "SOS alert not found",
      });
    }

    res.status(200).json({
      success: true,
      data: sos,
    });
  } catch (error) {
    console.error("Get SOS details error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching SOS details",
      error: error.message,
    });
  }
});

module.exports = router;
