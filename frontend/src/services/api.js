// ============================================================
// services/api.js - Axios API Service Configuration
// Central HTTP client for all backend API calls
// ============================================================

import axios from "axios";
import toast from "react-hot-toast";

// Create Axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api", // Backend API base URL
  timeout: 15000, // 15 second timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================================
// REQUEST INTERCEPTOR - Runs before every API request
// Automatically attaches JWT token to Authorization header
// ============================================================
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage or sessionStorage
    const token =
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach token
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================================
// RESPONSE INTERCEPTOR - Runs after every API response
// Handles global error cases (401 unauthorized, network errors)
// ============================================================
api.interceptors.response.use(
  (response) => response, // Pass through successful responses

  (error) => {
    const { response } = error;

    if (!response) {
      // Network error (no internet, server down)
      toast.error("Network error. Please check your internet connection.");
      return Promise.reject(error);
    }

    if (response.status === 401) {
      // Unauthorized - token expired or invalid
      // Clear stored auth and redirect to login
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("user");

      // Only redirect if not already on auth pages
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
        toast.error("Session expired. Please log in again.");
      }
    }

    if (response.status === 403) {
      toast.error("You don't have permission to perform this action.");
    }

    if (response.status === 500) {
      toast.error("Server error. Please try again later.");
    }

    return Promise.reject(error);
  }
);

// ============================================================
// AUTH API CALLS
// ============================================================
export const authAPI = {
  // Login with email and password
  login: (data) => api.post("/auth/login", data),

  // Register new user
  signup: (data) => api.post("/auth/signup", data),

  // Verify email OTP
  verifyOTP: (data) => api.post("/auth/verify-otp", data),

  // Request password reset OTP
  forgotPassword: (data) => api.post("/auth/forgot-password", data),

  // Verify password reset OTP
  verifyResetOTP: (data) => api.post("/auth/verify-reset-otp", data),

  // Set new password
  resetPassword: (data) => api.post("/auth/reset-password", data),

  // Resend OTP
  resendOTP: (data) => api.post("/auth/resend-otp", data),

  // OAuth login (Google, Facebook, Apple)
  oauthLogin: (data) => api.post("/auth/oauth", data),

  // Get current user profile
  getMe: () => api.get("/auth/me"),

  // Delete account
  deleteAccount: (data) => api.delete("/auth/delete-account", { data }),
};

export default api;
