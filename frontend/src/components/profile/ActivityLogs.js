import React from "react";

const COLORS = {
  darkGreen: "#1C382A",
  mediumGreen: "#52b788",
  veryLightGreen: "#BAE4C7",
};

const ActivityLogs = () => {
  return (
    <div>
      <h2 style={{ fontSize: "20px", fontWeight: 700, color: COLORS.darkGreen, marginBottom: "25px" }}>
        📊 Activity Logs
      </h2>
      <div style={{
        backgroundColor: "#f0f8f5",
        border: `2px solid ${COLORS.veryLightGreen}`,
        borderRadius: "8px",
        padding: "20px",
        textAlign: "center",
        color: COLORS.darkGreen,
      }}>
        <p>Your activity history will appear here...</p>
      </div>
    </div>
  );
};

export default ActivityLogs;
