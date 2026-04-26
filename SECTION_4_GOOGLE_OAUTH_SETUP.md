# Section 4: Google OAuth Integration - Setup Guide

## Task 4.1: Setup Google OAuth Credentials

### Step 1: Create Google Cloud Project

1. **Go to Google Cloud Console**
   - URL: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create a New Project**
   - Click "Select a Project" at the top
   - Click "NEW PROJECT"
   - Project name: `Smart Assistant Senior Citizens`
   - Click "CREATE"
   - Wait for project to be created (2-3 minutes)

3. **Enable Google+ API**
   - In the search bar, search for "Google+ API"
   - Click on "Google+ API"
   - Click "ENABLE"

4. **Enable OAuth 2.0**
   - In the search bar, search for "OAuth 2.0"
   - Click on "OAuth 2.0 Playground" (or go to https://developers.google.com/oauthplayground)

---

### Step 2: Create OAuth 2.0 Credentials

1. **Go to Credentials Page**
   - In Google Cloud Console, go to "Credentials" (left sidebar)
   - Click "CREATE CREDENTIALS"
   - Select "OAuth client ID"

2. **Configure OAuth Consent Screen**
   - If prompted, click "CONFIGURE CONSENT SCREEN"
   - Select "External" for User Type
   - Click "CREATE"

3. **Fill in OAuth Consent Screen**
   - **App name:** Smart Assistant for Senior Citizens
   - **User support email:** smartassistantforseniorcitizen@gmail.com
   - **Developer contact:** smartassistantforseniorcitizen@gmail.com
   - Click "SAVE AND CONTINUE"

4. **Add Scopes**
   - Click "ADD OR REMOVE SCOPES"
   - Search for and select:
     - `userinfo.email`
     - `userinfo.profile`
   - Click "UPDATE"
   - Click "SAVE AND CONTINUE"

5. **Add Test Users (Optional)**
   - Click "ADD USERS"
   - Add your test email addresses
   - Click "SAVE AND CONTINUE"

6. **Review and Finish**
   - Review the information
   - Click "BACK TO DASHBOARD"

---

### Step 3: Create OAuth 2.0 Client ID

1. **Go to Credentials Page**
   - Click "CREATE CREDENTIALS"
   - Select "OAuth client ID"

2. **Select Application Type**
   - Select "Web application"
   - Name: `Smart Assistant Web App`

3. **Add Authorized Redirect URIs**
   - Click "ADD URI" under "Authorized redirect URIs"
   - Add these URIs:
     ```
     http://localhost:3000/auth/google/callback
     http://localhost:3000/login
     https://yourdomain.com/auth/google/callback
     https://yourdomain.com/login
     ```
   - Click "CREATE"

4. **Copy Credentials**
   - A popup will show your credentials
   - Copy:
     - **Client ID** (looks like: `xxx.apps.googleusercontent.com`)
     - **Client Secret** (looks like: `GOCSPX-xxx`)
   - Click "OK"

---

### Step 4: Add Credentials to Environment

1. **Update .env file**
   ```
   # Google OAuth
   GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
   ```

2. **Update Frontend .env**
   ```
   REACT_APP_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
   ```

---

### Step 5: Install Required Packages

**Backend:**
```bash
npm install google-auth-library
```

**Frontend:**
```bash
npm install @react-oauth/google
```

---

### Step 6: Verify Setup

**Test Google OAuth:**
1. Go to https://developers.google.com/oauthplayground
2. Click the gear icon (settings)
3. Check "Use your own OAuth credentials"
4. Enter your Client ID and Client Secret
5. Select scopes: `userinfo.email`, `userinfo.profile`
6. Click "Authorize APIs"
7. You should see a Google login popup
8. After login, you'll see your access token

---

## Environment Variables Needed

```bash
# Backend (.env)
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback

# Frontend (.env.local)
REACT_APP_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
```

---

## Troubleshooting

### Issue: "Redirect URI mismatch"
- **Solution:** Make sure the redirect URI in Google Cloud Console exactly matches your frontend URL
- Include protocol (http/https) and port number

### Issue: "Invalid Client ID"
- **Solution:** Make sure you're using the correct Client ID from Google Cloud Console
- Check for extra spaces or typos

### Issue: "Access Denied"
- **Solution:** Make sure you've enabled Google+ API in Google Cloud Console
- Check that your app is in the OAuth consent screen

### Issue: "CORS Error"
- **Solution:** This is expected - Google OAuth handles CORS on their side
- The error should be caught by the frontend and handled gracefully

---

## Next Steps

After completing this setup:
1. You'll have Google Client ID and Secret
2. Add them to your .env files
3. Proceed to Task 4.2: Create Google OAuth backend endpoint
4. Proceed to Task 4.3: Implement Google login frontend

---

## Resources

- Google Cloud Console: https://console.cloud.google.com/
- Google OAuth Documentation: https://developers.google.com/identity/protocols/oauth2
- React Google Login: https://www.npmjs.com/package/@react-oauth/google
- Google Auth Library: https://www.npmjs.com/package/google-auth-library

---

**Status:** Ready for Task 4.2 ✅
