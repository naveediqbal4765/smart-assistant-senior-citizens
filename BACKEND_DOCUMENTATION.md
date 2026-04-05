# Smart Assistant for Senior Citizens - Backend Documentation

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Backend Architecture](#backend-architecture)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [Authentication](#authentication)
6. [Error Handling](#error-handling)
7. [Setup Instructions](#setup-instructions)
8. [Environment Variables](#environment-variables)
9. [Testing](#testing)
10. [Deployment](#deployment)

---

## 🎯 Project Overview

Smart Assistant for Senior Citizens is a comprehensive MERN application designed to connect senior citizens with caregivers and volunteers, providing emergency support, health monitoring, and community assistance.

### Key Features

- **User Authentication**: JWT-based authentication with role-based access control
- **Health Monitoring**: Real-time vitals tracking and health history
- **Emergency SOS**: Location-based emergency alerts
- **Physical Rehabilitation**: AI-guided exercise programs
- **Medical Records**: Lab reports, prescriptions, and health history management
- **Caregiver Pairing**: Connect seniors with caregivers
- **Volunteer Network**: Community support and assistance

---

## 🏗️ Backend Architecture

### Technology Stack

- **Runtime**: Node.js (v14+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.io (for notifications and SOS alerts)
- **File Upload**: Multer
- **Validation**: Joi/Express-validator
- **Environment**: dotenv

### Project Structure

```
backend/
├── models/
│   ├── User.js              # Base user model
│   ├── Elder.js             # Elder-specific data
│   ├── Caregiver.js         # Caregiver-specific data
│   ├── Volunteer.js         # Volunteer-specific data
│   ├── SOS.js               # Emergency alerts
│   └── Notification.js      # User notifications
├── routes/
│   ├── auth.js              # Authentication endpoints
│   ├── users.js             # User profile endpoints
│   ├── elders.js            # Elder-specific endpoints
│   ├── caregivers.js        # Caregiver endpoints
│   ├── volunteers.js        # Volunteer endpoints
│   ├── sos.js               # Emergency SOS endpoints
│   └── exercises.js         # Physical rehabilitation endpoints
├── middleware/
│   ├── auth.js              # JWT authentication
│   ├── errorHandler.js      # Global error handling
│   └── validation.js        # Input validation
├── config/
│   └── database.js          # MongoDB connection
├── controllers/             # Business logic (optional)
├── utils/                   # Helper functions
├── .env.example             # Environment variables template
├── server.js                # Express server setup
└── package.json             # Dependencies
```

---

## 📊 Database Schema

### User Model

```javascript
{
  _id: ObjectId,
  fullName: String,
  email: String (unique),
  phone: String,
  password: String (hashed),
  role: String (enum: ["elder", "caregiver", "volunteer"]),
  profilePicture: String,
  isEmailVerified: Boolean,
  isPhoneVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Elder Model

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  
  // Personal Information
  fullName: String,
  dateOfBirth: Date,
  gender: String,
  address: String,
  phone: String,
  email: String,
  profilePicture: String,
  nationalId: String,
  
  // Living Situation
  livesAlone: Boolean,
  emergencyContacts: [{
    name: String,
    relation: String,
    phone: String,
    email: String
  }],
  
  // Medical Information
  medicalConditions: [String],
  medicalConditionsOther: String,
  hasMedicalIssues: Boolean,
  allergies: [String],
  currentMedications: [{
    name: String,
    dosage: String,
    frequency: String,
    prescribedBy: String,
    startDate: Date,
    endDate: Date
  }],
  
  // Health Monitoring
  vitals: {
    heartRate: Number,
    oxygenLevel: Number,
    temperature: Number,
    bloodPressure: String,
    lastUpdated: Date
  },
  
  // Caregiver Pairing
  assignedCaregivers: [{
    caregiverId: ObjectId,
    relation: String,
    pairingDate: Date,
    status: String (enum: ["active", "inactive"])
  }],
  
  // Location & Permissions
  locationPermission: Boolean,
  lastKnownLocation: {
    latitude: Number,
    longitude: Number,
    timestamp: Date
  },
  
  // Preferences
  screenReaderEnabled: Boolean,
  fontSize: String (enum: ["small", "medium", "large", "extra-large"]),
  highContrastMode: Boolean,
  darkMode: Boolean,
  language: String (enum: ["en", "ur", "ar"]),
  notificationsEnabled: Boolean,
  soundAlerts: Boolean,
  
  // Health Records
  labReports: [{
    name: String,
    date: Date,
    doctor: String,
    results: String,
    fileUrl: String,
    status: String
  }],
  
  prescriptions: [{
    name: String,
    dosage: String,
    frequency: String,
    doctor: String,
    date: Date,
    expiryDate: Date,
    fileUrl: String
  }],
  
  healthHistory: [{
    date: Date,
    heartRate: Number,
    oxygenLevel: Number,
    temperature: Number,
    bloodPressure: String,
    notes: String
  }],
  
  // Exercise & Rehabilitation
  exerciseProgress: [{
    exerciseId: String,
    exerciseName: String,
    completedCount: Number,
    lastCompleted: Date,
    difficulty: String
  }],
  
  // SOS & Emergency
  sosHistory: [{
    timestamp: Date,
    location: {
      latitude: Number,
      longitude: Number
    },
    status: String,
    resolvedAt: Date,
    resolvedBy: String
  }],
  
  // Account Status
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Caregiver Model

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  
  // Personal Information
  fullName: String,
  email: String,
  phone: String,
  profilePicture: String,
  
  // Relationship
  relationshipToElder: String,
  relationshipToElderOther: String,
  linkedElderEmail: String,
  pairingCode: String,
  
  // Assigned Elders
  assignedElders: [{
    elderId: ObjectId,
    relation: String,
    pairingDate: Date,
    status: String
  }],
  
  // Preferences
  notificationsEnabled: Boolean,
  isAvailable: Boolean,
  
  // Account Status
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Volunteer Model

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  
  // Personal Information
  fullName: String,
  email: String,
  phone: String,
  profilePicture: String,
  
  // Organization
  affiliation: String,
  affiliationOther: String,
  ngoId: String,
  
  // Service Details
  serviceRadius: Number (in km),
  skills: [String],
  availabilityDays: [String],
  availabilityTimeSlots: [{
    day: String,
    startTime: String,
    endTime: String
  }],
  
  // Location & Permissions
  locationPermission: Boolean,
  lastKnownLocation: {
    latitude: Number,
    longitude: Number,
    timestamp: Date
  },
  
  // Performance
  completedTasks: Number,
  rating: Number,
  reviews: [{
    elderId: ObjectId,
    rating: Number,
    comment: String,
    date: Date
  }],
  
  // Account Status
  isActive: Boolean,
  isVerified: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)

#### Register User
```
POST /api/auth/signup
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+923001234567",
  "password": "SecurePassword123",
  "role": "elder"
}

Response: 201 Created
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": { ... }
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123"
}

Response: 200 OK
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": { ... }
}
```

#### Verify OTP
```
POST /api/auth/verify-otp
Content-Type: application/json
Authorization: Bearer token

{
  "otp": "123456"
}

Response: 200 OK
{
  "message": "OTP verified successfully",
  "isVerified": true
}
```

#### Forgot Password
```
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}

Response: 200 OK
{
  "message": "Password reset link sent to email"
}
```

#### Reset Password
```
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token",
  "newPassword": "NewPassword123"
}

Response: 200 OK
{
  "message": "Password reset successfully"
}
```

---

### Elder Routes (`/api/elders`)

#### Get Elder Profile
```
GET /api/elders/profile
Authorization: Bearer token

Response: 200 OK
{
  "_id": "...",
  "userId": "...",
  "fullName": "John Doe",
  "medicalConditions": ["Diabetes", "Hypertension"],
  "vitals": { ... },
  "emergencyContacts": [ ... ],
  ...
}
```

#### Update Elder Profile
```
PUT /api/elders/profile
Authorization: Bearer token
Content-Type: application/json

{
  "fullName": "John Doe",
  "dateOfBirth": "1950-01-15",
  "address": "123 Main St",
  "phone": "+923001234567",
  "emergencyContacts": [ ... ],
  "medicalConditions": [ ... ]
}

Response: 200 OK
{
  "message": "Profile updated successfully",
  "elder": { ... }
}
```

#### Get Vitals
```
GET /api/elders/vitals
Authorization: Bearer token

Response: 200 OK
{
  "heartRate": 72,
  "oxygenLevel": 98,
  "temperature": 36.5,
  "bloodPressure": "120/80",
  "lastUpdated": "2024-03-15T10:30:00Z"
}
```

#### Update Vitals
```
POST /api/elders/vitals
Authorization: Bearer token
Content-Type: application/json

{
  "heartRate": 72,
  "oxygenLevel": 98,
  "temperature": 36.5,
  "bloodPressure": "120/80"
}

Response: 200 OK
{
  "message": "Vitals updated successfully",
  "vitals": { ... }
}
```

#### Get Health History
```
GET /api/elders/health-history
Authorization: Bearer token

Response: 200 OK
[
  {
    "date": "2024-03-15T10:30:00Z",
    "heartRate": 72,
    "oxygenLevel": 98,
    "temperature": 36.5,
    "bloodPressure": "120/80"
  },
  ...
]
```

#### Get Medications
```
GET /api/elders/medications
Authorization: Bearer token

Response: 200 OK
[
  {
    "name": "Aspirin",
    "dosage": "500mg",
    "frequency": "Twice daily",
    "prescribedBy": "Dr. Ahmed",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31"
  },
  ...
]
```

#### Add Medication
```
POST /api/elders/medications
Authorization: Bearer token
Content-Type: application/json

{
  "name": "Aspirin",
  "dosage": "500mg",
  "frequency": "Twice daily",
  "prescribedBy": "Dr. Ahmed",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31"
}

Response: 201 Created
{
  "message": "Medication added successfully",
  "medications": [ ... ]
}
```

#### Get Lab Reports
```
GET /api/elders/lab-reports
Authorization: Bearer token

Response: 200 OK
[
  {
    "name": "Blood Test",
    "date": "2024-03-10",
    "doctor": "Dr. Ahmed",
    "results": "All values within normal range",
    "fileUrl": "...",
    "status": "Normal"
  },
  ...
]
```

#### Add Lab Report
```
POST /api/elders/lab-reports
Authorization: Bearer token
Content-Type: application/json

{
  "name": "Blood Test",
  "date": "2024-03-10",
  "doctor": "Dr. Ahmed",
  "results": "All values within normal range",
  "fileUrl": "...",
  "status": "Normal"
}

Response: 201 Created
{
  "message": "Lab report added successfully",
  "labReports": [ ... ]
}
```

#### Get Prescriptions
```
GET /api/elders/prescriptions
Authorization: Bearer token

Response: 200 OK
[
  {
    "name": "Aspirin",
    "dosage": "500mg",
    "frequency": "Twice daily",
    "doctor": "Dr. Ahmed",
    "date": "2024-03-10",
    "expiryDate": "2025-03-10",
    "fileUrl": "..."
  },
  ...
]
```

#### Add Prescription
```
POST /api/elders/prescriptions
Authorization: Bearer token
Content-Type: application/json

{
  "name": "Aspirin",
  "dosage": "500mg",
  "frequency": "Twice daily",
  "doctor": "Dr. Ahmed",
  "date": "2024-03-10",
  "expiryDate": "2025-03-10",
  "fileUrl": "..."
}

Response: 201 Created
{
  "message": "Prescription added successfully",
  "prescriptions": [ ... ]
}
```

#### Get Emergency Contacts
```
GET /api/elders/emergency-contacts
Authorization: Bearer token

Response: 200 OK
[
  {
    "_id": "...",
    "name": "Sarah",
    "relation": "Daughter",
    "phone": "+923001234567",
    "email": "sarah@example.com"
  },
  ...
]
```

#### Add Emergency Contact
```
POST /api/elders/emergency-contacts
Authorization: Bearer token
Content-Type: application/json

{
  "name": "Sarah",
  "relation": "Daughter",
  "phone": "+923001234567",
  "email": "sarah@example.com"
}

Response: 201 Created
{
  "message": "Emergency contact added",
  "emergencyContacts": [ ... ]
}
```

#### Update Emergency Contact
```
PUT /api/elders/emergency-contacts/:contactId
Authorization: Bearer token
Content-Type: application/json

{
  "name": "Sarah",
  "relation": "Daughter",
  "phone": "+923001234567",
  "email": "sarah@example.com"
}

Response: 200 OK
{
  "message": "Emergency contact updated",
  "emergencyContacts": [ ... ]
}
```

#### Delete Emergency Contact
```
DELETE /api/elders/emergency-contacts/:contactId
Authorization: Bearer token

Response: 200 OK
{
  "message": "Emergency contact deleted",
  "emergencyContacts": [ ... ]
}
```

#### Get Preferences
```
GET /api/elders/preferences
Authorization: Bearer token

Response: 200 OK
{
  "screenReaderEnabled": true,
  "fontSize": "large",
  "highContrastMode": false,
  "darkMode": false,
  "language": "en",
  "notificationsEnabled": true,
  "soundAlerts": true
}
```

#### Update Preferences
```
PUT /api/elders/preferences
Authorization: Bearer token
Content-Type: application/json

{
  "screenReaderEnabled": true,
  "fontSize": "large",
  "highContrastMode": false,
  "darkMode": false,
  "language": "en",
  "notificationsEnabled": true,
  "soundAlerts": true
}

Response: 200 OK
{
  "message": "Preferences updated successfully",
  "preferences": { ... }
}
```

---

### Exercise Routes (`/api/exercises`)

#### Get All Exercises
```
GET /api/exercises
Authorization: Bearer token

Response: 200 OK
{
  "allExercises": [ ... ],
  "recommendedExercises": [ ... ]
}
```

#### Get Single Exercise
```
GET /api/exercises/:exerciseId
Authorization: Bearer token

Response: 200 OK
{
  "id": 1,
  "name": "Neck Stretches",
  "difficulty": "Easy",
  "duration": "5 mins",
  "reps": "10 reps",
  "description": "...",
  "instructions": [ ... ],
  "benefits": [ ... ],
  "cautions": [ ... ],
  "targetConditions": [ ... ],
  "aiGuidance": "..."
}
```

#### Record Exercise Completion
```
POST /api/exercises/:exerciseId/complete
Authorization: Bearer token
Content-Type: application/json

{
  "exerciseName": "Neck Stretches",
  "difficulty": "Easy"
}

Response: 200 OK
{
  "message": "Exercise completion recorded",
  "exerciseProgress": [ ... ]
}
```

#### Get Exercise Progress
```
GET /api/exercises/progress/all
Authorization: Bearer token

Response: 200 OK
[
  {
    "exerciseId": "1",
    "exerciseName": "Neck Stretches",
    "completedCount": 5,
    "lastCompleted": "2024-03-15T10:30:00Z",
    "difficulty": "Easy"
  },
  ...
]
```

#### AI Form Check
```
POST /api/exercises/ai-check
Authorization: Bearer token
Content-Type: application/json

{
  "exerciseId": "1",
  "exerciseName": "Neck Stretches"
}

Response: 200 OK
{
  "status": "good",
  "message": "Great form! Your Neck Stretches looks good. Keep up the good work!",
  "suggestions": [ ... ],
  "score": 85
}
```

---

### SOS Routes (`/api/sos`)

#### Trigger SOS Alert
```
POST /api/sos/trigger
Authorization: Bearer token
Content-Type: application/json

{
  "latitude": 31.5204,
  "longitude": 74.3587
}

Response: 200 OK
{
  "message": "SOS alert triggered successfully",
  "sosAlert": {
    "timestamp": "2024-03-15T10:30:00Z",
    "location": { ... },
    "status": "active"
  },
  "emergencyContacts": [ ... ]
}
```

#### Get SOS History
```
GET /api/sos/history
Authorization: Bearer token

Response: 200 OK
[
  {
    "_id": "...",
    "timestamp": "2024-03-15T10:30:00Z",
    "location": { ... },
    "status": "resolved",
    "resolvedAt": "2024-03-15T10:45:00Z",
    "resolvedBy": "Sarah"
  },
  ...
]
```

#### Resolve SOS Alert
```
PUT /api/sos/:sosId/resolve
Authorization: Bearer token

Response: 200 OK
{
  "message": "SOS alert resolved",
  "sosAlert": { ... }
}
```

#### Get Last Known Location
```
GET /api/sos/location/last
Authorization: Bearer token

Response: 200 OK
{
  "latitude": 31.5204,
  "longitude": 74.3587,
  "timestamp": "2024-03-15T10:30:00Z"
}
```

---

## 🔐 Authentication

### JWT Token Structure

```javascript
{
  "id": "user_id",
  "email": "user@example.com",
  "role": "elder",
  "iat": 1234567890,
  "exp": 1234571490
}
```

### Token Usage

Include the JWT token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Expiration

- Access Token: 24 hours
- Refresh Token: 7 days

---

## ⚠️ Error Handling

### Standard Error Response

```javascript
{
  "message": "Error description",
  "error": "Detailed error message",
  "statusCode": 400
}
```

### Common Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid input or missing required fields |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | User doesn't have permission to access resource |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists (e.g., duplicate email) |
| 500 | Internal Server Error | Server error |

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js v14 or higher
- MongoDB Atlas account
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/naveediqbal4765/smart-assistant-senior-citizens.git
   cd smart-assistant-senior-citizens/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** (see below)

5. **Start the server**
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run dev
   ```

---

## 🔧 Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-assistant

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=24h
REFRESH_TOKEN_EXPIRE=7d

# Email Configuration (for OTP and password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# File Upload
MAX_FILE_SIZE=5242880  # 5MB in bytes
UPLOAD_DIR=./uploads

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Socket.io
SOCKET_IO_CORS_ORIGIN=http://localhost:3000

# AWS S3 (optional, for file storage)
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_S3_BUCKET=your_bucket_name
AWS_REGION=us-east-1

# Twilio (optional, for SMS notifications)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890

# Google Maps (optional, for location services)
GOOGLE_MAPS_API_KEY=your_google_maps_key
```

---

## 🧪 Testing

### Run Tests

```bash
npm test
```

### Test Coverage

```bash
npm run test:coverage
```

### API Testing with Postman

1. Import the Postman collection from `postman_collection.json`
2. Set up environment variables in Postman
3. Run requests against the API

---

## 📦 Deployment

### Deploy to Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku app**
   ```bash
   heroku create your-app-name
   ```

4. **Set environment variables**
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

### Deploy to AWS

1. **Create EC2 instance**
2. **Install Node.js and MongoDB**
3. **Clone repository**
4. **Install dependencies and start server**
5. **Configure security groups and load balancer**

### Deploy to DigitalOcean

1. **Create Droplet**
2. **Install Node.js and MongoDB**
3. **Clone repository**
4. **Set up PM2 for process management**
5. **Configure Nginx as reverse proxy**

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT Documentation](https://jwt.io/)
- [Socket.io Documentation](https://socket.io/)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 Support

For support, email support@smartassistant.com or open an issue on GitHub.

---

**Last Updated**: April 2026  
**Version**: 1.0.0
