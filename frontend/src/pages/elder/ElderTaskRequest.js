import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const COLORS = {
  darkGreen: "#1C382A",
  mediumGreen: "#52b788",
  darkMediumGreen: "#2d6a4f",
  veryLightGreen: "#BAE4C7",
  white: "#FFFFFF",
  darkGray: "#666666",
  dashboardBg: "#E2FFEB",
  cardBg: "#BAE4C7",
  red: "#e63946",
};

const ElderTaskRequest = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);
  const [tasks, setTasks] = useState([
    { id: 1, title: "Grocery Shopping", description: "Buy milk, bread, and vegetables", status: "pending", date: "Today", priority: "high" },
    { id: 2, title: "House Cleaning", description: "Clean living room and kitchen", status: "in-progress", date: "Today", priority: "medium" },
    { id: 3, title: "Doctor Appointment", description: "Visit Dr. Ahmed at clinic", status: "completed", date: "Yesterday", priority: "high" },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", priority: "medium" });

  const handleScreenReaderToggle = () => {
    setScreenReaderEnabled(!screenReaderEnabled);
    if (!screenReaderEnabled) {
      const utterance = new SpeechSynthesisUtterance("Screen reader enabled");
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSubmitTask = () => {
    if (formData.title.trim()) {
      const newTask = {
        id: tasks.length + 1,
        ...formData,
        status: "pending",
        date: "Today",
      };
      setTasks([newTask, ...tasks]);
      setFormData({ title: "", description: "", priority: "medium" });
      setShowForm(false);
      alert("Task request submitted successfully!");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return COLORS.mediumGreen;
      case "in-progress":
        return "#FFC107";
      default:
        return COLORS.red;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return "✅";
      case "in-progress":
        return "⏳";
      default:
        return "⏱️";
    }
  };

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: COLORS.dashboardBg }}>
      {/* Header */}
      <div style={{ position: "sticky", top: 0, backgroundColor: COLORS.darkGreen, padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <button onClick={() => navigate("/elder-dashboard")} style={{ background: "none", border: "none", color: COLORS.white, cursor: "pointer", fontSize: "20px" }}>
            ← Back
          </button>
          <h1 style={{ color: COLORS.white, margin: "0", fontSize: "24px", fontWeight: 700 }}>📋 Task Request</h1>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button onClick={handleScreenReaderToggle} style={{ padding: "8px 12px", backgroundColor: screenReaderEnabled ? COLORS.mediumGreen : COLORS.veryLightGreen, color: screenReaderEnabled ? COLORS.white : COLORS.darkGreen, border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: 600, fontSize: "12px" }}>
            {screenReaderEnabled ? "🔊" : "🔇"}
          </button>
          <Navbar screenReaderEnabled={screenReaderEnabled} onScreenReaderToggle={handleScreenReaderToggle} />
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px", maxWidth: "1000px", margin: "0 auto", width: "100%" }}>
        {/* New Task Button */}
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: "12px 24px",
            backgroundColor: COLORS.mediumGreen,
            color: COLORS.white,
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "14px",
            marginBottom: "20px",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = COLORS.darkMediumGreen)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.mediumGreen)}
        >
          {showForm ? "✕ Cancel" : "+ New Task Request"}
        </button>

        {/* Task Form */}
        {showForm && (
          <div style={{ backgroundColor: COLORS.cardBg, borderRadius: "12px", padding: "20px", marginBottom: "30px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <h3 style={{ color: COLORS.darkGreen, margin: "0 0 20px 0", fontSize: "18px", fontWeight: 700 }}>Create New Task</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <div>
                <label style={{ display: "block", color: COLORS.darkGreen, fontWeight: 600, marginBottom: "8px", fontSize: "13px" }}>
                  Task Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Buy groceries"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: `1px solid ${COLORS.mediumGreen}`,
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontFamily: "Montserrat, sans-serif",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", color: COLORS.darkGreen, fontWeight: 600, marginBottom: "8px", fontSize: "13px" }}>
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add details about your task..."
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: `1px solid ${COLORS.mediumGreen}`,
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontFamily: "Montserrat, sans-serif",
                    boxSizing: "border-box",
                    minHeight: "80px",
                    resize: "vertical",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", color: COLORS.darkGreen, fontWeight: 600, marginBottom: "8px", fontSize: "13px" }}>
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: `1px solid ${COLORS.mediumGreen}`,
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontFamily: "Montserrat, sans-serif",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
              <button
                onClick={handleSubmitTask}
                style={{
                  padding: "12px",
                  backgroundColor: COLORS.mediumGreen,
                  color: COLORS.white,
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "14px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = COLORS.darkMediumGreen)}
                onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.mediumGreen)}
              >
                Submit Task Request
              </button>
            </div>
          </div>
        )}

        {/* Tasks List */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
          {tasks.map((task) => (
            <div
              key={task.id}
              style={{
                backgroundColor: COLORS.cardBg,
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                borderLeft: `4px solid ${getStatusColor(task.status)}`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "15px" }}>
                <div>
                  <h4 style={{ color: COLORS.darkGreen, margin: "0 0 5px 0", fontSize: "16px", fontWeight: 700 }}>
                    {task.title}
                  </h4>
                  <p style={{ color: COLORS.darkGray, margin: "0", fontSize: "12px" }}>
                    {task.date}
                  </p>
                </div>
                <span style={{ fontSize: "20px" }}>{getStatusIcon(task.status)}</span>
              </div>

              {task.description && (
                <p style={{ color: COLORS.darkGray, margin: "0 0 15px 0", fontSize: "13px" }}>
                  {task.description}
                </p>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span
                  style={{
                    padding: "6px 12px",
                    backgroundColor: task.priority === "high" ? "#ffebee" : task.priority === "medium" ? "#fff3e0" : "#e8f5e9",
                    color: task.priority === "high" ? COLORS.red : task.priority === "medium" ? "#FFC107" : COLORS.mediumGreen,
                    borderRadius: "6px",
                    fontSize: "11px",
                    fontWeight: 600,
                  }}
                >
                  {task.priority.toUpperCase()}
                </span>
                <span
                  style={{
                    padding: "6px 12px",
                    backgroundColor: getStatusColor(task.status),
                    color: COLORS.white,
                    borderRadius: "6px",
                    fontSize: "11px",
                    fontWeight: 600,
                  }}
                >
                  {task.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ElderTaskRequest;
