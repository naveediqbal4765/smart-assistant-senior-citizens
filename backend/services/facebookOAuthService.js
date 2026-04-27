// ============================================================
// services/facebookOAuthService.js - Facebook OAuth Service
// Handles Facebook OAuth token verification and user data extraction
// ============================================================

/**
 * Verify Facebook Access Token
 * @param {string} accessToken - Facebook access token
 * @returns {Promise<object>} - User info from Facebook API
 */
const verifyFacebookAccessToken = async (accessToken) => {
  try {
    // Verify token with Facebook API
    const response = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`
    );

    if (!response.ok) {
      throw new Error('Failed to verify Facebook access token');
    }

    const userInfo = await response.json();

    // Check if token is valid
    if (userInfo.error) {
      throw new Error(userInfo.error.message || 'Invalid Facebook token');
    }

    const facebookUser = {
      facebookId: userInfo.id,
      email: userInfo.email,
      fullName: userInfo.name,
      profilePicture: userInfo.picture?.data?.url,
    };

    return {
      success: true,
      data: facebookUser,
    };
  } catch (error) {
    console.error('❌ Facebook access token verification error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Exchange Facebook authorization code for access token
 * @param {string} code - Authorization code from Facebook
 * @returns {Promise<object>} - Access token and user info
 */
const exchangeCodeForToken = async (code) => {
  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.FACEBOOK_APP_ID,
        client_secret: process.env.FACEBOOK_APP_SECRET,
        redirect_uri: process.env.FACEBOOK_CALLBACK_URL,
        code: code,
      }).toString(),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      throw new Error(tokenData.error.message || 'Failed to get access token');
    }

    const accessToken = tokenData.access_token;

    // Get user info with access token
    const userResponse = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`
    );

    if (!userResponse.ok) {
      throw new Error('Failed to get user info');
    }

    const userInfo = await userResponse.json();

    if (userInfo.error) {
      throw new Error(userInfo.error.message || 'Failed to get user info');
    }

    const facebookUser = {
      facebookId: userInfo.id,
      email: userInfo.email,
      fullName: userInfo.name,
      profilePicture: userInfo.picture?.data?.url,
    };

    return {
      success: true,
      data: {
        facebookUser,
        accessToken,
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

/**
 * Get Facebook authorization URL
 * @returns {string} - Facebook OAuth authorization URL
 */
const getFacebookAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: process.env.FACEBOOK_APP_ID,
    redirect_uri: process.env.FACEBOOK_CALLBACK_URL,
    scope: 'email,public_profile',
    response_type: 'code',
    state: Math.random().toString(36).substring(7), // Random state for CSRF protection
  });

  return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
};

/**
 * Verify Facebook ID Token (if using Facebook SDK)
 * @param {string} idToken - Facebook ID token
 * @returns {Promise<object>} - Decoded token payload
 */
const verifyFacebookIdToken = async (idToken) => {
  try {
    // Verify token with Facebook API
    const response = await fetch(
      `https://graph.facebook.com/debug_token?input_token=${idToken}&access_token=${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`
    );

    if (!response.ok) {
      throw new Error('Failed to verify Facebook ID token');
    }

    const data = await response.json();

    if (!data.data.is_valid) {
      throw new Error('Invalid Facebook ID token');
    }

    // Get user info
    const userResponse = await fetch(
      `https://graph.facebook.com/${data.data.user_id}?fields=id,name,email,picture&access_token=${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`
    );

    if (!userResponse.ok) {
      throw new Error('Failed to get user info');
    }

    const userInfo = await userResponse.json();

    const facebookUser = {
      facebookId: userInfo.id,
      email: userInfo.email,
      fullName: userInfo.name,
      profilePicture: userInfo.picture?.data?.url,
    };

    return {
      success: true,
      data: facebookUser,
    };
  } catch (error) {
    console.error('❌ Facebook ID token verification error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = {
  verifyFacebookAccessToken,
  exchangeCodeForToken,
  getFacebookAuthUrl,
  verifyFacebookIdToken,
};
