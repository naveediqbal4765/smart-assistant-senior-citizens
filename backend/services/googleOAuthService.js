// ============================================================
// services/googleOAuthService.js - Google OAuth Service
// Handles Google OAuth token verification and user data extraction
// ============================================================

const { OAuth2Client } = require('google-auth-library');

// Initialize Google OAuth2 Client
const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL
);

/**
 * Verify Google ID Token
 * @param {string} token - Google ID token from frontend
 * @returns {Promise<object>} - Decoded token payload with user info
 */
const verifyGoogleToken = async (token) => {
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    // Extract user information from Google token
    const googleUser = {
      googleId: payload.sub,
      email: payload.email,
      fullName: payload.name,
      profilePicture: payload.picture,
      emailVerified: payload.email_verified,
    };

    return {
      success: true,
      data: googleUser,
    };
  } catch (error) {
    console.error('❌ Google token verification error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Verify Google Access Token (alternative method)
 * @param {string} accessToken - Google access token
 * @returns {Promise<object>} - User info from Google API
 */
const verifyGoogleAccessToken = async (accessToken) => {
  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to verify Google access token');
    }

    const userInfo = await response.json();

    const googleUser = {
      googleId: userInfo.id,
      email: userInfo.email,
      fullName: userInfo.name,
      profilePicture: userInfo.picture,
      emailVerified: userInfo.verified_email,
    };

    return {
      success: true,
      data: googleUser,
    };
  } catch (error) {
    console.error('❌ Google access token verification error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get Google authorization URL
 * @returns {string} - Google OAuth authorization URL
 */
const getGoogleAuthUrl = () => {
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ];

  return googleClient.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
  });
};

/**
 * Exchange authorization code for tokens
 * @param {string} code - Authorization code from Google
 * @returns {Promise<object>} - Access token and user info
 */
const exchangeCodeForToken = async (code) => {
  try {
    const { tokens } = await googleClient.getToken(code);

    // Verify the ID token to get user info
    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const googleUser = {
      googleId: payload.sub,
      email: payload.email,
      fullName: payload.name,
      profilePicture: payload.picture,
      emailVerified: payload.email_verified,
    };

    return {
      success: true,
      data: {
        googleUser,
        tokens,
      },
    };
  } catch (error) {
    console.error('❌ Code exchange error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = {
  verifyGoogleToken,
  verifyGoogleAccessToken,
  getGoogleAuthUrl,
  exchangeCodeForToken,
};
