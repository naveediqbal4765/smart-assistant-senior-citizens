# Location Tracking System - API Documentation

## Overview
This document describes the location tracking system for the Smart Assistant for Senior Citizens application. The system allows users to enable location tracking when they grant permission, and provides real-time location updates, history tracking, and geofence functionality.

---

## Features

### ✅ Core Features
- **Real-time Location Updates** - Store current user location
- **Location History** - Keep track of last 100 locations
- **Enable/Disable Tracking** - Users can control location tracking
- **Geofence Checking** - Check if user is within a specific radius
- **Nearby Users** - Find nearby volunteers/caregivers
- **Distance Calculation** - Calculate distance between coordinates
- **Role-based Permissions** - Different permission handling for each role

### ✅ Supported Roles
- **Elder** - `locationPermission` field
- **Caregiver** - `privacySettings.locationSharing` field
- **Volunteer** - `volunteerLocationPermission` field

---

## API Endpoints

### 1. Update User Location
**Endpoint:** `POST /api/location/update`

**Authentication:** Required (JWT Token)

**Description:** Store current user location. Only works if user has granted location permission.

**Request Body:**
```json
{
  "latitude": 24.8607,
  "longitude": 67.0011,
  "accuracy": 10
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Location stored successfully",
  "data": {
    "latitude": 24.8607,
    "longitude": 67.0011,
    "accuracy": 10,
    "timestamp": "2025-04-27T10:30:00.000Z"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "User has not granted location permission"
}
```

**Status Codes:**
- `200` - Location stored successfully
- `400` - Invalid coordinates or no permission
- `500` - Server error

---

### 2. Get Current Location
**Endpoint:** `GET /api/location/current`

**Authentication:** Required (JWT Token)

**Description:** Get the current location of the authenticated user.

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "latitude": 24.8607,
    "longitude": 67.0011,
    "accuracy": 10,
    "timestamp": "2025-04-27T10:30:00.000Z"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "No location data available"
}
```

---

### 3. Get Location History
**Endpoint:** `GET /api/location/history?limit=50`

**Authentication:** Required (JWT Token)

**Description:** Get location history for the user. Returns last N locations (default 50, max 100).

**Query Parameters:**
- `limit` (optional) - Number of locations to return (default: 50)

**Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "latitude": 24.8607,
      "longitude": 67.0011,
      "accuracy": 10,
      "timestamp": "2025-04-27T10:30:00.000Z"
    },
    {
      "latitude": 24.8610,
      "longitude": 67.0015,
      "accuracy": 12,
      "timestamp": "2025-04-27T10:25:00.000Z"
    }
  ],
  "count": 2
}
```

---

### 4. Clear Location History
**Endpoint:** `DELETE /api/location/history`

**Authentication:** Required (JWT Token)

**Description:** Clear all location history for the user.

**Response (Success):**
```json
{
  "success": true,
  "message": "Location history cleared successfully"
}
```

---

### 5. Enable Location Tracking
**Endpoint:** `POST /api/location/enable`

**Authentication:** Required (JWT Token)

**Description:** Enable location tracking for the user. Updates role-specific permission fields.

**Response (Success):**
```json
{
  "success": true,
  "message": "Location tracking enabled",
  "data": {
    "enabled": true,
    "enabledAt": "2025-04-27T10:30:00.000Z"
  }
}
```

---

### 6. Disable Location Tracking
**Endpoint:** `POST /api/location/disable`

**Authentication:** Required (JWT Token)

**Description:** Disable location tracking for the user.

**Response (Success):**
```json
{
  "success": true,
  "message": "Location tracking disabled",
  "data": {
    "enabled": false,
    "disabledAt": "2025-04-27T10:30:00.000Z"
  }
}
```

---

### 7. Get Location Tracking Status
**Endpoint:** `GET /api/location/status`

**Authentication:** Required (JWT Token)

**Description:** Get the current location tracking status for the user.

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "enabled": true,
    "hasPermission": true,
    "currentLocation": {
      "latitude": 24.8607,
      "longitude": 67.0011,
      "accuracy": 10,
      "timestamp": "2025-04-27T10:30:00.000Z"
    },
    "enabledAt": "2025-04-27T10:00:00.000Z",
    "disabledAt": null
  }
}
```

---

### 8. Get Nearby Users
**Endpoint:** `GET /api/location/nearby?radius=5`

**Authentication:** Required (JWT Token)

**Description:** Get list of nearby users within specified radius (in kilometers).

**Query Parameters:**
- `radius` (optional) - Search radius in km (default: 5)

**Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "userId": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "role": "volunteer",
      "distance": 2.5,
      "location": {
        "latitude": 24.8620,
        "longitude": 67.0025
      },
      "lastUpdated": "2025-04-27T10:30:00.000Z"
    }
  ],
  "count": 1,
  "radiusKm": 5
}
```

