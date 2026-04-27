// ============================================================
// routes/location.js - Location Management Routes
// ============================================================

const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  updateLocation,
  getCurrentLocation,
  getLocationHistory,
  clearLocationHistory,
  enableLocationTracking,
  disableLocationTracking,
  getLocationTrackingStatus,
  getNearbyUsers,
  checkGeofence,
} = require("../controllers/location/locationController");

// ============================================================
// Location Routes - All Protected
// ============================================================

// POST /api/location/update - Update user location
router.post("/update", protect, updateLocation);

// GET /api/location/current - Get current location
router.get("/current", protect, getCurrentLocation);

// GET /api/location/history - Get location history
router.get("/history", protect, getLocationHistory);

// DELETE /api/location/history - Clear location history
router.delete("/history", protect, clearLocationHistory);

// POST /api/location/enable - Enable location tracking
router.post("/enable", protect, enableLocationTracking);

// POST /api/location/disable - Disable location tracking
router.post("/disable", protect, disableLocationTracking);

// GET /api/location/status - Get location tracking status
router.get("/status", protect, getLocationTrackingStatus);

// GET /api/location/nearby - Get nearby users
router.get("/nearby", protect, getNearbyUsers);

// POST /api/location/geofence - Check geofence status
router.post("/geofence", protect, checkGeofence);

module.exports = router;
