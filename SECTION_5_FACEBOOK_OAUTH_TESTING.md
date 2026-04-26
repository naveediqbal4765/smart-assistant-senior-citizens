# Section 5.5-5.6: Facebook OAuth Testing & Documentation

## Task 5.5: Complete Facebook OAuth Flow Testing

### Prerequisites
- Facebook App created and configured
- App ID and Secret obtained
- OAuth Redirect URIs configured
- Backend and frontend code deployed
- Database connected
- Facebook SDK loaded

---

## Testing Checklist

### 1. Backend Endpoint Testing

#### Test 1.1: POST /auth/facebook - Valid Token
**Objective:** Verify Facebook token verification and user creation/login

**Steps:**
1. Get a valid Facebook access token from Facebook Login
2. Send POST request to `/auth/facebook`:
```bash
curl -X POST http://localhost:5000/api/auth/facebook \
  -H "Content-Type: application/json" \
  -d '{
    "token": "valid_facebook_access_token",
    "rememberMe": false
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Facebook login successful",
  "data": {
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token",
    "rememberMeToken": null,
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

**Verification:**
- ✅ User created in database with facebookId
- ✅ Elder profile created automatically
- ✅ JWT tokens generated
- ✅ Response contains all required fields
- ✅ Profile picture from Facebook stored

---

#### Test 1.2: POST /auth/facebook - Invalid Token
**Objective:** Verify error handling for invalid tokens

**Steps:**
1. Send POST request with invalid token:
```bash
curl -X POST http://localhost:5000/api/auth/facebook \
  -H "Content-Type: application/json" \
  -d '{
    "token": "invalid_token",
    "rememberMe": false
  }'
```

**Expected Response (401):**
```json
{
  "success": false,
  "message": "Invalid Facebook token"
}
```

**Verification:**
- ✅ Returns 401 status
- ✅ Error message is clear
- ✅ No user created

---

#### Test 1.3: POST /auth/facebook - Missing Token
**Objective:** Verify validation for missing token

**Steps:**
1. Send POST request without token:
```bash
curl -X POST http://localhost:5000/api/auth/facebook \
  -H "Content-Type: application/json" \
  -d '{
    "rememberMe": false
  }'
```

**Expected Response (400):**
```json
{
  "success": false,
  "message": "Facebook token is required"
}
```

**Verification:**
- ✅ Returns 400 status
- ✅ Validation error message

---

#### Test 1.4: POST /auth/facebook - Existing User
**Objective:** Verify login for existing user

**Steps:**
1. Create a user via Facebook OAuth
2. Send same token again
3. Verify user is logged in (not created again)

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "isNewUser": false
    }
  }
}
```

**Verification:**
- ✅ User not duplicated
- ✅ lastLogin updated
- ✅ New tokens generated

---

#### Test 1.5: POST /auth/facebook/verify - Token Verification
**Objective:** Verify token without login

**Steps:**
```bash
curl -X POST http://localhost:5000/api/auth/facebook/verify \
  -H "Content-Type: application/json" \
  -d '{
    "token": "valid_facebook_access_token"
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "facebookId": "facebook_id",
    "email": "user@example.com",
    "name": "User Name",
    "picture": "url",
    "isVerified": true
  }
}
```

**Verification:**
- ✅ Token verified
- ✅ User info extracted
- ✅ No login performed

---

#### Test 1.6: POST /auth/facebook/link - Link Facebook Account
**Objective:** Verify linking Facebook to existing account

**Steps:**
```bash
curl -X POST http://localhost:5000/api/auth/facebook/link \
  -H "Content-Type: application/json" \
  -d '{
    "token": "valid_facebook_access_token",
    "userId": "existing_user_id"
  }'
```

**Expected Response (200):**
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

**Verification:**
- ✅ Facebook ID stored in user record
- ✅ Profile picture updated
- ✅ No duplicate linking

---

#### Test 1.7: POST /auth/facebook/unlink - Unlink Facebook Account
**Objective:** Verify unlinking Facebook account

**Steps:**
```bash
curl -X POST http://localhost:5000/api/auth/facebook/unlink \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_id"
  }'
```

**Expected Response (200):**
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

**Verification:**
- ✅ Facebook ID removed
- ✅ User can still login with password

---

### 2. Frontend Component Testing

