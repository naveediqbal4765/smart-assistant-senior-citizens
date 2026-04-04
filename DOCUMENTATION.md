# Smart Assistant for Senior Citizens
## DOCUMENTATION.md - Step-by-Step Developer Guide

> **Project:** Smart Assistant for Senior Citizens  
> **University:** SZABIST University, Islamabad  
> **Team:** Manahil Chaudhary (2212470), Sartaj Riaz (2212498), Naveed Iqbal (2212474)  
> **Supervisor:** Mr. Ghaffar Ahmed  
> **Semester:** Spring 2026

---

## 📁 Project Structure

```
smart-assistant-senior-citizens/
│
├── backend/                          # Node.js + Express API Server
│   ├── config/
│   │   └── db.js                     # MongoDB Atlas connection
│   ├── controllers/
│   │   └── auth/
│   │       └── authController.js     # All auth logic (login, signup, OTP, OAuth)
│   ├── middleware/
│   │   ├── authMiddleware.js         # JWT verification + role-based access
│   │   └── validateMiddleware.js     # Input validation rules (express-validator)
│   ├── models/
│   │   └── User.js                   # Mongoose User schema (all 3 roles)
│   ├── routes/
│   │   └── authRoutes.js             # Auth API route definitions
│   ├── sockets/
│   │   └── socketHandler.js          # Socket.io real-time event handlers
│   ├── utils/
│   │   ├── emailUtils.js             # Nodemailer OTP email sender
│   │   └── jwtUtils.js               # JWT token generation helpers
│   ├── .env.example                  # Environment variable template
│   ├── package.json                  # Backend dependencies
│   └── server.js                     # Main entry point
│
├── frontend/                         # React.js + Tailwind CSS
│   ├── public/
│   │   └── index.html                # HTML template
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── ElderSignupForm.js      # Elder-specific signup fields
│   │   │   │   ├── CaregiverSignupForm.js  # Caregiver-specific signup fields
│   │   │   │   └── VolunteerSignupForm.js  # Volunteer-specific signup fields
│   │   │   └── common/
│   │   │       └── ProtectedRoute.js       # Route guard (auth + role check)
│   │   ├── context/
│   │   │   └── AuthContext.js        # Global auth state (React Context)
│   │   ├── pages/
│   │   │   ├── LoginPage.js          # Login page (matches UserInterface1.png)
│   │   │   ├── SignupPage.js         # Signup with role selection
│   │   │   ├── VerifyOTPPage.js      # OTP verification (6-digit boxes)
│   │   │   ├── ForgotPasswordPage.js # Request password reset OTP
│   │   │   ├── ResetPasswordPage.js  # Set new password
│   │   │   ├── ElderDashboard.js     # Elder's main dashboard
│   │   │   ├── CaregiverDashboard.js # Caregiver's monitoring dashboard
│   │   │   ├── VolunteerDashboard.js # Volunteer's task dashboard
│   │   │   └── NotFoundPage.js       # 404 page
│   │   ├── services/
│   │   │   └── api.js                # Axios HTTP client + interceptors
│   │   ├── App.js                    # Root component + routing
│   │   ├── index.js                  # React entry point
│   │   └── index.css                 # Global styles + Tailwind directives
│   ├── package.json                  # Frontend dependencies
│   └── tailwind.config.js            # Tailwind custom theme
│
└── DOCUMENTATION.md                  # This file
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB Atlas account (credentials already configured)
- Git

### Step 1: Clone the Repository
```bash
git clone https://github.com/naveediqbal4765/smart-assistant-senior-citizens.git
cd smart-assistant-senior-citizens
```

---

## ⚙️ Backend Setup

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 3: Configure Environment Variables
```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your actual values
nano .env   # or use any text editor
```

**Required .env values:**
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://smartAssistant:EhecvOdyRjtMFgf9@cluster0.mongodb.net/smartAssistantDB?retryWrites=true&w=majority
JWT_SECRET=your_long_random_secret_here
JWT_REFRESH_SECRET=another_long_random_secret
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
CLIENT_URL=http://localhost:3000
```

> **Gmail App Password:** Go to Google Account → Security → 2-Step Verification → App Passwords → Generate one for "Mail"

### Step 4: Start Backend Server
```bash
# Development mode (auto-restart on file changes)
npm run dev

# Production mode
npm start
```

**Expected output:**
```
✅ MongoDB Connected: cluster0.mongodb.net
🚀 Smart Assistant Server running on port 5000
📡 Environment: development
🔗 API Base URL: http://localhost:5000/api
💡 Health Check: http://localhost:5000/api/health
```

---

## 🎨 Frontend Setup

### Step 5: Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### Step 6: Configure Frontend Environment (Optional)
```bash
# Create .env file in frontend folder
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
```

### Step 7: Start Frontend Development Server
```bash
npm start
```

The app will open at **http://localhost:3000**

---

