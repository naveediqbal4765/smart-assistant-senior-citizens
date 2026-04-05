# API Documentation - Smart Assistant for Senior Citizens

## Overview

This document provides comprehensive documentation for all API endpoints in the Smart Assistant backend.

**Base URL**: `http://localhost:5000/api` (development) or `https://api.smartassistant.com/api` (production)

**Authentication**: JWT Bearer Token in Authorization header

## Table of Contents

1. [Authentication Endpoints](#authentication-endpoints)
2. [User Endpoints](#user-endpoints)
3. [Elder Endpoints](#elder-endpoints)
4. [Caregiver Endpoints](#caregiver-endpoints)
5. [Volunteer Endpoints](#volunteer-endpoints)
6. [SOS Endpoints](#sos-endpoints)
7. [Error Handling](#error-handling)
8. [Response Formats](#response-formats)

---

## Authentication Endpoints

### 1. User Signup

**Endpoint**: `POST /auth/signup`

**Description**: Register a new user account

**Request Body**:
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+923001234567",
  "password": "SecurePass123!",
  "role": "elder",
  "dateOfBirth": "1960-05-15",
  "address": "123 Main St, Karachi",
  "nationalId": "1234567890123",
  "profilePicture": "base64_encoded_image_or_null",
  
  // Elder-specific fields
  "livesAlone": true,
  "emergencyContacts": [
    {
      "name": "Jane Doe",
      "phone": "+923009876543",
      "relationship": "Daughter"
    }
  ],
  "medicalConditions": ["Diabetes", "Hypertension"],
  "hasMedicalIssues": true,
  "locationPermission": true,
  
  // Caregiver-specific fields
  "relationshipToElder": "Son",
  "linkedElderEmail": "elder@example.com",
  "pairingCode": "123456",
  "notificationsEnabled": true,
  
  // Volunteer-specific fields
  "affiliation": "Edhi",
  "ngoId": "EDH-001",
  "serviceRadius": 5,
  "skills": ["Medical", "Errands"],
  "availabilityDays": ["Monday", "Tuesday", "Wednesday"],
  "availabilityTimeSlots": ["Morning", "Afternoon"],
  "volunteerLocationPermission": true
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Account created successfully. Please verify your email.",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "role": "elder"
  }
}
```

**Error Responses**:
- `400 Bad Request` - Invalid input data
- `409 Conflict` - Email already exists
- `500 Internal Server Error` - Server error

---

### 2. User Login

**Endpoint**: `POST /auth/login`

**Description**: Authenticate user and receive JWT token

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "userId": "507f1f77bcf86cd799439011",
      "email": "john@example.com",
      "fullName": "John Doe",
      "role": "elder"
    }
  }
}
```

**Error Responses**:
- `400 Bad Request` - Missing email or password
- `401 Unauthorized` - Invalid credentials
- `404 Not Found` - User not found

---

### 3. Verify OTP

**Endpoint**: `POST /auth/verify-otp`

**Description**: Verify email with OTP code

**Request Body**:
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "verified": true
  }
}
```

**Error Responses**:
- `400 Bad Request` - Invalid OTP
- `401 Unauthorized` - OTP expired
- `404 Not Found` - User not found

---

### 4. Forgot Password

**Endpoint**: `POST /auth/forgot-password`

**Description**: Request password reset email

**Request Body**:
```json
{
  "email": "john@example.com"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Password reset email sent",
  "data": {
    "resetTokenSent": true
  }
}
```

**Error Responses**:
- `400 Bad Request` - Invalid email
- `404 Not Found` - User not found

---

### 5. Reset Password

**Endpoint**: `POST /auth/reset-password`

**Description**: Reset password with reset token

**Request Body**:
```json
{
  "resetToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "newPassword": "NewSecurePass123!"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Password reset successfully",
  "data": {
    "passwordReset": true
  }
}
```

**Error Responses**:
- `400 Bad Request` - Invalid token or password
- `401 Unauthorized` - Token expired

---

## User Endpoints

### 1. Get User Profile

**Endpoint**: `GET /users/profile`

**Description**: Get authenticated user's profile

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+923001234567",
    "role": "elder",
    "dateOfBirth": "1960-05-15",
    "address": "123 Main St, Karachi",
    "profilePicture": "https://...",
    "createdAt": "2026-04-05T10:30:00Z",
    "updatedAt": "2026-04-05T10:30:00Z"
  }
}
```

**Error Responses**:
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - User not found

---

### 2. Update User Profile

**Endpoint**: `PUT /users/profile`

**Description**: Update authenticated user's profile

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body**:
```json
{
  "fullName": "John Doe Updated",
  "phone": "+923009876543",
  "address": "456 New St, Karachi",
  "profilePicture": "base64_encoded_image_or_null"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "fullName": "John Doe Updated",
    "phone": "+923009876543",
    "address": "456 New St, Karachi"
  }
}
```

**Error Responses**:
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing or invalid token

---

### 3. Get User by ID

**Endpoint**: `GET /users/:id`

**Description**: Get user profile by ID (public endpoint)

**Parameters**:
- `id` (string, required) - User ID

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "elder",
    "profilePicture": "https://..."
  }
}
```

**Error Responses**:
- `404 Not Found` - User not found

---

## Elder Endpoints

### 1. Get Elder Profile

**Endpoint**: `GET /elders/:id`

**Description**: Get elder-specific profile information

**Parameters**:
- `id` (string, required) - Elder user ID

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "elderId": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439011",
    "livesAlone": true,
    "emergencyContacts": [
      {
        "name": "Jane Doe",
        "phone": "+923009876543",
        "relationship": "Daughter"
      }
    ],
    "medicalConditions": ["Diabetes", "Hypertension"],
    "hasMedicalIssues": true,
    "locationPermission": true,
    "lastLocation": {
      "latitude": 24.8607,
      "longitude": 67.0011,
      "timestamp": "2026-04-05T10:30:00Z"
    }
  }
}
```

**Error Responses**:
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - Elder not found

---

### 2. Update Elder Profile

**Endpoint**: `PUT /elders/:id`

**Description**: Update elder-specific information

**Parameters**:
- `id` (string, required) - Elder user ID

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body**:
```json
{
  "livesAlone": false,
  "medicalConditions": ["Diabetes", "Hypertension", "Arthritis"],
  "hasMedicalIssues": true,
  "locationPermission": true
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Elder profile updated successfully",
  "data": {
    "elderId": "507f1f77bcf86cd799439011",
    "livesAlone": false,
    "medicalConditions": ["Diabetes", "Hypertension", "Arthritis"]
  }
}
```

**Error Responses**:
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - Elder not found

---

### 3. Add Emergency Contact

**Endpoint**: `POST /elders/:id/emergency-contacts`

**Description**: Add emergency contact for elder

**Parameters**:
- `id` (string, required) - Elder user ID

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body**:
```json
{
  "name": "Jane Doe",
  "phone": "+923009876543",
  "relationship": "Daughter"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Emergency contact added successfully",
  "data": {
    "contactId": "507f1f77bcf86cd799439012",
    "name": "Jane Doe",
    "phone": "+923009876543",
    "relationship": "Daughter"
  }
}
```

**Error Responses**:
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing or invalid token
- `409 Conflict` - Maximum contacts reached

---

### 4. Get Medical History

**Endpoint**: `GET /elders/:id/medical-history`

**Description**: Get elder's medical history

**Parameters**:
- `id` (string, required) - Elder user ID

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "elderId": "507f1f77bcf86cd799439011",
    "medicalConditions": ["Diabetes", "Hypertension"],
    "medications": [
      {
        "name": "Metformin",
        "dosage": "500mg",
        "frequency": "Twice daily"
      }
    ],
    "allergies": ["Penicillin"],
    "lastCheckup": "2026-03-15T10:30:00Z",
    "notes": "Regular monitoring required"
  }
}
```

**Error Responses**:
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - Elder not found

---

## Caregiver Endpoints

### 1. Get Caregiver Profile

**Endpoint**: `GET /caregivers/:id`

**Description**: Get caregiver-specific profile information

**Parameters**:
- `id` (string, required) - Caregiver user ID

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "caregiverId": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439011",
    "relationshipToElder": "Son",
    "linkedElders": [
      {
        "elderId": "507f1f77bcf86cd799439020",
        "elderName": "John Doe",
        "pairingStatus": "active"
      }
    ],
    "notificationsEnabled": true,
    "isAvailable": true,
    "lastActive": "2026-04-05T10:30:00Z"
  }
}
```

