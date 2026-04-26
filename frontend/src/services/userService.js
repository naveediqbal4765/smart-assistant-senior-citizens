// ============================================================
// services/userService.js - User API Service
// ============================================================

import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Helper function to extract error message
const getErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return "An error occurred";
};

/**
 * Get user profile
 * @returns {Promise} User profile data
 */
export const getProfile = async () => {
  try {
    const response = await api.get("/users/profile");
    return response.data;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    const err = new Error(errorMessage);
    throw err;
  }
};

/**
 * Update user profile
 * @param {object} profileData - Profile data to update
 * @returns {Promise} Updated profile data
 */
export const updateProfile = async (profileData) => {
  try {
    const response = await api.put("/users/profile", profileData);
    return response.data;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    const err = new Error(errorMessage);
    throw err;
  }
};

/**
 * Change user password
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise} Success response
 */
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.put("/users/password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    const err = new Error(errorMessage);
    throw err;
  }
};

/**
 * Delete user account
 * @param {string} password - User password for confirmation
 * @returns {Promise} Success response
 */
export const deleteAccount = async (password) => {
  try {
    const response = await api.delete("/users/account", {
      data: { password },
    });
    return response.data;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    const err = new Error(errorMessage);
    throw err;
  }
};

/**
 * Upload profile picture
 * @param {File} file - Image file
 * @param {function} onProgress - Progress callback
 * @returns {Promise} Upload response with image URL
 */
export const uploadProfilePicture = async (file, onProgress) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/upload/profile-picture", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        if (onProgress) {
          onProgress(percentCompleted);
        }
      },
    });

    return response.data;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    const err = new Error(errorMessage);
    throw err;
  }
};

/**
 * Get user by ID (public)
 * @param {string} userId - User ID
 * @returns {Promise} User data
 */
export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    const err = new Error(errorMessage);
    throw err;
  }
};

export default {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  uploadProfilePicture,
  getUserById,
};
