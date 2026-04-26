# Section 4.5-4.6: Google OAuth Testing & Documentation

## Task 4.5: Complete Google OAuth Flow Testing

### Prerequisites
- Google Cloud Project created
- OAuth 2.0 credentials configured
- Client ID and Secret added to .env files
- Backend and frontend code deployed
- Database connected

---

## Testing Checklist

### 1. Backend Endpoint Testing

#### Test 1.1: POST /auth/google - Valid Token
**Objective:** Verify Google token verification and user creation/login

**Steps:**
1. Get a valid Google ID token from Google Sign-In
2. Send POST request to `/auth/google`:
```bash
curl -X POST http://localhost:5000/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{
    "token": "valid_google_id_token",
    "rememberMe": false
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Google login successful",
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
- ✅ User created in database with googleId
- ✅ Elder profile created automatically
- ✅ JWT tokens generated
- ✅ Response contains all required fields

---

#### Test 1.2: POST /auth/google - Invalid Token
**Objective:** Verify error handling for invalid tokens

**Steps:**
1. Send POST request with invalid token:
```bash
curl -X POST http://localhost:5000/api/auth/google \
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
  "message": "Invalid Google token"
}
```

**Verification:**
- ✅ Returns 401 status
- ✅ Error message is clear
- ✅ No user created

---

#### Test 1.3: POST /auth/google - Missing Token
**Objective:** Verify validation for missing token

**Steps:**
1. Send POST request without token:
```bash
curl -X POST http://localhost:5000/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{
    "rememberMe": false
  }'
