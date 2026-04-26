# Section 5: Facebook OAuth Integration - Setup Guide

## Task 5.1: Setup Facebook App Credentials

### Step 1: Create Facebook Developer Account

1. **Go to Facebook Developers**
   - URL: https://developers.facebook.com/
   - Click "Get Started"
   - Sign in with your Facebook account (or create one)

2. **Create a New App**
   - Click "My Apps" → "Create App"
   - Choose app type: "Consumer"
   - Fill in app details:
     - **App Name:** Smart Assistant Senior Citizens
     - **App Contact Email:** smartassistantforseniorcitizen@gmail.com
     - **App Purpose:** Select "Other"
   - Click "Create App"

3. **Verify Your Identity**
   - Complete the security check
   - Verify your email address

---

### Step 2: Configure Facebook Login

1. **Add Facebook Login Product**
   - In your app dashboard, click "Add Product"
   - Search for "Facebook Login"
   - Click "Set Up"
   - Choose "Web" as your platform

2. **Configure OAuth Redirect URIs**
   - Go to Settings → Basic
   - Copy your **App ID** and **App Secret** (save these!)
   - Go to Settings → Basic → App Domains
   - Add your domain:
     ```
     localhost
     yourdomain.com
     ```

3. **Configure Valid OAuth Redirect URIs**
   - Go to Facebook Login → Settings
   - Add Valid OAuth Redirect URIs:
     ```
     http://localhost:3000/auth/facebook/callback
     http://localhost:3000/login
     https://yourdomain.com/auth/facebook/callback
     https://yourdomain.com/login
     ```

---

### Step 3: Get Required Permissions

1. **Request Permissions**
   - Go to Tools → Graph API Explorer
   - Select your app from dropdown
   - Click "Get User Access Token"
   - Select permissions:
     - `email`
     - `public_profile`
   - Click "Generate Access Token"

2. **Test Token**
   - In Graph API Explorer, run:
     ```
     GET /me?fields=id,name,email,picture
     ```
   - Verify you get user data back

---

### Step 4: Add Credentials to Environment

1. **Update Backend .env**
   ```
   # Facebook OAuth
   FACEBOOK_APP_ID=your_app_id_here
   FACEBOOK_APP_SECRET=your_app_secret_here
   FACEBOOK_REDIRECT_URI=http://localhost:3000/auth/facebook/callback
   ```

2. **Update Frontend .env**
   ```
   REACT_APP_FACEBOOK_APP_ID=your_app_id_here
   ```

---

### Step 5: Install Required Packages

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

### Step 6: Verify Setup

**Test Facebook Login:**
1. Go to https://developers.facebook.com/tools/explorer/
2. Select your app
3. Click "Get User Access Token"
4. Select email and public_profile permissions
5. Click "Generate Access Token"
6. Run query: `GET /me?fields=id,name,email,picture`
7. Verify you get user data

---

## Environment Variables Needed

```bash
# Backend (.env)
FACEBOOK_APP_ID=your_app_id
FACEBOOK_APP_SECRET=your_app_secret
FACEBOOK_REDIRECT_URI=http://localhost:3000/auth/facebook/callback

# Frontend (.env.local)
REACT_APP_FACEBOOK_APP_ID=your_app_id
```

---

## Troubleshooting

### Issue: "Invalid OAuth Redirect URI"
- **Solution:** Make sure redirect URI in Facebook app settings exactly matches your frontend URL
- Include protocol (http/https) and port number
- Check for trailing slashes

### Issue: "App Not Set Up"
- **Solution:** Make sure you've added Facebook Login product to your app
- Go to Products and add "Facebook Login"

### Issue: "Invalid App ID"
- **Solution:** Make sure you're using the correct App ID from Settings → Basic
- Don't confuse with App Secret

### Issue: "Permission Denied"
- **Solution:** Make sure you've requested email and public_profile permissions
- User must approve permissions in login dialog

### Issue: "CORS Error"
- **Solution:** This is expected - Facebook handles CORS on their side
- The error should be caught by the frontend and handled gracefully

---

## Next Steps

After completing this setup:
1. You'll have Facebook App ID and Secret
2. Add them to your .env files
3. Proceed to Task 5.2: Create Facebook OAuth backend endpoint
4. Proceed to Task 5.3: Implement Facebook login frontend button

---

## Resources

- Facebook Developers: https://developers.facebook.com/
- Facebook Login Documentation: https://developers.facebook.com/docs/facebook-login
- Graph API Reference: https://developers.facebook.com/docs/graph-api
- OAuth 2.0 Specification: https://tools.ietf.org/html/rfc6749

---

**Status:** Ready for Task 5.2 ✅
