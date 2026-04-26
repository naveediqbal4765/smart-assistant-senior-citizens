# MODULE 1 TESTING EXECUTION - STEP BY STEP

**Testing Date:** April 26, 2026  
**Module:** 1 - User Authentication and Login  
**Status:** Starting Comprehensive Testing  

---

## PHASE 1: ENVIRONMENT SETUP & SERVER START

### Step 1.1: Verify Environment Variables

**Backend (.env file location: `/workspace/backend/.env`)**

Create or verify the file contains:
```
MONGO_URI=mongodb+srv://smartAssistant:EhecvOdyRjtMFgf9@cluster0.mongodb.net/smartAssistant
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
EMAIL_SERVICE=gmail
EMAIL_USER=smartassistantforseniorcitizen@gmail.com
EMAIL_PASSWORD=your_app_password_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
CORS_ORIGIN=http://localhost:3000
```

**Frontend (.env.local file location: `/workspace/frontend/.env.local`)**

Create or verify the file contains:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_FACEBOOK_APP_ID=your_facebook_app_id
```

### Step 1.2: Start Backend Server

**Terminal 1 - Backend:**
```bash
cd /workspace/backend
npm install  # (if not already done)
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

**Verification:**
```bash
# In another terminal, test the health endpoint
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

✅ **Backend Status:** RUNNING

---

### Step 1.3: Start Frontend Server

**Terminal 2 - Frontend:**
```bash
cd /workspace/frontend
npm install  # (if not already done)
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view smart-assistant in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000

Note that the development build is not optimized.
To create a production build, use npm run build.
```

✅ **Frontend Status:** RUNNING

---

### Step 1.4: Open Browser

Navigate to: **http://localhost:3000**

**Expected Result:**
- ✅ Login page loads
- ✅ No CORS errors in console
- ✅ All UI elements visible
- ✅ No JavaScript errors

---

## PHASE 2: BASIC CONNECTIVITY TESTS

### Test 2.1: Verify Frontend-Backend Connection

**Steps:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Refresh the page (F5)
4. Look for API calls

**Expected:**
- ✅ No 404 errors
- ✅ No CORS errors
- ✅ Page loads successfully

**Check Console:**
- ✅ No red errors
- ✅ No warnings about API connection

---

### Test 2.2: Verify Login Page Elements

**Steps:**
1. Look at the login page
2. Verify all elements are present and visible

**Checklist:**
- ✅ Email input field
- ✅ Password input field
- ✅ Login button
- ✅ Signup button
- ✅ Remember me checkbox
- ✅ Reset password link
- ✅ Google OAuth button
- ✅ Facebook OAuth button
- ✅ Responsive design (test on mobile view)

**Result:** ✅ PASS / ❌ FAIL

---

## PHASE 3: AUTHENTICATION TESTS

### Test 3.1: Invalid Login Attempt

**Steps:**
1. Enter email: `test@invalid.com`
2. Enter password: `wrongpassword123`
3. Click Login button
4. Open DevTools → Network tab
5. Look for POST request to `/api/auth/login`

**Expected:**
- ✅ API call made to `POST /api/auth/login`
- ✅ Response status: 401 or 400
- ✅ Error message displays: "Invalid email or password"
- ✅ User NOT logged in
- ✅ Still on login page

**Network Request Body:**
```json
{
  "email": "test@invalid.com",
  "password": "wrongpassword123",
  "rememberMe": false
}
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**Result:** ✅ PASS / ❌ FAIL

---

### Test 3.2: New User Signup - Elder Role

**Steps:**
1. Click "Signup" button
2. Select "Elder" role
3. Fill in all fields:

| Field | Value |
|-------|-------|
| Profile Picture | Upload any image |
| Username | testuser_elder |
| Email | testuser.elder@example.com |
| Phone | +923001234567 |
| Address | Islamabad, Pakistan |
| Date of Birth | 01/01/1960 |
| Password | Test@123456 |
| Confirm Password | Test@123456 |
| CNIC | 1234567890123 |

4. Answer Elder-specific questions:
   - Lives Alone: **Yes**
   - Medical Issues: **Yes** → Select "Diabetes"
   - Location Permission: **Yes** → Allow location

5. Click Signup button
6. Open DevTools → Network tab
7. Look for POST request to `/api/auth/signup`

