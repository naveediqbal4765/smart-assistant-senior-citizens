# MODULE 1 TESTING GUIDE - Frontend & Backend Connection

**Status:** ✅ Frontend and Backend are Connected  
**Testing Date:** April 26, 2026  
**Module:** 1 - User Authentication and Login  

---

## Prerequisites

### 1. Environment Setup

**Backend (.env file)**
```
# Database
MONGO_URI=mongodb+srv://smartAssistant:EhecvOdyRjtMFgf9@cluster0.mongodb.net/smartAssistant

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Email Service
EMAIL_SERVICE=gmail
EMAIL_USER=smartassistantforseniorcitizen@gmail.com
EMAIL_PASSWORD=your_app_password_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Facebook OAuth
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# CORS
CORS_ORIGIN=http://localhost:3000
```

**Frontend (.env.local file)**
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_FACEBOOK_APP_ID=your_facebook_app_id
```

### 2. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 3. Database Setup

✅ Database already created in MongoDB Atlas
- **Database Name:** smartAssistant
- **Connection String:** mongodb+srv://smartAssistant:EhecvOdyRjtMFgf9@cluster0.mongodb.net/smartAssistant

---

## Testing Steps

### STEP 1: Start Backend Server

```bash
cd backend
npm start
```

**Expected Output:**
```
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 Smart Assistant Backend Server                      ║
║   ✅ Server running on port 5000                         ║
║   📋 Environment: development                            ║
║   🔗 API URL: http://localhost:5000/api                  ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

**Verify Backend is Running:**
```bash
curl http://localhost:5000/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-04-26T..."
}
```

---

### STEP 2: Start Frontend Server

**In a new terminal:**
```bash
cd frontend
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view smart-assistant in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

---

### STEP 3: Test Frontend-Backend Connection

**Open Browser DevTools (F12) → Network Tab**

Navigate to: `http://localhost:3000`

You should see:
- ✅ Login page loads
- ✅ No CORS errors
- ✅ API calls show in Network tab

---

## Test Cases

### TEST 1: Login Page Loads

**Steps:**
1. Open http://localhost:3000
2. Verify login page displays
3. Check all elements are visible:
   - Email field
   - Password field
   - Login button
   - Signup button
   - Remember me checkbox
   - Reset password link
   - Google OAuth button
   - Facebook OAuth button

**Expected Result:** ✅ All elements visible and responsive

---

### TEST 2: Email/Password Login - Invalid Credentials

**Steps:**
1. Enter email: `test@example.com`
2. Enter password: `wrongpassword`
3. Click Login button
4. Check Network tab for API call

**Expected Result:**
- ✅ API call to `POST /api/auth/login`
- ✅ Response status: 401 or 400
- ✅ Error message displays: "Invalid email or password"
- ✅ User not logged in

**Network Request:**
```
POST http://localhost:5000/api/auth/login
{
  "email": "test@example.com",
  "password": "wrongpassword",
  "rememberMe": false
}
```

---

### TEST 3: Email/Password Signup - New User

**Steps:**
1. Click "Signup" button
2. Select "Elder" role
3. Fill in all fields:
   - Profile picture: Upload an image
   - Username: testuser
   - Email: testuser@example.com
   - Phone: +923001234567
   - Address: Islamabad, Pakistan
   - Date of Birth: 01/01/1960
   - Password: Test@123456
   - Confirm Password: Test@123456
   - CNIC: 1234567890123
4. Click Signup button
5. Check Network tab

**Expected Result:**
- ✅ API call to `POST /api/auth/signup`
- ✅ Response status: 201
- ✅ User created in database
- ✅ Redirect to login page
- ✅ Success message displays

**Network Request:**
```
POST http://localhost:5000/api/auth/signup
{
  "fullName": "Test User",
  "email": "testuser@example.com",
  "phone": "+923001234567",
  "password": "Test@123456",
  "role": "elder",
  "cnic": "1234567890123",
  ...
}
```

---

### TEST 4: Email/Password Login - Valid Credentials

**Steps:**
1. Use credentials from TEST 3:
   - Email: testuser@example.com
   - Password: Test@123456
2. Click Login button
3. Check Network tab
4. Verify redirect to dashboard

**Expected Result:**
- ✅ API call to `POST /api/auth/login`
- ✅ Response status: 200
- ✅ Response contains JWT tokens
- ✅ Tokens stored in localStorage
- ✅ Redirect to dashboard
- ✅ User info displayed

**Network Request:**
```
POST http://localhost:5000/api/auth/login
{
  "email": "testuser@example.com",
  "password": "Test@123456",
  "rememberMe": false
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "user": {
      "userId": "...",
      "email": "testuser@example.com",
      "fullName": "Test User",
      "role": "elder"
    }
  }
}
```

---

### TEST 5: Remember Me Functionality

**Steps:**
1. On login page, check "Remember Me" checkbox
2. Enter valid credentials
3. Click Login button
4. Verify redirect to dashboard
5. Close browser completely
6. Reopen browser and navigate to http://localhost:3000
7. Verify auto-login to dashboard

