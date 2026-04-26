// ============================================================
// components/auth/VolunteerSignupForm.js
// Volunteer-specific signup fields
// ============================================================

import React, { useState } from "react";

const VolunteerSignupForm = ({ data, onChange, errors }) => {
  const [showAvailability, setShowAvailability] = useState(false);

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

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const timeSlots = ["Morning", "Afternoon", "Evening", "Night"];

  const selectedDays = data.availability?.days || [];
  const selectedSlots = data.availability?.timeSlots || [];

  const toggleDay = (day) => {
    const updated = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];
    onChange({ target: { name: "availability", value: { ...data.availability, days: updated } } });
  };

  const toggleSlot = (slot) => {
    const updated = selectedSlots.includes(slot)
      ? selectedSlots.filter((s) => s !== slot)
      : [...selectedSlots, slot];
    onChange({ target: { name: "availability", value: { ...data.availability, timeSlots: updated } } });
  };

  return (
    <div>
      {/* NGO Affiliation */}
      <div style={sectionStyle}>
        <label style={labelStyle}>NGO Affiliation (optional)</label>
        <select
          name="affiliation"
          value={data.affiliation || ""}
          onChange={onChange}
          className="form-input"
        >
          <option value="">Not affiliated</option>
          <option>Edhi Foundation</option>
          <option>Al-Khidmat Foundation</option>
          <option>Chhipa Welfare Association</option>
          <option>AKDN (Aga Khan Development Network)</option>
          <option>UN Agencies</option>
          <option>Other</option>
        </select>
      </div>

      {/* NGO ID */}
      {data.affiliation && data.affiliation !== "Not affiliated" && (
        <div style={sectionStyle}>
          <label style={labelStyle}>NGO ID Number (if applicable)</label>
          <input
            type="text"
            name="ngoId"
            value={data.ngoId || ""}
            onChange={onChange}
            className="form-input"
            placeholder="e.g. NGO-12345"
          />
        </div>
      )}

      {/* Service Radius */}
      <div style={sectionStyle}>
        <label style={labelStyle}>Service Radius: {data.serviceRadius || 5} km</label>
        <input
          type="range"
          name="serviceRadius"
          min="1"
          max="10"
          value={data.serviceRadius || 5}
          onChange={onChange}
          style={{ width: "100%", height: "6px", borderRadius: "3px", accentColor: "#2d6a4f" }}
        />
        <p style={{ fontSize: "0.85rem", color: "#6b7280", marginTop: "6px" }}>
          How far are you willing to travel to help seniors?
        </p>
      </div>

      {/* Skills */}
      <div style={sectionStyle}>
        <label style={labelStyle}>Skills *</label>
        <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "10px" }}>
          Select all skills you can offer:
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {["Medical", "Errands", "Physical Help"].map((skill) => (
            <label key={skill} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "0.95rem", fontWeight: 600, color: "#2d6a4f" }}>
              <input
                type="checkbox"
                checked={(data.skills || []).includes(skill)}
                onChange={(e) => {
                  const updated = e.target.checked
                    ? [...(data.skills || []), skill]
                    : (data.skills || []).filter((s) => s !== skill);
                  onChange({ target: { name: "skills", value: updated } });
                }}
                className="custom-checkbox"
                style={{ width: "18px", height: "18px" }}
              />
              {skill}
            </label>
          ))}
        </div>
        {errors?.skills && <p className="error-msg">Warning {errors.skills}</p>}
      </div>

      {/* Availability Schedule */}
      <div style={sectionStyle}>
        <button
          type="button"
          onClick={() => setShowAvailability(!showAvailability)}
          style={{
            background: "transparent",
            border: "none",
            color: "#2d6a4f",
            fontSize: "0.95rem",
            fontWeight: 700,
            cursor: "pointer",
            padding: 0,
            marginBottom: "10px",
          }}
        >
          {showAvailability ? "" : ""} Set Your Availability Schedule
        </button>

        {showAvailability && (
          <div>
            {/* Days */}
            <div style={{ marginBottom: "16px" }}>
              <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1b4332", marginBottom: "8px" }}>
                Available Days:
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: "8px" }}>
                {days.map((day) => (
                  <label key={day} style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "0.9rem", fontWeight: 600, color: "#2d6a4f" }}>
                    <input
                      type="checkbox"
                      checked={selectedDays.includes(day)}
                      onChange={() => toggleDay(day)}
                      className="custom-checkbox"
                      style={{ width: "16px", height: "16px" }}
                    />
                    {day.slice(0, 3)}
                  </label>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            <div>
              <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1b4332", marginBottom: "8px" }}>
                Preferred Time Slots:
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                {timeSlots.map((slot) => (
                  <label key={slot} style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "0.9rem", fontWeight: 600, color: "#2d6a4f" }}>
                    <input
                      type="checkbox"
                      checked={selectedSlots.includes(slot)}
                      onChange={() => toggleSlot(slot)}
                      className="custom-checkbox"
                      style={{ width: "16px", height: "16px" }}
                    />
                    {slot}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Location Permission */}
      <div style={sectionStyle}>
        <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "1rem", fontWeight: 600, color: "#2d6a4f" }}>
          <input
            type="checkbox"
            name="locationPermission"
            checked={data.locationPermission || false}
            onChange={(e) => {
              onChange({ target: { name: "locationPermission", value: e.target.checked } });
              if (e.target.checked && navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (pos) => {
                    onChange({ target: { name: "lat", value: pos.coords.latitude } });
                    onChange({ target: { name: "lng", value: pos.coords.longitude } });
                  },
                  () => {}
                );
              }
            }}
            className="custom-checkbox"
            style={{ width: "20px", height: "20px" }}
          />
          Allow location access for task matching
        </label>
        <p style={{ fontSize: "0.85rem", color: "#6b7280", marginTop: "6px" }}>
          This helps us match you with nearby seniors who need help
        </p>
      </div>
    </div>
  );
};

export default VolunteerSignupForm;