**Expected:**
- ✅ API call made to `POST /api/auth/signup`
- ✅ Response status: 201 (Created)
- ✅ User created in database
- ✅ Redirect to login page
- ✅ Success message displays

**Network Request Body:**
```json
{
  "fullName": "testuser_elder",
  "email": "testuser.elder@example.com",
  "phone": "+923001234567",
  "password": "Test@123456",
  "role": "elder",
  "cnic": "1234567890123",
  "livesAlone": true,
  "medicalConditions": ["Diabetes"],
  "locationPermission": true,
  ...
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": "...",
    "email": "testuser.elder@example.com",
    "role": "elder"
  }
}
```

**Database Verification:**
- ✅ User created in `users` collection
- ✅ Elder profile created in `elders` collection
- ✅ Senior ID assigned
- ✅ Pairing code generated

**Result:** ✅ PASS / ❌ FAIL

---

### Test 3.3: Valid Login - Elder User

**Steps:**
1. On login page, enter credentials:
   - Email: `testuser.elder@example.com`
   - Password: `Test@123456`
2. Uncheck "Remember Me" (for now)
3. Click Login button
4. Open DevTools → Network tab
5. Look for POST request to `/api/auth/login`

**Expected:**
- ✅ API call made to `POST /api/auth/login`
- ✅ Response status: 200 (OK)
- ✅ Response contains JWT tokens
- ✅ Tokens stored in localStorage
- ✅ Redirect to dashboard
- ✅ User info displayed

**Network Request Body:**
```json
{
  "email": "testuser.elder@example.com",
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
    "rememberMeToken": null,
    "expiresIn": "15m",
    "user": {
      "userId": "...",
      "email": "testuser.elder@example.com",
      "fullName": "testuser_elder",
      "role": "elder",
      "profilePicture": "..."
    }
  }
}
```

**Verify Tokens in localStorage:**
```javascript
// Open DevTools Console and run:
localStorage.getItem('accessToken')  // Should return JWT token
localStorage.getItem('refreshToken')  // Should return refresh token
```

**Dashboard Verification:**
- ✅ Redirected to `/dashboard/elder`
- ✅ User name displayed
- ✅ Dashboard loads correctly
- ✅ Navigation works

**Result:** ✅ PASS / ❌ FAIL

---

### Test 3.4: Remember Me Functionality

**Steps:**
1. Logout (if still logged in)
2. On login page, check "Remember Me" checkbox
3. Enter credentials:
   - Email: `testuser.elder@example.com`
   - Password: `Test@123456`
4. Click Login button
5. Verify redirect to dashboard
6. Open DevTools → Application → LocalStorage
7. Verify `rememberMeToken` is stored
8. Close browser completely
9. Reopen browser and navigate to http://localhost:3000
10. Verify auto-login to dashboard

**Expected:**
- ✅ Remember me token stored in localStorage
- ✅ Auto-login works on app reload
- ✅ User stays logged in
- ✅ Dashboard loads automatically
- ✅ No need to enter credentials again

**Verify in localStorage:**
```javascript
localStorage.getItem('rememberMeToken')  // Should return token
localStorage.getItem('accessToken')  // Should return JWT
```

**Result:** ✅ PASS / ❌ FAIL

---

### Test 3.5: Password Reset Flow

**Steps:**
1. On login page, click "Reset Password" link
2. Enter email: `testuser.elder@example.com`
3. Click "Send OTP" button
4. Check email for OTP (or check backend logs)
5. Enter OTP in form
6. Click "Verify OTP" button
7. Enter new password: `NewPass@123456`
8. Confirm password: `NewPass@123456`
9. Click "Reset Password" button
10. Verify redirect to login page
11. Login with new password

**Expected:**
- ✅ API call to `POST /api/auth/password-reset/request`
- ✅ OTP sent to email
- ✅ API call to `POST /api/auth/password-reset/verify-otp`
- ✅ API call to `POST /api/auth/password-reset/reset`
- ✅ Password updated in database
- ✅ Can login with new password
- ✅ Cannot login with old password

