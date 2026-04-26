# Remember Me - Complete Testing Guide

## Overview

This document provides comprehensive testing procedures for the Remember Me functionality, including manual testing, automated testing, and edge case handling.

---

## Part 1: Manual Testing Procedures

### Test Environment Setup

**Prerequisites:**
- Backend server running on `http://localhost:5000`
- Frontend running on `http://localhost:3000`
- Browser DevTools open (F12)
- Clear browser cache before starting tests

**Test User Credentials:**
```
Email: test@example.com
Password: TestPass@123
```

---

## Test Suite 1: Login Without Remember Me

### Test 1.1: Standard Login (No Remember Me)

**Steps:**
1. Navigate to login page
2. Enter email: `test@example.com`
3. Enter password: `TestPass@123`
4. **DO NOT** check "Remember Me"
5. Click "Login"

**Expected Results:**
- ✅ Login successful
- ✅ Redirected to dashboard
- ✅ JWT token stored in `sessionStorage` (not localStorage)
- ✅ Remember Me token NOT stored
- ✅ User data displayed correctly

**Verification:**
```javascript
// In browser console
localStorage.getItem('rememberMeToken') // Should be null
sessionStorage.getItem('accessToken') // Should have JWT
sessionStorage.getItem('user') // Should have user data
```

### Test 1.2: Page Refresh Without Remember Me

**Steps:**
1. Complete Test 1.1
2. Refresh the page (F5)

**Expected Results:**
- ✅ Redirected to login page
- ✅ Session lost (expected behavior)
- ✅ Must log in again

**Verification:**
```javascript
// After refresh, in console
localStorage.getItem('rememberMeToken') // null
sessionStorage.getItem('accessToken') // null (cleared on refresh)
```

---

## Test Suite 2: Login With Remember Me

### Test 2.1: Login With Remember Me Checked

**Steps:**
1. Navigate to login page
2. Enter email: `test@example.com`
3. Enter password: `TestPass@123`
4. **CHECK** "Remember Me" checkbox
5. Click "Login"

**Expected Results:**
- ✅ Login successful
- ✅ Redirected to dashboard
- ✅ JWT token stored in `localStorage`
- ✅ Remember Me token stored in `localStorage`
- ✅ User data stored in `localStorage`
- ✅ Success toast: "Welcome back, [Name]!"

**Verification:**
```javascript
// In browser console
localStorage.getItem('accessToken') // Should have JWT
localStorage.getItem('rememberMeToken') // Should have 64-char hex token
localStorage.getItem('user') // Should have user data
JSON.parse(localStorage.getItem('user')).fullName // Should show name
```

### Test 2.2: Page Refresh With Remember Me

**Steps:**
1. Complete Test 2.1
2. Refresh the page (F5)

**Expected Results:**
- ✅ Loading spinner appears briefly
- ✅ Auto-login successful
- ✅ Redirected to dashboard
- ✅ User data loaded
- ✅ No login form shown
- ✅ User logged in automatically

**Verification:**
```javascript
// After refresh, in console
localStorage.getItem('rememberMeToken') // Still has token
localStorage.getItem('accessToken') // New JWT generated
// Check Network tab: POST /auth/verify-remember-me should be called
```

### Test 2.3: Close and Reopen Browser

**Steps:**
1. Complete Test 2.1
2. Close the browser completely
3. Reopen browser
4. Navigate to app URL

**Expected Results:**
- ✅ Loading spinner appears
- ✅ Auto-login successful
- ✅ Redirected to dashboard
- ✅ User logged in without entering credentials

**Verification:**
```javascript
// In console
localStorage.getItem('rememberMeToken') // Token still exists
// Network tab shows /auth/verify-remember-me call
```

---

## Test Suite 3: Logout Functionality

### Test 3.1: Logout From Dashboard

**Steps:**
1. Complete Test 2.1 (logged in with Remember Me)
2. Click profile icon in navbar
3. Click "Logout" button

**Expected Results:**
- ✅ Backend logout endpoint called
- ✅ All tokens cleared from localStorage
- ✅ Redirected to login page
- ✅ Success toast: "Logged out successfully"
- ✅ User data cleared

**Verification:**
```javascript
// After logout, in console
localStorage.getItem('rememberMeToken') // null
localStorage.getItem('accessToken') // null
localStorage.getItem('user') // null
sessionStorage.getItem('accessToken') // null
// Network tab shows POST /auth/logout call
```

