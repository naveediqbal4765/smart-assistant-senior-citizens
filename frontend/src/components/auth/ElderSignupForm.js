// ============================================================
// components/auth/ElderSignupForm.js
// Elder-specific signup fields (rendered inside SignupPage)
// Fields: livesAlone, emergencyContacts, medicalConditions, locationPermission
// ============================================================

import React, { useState } from "react";

const ElderSignupForm = ({ data, onChange, errors }) => {
  // ---- Local state for dynamic emergency contacts list ----
  const [contacts, setContacts] = useState(
    data.emergencyContacts?.length > 0
      ? data.emergencyContacts
      : [{ name: "", phone: "", email: "", relationship: "" }]
  );

  // ---- Medical conditions list (searchable) ----
  const commonConditions = [
    "Diabetes", "Hypertension", "Heart Disease", "Arthritis",
    "Asthma", "Alzheimer's", "Parkinson's", "Osteoporosis",
    "Kidney Disease", "Cancer", "Depression", "Anxiety",
    "Stroke", "COPD", "Cataracts", "Hearing Loss",
  ];

  const [selectedConditions, setSelectedConditions] = useState(data.medicalConditions || []);
  const [otherCondition, setOtherCondition] = useState("");
  const [showConditionDropdown, setShowConditionDropdown] = useState(false);

  // ---- Update parent form data when contacts change ----
  const updateContacts = (updatedContacts) => {
    setContacts(updatedContacts);
    onChange({ target: { name: "emergencyContacts", value: updatedContacts } });
  };

  // ---- Add a new emergency contact row ----
  const addContact = () => {
    if (contacts.length < 3) {
      updateContacts([...contacts, { name: "", phone: "", email: "", relationship: "" }]);
    }
  };

  // ---- Remove an emergency contact row ----
  const removeContact = (index) => {
    if (contacts.length > 1) {
      updateContacts(contacts.filter((_, i) => i !== index));
    }
  };

  // ---- Update a specific contact field ----
  const updateContact = (index, field, value) => {
    const updated = contacts.map((c, i) =>
      i === index ? { ...c, [field]: value } : c
    );
    updateContacts(updated);
  };

  // ---- Toggle medical condition selection ----
  const toggleCondition = (condition) => {
    const updated = selectedConditions.includes(condition)
      ? selectedConditions.filter((c) => c !== condition)
      : [...selectedConditions, condition];
    setSelectedConditions(updated);
    onChange({ target: { name: "medicalConditions", value: updated } });
  };

  // ---- Add custom "Other" condition ----
  const addOtherCondition = () => {
    if (otherCondition.trim() && !selectedConditions.includes(otherCondition.trim())) {
      const updated = [...selectedConditions, otherCondition.trim()];
      setSelectedConditions(updated);
      onChange({ target: { name: "medicalConditions", value: updated } });
      setOtherCondition("");
    }
  };

  const sectionStyle = {
    backgroundColor: "rgba(255,255,255,0.35)",
    borderRadius: "12px",
    padding: "16px",
    marginBottom: "20px",
    border: "1px solid #a8d5b5",
  };

  const questionStyle = {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#1b4332",
    marginBottom: "10px",
  };

  return (
    <div>

      {/* ============================================================
          QUESTION 1: Lives Alone?
          ============================================================ */}
      <div style={sectionStyle}>
        <p style={questionStyle}>Q1. Do you live alone?</p>
        <div style={{ display: "flex", gap: "16px" }}>
          {/* Yes */}
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "1rem", fontWeight: 600, color: "#2d6a4f" }}>
            <input
              type="radio"
              name="livesAlone"
              value="true"
              checked={data.livesAlone === true}
              onChange={() => onChange({ target: { name: "livesAlone", value: true } })}
              style={{ width: "20px", height: "20px", accentColor: "#2d6a4f" }}
            />
            Yes
          </label>
          {/* No */}
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "1rem", fontWeight: 600, color: "#2d6a4f" }}>
            <input
              type="radio"
              name="livesAlone"
              value="false"
              checked={data.livesAlone === false}
              onChange={() => onChange({ target: { name: "livesAlone", value: false } })}
              style={{ width: "20px", height: "20px", accentColor: "#2d6a4f" }}
            />
            No, I live with family
          </label>
        </div>

        {/* ---- If lives with family: show emergency contacts ---- */}
        {data.livesAlone === false && (
          <div style={{ marginTop: "16px" }}>
            <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "#2d6a4f", marginBottom: "10px" }}>
              Family Emergency Contacts (min 1, max 3):
            </p>

            {contacts.map((contact, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: "rgba(255,255,255,0.5)",
                  borderRadius: "10px",
                  padding: "12px",
                  marginBottom: "10px",
                  border: "1px solid #c8e6c9",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontWeight: 700, color: "#1b4332", fontSize: "0.9rem" }}>
                    Contact {index + 1}
                  </span>
                  {contacts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeContact(index)}
                      style={{ background: "#e63946", color: "white", border: "none", borderRadius: "6px", padding: "3px 10px", cursor: "pointer", fontSize: "0.8rem", fontWeight: 700 }}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  <div>
                    <label className="form-label" style={{ fontSize: "0.82rem" }}>Full Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ fontSize: "0.9rem", minHeight: "42px" }}
                      value={contact.name}
                      onChange={(e) => updateContact(index, "name", e.target.value)}
                      placeholder="e.g. Ali Khan"
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: "0.82rem" }}>Phone *</label>
                    <input
                      type="tel"
                      className="form-input"
                      style={{ fontSize: "0.9rem", minHeight: "42px" }}
                      value={contact.phone}
                      onChange={(e) => updateContact(index, "phone", e.target.value)}
                      placeholder="+923001234567"
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: "0.82rem" }}>Email (optional)</label>
                    <input
                      type="email"
                      className="form-input"
                      style={{ fontSize: "0.9rem", minHeight: "42px" }}
                      value={contact.email}
                      onChange={(e) => updateContact(index, "email", e.target.value)}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: "0.82rem" }}>Relationship *</label>
                    <select
                      className="form-input"
                      style={{ fontSize: "0.9rem", minHeight: "42px" }}
                      value={contact.relationship}
                      onChange={(e) => updateContact(index, "relationship", e.target.value)}
                    >
                      <option value="">Select...</option>
                      <option>Son</option>
                      <option>Daughter</option>
                      <option>Spouse</option>
                      <option>Sibling</option>
                      <option>Friend</option>
                      <option>Neighbor</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}

            {contacts.length < 3 && (
              <button
                type="button"
                onClick={addContact}
                style={{
                  background: "transparent",
                  border: "2px dashed #52b788",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  color: "#2d6a4f",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  width: "100%",
                }}
              >
                + Add Another Contact
              </button>
            )}
          </div>
        )}
      </div>

      {/* ============================================================
          QUESTION 2: Medical Issues?
          ============================================================ */}
      <div style={sectionStyle}>
        <p style={questionStyle}>Q2. Do you have any medical conditions?</p>
        <div style={{ display: "flex", gap: "16px", marginBottom: "12px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "1rem", fontWeight: 600, color: "#2d6a4f" }}>
            <input
              type="radio"
              name="hasMedicalIssues"
              checked={data.hasMedicalIssues === true}
              onChange={() => onChange({ target: { name: "hasMedicalIssues", value: true } })}
              style={{ width: "20px", height: "20px", accentColor: "#2d6a4f" }}
            />
            Yes
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "1rem", fontWeight: 600, color: "#2d6a4f" }}>
            <input
              type="radio"
              name="hasMedicalIssues"
              checked={data.hasMedicalIssues === false}
              onChange={() => onChange({ target: { name: "hasMedicalIssues", value: false } })}
              style={{ width: "20px", height: "20px", accentColor: "#2d6a4f" }}
            />
            No
          </label>
        </div>

        {/* ---- If yes: show condition selector ---- */}
        {data.hasMedicalIssues === true && (
          <div>
            {/* Selected conditions tags */}
            {selectedConditions.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px" }}>
                {selectedConditions.map((c) => (
                  <span
                    key={c}
                    style={{
                      backgroundColor: "#1b4332",
                      color: "white",
                      borderRadius: "20px",
                      padding: "4px 12px",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    {c}
                    <button
                      type="button"
                      onClick={() => toggleCondition(c)}
                      style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: "1rem", lineHeight: 1, padding: 0 }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Dropdown list */}
            <div style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => setShowConditionDropdown(!showConditionDropdown)}
                className="form-input"
                style={{ textAlign: "left", cursor: "pointer", color: "#6b7280" }}
              >
                Select conditions... ▾
              </button>
              {showConditionDropdown && (
                <div style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  backgroundColor: "white",
                  border: "1.5px solid #a8d5b5",
                  borderRadius: "8px",
                  zIndex: 50,
                  maxHeight: "180px",
                  overflowY: "auto",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}>
                  {commonConditions.map((c) => (
                    <div
                      key={c}
                      onClick={() => { toggleCondition(c); }}
                      style={{
                        padding: "10px 14px",
                        cursor: "pointer",
                        fontSize: "0.95rem",
                        fontWeight: selectedConditions.includes(c) ? 700 : 400,
                        color: selectedConditions.includes(c) ? "#1b4332" : "#333",
                        backgroundColor: selectedConditions.includes(c) ? "#e8f5e9" : "transparent",
                      }}
                    >
                      {selectedConditions.includes(c) ? "✓ " : ""}{c}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Other condition text input */}
            <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
              <input
                type="text"
                className="form-input"
                style={{ fontSize: "0.9rem", minHeight: "42px" }}
                placeholder="Other condition..."
                value={otherCondition}
                onChange={(e) => setOtherCondition(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addOtherCondition())}
              />
              <button
                type="button"
                onClick={addOtherCondition}
                style={{ background: "#2d6a4f", color: "white", border: "none", borderRadius: "8px", padding: "0 16px", cursor: "pointer", fontWeight: 700, whiteSpace: "nowrap" }}
              >
                Add
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================
          QUESTION 3: Location Permission
          ============================================================ */}
      <div style={sectionStyle}>
        <p style={questionStyle}>Q3. Allow location access?</p>
        <p style={{ fontSize: "0.88rem", color: "#4a4a4a", marginBottom: "10px", lineHeight: 1.5 }}>
          ⚠️ Location is required for SOS alerts and fall detection. Without it, emergency features cannot function.
        </p>
        <div style={{ display: "flex", gap: "16px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "1rem", fontWeight: 600, color: "#2d6a4f" }}>
            <input
              type="radio"
              name="locationPermission"
              checked={data.locationPermission === true}
              onChange={() => {
                onChange({ target: { name: "locationPermission", value: true } });
                // Request browser geolocation
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    (pos) => {
                      onChange({ target: { name: "lat", value: pos.coords.latitude } });
                      onChange({ target: { name: "lng", value: pos.coords.longitude } });
                    },
                    () => {}
                  );
                }
              }}
              style={{ width: "20px", height: "20px", accentColor: "#2d6a4f" }}
            />
            Yes, allow location
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "1rem", fontWeight: 600, color: "#e63946" }}>
            <input
              type="radio"
              name="locationPermission"
              checked={data.locationPermission === false}
              onChange={() => onChange({ target: { name: "locationPermission", value: false } })}
              style={{ width: "20px", height: "20px", accentColor: "#e63946" }}
            />
            No (SOS disabled)
          </label>
        </div>
        {errors?.locationPermission && (
          <p className="error-msg">⚠️ {errors.locationPermission}</p>
        )}
      </div>

    </div>
  );
};

export default ElderSignupForm;
