// ============================================================
// components/ProfilePictureUpload.js - Profile Picture Upload Component
// ============================================================

import React, { useState, useRef } from "react";
import { useFileUpload } from "../hooks/useFileUpload";
import "../styles/ProfilePictureUpload.css";

/**
 * Profile Picture Upload Component
 * Allows users to upload and preview profile pictures
 * 
 * @param {string} currentImage - Current profile picture URL
 * @param {function} onUploadSuccess - Callback when upload succeeds
 * @param {function} onUploadError - Callback when upload fails
 */
const ProfilePictureUpload = ({ currentImage = null, onUploadSuccess, onUploadError }) => {
  const fileInputRef = useRef(null);
  const {
    file,
    preview,
    uploading,
    progress,
    error,
    success,
    handleFileSelect,
    uploadProfilePicture,
    clearFile,
    clearMessages,
  } = useFileUpload(5, ["jpg", "jpeg", "png"]);

  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);

  // Handle file input click
  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file selection
  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
      setUploadError(null);
      setUploadSuccess(null);
    }
  };

  // Handle upload
  const handleUpload = async () => {
    if (!file) {
      setUploadError("Please select a file first");
      return;
    }

    try {
      setUploadError(null);
      setUploadSuccess(null);
      const result = await uploadProfilePicture();
      
      setUploadSuccess("Profile picture uploaded successfully!");
      if (onUploadSuccess) {
        onUploadSuccess(result);
      }

      // Clear file after successful upload
      setTimeout(() => {
        clearFile();
        setUploadSuccess(null);
      }, 2000);
    } catch (err) {
      const errorMsg = error || "Failed to upload profile picture";
      setUploadError(errorMsg);
      if (onUploadError) {
        onUploadError(errorMsg);
      }
    }
  };

  // Handle cancel
  const handleCancel = () => {
    clearFile();
    setUploadError(null);
    setUploadSuccess(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="profile-picture-upload">
      <h2 className="upload-title">Profile Picture</h2>

      {/* Current Image or Preview */}
      <div className="image-container">
        {preview ? (
          <div className="image-preview">
            <img src={preview} alt="Preview" className="preview-image" />
            <div className="preview-badge">New</div>
          </div>
        ) : currentImage ? (
          <div className="image-preview">
            <img src={currentImage} alt="Current" className="preview-image" />
            <div className="current-badge">Current</div>
          </div>
        ) : (
          <div className="image-placeholder">
            <span className="placeholder-icon">📷</span>
            <p className="placeholder-text">No picture yet</p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {(uploadError || error) && (
        <div className="upload-error-message">
          <span className="error-icon">❌</span>
          <span className="error-text">{uploadError || error}</span>
        </div>
      )}

      {/* Success Message */}
      {(uploadSuccess || success) && (
        <div className="upload-success-message">
          <span className="success-icon">✅</span>
          <span className="success-text">{uploadSuccess || success}</span>
        </div>
      )}

      {/* File Input (Hidden) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,.jpg,.jpeg,.png"
        onChange={handleFileInputChange}
        style={{ display: "none" }}
      />

      {/* Upload Progress */}
      {uploading && (
        <div className="upload-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="progress-text">Uploading: {progress}%</p>
        </div>
      )}

      {/* File Info */}
      {file && !uploading && (
        <div className="file-info">
          <div className="file-details">
            <span className="file-icon">📄</span>
            <div className="file-text">
              <p className="file-name">{file.name}</p>
              <p className="file-size">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="upload-actions">
        {!file ? (
          <button
            type="button"
            className="btn-select"
            onClick={handleFileInputClick}
            disabled={uploading}
          >
            📁 Select Picture
          </button>
        ) : (
          <>
            <button
              type="button"
              className="btn-upload"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? `Uploading... ${progress}%` : "✅ Upload Picture"}
            </button>
            <button
              type="button"
              className="btn-cancel"
              onClick={handleCancel}
              disabled={uploading}
            >
              ✕ Cancel
            </button>
          </>
        )}
      </div>

      {/* Requirements */}
      <div className="upload-requirements">
        <h4 className="requirements-title">Requirements:</h4>
        <ul className="requirements-list">
          <li>✓ Maximum file size: 5MB</li>
          <li>✓ Supported formats: JPG, PNG</li>
          <li>✓ Recommended size: 500x500px or larger</li>
          <li>✓ Square images work best</li>
        </ul>
      </div>
    </div>
  );
};

export default ProfilePictureUpload;
