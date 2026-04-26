# Section 5.6: Facebook OAuth Integration - Complete Documentation

## Overview

This document provides comprehensive documentation for the Facebook OAuth integration in the Smart Assistant for Senior Citizens platform. It covers setup, implementation, API endpoints, and best practices.

---

## Table of Contents

1. [Setup Guide](#setup-guide)
2. [API Endpoints](#api-endpoints)
3. [Frontend Implementation](#frontend-implementation)
4. [Backend Implementation](#backend-implementation)
5. [Security Considerations](#security-considerations)
6. [Troubleshooting](#troubleshooting)
7. [Best Practices](#best-practices)

---

## Setup Guide

### Prerequisites

- Facebook Developer Account
- Facebook App created
- Node.js and npm installed
- React.js frontend
- Express.js backend
- MongoDB database

### Step 1: Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "My Apps" → "Create App"
3. Choose app type: "Consumer"
4. Fill in app details:
   - **App Name:** Smart Assistant Senior Citizens
   - **App Contact Email:** smartassistantforseniorcitizen@gmail.com
   - **App Purpose:** Select "Other"
5. Click "Create App"

### Step 2: Add Facebook Login Product

1. In app dashboard, click "Add Product"
2. Search for "Facebook Login"
3. Click "Set Up"
4. Choose "Web" as platform

### Step 3: Configure OAuth Settings

1. Go to **Settings → Basic**
   - Copy **App ID**
   - Copy **App Secret**

2. Go to **Settings → Basic → App Domains**
   - Add: `localhost`
   - Add: `yourdomain.com`

3. Go to **Facebook Login → Settings**
   - Add Valid OAuth Redirect URIs:
     ```
     http://localhost:3000/auth/facebook/callback
     http://localhost:3000/login
     https://yourdomain.com/auth/facebook/callback
     https://yourdomain.com/login
     ```

### Step 4: Request Permissions

1. Go to **Tools → Graph API Explorer**
2. Select your app from dropdown
3. Click "Get User Access Token"
4. Select permissions:
   - `email`
   - `public_profile`
5. Click "Generate Access Token"

### Step 5: Environment Variables

**Backend (.env):**
```
FACEBOOK_APP_ID=your_app_id
FACEBOOK_APP_SECRET=your_app_secret
FACEBOOK_REDIRECT_URI=http://localhost:3000/auth/facebook/callback
```

**Frontend (.env.local):**
```
REACT_APP_FACEBOOK_APP_ID=your_app_id
```

### Step 6: Install Dependencies

**Backend:**
```bash
npm install axios
```

**Frontend:**
```bash
npm install react-facebook-login
# OR
npm install @react-oauth/facebook
```

---

## API Endpoints

### 1. POST /auth/facebook - Facebook Login

**Description:** Authenticate user with Facebook token

**Request:**
```json
{
  "token": "facebook_access_token",
  "rememberMe": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Facebook login successful",
  "data": {
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token",
    "rememberMeToken": "remember_me_token",
    "expiresIn": "15m",
    "user": {
      "userId": "user_id",
      "email": "user@example.com",
      "fullName": "User Name",
      "role": "elder",
      "profilePicture": "url",
      "isNewUser": true
    }
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid Facebook token"
}
```

**Features:**
- Verifies Facebook access token via Graph API
- Creates new user if doesn't exist
- Logs in existing user
- Generates JWT tokens
- Supports Remember Me
- Creates default Elder profile

---

### 2. POST /auth/facebook/verify - Verify Token

**Description:** Verify Facebook token without login

**Request:**
```json
{
  "token": "facebook_access_token"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Token verified successfully",
  "data": {
    "facebookId": "facebook_id",
    "email": "user@example.com",
    "name": "User Name",
    "picture": "url",
    "isVerified": true
  }
}
```

**Use Cases:**
- Validate token before login
- Check user info from token
- Verify permissions

---

### 3. POST /auth/facebook/link - Link Facebook Account

**Description:** Link Facebook account to existing user

**Request:**
```json
{
  "token": "facebook_access_token",
  "userId": "existing_user_id"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Facebook account linked successfully",
  "data": {
    "userId": "user_id",
    "email": "user@example.com",
    "facebookId": "facebook_id"
  }
}
```

**Features:**
- Links Facebook to existing account
- Prevents duplicate linking
- Updates profile picture
- Maintains existing account data

---

### 4. POST /auth/facebook/unlink - Unlink Facebook Account

**Description:** Remove Facebook account link

**Request:**
```json
{
  "userId": "user_id"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Facebook account unlinked successfully",
  "data": {
    "userId": "user_id",
    "email": "user@example.com"
  }
}
```

**Requirements:**
- User must have password set
- Prevents account lockout

---

## Frontend Implementation

### FacebookLoginButton Component

**Location:** `frontend/src/components/FacebookLoginButton.js`

**Usage:**
```javascript
import FacebookLoginButton from './components/FacebookLoginButton';

<FacebookLoginButton 
  rememberMe={true}
  onSuccess={(user) => {
    console.log('Login successful:', user);
    navigate('/dashboard/elder');
  }}
  onError={(error) => {
    console.error('Login failed:', error);
  }}
/>
```

**Props:**
- `rememberMe` (boolean): Enable Remember Me functionality
- `onSuccess` (function): Callback on successful login
- `onError` (function): Callback on login error

**Features:**
- Loads Facebook SDK dynamically
- Handles Facebook authentication
- Sends token to backend
- Manages JWT tokens
- Supports Remember Me
- Error handling with toast notifications
- Loading states
- Responsive design

### Integration in Login Page

**Location:** `frontend/src/pages/auth/LoginPage.js`

```javascript
<FacebookLoginButton 
  rememberMe={formData.rememberMe}
  onSuccess={(user) => {
    toast.success(`Welcome back, ${user.fullName}!`);
    navigate(dashboardRoutes[user.role]);
  }}
  onError={(error) => {
    toast.error(error.message || "Facebook login failed");
  }}
/>
```

---

## Backend Implementation

### Facebook Auth Routes

**Location:** `backend/routes/facebookAuth.js`

**Endpoints:**
1. `POST /auth/facebook` - Login/Signup
2. `POST /auth/facebook/verify` - Verify token
3. `POST /auth/facebook/link` - Link account
4. `POST /auth/facebook/unlink` - Unlink account

**Key Functions:**

**1. Token Verification**
```javascript
const response = await axios.get(
  `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${token}`
);
```

**2. User Creation**
```javascript
const user = await User.create({
  fullName: name,
  email,
  facebookId,
  profilePicture: picture?.data?.url,
  isVerified: true,
  password: null
});
```

**3. Token Generation**
```javascript
const accessToken = generateAccessToken(user._id, user.email, user.role);
const refreshTokenData = generateRefreshToken(user._id);
```

### Database Schema

**User Model Updates:**
```javascript
{
  facebookId: String,
  profilePicture: String,
  isVerified: Boolean,
  lastLogin: Date,
  refreshToken: String,
  refreshTokenExpiry: Date,
  rememberMeToken: String,
  rememberMeExpiry: Date
}
```

---

## Security Considerations

### 1. Token Security

- ✅ Facebook tokens verified via Graph API
- ✅ JWT tokens generated with secure algorithm
- ✅ Refresh tokens stored securely
- ✅ Tokens expire after set time
- ✅ Token rotation on refresh

### 2. User Data Security

- ✅ Email verified by Facebook
- ✅ Profile picture from Facebook
- ✅ No password required for OAuth
- ✅ User data validated before storage
- ✅ Sensitive fields marked as select: false

### 3. Account Security

- ✅ Account linking prevents duplicates
- ✅ Unlinking requires password
- ✅ Rate limiting on endpoints
- ✅ CSRF protection implemented
- ✅ XSS protection implemented

### 4. Privacy

- ✅ Only request necessary permissions
- ✅ User data not shared with third parties
- ✅ Secure token storage
- ✅ Error messages don't expose sensitive info

---

## Troubleshooting

### Issue: "Invalid Facebook token"

**Causes:**
- Token expired
- Token from wrong app
- Token revoked by user
- Invalid token format

**Solutions:**
1. Verify App ID is correct
2. Check token hasn't expired
3. Ensure token is from correct Facebook app
4. Verify Graph API endpoint is correct
5. Check token format

### Issue: "CORS error"

**Causes:**
- Redirect URI not configured
- Frontend URL not in app domains
- CORS headers missing

**Solutions:**
1. Add redirect URI to Facebook App settings
2. Add frontend URL to app domains
3. Check backend CORS configuration
4. Verify exact URL match (including protocol and port)

### Issue: "User not created"

**Causes:**
- Database connection failed
- User model missing facebookId field
- Elder profile creation failed
- Email not provided by Facebook

**Solutions:**
1. Check database connection
2. Verify User model has facebookId field
3. Check Elder profile creation logic
4. Ensure email permission requested

### Issue: "Token not stored in localStorage"

**Causes:**
- localStorage disabled
- Token not returned from backend
- JavaScript error in component
- Browser privacy settings

**Solutions:**
1. Check browser localStorage is enabled
2. Verify login response contains tokens
3. Check browser console for errors
4. Check browser privacy settings
5. Verify token is returned from backend

### Issue: "Facebook SDK not loading"

**Causes:**
- Internet connection issue
- App ID incorrect
- Script loading failed
- Browser blocking script

**Solutions:**
1. Check internet connection
2. Verify App ID is correct
3. Check browser console for errors
4. Try clearing browser cache
5. Check browser security settings

### Issue: "Redirect URI mismatch"

**Causes:**
- URI not in app settings
- Protocol mismatch (http vs https)
- Port number mismatch
- Trailing slash mismatch

**Solutions:**
1. Verify redirect URI in Facebook App settings
2. Include protocol (http/https)
3. Include port number if not standard
4. Check for trailing slashes
5. Ensure exact match with frontend URL

---

## Best Practices

### 1. Token Management

```javascript
// Store tokens securely
localStorage.setItem('accessToken', jwtToken);
localStorage.setItem('refreshToken', refreshToken);

// Clear tokens on logout
localStorage.removeItem('accessToken');
localStorage.removeItem('refreshToken');

// Refresh tokens before expiration
if (tokenExpiringSoon()) {
  refreshToken();
}
```

### 2. Error Handling

```javascript
try {
  const response = await loginWithFacebook(token);
  handleSuccess(response);
} catch (error) {
  if (error.response?.status === 401) {
    showError('Invalid token');
  } else if (error.response?.status === 400) {
    showError('Missing required fields');
  } else {
    showError('Login failed. Please try again.');
  }
}
```

### 3. User Experience

```javascript
// Show loading state
setIsLoading(true);

// Show success message
toast.success('Login successful!');

// Redirect to dashboard
navigate(`/dashboard/${user.role}`);

// Handle errors gracefully
toast.error('Login failed. Please try again.');
```

### 4. Security

```javascript
// Verify token on backend
const user = await verifyFacebookToken(token);

// Create user if doesn't exist
if (!user) {
  user = await createUser(facebookData);
}

// Generate secure tokens
const accessToken = generateAccessToken(user._id);
const refreshToken = generateRefreshToken(user._id);

// Store tokens securely
user.refreshToken = refreshToken;
await user.save();
```

### 5. Testing

```javascript
// Test with valid token
const validToken = 'valid_facebook_token';
const response = await loginWithFacebook(validToken);
expect(response.success).toBe(true);

// Test with invalid token
const invalidToken = 'invalid_token';
const error = await loginWithFacebook(invalidToken);
expect(error.status).toBe(401);

// Test error handling
const noToken = '';
const error = await loginWithFacebook(noToken);
expect(error.status).toBe(400);
```

---

## Deployment Checklist

- [ ] Facebook App created and configured
- [ ] App ID and Secret obtained
- [ ] OAuth Redirect URIs configured
- [ ] Permissions requested (email, public_profile)
- [ ] Environment variables set
- [ ] Dependencies installed
- [ ] Backend endpoints tested
- [ ] Frontend component tested
- [ ] Login page integration tested
- [ ] Error handling tested
- [ ] Security verified
- [ ] Performance tested
- [ ] Accessibility tested
- [ ] Browser compatibility tested
- [ ] Deployed to staging
- [ ] Deployed to production
- [ ] Monitoring enabled
- [ ] Error logs reviewed

---

## Performance Metrics

**Target Metrics:**
- Facebook popup opens: < 1 second
- Token verification: < 500ms
- User creation: < 1 second
- Redirect to dashboard: < 2 seconds
- Total login time: < 5 seconds
- Token refresh: < 500ms

**Monitoring:**
- Track login success rate
- Monitor error rates
- Track average login time
- Monitor token refresh rate
- Track user creation rate

---

## Support & Resources

### Facebook Documentation
- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login)
- [Graph API Reference](https://developers.facebook.com/docs/graph-api)
- [OAuth 2.0 Specification](https://tools.ietf.org/html/rfc6749)

### Project Resources
- GitHub Repository: https://github.com/naveediqbal4765/smart-assistant-senior-citizens
- Backend Routes: `backend/routes/facebookAuth.js`
- Frontend Component: `frontend/src/components/FacebookLoginButton.js`
- Login Page: `frontend/src/pages/auth/LoginPage.js`

### Contact
- Email: smartassistantforseniorcitizen@gmail.com
- Phone: +92 (339) 993-4981

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-04-26 | Initial Facebook OAuth integration |

---

## Conclusion

The Facebook OAuth integration provides a secure, user-friendly way for seniors to authenticate with the Smart Assistant platform. By following this documentation and best practices, you can ensure a smooth and secure authentication experience for all users.

For questions or issues, please refer to the troubleshooting section or contact the development team.

