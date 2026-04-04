// ============================================================
// components/auth/CaregiverSignupForm.js - Caregiver Signup Fields
// Handles: Relationship, Elder pairing, notification consent
// ============================================================

import React from "react";
import { FaBell, FaLink } from "react-icons/fa";

const CaregiverSignupForm = ({ roleData, setRoleData, errors }) => {
  const updateRoleData = (updates) => {
    setRoleData((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-primary">Caregiver Information</h3>

      {/* ---- Relationship to Elder ---- */}
      <div>
        <label className="form-label">Your Relationship to the Elder *</label>
        <select
          value={roleData.relationshipToElder || ""}
          onChange={(e) => updateRoleData({ relationshipToElder: e.target.value })}
          className="input-field"
        >
          <option value="">Select Relationship</option>
          <option value="Son">Son</option>
          <option value="Daughter">Daughter</option>
          <option value="Spouse">Spouse</option>
          <option value="Sibling">Sibling</option>
          <option value="Professional Nurse">Professional Nurse</option>
          <option value="Paid Caregiver">Paid Caregiver</option>
          <option value="Neighbor">Neighbor</option>
          <option value="Friend">Friend</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* ---- Elder Pairing Section ---- */}
      <div className="bg-blue-50 rounded-senior p-5 border border-blue-200">
        <div className="flex items-center gap-3 mb-4">
          <FaLink className="text-blue-600 text-xl" />
          <h4 className="text-lg font-bold text-neutral-800">Link to Elder's Account</h4>
        </div>
        <p className="text-neutral-600 mb-4 text-senior-base">
          Ask the elder to share their <strong>Email</strong> and <strong>6-digit Pairing Code</strong> from their dashboard.
        </p>

        {/* Elder's Email */}
        <div className="mb-4">
          <label className="form-label">Elder's Email Address *</label>
          <input
            type="email"
            value={roleData.linkedElderEmail || ""}
            onChange={(e) => updateRoleData({ linkedElderEmail: e.target.value })}
            placeholder="Enter elder's registered email"
            className="input-field"
          />
        </div>

        {/* 6-Digit Pairing Code */}
        <div>
          <label className="form-label">6-Digit Pairing Code *</label>
          <input
            type="text"
            value={roleData.pairingCode || ""}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 6); // Only digits, max 6
              updateRoleData({ pairingCode: val });
            }}
            placeholder="Enter 6-digit code"
            maxLength={6}
            className="input-field tracking-widest text-center text-2xl font-bold"
          />
          <p className="text-neutral-500 text-sm mt-1">
            The elder can find this code in their dashboard under "Share Access"
          </p>
        </div>
      </div>

      {/* ---- Push Notification Consent ---- */}
      <div className="bg-orange-50 rounded-senior p-5 border border-orange-200">
        <div className="flex items-center gap-3 mb-3">
          <FaBell className="text-orange-500 text-xl" />
          <h4 className="text-lg font-bold text-neutral-800">Emergency Notifications *</h4>
        </div>
        <p className="text-neutral-600 mb-4 text-senior-base">
          You must enable notifications to receive real-time SOS alerts from the elder.
          Without this, you will NOT be notified during emergencies.
        </p>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={roleData.notificationsEnabled || false}
            onChange={(e) => updateRoleData({ notificationsEnabled: e.target.checked })}
            className="w-6 h-6 mt-1 accent-accent flex-shrink-0"
          />
          <span className="text-senior-base font-medium text-neutral-700">
            I agree to receive push notifications for SOS alerts and health updates
          </span>
        </label>
        {!roleData.notificationsEnabled && (
          <p className="text-warning text-sm mt-2 font-medium">
            ⚠️ Without notifications, you will not receive real-time SOS pings
          </p>
        )}
      </div>

      {/* ---- Active Status ---- */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={roleData.isAvailable !== false}
            onChange={(e) => updateRoleData({ isAvailable: e.target.checked })}
            className="w-6 h-6 accent-accent"
          />
          <span className="text-senior-base font-semibold text-neutral-700">
            I am currently available to monitor the senior
          </span>
        </label>
      </div>
    </div>
  );
};

export default CaregiverSignupForm;
