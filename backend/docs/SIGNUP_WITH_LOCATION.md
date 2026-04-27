# Signup with Location Permission - API Documentation

## Overview
This document describes the signup process with location permission for the Smart Assistant for Senior Citizens application. Users can grant location permission during signup, and their device location will be automatically tracked and stored.

---

## Features

### ✅ Core Features
- **Signup with Location** - Register and grant location permission in one step
- **Role-based Location Handling** - Different permission fields for each role
- **Automatic Location Tracking** - Starts tracking immediately after signup
- **Location History** - Stores initial location and begins history tracking
- **Validation** - Comprehensive input validation for all fields
- **Error Handling** - Detailed error messages for debugging

### ✅ Supported Roles
- **Elder** - `locationPermission` field in Elder model
- **Caregiver** - `privacySettings.locationSharing` field in User model
- **Volunteer** - `volunteerLocationPermission` field in Volunteer model

---

## API Endpoints

### 1. Signup with Location
**Endpoint:** `POST /api/auth/signup-with-location`

**Authentication:** Not required (public endpoint)

**Description:** Register a new user and grant location permission in one step. Location tracking starts immediately if permission is granted.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123",
  "phone": "03001234567",
  "role": "elder",
  "locationPermission": true,
  "latitude": 24.8607,
  "longitude": 67.0011,
  "accuracy": 10,
  "address": "123 Main Street, Karachi, Pakistan"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "User registered successfully with location",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "fullName": "John Doe",
      "email": "john@example.com",
      "phone": "03001234567",
      "role": "elder",
      "profilePicture": null,
      "address": {
        "text": "123 Main Street, Karachi, Pakistan",
        "lat": 24.8607,
        "lng": 67.0011
      },
      "locationTrackingEnabled": true,
      "currentLocation": {
        "latitude": 24.8607,
        "longitude": 67.0011,
        "accuracy": 10,
        "timestamp": "2025-04-27T10:30:00.000Z"
      }
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Email already registered"
}
```

**Status Codes:**
- `201` - User registered successfully
- `400` - Validation error
- `409` - Email already registered
- `500` - Server error

**Validation Rules:**
- `fullName` - Required, 2-100 characters
- `email` - Required, valid email format
- `password` - Required, min 8 characters, must contain uppercase, lowercase, and numbers
- `confirmPassword` - Required, must match password
- `phone` - Optional, exactly 11 digits
- `role` - Required, must be "elder", "caregiver", or "volunteer"
- `locationPermission` - Optional, boolean
- `latitude` - Required if locationPermission=true, between -90 and 90
- `longitude` - Required if locationPermission=true, between -180 and 180
- `accuracy` - Optional, positive number (in meters)
- `address` - Optional, max 500 characters

---

### 2. Verify Location Permission
**Endpoint:** `POST /api/auth/verify-location-permission`

**Authentication:** Required (JWT Token)

**Description:** Verify and store location after signup. Used when user grants location permission after initial signup.

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
  "message": "Location permission verified and stored",
  "data": {
    "locationTrackingEnabled": true,
    "currentLocation": {
      "latitude": 24.8607,
      "longitude": 67.0011,
      "accuracy": 10,
      "timestamp": "2025-04-27T10:30:00.000Z"
    }
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
- `200` - Location verified and stored
- `400` - Invalid coordinates or no permission
- `404` - User not found
- `500` - Server error

---

## Frontend Integration Example

### React Component for Signup with Location

```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignupWithLocation = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'elder',
    locationPermission: false,
    latitude: null,
    longitude: null,
    accuracy: null,
    address: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Get device location
  const getDeviceLocation = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setFormData(prev => ({
          ...prev,
          latitude,
          longitude,
          accuracy,
          locationPermission: true
        }));
      },
      (error) => {
        setError(`Location error: ${error.message}`);
      }
    );
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/signup-with-location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        // Store tokens
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);

        // Redirect to dashboard
        navigate(`/dashboard/${data.data.user.role}`);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h1>Sign Up</h1>

      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Full Name */}
        <div style={{ marginBottom: '15px' }}>
          <label>Full Name *</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        {/* Email */}
        <div style={{ marginBottom: '15px' }}>
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: '15px' }}>
          <label>Password *</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        {/* Confirm Password */}
        <div style={{ marginBottom: '15px' }}>
          <label>Confirm Password *</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        {/* Phone */}
        <div style={{ marginBottom: '15px' }}>
          <label>Phone (11 digits)</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="03001234567"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        {/* Role */}
        <div style={{ marginBottom: '15px' }}>
          <label>Role *</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="elder">Elder</option>
            <option value="caregiver">Caregiver</option>
            <option value="volunteer">Volunteer</option>
          </select>
        </div>

        {/* Location Permission */}
        <div style={{ marginBottom: '15px' }}>
          <label>
            <input
              type="checkbox"
              name="locationPermission"
              checked={formData.locationPermission}
              onChange={handleChange}
            />
            {' '}Allow location tracking
          </label>
        </div>

        {/* Get Location Button */}
        {formData.locationPermission && (
          <div style={{ marginBottom: '15px' }}>
            <button
              type="button"
              onClick={getDeviceLocation}
              style={{
                padding: '10px 20px',
                backgroundColor: '#52b788',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Get My Location
            </button>
            {formData.latitude && (
              <p style={{ fontSize: '12px', color: '#666' }}>
                Location: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
              </p>
            )}
          </div>
        )}

        {/* Address */}
        <div style={{ marginBottom: '15px' }}>
          <label>Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your address"
            style={{ width: '100%', padding: '8px', minHeight: '80px' }}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#1C382A',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default SignupWithLocation;
```

---

## Signup Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ User Starts Signup                                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ Fill Basic Info (Name, Email, Password, Role)              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ Grant Location Permission? (Checkbox)                       │
└────────────────────┬────────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
    YES (Allow)            NO (Skip)
         │                       │
         ▼                       ▼
┌──────────────────┐    ┌──────────────────┐
│ Get Device       │    │ Signup Without   │
│ Location         │    │ Location         │
└────────┬─────────┘    └────────┬─────────┘
         │                       │
         ▼                       ▼
┌──────────────────────────────────────────┐
│ POST /api/auth/signup-with-location      │
│ (with latitude, longitude, accuracy)     │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│ User Created                             │
│ Location Tracking Enabled                │
│ Initial Location Stored                  │
│ Location History Started                 │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│ Return Access & Refresh Tokens           │
│ Redirect to Dashboard                    │
└──────────────────────────────────────────┘
```

---

## Database Schema

### User Model Location Fields (Created During Signup)

```javascript
// Location Tracking Control
locationTrackingEnabled: Boolean,
locationTrackingEnabledAt: Date,

// Current Location
currentLocation: {
  latitude: Number,
  longitude: Number,
  accuracy: Number,
  timestamp: Date
},

// Location History (last 100)
locationHistory: [{
  latitude: Number,
  longitude: Number,
  accuracy: Number,
  timestamp: Date
}]
```

### Role-Specific Permission Fields

**Elder Model:**
```javascript
locationPermission: Boolean  // Set during signup
```

**User Model (Caregiver):**
```javascript
privacySettings: {
  locationSharing: Boolean  // Set during signup
}
```

**Volunteer Model:**
```javascript
volunteerLocationPermission: Boolean  // Set during signup
```

---

## Error Handling

### Common Errors

**1. Email Already Registered**
```json
{
  "success": false,
  "message": "Email already registered"
}
```

**2. Password Validation Failed**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "password",
      "message": "Password must contain uppercase, lowercase, and numbers"
    }
  ]
}
```

**3. Invalid Coordinates**
```json
{
  "success": false,
  "message": "Latitude must be between -90 and 90"
}
```

**4. Location Permission Required**
```json
{
  "success": false,
  "message": "Latitude and longitude required when location permission is granted"
}
```

---

## Security Considerations

### ✅ Security Features
- **Password Validation** - Min 8 characters, uppercase, lowercase, numbers
- **Email Validation** - Valid email format required
- **Coordinate Validation** - Validates latitude/longitude ranges
- **Role Validation** - Only accepts valid roles
- **JWT Tokens** - Secure token generation and storage
- **Permission Verification** - Checks permission before storing location

### ⚠️ Best Practices
1. **Always ask for permission** before enabling location tracking
2. **Show clear consent** about what data is being collected
3. **Use HTTPS** for all API calls
4. **Store tokens securely** (not in localStorage for production)
5. **Implement token refresh** for long-lived sessions
6. **Log location updates** for audit trails
7. **Encrypt location data** in transit and at rest

---

## Testing with Postman

### Test Signup with Location

```
POST http://localhost:5000/api/auth/signup-with-location