#### Test 2.1: FacebookLoginButton Renders
**Objective:** Verify button component loads correctly

**Steps:**
1. Navigate to login page
2. Check if Facebook Sign-In button appears

**Expected:**
- ✅ Official Facebook Sign-In button visible
- ✅ Button is clickable
- ✅ No console errors
- ✅ Facebook SDK loaded

---

#### Test 2.2: Facebook Login Dialog Opens
**Objective:** Verify Facebook login dialog appears

**Steps:**
1. Click Facebook Sign-In button
2. Verify Facebook login dialog appears

**Expected:**
- ✅ Facebook authentication dialog opens
- ✅ User can select account
- ✅ No CORS errors
- ✅ Dialog is responsive

---

#### Test 2.3: Token Sent to Backend
**Objective:** Verify token is sent correctly

**Steps:**
1. Open browser DevTools (Network tab)
2. Click Facebook Sign-In button
3. Complete Facebook authentication
4. Check network request to `/auth/facebook`

**Expected:**
- ✅ POST request to `/auth/facebook`
- ✅ Request body contains token
- ✅ Response status 200
- ✅ Response contains JWT tokens

---

#### Test 2.4: User Redirected to Dashboard
**Objective:** Verify redirect after successful login

**Steps:**
1. Complete Facebook authentication
2. Check URL and page content

**Expected:**
- ✅ Redirected to `/dashboard/elder` (or appropriate role)
- ✅ Dashboard loads correctly
- ✅ User info displayed
- ✅ Navigation works

---

#### Test 2.5: Error Handling
**Objective:** Verify error messages display

**Steps:**
1. Trigger error (invalid token, network error, etc.)
2. Check error message

**Expected:**
- ✅ Toast notification shows error
- ✅ User stays on login page
- ✅ Can retry login
- ✅ Error message is clear

---

#### Test 2.6: Loading States
**Objective:** Verify loading indicators show

**Steps:**
1. Click Facebook Sign-In button
2. Observe loading state during authentication

**Expected:**
- ✅ Button shows loading state
- ✅ Button is disabled during loading
- ✅ Loading text displays
- ✅ No duplicate requests

---

### 3. Integration Testing

#### Test 3.1: Complete Login Flow
**Objective:** End-to-end Facebook OAuth login

**Steps:**
1. Navigate to login page
2. Click Facebook Sign-In
3. Authenticate with Facebook
4. Verify redirect to dashboard
5. Check user data in dashboard

**Expected:**
- ✅ All steps complete successfully
- ✅ User data correct
- ✅ Tokens stored in localStorage
- ✅ Dashboard displays user info
- ✅ Navigation works

---

#### Test 3.2: Remember Me with Facebook OAuth
**Objective:** Verify Remember Me works with Facebook login

**Steps:**
1. Check "Remember Me" checkbox
2. Complete Facebook authentication
3. Close browser
4. Reopen and navigate to app
5. Verify auto-login

**Expected:**
- ✅ rememberMeToken stored
- ✅ Auto-login works
- ✅ User stays logged in
- ✅ Dashboard loads automatically

---

#### Test 3.3: Token Refresh
**Objective:** Verify JWT refresh works after Facebook login

**Steps:**
1. Login via Facebook
2. Wait for token to expire (or manually trigger refresh)
3. Make API request
4. Verify new token generated

**Expected:**
- ✅ New access token generated
- ✅ API request succeeds
- ✅ No re-login required
- ✅ Refresh token rotated

---

#### Test 3.4: Logout After Facebook Login
**Objective:** Verify logout clears all tokens

**Steps:**
1. Login via Facebook
2. Click logout button
3. Try to access protected route
4. Verify redirect to login

**Expected:**
- ✅ All tokens cleared
- ✅ Redirect to login page
- ✅ Cannot access dashboard
- ✅ rememberMeToken cleared

---

#### Test 3.5: Multiple Logins
**Objective:** Verify multiple users can login

**Steps:**
1. Login with Facebook Account A
2. Logout
3. Login with Facebook Account B
4. Verify correct user data

**Expected:**
- ✅ Both users created/logged in correctly
- ✅ User data is separate
- ✅ No data mixing

---

### 4. Security Testing

#### Test 4.1: Token Validation
**Objective:** Verify invalid tokens are rejected

**Steps:**
1. Modify token in localStorage
2. Try to make API request
3. Verify error

