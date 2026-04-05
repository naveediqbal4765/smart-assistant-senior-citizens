# Smart Assistant for Senior Citizens - Complete Documentation

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Setup Instructions](#setup-instructions)
6. [Frontend Features](#frontend-features)
7. [Backend API](#backend-api)
8. [Database Schema](#database-schema)
9. [Authentication](#authentication)
10. [Physical Rehabilitation Module](#physical-rehabilitation-module)
11. [Deployment](#deployment)
12. [Troubleshooting](#troubleshooting)
13. [Contributing](#contributing)

---

## 🎯 Project Overview

Smart Assistant for Senior Citizens is a comprehensive MERN (MongoDB, Express, React, Node.js) application designed to connect senior citizens with caregivers and volunteers, providing emergency support, health monitoring, and community assistance.

### Mission

To empower senior citizens with technology that enables independent living while maintaining strong connections with family, caregivers, and community support networks.

### Key Objectives

- ✅ Provide emergency SOS functionality with location sharing
- ✅ Enable real-time health monitoring and vital tracking
- ✅ Facilitate caregiver-elder connections
- ✅ Offer AI-guided physical rehabilitation exercises
- ✅ Maintain comprehensive medical records
- ✅ Connect seniors with volunteer support networks
- ✅ Ensure accessibility for elderly users

---

## ✨ Features

### For Senior Citizens (Elders)

#### 🛡️ Safety First Layer
- **Emergency SOS Button**: One-tap emergency alert with location sharing
- **Emergency Contacts**: Quick-dial speed dial for family and caregivers
- **Screen Reader Support**: Voice assistance for accessibility
- **Fall Detection Ready**: Infrastructure for fall detection integration

#### 🏥 Medical Hub
- **Live Vitals Monitor**: Real-time heart rate, oxygen level, temperature tracking
- **Medication Schedule**: Daily medication reminders with completion tracking
- **Medical Vault**: Secure storage for lab reports, prescriptions, health history
- **Health History**: 7-day vitals tracking with trend analysis

#### 🚗 Mobility & Help
- **Task Request**: Request groceries, cleaning, and other services
- **AI Voice Assistant**: Voice-based task requests
- **Ride Booking**: Integration-ready for ride-hailing services
- **Volunteer Finder**: Connect with community volunteers

#### 💚 Wellness & Support
- **Messages**: Unified chat with family, caregivers, and volunteers
- **Sleep Timer**: Soothing sounds and white noise for sleep
- **Medication Reminder**: Smart medication tracking and alerts
- **Physical Rehabilitation**: AI-guided exercise programs with camera support

#### 👤 Profile & Settings
- **My Profile**: View and edit personal and medical information
- **Settings**: Customize display, language, notifications, and accessibility
- **Preferences**: Font size, high contrast mode, dark mode, language selection

### For Caregivers

- **Elder Monitoring Dashboard**: Real-time vitals and health status
- **SOS Alerts**: Instant notifications for emergency situations
- **Medication Tracking**: Monitor elder's medication compliance
- **Schedule Management**: Manage care schedules and tasks
- **Communication**: Direct messaging with elders and other caregivers

### For Volunteers

- **Service Availability**: Set availability and service radius
- **Skill-Based Matching**: Match with elders needing specific services
- **Task Management**: Accept and complete volunteer tasks
- **Performance Tracking**: Build reputation through ratings and reviews
- **NGO Affiliation**: Track volunteer work for organizations

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React.js 18+
- **Styling**: Tailwind CSS + Inline Styles
- **Routing**: React Router v6
- **State Management**: Context API
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Real-time**: Socket.io Client
- **Font**: Montserrat (Google Fonts)

### Backend
- **Runtime**: Node.js v14+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.io
- **File Upload**: Multer
- **Validation**: Express-validator
- **Environment**: dotenv

### DevOps & Deployment
- **Version Control**: Git & GitHub
- **Hosting**: Heroku / AWS / DigitalOcean
- **Database Hosting**: MongoDB Atlas
- **File Storage**: AWS S3 (optional)

---

## 📁 Project Structure

```
smart-assistant-senior-citizens/
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js
│   │   │   ├── Navbar.js
│   │   │   ├── Footer.js
│   │   │   └── ProtectedRoute.js
│   │   ├── pages/
│   │   │   ├── LoginPage.js
│   │   │   ├── SignupPage.js
│   │   │   ├── VerifyOTPPage.js
│   │   │   ├── ForgotPasswordPage.js
│   │   │   ├── ResetPasswordPage.js
│   │   │   ├── ElderDashboard.js
│   │   │   ├── ElderHealthHistory.js
│   │   │   ├── ElderLabReports.js
│   │   │   ├── ElderPrescriptions.js
│   │   │   ├── ElderSupport.js
│   │   │   ├── ElderPhysicalRehabilitation.js
│   │   │   ├── ElderMyProfile.js
│   │   │   ├── ElderSettings.js
│   │   │   ├── CaregiverDashboard.js
│   │   │   ├── VolunteerDashboard.js
│   │   │   └── NotFoundPage.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── assets/
│   │   │   └── images/
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── tailwind.config.js
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Elder.js
│   │   ├── Caregiver.js
│   │   ├── Volunteer.js
│   │   ├── SOS.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── elders.js
│   │   ├── caregivers.js
│   │   ├── volunteers.js
│   │   ├── sos.js
│   │   └── exercises.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── config/
│   │   └── database.js
│   ├── utils/
│   │   ├── emailService.js
│   │   ├── smsService.js
│   │   └── helpers.js
│   ├── .env.example
│   ├── server.js
│   ├── package.json
│   └── README.md
│
├── DOCUMENTATION.md
├── BACKEND_DOCUMENTATION.md
├── README.md
└── .gitignore
```

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js v14 or higher
- MongoDB Atlas account
- npm or yarn
- Git

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

5. **Start development server**
   ```bash
   npm start
   ```

   The application will open at `http://localhost:3000`

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   ```
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-assistant
   JWT_SECRET=your_super_secret_jwt_key_here
   FRONTEND_URL=http://localhost:3000
   ```

5. **Start the server**
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run dev
   ```

---

## 🎨 Frontend Features

### Authentication Pages

#### Login Page
- Email and password authentication
- "Remember me" functionality
- Forgot password link
- Sign up redirect
- Form validation with error messages

#### Signup Page
- Multi-step registration process
- Role selection (Elder, Caregiver, Volunteer)
- Role-specific fields
- OTP verification
- Password strength indicator
- Terms and conditions acceptance

#### Password Recovery
- Forgot password request
- OTP verification
- Password reset with confirmation

### Elder Dashboard

#### 1. Safety First Layer
- **Emergency Contacts**: Quick-dial buttons for family and caregivers
- **SOS Button**: Fixed button at bottom center for emergency alerts
- **Screen Reader**: Voice assistance toggle

#### 2. Medical Hub
- **Live Vitals Monitor**: Real-time heart rate, oxygen, temperature
- **Medication Schedule**: Daily medications with completion tracking
- **Medical Vault**: Access to lab reports, prescriptions, health history

#### 3. Mobility & Help
- **Task Request**: Request services (groceries, cleaning, rides)
- **AI Voice Assistant**: Voice-based requests
- **Ride Booking**: Integration-ready for ride services
- **Volunteer Finder**: Connect with community volunteers

#### 4. Wellness & Support
- **Messages**: Chat with family and caregivers
- **Sleep Timer**: Soothing sounds for sleep
- **Medication Reminder**: Smart medication alerts
- **Physical Rehabilitation**: AI-guided exercises with camera

#### 5. Profile & Settings
- **My Profile**: View and edit personal information
- **Settings**: Customize display and preferences
- **Health History**: 7-day vitals tracking
- **Lab Reports**: View and download lab reports
- **Prescriptions**: Manage prescriptions with camera scanner
- **Support**: Emergency contacts and volunteer directory

### Design System

#### Color Palette
- **Primary Green**: #1C382A (Dark Green)
- **Secondary Green**: #52b788 (Medium Green)
- **Light Green**: #74c69d (Light Green)
- **Accent Green**: #A9C6B2 (Pale Green)
- **Light Background**: #BAE4C7 (Very Light Green)
- **Dashboard Background**: #E2FFEB (Very Light Green)
- **Error Red**: #e63946
- **Warning Yellow**: #FFC107
- **White**: #FFFFFF

#### Typography
- **Font Family**: Montserrat
- **Font Weights**: 400, 600, 700
- **Responsive Sizing**: Uses clamp() for fluid typography

#### Accessibility
- Large buttons for easy tapping
- High contrast colors
- Screen reader support
- Keyboard navigation ready
- Clear visual hierarchy

---

## 🔌 Backend API

### Authentication Endpoints

```
POST   /api/auth/signup              - Register new user
POST   /api/auth/login               - Login user
POST   /api/auth/verify-otp          - Verify OTP
POST   /api/auth/forgot-password     - Request password reset
POST   /api/auth/reset-password      - Reset password
```

### Elder Endpoints

```
GET    /api/elders/profile           - Get elder profile
PUT    /api/elders/profile           - Update elder profile
GET    /api/elders/vitals            - Get current vitals
POST   /api/elders/vitals            - Update vitals
GET    /api/elders/health-history    - Get health history
GET    /api/elders/medications       - Get medications
POST   /api/elders/medications       - Add medication
GET    /api/elders/lab-reports       - Get lab reports
POST   /api/elders/lab-reports       - Add lab report
GET    /api/elders/prescriptions     - Get prescriptions
POST   /api/elders/prescriptions     - Add prescription
GET    /api/elders/emergency-contacts - Get emergency contacts
POST   /api/elders/emergency-contacts - Add emergency contact
PUT    /api/elders/emergency-contacts/:id - Update contact
DELETE /api/elders/emergency-contacts/:id - Delete contact
GET    /api/elders/preferences       - Get preferences
PUT    /api/elders/preferences       - Update preferences
```

### Exercise Endpoints

```
GET    /api/exercises                - Get all exercises
GET    /api/exercises/:id            - Get single exercise
POST   /api/exercises/:id/complete   - Record completion
GET    /api/exercises/progress/all   - Get progress
POST   /api/exercises/ai-check       - AI form analysis
```

### SOS Endpoints

```
POST   /api/sos/trigger              - Trigger SOS alert
GET    /api/sos/history              - Get SOS history
PUT    /api/sos/:id/resolve          - Resolve SOS alert
GET    /api/sos/location/last        - Get last location
```

For detailed API documentation, see [BACKEND_DOCUMENTATION.md](./BACKEND_DOCUMENTATION.md)

---

## 📊 Database Schema

### User Model
- Basic authentication and profile information
- Role-based access control
- Email and phone verification

### Elder Model
- Personal and medical information
- Health monitoring data
- Caregiver assignments
- Exercise progress tracking
- SOS history
- User preferences

### Caregiver Model
- Relationship to elders
- Assigned elders list
- Notification preferences
- Availability status

### Volunteer Model
- Organization affiliation
- Service details and skills
- Availability schedule
- Performance ratings
- Location-based services

For detailed schema information, see [BACKEND_DOCUMENTATION.md](./BACKEND_DOCUMENTATION.md)

---

## 🔐 Authentication

### JWT Implementation

- **Token Type**: Bearer Token
- **Algorithm**: HS256
- **Access Token Expiry**: 24 hours
- **Refresh Token Expiry**: 7 days

### Protected Routes

All API endpoints (except auth) require valid JWT token in Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Role-Based Access Control

- **Elder**: Access to elder-specific endpoints
- **Caregiver**: Access to caregiver endpoints and assigned elders
- **Volunteer**: Access to volunteer endpoints and assigned tasks

---

## 💪 Physical Rehabilitation Module

### Overview

The Physical Rehabilitation module provides AI-guided exercise programs tailored to each elder's health conditions.

### Features

#### Exercise Library
- **6 Personalized Exercises**:
  1. Neck Stretches (Easy, 5 mins)
  2. Arm Circles (Easy, 5 mins)
  3. Seated Leg Lifts (Medium, 8 mins)
  4. Standing Balance Exercise (Medium, 5 mins)
  5. Gentle Walking in Place (Easy, 10 mins)
  6. Seated Torso Twists (Easy, 5 mins)

#### Health-Based Personalization
- Exercises filtered by medical conditions
- Target conditions: Diabetes, Hypertension, Arthritis, General wellness
- Difficulty levels: Easy, Medium

#### AI-Guided Camera
- Real-time video capture
- Form analysis simulation
- Personalized feedback
- Progress tracking

#### Exercise Details
- Step-by-step instructions
- Benefits and cautions
- AI guidance tips
- Duration and repetition info

### Usage

1. **Access Physical Rehabilitation**
   - From Elder Dashboard, click "💪 Physical Rehabilitation"
   - Or navigate to `/elder-physical-rehabilitation`

2. **View Exercises**
   - See all recommended exercises
   - Filter by difficulty or condition
   - View exercise details

3. **Start Exercise**
   - Click "📹 Start Exercise"
   - Allow camera access
   - Capture frames for AI feedback
   - Get personalized guidance

4. **Track Progress**
   - View completion count
   - See last completed date
   - Monitor exercise history

---

## 🚀 Deployment

### Frontend Deployment

#### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

#### Netlify
```bash
npm run build
# Deploy the build folder to Netlify
```

#### GitHub Pages
```bash
npm run build
# Deploy to gh-pages branch
```

### Backend Deployment

#### Heroku
```bash
heroku create your-app-name
heroku config:set MONGODB_URI=your_uri
git push heroku main
```

#### AWS EC2
1. Create EC2 instance
2. Install Node.js and MongoDB
3. Clone repository
4. Configure security groups
5. Start server with PM2

#### DigitalOcean
1. Create Droplet
2. Install Node.js
3. Set up Nginx reverse proxy
4. Configure SSL with Let's Encrypt
5. Deploy application

---

## 🐛 Troubleshooting

### Common Issues

#### Frontend Issues

**Port 3000 already in use**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
# Or use different port
PORT=3001 npm start
```

**Module not found errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**CORS errors**
- Ensure backend CORS is configured correctly
- Check FRONTEND_URL in backend .env

#### Backend Issues

**MongoDB connection failed**
- Verify MongoDB URI in .env
- Check IP whitelist in MongoDB Atlas
- Ensure network connectivity

**JWT token errors**
- Verify JWT_SECRET is set in .env
- Check token expiration
- Ensure token is included in Authorization header

**Port 5000 already in use**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
# Or use different port
PORT=5001 npm start
```

---

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/smart-assistant-senior-citizens.git
   ```

2. **Create feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. **Make changes and commit**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```

4. **Push to branch**
   ```bash
   git push origin feature/AmazingFeature
   ```

5. **Open Pull Request**
   - Describe changes clearly
   - Reference related issues
   - Include screenshots if UI changes

### Code Standards

- Use consistent naming conventions
- Write meaningful commit messages
- Add comments for complex logic
- Follow existing code style
- Test changes before submitting PR

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 Support

For support, email support@smartassistant.com or open an issue on GitHub.

---

## 🙏 Acknowledgments

- MongoDB for database
- Express.js for backend framework
- React for frontend framework
- Socket.io for real-time communication
- JWT for authentication
- All contributors and testers

---

**Last Updated**: April 2026  
**Version**: 1.0.0  
**Status**: Production Ready
