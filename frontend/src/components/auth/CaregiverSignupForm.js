// ============================================================
// components/auth/CaregiverSignupForm.js
// Caregiver-specific signup fields
// ============================================================

import React from "react";

const CaregiverSignupForm = ({ data, onChange, errors }) => {
  const sectionStyle = {
    backgroundColor: "rgba(255,255,255,0.35)",
    borderRadius: "12px",
    padding: "16px",
    marginBottom: "20px",
    border: "1px solid #a8d5b5",
  };

  const labelStyle = {
    fontSize: "0.95rem",
    fontWeight: 600,
    color: "#2d6a4f",
    marginBottom: "6px",
    display: "block",
  };

  return (
    <div>
      {/* Relationship to Elder */}
      <div style={sectionStyle}>
        <label style={labelStyle}>Relationship to Elder *</label>
        <select
          name="relationshipToElder"
          value={data.relationshipToElder || ""}
          onChange={onChange}
          className="form-input"
        >
          <option value="">Select relationship...</option>
          <option>Son</option>
          <option>Daughter</option>
          <option>Spouse</option>
          <option>Sibling</option>
          <option>Professional Nurse</option>
          <option>Paid Caregiver</option>
          <option>Neighbor</option>
          <option>Friend</option>
          <option>Other</option>
        </select>
        {errors?.relationshipToElder && <p className="error-msg">⚠️ {errors.relationshipToElder}</p>}
      </div>

      {/* Elder's Email for Pairing */}
      <div style={sectionStyle}>
        <label style={labelStyle}>Elder's Email Address *</label>
        <input
          type="email"
          name="linkedElderEmail"
          value={data.linkedElderEmail || ""}
          onChange={onChange}
          className="form-input"
          placeholder="elder@example.com"
        />
        <p style={{ fontSize: "0.85rem", color: "#6b7280", marginTop: "6px" }}>
          Enter the email of the elder you want to monitor
        </p>
        {errors?.linkedElderEmail && <p className="error-msg">⚠️ {errors.linkedElderEmail}</p>}
      </div>

      {/* 6-Digit Pairing Code */}
      <div style={sectionStyle}>
        <label style={labelStyle}>6-Digit Pairing Code *</label>
        <input
          type="text"
          name="pairingCode"
          value={data.pairingCode || ""}
          onChange={(e) => onChange({ target: { name: "pairingCode", value: e.target.value.replace(/\D/g, "").slice(0, 6) } })}
          className="form-input"
          placeholder="000000"
          maxLength="6"
          pattern="\d{6}"
        />
        <p style={{ fontSize: "0.85rem", color: "#6b7280", marginTop: "6px" }}>
          Ask the elder to share their 6-digit pairing code from their dashboard
        </p>
        {errors?.pairingCode && <p className="error-msg">⚠️ {errors.pairingCode}</p>}
      </div>

      {/* Push Notification Consent */}
      <div style={sectionStyle}>
        <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "1rem", fontWeight: 600, color: "#2d6a4f" }}>
          <input
            type="checkbox"
            name="notificationsEnabled"
            checked={data.notificationsEnabled || false}
            onChange={(e) => onChange({ target: { name: "notificationsEnabled", value: e.target.checked } })}
            className="custom-checkbox"
            style={{ width: "20px", height: "20px" }}
          />
          Enable push notifications for SOS alerts
        </label>
        <p style={{ fontSize: "0.85rem", color: "#e63946", marginTop: "8px", fontWeight: 600 }}>
          ⚠️ Without notifications, you won't receive real-time SOS alerts from the elder
        </p>
      </div>

      {/* Availability Status */}
      <div style={sectionStyle}>
        <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "1rem", fontWeight: 600, color: "#2d6a4f" }}>
          <input
            type="checkbox"
            name="isAvailable"
            checked={data.isAvailable !== false}
            onChange={(e) => onChange({ target: { name: "isAvailable", value: e.target.checked } })}
            className="custom-checkbox"
            style={{ width: "20px", height: "20px" }}
          />
          I am currently available to monitor
        </label>
        <p style={{ fontSize: "0.85rem", color: "#6b7280", marginTop: "6px" }}>
          You can change this status anytime from your dashboard
        </p>
      </div>
    </div>
  );
};

export default CaregiverSignupForm;
