# Remember Me Functionality - Complete Documentation

## Overview

The "Remember Me" feature allows users to stay logged in for up to 30 days without needing to re-enter their credentials. This is implemented using secure tokens stored in the database, separate from JWT tokens for additional security.

---

## Architecture

### Components

1. **User Model** - Stores Remember Me token data
2. **Remember Me Service** - Utility functions for token management
3. **Auth Routes** - Login and verification endpoints
4. **Cleanup Job** - Scheduled job to remove expired tokens
5. **Job Scheduler** - Cron-based scheduler for periodic tasks
6. **Admin Routes** - Administrative endpoints for token management

---

## Database Schema

### User Model Fields

```javascript
// Remember Me / Session
rememberMe: { type: Boolean, default: false },
rememberMeToken: { type: String, select: false },          // 64-char hex token
rememberMeExpiry: { type: Date, select: false },           // 30-day expiration
rememberMeLastUsed: { type: Date, select: false },         // Last usage timestamp
```

**Security Notes:**
- All fields marked as `select: false` - not returned in default queries
- Token is 256-bit random (64 hex characters)
- Expiration is 30 days from login or last use
- Last used timestamp tracks token activity

---

## API Endpoints

### 1. Login with Remember Me

**Endpoint:** `POST /api/auth/login-with-remember-me`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass@123",
  "rememberMe": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "rememberMeToken": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2",
    "user": {
      "userId": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "elder"
    }
  }
}
```

**Error Responses:**
- `400` - Missing email or password
- `401` - Invalid credentials
- `403` - Email not verified
- `500` - Server error

---

### 2. Verify Remember Me Token

**Endpoint:** `POST /api/auth/verify-remember-me`

**Request:**
```json
{
  "rememberMeToken": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Auto-login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "userId": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "elder"
    }
  }
}
```

**Error Responses:**
- `400` - Missing Remember Me token
- `401` - Invalid or expired token
- `500` - Server error

**Behavior:**
- Validates token format (64 hex characters)
- Checks token expiration
- Extends expiration by 30 days on successful verification
- Updates last used timestamp
- Returns new JWT token for session

---

### 3. Logout

**Endpoint:** `POST /api/auth/logout`

**Request:**
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Error Responses:**
- `401` - Unauthorized (no valid JWT)
- `500` - Server error

**Behavior:**
- Clears Remember Me token from database
- Clears expiration date
- Clears last used timestamp
- User must log in again to get new token

---

## Admin Endpoints

### 1. Manual Cleanup

**Endpoint:** `POST /api/admin/cleanup-remember-me`

**Request:**
```json
{
  "Authorization": "Bearer <admin-jwt-token>"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Cleaned up 5 expired Remember Me tokens",
  "data": {
    "cleanedCount": 5,
    "timestamp": "2026-04-27T10:30:00.000Z"
  }
}
```

**Purpose:** Manually trigger cleanup of expired tokens (normally runs hourly)

---

### 2. Get Statistics

**Endpoint:** `GET /api/admin/remember-me-stats`

**Request:**
```json
{
  "Authorization": "Bearer <admin-jwt-token>"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "activeTokens": 42,
    "expiredTokens": 8,
    "totalTokens": 50,
    "oldestTokenLastUsed": "2026-04-20T15:30:00.000Z",
    "newestTokenLastUsed": "2026-04-27T10:15:00.000Z",
    "timestamp": "2026-04-27T10:30:00.000Z"
  }
}
```

**Purpose:** Monitor Remember Me token usage and health

---

### 3. Clear User Tokens

**Endpoint:** `POST /api/admin/clear-user-tokens/:userId`

**Request:**
```json
{
  "Authorization": "Bearer <admin-jwt-token>"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Remember Me tokens cleared for user",
  "data": {
    "userId": "507f1f77bcf86cd799439011"
  }
}
```

**Purpose:** Force logout user by clearing their Remember Me token

---

## Token Lifecycle

### 1. Token Generation (Login)

```
User logs in with "Remember Me" checked
    ↓
Backend validates credentials
    ↓
Generate 256-bit random token (64 hex chars)
    ↓
Store token in database with:
  - rememberMeToken: <token>
  - rememberMeExpiry: now + 30 days
  - rememberMeLastUsed: now
    ↓
