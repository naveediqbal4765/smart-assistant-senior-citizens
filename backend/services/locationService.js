// ============================================================
// services/locationService.js - Location Tracking Service
// ============================================================

const User = require("../models/User");
const Elder = require("../models/Elder");
const Caregiver = require("../models/Caregiver");
const Volunteer = require("../models/Volunteer");

// ============================================================
// Store User Location
// ============================================================
exports.storeUserLocation = async (userId, latitude, longitude, accuracy = null) => {
  try {
    if (!userId || latitude === undefined || longitude === undefined) {
      return {
        success: false,
        message: "User ID, latitude, and longitude are required",
      };
    }

    // Validate coordinates
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return {
        success: false,
        message: "Invalid coordinates",
      };
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // Check if user has location permission
    let hasLocationPermission = false;

    if (user.role === "elder") {
      const elder = await Elder.findOne({ userId });
      hasLocationPermission = elder?.locationPermission || false;
    } else if (user.role === "caregiver") {
      hasLocationPermission = user.privacySettings?.locationSharing || false;
    } else if (user.role === "volunteer") {
      const volunteer = await Volunteer.findOne({ userId });
      hasLocationPermission = volunteer?.volunteerLocationPermission || false;
    }

    if (!hasLocationPermission) {
      return {
        success: false,
        message: "User has not granted location permission",
      };
    }

    // Update user location
    user.currentLocation = {
      latitude: latitude,
      longitude: longitude,
      accuracy: accuracy,
      timestamp: new Date(),
    };

    // Store location history (keep last 100 locations)
    if (!user.locationHistory) {
      user.locationHistory = [];
    }

    user.locationHistory.push({
      latitude: latitude,
      longitude: longitude,
      accuracy: accuracy,
      timestamp: new Date(),
    });

    // Keep only last 100 locations
    if (user.locationHistory.length > 100) {
      user.locationHistory = user.locationHistory.slice(-100);
    }

    await user.save();

    return {
      success: true,
      message: "Location stored successfully",
      data: {
        latitude: latitude,
        longitude: longitude,
        accuracy: accuracy,
        timestamp: user.currentLocation.timestamp,
      },
    };
  } catch (error) {
    console.error("Store location error:", error);
    return {
      success: false,
      message: "Error storing location",
      error: error.message,
    };
  }
};

// ============================================================
// Get User Current Location
// ============================================================
exports.getUserLocation = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    if (!user.currentLocation) {
      return {
        success: false,
        message: "No location data available",
      };
    }

    return {
      success: true,
      data: {
        latitude: user.currentLocation.latitude,
        longitude: user.currentLocation.longitude,
        accuracy: user.currentLocation.accuracy,
        timestamp: user.currentLocation.timestamp,
      },
    };
  } catch (error) {
    console.error("Get location error:", error);
    return {
      success: false,
      message: "Error fetching location",
      error: error.message,
    };
  }
};

// ============================================================
// Get Location History
// ============================================================
exports.getLocationHistory = async (userId, limit = 50) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    if (!user.locationHistory || user.locationHistory.length === 0) {
      return {
        success: true,
        data: [],
        message: "No location history available",
      };
    }

    // Get last N locations
    const history = user.locationHistory.slice(-limit);

    return {
      success: true,
      data: history,
      count: history.length,
    };
  } catch (error) {
    console.error("Get location history error:", error);
    return {
      success: false,
      message: "Error fetching location history",
      error: error.message,
    };
  }
};

// ============================================================
// Clear Location History
// ============================================================
exports.clearLocationHistory = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    user.locationHistory = [];
    await user.save();

    return {
      success: true,
      message: "Location history cleared successfully",
    };
  } catch (error) {
    console.error("Clear location history error:", error);
    return {
      success: false,
      message: "Error clearing location history",
      error: error.message,
    };
  }
};

// ============================================================
// Enable Location Tracking
// ============================================================
exports.enableLocationTracking = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // Enable location tracking based on role
    if (user.role === "elder") {
      const elder = await Elder.findOne({ userId });
      if (elder) {
        elder.locationPermission = true;
        await elder.save();
      }
    } else if (user.role === "caregiver") {
      user.privacySettings.locationSharing = true;
    } else if (user.role === "volunteer") {
      const volunteer = await Volunteer.findOne({ userId });
      if (volunteer) {
        volunteer.volunteerLocationPermission = true;
        await volunteer.save();
      }
    }

    user.locationTrackingEnabled = true;
    user.locationTrackingEnabledAt = new Date();
    await user.save();

    return {
      success: true,
      message: "Location tracking enabled",
      data: {
        enabled: true,
        enabledAt: user.locationTrackingEnabledAt,
      },
    };
  } catch (error) {
    console.error("Enable location tracking error:", error);
    return {
      success: false,
      message: "Error enabling location tracking",
      error: error.message,
    };
  }
};