**Error Responses**:
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - Caregiver not found

---

### 2. Pair with Elder

**Endpoint**: `POST /caregivers/pair`

**Description**: Pair caregiver with elder using pairing code

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body**:
```json
{
  "pairingCode": "123456",
  "elderEmail": "elder@example.com"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Pairing successful",
  "data": {
    "pairingId": "507f1f77bcf86cd799439030",
    "elderId": "507f1f77bcf86cd799439020",
    "caregiverId": "507f1f77bcf86cd799439011",
    "status": "active"
  }
}
```

**Error Responses**:
- `400 Bad Request` - Invalid pairing code
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - Elder not found

---

### 3. Get Assigned Elders

**Endpoint**: `GET /caregivers/:id/assigned-elders`

**Description**: Get list of elders assigned to caregiver

**Parameters**:
- `id` (string, required) - Caregiver user ID

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "caregiverId": "507f1f77bcf86cd799439011",
    "assignedElders": [
      {
        "elderId": "507f1f77bcf86cd799439020",
        "elderName": "John Doe",
        "email": "john@example.com",
        "phone": "+923001234567",
        "address": "123 Main St, Karachi",
        "medicalConditions": ["Diabetes"],
        "emergencyContacts": 2,
        "lastActive": "2026-04-05T10:30:00Z"
      }
    ]
  }
}
```

**Error Responses**:
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - Caregiver not found

---

## Volunteer Endpoints

### 1. Get Volunteer Profile

**Endpoint**: `GET /volunteers/:id`

**Description**: Get volunteer-specific profile information

**Parameters**:
- `id` (string, required) - Volunteer user ID

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "volunteerId": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439011",
    "affiliation": "Edhi",
    "ngoId": "EDH-001",
    "serviceRadius": 5,
    "skills": ["Medical", "Errands"],
    "availabilityDays": ["Monday", "Tuesday", "Wednesday"],
    "availabilityTimeSlots": ["Morning", "Afternoon"],
    "locationPermission": true,
    "currentLocation": {
      "latitude": 24.8607,
      "longitude": 67.0011,
      "timestamp": "2026-04-05T10:30:00Z"
    },
    "rating": 4.8,
    "totalAssignments": 25,
    "completedAssignments": 24
  }
}
```

