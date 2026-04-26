# PHASE 1: CORE AUTHENTICATION - IMPLEMENTATION CHECKLIST

**Phase:** 1 - Core Authentication  
**Duration:** 1 Week  
**Status:** IN PROGRESS  
**Start Date:** April 26, 2026

---

## PHASE 1 OVERVIEW

Phase 1 focuses on implementing core authentication features that are missing from the current codebase. This includes password reset with OTP, OAuth integrations, remember me functionality, and session persistence.

---

## CHECKLIST

### SECTION 1: PASSWORD RESET WITH OTP

- [ ] **1.1** Create password reset request endpoint
  - [ ] 1.1.1 Validate email exists in database
  - [ ] 1.1.2 Generate 6-digit OTP
  - [ ] 1.1.3 Store OTP in database with 5-minute expiration
  - [ ] 1.1.4 Send OTP to user email
  - [ ] 1.1.5 Return success message

- [ ] **1.2** Create OTP verification endpoint
  - [ ] 1.2.1 Validate OTP format (6 digits)
  - [ ] 1.2.2 Check OTP expiration
  - [ ] 1.2.3 Check OTP matches stored value
  - [ ] 1.2.4 Mark OTP as verified
  - [ ] 1.2.5 Return verification token

- [ ] **1.3** Create password reset endpoint
  - [ ] 1.3.1 Validate verification token
  - [ ] 1.3.2 Validate new password strength
  - [ ] 1.3.3 Hash new password with bcrypt
  - [ ] 1.3.4 Update password in database
  - [ ] 1.3.5 Invalidate all existing sessions
  - [ ] 1.3.6 Return success message

- [ ] **1.4** Create frontend password reset flow
  - [ ] 1.4.1 Create "Forgot Password" button on login page
  - [ ] 1.4.2 Create password reset request form
  - [ ] 1.4.3 Create OTP verification form
  - [ ] 1.4.4 Create new password form
  - [ ] 1.4.5 Add error handling and validation
  - [ ] 1.4.6 Add success messages

### SECTION 2: REMEMBER ME FUNCTIONALITY

- [ ] **2.1** Add remember me checkbox to login page
  - [ ] 2.1.1 Create checkbox UI element
  - [ ] 2.1.2 Add label "Remember me for 30 days"
  - [ ] 2.1.3 Style checkbox to match design

- [ ] **2.2** Implement remember me backend logic
  - [ ] 2.2.1 Create long-lived JWT token (30 days)
  - [ ] 2.2.2 Store token in secure HTTP-only cookie
  - [ ] 2.2.3 Validate token on page load
  - [ ] 2.2.4 Auto-login if valid token exists
  - [ ] 2.2.5 Clear token on logout

- [ ] **2.3** Implement remember me frontend logic
  - [ ] 2.3.1 Check for remember me cookie on mount
  - [ ] 2.3.2 Auto-redirect to dashboard if valid
  - [ ] 2.3.3 Show loading state during verification
  - [ ] 2.3.4 Handle expired token gracefully

### SECTION 3: SESSION PERSISTENCE WITH JWT

- [ ] **3.1** Verify JWT implementation
  - [ ] 3.1.1 Check JWT_SECRET in .env
  - [ ] 3.1.2 Verify token generation on login
  - [ ] 3.1.3 Verify token validation on requests
  - [ ] 3.1.4 Check token expiration (24 hours)
  - [ ] 3.1.5 Verify refresh token logic

- [ ] **3.2** Implement session persistence
  - [ ] 3.2.1 Store JWT in localStorage
  - [ ] 3.2.2 Store JWT in sessionStorage
  - [ ] 3.2.3 Check token on app mount
  - [ ] 3.2.4 Auto-redirect if valid token
  - [ ] 3.2.5 Clear token on logout

- [ ] **3.3** Add token refresh logic
  - [ ] 3.3.1 Create refresh token endpoint
  - [ ] 3.3.2 Implement token refresh on expiration
  - [ ] 3.3.3 Handle refresh token expiration
  - [ ] 3.3.4 Redirect to login on failure

### SECTION 4: OAUTH INTEGRATIONS - GOOGLE