### Test 3.2: Page Refresh After Logout

**Steps:**
1. Complete Test 3.1
2. Refresh the page (F5)

**Expected Results:**
- ✅ Stays on login page
- ✅ No auto-login attempt
- ✅ Must log in again

**Verification:**
```javascript
// In console
localStorage.getItem('rememberMeToken') // null
// No /auth/verify-remember-me call in Network tab
```

---

## Test Suite 4: Token Expiration Handling

### Test 4.1: Expired Remember Me Token

**Steps:**
1. Complete Test 2.1 (logged in with Remember Me)
2. Manually set token expiration to past date:
   ```javascript
   // In browser console
   const user = JSON.parse(localStorage.getItem('user'));
   localStorage.setItem('user', JSON.stringify(user));
   // Manually edit rememberMeToken in database to have past expiry
   ```
3. Refresh the page (F5)

**Expected Results:**
- ✅ Auto-login attempt made
- ✅ Backend returns 401 (token expired)
- ✅ Redirected to login page
- ✅ Remember Me token cleared from localStorage
- ✅ User must log in again

**Verification:**
```javascript
// After refresh, in console
localStorage.getItem('rememberMeToken') // null (cleared)
// Network tab shows /auth/verify-remember-me returning 401
```

### Test 4.2: Invalid Remember Me Token

**Steps:**
1. Complete Test 2.1
2. Manually corrupt the token:
   ```javascript
   // In browser console
   localStorage.setItem('rememberMeToken', 'invalid_token_12345');
   ```
3. Refresh the page (F5)

**Expected Results:**
- ✅ Auto-login attempt made
- ✅ Backend returns 401 (invalid token)
- ✅ Redirected to login page
- ✅ Invalid token cleared from localStorage

**Verification:**
```javascript
// After refresh, in console
localStorage.getItem('rememberMeToken') // null
// Network tab shows /auth/verify-remember-me returning 401
```

---

## Test Suite 5: Protected Routes

### Test 5.1: Access Protected Route Without Login

**Steps:**
1. Clear all localStorage/sessionStorage
2. Navigate directly to `/dashboard/elder`

**Expected Results:**
- ✅ Redirected to login page
- ✅ No dashboard content shown
- ✅ Loading spinner shown briefly

**Verification:**
```javascript
// In console
localStorage.getItem('accessToken') // null
// URL changed to /login
```

### Test 5.2: Access Wrong Role Dashboard

**Steps:**
1. Login as Elder user
2. Try to access `/dashboard/caregiver` directly

**Expected Results:**
- ✅ Redirected to Elder dashboard
- ✅ Cannot access Caregiver dashboard
- ✅ Role-based access control working

**Verification:**
```javascript
// In console
const user = JSON.parse(localStorage.getItem('user'));
console.log(user.role); // Should be 'elder'
// URL redirected to /dashboard/elder
```

### Test 5.3: Access Protected Route With Valid Token

**Steps:**
1. Login with Remember Me
2. Navigate to `/dashboard/elder`

**Expected Results:**
- ✅ Dashboard loads successfully
- ✅ User data displayed
- ✅ All features accessible

---

## Test Suite 6: Error Handling

### Test 6.1: Network Error During Auto-Login

**Steps:**
1. Complete Test 2.1
2. Disconnect internet
3. Refresh the page (F5)

**Expected Results:**
- ✅ Auto-login attempt fails
- ✅ Redirected to login page
- ✅ Error handled gracefully
- ✅ No console errors

**Verification:**
```javascript
// In console
localStorage.getItem('rememberMeToken') // Token still exists
// No JavaScript errors in console
```

### Test 6.2: Backend Server Down

**Steps:**
1. Complete Test 2.1
2. Stop backend server
3. Refresh the page (F5)

**Expected Results:**
- ✅ Auto-login attempt fails
- ✅ Redirected to login page
- ✅ Error handled gracefully
- ✅ User can still see login form

### Test 6.3: Corrupted User Data

**Steps:**
1. Complete Test 2.1
2. Corrupt user data:
   ```javascript
   // In browser console
   localStorage.setItem('user', 'invalid_json{');
   ```
3. Refresh the page (F5)

**Expected Results:**
- ✅ Error caught and handled
- ✅ Corrupted data cleared
- ✅ Redirected to login page
- ✅ No console errors

