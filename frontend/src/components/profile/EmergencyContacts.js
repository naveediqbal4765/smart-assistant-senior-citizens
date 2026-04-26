import React from "react";

const COLORS = {
  darkGreen: "#1C382A",
  mediumGreen: "#52b788",
  veryLightGreen: "#BAE4C7",
  white: "#FFFFFF",
  darkGray: "#666666",
};

const EmergencyContacts = ({ profileData, onProfileChange }) => {
  return (
    <div>
      <h2 style={{ fontSize: "20px", fontWeight: 700, color: COLORS.darkGreen, marginBottom: "25px" }}>
        🚨 Emergency Contacts
      </h2>
      <div style={{
        backgroundColor: "#f0f8f5",
        border: `2px solid ${COLORS.veryLightGreen}`,
        borderRadius: "8px",
        padding: "20px",
        textAlign: "center",
        color: COLORS.darkGreen,
      }}>
        <p>Emergency contacts management coming soon...</p>
        <button style={{
          padding: "10px 20px",
          backgroundColor: COLORS.mediumGreen,
          color: COLORS.white,
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: 600,
          fontSize: "13px",
        }}>
          + Add Emergency Contact
        </button>
      </div>
    </div>
  );
};

export default EmergencyContacts;
