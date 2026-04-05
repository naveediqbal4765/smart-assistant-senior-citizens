// ============================================================
// services/api.js - API Service with Axios
// ============================================================

import axios from "axios";

// ============================================================
// API Configuration
// ============================================================

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================================
// Request Interceptor - Add JWT Token
// ============================================================
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
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
// Response Interceptor - Handle Errors
// ============================================================
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle 401 Unauthorized - Clear token and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    // Return error response
    return Promise.reject(error.response?.data || error);
  }
);

// ============================================================
// Authentication API
// ============================================================

export const authAPI = {
  // Signup
  signup: (userData) => apiClient.post("/auth/signup", userData),

  // Login
  login: (email, password) => apiClient.post("/auth/login", { email, password }),

  // Verify OTP
  verifyOTP: (email, otp) => apiClient.post("/auth/verify-otp", { email, otp }),

  // Forgot Password
  forgotPassword: (email) => apiClient.post("/auth/forgot-password", { email }),

  // Reset Password
  resetPassword: (resetToken, newPassword) =>
    apiClient.post("/auth/reset-password", { resetToken, newPassword }),

  // Resend OTP
  resendOTP: (email) => apiClient.post("/auth/resend-otp", { email }),
};

// ============================================================
// User API
// ============================================================

export const userAPI = {
  // Get Profile
  getProfile: () => apiClient.get("/users/profile"),

  // Update Profile
  updateProfile: (userData) => apiClient.put("/users/profile", userData),

  // Get User by ID
  getUserById: (userId) => apiClient.get(`/users/${userId}`),

  // Change Password
  changePassword: (currentPassword, newPassword) =>
    apiClient.put("/users/password", { currentPassword, newPassword }),
};

// ============================================================
// Elder API
// ============================================================

export const elderAPI = {
  // Get Elder Profile
  getProfile: (userId) => apiClient.get(`/elders/${userId}`),

  // Update Elder Profile
  updateProfile: (userId, elderData) => apiClient.put(`/elders/${userId}`, elderData),

  // Add Emergency Contact
  addEmergencyContact: (userId, contact) =>
    apiClient.post(`/elders/${userId}/emergency-contacts`, contact),

  // Get Medical History
  getMedicalHistory: (userId) => apiClient.get(`/elders/${userId}/medical-history`),

  // Delete Emergency Contact
  deleteEmergencyContact: (userId, contactIndex) =>
    apiClient.delete(`/elders/${userId}/emergency-contacts/${contactIndex}`),
};

// ============================================================
// Caregiver API
// ============================================================

export const caregiverAPI = {
  // Get Caregiver Profile
  getProfile: (userId) => apiClient.get(`/caregivers/${userId}`),

  // Update Caregiver Profile
  updateProfile: (userId, caregiverData) =>
    apiClient.put(`/caregivers/${userId}`, caregiverData),

  // Pair with Elder
  pairWithElder: (pairingCode, elderEmail) =>
    apiClient.post("/caregivers/pair", { pairingCode, elderEmail }),

  // Get Assigned Elders
  getAssignedElders: (userId) => apiClient.get(`/caregivers/${userId}/assigned-elders`),
};

// ============================================================
// Volunteer API
// ============================================================

export const volunteerAPI = {
  // Get Volunteer Profile
  getProfile: (userId) => apiClient.get(`/volunteers/${userId}`),

  // Update Volunteer Profile
  updateProfile: (userId, volunteerData) =>
    apiClient.put(`/volunteers/${userId}`, volunteerData),

  // Update Availability
  updateAvailability: (userId, availabilityData) =>
    apiClient.put(`/volunteers/${userId}/availability`, availabilityData),

  // Get Nearby Volunteers
  getNearby: (latitude, longitude, radius = 5, skills = null) => {
    let url = `/volunteers/nearby?latitude=${latitude}&longitude=${longitude}&radius=${radius}`;
    if (skills) {
      url += `&skills=${skills}`;
    }
    return apiClient.get(url);
  },
};

// ============================================================
// SOS API
// ============================================================

export const sosAPI = {
  // Trigger SOS Alert
  trigger: (location, description, severity = "high") =>
    apiClient.post("/sos/trigger", { location, description, severity }),

  // Get SOS History
  getHistory: (limit = 10, offset = 0, status = null) => {
    let url = `/sos/history?limit=${limit}&offset=${offset}`;
    if (status) {
      url += `&status=${status}`;
    }
    return apiClient.get(url);
  },

  // Get SOS Details
  getDetails: (sosId) => apiClient.get(`/sos/${sosId}`),

  // Resolve SOS Alert
  resolve: (sosId, status = "resolved", notes = "") =>
    apiClient.put(`/sos/${sosId}/resolve`, { status, notes }),
};

// ============================================================
// Health Check
// ============================================================

export const healthCheck = () => apiClient.get("/health");

// ============================================================
// Export API Client
// ============================================================

export default apiClient;
