# Frontend Testing Guide - Smart Assistant

Complete guide for testing the backend using the React frontend UI.

---

## 🚀 SETUP BEFORE TESTING

### **Step 1: Ensure Backend is Running**
```bash
cd backend
npm run dev
```

Expected output:
```
✅ MongoDB Connected: ac-zscqtyc-shard-00-01.sagytb2.mongodb.net
📦 Database: smartassistant
✅ Connected to correct database: smartassistant
```

### **Step 2: Start Frontend**
```bash
cd frontend
npm start
```

Expected output:
```
Compiled successfully!
You can now view smart-assistant in the browser.
Local: http://localhost:3000
```

### **Step 3: Open Browser**
Navigate to: **http://localhost:3000**

---

## 🧪 TEST SCENARIOS

### **TEST 1: User Signup (Email/Password)**

#### Steps:
1. Click **"Sign Up"** button on login page
2. Fill in the signup form:
   - **Full Name**: John Doe
   - **Email**: john@example.com
   - **Password**: Password123!
   - **Confirm Password**: Password123!
   - **Role**: Select "Elder" (or Caregiver/Volunteer)
3. Click **"Sign Up"** button

#### Expected Results:
- ✅ Form validates input
- ✅ Success message appears
- ✅ Redirected to dashboard or role selection page
- ✅ Welcome email sent (check email inbox)
- ✅ User created in MongoDB Atlas

#### Verify in MongoDB Atlas:
1. Go to https://cloud.mongodb.com/
2. Click **smartassistantforseniorcitizens** cluster
3. Click **Browse Collections**
4. Navigate to **smartassistant** → **users**
5. You should see the new user with:
   - email: john@example.com
   - fullName: John Doe
   - role: elder
   - isVerified: true

---

### **TEST 2: User Login (Email/Password)**

