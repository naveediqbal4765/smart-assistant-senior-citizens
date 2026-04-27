import React, { useState } from "react";
import toast from "react-hot-toast";

// ============================================================
// TaskAssignmentModal.js - Task Assignment Modal Component
// ============================================================
// Modal for assigning tasks to volunteers or caregivers

const COLORS = {
  darkGreen: "#1C382A",
  mediumGreen: "#52b788",
  darkMediumGreen: "#2d6a4f",
  veryLightGreen: "#BAE4C7",
  white: "#FFFFFF",
  lightGray: "#f5f5f5",
  darkGray: "#666666",
  red: "#e63946",
};

const TaskAssignmentModal = ({ isOpen, task, volunteers, onAssign, onClose }) => {
  const [selectedVolunteer, setSelectedVolunteer] = useState("");
  const [notes, setNotes] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  // Handle assignment
  const handleAssign = async () => {
    if (!selectedVolunteer) {
      toast.error("Please select a volunteer");
      return;
    }

    setIsAssigning(true);
    try {
      await onAssign({
        taskId: task.id,
        volunteerId: selectedVolunteer,
        notes: notes,
      });
      toast.success("Task assigned successfully!");
      handleClose();
    } catch (error) {
      toast.error(error.message || "Failed to assign task");
    } finally {
      setIsAssigning(false);
    }
  };

  // Handle close
  const handleClose = () => {
    setSelectedVolunteer("");
    setNotes("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={handleClose}
    >
      {/* Modal Content */}
      <div
        style={{
          backgroundColor: COLORS.white,
          borderRadius: "12px",
          padding: "30px",
          maxWidth: "500px",
          width: "90%",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              color: COLORS.darkGreen,
              margin: "0",
              fontSize: "20px",
              fontWeight: 700,
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            Assign Task
          </h2>
          <button
            onClick={handleClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              color: COLORS.darkGray,
            }}
          >
            ✕
          </button>
        </div>

        {/* Task Info */}
        <div
          style={{
            backgroundColor: COLORS.veryLightGreen,
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "20px",
          }}
        >
          <h4
            style={{
              color: COLORS.darkGreen,
              margin: "0 0 8px 0",
              fontSize: "14px",
              fontWeight: 600,
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            {task.title}
          </h4>
          <p
            style={{
              color: COLORS.darkGray,
              margin: "0",
              fontSize: "12px",
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            {task.description}
          </p>
        </div>

        {/* Volunteer Selection */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: 600,
              color: COLORS.darkGreen,
              marginBottom: "8px",
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            Select Volunteer *
          </label>
          <select
            value={selectedVolunteer}
            onChange={(e) => setSelectedVolunteer(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              border: `2px solid ${COLORS.veryLightGreen}`,
              borderRadius: "8px",
              fontSize: "13px",
              fontFamily: "Montserrat, sans-serif",
              cursor: "pointer",
              backgroundColor: COLORS.white,
              color: COLORS.darkGreen,
              boxSizing: "border-box",
            }}
          >
            <option value="">-- Select a volunteer --</option>
            {volunteers && volunteers.map((volunteer) => (
              <option key={volunteer.id} value={volunteer.id}>
                {volunteer.name} - {volunteer.distance} km away
              </option>
            ))}
          </select>
        </div>

        {/* Volunteer Details (if selected) */}
        {selectedVolunteer && volunteers && (
          <div
            style={{
              backgroundColor: COLORS.lightGray,
              borderRadius: "8px",
              padding: "15px",
              marginBottom: "20px",
            }}
          >
            {(() => {
              const volunteer = volunteers.find((v) => v.id === selectedVolunteer);
              return volunteer ? (
                <>
                  <h4
                    style={{
                      color: COLORS.darkGreen,
                      margin: "0 0 10px 0",
                      fontSize: "13px",
                      fontWeight: 600,
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    Volunteer Details
                  </h4>
                  <div
                    style={{
                      fontSize: "12px",
                      color: COLORS.darkGray,
                      fontFamily: "Montserrat, sans-serif",
                      lineHeight: "1.6",
                    }}
                  >
                    <p style={{ margin: "0 0 5px 0" }}>
                      <strong>Name:</strong> {volunteer.name}
                    </p>
                    <p style={{ margin: "0 0 5px 0" }}>
                      <strong>Distance:</strong> {volunteer.distance} km
                    </p>
                    <p style={{ margin: "0 0 5px 0" }}>
                      <strong>Rating:</strong> ⭐ {volunteer.rating}/5
                    </p>
                    <p style={{ margin: "0" }}>
                      <strong>Skills:</strong> {volunteer.skills.join(", ")}
                    </p>
                  </div>
                </>
              ) : null;
            })()}
          </div>
        )}

        {/* Assignment Notes */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: 600,
              color: COLORS.darkGreen,
              marginBottom: "8px",
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            Assignment Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any special instructions or notes..."
            style={{
              width: "100%",
              padding: "12px",
              border: `2px solid ${COLORS.veryLightGreen}`,
              borderRadius: "8px",
              fontSize: "13px",
              fontFamily: "Montserrat, sans-serif",
              boxSizing: "border-box",
              minHeight: "80px",
              resize: "vertical",
              color: COLORS.darkGreen",
            }}
          />
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "flex-end",
          }}
        >
          {/* Cancel Button */}
          <button
            onClick={handleClose}
            disabled={isAssigning}
            style={{
              padding: "10px 20px",
              backgroundColor: COLORS.darkGray,
              color: COLORS.white,
              border: "none",
              borderRadius: "8px",
              cursor: isAssigning ? "not-allowed" : "pointer",
              fontWeight: 600,
              fontSize: "12px",
              fontFamily: "Montserrat, sans-serif",
              opacity: isAssigning ? 0.7 : 1,
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              if (!isAssigning) e.target.style.opacity = "0.8";
            }}
            onMouseLeave={(e) => {
              if (!isAssigning) e.target.style.opacity = "1";
            }}
          >
            Cancel
          </button>

          {/* Assign Button */}
          <button
            onClick={handleAssign}
            disabled={isAssigning || !selectedVolunteer}
            style={{
              padding: "10px 20px",
              backgroundColor: COLORS.mediumGreen,
              color: COLORS.white,
              border: "none",
              borderRadius: "8px",
              cursor: isAssigning || !selectedVolunteer ? "not-allowed" : "pointer",
              fontWeight: 600,
              fontSize: "12px",
              fontFamily: "Montserrat, sans-serif",
              opacity: isAssigning || !selectedVolunteer ? 0.7 : 1,
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              if (!isAssigning && selectedVolunteer) {
                e.target.style.backgroundColor = COLORS.darkMediumGreen;
              }
            }}
            onMouseLeave={(e) => {
              if (!isAssigning && selectedVolunteer) {
                e.target.style.backgroundColor = COLORS.mediumGreen;
              }
            }}
          >
            {isAssigning ? "Assigning..." : "Assign Task"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskAssignmentModal;
