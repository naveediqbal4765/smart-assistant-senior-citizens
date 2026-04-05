# Frontend Project Structure - Organized Pages

## 📁 Complete Frontend Directory Structure

```
frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
│
├── src/
│   ├── components/
│   │   ├── Header.js                 # App header with logo and navigation
│   │   ├── Navbar.js                 # Profile dropdown and navigation
│   │   ├── Footer.js                 # App footer
│   │   ├── ProtectedRoute.js         # Route protection component
│   │   └── common/
│   │       └── ProtectedRoute.js     # Route guard component
│   │
│   ├── pages/                        # ⭐ ORGANIZED PAGE STRUCTURE
│   │   │
│   │   ├── auth/                     # 🔐 Authentication Pages
│   │   │   ├── LoginPage.js          # User login
│   │   │   ├── SignupPage.js         # User registration with role selection
│   │   │   ├── VerifyOTPPage.js      # OTP verification
│   │   │   ├── ForgotPasswordPage.js # Password recovery request
│   │   │   └── ResetPasswordPage.js  # Password reset with token
│   │   │
│   │   ├── elder/                    # 👴 Elder (Senior) Pages
│   │   │   ├── ElderDashboard.js     # Main dashboard (5 layers)
│   │   │   │                         #   - Safety First
│   │   │   │                         #   - Medical Hub
│   │   │   │                         #   - Mobility & Help
│   │   │   │                         #   - Wellness & Support
│   │   │   │                         #   - Profile & Settings
│   │   │   │
│   │   │   ├── ElderHealthHistory.js # 7-day vitals tracking
│   │   │   ├── ElderLabReports.js    # Lab reports management
│   │   │   ├── ElderPrescriptions.js # Prescriptions with camera scanner
│   │   │   ├── ElderSupport.js       # Emergency contacts & volunteers
│   │   │   │
│   │   │   ├── ElderPhysicalRehabilitation.js  # AI-guided exercises
│   │   │   │                                    # - Exercise library
│   │   │   │                                    # - Camera support
│   │   │   │                                    # - Progress tracking
│   │   │   │
│   │   │   ├── ElderMyProfile.js     # View/edit personal info
│   │   │   ├── ElderSettings.js      # Display & notification settings
│   │   │   │
│   │   │   ├── ElderMessages.js      # Chat with family/caregivers
│   │   │   ├── ElderSleepTimer.js    # Sleep timer with sounds
│   │   │   ├── ElderMedicationReminder.js  # Medication alerts
│   │   │   └── ElderTaskRequest.js   # Request services
│   │   │
│   │   ├── caregiver/                # 👨‍⚕️ Caregiver Pages
│   │   │   └── CaregiverDashboard.js # Caregiver main dashboard
│   │   │
│   │   ├── volunteer/                # 👥 Volunteer Pages
│   │   │   └── VolunteerDashboard.js # Volunteer main dashboard
│   │   │
│   │   └── common/                   # 🔧 Common Pages
│   │       ├── NotFoundPage.js       # 404 error page
│   │       └── TestDashboardsPage.js # Testing page
│   │
│   ├── context/
│   │   └── AuthContext.js            # Global authentication state
│   │
│   ├── services/
│   │   └── api.js                    # API client configuration
│   │
│   ├── assets/
│   │   └── images/                   # Image assets
│   │
│   ├── App.js                        # Root component with routing
│   ├── index.js                      # React entry point
│   └── index.css                     # Global styles
│
├── tailwind.config.js                # Tailwind CSS configuration
├── .env.example                      # Environment variables template
├── package.json                      # Dependencies
└── README.md                         # Frontend README
```

---

## 📂 Folder Organization Details

### 🔐 `/pages/auth/` - Authentication Pages

**Purpose**: Handle user authentication and account management

| File | Purpose | Features |
|------|---------|----------|
| `LoginPage.js` | User login | Email/password auth, remember me, forgot password link |
| `SignupPage.js` | User registration | Multi-step, role selection, OTP verification |
| `VerifyOTPPage.js` | OTP verification | Email verification, resend OTP |
| `ForgotPasswordPage.js` | Password recovery | Email verification, OTP check |
| `ResetPasswordPage.js` | Password reset | New password entry, confirmation |

**Routes**:
```
/login
/signup
/verify-otp
/forgot-password
/reset-password
```

---

### 👴 `/pages/elder/` - Elder (Senior) Pages

**Purpose**: All features for senior citizens

#### Dashboard & Main Pages

| File | Purpose | Features |
|------|---------|----------|
| `ElderDashboard.js` | Main dashboard | 5 layers: Safety, Medical, Mobility, Wellness, Profile |
| `ElderMyProfile.js` | Profile management | View/edit personal & medical info |
| `ElderSettings.js` | Settings | Display, notifications, accessibility, app info |

#### Health & Medical Pages

| File | Purpose | Features |
|------|---------|----------|
| `ElderHealthHistory.js` | Vitals tracking | 7-day history, trends, statistics |
| `ElderLabReports.js` | Lab reports | View, download, status indicators |
| `ElderPrescriptions.js` | Prescriptions | Camera scanner, PDF export, expiry alerts |
| `ElderSupport.js` | Support & help | Emergency contacts, volunteer directory |

#### Wellness & Activity Pages

