// ============================================================
// services/profileService.js - Profile-Specific API Service
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

// ============================================================
// SENIOR-SPECIFIC ENDPOINTS
// ============================================================

/**
 * Get medical information (seniors)
 * @returns {Promise} Medical info data
 */
export const getMedicalInfo = async () => {
  try {
    const response = await api.get("/profile/medical-info");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch medical info" };
  }
};

/**
 * Update medical information (seniors)
 * @param {object} medicalData - Medical info to update
 * @returns {Promise} Updated medical info
 */
export const updateMedicalInfo = async (medicalData) => {
  try {
    const response = await api.put("/profile/medical-info", medicalData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update medical info" };
  }
};

// ============================================================
// CAREGIVER-SPECIFIC ENDPOINTS
// ============================================================

/**
 * Get linked seniors (caregivers)
 * @returns {Promise} List of linked seniors
 */
export const getLinkedSeniors = async () => {
  try {
    const response = await api.get("/profile/linked-seniors");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch linked seniors" };
  }
};

/**
 * Add linked senior (caregivers)
 * @param {string} seniorId - Senior user ID
 * @returns {Promise} Success response
 */
export const addLinkedSenior = async (seniorId) => {
  try {
    const response = await api.post("/profile/linked-seniors", { seniorId });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to add linked senior" };
  }
};

/**
 * Remove linked senior (caregivers)
 * @param {string} seniorId - Senior user ID
 * @returns {Promise} Success response
 */
export const removeLinkedSenior = async (seniorId) => {
  try {
    const response = await api.delete(`/profile/linked-seniors/${seniorId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to remove linked senior" };
  }
};

// ============================================================
// VOLUNTEER-SPECIFIC ENDPOINTS
// ============================================================

/**
 * Get volunteer availability
 * @returns {Promise} Availability data
 */
export const getAvailability = async () => {
  try {
    const response = await api.get("/profile/availability");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch availability" };
  }
};

/**
 * Update volunteer availability
 * @param {object} availabilityData - Availability to update
 * @returns {Promise} Updated availability
 */
export const updateAvailability = async (availabilityData) => {
  try {
    const response = await api.put("/profile/availability", availabilityData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update availability" };
  }
};

/**
 * Get volunteer skills
 * @returns {Promise} Skills data
 */
export const getSkills = async () => {
  try {
    const response = await api.get("/profile/skills");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch skills" };
  }
};

/**
 * Update volunteer skills
 * @param {array} skills - Skills to update
 * @returns {Promise} Updated skills
 */
export const updateSkills = async (skills) => {
  try {
    const response = await api.put("/profile/skills", { skills });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update skills" };
  }
};

// ============================================================
// EMERGENCY CONTACTS ENDPOINTS
// ============================================================

/**
 * Get emergency contacts
 * @returns {Promise} List of emergency contacts
 */
export const getEmergencyContacts = async () => {
  try {
    const response = await api.get("/profile/emergency-contacts");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch emergency contacts" };
  }
};

/**
 * Add emergency contact
 * @param {object} contactData - Contact data
 * @returns {Promise} Created contact
 */
export const addEmergencyContact = async (contactData) => {
  try {
    const response = await api.post("/profile/emergency-contacts", contactData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to add emergency contact" };
  }
};

/**
 * Update emergency contact
 * @param {string} contactId - Contact ID
 * @param {object} contactData - Updated contact data
 * @returns {Promise} Updated contact
 */
export const updateEmergencyContact = async (contactId, contactData) => {
  try {
    const response = await api.put(`/profile/emergency-contacts/${contactId}`, contactData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update emergency contact" };
  }
};

/**
 * Delete emergency contact
 * @param {string} contactId - Contact ID
 * @returns {Promise} Success response
 */
export const deleteEmergencyContact = async (contactId) => {
  try {
    const response = await api.delete(`/profile/emergency-contacts/${contactId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete emergency contact" };
  }
};

export default {
  // Senior
  getMedicalInfo,
  updateMedicalInfo,
  // Caregiver
  getLinkedSeniors,
  addLinkedSenior,
  removeLinkedSenior,
  // Volunteer
  getAvailability,
  updateAvailability,
  getSkills,
  updateSkills,
  // Emergency Contacts
  getEmergencyContacts,
  addEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact,
};
