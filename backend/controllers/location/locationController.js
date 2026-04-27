// ============================================================
// controllers/location/locationController.js - Location Management
// ============================================================

const locationService = require("../../services/locationService");

// ============================================================
// POST /api/location/update - Update User Location
// ============================================================
exports.updateLocation = async (req, res) => {
  try {
    const userId = req.user._id;
    const { latitude, longitude, accuracy } = req.body;

    // Validation
    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

    // Store location
    const result = await locationService.storeUserLocation(
      userId,
      latitude,
      longitude,
      accuracy
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Update location error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating location",
      error: error.message,
    });
  }
};

// ============================================================
// GET /api/location/current - Get Current User Location
// ============================================================
exports.getCurrentLocation = async (req, res) => {
  try {
    const userId = req.user._id;

    const result = await locationService.getUserLocation(userId);

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Get current location error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching current location",
      error: error.message,
    });
  }
};

// ============================================================
// GET /api/location/history - Get Location History
// ============================================================
exports.getLocationHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const limit = req.query.limit || 50;

    const result = await locationService.getLocationHistory(userId, parseInt(limit));

    res.status(200).json(result);
  } catch (error) {
    console.error("Get location history error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching location history",
      error: error.message,
    });
  }
};

// ============================================================
// DELETE /api/location/history - Clear Location History
// ============================================================
exports.clearLocationHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const result = await locationService.clearLocationHistory(userId);

    res.status(200).json(result);
  } catch (error) {
    console.error("Clear location history error:", error);
    res.status(500).json({
      success: false,
      message: "Error clearing location history",
      error: error.message,
    });
  }
};

// ============================================================
// POST /api/location/enable - Enable Location Tracking
// ============================================================
exports.enableLocationTracking = async (req, res) => {
  try {
    const userId = req.user._id;

    const result = await locationService.enableLocationTracking(userId);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Enable location tracking error:", error);
    res.status(500).json({
      success: false,
      message: "Error enabling location tracking",
      error: error.message,
    });
  }
};

// ============================================================
// POST /api/location/disable - Disable Location Tracking
// ============================================================
exports.disableLocationTracking = async (req, res) => {
  try {
    const userId = req.user._id;

    const result = await locationService.disableLocationTracking(userId);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Disable location tracking error:", error);
    res.status(500).json({
      success: false,
      message: "Error disabling location tracking",
      error: error.message,
    });
  }
};

// ============================================================
// GET /api/location/status - Get Location Tracking Status
// ============================================================
exports.getLocationTrackingStatus = async (req, res) => {
  try {
    const userId = req.user._id;

    const result = await locationService.getLocationTrackingStatus(userId);

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Get location tracking status error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching location tracking status",
      error: error.message,
    });
  }
};

// ============================================================
// GET /api/location/nearby - Get Nearby Users
// ============================================================
exports.getNearbyUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const radiusKm = req.query.radius || 5;

    const result = await locationService.getNearbyUsers(userId, parseFloat(radiusKm));

    res.status(200).json(result);
  } catch (error) {
    console.error("Get nearby users error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching nearby users",
      error: error.message,
    });
  }
};

// ============================================================
// POST /api/location/geofence - Check Geofence Status
// ============================================================
exports.checkGeofence = async (req, res) => {
  try {
    const userId = req.user._id;
    const { latitude, longitude, radiusKm } = req.body;

    // Validation
    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

    const result = await locationService.checkGeofence(
      userId,
      latitude,
      longitude,
      radiusKm || 1
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Check geofence error:", error);
    res.status(500).json({
      success: false,
      message: "Error checking geofence",
      error: error.message,
    });
  }
};