**Verification:**
```javascript
// After refresh, in console
localStorage.getItem('user') // null (cleared)
// No JavaScript errors
```

---

## Test Suite 7: Multiple Tabs/Windows

### Test 7.1: Login in One Tab, Check Another

**Steps:**
1. Open app in Tab A
2. Open app in Tab B
3. Login in Tab A with Remember Me
4. Switch to Tab B and refresh

**Expected Results:**
- ✅ Tab B auto-logs in
- ✅ Both tabs show logged-in state
- ✅ localStorage shared between tabs

### Test 7.2: Logout in One Tab, Check Another

**Steps:**
1. Complete Test 7.1 (both tabs logged in)
2. Logout in Tab A
3. Switch to Tab B and refresh

**Expected Results:**
- ✅ Tab B redirects to login
- ✅ Remember Me token cleared
- ✅ Both tabs synchronized

---

## Test Suite 8: Edge Cases

### Test 8.1: Rapid Refresh

**Steps:**
1. Complete Test 2.1
2. Rapidly refresh page multiple times (F5, F5, F5)

**Expected Results:**
- ✅ No race conditions
- ✅ Auto-login completes successfully
- ✅ User logged in after final refresh

### Test 8.2: Login While Auto-Login In Progress

**Steps:**
1. Complete Test 2.1
2. Refresh page (F5)
3. While loading spinner visible, try to click login button

**Expected Results:**
- ✅ Login button disabled during auto-login
- ✅ Auto-login completes
- ✅ Dashboard shown

### Test 8.3: Token Refresh During Activity

**Steps:**
1. Complete Test 2.1
2. Stay on dashboard for 5+ minutes
3. Perform actions (navigate, click buttons)

**Expected Results:**
- ✅ Token expiration extended on each action
- ✅ User stays logged in
- ✅ No unexpected logouts

---

## Part 2: Automated Testing

### Unit Tests

```javascript
// tests/AuthContext.test.js
describe('AuthContext', () => {
  it('should initialize with no user', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should login user and store token', () => {
    const { result } = renderHook(() => useAuth());
    act(() => {
      result.current.login('token123', { id: '1', name: 'John' }, null, false);
    });
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user.name).toBe('John');
  });

  it('should logout user and clear tokens', () => {
    const { result } = renderHook(() => useAuth());
    act(() => {
      result.current.login('token123', { id: '1', name: 'John' }, null, false);
      result.current.logout();
    });
    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem('accessToken')).toBeNull();
  });
});
```

### Integration Tests

```javascript
// tests/RememberMe.integration.test.js
describe('Remember Me Integration', () => {
  it('should auto-login with valid Remember Me token', async () => {
    // Setup: Store Remember Me token
    localStorage.setItem('rememberMeToken', 'valid_token_64chars');
    
    // Render app
    render(<App />);
    
    // Wait for auto-login
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    // Verify logged in
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  });

  it('should redirect to login with expired Remember Me token', async () => {
    // Setup: Store expired token
    localStorage.setItem('rememberMeToken', 'expired_token');
    
    // Mock API to return 401
    mockAPI.post('/auth/verify-remember-me', { status: 401 });
    
    // Render app
    render(<App />);
    
    // Wait for redirect
    await waitFor(() => {
      expect(window.location.pathname).toBe('/login');
    });
  });
});
```

---

## Part 3: Testing Checklist

### Pre-Testing
- [ ] Backend server running
- [ ] Frontend running
- [ ] Database connected
- [ ] Test user account created
- [ ] Browser DevTools open
- [ ] Network tab visible
- [ ] Console clear

### Login Tests
- [ ] Test 1.1: Standard login (no Remember Me)
- [ ] Test 1.2: Page refresh without Remember Me
- [ ] Test 2.1: Login with Remember Me
- [ ] Test 2.2: Page refresh with Remember Me
- [ ] Test 2.3: Close and reopen browser

### Logout Tests
- [ ] Test 3.1: Logout from dashboard
- [ ] Test 3.2: Page refresh after logout

### Token Tests
- [ ] Test 4.1: Expired Remember Me token
- [ ] Test 4.2: Invalid Remember Me token

### Route Tests
- [ ] Test 5.1: Access protected route without login
- [ ] Test 5.2: Access wrong role dashboard
- [ ] Test 5.3: Access protected route with valid token