| File | Purpose | Features |
|------|---------|----------|
| `ElderPhysicalRehabilitation.js` | Exercise program | 6 exercises, AI guidance, camera support |
| `ElderMessages.js` | Messaging | Chat with family, caregivers, volunteers |
| `ElderSleepTimer.js` | Sleep aid | Soothing sounds, white noise, timer |
| `ElderMedicationReminder.js` | Medication alerts | Daily reminders, tracking |
| `ElderTaskRequest.js` | Service requests | Request groceries, cleaning, rides |

**Routes**:
```
/elder-dashboard
/elder-my-profile
/elder-settings
/elder-health-history
/elder-lab-reports
/elder-prescriptions
/elder-support
/elder-physical-rehabilitation
/elder-messages
/elder-sleep-timer
/elder-medication-reminder
/elder-task-request
```

---

### 👨‍⚕️ `/pages/caregiver/` - Caregiver Pages

**Purpose**: Features for caregivers managing seniors

| File | Purpose | Features |
|------|---------|----------|
| `CaregiverDashboard.js` | Main dashboard | Monitor elders, SOS alerts, medications |

**Routes**:
```
/caregiver-dashboard
```

---

### 👥 `/pages/volunteer/` - Volunteer Pages

**Purpose**: Features for community volunteers

| File | Purpose | Features |
|------|---------|----------|
| `VolunteerDashboard.js` | Main dashboard | Available tasks, schedule, ratings |

**Routes**:
```
/volunteer-dashboard
```

---

### 🔧 `/pages/common/` - Common Pages

**Purpose**: Shared pages used across the application

| File | Purpose | Features |
|------|---------|----------|
| `NotFoundPage.js` | 404 error | Page not found message |
| `TestDashboardsPage.js` | Testing | Quick access to all dashboards |

**Routes**:
```
/404
/test-dashboards
```

---

## 🎯 Page Organization Benefits

### ✅ Advantages of This Structure

1. **Clear Organization**
   - Pages grouped by user role
   - Easy to find related pages
   - Logical folder hierarchy

2. **Scalability**
   - Easy to add new pages
   - Simple to extend features
   - Organized for team collaboration

3. **Maintainability**
   - Related pages together
   - Easier to refactor
   - Clear dependencies

4. **Navigation**
   - Intuitive folder structure
   - Self-documenting code
   - Easy onboarding for new developers

---

## 📊 Page Count by Category

| Category | Count | Pages |
|----------|-------|-------|
| Auth | 5 | Login, Signup, OTP, Forgot Password, Reset Password |
| Elder | 12 | Dashboard, Health, Medical, Wellness, Profile, Settings |
| Caregiver | 1 | Dashboard |
| Volunteer | 1 | Dashboard |
| Common | 2 | 404, Test |
| **Total** | **21** | **All pages organized** |

---

## 🔄 Import Path Examples

### Before (Flat Structure)
```javascript
import LoginPage from "./pages/LoginPage";
import ElderDashboard from "./pages/ElderDashboard";
import CaregiverDashboard from "./pages/CaregiverDashboard";
```

### After (Organized Structure)
```javascript
import LoginPage from "./pages/auth/LoginPage";
import ElderDashboard from "./pages/elder/ElderDashboard";
import CaregiverDashboard from "./pages/caregiver/CaregiverDashboard";
```

---

## 📝 Adding New Pages

### To Add a New Elder Page

1. **Create file** in `/pages/elder/`
   ```bash
   touch src/pages/elder/ElderNewFeature.js
   ```

2. **Update App.js** with new route
   ```javascript
   import ElderNewFeature from "./pages/elder/ElderNewFeature";
   
   <Route path="/elder-new-feature" element={<ElderNewFeature />} />
   ```

3. **Add navigation** in ElderDashboard or Navbar

### To Add a New Auth Page

1. **Create file** in `/pages/auth/`
   ```bash
   touch src/pages/auth/NewAuthPage.js
   ```

2. **Update App.js** with new route
   ```javascript
   import NewAuthPage from "./pages/auth/NewAuthPage";
   
   <Route path="/new-auth-page" element={<NewAuthPage />} />
   ```

---

## 🚀 Development Workflow

### Starting Development

```bash
cd frontend
npm install
npm start
```

### File Structure for New Features

When adding a new feature:

1. **Create page** in appropriate folder
2. **Update App.js** with route
3. **Add navigation** in relevant component
4. **Test** the new route
5. **Commit** changes

---

## 📚 Related Documentation

- [COMPLETE_DOCUMENTATION.md](./COMPLETE_DOCUMENTATION.md) - Full project documentation
- [BACKEND_DOCUMENTATION.md](./BACKEND_DOCUMENTATION.md) - Backend API reference
- [README.md](./README.md) - Project overview

---

## ✨ Best Practices

### Naming Conventions

- **Page files**: `[Role][Feature]Page.js`
  - Example: `ElderHealthHistory.js`, `CaregiverDashboard.js`

- **Folders**: lowercase, descriptive
  - Example: `auth`, `elder`, `caregiver`, `volunteer`, `common`

- **Routes**: kebab-case
  - Example: `/elder-health-history`, `/elder-physical-rehabilitation`

### File Organization

- Keep related pages together
- One page per file
- Use descriptive names
- Add comments for complex logic

### Import Organization

```javascript
// 1. React imports
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// 2. Context imports
import { useAuth } from "../context/AuthContext";

// 3. Component imports
import Header from "../components/Header";
import Footer from "../components/Footer";

// 4. Service imports
import { authAPI } from "../services/api";

// 5. Library imports
import toast from "react-hot-toast";
```

---

**Last Updated**: April 2026  
**Version**: 1.0.0  
**Status**: Organized & Production Ready
