// ============================================================
// services/uploadService.js - File Upload Service (Cloudinary)
// ============================================================

import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Upload file to Cloudinary via backend
 * @param {File} file - File to upload
 * @param {string} uploadType - Type of upload (profile-picture, document, etc.)
 * @param {function} onProgress - Progress callback
 * @returns {Promise} Upload response with file URL
 */
export const uploadFile = async (file, uploadType = "profile-picture", onProgress) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("uploadType", uploadType);

    const response = await api.post("/upload", formData, {
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
    throw error.response?.data || { message: "Failed to upload file" };
  }
};

/**
 * Upload profile picture
 * @param {File} file - Image file
 * @param {function} onProgress - Progress callback
 * @returns {Promise} Upload response with image URL
 */
export const uploadProfilePicture = async (file, onProgress) => {
  return uploadFile(file, "profile-picture", onProgress);
};

/**
 * Upload document
 * @param {File} file - Document file
 * @param {function} onProgress - Progress callback
 * @returns {Promise} Upload response with document URL
 */
export const uploadDocument = async (file, onProgress) => {
  return uploadFile(file, "document", onProgress);
};

/**
 * Delete file from Cloudinary via backend
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise} Delete response
 */
export const deleteFile = async (publicId) => {
  try {
    const response = await api.delete("/upload", {
      data: { publicId },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete file" };
  }
};

export default {
  uploadFile,
  uploadProfilePicture,
  uploadDocument,
  deleteFile,
};