**Error Responses**:
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - Volunteer not found

---

### 2. Update Availability

**Endpoint**: `PUT /volunteers/:id/availability`

**Description**: Update volunteer's availability

**Parameters**:
- `id` (string, required) - Volunteer user ID

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body**:
```json
{
  "availabilityDays": ["Monday", "Tuesday", "Wednesday", "Thursday"],
  "availabilityTimeSlots": ["Morning", "Afternoon", "Evening"],
  "serviceRadius": 10
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Availability updated successfully",
  "data": {
    "volunteerId": "507f1f77bcf86cd799439011",
    "availabilityDays": ["Monday", "Tuesday", "Wednesday", "Thursday"],
    "availabilityTimeSlots": ["Morning", "Afternoon", "Evening"],
    "serviceRadius": 10
  }
}
```

**Error Responses**:
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing or invalid token

---

### 3. Get Nearby Volunteers

**Endpoint**: `GET /volunteers/nearby`

**Description**: Get volunteers near a location

**Query Parameters**:
- `latitude` (number, required) - Latitude
- `longitude` (number, required) - Longitude
- `radius` (number, optional) - Search radius in km (default: 5)
- `skills` (string, optional) - Comma-separated skills filter

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "volunteers": [
      {
        "volunteerId": "507f1f77bcf86cd799439011",
        "fullName": "Ahmed Khan",
        "skills": ["Medical", "Errands"],
        "rating": 4.8,
        "distance": 2.5,
        "isAvailable": true,
        "currentLocation": {
          "latitude": 24.8607,
          "longitude": 67.0011
        }
      }
    ],
    "totalFound": 5
  }
}
```

**Error Responses**:
- `400 Bad Request` - Missing required parameters

---

## SOS Endpoints

### 1. Trigger SOS Alert

**Endpoint**: `POST /sos/trigger`

**Description**: Trigger emergency SOS alert

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body**:
```json
{
  "location": {
    "latitude": 24.8607,
    "longitude": 67.0011
  },
  "description": "Fall detected",
  "severity": "high"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "SOS alert triggered successfully",
  "data": {
    "sosId": "507f1f77bcf86cd799439040",
    "elderId": "507f1f77bcf86cd799439020",
    "status": "active",
    "createdAt": "2026-04-05T10:30:00Z",
    "notificationsSent": 3
  }
}
```

**Error Responses**:
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing or invalid token

---

### 2. Get SOS History

**Endpoint**: `GET /sos/history`

**Description**: Get SOS alert history

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters**:
- `limit` (number, optional) - Number of records (default: 10)
- `offset` (number, optional) - Pagination offset (default: 0)
- `status` (string, optional) - Filter by status (active, resolved, cancelled)

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "sosAlerts": [
      {
        "sosId": "507f1f77bcf86cd799439040",
        "elderId": "507f1f77bcf86cd799439020",
        "description": "Fall detected",
        "severity": "high",
        "status": "resolved",
        "location": {
          "latitude": 24.8607,
          "longitude": 67.0011
        },
        "createdAt": "2026-04-05T10:30:00Z",
        "resolvedAt": "2026-04-05T10:35:00Z",
        "resolvedBy": "Jane Doe"
      }
    ],
    "total": 15,
    "limit": 10,
    "offset": 0
  }
}
```

