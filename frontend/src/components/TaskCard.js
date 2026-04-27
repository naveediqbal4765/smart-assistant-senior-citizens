import React from "react";

// ============================================================
// TaskCard.js - Reusable Task Card Component
// ============================================================
// Displays a single task with status, priority, and action buttons
// Used across Elder, Caregiver, and Volunteer pages

const COLORS = {
  darkGreen: "#1C382A",
  mediumGreen: "#52b788",
  darkMediumGreen: "#2d6a4f",
  veryLightGreen: "#BAE4C7",
  white: "#FFFFFF",
  lightGray: "#f5f5f5",
  darkGray: "#666666",
  red: "#e63946",
  yellow: "#FFC107",
};

const TaskCard = ({
  task,
  onViewDetails,
  onAccept,
  onReject,
  onComplete,
  onCancel,
  userRole,
}) => {
  // Get status color based on task status
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return COLORS.mediumGreen;
      case "in-progress":
        return COLORS.yellow;
      case "assigned":
        return "#2196F3";
      default:
        return COLORS.red;
    }
  };

  // Get priority color based on priority level
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return COLORS.red;
      case "medium":
        return COLORS.yellow;
      default:
        return COLORS.mediumGreen;
    }
  };

  // Get priority background color
  const getPriorityBgColor = (priority) => {
    switch (priority) {
      case "high":
        return "#ffebee";
      case "medium":
        return "#fff3e0";
      default:
        return "#e8f5e9";
    }
  };

  return (
    <div
      style={{
        backgroundColor: COLORS.veryLightGreen,
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        borderLeft: `4px solid ${getStatusColor(task.status)}`,
        transition: "all 0.3s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Task Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
          marginBottom: "15px",
        }}
      >
        <div style={{ flex: 1 }}>
          {/* Task Title */}
          <h4
            style={{
              color: COLORS.darkGreen,
              margin: "0 0 8px 0",
              fontSize: "16px",
              fontWeight: 700,
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            {task.title}
          </h4>

          {/* Task Category */}
          <p
            style={{
              color: COLORS.darkGray,
              margin: "0",
              fontSize: "12px",
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            📁 {task.category}
          </p>
        </div>

        {/* Status Badge */}
        <span
          style={{
            padding: "6px 12px",
            backgroundColor: getStatusColor(task.status),
            color: COLORS.white,
            borderRadius: "6px",
            fontSize: "11px",
            fontWeight: 600,
            fontFamily: "Montserrat, sans-serif",
            whiteSpace: "nowrap",
            marginLeft: "10px",
          }}
        >
          {task.status.toUpperCase()}
        </span>
      </div>

      {/* Task Description */}
      {task.description && (
        <p
          style={{
            color: COLORS.darkGray,
            margin: "0 0 15px 0",
            fontSize: "13px",
            fontFamily: "Montserrat, sans-serif",
            lineHeight: "1.5",
          }}
        >
          {task.description}
        </p>
      )}

      {/* Task Details */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px",
          marginBottom: "15px",
          fontSize: "12px",
          fontFamily: "Montserrat, sans-serif",
          color: COLORS.darkGray,
        }}
      >
        {/* Date */}
        <div>
          <span style={{ fontWeight: 600 }}>📅 Date:</span> {task.date}
        </div>

        {/* Location */}
        <div>
          <span style={{ fontWeight: 600 }}>📍 Location:</span> {task.location}
        </div>

        {/* Assigned Volunteer (if applicable) */}
        {task.assignedVolunteer && (
          <div>
            <span style={{ fontWeight: 600 }}>👤 Volunteer:</span>{" "}
            {task.assignedVolunteer}
          </div>
        )}

        {/* Distance (for volunteers) */}
        {task.distance && (
          <div>
            <span style={{ fontWeight: 600 }}>📏 Distance:</span> {task.distance}
          </div>
        )}
      </div>

      {/* Priority Badge */}
      <div style={{ marginBottom: "15px" }}>
        <span
          style={{
            padding: "6px 12px",
            backgroundColor: getPriorityBgColor(task.priority),
            color: getPriorityColor(task.priority),
            borderRadius: "6px",
            fontSize: "11px",
            fontWeight: 600,
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          {task.priority === "high" && "🔴 HIGH PRIORITY"}
          {task.priority === "medium" && "🟡 MEDIUM PRIORITY"}
          {task.priority === "low" && "🟢 LOW PRIORITY"}
        </span>
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        {/* View Details Button */}
        <button
          onClick={() => onViewDetails && onViewDetails(task.id)}
          style={{
            flex: 1,
            minWidth: "100px",
            padding: "10px 15px",
            backgroundColor: COLORS.mediumGreen,
            color: COLORS.white,
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "12px",
            fontFamily: "Montserrat, sans-serif",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = COLORS.darkMediumGreen)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.mediumGreen)}
        >
          View Details
        </button>

        {/* Accept Button (for volunteers) */}
        {userRole === "volunteer" && task.status === "pending" && onAccept && (
          <button
            onClick={() => onAccept(task.id)}
            style={{
              flex: 1,
              minWidth: "100px",
              padding: "10px 15px",
              backgroundColor: COLORS.mediumGreen,
              color: COLORS.white,
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "12px",
              fontFamily: "Montserrat, sans-serif",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = COLORS.darkMediumGreen)}
            onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.mediumGreen)}
          >
            Accept Task
          </button>
        )}

        {/* Reject Button (for volunteers) */}
        {userRole === "volunteer" && task.status === "pending" && onReject && (
          <button
            onClick={() => onReject(task.id)}
            style={{
              flex: 1,
              minWidth: "100px",
              padding: "10px 15px",
              backgroundColor: COLORS.red,
              color: COLORS.white,
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "12px",
              fontFamily: "Montserrat, sans-serif",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
            onMouseLeave={(e) => (e.target.style.opacity = "1")}
          >
            Reject
          </button>
        )}

        {/* Complete Button (for volunteers/caregivers) */}
        {(userRole === "volunteer" || userRole === "caregiver") &&
          task.status === "in-progress" &&
          onComplete && (
            <button
              onClick={() => onComplete(task.id)}
              style={{
                flex: 1,
                minWidth: "100px",
                padding: "10px 15px",
                backgroundColor: COLORS.mediumGreen,
                color: COLORS.white,
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "12px",
                fontFamily: "Montserrat, sans-serif",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = COLORS.darkMediumGreen)}
              onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.mediumGreen)}
            >
              Mark Complete
            </button>
          )}

        {/* Cancel Button (for elders) */}
        {userRole === "elder" && task.status !== "completed" && onCancel && (
          <button
            onClick={() => onCancel(task.id)}
            style={{
              flex: 1,
              minWidth: "100px",
              padding: "10px 15px",
              backgroundColor: COLORS.red,
              color: COLORS.white,
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "12px",
              fontFamily: "Montserrat, sans-serif",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
            onMouseLeave={(e) => (e.target.style.opacity = "1")}
          >
            Cancel Task
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