- [ ] **4.1** Setup Google OAuth
  - [ ] 4.1.1 Create Google OAuth credentials
  - [ ] 4.1.2 Get Client ID and Client Secret
  - [ ] 4.1.3 Add to .env file
  - [ ] 4.1.4 Install google-auth-library

- [ ] **4.2** Implement Google login backend
  - [ ] 4.2.1 Create Google OAuth endpoint
  - [ ] 4.2.2 Verify Google token
  - [ ] 4.2.3 Check if user exists
  - [ ] 4.2.4 Create user if not exists
  - [ ] 4.2.5 Generate JWT token
  - [ ] 4.2.6 Return user data and token

- [ ] **4.3** Implement Google login frontend
  - [ ] 4.3.1 Install @react-oauth/google
  - [ ] 4.3.2 Add Google button to login page
  - [ ] 4.3.3 Handle Google token response
  - [ ] 4.3.4 Send token to backend
  - [ ] 4.3.5 Store JWT and redirect
  - [ ] 4.3.6 Add error handling

### SECTION 5: OAUTH INTEGRATIONS - FACEBOOK

- [ ] **5.1** Setup Facebook OAuth
  - [ ] 5.1.1 Create Facebook App
  - [ ] 5.1.2 Get App ID and App Secret
  - [ ] 5.1.3 Add to .env file
  - [ ] 5.1.4 Install facebook-sdk

- [ ] **5.2** Implement Facebook login backend
  - [ ] 5.2.1 Create Facebook OAuth endpoint
  - [ ] 5.2.2 Verify Facebook token
  - [ ] 5.2.3 Check if user exists
  - [ ] 5.2.4 Create user if not exists
  - [ ] 5.2.5 Generate JWT token
  - [ ] 5.2.6 Return user data and token

- [ ] **5.3** Implement Facebook login frontend
  - [ ] 5.3.1 Install react-facebook-login
  - [ ] 5.3.2 Add Facebook button to login page
  - [ ] 5.3.3 Handle Facebook token response
  - [ ] 5.3.4 Send token to backend
  - [ ] 5.3.5 Store JWT and redirect
  - [ ] 5.3.6 Add error handling

### SECTION 7: ERROR HANDLING & VALIDATION

- [ ] **7.1** Improve login error handling
  - [ ] 7.1.1 Show specific error messages
  - [ ] 7.1.2 Highlight invalid fields in red
  - [ ] 7.1.3 Add accessibility indicators (!)
  - [ ] 7.1.4 Clear errors on input change
  - [ ] 7.1.5 Add loading states

- [ ] **7.2** Improve password reset error handling
  - [ ] 7.2.1 Show email not found error
  - [ ] 7.2.2 Show OTP expired error
  - [ ] 7.2.3 Show invalid OTP error
  - [ ] 7.2.4 Show password mismatch error
  - [ ] 7.2.5 Show password strength error

- [ ] **7.3** Improve OAuth error handling
  - [ ] 7.3.1 Handle OAuth cancellation
  - [ ] 7.3.2 Handle OAuth errors
  - [ ] 7.3.3 Handle network errors
  - [ ] 7.3.4 Show user-friendly messages
  - [ ] 7.3.5 Add retry logic

### SECTION 8: SECURITY ENHANCEMENTS

- [ ] **8.1** Implement rate limiting
  - [ ] 8.1.1 Install express-rate-limit
  - [ ] 8.1.2 Add rate limit to login endpoint (5 attempts, 15 min)
  - [ ] 8.1.3 Add rate limit to password reset (3 attempts, 1 hour)
  - [ ] 8.1.4 Add rate limit to OTP verification (5 attempts, 15 min)
  - [ ] 8.1.5 Return 429 status on limit exceeded

- [ ] **8.2** Verify input sanitization
  - [ ] 8.2.1 Check XSS protection on email field
  - [ ] 8.2.2 Check XSS protection on password field
  - [ ] 8.2.3 Check SQL injection protection
  - [ ] 8.2.4 Verify bcrypt hashing
  - [ ] 8.2.5 Check environment variables

