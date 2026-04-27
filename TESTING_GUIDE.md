# Testing Guide - Smart Assistant Backend

Complete testing guide for all implemented features.

---

## 🚀 SETUP BEFORE TESTING

### **Step 1: Install MongoDB Locally**
Follow the steps in `MONGODB_LOCAL_SETUP.md`

### **Step 2: Update Backend .env**
```bash
cd backend
# Edit .env file
MONGODB_URI=mongodb://localhost:27017/smart-assistant
MONGODB_USER=
MONGODB_PASSWORD=

# Email Configuration (Gmail)
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
```

### **Step 3: Install Dependencies**
```bash
cd backend
npm install
```

### **Step 4: Start Backend Server**
```bash
npm run dev
```

Expected output:
```
✅ MongoDB connected successfully
🚀 Smart Assistant Backend Server
✅ Server running on port 5000
🔒 Rate Limiting: ENABLED
🛡️  CORS Protection: ENABLED
🔐 Security Headers: ENABLED
```

---

## 🧪 TEST EMAIL SERVICE

### **Test Email Configuration**
```bash
npm run test:email
```

Expected output:
```
📧 Smart Assistant - Email Service Test
✅ EMAIL_SERVICE: gmail
✅ EMAIL_HOST: smtp.gmail.com
✅ EMAIL_PORT: 587
✅ EMAIL_USER: your-email@gmail.com
✅ EMAIL_PASSWORD: ****
✅ Email service is configured correctly!
✅ Test email sent successfully!
```

---

## 🔐 TEST AUTHENTICATION ENDPOINTS

### **1. Test Health Check**
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-04-27T..."
}
```

---

### **2. Test User Signup**

#### Request:
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "Password123!",
    "confirmPassword": "Password123!",
    "phone": "+1234567890",
    "role": "elder"
  }'
```

#### Expected Response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "elder",
      "profilePicture": null
    },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

#### Check Email:
- Look for welcome email in your inbox
- Verify email contains role-specific features

---

### **3. Test User Login**

#### Request:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123!",
    "rememberMe": true
  }'
```

#### Expected Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token",
    "rememberMeToken": "token",
    "user": {
      "userId": "user_id",
      "email": "john@example.com",
      "fullName": "John Doe",
      "role": "elder"
    }
  }
}
```

---

### **4. Test Password Reset Flow**

#### Step 1: Request Password Reset
```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Password reset OTP sent to your email. It will expire in 5 minutes.",
  "data": {
    "email": "john@example.com",
    "otpSent": true,
    "expiresIn": "5 minutes"
  }
}
```

Check email for OTP code.

#### Step 2: Verify OTP
```bash
curl -X POST http://localhost:5000/api/auth/verify-reset-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "otp": "123456"  # Replace with OTP from email
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "OTP verified successfully. You can now reset your password.",
  "data": {
    "resetToken": "reset_token",
    "verified": true
  }
}
```

#### Step 3: Reset Password
```bash
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "resetToken": "reset_token",
    "newPassword": "NewPassword123!",
    "confirmPassword": "NewPassword123!"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Password reset successfully. Please log in with your new password.",
  "data": {
    "passwordReset": true,
    "email": "john@example.com"
  }
}
```

Check email for password changed confirmation.

#### Step 4: Login with New Password
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "NewPassword123!"
  }'
```

Should succeed with new password.

---

## 🔒 TEST RATE LIMITING

### **Test Login Rate Limiting**

Make 6 login attempts within 15 minutes:

```bash
# Attempt 1-5: Should succeed
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"wrong"}'

# Attempt 6: Should be rate limited
# Expected response (429):
{
  "success": false,
  "message": "Too many login attempts. Please try again after 15 minutes.",
  "retryAfter": "timestamp"
}
```

### **Test Signup Rate Limiting**

Make 4 signup attempts within 1 hour:

```bash
# Attempt 1-3: Should succeed
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{...}'

# Attempt 4: Should be rate limited
# Expected response (429):
{
  "success": false,
  "message": "Too many signup attempts. Please try again after 1 hour.",
  "retryAfter": "timestamp"
}
```

---

## 🛡️ TEST CORS PROTECTION

### **Test CORS Headers**

```bash
# Test preflight request
curl -X OPTIONS http://localhost:5000/api/auth/login \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

Expected headers:
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
Access-Control-Allow-Credentials: true
```

### **Test CORS Rejection**

```bash
# Test from disallowed origin
curl -X POST http://localhost:5000/api/auth/login \
  -H "Origin: http://malicious.com" \
  -H "Content-Type: application/json" \
  -d '{...}'
```

Expected response (403):
```json
{
  "success": false,
  "message": "CORS policy violation. Your origin is not allowed to access this resource."
}
```

---

## 📊 TEST DATABASE

### **Check MongoDB Connection**

```bash
# Connect to MongoDB
mongo

# Switch to database
use smart-assistant

# Check users collection
db.users.find()

# Check user count
db.users.countDocuments()

# Exit
exit
```

---

## 🔍 TEST SECURITY HEADERS

### **Check Security Headers**

```bash
curl -i http://localhost:5000/health
```

Expected headers:
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'; ...
```

---

## 📋 COMPLETE TEST CHECKLIST

```
✅ MongoDB Connection
  ✅ MongoDB running locally
  ✅ Database created
  ✅ Collections created
  ✅ Backend can connect

✅ Email Service
  ✅ Email configuration test passes
  ✅ Test email received
  ✅ Email formatting correct

✅ Authentication
  ✅ User signup works
  ✅ Welcome email sent
  ✅ User login works
  ✅ JWT tokens generated
  ✅ Refresh token works
  ✅ Remember Me works

✅ Password Reset
  ✅ Forgot password sends OTP
  ✅ OTP email received
  ✅ OTP verification works
  ✅ Password reset works
  ✅ Confirmation email sent
  ✅ New password works

✅ Rate Limiting
  ✅ Login rate limiting works
  ✅ Signup rate limiting works
  ✅ Password reset rate limiting works
  ✅ OTP rate limiting works

✅ CORS Protection
  ✅ Allowed origins work
  ✅ Disallowed origins rejected
  ✅ Preflight requests work
  ✅ CORS headers present

✅ Security Headers
  ✅ X-Frame-Options set
  ✅ X-Content-Type-Options set
  ✅ X-XSS-Protection set
  ✅ CSP header set
  ✅ Referrer-Policy set
```

---

## 🐛 DEBUGGING TIPS

### **Check Backend Logs**
```bash
# Terminal where backend is running
# Look for errors and warnings
```

### **Check MongoDB Logs**
```bash
# macOS
tail -f /usr/local/var/log/mongodb/mongo.log

# Linux
sudo tail -f /var/log/mongodb/mongod.log
```

### **Check Email Logs**
```bash
# Look for email sending logs in backend console
# Search for "✅ Email sent" or "❌ Error sending"
```

### **Test with Postman**
1. Download Postman: https://www.postman.com/downloads/
2. Import API collection
3. Test endpoints with GUI
4. View request/response details

---

## 🚀 NEXT STEPS

After all tests pass:

1. **Test Google OAuth** - Integrate with frontend
2. **Test Facebook OAuth** - Integrate with frontend
3. **Test Email Verification** - For new signups
4. **Load Testing** - Test with multiple concurrent users
5. **Security Testing** - Penetration testing
6. **Production Deployment** - Deploy to production

---

**Last Updated:** April 2025
**Version:** 1.0
