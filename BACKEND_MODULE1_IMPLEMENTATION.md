# Module 1 Backend Implementation - Authentication & User Management

## 📋 Implementation Plan

### **Phase 1: Email/Password Authentication**
1. ✅ Strict Email Validation
2. ✅ Password Verification
3. ✅ Error Messages (Invalid email, Wrong password)
4. ✅ Successful Login Redirect
5. ✅ Password Reset with OTP
6. ✅ New Password Confirmation
7. ✅ Database Update

### **Phase 2: Google OAuth**
1. ✅ Check if Gmail exists in database
2. ✅ Login if exists
3. ✅ Redirect to role selection if new user
4. ✅ Auto-fill user data from Google
5. ✅ Create user profile after role selection

### **Phase 3: Facebook OAuth**
1. ✅ Check if Facebook account exists
2. ✅ Login if exists
3. ✅ Redirect to role selection if new user
4. ✅ Auto-fill user data from Facebook
5. ✅ Create user profile after role selection

---

## 🔧 Backend Components to Implement

### **1. Email Validation Service**
- Strict email format validation
- Check for common typos (@@, .., etc.)
- Return specific error messages

### **2. Password Reset Service**
- Generate OTP (6 digits)
- Send OTP via email
- Verify OTP
- Update password in database
- Redirect to login

### **3. OAuth Services**
- Google OAuth token verification
- Facebook OAuth token verification
- Auto-fill user data
- Create user profiles

### **4. Email Service**
- Send OTP emails
- Send password reset emails
- Send verification emails

### **5. Error Handling**
- Invalid email format
- Email not found
- Wrong password
- OTP expired
- OTP invalid
- Token expired

---

## 📊 API Endpoints

### **Authentication Endpoints**

#### **1. POST /api/auth/login**
**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "rememberMe": true
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token",
    "rememberMeToken": "remember_me_token",
    "user": {
      "userId": "user_id",
      "email": "user@example.com",
      "fullName": "User Name",
      "role": "elder"
    }
  }
}
```

**Response (Invalid Email):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**Response (Wrong Password):**
```json
{
  "success": false,
  "message": "Incorrect password. Do you want to reset?"
}
```

#### **2. POST /api/auth/forgot-password**
**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent to your email",
  "data": {
    "otpSent": true,
    "expiresIn": "5 minutes"
  }
}
```

#### **3. POST /api/auth/verify-reset-otp**
**Request:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "data": {
    "resetToken": "reset_token",
    "verified": true
  }
}
```

#### **4. POST /api/auth/reset-password**
**Request:**
```json
{
  "resetToken": "reset_token",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successfully. Please login with your new password.",
  "data": {
    "passwordReset": true
  }
}
```

#### **5. POST /api/auth/google**
**Request:**
```json
{
  "token": "google_id_token",
  "rememberMe": true
}
```

**Response (Existing User):**
```json
{
  "success": true,
  "message": "Google login successful",
  "data": {
    "accessToken": "jwt_token",
    "user": {
      "userId": "user_id",
      "email": "user@gmail.com",
      "fullName": "User Name",
      "role": "elder",
      "isNewUser": false
    }
  }
}
```

**Response (New User):**
```json
{
  "success": true,
  "message": "Google login successful",
  "data": {
    "accessToken": "jwt_token",
    "user": {
      "userId": "user_id",
      "email": "user@gmail.com",
      "fullName": "User Name",
      "role": null,
      "isNewUser": true
    }
  }
}
```

#### **6. POST /api/auth/facebook**
**Request:**
```json
{
  "token": "facebook_access_token",
  "rememberMe": true
}
```

**Response:** (Same as Google)

#### **7. POST /api/auth/set-role**
**Request:**
```json
{
  "userId": "user_id",
  "role": "elder"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Role set successfully",
  "data": {
    "userId": "user_id",
    "email": "user@example.com",
    "fullName": "User Name",
    "role": "elder"
  }
}
```

---

## 🔐 Security Features

1. **Password Hashing**: bcryptjs with salt rounds 12
2. **JWT Tokens**: Secure token-based authentication
3. **OTP Verification**: 6-digit OTP with 5-minute expiry
4. **Email Validation**: Strict format checking
5. **Rate Limiting**: Prevent brute force attacks
6. **CORS Protection**: Secure cross-origin requests
7. **Helmet**: Security headers

---

## 📧 Email Templates

### **OTP Email**
```
Subject: Your OTP for Password Reset

Dear User,

Your OTP for password reset is: 123456

This OTP will expire in 5 minutes.

If you didn't request this, please ignore this email.

Best regards,
Smart Assistant Team
```

### **Verification Email**
```
Subject: Verify Your Email Address

Dear User,

Thank you for signing up! Please verify your email address using the OTP below:

OTP: 123456

This OTP will expire in 10 minutes.

Best regards,
Smart Assistant Team
```

---

## 🗄️ Database Schema

### **User Collection**
```javascript
{
  _id: ObjectId,
  fullName: String,
  email: String (unique),
  phone: String,
  password: String (hashed),
  profilePicture: String,
  dateOfBirth: Date,
  address: {
    text: String,
    lat: Number,
    lng: Number
  },
  nationalId: String,
  role: String (elder, caregiver, volunteer),
  authProvider: String (local, google, facebook),
  providerId: String,
  isVerified: Boolean,
  isActive: Boolean,
  isDeleted: Boolean,
  otp: String (hashed),
  otpExpiry: Date,
  otpPurpose: String,
  rememberMeToken: String,
  rememberMeExpiry: Date,
  passwordReset: {
    otp: String,
    expiresAt: Date,
    verified: Boolean,
    verificationToken: String
  },
  googleId: String,
  facebookId: String,
  elderData: Object,
  caregiverData: Object,
  volunteerData: Object,
  location: {
    type: Point,
    coordinates: [Number, Number]
  },
  privacySettings: Object,
  lastLogin: Date,
  passwordChangedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## ✅ Implementation Checklist

- [ ] Email validation service
- [ ] Password reset service
- [ ] OTP generation and verification
- [ ] Email sending service
- [ ] Google OAuth integration
- [ ] Facebook OAuth integration
- [ ] Error handling middleware
- [ ] Rate limiting
- [ ] JWT token generation
- [ ] Remember Me functionality
- [ ] Database indexes
- [ ] API documentation
- [ ] Unit tests
- [ ] Integration tests

---

**Status**: Ready for implementation
**Last Updated**: April 27, 2025
