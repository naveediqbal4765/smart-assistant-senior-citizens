import React, { useState } from "react";

const COLORS = {
  darkGreen: "#1C382A",
  mediumGreen: "#52b788",
  veryLightGreen: "#BAE4C7",
  white: "#FFFFFF",
  darkGray: "#666666",
  red: "#e63946",
};

const ProfilePicture = ({ profileData, onProfileChange }) => {
  const [preview, setPreview] = useState(profileData.profilePicture);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setError("");

    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File too large; please upload an image under 5MB.");
      return;
    }

    // Validate file type
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      setError("Please upload a valid image file (.jpg, .png).");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      onProfileChange("profilePicture", reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDeletePicture = () => {
    setPreview(null);
    onProfileChange("profilePicture", null);
    setError("");
  };

  return (
    <div>
      <h2 style={{ fontSize: "20px", fontWeight: 700, color: COLORS.darkGreen, marginBottom: "25px" }}>
        📷 Profile Picture
      </h2>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
        {/* Preview */}
        <div style={{
          width: "150px",
          height: "150px",
          borderRadius: "50%",
          backgroundColor: COLORS.veryLightGreen,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          border: `3px solid ${COLORS.mediumGreen}`,
        }}>
          {preview ? (
            <img src={preview} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span style={{ fontSize: "48px" }}>📷</span>
          )}
        </div>

        {/* Upload Input */}
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <label style={{
            display: "block",
            padding: "20px",
            border: `2px dashed ${COLORS.mediumGreen}`,
            borderRadius: "8px",
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.3s ease",
            backgroundColor: "#f0f8f5",
          }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <div style={{ fontSize: "14px", fontWeight: 600, color: COLORS.mediumGreen }}>
              Click to upload or drag and drop
            </div>
            <div style={{ fontSize: "12px", color: COLORS.darkGray, marginTop: "5px" }}>
              PNG, JPG up to 5MB
            </div>
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#ffe0e0",
            border: `2px solid ${COLORS.red}`,
            borderRadius: "8px",
            color: COLORS.red,
            fontSize: "13px",
            fontWeight: 600,
          }}>
            {error}
          </div>
        )}

        {/* Delete Button */}
        {preview && (
          <button
            onClick={handleDeletePicture}
            style={{
              padding: "10px 20px",
              backgroundColor: COLORS.red,
              color: COLORS.white,
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "13px",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#d62828")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.red)}
          >
            Delete Picture
          </button>
        )}

        {/* Info Box */}
        <div style={{
          width: "100%",
          backgroundColor: "#f0f8f5",
          border: `2px solid ${COLORS.veryLightGreen}`,
          borderRadius: "8px",
          padding: "15px",
          fontSize: "12px",
          color: COLORS.darkGreen,
          fontFamily: "Montserrat, sans-serif",
        }}>
          <strong>ℹ️ Tips:</strong> Use a clear, well-lit photo. Square images work best. Your photo will be visible to other users.
        </div>
      </div>
    </div>
  );
};

export default ProfilePicture;
