import React from "react";

const COLORS = {
  darkGreen: "#1C382A",
  mediumGreen: "#52b788",
  veryLightGreen: "#BAE4C7",
  white: "#FFFFFF",
  darkGray: "#666666",
};

const BasicInfo = ({ profileData, onProfileChange }) => {
  return (
    <div>
      <h2 style={{ fontSize: "20px", fontWeight: 700, color: COLORS.darkGreen, marginBottom: "25px" }}>
        👤 Basic Information
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {/* Full Name */}
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: COLORS.darkGreen, marginBottom: "8px" }}>
            Full Name *
          </label>
          <input
            type="text"
            value={profileData.fullName}
            onChange={(e) => onProfileChange("fullName", e.target.value)}
            placeholder="Enter your full name"
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

        {/* Email */}
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: COLORS.darkGreen, marginBottom: "8px" }}>
            Email *
          </label>
          <input
            type="email"
            value={profileData.email}
            disabled
            placeholder="Your email"
            style={{
              width: "100%",
              padding: "12px",
              border: `2px solid ${COLORS.veryLightGreen}`,
              borderRadius: "8px",
              fontSize: "13px",
              fontFamily: "Montserrat, sans-serif",
              backgroundColor: "#f5f5f5",
              color: COLORS.darkGray,
              boxSizing: "border-box",
              cursor: "not-allowed",
            }}
          />
          <p style={{ fontSize: "11px", color: COLORS.darkGray, marginTop: "6px" }}>
            Email cannot be changed
          </p>
        </div>

        {/* Phone Number */}
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: COLORS.darkGreen, marginBottom: "8px" }}>
            Phone Number
          </label>
          <input
            type="tel"
            value={profileData.phone}
            onChange={(e) => onProfileChange("phone", e.target.value)}
            placeholder="Enter your phone number"
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
          <p style={{ fontSize: "11px", color: COLORS.darkGray, marginTop: "6px" }}>
            Format: +92 (XXX) XXX-XXXX
          </p>
        </div>

        {/* Date of Birth */}
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: COLORS.darkGreen, marginBottom: "8px" }}>
            Date of Birth
          </label>
          <input
            type="date"
            value={profileData.dateOfBirth}
            onChange={(e) => onProfileChange("dateOfBirth", e.target.value)}
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

      {/* Address */}
      <div style={{ marginTop: "20px" }}>
        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: COLORS.darkGreen, marginBottom: "8px" }}>
          Address
        </label>
        <textarea
          value={profileData.address}
          onChange={(e) => onProfileChange("address", e.target.value)}
          placeholder="Enter your address"
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
        <strong>ℹ️ Note:</strong> Your email address is verified and cannot be changed. To update your email, please contact support.
      </div>
    </div>
  );
};

export default BasicInfo;