#### Steps:
1. Go to login page (http://localhost:3000/login)
2. Fill in login form:
   - **Email**: john@example.com
   - **Password**: Password123!
3. Check **"Remember Me"** (optional)
4. Click **"Login"** button

#### Expected Results:
- ✅ Form validates input
- ✅ Success message appears
- ✅ Redirected to dashboard
- ✅ User profile displayed
- ✅ JWT tokens stored in localStorage

#### Verify in Browser:
1. Open **Developer Tools** (F12)
2. Go to **Application** → **Local Storage**
3. You should see:
   - `accessToken`: JWT token
   - `refreshToken`: Refresh token
   - `rememberMeToken`: (if Remember Me was checked)

---

### **TEST 3: Password Reset Flow**

#### Step 1: Request Password Reset
1. Go to login page
2. Click **"Forgot Password?"** link
3. Enter email: **john@example.com**
4. Click **"Send OTP"** button

#### Expected Results:
- ✅ Success message: "OTP sent to your email"
- ✅ Redirected to OTP verification page
- ✅ OTP email received in inbox

#### Step 2: Verify OTP
1. Check email for OTP code (6 digits)
2. Enter OTP in the form
3. Click **"Verify OTP"** button

#### Expected Results:
- ✅ OTP validated
- ✅ Success message appears
- ✅ Redirected to password reset page
- ✅ 5-minute countdown timer visible

#### Step 3: Reset Password
1. Enter new password: **NewPassword123!**
2. Confirm password: **NewPassword123!**
3. Password strength indicator shows "Strong"
4. Click **"Reset Password"** button

#### Expected Results:
- ✅ Password updated successfully
- ✅ Success message appears
- ✅ Redirected to login page
- ✅ Password changed confirmation email received

#### Step 4: Login with New Password
1. Enter email: **john@example.com**
2. Enter password: **NewPassword123!**
3. Click **"Login"** button

#### Expected Results:
- ✅ Login successful with new password
- ✅ Redirected to dashboard

---

### **TEST 4: Google OAuth Login**

#### Steps:
1. Go to login page
2. Click **"Sign in with Google"** button
3. Google login popup appears
4. Enter your Google account credentials
5. Grant permissions if prompted

#### Expected Results:
- ✅ Google popup opens
- ✅ Login successful
- ✅ Redirected to dashboard or role selection
- ✅ User profile populated from Google
- ✅ Profile picture from Google displayed
- ✅ Welcome email sent

#### Verify in MongoDB Atlas:
1. Check **users** collection
2. New user should have:
   - googleId: (Google ID)
   - authProvider: "google"
   - profilePicture: (Google profile picture URL)
   - isVerified: true

---

### **TEST 5: Facebook OAuth Login**

#### Steps:
1. Go to login page
2. Click **"Sign in with Facebook"** button
3. Facebook login popup appears
4. Enter your Facebook account credentials
5. Grant permissions if prompted

#### Expected Results:
- ✅ Facebook popup opens
- ✅ Login successful
- ✅ Redirected to dashboard or role selection
- ✅ User profile populated from Facebook
- ✅ Profile picture from Facebook displayed
- ✅ Welcome email sent

#### Verify in MongoDB Atlas:
1. Check **users** collection
2. New user should have:
   - facebookId: (Facebook ID)
   - authProvider: "facebook"
   - profilePicture: (Facebook profile picture URL)
   - isVerified: true

---

### **TEST 6: Rate Limiting**

#### Test Login Rate Limiting:
1. Go to login page
2. Try logging in with wrong password 6 times
3. On the 6th attempt, you should get an error

#### Expected Results:
- ✅ First 5 attempts: "Invalid credentials" error
- ✅ 6th attempt: "Too many login attempts. Please try again after 15 minutes" error
- ✅ Status code: 429 (Too Many Requests)

#### Test Signup Rate Limiting:
1. Try signing up 4 times with different emails
2. On the 4th attempt, you should get an error

#### Expected Results:
- ✅ First 3 attempts: Successful signup
- ✅ 4th attempt: "Too many signup attempts. Please try again after 1 hour" error
- ✅ Status code: 429 (Too Many Requests)

---

### **TEST 7: CORS Protection**

#### Steps:
1. Open **Developer Tools** (F12)
2. Go to **Network** tab
3. Perform any action (login, signup, etc.)
4. Check the response headers

#### Expected Results:
- ✅ Response headers include:
  - `Access-Control-Allow-Origin: http://localhost:3000`
  - `Access-Control-Allow-Credentials: true`
  - `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS`

#### Verify Security Headers:
1. In Network tab, click on any request
2. Go to **Response Headers**
3. You should see:
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `X-XSS-Protection: 1; mode=block`
  - `Content-Security-Policy: ...`

---

### **TEST 8: Remember Me Functionality**

#### Steps:
1. Go to login page
2. Enter credentials:
   - Email: john@example.com
   - Password: NewPassword123!
3. Check **"Remember Me"** checkbox
4. Click **"Login"** button
5. Close browser completely
6. Reopen browser and go to http://localhost:3000

#### Expected Results:
- ✅ User is still logged in (no need to login again)
- ✅ Dashboard loads automatically
- ✅ User profile is displayed
- ✅ rememberMeToken stored in localStorage

---

### **TEST 9: Logout**

#### Steps:
1. Login to the application
2. Click on **Profile** or **Settings** menu
3. Click **"Logout"** button

#### Expected Results:
- ✅ User logged out
- ✅ Redirected to login page
- ✅ localStorage cleared (tokens removed)
- ✅ Cannot access dashboard without logging in again

---

### **TEST 10: Email Verification**

#### Steps:
1. Sign up with a new email
2. Check email inbox for welcome email

#### Expected Results:
- ✅ Welcome email received
- ✅ Email contains:
  - Personalized greeting
  - Role-specific features
  - Next steps
  - Support contact information
- ✅ Professional HTML formatting
- ✅ Green color scheme

#### For Password Reset:
1. Request password reset
2. Check email for OTP email

#### Expected Results:
- ✅ OTP email received
- ✅ Email contains:
  - 6-digit OTP code
  - 5-minute expiry notice
  - Security notice
  - Professional formatting

---

## 📋 COMPLETE TEST CHECKLIST

```
✅ Signup (Email/Password)
  ✅ Form validation works
  ✅ User created in database
  ✅ Welcome email sent
  ✅ Redirected to dashboard

✅ Login (Email/Password)
  ✅ Form validation works
  ✅ Correct credentials accepted
  ✅ Wrong credentials rejected
  ✅ Tokens stored in localStorage
  ✅ Redirected to dashboard

✅ Password Reset
  ✅ Forgot password page works
  ✅ OTP sent to email
  ✅ OTP verification works
  ✅ Password reset works
  ✅ Confirmation email sent
  ✅ New password works for login

✅ Google OAuth
  ✅ Google button visible
  ✅ Google popup opens
  ✅ Login successful
  ✅ User created in database
  ✅ Profile picture from Google
  ✅ Welcome email sent

✅ Facebook OAuth
  ✅ Facebook button visible
  ✅ Facebook popup opens
  ✅ Login successful
  ✅ User created in database
  ✅ Profile picture from Facebook
  ✅ Welcome email sent

✅ Rate Limiting
  ✅ Login rate limiting works
  ✅ Signup rate limiting works
  ✅ Error message displayed
  ✅ Correct status code (429)

✅ CORS Protection
  ✅ CORS headers present
  ✅ Security headers present
  ✅ Requests from localhost:3000 allowed
  ✅ Requests from other origins blocked

✅ Remember Me
  ✅ Checkbox visible
  ✅ Token stored in localStorage
  ✅ User stays logged in after browser close
  ✅ Can logout to clear token

✅ Logout
  ✅ Logout button visible
  ✅ User logged out
  ✅ Redirected to login page
  ✅ localStorage cleared

✅ Email Service
  ✅ Welcome emails sent
  ✅ OTP emails sent
  ✅ Confirmation emails sent
  ✅ Professional formatting
  ✅ Correct content
```

---

## 🐛 TROUBLESHOOTING

### **Issue: "Cannot connect to backend"**
- ✅ Ensure backend is running on port 5000
- ✅ Check if MongoDB is connected
- ✅ Check browser console for CORS errors
- ✅ Verify CORS_ORIGIN in .env is http://localhost:3000

### **Issue: "Emails not received"**
- ✅ Check spam/junk folder
- ✅ Verify EMAIL_USER and EMAIL_PASSWORD in .env
- ✅ Check backend console for email errors
- ✅ Ensure Gmail 2FA is enabled and app password is set

### **Issue: "Rate limiting not working"**
- ✅ Clear browser cache and localStorage
- ✅ Wait 15 minutes for rate limit to reset
- ✅ Check backend console for rate limiting logs
- ✅ Verify rate limiter middleware is enabled

### **Issue: "Wrong database connection"**
- ✅ Check MongoDB connection logs
- ✅ Verify MONGODB_URI in .env
- ✅ Ensure dbName is set to 'smartassistant'
- ✅ Check MongoDB Atlas for active connections

### **Issue: "OAuth not working"**
- ✅ Verify GOOGLE_CLIENT_ID in .env
- ✅ Verify FACEBOOK_APP_ID in .env
- ✅ Check browser console for OAuth errors
- ✅ Ensure OAuth credentials are correct

---

## 📊 TESTING ENVIRONMENT

| Item | Value |
|------|-------|
| Frontend URL | http://localhost:3000 |
| Backend URL | http://localhost:5000 |
| API Base URL | http://localhost:5000/api |
| MongoDB Cluster | smartassistantforseniorcitizens |
| Database | smartassistant |
| Environment | development |

---

## 🎯 TESTING ORDER

1. **Signup (Email/Password)** - Create test user
2. **Login (Email/Password)** - Verify login works
3. **Password Reset** - Test complete reset flow
4. **Google OAuth** - Test Google login
5. **Facebook OAuth** - Test Facebook login
6. **Rate Limiting** - Test rate limiting
7. **CORS Protection** - Verify security headers
8. **Remember Me** - Test persistent login
9. **Logout** - Test logout functionality
10. **Email Service** - Verify all emails received

---

## 📞 SUPPORT

If you encounter any issues:

1. **Check backend logs** - Look for error messages
2. **Check browser console** - Look for JavaScript errors
3. **Check MongoDB Atlas** - Verify data is being created
4. **Check email inbox** - Verify emails are being sent
5. **Check network tab** - Verify API requests are successful

---

**Last Updated:** April 2025
**Version:** 1.0
**Status:** Ready for Testing ✅