---

### 9. Check Geofence Status
**Endpoint:** `POST /api/location/geofence`

**Authentication:** Required (JWT Token)

**Description:** Check if user is within a specific radius of a target location.

**Request Body:**
```json
{
  "latitude": 24.8607,
  "longitude": 67.0011,
  "radiusKm": 1
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "isWithinGeofence": true,
    "distance": 0.5,
    "radiusKm": 1,
    "userLocation": {
      "latitude": 24.8607,
      "longitude": 67.0011
    },
    "targetLocation": {
      "latitude": 24.8607,
      "longitude": 67.0011
    }
  }
}
```

---

## Frontend Integration Example

### React Component for Location Tracking

```javascript
import { useEffect, useState } from 'react';

const LocationTracker = ({ accessToken }) => {
  const [location, setLocation] = useState(null);
  const [trackingEnabled, setTrackingEnabled] = useState(false);
  const [error, setError] = useState(null);

  // Get current location from device
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        // Send to backend
        try {
          const response = await fetch('/api/location/update', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              latitude,
              longitude,
              accuracy
            })
          });

          const data = await response.json();
          if (data.success) {
            setLocation(data.data);
          } else {
            setError(data.message);
          }
        } catch (err) {
          setError(err.message);
        }
      },
      (error) => {
        setError(error.message);
      }
    );
  };

  // Enable location tracking
  const handleEnableTracking = async () => {
    try {
      const response = await fetch('/api/location/enable', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setTrackingEnabled(true);
        // Start periodic location updates
        startLocationTracking();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Disable location tracking
  const handleDisableTracking = async () => {
    try {
      const response = await fetch('/api/location/disable', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setTrackingEnabled(false);
        stopLocationTracking();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Start periodic location updates (every 30 seconds)
  const startLocationTracking = () => {
    const interval = setInterval(() => {
      getCurrentLocation();
    }, 30000);

    return interval;
  };

  const stopLocationTracking = () => {
    clearInterval(locationInterval);
  };

  // Get tracking status on mount
  useEffect(() => {
    const getStatus = async () => {
      try {
        const response = await fetch('/api/location/status', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        const data = await response.json();
        if (data.success) {
          setTrackingEnabled(data.data.enabled);
          setLocation(data.data.currentLocation);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    getStatus();
  }, [accessToken]);

  return (
    <div>
      <h2>Location Tracking</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {location && (
        <div>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
          <p>Accuracy: {location.accuracy}m</p>
          <p>Last Updated: {new Date(location.timestamp).toLocaleString()}</p>
        </div>
      )}

      <div>
        {trackingEnabled ? (
          <button onClick={handleDisableTracking}>Disable Tracking</button>
        ) : (
          <button onClick={handleEnableTracking}>Enable Tracking</button>
        )}
      </div>

      <button onClick={getCurrentLocation}>Get Current Location</button>
    </div>
  );
};

export default LocationTracker;
```

---

## Service Functions

### locationService.storeUserLocation(userId, latitude, longitude, accuracy)
Store user location in database.

**Parameters:**
- `userId` (string) - User ID
- `latitude` (number) - Latitude (-90 to 90)
- `longitude` (number) - Longitude (-180 to 180)
- `accuracy` (number, optional) - Location accuracy in meters

**Returns:**
```javascript
{
  success: boolean,
  message: string,
  data?: {
    latitude: number,
    longitude: number,
    accuracy: number,
    timestamp: Date
  }
}
```

---

### locationService.getUserLocation(userId)
Get current location of user.

**Parameters:**
- `userId` (string) - User ID

**Returns:**
```javascript
{
  success: boolean,
  data?: {
    latitude: number,
    longitude: number,
    accuracy: number,
    timestamp: Date
  }
}
```

---

### locationService.getLocationHistory(userId, limit)
Get location history for user.

**Parameters:**
- `userId` (string) - User ID
- `limit` (number, optional) - Number of locations to return (default: 50)

**Returns:**
```javascript
{
  success: boolean,
  data: Array,
  count: number
}
```