- [ ] **8.3** Implement CORS security
  - [ ] 8.3.1 Configure CORS for frontend domain
  - [ ] 8.3.2 Set secure cookie flags
  - [ ] 8.3.3 Add CSRF protection
  - [ ] 8.3.4 Verify HTTPS enforcement

### SECTION 9: TESTING

- [ ] **9.1** Unit tests for authentication
  - [ ] 9.1.1 Test login with valid credentials
  - [ ] 9.1.2 Test login with invalid credentials
  - [ ] 9.1.3 Test password reset flow
  - [ ] 9.1.4 Test OTP generation and validation
  - [ ] 9.1.5 Test JWT token generation

- [ ] **9.2** Integration tests
  - [ ] 9.2.1 Test complete login flow
  - [ ] 9.2.2 Test complete password reset flow
  - [ ] 9.2.3 Test OAuth login flow
  - [ ] 9.2.4 Test remember me functionality
  - [ ] 9.2.5 Test session persistence

- [ ] **9.3** Security tests
  - [ ] 9.3.1 Test rate limiting
  - [ ] 9.3.2 Test XSS protection
  - [ ] 9.3.3 Test SQL injection protection
  - [ ] 9.3.4 Test CSRF protection
  - [ ] 9.3.5 Test password hashing

### SECTION 10: DOCUMENTATION & DEPLOYMENT

- [ ] **10.1** Update documentation
  - [ ] 10.1.1 Document password reset flow
  - [ ] 10.1.2 Document OAuth setup
  - [ ] 10.1.3 Document environment variables
  - [ ] 10.1.4 Document API endpoints
  - [ ] 10.1.5 Document error codes

- [ ] **10.2** Prepare for deployment
  - [ ] 10.2.1 Verify all .env variables
  - [ ] 10.2.2 Run all tests
  - [ ] 10.2.3 Check code quality
  - [ ] 10.2.4 Verify security
  - [ ] 10.2.5 Create deployment guide

---

## PROGRESS TRACKING

### Week 1 Progress

| Day | Task | Status | Notes |
|-----|------|--------|-------|
| Day 1 | Setup & Planning | ⏳ Pending | Starting Phase 1 |
| Day 2 | Password Reset Backend | ⏳ Pending | OTP generation & email |
| Day 3 | Password Reset Frontend | ⏳ Pending | UI forms & validation |
| Day 4 | OAuth Integrations | ⏳ Pending | Google, Facebook, Apple |
| Day 5 | Remember Me & Session | ⏳ Pending | JWT persistence |
| Day 6 | Security & Testing | ⏳ Pending | Rate limiting, tests |
| Day 7 | Documentation & Review | ⏳ Pending | Final checks |

---

## DEPENDENCIES TO INSTALL

```bash
# Email service
npm install nodemailer

# OAuth
npm install google-auth-library
npm install @react-oauth/google
npm install react-facebook-login
npm install apple-signin-js

# Security
npm install express-rate-limit
npm install helmet
npm install cors

# Testing
npm install jest
npm install supertest
npm install @testing-library/react
```

---

## ENVIRONMENT VARIABLES NEEDED

```
# Email Service
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret

# Facebook OAuth
FACEBOOK_APP_ID=your-app-id
FACEBOOK_APP_SECRET=your-app-secret

# Apple OAuth
APPLE_SERVICE_ID=your-service-id
APPLE_TEAM_ID=your-team-id
APPLE_CLIENT_SECRET=your-client-secret

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRE=24h
REFRESH_TOKEN_EXPIRE=30d

# Database
MONGO_URI=your-mongodb-uri

# Frontend
REACT_APP_API_URL=http://localhost:5000
```

---

## ESTIMATED COMPLETION

- **Section 1-3:** 2 days (Password Reset, Remember Me, Session)
- **Section 4-6:** 2 days (OAuth Integrations)
- **Section 7-8:** 1 day (Error Handling & Security)
- **Section 9-10:** 2 days (Testing & Documentation)

**Total: 7 days (1 week)**

---

## NEXT STEPS

1. ✅ Review this checklist
2. ⏳ Confirm environment variables are ready
3. ⏳ Start Section 1: Password Reset
4. ⏳ Provide daily updates