**Expected:**
- ✅ 401 Unauthorized error
- ✅ Redirect to login
- ✅ No data exposed

---

#### Test 4.2: CORS Handling
**Objective:** Verify CORS works correctly

**Steps:**
1. Check browser console for CORS errors
2. Verify requests succeed

**Expected:**
- ✅ No CORS errors
- ✅ Requests complete successfully
- ✅ Facebook SDK handles CORS

---

#### Test 4.3: XSS Protection
**Objective:** Verify tokens not exposed in DOM

**Steps:**
1. Inspect page HTML
2. Search for token values
3. Check localStorage access

**Expected:**
- ✅ Tokens not in HTML
- ✅ Tokens only in localStorage
- ✅ No XSS vulnerabilities

---

#### Test 4.4: CSRF Protection
**Objective:** Verify CSRF tokens used

**Steps:**
1. Check request headers
2. Verify CSRF token present

**Expected:**
- ✅ CSRF token in headers
- ✅ Token validated on backend
- ✅ No CSRF vulnerabilities

---

### 5. Edge Cases

#### Test 5.1: Multiple Tabs
**Objective:** Verify behavior with multiple browser tabs

**Steps:**
1. Login in Tab 1
2. Open Tab 2
3. Verify both tabs have access
4. Logout in Tab 1
5. Verify Tab 2 also logs out

**Expected:**
- ✅ Both tabs share session
- ✅ Logout affects all tabs
- ✅ Tokens synced across tabs

---

#### Test 5.2: Network Failure
**Objective:** Verify error handling for network issues

**Steps:**
1. Disable network
2. Try to login via Facebook
3. Verify error message

**Expected:**
- ✅ Clear error message
- ✅ User can retry
- ✅ No hanging requests

---

#### Test 5.3: Slow Network
**Objective:** Verify loading states

**Steps:**
1. Throttle network (DevTools)
2. Complete Facebook authentication
3. Observe loading indicators

**Expected:**
- ✅ Loading spinner shows
- ✅ No duplicate requests
- ✅ Eventually completes

---

#### Test 5.4: Expired Token
**Objective:** Verify handling of expired tokens

**Steps:**
1. Login via Facebook
2. Wait for token to expire
3. Try to make API request
4. Verify refresh or re-login

**Expected:**
- ✅ Token refreshed automatically
- ✅ Or redirect to login
- ✅ No data loss

---

#### Test 5.5: Account Linking
**Objective:** Verify linking Facebook to existing account

**Steps:**
1. Create account with email/password
2. Link Facebook account
3. Login with Facebook
4. Verify same account

**Expected:**
- ✅ Accounts linked correctly
- ✅ Can login with either method
- ✅ User data consistent

---

### 6. Performance Testing

#### Test 6.1: Login Speed
**Objective:** Verify login completes quickly

**Steps:**
1. Measure time from click to dashboard load
2. Target: < 5 seconds

**Expected:**
- ✅ Facebook popup opens: < 1 second
- ✅ Token verification: < 500ms
- ✅ User creation: < 1 second
- ✅ Redirect to dashboard: < 2 seconds
- ✅ Total login time: < 5 seconds

---

#### Test 6.2: Token Refresh Speed
**Objective:** Verify token refresh is fast

**Steps:**
1. Measure time for token refresh
2. Target: < 500ms

**Expected:**
- ✅ Refresh completes quickly
- ✅ No noticeable delay
- ✅ User doesn't notice

---

### 7. Accessibility Testing

#### Test 7.1: Keyboard Navigation
**Objective:** Verify button accessible via keyboard

**Steps:**
1. Tab to Facebook button
2. Press Enter
3. Verify dialog opens

**Expected:**
- ✅ Button focusable
- ✅ Enter key works
- ✅ Focus visible

---

#### Test 7.2: Screen Reader
**Objective:** Verify screen reader compatibility

**Steps:**
1. Enable screen reader
2. Navigate to button
3. Verify button announced

**Expected:**
- ✅ Button announced
- ✅ Purpose clear
- ✅ Error messages announced

---

### 8. Browser Compatibility

Test on:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## Test Results Template