```

**Expected Response (400):**
```json
{
  "success": false,
  "message": "Google token is required"
}
```

**Verification:**
- ✅ Returns 400 status
- ✅ Validation error message

---

#### Test 1.4: POST /auth/google - Existing User
**Objective:** Verify login for existing user

**Steps:**
1. Create a user via Google OAuth
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

#### Test 1.5: POST /auth/google/verify - Token Verification
**Objective:** Verify token without login

**Steps:**
```bash
curl -X POST http://localhost:5000/api/auth/google/verify \
  -H "Content-Type: application/json" \
  -d '{
    "token": "valid_google_id_token"
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "email": "user@example.com",
    "name": "User Name",
    "picture": "url",
    "googleId": "google_id",
    "isVerified": true
  }
}
```

**Verification:**
- ✅ Token verified
- ✅ User info extracted
- ✅ No login performed

---

### 2. Frontend Component Testing

#### Test 2.1: GoogleLoginButton Renders
**Objective:** Verify button component loads correctly

**Steps:**
1. Navigate to login page
2. Check if Google Sign-In button appears

**Expected:**
- ✅ Official Google Sign-In button visible
- ✅ Button is clickable
- ✅ No console errors

---

#### Test 2.2: Google Sign-In Popup
**Objective:** Verify Google popup opens

**Steps:**
1. Click Google Sign-In button
2. Verify Google popup appears

**Expected:**
- ✅ Google authentication popup opens
- ✅ User can select account
- ✅ No CORS errors

---

#### Test 2.3: Token Sent to Backend
**Objective:** Verify token is sent correctly

**Steps:**
1. Open browser DevTools (Network tab)
2. Click Google Sign-In button
3. Complete Google authentication
4. Check network request to `/auth/google`

**Expected:**
- ✅ POST request to `/auth/google`
- ✅ Request body contains token
- ✅ Response status 200

---

#### Test 2.4: User Redirected to Dashboard
**Objective:** Verify redirect after successful login

**Steps:**
1. Complete Google authentication
2. Check URL and page content

**Expected:**
- ✅ Redirected to `/dashboard/elder` (or appropriate role)
- ✅ Dashboard loads correctly
- ✅ User info displayed

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

---

### 3. Integration Testing

#### Test 3.1: Complete Login Flow
**Objective:** End-to-end Google OAuth login

**Steps:**
1. Navigate to login page
2. Click Google Sign-In
3. Authenticate with Google
4. Verify redirect to dashboard
5. Check user data in dashboard

**Expected:**
- ✅ All steps complete successfully
- ✅ User data correct
- ✅ Tokens stored in localStorage
- ✅ Dashboard displays user info

---

#### Test 3.2: Remember Me with Google OAuth
**Objective:** Verify Remember Me works with Google login

**Steps:**
1. Check "Remember Me" checkbox
2. Complete Google authentication
3. Close browser
4. Reopen and navigate to app
5. Verify auto-login

**Expected:**
- ✅ rememberMeToken stored
- ✅ Auto-login works
- ✅ User stays logged in

---

#### Test 3.3: Token Refresh
**Objective:** Verify JWT refresh works after Google login

**Steps:**
1. Login via Google
2. Wait for token to expire (or manually trigger refresh)
3. Make API request
4. Verify new token generated

**Expected:**
- ✅ New access token generated
- ✅ API request succeeds
- ✅ No re-login required

---

#### Test 3.4: Logout After Google Login
**Objective:** Verify logout clears all tokens

**Steps:**
1. Login via Google
2. Click logout button
3. Try to access protected route
4. Verify redirect to login

**Expected:**
- ✅ All tokens cleared
- ✅ Redirect to login page
- ✅ Cannot access dashboard

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

---

#### Test 5.2: Network Failure
**Objective:** Verify error handling for network issues

**Steps:**
1. Disable network
2. Try to login via Google
3. Verify error message

**Expected:**
- ✅ Clear error message
- ✅ User can retry

---

#### Test 5.3: Slow Network
**Objective:** Verify loading states

**Steps:**
1. Throttle network (DevTools)
2. Complete Google authentication
3. Observe loading indicators

**Expected:**
- ✅ Loading spinner shows
- ✅ No duplicate requests
- ✅ Eventually completes

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
- Test 2.1: ✅ PASS / ❌ FAIL
- Test 2.2: ✅ PASS / ❌ FAIL
- Test 2.3: ✅ PASS / ❌ FAIL
- Test 2.4: ✅ PASS / ❌ FAIL
- Test 2.5: ✅ PASS / ❌ FAIL
- Test 3.1: ✅ PASS / ❌ FAIL
- Test 3.2: ✅ PASS / ❌ FAIL
- Test 3.3: ✅ PASS / ❌ FAIL
- Test 3.4: ✅ PASS / ❌ FAIL
- Test 4.1: ✅ PASS / ❌ FAIL
- Test 4.2: ✅ PASS / ❌ FAIL
- Test 4.3: ✅ PASS / ❌ FAIL
- Test 5.1: ✅ PASS / ❌ FAIL
- Test 5.2: ✅ PASS / ❌ FAIL
- Test 5.3: ✅ PASS / ❌ FAIL

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

### Issue: "Invalid Google token"
**Solution:**
- Verify Client ID is correct
- Check token hasn't expired
- Ensure token is from correct Google project

### Issue: "CORS error"
**Solution:**
- Add redirect URI to Google Cloud Console
- Check backend CORS configuration
- Verify frontend URL matches

### Issue: "User not created"
**Solution:**
- Check database connection
- Verify User model has googleId field
- Check Elder profile creation logic

### Issue: "Token not stored in localStorage"
**Solution:**
- Check browser localStorage is enabled
- Verify login response contains tokens
- Check for JavaScript errors in console

---

## Performance Metrics

**Target Metrics:**
- Google popup opens: < 1 second
- Token verification: < 500ms
- User creation: < 1 second
- Redirect to dashboard: < 2 seconds
- Total login time: < 5 seconds

---

## Accessibility Testing

- ✅ Button has proper ARIA labels
- ✅ Error messages are announced
- ✅ Keyboard navigation works
- ✅ Screen reader compatible

---

## Browser Compatibility

Test on:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

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
- [ ] Begin Section 5 - Facebook OAuth