**Network Requests:**
```
1. POST /api/auth/password-reset/request
   Body: { "email": "testuser.elder@example.com" }
   Response: { "success": true, "message": "OTP sent" }

2. POST /api/auth/password-reset/verify-otp
   Body: { "email": "testuser.elder@example.com", "otp": "123456" }
   Response: { "success": true, "verificationToken": "..." }

3. POST /api/auth/password-reset/reset
   Body: { "email": "testuser.elder@example.com", "verificationToken": "...", "newPassword": "NewPass@123456" }
   Response: { "success": true, "message": "Password reset successful" }
```

**Result:** ✅ PASS / ❌ FAIL

---

### Test 3.6: Logout Functionality

**Steps:**
1. Login with valid credentials
2. Verify you're on dashboard
3. Click logout button
4. Verify redirect to login page
5. Try to access dashboard directly (http://localhost:3000/dashboard/elder)
6. Verify redirect back to login page

**Expected:**
- ✅ All tokens cleared from localStorage
- ✅ Redirect to login page
- ✅ Cannot access protected routes
- ✅ Must login again to access dashboard

**Verify localStorage cleared:**
```javascript
localStorage.getItem('accessToken')  // Should return null
localStorage.getItem('refreshToken')  // Should return null
localStorage.getItem('rememberMeToken')  // Should return null
```

**Result:** ✅ PASS / ❌ FAIL

---

## PHASE 4: OAUTH TESTS

### Test 4.1: Google OAuth Login

**Prerequisites:**
- Google OAuth credentials configured
- REACT_APP_GOOGLE_CLIENT_ID set in .env.local

**Steps:**
1. On login page, click "Sign in with Google" button
2. Google popup opens
3. Select your Google account
4. Authorize the app
5. Verify redirect to dashboard

**Expected:**
- ✅ Google popup opens
- ✅ API call to `POST /api/auth/google`
- ✅ User created or logged in
- ✅ Redirect to dashboard
- ✅ User info displayed

**Network Request:**
```json
{
  "token": "google_id_token",
  "rememberMe": false
}
```

**Result:** ✅ PASS / ❌ FAIL

---

### Test 4.2: Facebook OAuth Login

**Prerequisites:**
- Facebook OAuth credentials configured
- REACT_APP_FACEBOOK_APP_ID set in .env.local

**Steps:**
1. On login page, click "Sign in with Facebook" button
2. Facebook popup opens
3. Select your Facebook account
4. Authorize the app
5. Verify redirect to dashboard

**Expected:**
- ✅ Facebook popup opens
- ✅ API call to `POST /api/auth/facebook`
- ✅ User created or logged in
- ✅ Redirect to dashboard
- ✅ User info displayed

**Network Request:**
```json
{
  "token": "facebook_access_token",
  "rememberMe": false
}
```

**Result:** ✅ PASS / ❌ FAIL

---

## PHASE 5: ROLE-BASED SIGNUP TESTS

### Test 5.1: Caregiver Signup with Pairing Code

**Prerequisites:**
- Elder account created (from Test 3.2)
- Pairing code generated from Elder dashboard

**Steps:**
1. Logout if logged in
2. Click Signup → Select "Caregiver"
3. Fill basic info:
   - Username: testuser_caregiver
   - Email: testuser.caregiver@example.com
   - Phone: +923009876543
   - Password: Test@123456
   - CNIC: 9876543210123

4. Fill caregiver-specific info:
   - Relationship: Son
   - Senior's Email: testuser.elder@example.com
   - Pairing Code: (from Elder dashboard)

5. Click Signup button
6. Verify redirect to login page

**Expected:**
- ✅ API call to `POST /api/auth/signup`
- ✅ Pairing code verified
- ✅ Link created between Elder and Caregiver
- ✅ Caregiver profile created
- ✅ RBAC permissions set

**Result:** ✅ PASS / ❌ FAIL

---

### Test 5.2: Volunteer Signup with Schedule

**Steps:**
1. Click Signup → Select "Volunteer"
2. Fill basic info:
   - Username: testuser_volunteer
   - Email: testuser.volunteer@example.com
   - Phone: +923005555555
   - Password: Test@123456
   - CNIC: 5555555555555

3. Fill volunteer-specific info:
   - Days: Monday, Wednesday, Friday
   - Time Slots: Morning, Afternoon
   - NGO: Edhi
   - Service Radius: 5 km
   - Skills: Medical, Errands

4. Click Signup button
5. Verify redirect to login page

**Expected:**
- ✅ API call to `POST /api/auth/signup`
- ✅ Schedule stored in database
- ✅ Volunteer profile created
- ✅ Skills stored
- ✅ Service radius stored

**Result:** ✅ PASS / ❌ FAIL

---

## PHASE 6: TOKEN REFRESH TEST

### Test 6.1: Automatic Token Refresh

**Steps:**
1. Login successfully
2. Open DevTools → Application → LocalStorage
3. Note the accessToken
4. Wait for token to expire (or manually trigger refresh)
5. Make an API call (e.g., navigate to a protected page)
6. Verify new token generated

**Expected:**
- ✅ API call to `POST /api/auth/refresh-token`
- ✅ New access token generated
- ✅ Old token invalidated
- ✅ API call succeeds with new token
- ✅ No re-login required

**Result:** ✅ PASS / ❌ FAIL

---

## PHASE 7: ERROR HANDLING TESTS

### Test 7.1: Network Error Handling

**Steps:**
1. Disable network (DevTools → Network → Offline)
2. Try to login
3. Verify error message displays
4. Enable network
5. Try again

**Expected:**
- ✅ Clear error message
- ✅ User can retry
- ✅ No hanging requests

**Result:** ✅ PASS / ❌ FAIL

---

### Test 7.2: Invalid Email Format

**Steps:**
1. Enter email: `invalidemail`
2. Enter password: `Test@123456`
3. Click Login button

**Expected:**
- ✅ Form validation error
- ✅ Email field highlighted
- ✅ Error message: "Invalid email format"
- ✅ Login button disabled or shows error

**Result:** ✅ PASS / ❌ FAIL

---

### Test 7.3: Weak Password Validation

**Steps:**
1. On signup page, enter password: `weak`
2. Verify password strength indicator

**Expected:**
- ✅ Password strength shown as "Weak"
- ✅ Requirements displayed
- ✅ Signup button disabled
- ✅ Error message: "Password must be at least 8 characters..."

**Result:** ✅ PASS / ❌ FAIL

---

## TEST RESULTS SUMMARY

| Test # | Test Name | Status | Notes |
|--------|-----------|--------|-------|
| 2.1 | Frontend-Backend Connection | ✅ PASS / ❌ FAIL | |
| 2.2 | Login Page Elements | ✅ PASS / ❌ FAIL | |
| 3.1 | Invalid Login | ✅ PASS / ❌ FAIL | |
| 3.2 | New User Signup (Elder) | ✅ PASS / ❌ FAIL | |
| 3.3 | Valid Login | ✅ PASS / ❌ FAIL | |
| 3.4 | Remember Me | ✅ PASS / ❌ FAIL | |
| 3.5 | Password Reset | ✅ PASS / ❌ FAIL | |
| 3.6 | Logout | ✅ PASS / ❌ FAIL | |
| 4.1 | Google OAuth | ✅ PASS / ❌ FAIL | |
| 4.2 | Facebook OAuth | ✅ PASS / ❌ FAIL | |
| 5.1 | Caregiver Signup | ✅ PASS / ❌ FAIL | |
| 5.2 | Volunteer Signup | ✅ PASS / ❌ FAIL | |
| 6.1 | Token Refresh | ✅ PASS / ❌ FAIL | |
| 7.1 | Network Error | ✅ PASS / ❌ FAIL | |
| 7.2 | Invalid Email | ✅ PASS / ❌ FAIL | |
| 7.3 | Weak Password | ✅ PASS / ❌ FAIL | |

---

## OVERALL RESULT

**Total Tests:** 16  
**Passed:** ___  
**Failed:** ___  
**Success Rate:** ___%  

**Status:** ✅ ALL PASS / ⚠️ SOME FAILURES / ❌ CRITICAL FAILURES

---

## Issues Found

1. ___________
2. ___________
3. ___________

---

## Notes & Observations

___________

---

## Sign-Off

**Tested By:** ___________  
**Date:** ___________  
**Time Spent:** ___________  

**Recommendation:**
- ✅ Ready for Phase 2
- ⚠️ Fix issues and re-test
- ❌ Critical issues - do not proceed

---

**Next Steps:**
1. Document all test results
2. Fix any issues found
3. Re-run failed tests
4. Once all tests pass, proceed to Phase 2