## 🔌 API Endpoints Reference

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | Login with email + password | No |
| POST | `/api/auth/signup` | Register new user (any role) | No |
| POST | `/api/auth/verify-otp` | Verify email OTP after signup | No |
| POST | `/api/auth/forgot-password` | Request password reset OTP | No |
| POST | `/api/auth/verify-reset-otp` | Verify OTP for password reset | No |
| POST | `/api/auth/reset-password` | Set new password | No |
| POST | `/api/auth/resend-otp` | Resend OTP to email | No |
| POST | `/api/auth/oauth` | OAuth login (Google/Facebook/Apple) | No |
| GET | `/api/auth/me` | Get current user profile | ✅ Yes |
| DELETE | `/api/auth/delete-account` | Soft delete account | ✅ Yes |

### Request/Response Examples

**Login Request:**
```json
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "MyPassword@123",
  "rememberMe": true
}
```

**Login Response (Success):**
```json
{
  "success": true,
  "message": "Login successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64abc123...",
    "fullName": "Ahmed Khan",
    "email": "user@example.com",
    "role": "elder",
    "isVerified": true,
    "elderData": { "seniorId": "SR-A1B2C3", ... }
  }
}
```

**Login Response (Wrong Credentials):**
```json
{
  "success": false,
  "message": "Entered wrong email or password"
}
```

---

## 🗄️ Database Schema

### User Model (MongoDB)

```javascript
{
  // Common fields (all roles)
  fullName: String,          // Required
  email: String,             // Required, unique, lowercase
  phone: String,             // Required
  password: String,          // Hashed with bcrypt (12 rounds)
  profilePicture: String,    // URL to image
  dateOfBirth: Date,
  address: { text, lat, lng },
  nationalId: String,        // 13-digit CNIC
  role: "elder" | "caregiver" | "volunteer",
  authProvider: "local" | "google" | "facebook" | "apple",
  isVerified: Boolean,       // Email verified?
  isActive: Boolean,
  isDeleted: Boolean,        // Soft delete
  
  // OTP fields (excluded from queries by default)
  otp: String,               // Hashed OTP
  otpExpiry: Date,
  otpPurpose: String,
  
  // Role-specific data (only one populated)
  elderData: {
    seniorId: String,        // Auto-generated unique ID
    livesAlone: Boolean,
    emergencyContacts: [...], // Max 3
    medicalConditions: [...],
    pairingCode: String,     // 6-digit code for caregiver linking
    pairingCodeExpiry: Date,
    priorityMonitor: Boolean,
    locationPermission: Boolean,
  },
  caregiverData: {
    relationshipToElder: String,
    linkedElderEmail: String,
    linkedElderId: ObjectId,
    isPaired: Boolean,
    accessLevel: "view-only" | "action",
    notificationsEnabled: Boolean,
    isAvailable: Boolean,
  },
  volunteerData: {
    affiliation: String,
    serviceRadius: Number,   // 1-10 km
    skills: [...],           // Medical, Errands, Physical Help
    availability: { days: [...], timeSlots: [...] },
    locationPermission: Boolean,
    isLive: Boolean,
    totalPoints: Number,
    badges: [...],
  },
  
  // Geospatial (for volunteer matching)
  location: { type: "Point", coordinates: [lng, lat] },
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date,
}
```

---

## 🔐 Security Features

| Feature | Implementation |
|---------|---------------|
| Password Hashing | bcryptjs with salt rounds = 12 |
| JWT Authentication | jsonwebtoken, 7-day expiry |
| Rate Limiting | express-rate-limit: 20 req/15min on auth routes |
| Input Validation | express-validator on all endpoints |
| Security Headers | helmet.js middleware |
| CORS | Configured for frontend origin only |
| OTP Security | Hashed with bcrypt before storage |
| Soft Delete | Accounts marked deleted, not removed |
| Password Strength | Min 8 chars + number + special char |
| CNIC Validation | Regex: exactly 13 digits |

---

## 🔄 User Flows

### Flow 1: New User Signup (Elder)
```
1. Open app → Login page shown
2. Click "Create New Account"
3. Select "I am an Elder"
4. Fill common fields (name, email, phone, password, CNIC)
5. Fill elder-specific fields:
   - Lives alone? → Yes/No
   - If No: Add 1-3 emergency contacts
   - Medical conditions? → Yes/No → Select conditions
   - Allow location access → Browser permission dialog
6. Click "Create Account"
7. OTP sent to email → Redirected to VerifyOTPPage
8. Enter 6-digit OTP → Email verified
9. Redirected to Elder Dashboard
10. Senior ID generated (e.g., SR-A1B2C3)
11. Pairing code generated for caregiver linking
```

### Flow 2: Caregiver Linking
```
1. Elder goes to dashboard → "Share Access" button
2. Elder shares their email + 6-digit pairing code with caregiver
3. Caregiver signs up → Selects "Caregiver" role
4. Enters elder's email + pairing code
5. Backend verifies code matches and is not expired
6. Accounts linked → Caregiver can now see elder's health data
```

### Flow 3: Password Reset
```
1. Login page → Click "Reset Password"
2. Enter registered email → OTP sent
3. Enter 6-digit OTP from email
4. Enter new password + confirm
5. Password updated → Redirected to login
```

