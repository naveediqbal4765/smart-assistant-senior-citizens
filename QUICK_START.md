# ⚡ Quick Start Guide - 5 Minutes Setup

## 🚀 TL;DR - Get Running in 5 Minutes

### Prerequisites (Install First)
- Node.js v14+ - https://nodejs.org/
- Git - https://git-scm.com/
- VS Code - https://code.visualstudio.com/

### Step 1: Clone & Navigate (1 minute)
```bash
git clone https://github.com/naveediqbal4765/smart-assistant-senior-citizens.git
cd smart-assistant-senior-citizens
code .
```

### Step 2: Backend Setup (2 minutes)

**Terminal 1:**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
npm start
```

**Expected Output:**
```
✅ Server running on port 5000
```

### Step 3: Frontend Setup (2 minutes)

**Terminal 2:**
```bash
cd frontend
npm install
cp .env.example .env
npm start
```

**Expected Output:**
```
Compiled successfully!
Local: http://localhost:3000
```

### Step 4: Test It! (1 minute)

1. Open browser: `http://localhost:3000`
2. Click "Sign Up"
3. Fill form and submit
4. Check backend terminal for OTP
5. Verify email with OTP
6. Login with credentials

---

## 📋 Detailed Setup Steps

### Pull from GitHub

```bash
# Clone the repository
git clone https://github.com/naveediqbal4765/smart-assistant-senior-citizens.git

# Navigate to project
cd smart-assistant-senior-citizens

# Open in VS Code
code .
```

### Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Edit `backend/.env`:**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smartassistant?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

**Start Backend:**
```bash
npm start
```

### Frontend Setup

```bash
# Navigate to frontend (in new terminal)
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Edit `frontend/.env`:**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

**Start Frontend:**
```bash
npm start
```

---

## 🧪 Testing

### Test Registration
1. Go to `http://localhost:3000`
2. Click "Sign Up"
3. Select role: **Elder**
4. Fill form:
   - Name: John Doe
   - Email: john@example.com
   - Phone: +1234567890
   - Password: Test@1234
   - DOB: 01/01/1960
   - Address: 123 Main St
   - National ID: 12345678
5. Click "Next" → Fill Elder fields → "Sign Up"
6. Check backend terminal for OTP
7. Enter OTP in verification form
8. Login with email/password

### Test API with Postman/Thunder Client

**Health Check:**
```
GET http://localhost:5000/health
```

**Signup:**
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

**Login:**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Test@1234"
}
```

---

## 🔧 MongoDB Setup (If Needed)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up with email
3. Create new project
4. Create M0 Free cluster
5. Create database user (username: smartassistant)
6. Get connection string
7. Add IP whitelist (Allow from Anywhere for dev)
8. Copy connection string to `.env`

---

## 📁 Project Structure

```
smart-assistant-senior-citizens/
├── backend/          # Node.js/Express API
│   ├── models/       # Database models
│   ├── routes/       # API endpoints
│   ├── middleware/   # Auth, error handling
│   ├── .env          # Environment variables
│   └── server.js     # Main server
│
├── frontend/         # React.js app
│   ├── src/
│   │   ├── pages/    # Login, Signup, Dashboard
│   │   ├── components/ # Reusable components
│   │   ├── services/ # API calls
│   │   └── context/  # Auth context
│   └── .env          # Environment variables
│
└── docs/             # Documentation
    ├── README.md
    ├── SETUP_GUIDE.md
    ├── DEPLOYMENT.md
    └── API_DOCUMENTATION.md
```

---

## 🚨 Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
lsof -i :5000

# Kill process
kill -9 <PID>

# Try again
npm start
```

### Frontend won't start
```bash
# Clear cache
npm cache clean --force

# Reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

### MongoDB connection error
- Check connection string in `.env`
- Verify IP whitelist in MongoDB Atlas
- Check database user credentials
- Ensure internet connection

### API calls failing
- Check backend is running on port 5000
- Verify `REACT_APP_API_URL` in frontend `.env`
- Check browser console for errors
- Check backend terminal for error logs

---

## 📚 Documentation

- **Full Setup Guide**: See `SETUP_GUIDE.md`
- **API Documentation**: See `API_DOCUMENTATION.md`
- **Deployment Guide**: See `DEPLOYMENT.md`
- **Project README**: See `README.md`

---

## 🎯 What's Included

✅ **Backend (Node.js/Express)**
- 23 API endpoints
- JWT authentication
- MongoDB database
- Error handling
- CORS configuration

✅ **Frontend (React.js)**
- Login page
- 3-step signup (Elder/Caregiver/Volunteer)
- OTP verification
- Password reset
- Dashboard placeholders
- Responsive design

✅ **Features**
- User authentication
- Role-based access
- Medical conditions as tags
- Emergency contacts
- Responsive header
- Error handling

---

## 🚀 Next Steps

1. ✅ Clone repository
2. ✅ Setup backend
3. ✅ Setup frontend
4. ✅ Test registration/login
5. 📝 Develop features
6. 🧪 Write tests
7. 🚀 Deploy

---

**Ready to start?** Follow the TL;DR section above! 🎉

**Questions?** Check `SETUP_GUIDE.md` for detailed instructions.

**Last Updated**: April 5, 2026