**Expected Result:**
- ✅ Remember me token stored in localStorage
- ✅ Auto-login works on app reload
- ✅ User stays logged in
- ✅ Dashboard loads automatically

**Check localStorage:**
```javascript
// In browser console
localStorage.getItem('rememberMeToken')
// Should return a token
```

---

### TEST 6: Password Reset Flow

**Steps:**
1. On login page, click "Reset Password"
2. Enter email: testuser@example.com
3. Click "Send OTP"
4. Check email for OTP
5. Enter OTP in form
6. Click "Verify OTP"
7. Enter new password: NewPass@123456
8. Confirm password: NewPass@123456
9. Click "Reset Password"
10. Verify redirect to login page
11. Login with new password

**Expected Result:**
- ✅ API call to `POST /api/auth/password-reset/request`
- ✅ OTP sent to email
- ✅ API call to `POST /api/auth/password-reset/verify-otp`
- ✅ API call to `POST /api/auth/password-reset/reset`
- ✅ Password updated in database
- ✅ Can login with new password

---

### TEST 7: Google OAuth Login

**Steps:**
1. On login page, click "Sign in with Google" button
2. Google popup opens
3. Select Google account
4. Authorize app
5. Verify redirect to dashboard

**Expected Result:**
- ✅ Google popup opens
- ✅ API call to `POST /api/auth/google`
- ✅ User created or logged in
- ✅ Redirect to dashboard
- ✅ User info displayed

**Network Request:**
```
POST http://localhost:5000/api/auth/google
{
  "token": "google_id_token",
  "rememberMe": false
}
```

---

### TEST 8: Facebook OAuth Login

**Steps:**
1. On login page, click "Sign in with Facebook" button
2. Facebook popup opens
3. Select Facebook account
4. Authorize app
5. Verify redirect to dashboard

**Expected Result:**
- ✅ Facebook popup opens
- ✅ API call to `POST /api/auth/facebook`
- ✅ User created or logged in
- ✅ Redirect to dashboard
- ✅ User info displayed

**Network Request:**
```
POST http://localhost:5000/api/auth/facebook
{
  "token": "facebook_access_token",
  "rememberMe": false
}
```

---

### TEST 9: Elder Signup - Lives Alone

**Steps:**
1. Click Signup → Select Elder
2. Fill basic info
3. Question 1: "Lives Alone" → Select "Yes"
4. Verify no family contacts form appears
5. Continue with signup

**Expected Result:**
- ✅ Family contacts form hidden
- ✅ Boolean flag set in database
- ✅ "Priority Monitor" status triggered

---

### TEST 10: Elder Signup - Lives with Family

**Steps:**
1. Click Signup → Select Elder
2. Fill basic info
3. Question 1: "Lives Alone" → Select "No"
4. Verify family contacts form appears
5. Add 1-3 family contacts (Name, Phone, Relation)
6. Continue with signup

**Expected Result:**
- ✅ Family contacts form visible
- ✅ Can add 1-3 contacts
- ✅ Contacts stored in database
- ✅ Validation prevents 0 or 4+ contacts

---

### TEST 11: Elder Signup - Medical Issues

**Steps:**
1. Click Signup → Select Elder
2. Fill basic info
3. Question 2: "Medical Issues" → Select "Yes"
4. Verify dropdown appears
5. Select a condition (e.g., Diabetes)
6. Continue with signup

**Expected Result:**
- ✅ Dropdown visible
- ✅ Can select condition
- ✅ Condition stored in database

---

### TEST 12: Elder Signup - Location Permission

**Steps:**
1. Click Signup → Select Elder
2. Fill all info
3. Question 3: "Location Permission" → Click "Yes"
4. Verify browser location request appears
5. Allow location access
6. Complete signup

**Expected Result:**
- ✅ Browser location dialog appears
- ✅ Location coordinates captured
- ✅ Stored in database
- ✅ Signup completes

---

### TEST 13: Caregiver Signup - Pairing Code

**Steps:**
1. First, create an Elder account (from TEST 3)
2. Login as Elder
3. Go to dashboard → Find "Share Access" button
4. Click to generate pairing code
5. Copy the 6-digit code
6. Logout
7. Click Signup → Select Caregiver
8. Fill basic info
9. Enter Elder's email
10. Enter pairing code
11. Click Signup

**Expected Result:**
- ✅ Pairing code generated (6 digits)
- ✅ Caregiver can enter code
- ✅ Backend verifies code + email
- ✅ Link created between Elder and Caregiver
- ✅ Caregiver can see Elder's data

---

### TEST 14: Volunteer Signup - Schedule

**Steps:**
1. Click Signup → Select Volunteer
2. Fill basic info
3. Select days of week (e.g., Mon, Wed, Fri)
4. Select time slots (e.g., Morning, Afternoon)
5. Select NGO affiliation
6. Set service radius (e.g., 5km)
7. Select skills (e.g., Medical, Errands)
8. Complete signup

