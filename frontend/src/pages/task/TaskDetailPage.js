import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

// ============================================================
// TaskDetailPage.js - Detailed Task View Page
// ============================================================
// Shows complete task information with actions

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

const TaskDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const task = location.state?.task || {};

  const [isLoading, setIsLoading] = useState(false);

  const handleMarkComplete = async () => {
    setIsLoading(true);
    try {
      toast.success("Task marked as complete!");
      setTimeout(() => navigate(-1), 1500);
    } catch (error) {
      toast.error("Failed to mark task complete");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    setIsLoading(true);
    try {
      toast.success("Task cancelled!");
      setTimeout(() => navigate(-1), 1500);
    } catch (error) {
      toast.error("Failed to cancel task");
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return COLORS.red;
      case "medium":
        return COLORS.yellow;
      case "low":
        return COLORS.mediumGreen;
      default:
        return COLORS.darkGray;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return COLORS.red;
      case "assigned":
        return COLORS.yellow;
      case "in-progress":
        return COLORS.yellow;
      case "completed":
        return COLORS.mediumGreen;
      default:
        return COLORS.darkGray;
    }
  };

  return (
    <div style={{ backgroundColor: COLORS.lightGray, minHeight: "100vh", paddingBottom: "40px" }}>
      {/* Header */}
      <div style={{ backgroundColor: COLORS.darkGreen, padding: "30px 20px", color: COLORS.white }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "none",
              border: "none",
              color: COLORS.white,
              cursor: "pointer",
              fontSize: "16px",
              marginBottom: "15px",
              fontWeight: 600,
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            ← Back
          </button>
          <h1 style={{ fontSize: "32px", fontWeight: 700, margin: "0 0 8px 0" }}>
            📋 Task Details
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "30px 20px" }}>
        <div
          style={{
            backgroundColor: COLORS.white,
            borderRadius: "12px",
            padding: "30px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          {/* Title and Status */}
          <div style={{ marginBottom: "25px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
                marginBottom: "15px",
              }}
            >
              <h2
                style={{
                  color: COLORS.darkGreen,
                  margin: "0",
                  fontSize: "28px",
                  fontWeight: 700,
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                {task.title || "Task Title"}
              </h2>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >
                <span
                  style={{
                    backgroundColor: getPriorityColor(task.priority),
                    color: COLORS.white,
                    padding: "8px 16px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: 600,
                    fontFamily: "Montserrat, sans-serif",
                    textTransform: "capitalize",
                  }}
                >
                  {task.priority || "medium"} Priority
                </span>
                <span
                  style={{
                    backgroundColor: getStatusColor(task.status),
                    color: COLORS.white,
                    padding: "8px 16px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: 600,
                    fontFamily: "Montserrat, sans-serif",
                    textTransform: "capitalize",
                  }}
                >
                  {task.status || "pending"}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: "25px" }}>
            <h3
              style={{
                color: COLORS.darkGreen,
                margin: "0 0 10px 0",
                fontSize: "16px",
                fontWeight: 600,
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Description
            </h3>
            <p
              style={{
                color: COLORS.darkGray,
                margin: "0",
                fontSize: "14px",
                fontFamily: "Montserrat, sans-serif",
                lineHeight: "1.6",
              }}
            >
              {task.description || "No description provided"}
            </p>
          </div>

          {/* Task Information Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
              marginBottom: "25px",
            }}
          >
            {/* Category */}
            <div
              style={{
                backgroundColor: COLORS.lightGray,
                borderRadius: "8px",
                padding: "15px",
              }}
            >
              <h4
                style={{
                  color: COLORS.darkGreen,
                  margin: "0 0 8px 0",
                  fontSize: "12px",
                  fontWeight: 600,
                  fontFamily: "Montserrat, sans-serif",
                  textTransform: "uppercase",
                }}
              >
                Category
              </h4>
              <p
                style={{
                  color: COLORS.darkGray,
                  margin: "0",
                  fontSize: "14px",
                  fontFamily: "Montserrat, sans-serif",
                  textTransform: "capitalize",
                }}
              >
                {task.category || "N/A"}
              </p>
            </div>

            {/* Date */}
            <div
              style={{
                backgroundColor: COLORS.lightGray,
                borderRadius: "8px",
                padding: "15px",
              }}
            >
              <h4
                style={{
                  color: COLORS.darkGreen,
                  margin: "0 0 8px 0",
                  fontSize: "12px",
                  fontWeight: 600,
                  fontFamily: "Montserrat, sans-serif",
                  textTransform: "uppercase",
                }}
              >
                Date & Time
              </h4>
              <p
                style={{
                  color: COLORS.darkGray,
                  margin: "0",
                  fontSize: "14px",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                {task.date} {task.time && `at ${task.time}`}
              </p>
            </div>

            {/* Location */}
            <div
              style={{
                backgroundColor: COLORS.lightGray,
                borderRadius: "8px",
                padding: "15px",
              }}
            >
              <h4
                style={{
                  color: COLORS.darkGreen,
                  margin: "0 0 8px 0",
                  fontSize: "12px",
                  fontWeight: 600,
                  fontFamily: "Montserrat, sans-serif",
                  textTransform: "uppercase",
                }}
              >
                Location
              </h4>
              <p
                style={{
                  color: COLORS.darkGray,
                  margin: "0",
                  fontSize: "14px",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                {task.address || task.location || "N/A"}
              </p>
            </div>
          </div>

          {/* Assigned Volunteer */}
          {task.assignedVolunteer && (
            <div
              style={{
                backgroundColor: COLORS.veryLightGreen,
                borderRadius: "8px",
                padding: "15px",
                marginBottom: "25px",
              }}
            >
              <h4
                style={{
                  color: COLORS.darkGreen,
                  margin: "0 0 10px 0",
                  fontSize: "14px",
                  fontWeight: 600,
                  fontFamily: "Montserrat, sans-serif",
              }}
              >
                Assigned Volunteer
              </h4>
              <p
                style={{
                  color: COLORS.darkGray,
                  margin: "0",
                  fontSize: "14px",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                {task.assignedVolunteer}
              </p>
            </div>
          )}

          {/* Additional Notes */}
          {task.notes && (
            <div
              style={{
                backgroundColor: COLORS.lightGray,
                borderRadius: "8px",
                padding: "15px",
                marginBottom: "25px",
              }}
            >
              <h4
                style={{
                  color: COLORS.darkGreen,
                  margin: "0 0 10px 0",
                  fontSize: "14px",
                  fontWeight: 600,
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                Additional Notes
              </h4>
              <p
                style={{
                  color: COLORS.darkGray,
                  margin: "0",
                  fontSize: "14px",
                  fontFamily: "Montserrat, sans-serif",
                  lineHeight: "1.6",
                }}
              >
                {task.notes}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              gap: "15px",
              justifyContent: "flex-end",
              borderTop: `1px solid ${COLORS.veryLightGreen}`,
              paddingTop: "20px",
            }}
          >
            <button
              onClick={() => navigate(-1)}
              style={{
                padding: "12px 24px",
                backgroundColor: COLORS.darkGray,
                color: COLORS.white,
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "13px",
                fontFamily: "Montserrat, sans-serif",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
              onMouseLeave={(e) => (e.target.style.opacity = "1")}
            >
              Back
            </button>

            {task.status === "in-progress" && (
              <button
                onClick={handleMarkComplete}
                disabled={isLoading}
                style={{
                  padding: "12px 24px",
                  backgroundColor: COLORS.mediumGreen,
                  color: COLORS.white,
                  border: "none",
                  borderRadius: "8px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  fontWeight: 600,
                  fontSize: "13px",
                  fontFamily: "Montserrat, sans-serif",
                  opacity: isLoading ? 0.7 : 1,
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) e.target.style.backgroundColor = COLORS.darkMediumGreen;
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) e.target.style.backgroundColor = COLORS.mediumGreen;
                }}
              >
                {isLoading ? "Marking..." : "Mark as Complete"}
              </button>
            )}

            {task.status === "pending" && (
              <button
                onClick={handleCancel}
                disabled={isLoading}
                style={{
                  padding: "12px 24px",
                  backgroundColor: COLORS.red,
                  color: COLORS.white,
                  border: "none",
                  borderRadius: "8px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  fontWeight: 600,
                  fontSize: "13px",
                  fontFamily: "Montserrat, sans-serif",
                  opacity: isLoading ? 0.7 : 1,
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) e.target.style.opacity = "0.8";
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) e.target.style.opacity = "1";
                }}
              >
                {isLoading ? "Cancelling..." : "Cancel Task"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailPage;
