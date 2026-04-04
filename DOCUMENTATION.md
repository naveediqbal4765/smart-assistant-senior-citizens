# 📚 Smart Assistant for Senior Citizens - Complete Documentation

**SZABIST University, Islamabad | Spring 2026 Final Year Project**

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Installation & Setup](#installation--setup)
5. [Environment Variables](#environment-variables)
6. [Running the Application](#running-the-application)
7. [API Documentation](#api-documentation)
8. [Frontend Components](#frontend-components)
9. [Database Schema](#database-schema)
10. [Features Implemented](#features-implemented)
11. [Testing](#testing)
12. [Deployment](#deployment)
13. [Troubleshooting](#troubleshooting)
14. [Contributing](#contributing)

---

## 🏥 Project Overview

**Smart Assistant for Senior Citizens** is a comprehensive MERN stack web application designed to support elderly independence through AI, IoT, and community-driven care.

### Key Features:
- **User Authentication** - Email/password, OTP verification, OAuth (Google/Facebook/Apple)
- **Three User Roles** - Elder, Caregiver, Volunteer
- **Real-time Communication** - Socket.io for SOS alerts, live chat, location sharing
- **Health Monitoring** - Track vital signs, medications, wellness activities
- **Emergency Response** - SOS button, fall detection, emergency contacts
- **Volunteer Matching** - Task-based volunteer system with rewards
- **Senior-Friendly UI** - Large fonts, high contrast, simple navigation

### Team Members:
- Manahil Chaudhary (2212470)
- Sartaj Riaz (2212498)
- Naveed Iqbal (2212474)
- **Supervisor:** Mr. Ghaffar Ahmed

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | React.js | 18.2.0 |
| **Styling** | Tailwind CSS | 3.4.0 |
| **Backend** | Node.js + Express.js | 18.x / 4.18.2 |
| **Database** | MongoDB Atlas | Cloud |
| **Real-time** | Socket.io | 4.6.1 |
| **Authentication** | JWT + bcryptjs | 9.0.2 / 2.4.3 |
| **Email** | Nodemailer | 6.9.7 |
| **Validation** | express-validator | 7.0.1 |
| **Security** | Helmet, CORS, Rate Limiting | Latest |

---

## 📁 Project Structure

```
smart-assistant-senior-citizens/
├── backend/
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/
│   │   └── auth/
│   │       └── authController.js    # Auth logic (login, signup, OTP, etc.)
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT verification & role-based access
│   │   └── validateMiddleware.js    # Input validation rules
│   ├── models/
│   │   └── User.js                  # User schema (Elder/Caregiver/Volunteer)
│   ├── routes/
│   │   └── authRoutes.js            # Auth endpoints
│   ├── sockets/
│   │   └── socketHandler.js         # Real-time events (SOS, chat, location)
│   ├── utils/
│   │   ├── jwtUtils.js              # Token generation
│   │   └── emailUtils.js            # OTP email sending
│   ├── .env.example                 # Environment variables template
│   ├── package.json
│   └── server.js                    # Express app entry point
│
├── frontend/
│   ├── public/
│   │   └── index.html               # HTML entry point
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── ElderSignupForm.js
│   │   │   │   ├── CaregiverSignupForm.js
│   │   │   │   └── VolunteerSignupForm.js
│   │   │   └── common/
│   │   │       └── ProtectedRoute.js    # Auth guard + role check
│   │   ├── context/
│   │   │   └── AuthContext.js       # Global auth state
│   │   ├── pages/
│   │   │   ├── LoginPage.js         # Login (UserInterface1.png)
│   │   │   ├── SignupPage.js        # Signup (UserInterface2.png)
│   │   │   ├── VerifyOTPPage.js     # OTP verification
│   │   │   ├── ForgotPasswordPage.js
│   │   │   ├── ResetPasswordPage.js
│   │   │   ├── ElderDashboard.js
│   │   │   ├── CaregiverDashboard.js
│   │   │   ├── VolunteerDashboard.js
│   │   │   └── NotFoundPage.js
│   │   ├── services/
│   │   │   └── api.js               # Axios API client
│   │   ├── App.js                   # React Router setup
│   │   ├── index.js                 # React entry point
│   │   └── index.css                # Global styles
│   ├── tailwind.config.js           # Tailwind theme (green)
│   ├── package.json
│   └── .env.example
│
├── .gitignore
├── README.md
└── DOCUMENTATION.md                 # This file
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **MongoDB Atlas** account (free tier available)
- **Git** for version control

### Step 1: Clone the Repository

```bash
git clone https://github.com/naveediqbal4765/smart-assistant-senior-citizens.git
cd smart-assistant-senior-citizens
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from template
cp .env.example .env

# Edit .env with your credentials (see Environment Variables section)
nano .env  # or use your preferred editor
```

### Step 3: Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Create .env file (optional, for API URL)
cp .env.example .env
```

### Step 4: MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (M0 free tier)
4. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/dbname`
5. Add this to your backend `.env` file as `MONGO_URI`

### Step 5: Email Configuration (Nodemailer)

For OTP emails to work:

1. **Gmail Setup:**
   - Enable 2-factor authentication on your Gmail account
   - Generate an App Password: https://myaccount.google.com/apppasswords
   - Add to `.env`:
     ```
     EMAIL_USER=your-email@gmail.com
     EMAIL_PASS=your-app-password
     ```

2. **Alternative Email Providers:**
   - Update `EMAIL_HOST` and `EMAIL_PORT` in `.env`
   - Example for Outlook: `smtp-mail.outlook.com:587`

---

## 🔐 Environment Variables

### Backend (.env)

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Atlas
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/smartAssistantDB?retryWrites=true&w=majority

# JWT Secrets (use long random strings in production)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this_in_production
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here
EMAIL_FROM=SmartAssistant <noreply@smartassistant.com>

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:3000

# OTP Expiry (in minutes)
OTP_EXPIRE_MINUTES=10

# OAuth (optional, for future implementation)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
APPLE_CLIENT_ID=your_apple_client_id
```

### Frontend (.env)

```bash
# API Base URL
REACT_APP_API_URL=http://localhost:5000/api
```

---

## ▶️ Running the Application

### Terminal 1: Start Backend Server

```bash
cd backend
npm run dev
```

Expected output:
```
✅ MongoDB Connected: cluster0.mongodb.net
📦 Database: smartAssistantDB
🚀 Smart Assistant Server running on port 5000
📡 Environment: development
🔗 API Base URL: http://localhost:5000/api
💡 Health Check: http://localhost:5000/api/health
```

### Terminal 2: Start Frontend Development Server

```bash
cd frontend
npm start
```

Expected output:
```
Compiled successfully!

You can now view smart-assistant-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

### Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/api/health

---

## 📡 API Documentation

### Authentication Endpoints

All endpoints prefixed with `/api/auth`

#### 1. **Login**
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "rememberMe": true
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "Ali Khan",
    "email": "ali@example.com",
    "role": "elder",
    "isVerified": true
  }
}
```

#### 2. **Signup**
```
POST /api/auth/signup
Content-Type: application/json

{
  "fullName": "Ali Khan",
  "email": "ali@example.com",
  "phone": "+923001234567",
  "password": "SecurePassword123!",
  "confirmPassword": "SecurePassword123!",
  "role": "elder",
  "dateOfBirth": "1960-05-15",
  "nationalId": "1234567890123",
  
  // Elder-specific
  "livesAlone": true,
  "emergencyContacts": [
    {
      "name": "Fatima Khan",
      "phone": "+923009876543",
      "email": "fatima@example.com",
      "relationship": "Daughter"
    }
  ],
  "medicalConditions": ["Diabetes", "Hypertension"],
  "hasMedicalIssues": true,
  "locationPermission": true
}

Response (201):
{
  "success": true,
  "message": "Account created successfully! Please check your email for the verification OTP.",
  "email": "ali@example.com",
  "requiresVerification": true,
  "seniorId": "SR-a1b2c3d4"
}
```

#### 3. **Verify OTP**
```
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "ali@example.com",
  "otp": "123456"
}

Response (200):
{
  "success": true,
  "message": "Email verified successfully! Welcome to Smart Assistant.",
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

#### 4. **Forgot Password**
```
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "ali@example.com"
}

Response (200):
{
  "success": true,
  "message": "If an account with this email exists, an OTP has been sent."
}
```

#### 5. **Verify Reset OTP**
```
POST /api/auth/verify-reset-otp
Content-Type: application/json

{
  "email": "ali@example.com",
  "otp": "123456"
}

Response (200):
{
  "success": true,
  "message": "OTP verified. You can now set a new password.",
  "email": "ali@example.com"
}
```

#### 6. **Reset Password**
```
POST /api/auth/reset-password
Content-Type: application/json

{
  "email": "ali@example.com",
  "password": "NewPassword123!",
  "confirmPassword": "NewPassword123!"
}

Response (200):
{
  "success": true,
  "message": "Password reset successfully! Please login with your new password."
}
```

#### 7. **Get Current User**
```
GET /api/auth/me
Authorization: Bearer <accessToken>

Response (200):
{
  "success": true,
  "user": { ... }
}
```

#### 8. **Delete Account**
```
DELETE /api/auth/delete-account
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "password": "CurrentPassword123!",
  "confirmDelete": true
}

Response (200):
{
  "success": true,
  "message": "Your account has been successfully deleted."
}
```

---

## 🎨 Frontend Components

### Page Components

#### **LoginPage.js**
- Email/password login form
- "Remember Me" checkbox
- "Reset Password" link
- OAuth buttons (Google, Facebook, Apple)
- Error handling with inline messages
- Responsive design matching UserInterface1.png

#### **SignupPage.js**
- Role selection tabs (Elder | Caregiver | Volunteer)
- Profile picture upload
- Common fields (Name, Email, Phone, DOB, National ID, Password)
- Dynamic role-specific form rendering
- Photo collage grid on right side
- Matches UserInterface2.png design

#### **ElderSignupForm.js**
- Q1: Lives alone? (Yes/No)
- Q2: Medical conditions? (Multi-select dropdown)
- Q3: Location permission? (Required for SOS)
- Emergency contacts (1-3 family members)
- Medical conditions with custom input

#### **CaregiverSignupForm.js**
- Relationship to Elder
- Elder's email for pairing
- 6-digit pairing code verification
- Push notification consent
- Availability toggle

#### **VolunteerSignupForm.js**
- NGO affiliation selection
- Service radius slider (1-10 km)
- Skills multi-select (Medical, Errands, Physical Help)
- Availability schedule (Days + Time slots)
- Location permission

#### **VerifyOTPPage.js**
- 6-digit OTP input with auto-formatting
- Resend OTP button
- Auto-redirect after verification

#### **ForgotPasswordPage.js**
- Email input for password reset
- Sends OTP to email

#### **ResetPasswordPage.js**
- Two-step process:
  1. OTP verification
  2. New password entry

#### **Dashboard Pages**
- **ElderDashboard.js** - SOS button, health stats, request help
- **CaregiverDashboard.js** - Linked elder status, health monitoring, location tracking
- **VolunteerDashboard.js** - Go online/offline, available tasks, rewards

### Utility Components

#### **ProtectedRoute.js**
- Checks authentication status
- Verifies user role
- Redirects unauthorized users to login

#### **AuthContext.js**
- Global authentication state management
- Login/logout functions
- Token persistence (localStorage/sessionStorage)
- User data management

#### **api.js (Axios Client)**
- Centralized API configuration
- Automatic JWT token attachment
- Global error handling
- Request/response interceptors

---

## 💾 Database Schema

### User Model

```javascript
{
  // Basic Info (All Roles)
  fullName: String,
  email: String (unique),
  phone: String,
  password: String (hashed),
  profilePicture: String (URL),
  dateOfBirth: Date,
  address: {
    text: String,
    lat: Number,
    lng: Number
  },
  nationalId: String,

  // Role Assignment
  role: Enum ["elder", "caregiver", "volunteer"],

  // OAuth Provider Info
  authProvider: Enum ["local", "google", "facebook", "apple"],
  providerId: String,

  // Account Status
  isVerified: Boolean,
  isActive: Boolean,
  isDeleted: Boolean (soft delete),

  // OTP for Email Verification & Password Reset
  otp: String (hashed),
  otpExpiry: Date,
  otpPurpose: Enum ["email-verification", "password-reset", "login"],

  // Remember Me / Session
  rememberMe: Boolean,

  // Role-Specific Data
  elderData: {
    seniorId: String (unique),
    livesAlone: Boolean,
    emergencyContacts: [{
      name: String,
      phone: String,
      email: String,
      relationship: String
    }],
    medicalConditions: [String],
    hasMedicalIssues: Boolean,
    locationPermission: Boolean,
    pairingCode: String,
    pairingCodeExpiry: Date,
    priorityMonitor: Boolean
  },

  caregiverData: {
    relationshipToElder: String,
    linkedElderEmail: String,
    linkedElderId: ObjectId (ref: User),
    isPaired: Boolean,
    notificationsEnabled: Boolean,
    isAvailable: Boolean,
    accessLevel: Enum ["view-only", "action"]
  },

  volunteerData: {
    affiliation: String,
    ngoId: String,
    serviceRadius: Number (1-10 km),
    skills: [Enum ["Medical", "Errands", "Physical Help"]],
    availability: {
      days: [String],
      timeSlots: [String]
    },
    locationPermission: Boolean,
    isLive: Boolean,
    totalPoints: Number,
    badges: [String]
  },

  // Geospatial Location
  location: {
    type: "Point",
    coordinates: [Number, Number] // [longitude, latitude]
  },

  // Timestamps
  lastLogin: Date,
  passwordChangedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## ✨ Features Implemented

### Module 1: User Authentication & Login ✅

#### Implemented:
- ✅ Email/password login with validation
- ✅ User signup with role selection (Elder/Caregiver/Volunteer)
- ✅ OTP email verification (Nodemailer)
- ✅ Password reset via OTP
- ✅ OAuth skeleton (Google/Facebook/Apple)
- ✅ Remember Me functionality
- ✅ Account deletion (soft delete)
- ✅ JWT + bcrypt security
- ✅ Rate limiting (brute force protection)
- ✅ Role-based access control (RBAC)
- ✅ Elder pairing code system
- ✅ Caregiver-Elder linking
- ✅ Volunteer availability + skills
- ✅ Socket.io SOS broadcasting skeleton

#### UI/UX:
- ✅ Login page (UserInterface1.png exact match)
- ✅ Signup page with role tabs (UserInterface2.png exact match)
- ✅ Senior-friendly design (large fonts, high contrast)
- ✅ Responsive layout (desktop, tablet, mobile)
- ✅ Form validation with error messages
- ✅ Loading states and animations
- ✅ Toast notifications

### Modules 2-12: Pending Development 🔜

- Module 2: User Profile Management
- Module 3: Task Request Module
- Module 4: Communication Module
- Module 5: Health & Medication
- Module 6: Wellness & Physical Rehab
- Module 7: Emergency & Safety
- Module 8: Social Circle
- Module 9: Volunteer Rewards
- Module 10: Smart Travel Escort
- Module 11: Adaptive Assistance
- Module 12: Emergency Guide

---

## 🧪 Testing

### Manual Testing

#### Test Login Flow:
1. Go to http://localhost:3000/login
2. Enter email: `test@example.com`
3. Enter password: `TestPassword123!`
4. Click "Login"
5. Should redirect to dashboard

#### Test Signup Flow:
1. Go to http://localhost:3000/signup
2. Select role: "Elder"
3. Fill in all required fields
4. Click "Sign up"
5. Check email for OTP
6. Enter OTP on verification page
7. Should redirect to dashboard

#### Test Protected Routes:
1. Try accessing `/dashboard/elder` without login
2. Should redirect to `/login`
3. Login successfully
4. Should access dashboard

### Automated Testing (Future)

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

---

## 🌐 Deployment

### Backend Deployment (Heroku/Railway/Render)

1. **Create account** on Heroku/Railway/Render
2. **Connect GitHub repository**
3. **Set environment variables** in deployment platform
4. **Deploy** (automatic on push to main)

### Frontend Deployment (Vercel/Netlify)

1. **Create account** on Vercel/Netlify
2. **Connect GitHub repository**
3. **Set `REACT_APP_API_URL`** to production backend URL
4. **Deploy** (automatic on push to main)

### Production Checklist

- [ ] Change `NODE_ENV` to `production`
- [ ] Update `JWT_SECRET` and `JWT_REFRESH_SECRET` with strong random strings
- [ ] Enable HTTPS
- [ ] Set up SSL certificate
- [ ] Configure CORS for production domain
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy for MongoDB
- [ ] Set up CI/CD pipeline
- [ ] Perform security audit

---

## 🔧 Troubleshooting

### Common Issues

#### **MongoDB Connection Error**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:**
- Ensure MongoDB Atlas cluster is running
- Check `MONGO_URI` in `.env` is correct
- Verify IP whitelist in MongoDB Atlas (add 0.0.0.0/0 for development)

#### **Email Not Sending**
```
Error: Invalid login: 535-5.7.8 Username and password not accepted
```
**Solution:**
- Use Gmail App Password (not regular password)
- Enable 2-factor authentication on Gmail
- Check `EMAIL_USER` and `EMAIL_PASS` in `.env`

#### **CORS Error**
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
- Ensure `CLIENT_URL` in backend `.env` matches frontend URL
- Check CORS configuration in `server.js`
- For development: use `http://localhost:3000`

#### **Port Already in Use**
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use different port
PORT=5001 npm run dev
```

#### **JWT Token Expired**
```
Error: Token has expired. Please log in again.
```
**Solution:**
- Token expires after 7 days (configurable in `.env`)
- Use refresh token to get new access token
- User must log in again

---

## 🤝 Contributing

### Development Workflow

1. **Create feature branch**
   ```bash
   git checkout -b feature/module-2-profile
   ```

2. **Make changes** and commit
   ```bash
   git add .
   git commit -m "feat: add user profile management"
   ```

3. **Push to GitHub**
   ```bash
   git push origin feature/module-2-profile
   ```

4. **Create Pull Request** on GitHub
5. **Code review** and merge to main

### Code Style

- **JavaScript:** Use ES6+ syntax
- **React:** Use functional components with hooks
- **Naming:** camelCase for variables/functions, PascalCase for components
- **Comments:** Add comments for complex logic
- **Formatting:** Use Prettier for consistent formatting

### Commit Message Format

```
<type>: <subject>

<body>

<footer>
```

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Code style (formatting, missing semicolons, etc.)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Build process, dependencies, etc.

**Example:**
```
feat: add OTP email verification for signup

- Generate 6-digit OTP
- Send OTP via Nodemailer
- Verify OTP before account activation
- Resend OTP functionality

Closes #123
```

---

## 📞 Support & Contact

For questions or issues:
- **GitHub Issues:** https://github.com/naveediqbal4765/smart-assistant-senior-citizens/issues
- **Email:** naveediqbal4765@gmail.com
- **Supervisor:** Mr. Ghaffar Ahmed (SZABIST)

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🎯 Roadmap

### Q2 2026 (Next Phase)
- [ ] Module 2: User Profile Management
- [ ] Module 3: Task Request Module
- [ ] OAuth implementation (Google, Facebook, Apple)
- [ ] Push notifications
- [ ] Mobile app (React Native)

### Q3 2026
- [ ] Module 4-6: Communication, Health, Wellness
- [ ] AI-powered health insights
- [ ] Wearable device integration
- [ ] Advanced analytics dashboard

### Q4 2026
- [ ] Module 7-12: Emergency, Social, Rewards, Travel, Adaptive, Guide
- [ ] Machine learning for fall detection
- [ ] Voice assistant integration
- [ ] Production deployment

---

**Last Updated:** April 2026  
**Version:** 1.0.0 (Module 1 Complete)  
**Status:** Active Development 🚀