```
Test Date: ___________
Tester: ___________
Environment: Development / Staging / Production

Test Results:
- Test 1.1: ✅ PASS / ❌ FAIL
- Test 1.2: ✅ PASS / ❌ FAIL
- Test 1.3: ✅ PASS / ❌ FAIL
- Test 1.4: ✅ PASS / ❌ FAIL
- Test 1.5: ✅ PASS / ❌ FAIL
- Test 1.6: ✅ PASS / ❌ FAIL
- Test 1.7: ✅ PASS / ❌ FAIL
- Test 2.1: ✅ PASS / ❌ FAIL
- Test 2.2: ✅ PASS / ❌ FAIL
- Test 2.3: ✅ PASS / ❌ FAIL
- Test 2.4: ✅ PASS / ❌ FAIL
- Test 2.5: ✅ PASS / ❌ FAIL
- Test 2.6: ✅ PASS / ❌ FAIL
- Test 3.1: ✅ PASS / ❌ FAIL
- Test 3.2: ✅ PASS / ❌ FAIL
- Test 3.3: ✅ PASS / ❌ FAIL
- Test 3.4: ✅ PASS / ❌ FAIL
- Test 3.5: ✅ PASS / ❌ FAIL
- Test 4.1: ✅ PASS / ❌ FAIL
- Test 4.2: ✅ PASS / ❌ FAIL
- Test 4.3: ✅ PASS / ❌ FAIL
- Test 4.4: ✅ PASS / ❌ FAIL
- Test 5.1: ✅ PASS / ❌ FAIL
- Test 5.2: ✅ PASS / ❌ FAIL
- Test 5.3: ✅ PASS / ❌ FAIL
- Test 5.4: ✅ PASS / ❌ FAIL
- Test 5.5: ✅ PASS / ❌ FAIL
- Test 6.1: ✅ PASS / ❌ FAIL
- Test 6.2: ✅ PASS / ❌ FAIL
- Test 7.1: ✅ PASS / ❌ FAIL
- Test 7.2: ✅ PASS / ❌ FAIL

Overall Result: ✅ ALL PASS / ❌ SOME FAILURES

Issues Found:
1. ___________
2. ___________
3. ___________

Notes:
___________
```

---

## Troubleshooting

### Issue: "Invalid Facebook token"
**Solution:**
- Verify App ID is correct
- Check token hasn't expired
- Ensure token is from correct Facebook app
- Verify Graph API endpoint is correct

### Issue: "CORS error"
**Solution:**
- Add redirect URI to Facebook App settings
- Check backend CORS configuration
- Verify frontend URL matches
- Facebook SDK handles CORS on their side

### Issue: "User not created"
**Solution:**
- Check database connection
- Verify User model has facebookId field
- Check Elder profile creation logic
- Check email is provided by Facebook

### Issue: "Token not stored in localStorage"
**Solution:**
- Check browser localStorage is enabled
- Verify login response contains tokens
- Check for JavaScript errors in console
- Verify token is returned from backend

### Issue: "Facebook SDK not loading"
**Solution:**
- Check internet connection
- Verify App ID is correct
- Check browser console for errors
- Try clearing browser cache

### Issue: "Redirect URI mismatch"
**Solution:**
- Verify redirect URI in Facebook App settings
- Include protocol (http/https)
- Include port number if not standard
- Check for trailing slashes
- Ensure exact match with frontend URL

---

## Performance Metrics

**Target Metrics:**
- Facebook popup opens: < 1 second
- Token verification: < 500ms
- User creation: < 1 second
- Redirect to dashboard: < 2 seconds
- Total login time: < 5 seconds
- Token refresh: < 500ms

---

## Security Checklist

- ✅ Facebook token verified via Graph API
- ✅ JWT tokens generated securely
- ✅ Tokens stored in localStorage (not cookies)
- ✅ CSRF protection implemented
- ✅ XSS protection implemented
- ✅ Rate limiting on endpoints
- ✅ Error messages don't expose sensitive info
- ✅ User data validated before storage
- ✅ Password not required for OAuth
- ✅ Account linking prevents duplicates

---

## Sign-Off

**Tested By:** ___________  
**Date:** ___________  
**Status:** ✅ APPROVED / ❌ NEEDS FIXES

---

**Next Steps:**
- [ ] Deploy to staging
- [ ] Deploy to production
- [ ] Monitor error logs
- [ ] Gather user feedback
- [ ] Begin Phase 2 - User Profile Management