### Flow 4: OAuth Login
```
1. Click Google/Facebook/Apple button
2. OAuth popup opens → User authenticates
3. Backend checks if email exists in DB
4. If YES → Login directly → Redirect to dashboard
5. If NO → Redirect to signup with pre-filled data
```

---

## 🔌 Socket.io Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `sos:trigger` | Client → Server | Elder triggers SOS emergency |
| `sos:received` | Server → Client | Caregiver receives SOS alert |
| `sos:acknowledged` | Server → Client | Confirms SOS was sent |
| `location:update` | Client → Server | Elder shares live location |
| `chat:message` | Client → Server | Send chat message |
| `chat:newMessage` | Server → Client | Receive chat message |
| `volunteer:toggleAvailability` | Client → Server | Volunteer goes online/offline |
| `volunteer:availabilityUpdated` | Server → Client | Confirms availability change |

---

## 🧪 Testing Guide

### Test Case 1: Login with Wrong Credentials
```
1. Open http://localhost:3000
2. Enter any email + wrong password
3. Expected: "Entered wrong email or password" shown in fields
4. User should NOT be logged in
```

### Test Case 2: Signup as Elder
```
1. Click "Create New Account"
2. Select "Elder"
3. Fill all required fields
4. Submit → Check email for OTP
5. Enter OTP → Should redirect to Elder Dashboard
6. Verify Senior ID is shown in sidebar
```

### Test Case 3: OTP Expiry
```
1. Request OTP
2. Wait 10+ minutes
3. Try to use expired OTP
4. Expected: "OTP has expired" error message
```

### Test Case 4: Caregiver Pairing
```
1. Login as Elder → Note pairing code from dashboard
2. Signup as Caregiver → Enter elder's email + pairing code
3. Expected: Accounts linked, caregiver can see elder's data
```

### Test Case 5: Protected Routes
```
1. Try to access /dashboard/elder without logging in
2. Expected: Redirected to /login
3. Login as volunteer → Try to access /dashboard/elder
4. Expected: Redirected to /dashboard/volunteer (wrong role)
```

---

## 📦 Dependencies

### Backend
| Package | Version | Purpose |
|---------|---------|---------|
| express | ^4.18.2 | Web framework |
| mongoose | ^8.0.3 | MongoDB ODM |
| bcryptjs | ^2.4.3 | Password hashing |
| jsonwebtoken | ^9.0.2 | JWT authentication |
| socket.io | ^4.6.1 | Real-time communication |
| nodemailer | ^6.9.7 | Email sending (OTP) |
| express-validator | ^7.0.1 | Input validation |
| express-rate-limit | ^7.1.5 | Rate limiting |
| helmet | ^7.1.0 | Security headers |
| cors | ^2.8.5 | Cross-origin requests |
| dotenv | ^16.3.1 | Environment variables |
| morgan | ^1.10.0 | HTTP request logging |
| uuid | ^9.0.1 | Unique ID generation |

### Frontend
| Package | Version | Purpose |
|---------|---------|---------|
| react | ^18.2.0 | UI framework |
| react-router-dom | ^6.21.0 | Client-side routing |
| axios | ^1.6.2 | HTTP client |
| socket.io-client | ^4.6.1 | Real-time client |
| tailwindcss | ^3.4.0 | Utility-first CSS |
| react-hot-toast | ^2.4.1 | Toast notifications |
| react-icons | ^4.12.0 | Icon library |
| browser-image-compression | ^2.0.2 | Profile picture compression |

---

## 🚀 Deployment Notes

### Backend Deployment (e.g., Railway, Render, Heroku)
```bash
# Set environment variables in deployment platform
# Build command: npm install
# Start command: npm start
```

### Frontend Deployment (e.g., Vercel, Netlify)
```bash
# Build command: npm run build
# Output directory: build/
# Set REACT_APP_API_URL to your deployed backend URL
```

---

## 📋 Module Development Roadmap

| Module | Status | Priority |
|--------|--------|----------|
| ✅ Module 1: User Authentication & Login | **COMPLETE** | Done |
| 🔜 Module 2: User Profile Management | Pending | Next |
| 🔜 Module 3: Task Request Module | Pending | - |
| 🔜 Module 4: Communication Module | Pending | - |
| 🔜 Module 5: Health & Medication | Pending | - |
| 🔜 Module 6: Wellness & Physical Rehab | Pending | - |
| 🔜 Module 7: Emergency & Safety | Pending | - |
| 🔜 Module 8: Social Circle | Pending | - |
| 🔜 Module 9: Volunteer Rewards | Pending | - |
| 🔜 Module 10: Smart Travel Escort | Pending | - |
| 🔜 Module 11: Adaptive Assistance | Pending | - |
| 🔜 Module 12: Emergency Guide | Pending | - |

---

## 👥 Team Contacts

- **Naveed Iqbal** (2212474) - naveediqbal4765@gmail.com
- **Manahil Chaudhary** (2212470)
- **Sartaj Riaz** (2212498)
- **Supervisor:** Mr. Ghaffar Ahmed

---

*Last Updated: April 2026 | SZABIST University, Islamabad*