// ============================================================
// Disable Location Tracking
// ============================================================
exports.disableLocationTracking = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // Disable location tracking based on role
    if (user.role === "elder") {
      const elder = await Elder.findOne({ userId });
      if (elder) {
        elder.locationPermission = false;
        await elder.save();
      }
    } else if (user.role === "caregiver") {
      user.privacySettings.locationSharing = false;
    } else if (user.role === "volunteer") {
      const volunteer = await Volunteer.findOne({ userId });
      if (volunteer) {
        volunteer.volunteerLocationPermission = false;
        await volunteer.save();
      }
    }

    user.locationTrackingEnabled = false;
    user.locationTrackingDisabledAt = new Date();
    await user.save();

    return {
      success: true,
      message: "Location tracking disabled",
      data: {
        enabled: false,
        disabledAt: user.locationTrackingDisabledAt,
      },
    };
  } catch (error) {
    console.error("Disable location tracking error:", error);
    return {
      success: false,
      message: "Error disabling location tracking",
      error: error.message,
    };
  }
};

// ============================================================
// Get Location Tracking Status
// ============================================================
exports.getLocationTrackingStatus = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    let locationPermission = false;

    if (user.role === "elder") {
      const elder = await Elder.findOne({ userId });
      locationPermission = elder?.locationPermission || false;
    } else if (user.role === "caregiver") {
      locationPermission = user.privacySettings?.locationSharing || false;
    } else if (user.role === "volunteer") {
      const volunteer = await Volunteer.findOne({ userId });
      locationPermission = volunteer?.volunteerLocationPermission || false;
    }

    return {
      success: true,
      data: {
        enabled: user.locationTrackingEnabled || false,
        hasPermission: locationPermission,
        currentLocation: user.currentLocation || null,
        enabledAt: user.locationTrackingEnabledAt || null,
        disabledAt: user.locationTrackingDisabledAt || null,
      },
    };
  } catch (error) {
    console.error("Get location tracking status error:", error);
    return {
      success: false,
      message: "Error fetching location tracking status",
      error: error.message,
    };
  }
};

// ============================================================
// Calculate Distance Between Two Points
// ============================================================
exports.calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 100) / 100; // Round to 2 decimal places
};

// ============================================================
// Get Nearby Users (for volunteers/caregivers)
// ============================================================
exports.getNearbyUsers = async (userId, radiusKm = 5) => {
  try {
    const user = await User.findById(userId);

    if (!user || !user.currentLocation) {
      return {
        success: false,
        message: "User location not available",
      };
    }

    const { latitude, longitude } = user.currentLocation;

    // Find all users with location tracking enabled
    const allUsers = await User.find({
      _id: { $ne: userId },
      locationTrackingEnabled: true,
      currentLocation: { $exists: true },
    });

    const nearbyUsers = [];

    for (const otherUser of allUsers) {
      const distance = this.calculateDistance(
        latitude,
        longitude,
        otherUser.currentLocation.latitude,
        otherUser.currentLocation.longitude
      );

      if (distance <= radiusKm) {
        nearbyUsers.push({
          userId: otherUser._id,
          name: otherUser.fullName,
          role: otherUser.role,
          distance: distance,
          location: {
            latitude: otherUser.currentLocation.latitude,
            longitude: otherUser.currentLocation.longitude,
          },
          lastUpdated: otherUser.currentLocation.timestamp,
        });
      }
    }

    // Sort by distance
    nearbyUsers.sort((a, b) => a.distance - b.distance);

    return {
      success: true,
      data: nearbyUsers,
      count: nearbyUsers.length,
      radiusKm: radiusKm,
    };
  } catch (error) {
    console.error("Get nearby users error:", error);
    return {
      success: false,
      message: "Error fetching nearby users",
      error: error.message,
    };
  }
};

// ============================================================
// Get Geofence Status (Check if user is within radius of location)
// ============================================================
exports.checkGeofence = async (userId, targetLatitude, targetLongitude, radiusKm = 1) => {
  try {
    const user = await User.findById(userId);

    if (!user || !user.currentLocation) {
      return {
        success: false,
        message: "User location not available",
      };
    }

    const distance = this.calculateDistance(
      user.currentLocation.latitude,
      user.currentLocation.longitude,
      targetLatitude,
      targetLongitude
    );

    const isWithinGeofence = distance <= radiusKm;

    return {
      success: true,
      data: {
        isWithinGeofence: isWithinGeofence,
        distance: distance,
        radiusKm: radiusKm,
        userLocation: {
          latitude: user.currentLocation.latitude,
          longitude: user.currentLocation.longitude,
        },
        targetLocation: {
          latitude: targetLatitude,
          longitude: targetLongitude,
        },
      },
    };
  } catch (error) {
    console.error("Check geofence error:", error);
    return {
      success: false,
      message: "Error checking geofence",
      error: error.message,
    };
  }
};
