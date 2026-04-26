import React from "react";

const COLORS = {
  darkGreen: "#1C382A",
  mediumGreen: "#52b788",
  veryLightGreen: "#BAE4C7",
};

const PrivacyControls = ({ profileData, onNestedChange }) => {
  return (
    <div>
      <h2 style={{ fontSize: "20px", fontWeight: 700, color: COLORS.darkGreen, marginBottom: "25px" }}>
        🔒 Privacy Controls
      </h2>
      <div style={{
        backgroundColor: "#f0f8f5",
        border: `2px solid ${COLORS.veryLightGreen}`,
        borderRadius: "8px",
        padding: "20px",
        color: COLORS.darkGreen,,
      }}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
            <input type="checkbox" />
            <span style={{ fontSize: "13px", fontWeight: 600 }}>Profile Visibility</span>
          </label>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
            <input type="checkbox" />
            <span style={{ fontSize: "13px", fontWeight: 600 }}>Health Data Sharing</span>
          </label>
        </div>
        <div>
          <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
            <input type="checkbox" />
            <span style={{ fontSize: "13px", fontWeight: 600 }}>Location Sharing</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default PrivacyControls;