Return token to frontend
    ↓
Frontend stores in localStorage
```

### 2. Token Verification (Auto-login)

```
User returns to app
    ↓
Frontend checks localStorage for Remember Me token
    ↓
Send token to /verify-remember-me endpoint
    ↓
Backend validates token:
  - Check format (64 hex chars)
  - Check expiration (not past)
  - Check existence in database
    ↓
If valid:
  - Extend expiration by 30 days
  - Update last used timestamp
  - Generate new JWT token
  - Return JWT to frontend
    ↓
Frontend stores JWT and logs user in
```

### 3. Token Expiration

```
Token reaches 30-day expiration
    ↓
Scheduled cleanup job runs (hourly)
    ↓
Find all expired tokens
    ↓
Clear token, expiry, and last used fields
    ↓
User must log in again
```

### 4. Token Logout

```
User clicks logout
    ↓
Frontend sends logout request with JWT
    ↓
Backend validates JWT
    ↓
Clear Remember Me token from database
    ↓
Return success response
    ↓
Frontend clears localStorage
    ↓
User logged out completely
```

---

## Security Features

### Token Security

✅ **256-bit Random Generation**
- Uses `crypto.randomBytes(32)` for secure randomness
- Converted to 64-character hex string
- Cryptographically secure, not guessable

✅ **Token Storage**
- Stored in database, not in JWT
- Marked as `select: false` - not returned in queries
- Separate from JWT for defense in depth

✅ **Token Validation**
- Format validation (64 hex characters)
- Expiration checking
- Database lookup verification
- User existence verification

### Expiration Management

✅ **30-Day Expiration**
- Tokens expire after 30 days of inactivity
- Expiration extends on each use
- Automatic cleanup of expired tokens

✅ **Last Used Tracking**
- Tracks when token was last used
- Useful for security audits
- Helps identify inactive accounts

### Privacy & Compliance

✅ **No Token Exposure**
- Tokens not logged in console
- Tokens not returned in error messages
- Tokens not exposed in API responses (except on login)

✅ **Automatic Cleanup**
- Expired tokens removed hourly
- Prevents database bloat
- Improves query performance

✅ **User Control**
- Users can logout anytime
- Logout immediately clears token
- Users can disable Remember Me

---

## Implementation Guide

### Backend Setup

1. **Install Dependencies**
```bash
npm install node-cron
```

2. **Initialize Scheduler in Server**
```javascript
// In your main server file (e.g., server.js or app.js)
const { initializeScheduledJobs } = require("./src/scheduler/jobScheduler");

// After database connection
const scheduledJobs = initializeScheduledJobs();

// On server shutdown
process.on("SIGTERM", () => {
  stopScheduledJobs(scheduledJobs);
  server.close();
});
```

3. **Register Routes**
```javascript
// In your main app file
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
```

### Frontend Setup

1. **Update Login Component**
```javascript
// Add Remember Me checkbox to login form
<input 
  type="checkbox" 
  id="rememberMe"
  checked={rememberMe}
  onChange={(e) => setRememberMe(e.target.checked)}
