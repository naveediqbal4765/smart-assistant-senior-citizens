import React from "react";

// ============================================================
// TaskStatusBadge.js - Task Status Display Component
// ============================================================
// Displays task status with color coding and icons

const COLORS = {
  darkGreen: "#1C382A",
  mediumGreen: "#52b788",
  veryLightGreen: "#BAE4C7",
  white: "#FFFFFF",
  darkGray: "#666666",
  red: "#e63946",
  yellow: "#FFC107",
  blue: "#2196F3",
};

const TaskStatusBadge = ({ status, size = "medium" }) => {
  // Get status configuration
  const getStatusConfig = (status) => {
    switch (status) {
      case "pending":
        return {
          label: "Pending",
          color: COLORS.red,
          bgColor: "#ffebee",
          icon: "⏳",
        };
      case "assigned":
        return {
          label: "Assigned",
          color: COLORS.blue,
          bgColor: "#e3f2fd",
          icon: "👤",
        };
      case "in-progress":
        return {
          label: "In Progress",
          color: COLORS.yellow,
          bgColor: "#fff3e0",
          icon: "⚙️",
        };
      case "completed":
        return {
          label: "Completed",
          color: COLORS.mediumGreen,
          bgColor: "#e8f5e9",
          icon: "✅",
        };
      case "cancelled":
        return {
          label: "Cancelled",
          color: COLORS.darkGray,
          bgColor: "#f5f5f5",
          icon: "❌",
        };
      default:
        return {
          label: status,
          color: COLORS.darkGray,
          bgColor: "#f5f5f5",
          icon: "•",
        };
    }
  };

  const config = getStatusConfig(status);

  // Get size configuration
  const getSizeConfig = (size) => {
    switch (size) {
      case "small":
        return { padding: "4px 8px", fontSize: "10px" };
      case "large":
        return { padding: "10px 16px", fontSize: "14px" };
      default:
        return { padding: "6px 12px", fontSize: "12px" };
    }
  };

  const sizeConfig = getSizeConfig(size);

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: sizeConfig.padding,
        backgroundColor: config.bgColor,
        color: config.color,
        borderRadius: "6px",
        fontSize: sizeConfig.fontSize,
        fontWeight: 600,
        fontFamily: "Montserrat, sans-serif",
        whiteSpace: "nowrap",
        border: `1px solid ${config.color}`,
      }}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
};

export default TaskStatusBadge;