**Error Responses**:
- `401 Unauthorized` - Missing or invalid token

---

### 3. Resolve SOS Alert

**Endpoint**: `PUT /sos/:id/resolve`

**Description**: Resolve/close SOS alert

**Parameters**:
- `id` (string, required) - SOS alert ID

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body**:
```json
{
  "status": "resolved",
  "notes": "Elder is safe, false alarm"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "SOS alert resolved successfully",
  "data": {
    "sosId": "507f1f77bcf86cd799439040",
    "status": "resolved",
    "resolvedAt": "2026-04-05T10:35:00Z",
    "notes": "Elder is safe, false alarm"
  }
}
```

**Error Responses**:
- `400 Bad Request` - Invalid status
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - SOS alert not found

---

## Error Handling

### Standard Error Response Format

```json
{
  "success": false,
  "message": "Error message",
  "error": {
    "code": "ERROR_CODE",
    "details": "Additional error details"
  }
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `INVALID_INPUT` | 400 | Invalid request data |
| `UNAUTHORIZED` | 401 | Missing or invalid authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Response Formats

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Paginated Response

```json
{
  "success": true,
  "data": {
    "items": [...],
    "total": 100,
    "limit": 10,
    "offset": 0,
    "hasMore": true
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "error": {
    "code": "ERROR_CODE",
    "details": "Additional details"
  }
}
```

---

## Authentication

All protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer <JWT_TOKEN>
```

### Token Structure

```json
{
  "userId": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "role": "elder",
  "iat": 1680000000,
  "exp": 1680086400
}
```

### Token Expiration

- **Access Token**: 24 hours
- **Refresh Token**: 30 days

---

## Rate Limiting

- **Default**: 100 requests per minute per IP
- **Authentication**: 5 requests per minute per IP
- **SOS**: No rate limit (emergency endpoint)

---

## Versioning

Current API Version: **v1**

Future versions will be available at `/api/v2`, `/api/v3`, etc.

---

**Last Updated**: April 5, 2026  
**Version**: 1.0.0

For more information, see the main README.md or DOCUMENTATION.md