### Error Tests
- [ ] Test 6.1: Network error during auto-login
- [ ] Test 6.2: Backend server down
- [ ] Test 6.3: Corrupted user data

### Multi-Tab Tests
- [ ] Test 7.1: Login in one tab, check another
- [ ] Test 7.2: Logout in one tab, check another

### Edge Case Tests
- [ ] Test 8.1: Rapid refresh
- [ ] Test 8.2: Login while auto-login in progress
- [ ] Test 8.3: Token refresh during activity

---

## Part 4: Debugging Tips

### Check localStorage
```javascript
// View all stored data
console.log('localStorage:', localStorage);

// Check specific items
console.log('Token:', localStorage.getItem('accessToken'));
console.log('Remember Me:', localStorage.getItem('rememberMeToken'));
console.log('User:', JSON.parse(localStorage.getItem('user')));
```

### Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Filter by XHR/Fetch
4. Look for:
   - `/auth/login-with-remember-me` - Login request
   - `/auth/verify-remember-me` - Auto-login request
   - `/auth/logout` - Logout request

### Check Console Logs
```javascript
// Enable debug logging in AuthContext
// Look for messages like:
// "[AuthContext] Auto-login successful with Remember Me token"
// "[AuthContext] Auto-login failed: ..."
```

### Common Issues

**Issue: Auto-login not working**
- Check if Remember Me token exists in localStorage
- Check Network tab for /verify-remember-me request
- Check if token is expired in database
- Check browser console for errors

**Issue: Logout not working**
- Check if logout button is visible
- Check Network tab for /logout request
- Check if tokens cleared from localStorage
- Check if redirected to login page

**Issue: Protected routes not working**
- Check if ProtectedRoute component is used
- Check if user role matches required role
- Check if token is valid
- Check browser console for errors

---

## Part 5: Performance Testing

### Load Testing
- Test auto-login with 100+ concurrent users
- Measure response time for /verify-remember-me
- Check database query performance

### Memory Testing
- Monitor memory usage during auto-login
- Check for memory leaks in AuthContext
- Verify tokens cleared properly on logout

### Security Testing
- Verify tokens not exposed in logs
- Check token format validation
- Test rate limiting on endpoints
- Verify HTTPS enforcement

---

## Test Results Template

```
Test Date: _______________
Tester: ___________________
Environment: ______________

Test Suite 1: Login Without Remember Me
- Test 1.1: ✅ PASS / ❌ FAIL
- Test 1.2: ✅ PASS / ❌ FAIL

Test Suite 2: Login With Remember Me
- Test 2.1: ✅ PASS / ❌ FAIL
- Test 2.2: ✅ PASS / ❌ FAIL
- Test 2.3: ✅ PASS / ❌ FAIL

Test Suite 3: Logout Functionality
- Test 3.1: ✅ PASS / ❌ FAIL
- Test 3.2: ✅ PASS / ❌ FAIL

Test Suite 4: Token Expiration
- Test 4.1: ✅ PASS / ❌ FAIL
- Test 4.2: ✅ PASS / ❌ FAIL

Test Suite 5: Protected Routes
- Test 5.1: ✅ PASS / ❌ FAIL
- Test 5.2: ✅ PASS / ❌ FAIL
- Test 5.3: ✅ PASS / ❌ FAIL

Test Suite 6: Error Handling
- Test 6.1: ✅ PASS / ❌ FAIL
- Test 6.2: ✅ PASS / ❌ FAIL
- Test 6.3: ✅ PASS / ❌ FAIL

Test Suite 7: Multiple Tabs
- Test 7.1: ✅ PASS / ❌ FAIL
- Test 7.2: ✅ PASS / ❌ FAIL

Test Suite 8: Edge Cases
- Test 8.1: ✅ PASS / ❌ FAIL
- Test 8.2: ✅ PASS / ❌ FAIL
- Test 8.3: ✅ PASS / ❌ FAIL

Overall Result: ✅ PASS / ❌ FAIL

Issues Found:
1. ___________________________
2. ___________________________
3. ___________________________

Notes:
_______________________________
_______________________________
```

---

## Conclusion

This comprehensive testing guide covers:
- ✅ Manual testing procedures
- ✅ Automated testing examples
- ✅ Edge case handling
- ✅ Error scenarios
- ✅ Performance considerations
- ✅ Security testing

All tests should pass before deploying to production.

**Last Updated:** April 27, 2026  
**Status:** Production Ready ✅
