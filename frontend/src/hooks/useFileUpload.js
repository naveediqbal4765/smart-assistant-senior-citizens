// ============================================================
// hooks/useFileUpload.js - Custom Hook for File Upload
// ============================================================

import { useState, useCallback } from "react";
import * as uploadService from "../services/uploadService";
import { validateFile } from "../utils/validation";

/**
 * Custom hook for managing file uploads
 * @param {number} maxSizeInMB - Maximum file size in MB
 * @param {array} allowedFormats - Allowed file formats
 * @returns {object} Upload state and methods
 */
export const useFileUpload = (maxSizeInMB = 5, allowedFormats = ["jpg", "jpeg", "png"]) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Handle file selection
  const handleFileSelect = useCallback(
    (selectedFile) => {
      setError(null);
      setSuccess(null);

      if (!selectedFile) {
        setFile(null);
        setPreview(null);
        return;
      }

      // Validate file
      const validation = validateFile(selectedFile, maxSizeInMB, allowedFormats);
      if (!validation.isValid) {
        setError(validation.error);
        return;
      }

      // Set file
      setFile(selectedFile);

      // Create preview for images
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    },
    [maxSizeInMB, allowedFormats]
  );

  // Upload file
  const uploadFile = useCallback(
    async (uploadType = "profile-picture") => {
      if (!file) {
        setError("Please select a file first");
        return null;
      }

      setUploading(true);
      setError(null);
      setSuccess(null);
      setProgress(0);

      try {
        const response = await uploadService.uploadFile(file, uploadType, (percent) => {
          setProgress(percent);
        });

        setSuccess("File uploaded successfully");
        return response.data;
      } catch (err) {
        const errorMessage = err.message || "Failed to upload file";
        setError(errorMessage);
        throw err;
      } finally {
        setUploading(false);
        setProgress(0);
      }
    },
    [file]
  );

  // Upload profile picture
  const uploadProfilePicture = useCallback(async () => {
    return uploadFile("profile-picture");
  }, [uploadFile]);

  // Clear file
  const clearFile = useCallback(() => {
    setFile(null);
    setPreview(null);
    setProgress(0);
    setError(null);
    setSuccess(null);
  }, []);

  // Clear messages
  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  return {
    file,
    preview,
    uploading,
    progress,
    error,
    success,
    handleFileSelect,
    uploadFile,
    uploadProfilePicture,
    clearFile,
    clearMessages,
  };
};

export default useFileUpload;
