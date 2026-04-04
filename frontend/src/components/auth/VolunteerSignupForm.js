// ============================================================
// components/auth/VolunteerSignupForm.js - Volunteer Signup Fields
// Handles: Availability, affiliation, skills, service radius, location
// ============================================================

import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const TIME_SLOTS = ["Morning", "Afternoon", "Evening", "Night"];
const SKILLS = ["Medical", "Errands", "Physical Help"];
const NGOS = ["Edhi Foundation", "Al-Khidmat Foundation", "Chhipa Welfare", "AKDN", "UN Volunteers", "Other", "None"];

const VolunteerSignupForm = ({ roleData, setRoleData, errors }) => {
  const updateRoleData = (updates) => {
    setRoleData((prev) => ({ ...prev, ...updates }));
  };

  // ---- Toggle day selection ----
  const toggleDay = (day) => {
    const current = roleData.availability?.days || [];
    const updated = current.includes(day)
      ? current.filter((d) => d !== day)
      : [...current, day];
    updateRoleData({ availability: { ...roleData.availability, days: updated } });
  };

  // ---- Toggle time slot selection ----
  const toggleTimeSlot = (slot) => {
    const current = roleData.availability?.timeSlots || [];
    const updated = current.includes(slot)
      ? current.filter((s) => s !== slot)
      : [...current, slot];
    updateRoleData({ availability: { ...roleData.availability, timeSlots: updated } });
  };

  // ---- Toggle skill selection ----
  const toggleSkill = (skill) => {
    const current = roleData.skills || [];
    const updated = current.includes(skill)
      ? current.filter((s) => s !== skill)
      : [...current, skill];
    updateRoleData({ skills: updated });
  };

  // ---- Request location ----
  const requestLocation = () => {
    const confirmed = window.confirm(
      "📍 Location Permission Required\n\n" +
      "Smart Assistant needs your location to:\n" +
      "• Match you with nearby seniors who need help\n" +
      "• Calculate your service radius\n" +
      "• Send you proximity-based task alerts\n\n" +
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
          location: { lat: position.coords.latitude, lng: position.coords.longitude },
        });
      },
      () => updateRoleData({ locationPermission: false })
    );
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-primary">Volunteer Information</h3>

      {/* ---- Availability: Days of Week ---- */}
      <div className="bg-green-50 rounded-senior p-5 border border-green-200">
        <h4 className="text-lg font-bold text-neutral-800 mb-3">📅 Available Days *</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {DAYS.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              className={`py-3 px-4 rounded-senior font-semibold text-sm transition-all border-2
                ${(roleData.availability?.days || []).includes(day)
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-neutral-600 border-neutral-200 hover:border-primary"
                }`}
            >
              {day.slice(0, 3)} {/* Show abbreviated day name */}
            </button>
          ))}
        </div>
      </div>

      {/* ---- Availability: Time Slots ---- */}
      <div>
        <h4 className="text-lg font-bold text-neutral-800 mb-3">⏰ Preferred Time Slots *</h4>
        <div className="grid grid-cols-2 gap-3">
          {TIME_SLOTS.map((slot) => (
            <button
              key={slot}
              type="button"
              onClick={() => toggleTimeSlot(slot)}
              className={`py-3 px-4 rounded-senior font-semibold transition-all border-2
                ${(roleData.availability?.timeSlots || []).includes(slot)
                  ? "bg-accent text-white border-accent"
                  : "bg-white text-neutral-600 border-neutral-200 hover:border-accent"
                }`}
            >
              {slot === "Morning" && "🌅 Morning"}
              {slot === "Afternoon" && "☀️ Afternoon"}
              {slot === "Evening" && "🌆 Evening"}
              {slot === "Night" && "🌙 Night"}
            </button>
          ))}
        </div>
      </div>

      {/* ---- NGO Affiliation ---- */}
      <div>
        <label className="form-label">NGO Affiliation (if any)</label>
        <select
          value={roleData.affiliation || ""}
          onChange={(e) => updateRoleData({ affiliation: e.target.value })}
          className="input-field"
        >
          <option value="">Select NGO</option>
          {NGOS.map((ngo) => (
            <option key={ngo} value={ngo}>{ngo}</option>
          ))}
        </select>
      </div>

      {/* NGO ID (if affiliated) */}
      {roleData.affiliation && roleData.affiliation !== "None" && (
        <div>
          <label className="form-label">NGO ID Number (if applicable)</label>
          <input
            type="text"
            value={roleData.ngoId || ""}
            onChange={(e) => updateRoleData({ ngoId: e.target.value })}
            placeholder="Enter your NGO ID"
            className="input-field"
          />
        </div>
      )}

      {/* ---- Service Radius Slider ---- */}
      <div>
        <label className="form-label">
          Service Radius: <span className="text-accent font-bold">{roleData.serviceRadius || 5} km</span>
        </label>
        <input
          type="range"
          min={1}
          max={10}
          value={roleData.serviceRadius || 5}
          onChange={(e) => updateRoleData({ serviceRadius: parseInt(e.target.value) })}
          className="w-full h-3 accent-accent cursor-pointer"
        />
        <div className="flex justify-between text-sm text-neutral-500 mt-1">
          <span>1 km</span>
          <span>5 km</span>
          <span>10 km</span>
        </div>
      </div>

      {/* ---- Skills Multi-Select ---- */}
      <div>
        <h4 className="text-lg font-bold text-neutral-800 mb-3">🛠️ Your Skills *</h4>
        <div className="grid grid-cols-3 gap-3">
          {SKILLS.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => toggleSkill(skill)}
              className={`py-3 px-4 rounded-senior font-semibold text-sm transition-all border-2
                ${(roleData.skills || []).includes(skill)
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-neutral-600 border-neutral-200 hover:border-primary"
                }`}
            >
              {skill === "Medical" && "🏥 Medical"}
              {skill === "Errands" && "🛒 Errands"}
              {skill === "Physical Help" && "💪 Physical Help"}
            </button>
          ))}
        </div>
      </div>

      {/* ---- Location Permission ---- */}
      <div className="bg-green-50 rounded-senior p-5 border border-green-200">
        <p className="text-senior-base font-semibold text-neutral-800 mb-2">
          📍 Location Permission *
        </p>
        <p className="text-neutral-600 mb-4">
          Required to match you with nearby seniors who need help.
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
      </div>
    </div>
  );
};

export default VolunteerSignupForm;
