import React from "react";

const COLORS = {
  darkGreen: "#1C382A",
  mediumGreen: "#52b788",
  veryLightGreen: "#BAE4C7",
  white: "#FFFFFF",
  darkGray: "#666666",
};

const ElderDetails = ({ profileData, onProfileChange }) => {
  return (
    <div>
      <h3 style={{ fontSize: "16px", fontWeight: 600, color: COLORS.mediumGreen, marginBottom: "20px" }}>
        🏥 Medical Emergency Information
      </h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {/* Blood Group */}
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: COLORS.darkGreen, marginBottom: "8px" }}>
            Blood Group
          </label>
          <select
            value={profileData.bloodGroup}
            onChange={(e) => onProfileChange("bloodGroup", e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              border: `2px solid ${COLORS.veryLightGreen}`,
              borderRadius: "8px",
              fontSize: "13px",
              fontFamily: "Montserrat, sans-serif",
              boxSizing: "border-box",
              transition: "all 0.3s ease",
            }}
            onFocus={(e) => (e.target.style.borderColor = COLORS.mediumGreen)}
            onBlur={(e) => (e.target.style.borderColor = COLORS.veryLightGreen)}
          >
            <option value="">Select Blood Group</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
        </div>

        {/* Primary Caregiver */}
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: COLORS.darkGreen, marginBottom: "8px" }}>
            Primary Caregiver Contact
          </label>
          <input
            type="text"
            value={profileData.primaryCaregiver}
            onChange={(e) => onProfileChange("primaryCaregiver", e.target.value)}
            placeholder="Caregiver name or phone"
            style={{
              width: "100%",
              padding: "12px",
              border: `2px solid ${COLORS.veryLightGreen}`,
              borderRadius: "8px",
              fontSize: "13px",
              fontFamily: "Montserrat, sans-serif",
              boxSizing: "border-box",
              transition: "all 0.3s ease",
            }}
            onFocus={(e) => (e.target.style.borderColor = COLORS.mediumGreen)}
            onBlur={(e) => (e.target.style.borderColor = COLORS.veryLightGreen)}
          />
        </div>
      </div>

      {/* Allergies */}
      <div style={{ marginTop: "20px" }}>
        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: COLORS.darkGreen, marginBottom: "8px" }}>
          Allergies & Medical Conditions
        </label>
        <textarea
          value={profileData.allergies}
          onChange={(e) => onProfileChange("allergies", e.target.value)}
          placeholder="List any allergies, medications, or medical conditions..."
          style={{
            width: "100%",
            padding: "12px",
            border: `2px solid ${COLORS.veryLightGreen}`,
            borderRadius: "8px",
            fontSize: "13px",
            fontFamily: "Montserrat, sans-serif",
            boxSizing: "border-box",
            minHeight: "100px",
            resize: "vertical",
            transition: "all 0.3s ease",
          }}
          onFocus={(e) => (e.target.style.borderColor = COLORS.mediumGreen)}
          onBlur={(e) => (e.target.style.borderColor = COLORS.veryLightGreen)}
        />
      </div>

      {/* Info Box */}
      <div style={{
        backgroundColor: "#f0f8f5",
        border: `2px solid ${COLORS.veryLightGreen}`,
        borderRadius: "8px",
        padding: "15px",
        marginTop: "20px",
        fontSize: "12px",
        color: COLORS.darkGreen,
        fontFamily: "Montserrat, sans-serif",
      }}>
        <strong>⚠️ Important:</strong> This information will be shared with emergency contacts and caregivers. Keep it accurate and up-to-date.
      </div>
    </div>
  );
};

export default ElderDetails;