Headers:
Content-Type: application/json

Body:
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123",
  "phone": "03001234567",
  "role": "elder",
  "locationPermission": true,
  "latitude": 24.8607,
  "longitude": 67.0011,
  "accuracy": 10,
  "address": "123 Main Street, Karachi, Pakistan"
}
```

### Test Verify Location Permission

```
POST http://localhost:5000/api/auth/verify-location-permission

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

---

## Troubleshooting

### Issue: "Email already registered"
**Solution:**
1. Use a different email address
2. Check if account already exists
3. Try password reset if you forgot credentials

### Issue: "Password must contain uppercase, lowercase, and numbers"
**Solution:**
1. Use at least one uppercase letter (A-Z)
2. Use at least one lowercase letter (a-z)
3. Use at least one number (0-9)
4. Minimum 8 characters total

### Issue: "Invalid coordinates"
**Solution:**
1. Ensure latitude is between -90 and 90
2. Ensure longitude is between -180 and 180
3. Check coordinate format (should be numbers)
4. Verify device location is enabled

### Issue: "User has not granted location permission"
**Solution:**
1. Enable location permission in profile settings
2. Call `/api/location/enable` endpoint first
3. Verify role-specific permission field is set

---

## References

- [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
- [Location Tracking Documentation](./LOCATION_TRACKING.md)
- [Authentication Documentation](./AUTH.md)