/>
<label htmlFor="rememberMe">Remember Me</label>
```

2. **Update Login Handler**
```javascript
const handleLogin = async (email, password, rememberMe) => {
  const endpoint = rememberMe 
    ? "/api/auth/login-with-remember-me"
    : "/api/auth/login";
  
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, rememberMe })
  });
  
  const data = await response.json();
  
  if (data.success) {
    localStorage.setItem("jwtToken", data.data.token);
    if (rememberMe && data.data.rememberMeToken) {
      localStorage.setItem("rememberMeToken", data.data.rememberMeToken);
    }
  }
};
```

3. **Implement Auto-login**
```javascript
// In App.js or AuthContext initialization
useEffect(() => {
  const autoLogin = async () => {
    const rememberMeToken = localStorage.getItem("rememberMeToken");
    
    if (rememberMeToken) {
      try {
        const response = await fetch("/api/auth/verify-remember-me", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rememberMeToken })
        });
        
        const data = await response.json();
        
        if (data.success) {
          localStorage.setItem("jwtToken", data.data.token);
          setUser(data.data.user);
          setIsAuthenticated(true);
        } else {
          // Token invalid or expired
          localStorage.removeItem("rememberMeToken");
        }
      } catch (error) {
        console.error("Auto-login failed:", error);
      }
    }
  };
  
  autoLogin();
}, []);
```

---

## Testing

### Manual Testing Checklist

- [ ] Login with Remember Me enabled
- [ ] Verify token is returned
- [ ] Store token in localStorage
- [ ] Refresh page and verify auto-login
- [ ] Verify user is logged in without credentials
- [ ] Wait 30 days (or modify expiration for testing)
- [ ] Verify token expires and requires re-login
- [ ] Test logout clears token
- [ ] Test invalid token returns 401
- [ ] Test expired token returns 401
- [ ] Test admin cleanup endpoint
- [ ] Test admin stats endpoint
- [ ] Test admin clear user tokens endpoint

### Unit Tests

```javascript
// Example test for token generation
describe("Remember Me Service", () => {
  it("should generate valid token", () => {
    const token = generateRememberMeToken();
    expect(token).toMatch(/^[a-f0-9]{64}$/);
  });

  it("should set 30-day expiration", () => {
    const expiry = getRememberMeExpiration();
    const now = new Date();
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
    
    expect(expiry.getTime() - now.getTime()).toBeCloseTo(thirtyDaysMs, -3);
  });

  it("should detect expired tokens", () => {
    const pastDate = new Date(Date.now() - 1000);
    expect(isRememberMeTokenExpired(pastDate)).toBe(true);
  });
});
```

---

## Monitoring & Maintenance

### Scheduled Cleanup

The cleanup job runs **every hour** at the top of the hour (`:00`).

**To change frequency:**
Edit `backend/src/scheduler/jobScheduler.js`:
```javascript
// Every 30 minutes
cron.schedule("*/30 * * * *", async () => { ... });

// Every 6 hours
cron.schedule("0 */6 * * *", async () => { ... });

// Daily at 2 AM
cron.schedule("0 2 * * *", async () => { ... });
```

### Monitoring

Check token statistics regularly:
```bash
curl -X GET http://localhost:5000/api/admin/remember-me-stats \
  -H "Authorization: Bearer <admin-token>"
```

### Troubleshooting

**Issue:** Tokens not being cleaned up
- Check if scheduler is initialized
- Check server logs for errors
- Manually run cleanup: `POST /api/admin/cleanup-remember-me`

**Issue:** Auto-login not working
- Check if token is stored in localStorage
- Check if token is valid (not expired)
- Check browser console for errors
- Verify `/verify-remember-me` endpoint is working

**Issue:** Token expiration not extending
- Verify `refreshRememberMeExpiration()` is called
- Check database for `rememberMeExpiry` field
- Verify token is not already expired

---

## Best Practices

1. **Always use HTTPS** - Tokens should only be transmitted over secure connections
2. **Secure localStorage** - Consider using httpOnly cookies for additional security
3. **Monitor token usage** - Regularly check admin stats for suspicious activity
4. **Implement rate limiting** - Limit `/verify-remember-me` requests to prevent brute force
5. **Log token events** - Log token generation, verification, and cleanup for audit trails
6. **User education** - Inform users about Remember Me security implications
7. **Regular cleanup** - Ensure cleanup job runs regularly to prevent database bloat
8. **Token rotation** - Consider rotating tokens periodically for additional security

---

## Cron Expression Reference

```
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of week (0 - 6) (Sunday to Saturday)
│ │ │ │ │
│ │ │ │ │
* * * * *

Examples:
"0 * * * *"     - Every hour
"*/30 * * * *"  - Every 30 minutes
"0 */6 * * *"   - Every 6 hours
"0 2 * * *"     - Daily at 2 AM
"0 0 * * 0"     - Weekly on Sunday at midnight
```

---

## Version History

- **v1.0** (April 27, 2026) - Initial implementation
  - Token generation and verification
  - 30-day expiration
  - Automatic cleanup job
  - Admin endpoints

---

## Support & Questions

For issues or questions about Remember Me functionality:
1. Check this documentation
2. Review test cases
3. Check server logs
4. Contact development team

---

**Last Updated:** April 27, 2026  
**Status:** Production Ready ✅
