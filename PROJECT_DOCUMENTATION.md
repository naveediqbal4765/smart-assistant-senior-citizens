# Smart Assistant for Senior Citizens - Project Documentation

## 📋 Project Overview

**Smart Assistant for Senior Citizens** is a comprehensive web application designed to connect elderly individuals with caregivers and volunteers for task assistance, health monitoring, and emergency support.

---

## 🏗️ Project Structure

The project consists of **3 main modules**:

### **Module 1: Authentication & User Management**
- User registration and login
- Role-based access control (Elder, Caregiver, Volunteer)
- Google OAuth and Facebook OAuth integration
- Remember Me functionality
- Password reset and OTP verification

### **Module 2: User Profile Management**
- User profile creation and editing
- Profile picture upload
- Personal information management
- Privacy settings
- Account preferences

### **Module 3: Task Request System**
- **Elder Dashboard**: Create and manage task requests
- **Caregiver Dashboard**: Manage tasks for assigned elder
- **Volunteer Dashboard**: Browse and accept available tasks

---

## 📁 Directory Structure

```
/workspace
├── frontend/                          # React frontend application
│   ├── src/
│   │   ├── pages/
│   │   │   ├── auth/                 # Authentication pages
│   │   │   ├── elder/                # Elder dashboard pages
│   │   │   ├── caregiver/            # Caregiver dashboard pages
│   │   │   ├── volunteer/            # Volunteer dashboard pages
│   │   │   ├── task/                 # Task management pages
│   │   │   ├── profile/              # Profile management pages
│   │   │   └── common/               # Common pages
│   │   ├── components/               # Reusable React components
│   │   ├── context/                  # React context for state management
│   │   ├── assets/                   # Images, fonts, etc.
│   │   ├── App.js                    # Main app component with routing
│   │   └── index.js                  # Entry point
│   ├── package.json                  # Frontend dependencies
│   └── public/                       # Static files
│
├── backend/                          # Node.js/Express backend
│   ├── models/                       # Database models
│   ├── routes/                       # API routes
│   ├── controllers/                  # Route controllers
│   ├── middleware/                   # Custom middleware
│   ├── config/                       # Configuration files
│   ├── server.js                     # Main server file
│   └── package.json                  # Backend dependencies
│
├── PROJECT_DOCUMENTATION.md          # This file - Project overview
├── CODE_EXPLANATION.md               # Code structure and implementation details
├── README.md                         # Quick start guide
└── LICENSE                           # Project license
```

---

## 🎯 Key Features

### **For Elders**
- ✅ Create task requests for volunteers
- ✅ Browse available volunteers
- ✅ Receive notifications when volunteers accept tasks
- ✅ Track task completion
- ✅ Rate and review volunteers
- ✅ Emergency SOS button
- ✅ Health monitoring dashboard
- ✅ Medication reminders
- ✅ Sleep timer with music
- ✅ Message volunteers and caregivers

### **For Caregivers**
- ✅ Manage tasks for assigned elder
- ✅ Receive notifications about volunteer updates
- ✅ View task analytics and statistics
- ✅ Monitor elder's health data
- ✅ Receive SOS alerts
- ✅ Manage emergency contacts

### **For Volunteers**
- ✅ Browse available tasks in their area
- ✅ Accept tasks with one click
- ✅ Receive task notifications and reminders
- ✅ View task analytics and performance
- ✅ Receive ratings and reviews from elders
- ✅ Earn points for completed tasks
- ✅ Receive SOS alerts if in radius range

---

## 🛠️ Technology Stack

### **Frontend**
- **React.js** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling (with custom color scheme)
- **React Hot Toast** - Notifications
- **Axios** - HTTP client
- **Context API** - State management

### **Backend**
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service

### **External Services**
- **Google OAuth** - Social authentication
- **Facebook OAuth** - Social authentication
- **Twilio** - SMS notifications (optional)
- **Firebase** - Push notifications (optional)

---

## 🎨 Design System

### **Color Scheme**
- **Primary Green**: `#1C382A` (Dark Green)
- **Secondary Green**: `#52b788` (Medium Green)
- **Accent Green**: `#BAE4C7` (Very Light Green)
- **White**: `#FFFFFF`
- **Light Gray**: `#f5f5f5`
- **Dark Gray**: `#666666`
- **Red**: `#e63946` (Alerts)
- **Yellow**: `#FFC107` (Warnings)

### **Typography**
- **Font Family**: Montserrat (sans-serif)
- **Font Sizes**: 12px - 32px
- **Font Weights**: 400, 600, 700

---

## 📱 Responsive Design

All pages are fully responsive and work on:
- ✅ Desktop (1920px and above)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (320px - 767px)

---

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Protected routes with role-based access control
- ✅ HTTPS/SSL encryption
- ✅ CORS protection
- ✅ Input validation and sanitization
- ✅ Rate limiting on API endpoints
- ✅ Secure session management

---

## 📊 Database Schema

### **User Model**
- User ID, Email, Password, Full Name
- Role (Elder, Caregiver, Volunteer)
- Profile Picture, Phone Number
- Address, Location (GPS)
- Privacy Settings
- Created At, Updated At

### **Task Model**
- Task ID, Title, Description
- Category, Priority, Status
- Elder ID, Assigned Volunteer ID
- Scheduled Date/Time
- Location, Distance
- Rating, Review
- Created At, Completed At

### **Notification Model**
- Notification ID, User ID
- Type (Task Request, Accepted, Completed, SOS, etc.)
- Message, Read Status
- Created At

---

## 🚀 Deployment

### **Frontend Deployment**
- Hosted on Vercel or Netlify
- Auto-deploy on git push
- Environment variables configured

### **Backend Deployment**
- Hosted on Heroku or AWS
- MongoDB Atlas for database
- Environment variables configured

### **Live URLs**
- Frontend: `https://smart-assistant-frontend.vercel.app`
- Backend API: `https://smart-assistant-api.herokuapp.com`

---

## 📞 Support & Contact

For issues, questions, or feature requests:
- **GitHub Issues**: [Project Repository](https://github.com/naveediqbal4765/smart-assistant-senior-citizens)
- **Email**: support@smartassistant.com
- **Documentation**: See CODE_EXPLANATION.md for detailed code structure

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🎉 Project Status

**Current Status**: Module 3 Frontend - 85% Complete

### **Completed**
- ✅ Module 1: Authentication & User Management (100%)
- ✅ Module 2: User Profile Management (100%)
- ✅ Module 3: Task Request System - Frontend (85%)
  - ✅ Elder Dashboard with Task Request
  - ✅ Caregiver Dashboard with Task Management
  - ✅ Volunteer Dashboard with Task Browsing
  - ✅ Notifications System
  - ✅ Task Analytics
  - ✅ Ratings & Reviews

### **In Progress**
- 🔄 Module 3: Task Request System - Backend API
- 🔄 Integration Testing
- 🔄 Performance Optimization

### **Upcoming**
- 📋 Module 4: Advanced Features (AI Chat, Video Calls, etc.)
- 📋 Mobile App (React Native)
- 📋 Admin Dashboard

---

**Last Updated**: April 27, 2025
**Version**: 1.0.0