**Expected Result:**
- ✅ Days and time slots stored
- ✅ NGO affiliation stored
- ✅ Service radius stored
- ✅ Skills stored
- ✅ Volunteer profile created

---

### TEST 15: Token Refresh

**Steps:**
1. Login successfully
2. Open DevTools → Application → LocalStorage
3. Note the accessToken expiration
4. Wait for token to expire (or manually trigger refresh)
5. Make an API call
6. Verify new token generated

**Expected Result:**
- ✅ API call to `POST /api/auth/refresh-token`
- ✅ New access token generated
- ✅ Old token invalidated
- ✅ API call succeeds with new token

---

### TEST 16: Logout

**Steps:**
1. Login successfully
2. Click logout button
3. Verify redirect to login page
4. Try to access dashboard directly
5. Verify redirect to login page

**Expected Result:**
- ✅ All tokens cleared from localStorage
- ✅ Redirect to login page
- ✅ Cannot access protected routes
- ✅ Must login again

---

## Debugging Tips

### Check Backend Logs

```bash
# Terminal where backend is running
# Look for:
# - Database connection messages
# - Route registration messages
# - Request logs
# - Error messages
```

### Check Frontend Console

```javascript
// Browser DevTools Console
// Look for:
// - API call logs
// - Error messages
// - Token storage logs
// - Redux/Context state logs
```

### Check Network Tab

```
DevTools → Network Tab
- Filter by XHR/Fetch
- Check request headers
- Check response status
- Check response body
- Check timing
```

### Check Database

```bash
# MongoDB Atlas
# Go to Collections
# Check:
# - Users collection
# - Elder collection
# - Caregiver collection
# - Volunteer collection
# - Verify data is being stored
```

---

## Common Issues & Solutions

### Issue: CORS Error

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
1. Check backend CORS configuration in server.js
2. Verify CORS_ORIGIN in .env matches frontend URL
3. Restart backend server

```javascript
// In server.js
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true
}));
```

### Issue: API Not Found (404)

**Error:** `POST http://localhost:5000/api/auth/login 404`

**Solution:**
1. Verify backend is running on port 5000
2. Check routes are registered in server.js
3. Verify route file exists: `/backend/routes/auth.js`
4. Restart backend server

### Issue: Database Connection Error

**Error:** `MongooseError: Cannot connect to MongoDB`

**Solution:**
1. Verify MONGO_URI in .env is correct
2. Check MongoDB Atlas connection string
3. Verify IP whitelist in MongoDB Atlas
4. Test connection: `mongo "mongodb+srv://..."`

### Issue: JWT Token Error

**Error:** `JsonWebTokenError: invalid token`

**Solution:**
1. Verify JWT_SECRET in .env is set
2. Check token is being sent in Authorization header
3. Verify token hasn't expired
4. Clear localStorage and login again

### Issue: Email Not Sending

**Error:** `Error sending email`

**Solution:**
1. Verify EMAIL_USER and EMAIL_PASSWORD in .env
2. For Gmail: Use App Password (not regular password)
3. Enable "Less secure app access" if needed
4. Check email service configuration

---

## Test Results Template

```
Test Date: ___________
Tester: ___________
Environment: Development / Staging / Production

Test Results:
- TEST 1 (Login Page Loads): ✅ PASS / ❌ FAIL
- TEST 2 (Invalid Login): ✅ PASS / ❌ FAIL
- TEST 3 (Signup): ✅ PASS / ❌ FAIL
- TEST 4 (Valid Login): ✅ PASS / ❌ FAIL
- TEST 5 (Remember Me): ✅ PASS / ❌ FAIL
- TEST 6 (Password Reset): ✅ PASS / ❌ FAIL
- TEST 7 (Google OAuth): ✅ PASS / ❌ FAIL
- TEST 8 (Facebook OAuth): ✅ PASS / ❌ FAIL
- TEST 9 (Elder - Lives Alone): ✅ PASS / ❌ FAIL
- TEST 10 (Elder - Family): ✅ PASS / ❌ FAIL
- TEST 11 (Elder - Medical): ✅ PASS / ❌ FAIL
- TEST 12 (Elder - Location): ✅ PASS / ❌ FAIL
- TEST 13 (Caregiver - Pairing): ✅ PASS / ❌ FAIL
- TEST 14 (Volunteer - Schedule): ✅ PASS / ❌ FAIL
- TEST 15 (Token Refresh): ✅ PASS / ❌ FAIL
- TEST 16 (Logout): ✅ PASS / ❌ FAIL

Overall Result: ✅ ALL PASS / ❌ SOME FAILURES

Issues Found:
1. ___________
2. ___________
3. ___________

Notes:
___________
```

---

## Sign-Off

**Frontend-Backend Connection:** ✅ **VERIFIED**

**Ready for Testing:** ✅ **YES**

**Next Steps:**
1. Run all 16 test cases
2. Document results
3. Fix any issues found
4. Once all tests pass, proceed to Phase 2

---

**Happy Testing! 🚀**
