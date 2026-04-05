# 🚀 Complete Setup Guide - Frontend & Backend Development

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Running Both Simultaneously](#running-both-simultaneously)
6. [Testing the Application](#testing-the-application)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download](https://git-scm.com/)
- **VS Code** - [Download](https://code.visualstudio.com/)
- **MongoDB Atlas Account** - [Sign up](https://www.mongodb.com/cloud/atlas)
- **Postman** (optional, for API testing) - [Download](https://www.postman.com/)

### Verify Installation
```bash
node --version      # Should be v14+
npm --version       # Should be v6+
git --version       # Should be installed
```

---

## Project Setup

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/naveediqbal4765/smart-assistant-senior-citizens.git

# Navigate to project directory
cd smart-assistant-senior-citizens

# Verify structure
ls -la
# You should see: backend/, frontend/, README.md, etc.
```

### Step 2: Open in VS Code

```bash
# Open the entire project in VS Code
code .

# Or open VS Code first, then File → Open Folder → select the project
```

### Step 3: Install VS Code Extensions (Recommended)

Open VS Code and install these extensions:
1. **ES7+ React/Redux/React-Native snippets** - dsznajder.es7-react-js-snippets
2. **Prettier - Code formatter** - esbenp.prettier-vscode
3. **Thunder Client** - rangav.vscode-thunder-client (for API testing)
4. **MongoDB for VS Code** - mongodb.mongodb-vscode
5. **REST Client** - humao.rest-client

---

## Backend Setup

### Step 1: Navigate to Backend Directory

```bash
# In VS Code terminal or your system terminal
cd backend
```

### Step 2: Install Dependencies

```bash
npm install
```

**Expected output:**
```
added 150+ packages in 2-3 minutes
```

### Step 3: Create Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit the .env file with your values
```

**Edit `.backend/.env`** with these values:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smartassistant?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
JWT_EXPIRE=7d
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key
REFRESH_TOKEN_EXPIRE=30d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Email Configuration (Optional for development)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Twilio Configuration (Optional for development)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890

# Google Maps (Optional for development)
GOOGLE_MAPS_API_KEY=your_google_maps_key

# Socket.io Configuration
SOCKET_IO_CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=debug

# Error Tracking (Optional)
SENTRY_DSN=your_sentry_dsn
```

### Step 4: Set Up MongoDB Atlas

1. **Create MongoDB Account**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up with email or Google
   - Create a new project

2. **Create a Cluster**
   - Click "Create a Cluster"
   - Select "M0 Free" tier
   - Choose your region (closest to you)
   - Click "Create Cluster" (takes 5-10 minutes)

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: `smartassistant`
   - Password: Create a strong password
   - Click "Add User"

4. **Get Connection String**
   - Go to "Clusters" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<username>` and `<password>` with your credentials
   - Replace `<dbname>` with `smartassistant`

5. **Add IP Whitelist**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (for development)
   - Click "Confirm"

### Step 5: Verify Backend Setup

```bash
# From backend directory
npm start

# Expected output:
# ╔════════════════════════════════════════════════════════════╗
# ║                                                            ║
# ║   🚀 Smart Assistant Backend Server                       ║
# ║   ✅ Server running on port 5000                          ║
# ║   📍 Environment: development                             ║
# ║   🔗 API URL: http://localhost:5000/api                   ║
# ║                                                            ║
# ╚════════════════════════════════════════════════════════════╝
```

**Test the health endpoint:**
```bash
# In another terminal
curl http://localhost:5000/health

# Expected response:
# {"success":true,"message":"Server is running","timestamp":"2026-04-05T..."}
```

---

## Frontend Setup

### Step 1: Navigate to Frontend Directory

```bash
# In a new terminal (keep backend running)
cd frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

**Expected output:**
```
added 200+ packages in 3-5 minutes
```

### Step 3: Create Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit the .env file
```

**Edit `frontend/.env`** with these values:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
REACT_APP_VERSION=1.0.0
REACT_APP_LOG_LEVEL=debug
```

### Step 4: Verify Frontend Setup

```bash
# From frontend directory
npm start

# Expected output:
# Compiled successfully!
# 
# You can now view smart-assistant in the browser.
# 
#   Local:            http://localhost:3000
#   On Your Network:  http://192.168.x.x:3000
```

The browser should automatically open to `http://localhost:3000`

---

## Running Both Simultaneously

### Method 1: Using VS Code Integrated Terminal (Recommended)

#### Step 1: Open Two Terminals in VS Code

1. Open VS Code
2. Press `Ctrl + `` (backtick) to open terminal
3. Press `Ctrl + Shift + `` to open a second terminal

#### Step 2: Start Backend in Terminal 1

```bash
# Terminal 1
cd backend
npm start

# You should see:
# ✅ Server running on port 5000
```

#### Step 3: Start Frontend in Terminal 2

```bash
# Terminal 2
cd frontend
npm start

# You should see:
# Compiled successfully!
# Local: http://localhost:3000
```

#### Step 4: View Both Terminals

- Click on "Terminal 1" tab to see backend logs
- Click on "Terminal 2" tab to see frontend logs
- Both will run simultaneously

### Method 2: Using Separate Terminal Windows

#### Terminal 1 - Backend
```bash
cd smart-assistant-senior-citizens/backend
npm start
```

#### Terminal 2 - Frontend
```bash
cd smart-assistant-senior-citizens/frontend
npm start
```

### Method 3: Using npm-run-all (Advanced)

Install globally:
```bash
npm install -g npm-run-all
```

From project root:
```bash
npm-run-all --parallel "npm:start:backend" "npm:start:frontend"
```

---

## Testing the Application

### Step 1: Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

You should see the **Smart Assistant** login page with the green header.

### Step 2: Test User Registration

1. Click "Sign Up" button
2. Select role: **Elder**
3. Fill in the form:
   - Full Name: John Doe
   - Email: john@example.com
   - Phone: +1234567890
   - Password: Test@1234
   - Date of Birth: 01/01/1960
   - Address: 123 Main St
   - National ID: 12345678
4. Click "Next"
5. Fill in Elder-specific fields:
   - Lives Alone: Yes
   - Medical Conditions: Diabetes, Hypertension
   - Has Medical Issues: Yes
   - Location Permission: Yes
6. Click "Sign Up"

**Expected Result:**
- Account created successfully
- Redirected to OTP verification page
- Check backend logs for OTP (printed to console)

### Step 3: Test OTP Verification

1. Check backend terminal for OTP (e.g., `OTP for john@example.com: 123456`)
2. Enter OTP in the verification form
3. Click "Verify"

**Expected Result:**
- Email verified successfully
- Redirected to login page

### Step 4: Test User Login

1. Enter email: `john@example.com`
2. Enter password: `Test@1234`
3. Click "Login"

**Expected Result:**
- Login successful
- Redirected to Elder Dashboard
- User information displayed

### Step 5: Test API Endpoints with Postman/Thunder Client

#### Using Thunder Client (Built into VS Code)

1. Open Thunder Client extension in VS Code
2. Create a new request

**Test Health Endpoint:**
```
GET http://localhost:5000/health
```

**Test Signup Endpoint:**
```
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "password": "Test@1234",
  "role": "caregiver",
  "dateOfBirth": "1980-01-01",
  "address": "456 Oak St",
  "nationalId": "87654321",
  "relationshipToElder": "Daughter",
  "notificationsEnabled": true
}
```

**Test Login Endpoint:**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Test@1234"
}
```

**Test Protected Route (Get Profile):**
```
GET http://localhost:5000/api/users/profile
Authorization: Bearer <your_jwt_token_here>
```

---

## Monitoring & Debugging

### Backend Logs

The backend logs all requests and responses. Check the terminal for:
- Request method and URL
- Response status
- Error messages
- Database operations

### Frontend Logs

Open browser DevTools:
- Press `F12` or `Ctrl + Shift + I`
- Go to "Console" tab
- Check for errors and warnings
- Network tab shows API calls

### Common Issues

**Backend won't start:**
```bash
# Check if port 5000 is in use
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process using port 5000
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

**Frontend won't start:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**MongoDB connection error:**
- Verify connection string in `.env`
- Check IP whitelist in MongoDB Atlas
- Ensure database user credentials are correct
- Check internet connection

---

## Project Structure

```
smart-assistant-senior-citizens/
├── backend/
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Express middleware
│   ├── config/           # Configuration files
│   ├── .env              # Environment variables
│   ├── server.js         # Main server file
│   └── package.json
│
├── frontend/
│   ├── public/           # Static files
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React context
│   │   ├── services/     # API services
│   │   ├── App.js        # Main app component
│   │   └── index.js      # Entry point
│   ├── .env              # Environment variables
│   └── package.json
│
├── README.md
├── SETUP_GUIDE.md        # This file
└── DEPLOYMENT.md
```

---

## Development Workflow

### 1. Start Both Servers
```bash
# Terminal 1: Backend
cd backend && npm start

# Terminal 2: Frontend
cd frontend && npm start
```

### 2. Make Changes
- Edit backend files → Server auto-restarts
- Edit frontend files → Browser auto-refreshes

### 3. Test Changes
- Use browser DevTools for frontend debugging
- Check backend terminal for API logs
- Use Postman/Thunder Client for API testing

### 4. Commit Changes
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

---

## Useful Commands

### Backend Commands
```bash
cd backend

npm start              # Start development server
npm test              # Run tests
npm run build         # Build for production
npm run dev           # Start with nodemon (auto-restart)
```

### Frontend Commands
```bash
cd frontend

npm start             # Start development server
npm test             # Run tests
npm run build        # Build for production
npm run eject        # Eject from Create React App (irreversible)
```

### Git Commands
```bash
git status           # Check status
git add .            # Stage all changes
git commit -m "msg"  # Commit changes
git push origin main # Push to GitHub
git pull origin main # Pull latest changes
```

---

## Next Steps

1. ✅ Set up backend and frontend
2. ✅ Run both simultaneously
3. ✅ Test user registration and login
4. ✅ Test API endpoints
5. 📝 Develop additional features
6. 🧪 Write tests
7. 🚀 Deploy to production

---

## Support & Resources

- **Backend Documentation**: See `API_DOCUMENTATION.md`
- **Deployment Guide**: See `DEPLOYMENT.md`
- **Project README**: See `README.md`
- **GitHub Repository**: https://github.com/naveediqbal4765/smart-assistant-senior-citizens

---

**Last Updated**: April 5, 2026  
**Version**: 1.0.0  
**Status**: ✅ Ready for Development
