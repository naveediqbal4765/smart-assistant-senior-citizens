// ============================================================
// components/auth/ElderSignupForm.js - Elder-Specific Signup Fields
// Handles: Lives alone, emergency contacts, medical conditions, location
// ============================================================

import React, { useState } from "react";
import { FaPlus, FaTrash, FaMapMarkerAlt } from "react-icons/fa";

const ElderSignupForm = ({ roleData, setRoleData, errors }) => {
  // ---- Local state for dynamic emergency contacts ----
  const [contacts, setContacts] = useState([
    { name: "", phone: "", email: "", relationship: "" }, // Start with 1 contact
  ]);

  // ---- Update parent roleData whenever local state changes ----
  const updateRoleData = (updates) => {
    setRoleData((prev) => ({ ...prev, ...updates }));
  };

  // ---- Add emergency contact (max 3) ----
  const addContact = () => {
    if (contacts.length >= 3) {
      return; // Max 3 contacts allowed
    }
    const newContacts = [...contacts, { name: "", phone: "", email: "", relationship: "" }];
    setContacts(newContacts);
    updateRoleData({ emergencyContacts: newContacts });
  };

  // ---- Remove emergency contact ----
  const removeContact = (index) => {
    if (contacts.length <= 1) return; // Keep at least 1 contact
    const newContacts = contacts.filter((_, i) => i !== index);
    setContacts(newContacts);
    updateRoleData({ emergencyContacts: newContacts });
  };

  // ---- Update a specific contact field ----
  const updateContact = (index, field, value) => {
    const newContacts = contacts.map((contact, i) =>
      i === index ? { ...contact, [field]: value } : contact
    );
    setContacts(newContacts);
    updateRoleData({ emergencyContacts: newContacts });
  };

  // ---- Request browser geolocation ----
  const requestLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    // Show explanation modal before requesting (as per requirements)
    const confirmed = window.confirm(
      "📍 Location Permission Required\n\n" +
      "Smart Assistant needs your location to:\n" +
      "• Send help to your exact location in emergencies\n" +
      "• Match you with nearby volunteers\n" +
      "• Enable fall detection alerts\n\n" +
      "⚠️ Without location, SOS and Fall Detection features cannot function.\n\n" +
      "Allow location access?"
    );

    if (!confirmed) {
      updateRoleData({ locationPermission: false });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        updateRoleData({
          locationPermission: true,
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        });
        alert("✅ Location access granted! Your safety features are now active.");
      },
      (error) => {
        updateRoleData({ locationPermission: false });
        alert("❌ Location access denied. SOS and Fall Detection will not work without location.");
      }
    );
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-primary">Elder-Specific Information</h3>

      {/* ---- Question 1: Lives Alone ---- */}
      <div className="bg-blue-50 rounded-senior p-5 border border-blue-200">
        <p className="text-senior-base font-semibold text-neutral-800 mb-3">
          Do you live alone? *
        </p>
        <div className="flex gap-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="livesAlone"
              value="yes"
              onChange={() => updateRoleData({ livesAlone: true })}
              className="w-5 h-5 accent-accent"
            />
            <span className="text-senior-base font-medium">Yes, I live alone</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="livesAlone"
              value="no"
              onChange={() => updateRoleData({ livesAlone: false })}
              className="w-5 h-5 accent-accent"
            />
            <span className="text-senior-base font-medium">No, I live with family</span>
          </label>
        </div>

        {/* If lives with family, show emergency contacts */}
        {roleData.livesAlone === false && (
          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-neutral-700">
                Emergency Contacts (1-3 persons) *
              </p>
              {contacts.length < 3 && (
                <button
                  type="button"
                  onClick={addContact}
                  className="flex items-center gap-2 text-accent font-semibold hover:underline"
                >
                  <FaPlus /> Add Contact
                </button>
              )}
            </div>

            {contacts.map((contact, index) => (
              <div key={index} className="bg-white rounded-senior p-4 border border-neutral-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-neutral-600">Contact {index + 1}</span>
                  {contacts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeContact(index)}
                      className="text-danger hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={contact.name}
                  onChange={(e) => updateContact(index, "name", e.target.value)}
                  className="input-field"
                />
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  value={contact.phone}
                  onChange={(e) => updateContact(index, "phone", e.target.value)}
                  className="input-field"
                />
                <input
                  type="email"
                  placeholder="Email (optional)"
                  value={contact.email}
                  onChange={(e) => updateContact(index, "email", e.target.value)}
                  className="input-field"
                />
                <select
                  value={contact.relationship}
                  onChange={(e) => updateContact(index, "relationship", e.target.value)}
                  className="input-field"
                >
                  <option value="">Select Relationship *</option>
                  <option value="Son">Son</option>
                  <option value="Daughter">Daughter</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Grandchild">Grandchild</option>
                  <option value="Friend">Friend</option>
                  <option value="Neighbor">Neighbor</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ---- Question 2: Medical Issues ---- */}
      <div className="bg-yellow-50 rounded-senior p-5 border border-yellow-200">
        <p className="text-senior-base font-semibold text-neutral-800 mb-3">
          Do you have any medical conditions? *
        </p>
        <div className="flex gap-6 mb-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="hasMedicalIssues"
              value="yes"
              onChange={() => updateRoleData({ hasMedicalIssues: true })}
              className="w-5 h-5 accent-accent"
            />
            <span className="text-senior-base font-medium">Yes</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="hasMedicalIssues"
              value="no"
              onChange={() => updateRoleData({ hasMedicalIssues: false })}
              className="w-5 h-5 accent-accent"
            />
            <span className="text-senior-base font-medium">No</span>
          </label>
        </div>

        {/* If yes, show medical conditions dropdown */}
        {roleData.hasMedicalIssues === true && (
          <div className="space-y-3">
            <p className="text-neutral-600 font-medium">Select your conditions:</p>
            {["Diabetes", "Hypertension", "Heart Disease", "Arthritis", "Dementia", "Parkinson's", "Osteoporosis", "Asthma", "Vision Impairment", "Hearing Loss"].map((condition) => (
              <label key={condition} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  value={condition}
                  onChange={(e) => {
                    const current = roleData.medicalConditions || [];
                    if (e.target.checked) {
                      updateRoleData({ medicalConditions: [...current, condition] });
                    } else {
                      updateRoleData({ medicalConditions: current.filter((c) => c !== condition) });
                    }
                  }}
                  className="w-5 h-5 accent-accent"
                />
                <span className="text-senior-base">{condition}</span>
              </label>
            ))}
            <input
              type="text"
              placeholder="Other condition (type here)"
              className="input-field mt-2"
              onChange={(e) => {
                if (e.target.value) {
                  const current = roleData.medicalConditions || [];
                  updateRoleData({ medicalConditions: [...current.filter((c) => !c.startsWith("Other:")), `Other: ${e.target.value}`] });
                }
              }}
            />
          </div>
        )}
      </div>

      {/* ---- Question 3: Location Permission ---- */}
      <div className="bg-green-50 rounded-senior p-5 border border-green-200">
        <p className="text-senior-base font-semibold text-neutral-800 mb-2">
          📍 Location Permission *
        </p>
        <p className="text-neutral-600 mb-4">
          Required for SOS alerts and volunteer matching. Without this, emergency features won't work.
        </p>
        <button
          type="button"
          onClick={requestLocation}
          className={`flex items-center gap-3 px-6 py-3 rounded-senior font-bold text-senior-base transition-all
            ${roleData.locationPermission
              ? "bg-success text-white"
              : "bg-primary text-white hover:bg-primary-dark"
            }`}
        >
          <FaMapMarkerAlt />
          {roleData.locationPermission ? "✅ Location Granted" : "Allow Location Access"}
        </button>
        {!roleData.locationPermission && (
          <p className="text-warning text-sm mt-2 font-medium">
            ⚠️ SOS and Fall Detection require location access
          </p>
        )}
      </div>
    </div>
  );
};

export default ElderSignupForm;
