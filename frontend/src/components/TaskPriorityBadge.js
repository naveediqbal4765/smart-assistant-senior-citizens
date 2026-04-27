import React from "react";

// ============================================================
// TaskPriorityBadge.js - Task Priority Display Component
// ============================================================
// Displays task priority level with color coding and icons

const COLORS = {
  red: "#e63946",
  yellow: "#FFC107",
  mediumGreen: "#52b788",
  darkGray: "#666666",
};

const TaskPriorityBadge = ({ priority, size = "medium" }) => {
  // Get priority configuration
  const getPriorityConfig = (priority) => {
    switch (priority) {
      case "high":
        return {
          label: "High Priority",
          color: COLORS.red,
          bgColor: "#ffebee",
          icon: "🔴",
        };
      case "medium":
        return {
          label: "Medium Priority",
          color: COLORS.yellow,
          bgColor: "#fff3e0",
          icon: "🟡",
        };
      case "low":
        return {
          label: "Low Priority",
          color: COLORS.mediumGreen,
          bgColor: "#e8f5e9",
          icon: "🟢",
        };
      default:
        return {
          label: priority,
          color: COLORS.darkGray,
          bgColor: "#f5f5f5",
          icon: "•",
        };
    }
  };

  const config = getPriorityConfig(priority);

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

export default TaskPriorityBadge;
