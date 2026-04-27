// ============================================================
// frontend/src/services/apiClient.js - API Client Service
// Handles all HTTP requests to the backend
// ============================================================

import axios from 'axios';

// Get API base URL from environment or use default
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies in requests
});

// ============================================================
// Request Interceptor - Add Authorization Token
// ============================================================
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('accessToken');

    // Add token to Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================================
// Response Interceptor - Handle Token Refresh
// ============================================================
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If token expired and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
            refreshToken,
          });

          // Save new token
          localStorage.setItem('accessToken', response.data.data.accessToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${response.data.data.accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ============================================================
// Authentication API Calls
// ============================================================

/**
 * Login with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {boolean} rememberMe - Remember me flag
 * @returns {Promise} - Response from backend
 */
export const loginUser = (email, password, rememberMe = false) => {
  return apiClient.post('/auth/login', {
    email,
    password,
    rememberMe,
  });
};

/**
 * Request password reset OTP
 * @param {string} email - User email
 * @returns {Promise} - Response from backend
 */
export const forgotPassword = (email) => {
  return apiClient.post('/auth/forgot-password', {
    email,
  });
};

/**
 * Verify password reset OTP
 * @param {string} email - User email
 * @param {string} otp - OTP code
 * @returns {Promise} - Response from backend
 */
export const verifyResetOTP = (email, otp) => {
  return apiClient.post('/auth/verify-reset-otp', {
    email,
    otp,
  });
};

/**
 * Reset password with new password
 * @param {string} email - User email
 * @param {string} resetToken - Reset token from OTP verification
 * @param {string} newPassword - New password
 * @param {string} confirmPassword - Confirm password
 * @returns {Promise} - Response from backend
 */
export const resetPassword = (email, resetToken, newPassword, confirmPassword) => {
  return apiClient.post('/auth/reset-password', {
    email,
    resetToken,
    newPassword,
    confirmPassword,
  });
};

/**
 * Resend password reset OTP
 * @param {string} email - User email
 * @returns {Promise} - Response from backend
 */
export const resendResetOTP = (email) => {
  return apiClient.post('/auth/resend-reset-otp', {
    email,
  });
};

/**
 * Signup with email and password
 * @param {object} userData - User data
 * @returns {Promise} - Response from backend
 */
export const signupUser = (userData) => {
  return apiClient.post('/auth/signup', userData);
};

/**
 * Verify email with OTP
 * @param {string} email - User email
 * @param {string} otp - OTP code
 * @returns {Promise} - Response from backend
 */
export const verifyEmail = (email, otp) => {
  return apiClient.post('/auth/verify-otp', {
    email,
    otp,
  });
};

/**
 * Resend verification OTP
 * @param {string} email - User email
 * @returns {Promise} - Response from backend
 */
export const resendVerificationOTP = (email) => {
  return apiClient.post('/auth/resend-otp', {
    email,
  });
};

/**
 * Google OAuth login
 * @param {string} token - Google ID token
 * @param {boolean} rememberMe - Remember me flag
 * @returns {Promise} - Response from backend
 */
export const googleLogin = (token, rememberMe = false) => {
  return apiClient.post('/auth/google', {
    token,
    rememberMe,
  });
};

/**
 * Facebook OAuth login
 * @param {string} token - Facebook access token
 * @param {boolean} rememberMe - Remember me flag
 * @returns {Promise} - Response from backend
 */
export const facebookLogin = (token, rememberMe = false) => {
  return apiClient.post('/auth/facebook', {
    token,
    rememberMe,
  });
};

/**
 * Set user role after OAuth signup
 * @param {string} userId - User ID
 * @param {string} role - User role (elder, caregiver, volunteer)
 * @returns {Promise} - Response from backend
 */
export const setUserRole = (userId, role) => {
  return apiClient.post('/auth/set-role', {
    userId,
    role,
  });
};

/**
 * Logout user
 * @returns {Promise} - Response from backend
 */
export const logoutUser = () => {
  return apiClient.post('/auth/logout');
};

/**
 * Change password
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @param {string} confirmPassword - Confirm password
 * @returns {Promise} - Response from backend
 */
export const changePassword = (currentPassword, newPassword, confirmPassword) => {
  return apiClient.post('/auth/change-password', {
    currentPassword,
    newPassword,
    confirmPassword,
  });
};

/**
 * Delete account
 * @param {string} password - User password for confirmation
 * @returns {Promise} - Response from backend
 */
export const deleteAccount = (password) => {
  return apiClient.post('/auth/delete-account', {
    password,
  });
};

/**
 * Verify Remember Me token
 * @param {string} rememberMeToken - Remember Me token
 * @returns {Promise} - Response from backend
 */
export const verifyRememberMeToken = (rememberMeToken) => {
  return apiClient.post('/auth/verify-remember-me', {
    rememberMeToken,
  });
};

// ============================================================
// User Profile API Calls
// ============================================================

/**
 * Get user profile
 * @returns {Promise} - Response from backend
 */
export const getUserProfile = () => {
  return apiClient.get('/users/profile');
};

/**
 * Update user profile
 * @param {object} profileData - Profile data to update
 * @returns {Promise} - Response from backend
 */
export const updateUserProfile = (profileData) => {
  return apiClient.put('/users/profile', profileData);
};

/**
 * Upload profile picture
 * @param {File} file - Image file
 * @returns {Promise} - Response from backend
 */
export const uploadProfilePicture = (file) => {
  const formData = new FormData();
  formData.append('profilePicture', file);

  return apiClient.post('/users/profile/picture', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * Get privacy settings
 * @returns {Promise} - Response from backend
 */
export const getPrivacySettings = () => {
  return apiClient.get('/users/privacy-settings');
};

/**
 * Update privacy settings
 * @param {object} settings - Privacy settings
 * @returns {Promise} - Response from backend
 */
export const updatePrivacySettings = (settings) => {
  return apiClient.put('/users/privacy-settings', settings);
};

// ============================================================
// Error Handler
// ============================================================

/**
 * Handle API errors
 * @param {object} error - Error object from axios
 * @returns {object} - Formatted error object
 */
export const handleAPIError = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      status: error.response.status,
      message: error.response.data?.message || 'An error occurred',
      data: error.response.data?.data,
    };
  } else if (error.request) {
    // Request made but no response
    return {
      status: 0,
      message: 'No response from server. Please check your connection.',
    };
  } else {
    // Error in request setup
    return {
      status: 0,
      message: error.message || 'An error occurred',
    };
  }
};

export default apiClient;
