import React from "react";
import ElderDetails from "./RoleSpecificDetails/ElderDetails";
import CaregiverDetails from "./RoleSpecificDetails/CaregiverDetails";
import VolunteerDetails from "./RoleSpecificDetails/VolunteerDetails";

const COLORS = {
  darkGreen: "#1C382A",
  mediumGreen: "#52b788",
  veryLightGreen: "#BAE4C7",
  white: "#FFFFFF",
  darkGray: "#666666",
};

const RoleSpecificDetails = ({ role, profileData, onProfileChange, onNestedChange }) => {
  return (
    <div>
      <h2 style={{ fontSize: "20px", fontWeight: 700, color: COLORS.darkGreen, marginBottom: "25px" }}>
        🎯 Role-Specific Details
      </h2>

      {role === "elder" && (
        <ElderDetails
          profileData={profileData}
          onProfileChange={onProfileChange}
        />
      )}

      {role === "caregiver" && (
        <CaregiverDetails
          profileData={profileData}
          onProfileChange={onProfileChange}
        />
      )}

      {role === "volunteer" && (
        <VolunteerDetails
          profileData={profileData}
          onProfileChange={onProfileChange}
          onNestedChange={onNestedChange}
        />
      )}

      {!["elder", "caregiver", "volunteer"].includes(role) && (
        <div style={{
          backgroundColor: "#f0f8f5",
          border: `2px solid ${COLORS.veryLightGreen}`,
          borderRadius: "8px",
          padding: "20px",
          textAlign: "center",
          color: COLORS.darkGreen,
          fontSize: "14px",
        }}>
          No role-specific details available for your account.
        </div>
      )}
    </div>
  );
};

export default RoleSpecificDetails;