---

### locationService.calculateDistance(lat1, lon1, lat2, lon2)
Calculate distance between two coordinates using Haversine formula.

**Parameters:**
- `lat1` (number) - Latitude of first point
- `lon1` (number) - Longitude of first point
- `lat2` (number) - Latitude of second point
- `lon2` (number) - Longitude of second point

**Returns:**
- `distance` (number) - Distance in kilometers

---

### locationService.checkGeofence(userId, targetLatitude, targetLongitude, radiusKm)
Check if user is within geofence.

**Parameters:**
- `userId` (string) - User ID
- `targetLatitude` (number) - Target latitude
- `targetLongitude` (number) - Target longitude
- `radiusKm` (number, optional) - Radius in km (default: 1)

**Returns:**
```javascript
{
  success: boolean,
  data: {
    isWithinGeofence: boolean,
    distance: number,
    radiusKm: number,
    userLocation: { latitude, longitude },
    targetLocation: { latitude, longitude }
  }
}
```

---

## Database Schema

### User Model Location Fields

```javascript
// Location Tracking
locationTrackingEnabled: Boolean,
locationTrackingEnabledAt: Date,
locationTrackingDisabledAt: Date,

// Current Location
currentLocation: {
  latitude: Number,
  longitude: Number,
  accuracy: Number,
  timestamp: Date
},

// Location History (last 100 locations)
locationHistory: [{
  latitude: Number,
  longitude: Number,
  accuracy: Number,
  timestamp: Date
}]
```

---

## Error Handling

### Common Errors

**1. User has not granted location permission**
```json
{
  "success": false,
  "message": "User has not granted location permission"
}
```

**2. Invalid coordinates**
```json
{
  "success": false,
  "message": "Invalid coordinates"
}
```

**3. No location data available**
```json
{
  "success": false,
  "message": "No location data available"
}
```

**4. User location not available**
```json
{
  "success": false,
  "message": "User location not available"
}
```

---

## Security Considerations

### ✅ Security Features
- **JWT Authentication** - All endpoints require authentication
- **Permission Checking** - Verifies user has granted location permission
- **Role-based Access** - Different permission fields for each role
- **Data Validation** - Validates latitude/longitude ranges
- **History Limit** - Only keeps last 100 locations to prevent storage bloat

### ⚠️ Privacy Best Practices
1. **Always ask for permission** before enabling location tracking
2. **Show clear consent** about what data is being collected
3. **Allow easy disable** of location tracking
4. **Encrypt location data** in transit (HTTPS)
5. **Limit access** to location data to authorized users only
6. **Regular cleanup** of old location history

---

## Testing with Postman

### 1. Enable Location Tracking
```
POST http://localhost:5000/api/location/enable
Headers:
  Authorization: Bearer <your_jwt_token>
  Content-Type: application/json
```

### 2. Update Location
```
POST http://localhost:5000/api/location/update
Headers:
  Authorization: Bearer <your_jwt_token>
  Content-Type: application/json

Body:
{
  "latitude": 24.8607,
  "longitude": 67.0011,
  "accuracy": 10
}
```

### 3. Get Current Location
```
GET http://localhost:5000/api/location/current
Headers:
  Authorization: Bearer <your_jwt_token>
```

### 4. Get Location History
```
GET http://localhost:5000/api/location/history?limit=50
Headers:
  Authorization: Bearer <your_jwt_token>
```

### 5. Check Geofence
```
POST http://localhost:5000/api/location/geofence
Headers:
  Authorization: Bearer <your_jwt_token>
  Content-Type: application/json

Body:
{
  "latitude": 24.8607,
  "longitude": 67.0011,
  "radiusKm": 1
}
```

---

## Troubleshooting

### Issue: "User has not granted location permission"
**Solution:**
1. Call `POST /api/location/enable` first
2. Verify user role has location permission enabled
3. Check privacy settings for location sharing

### Issue: "Invalid coordinates"
**Solution:**
1. Ensure latitude is between -90 and 90
2. Ensure longitude is between -180 and 180
3. Check coordinate format (should be numbers, not strings)

### Issue: "No location data available"
**Solution:**
1. Update location first using `POST /api/location/update`
2. Ensure location tracking is enabled
3. Check if user has granted permission

---

## References

- [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
- [Haversine Formula](https://en.wikipedia.org/wiki/Haversine_formula)
- [GeoJSON Specification](https://geojson.org/)
