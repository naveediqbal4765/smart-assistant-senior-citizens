import React from "react";

const COLORS = {
  darkGreen: "#1C382A",
  mediumGreen: "#52b788",
  veryLightGreen: "#BAE4C7",
  white: "#FFFFFF",
  darkGray: "#666666",
};

const CaregiverDetails = ({ profileData, onProfileChange }) => {
  return (
    <div>
      <h3 style={{ fontSize: "16px", fontWeight: 600, color: COLORS.mediumGreen, marginBottom: "20px" }}>
        👥 Linked Seniors
      </h3>

      <div style={{
        backgroundColor: "#f0f8f5",
        border: `2px solid ${COLORS.veryLightGreen}`,
        borderRadius: "8px",
        padding: "20px",
        textAlign: "center",
        color: COLORS.darkGreen,
        fontSize: "14px",
      }}>
        <p style={{ margin: "0 0 15px 0" }}>
          You are currently linked to <strong>{profileData.linkedSeniors?.length || 0}</strong> senior(s).
        </p>
        <button
          style={{
            padding: "10px 20px",
            backgroundColor: COLORS.mediumGreen,
            color: COLORS.white,
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "13px",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#2d6a4f")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.mediumGreen)}
        >
          + Add Senior
        </button>
      </div>

      {/* Linked Seniors List */}
      {profileData.linkedSeniors && profileData.linkedSeniors.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h4 style={{ fontSize: "14px", fontWeight: 600, color: COLORS.darkGreen, marginBottom: "15px" }}>
            Your Seniors
          </h4>
          {profileData.linkedSeniors.map((senior, index) => (
            <div
              key={index}
              style={{
                padding: "15px",
                backgroundColor: COLORS.veryLightGreen,
                borderRadius: "8px",
                marginBottom: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontWeight: 600, color: COLORS.darkGreen }}>{senior.name}</div>
                <div style={{ fontSize: "12px", color: COLORS.darkGray }}>{senior.email}</div>
              </div>
              <button
                style={{
                  padding: "6px 12px",
                  backgroundColor: "#e63946",
                  color: COLORS.white,
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

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
        <strong>ℹ️ Note:</strong> You can manage multiple seniors. Each senior will receive notifications about your availability and activities.
      </div>
    </div>
  );
};

export default CaregiverDetails;
