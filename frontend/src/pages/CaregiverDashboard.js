import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const CaregiverDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="page-bg min-h-screen p-6">
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#1b4332" }}>
            Caregiver Dashboard
          </h1>
          <button onClick={() => { logout(); navigate("/login"); }} className="btn-primary" style={{ width: "auto" }}>
            Logout
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
          {/* Linked Elder */}
          <div className="auth-card">
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1b4332", marginBottom: "12px" }}>Linked Elder</h3>
            <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>Status: Connected</p>
            <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>Last Update: Just now</p>
          </div>

          {/* Health Monitoring */}
          <div className="auth-card">
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1b4332", marginBottom: "12px" }}>Health Monitoring</h3>
            <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>❤️ Heart Rate: -- bpm</p>
            <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>🫁 Oxygen: -- %</p>
          </div>

          {/* Location Tracking */}
          <div className="auth-card">
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1b4332", marginBottom: "12px" }}>Location</h3>
            <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>📍 View on Map</p>
            <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>Safe Zone: Home</p>
          </div>

          {/* Alerts */}
          <div className="auth-card">
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1b4332", marginBottom: "12px" }}>Alerts</h3>
            <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>No active alerts</p>
          </div>

          {/* Medications */}
          <div className="auth-card">
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1b4332", marginBottom: "12px" }}>Medications</h3>
            <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>Track medication adherence</p>
          </div>

          {/* Communication */}
          <div className="auth-card">
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1b4332", marginBottom: "12px" }}>Messages</h3>
            <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>Send message to elder</p>
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: "40px", fontSize: "0.9rem", color: "#6b7280" }}>
          🚀 Caregiver Dashboard - Module 1 Skeleton
        </p>
      </div>
    </div>
  );
};

export default CaregiverDashboard;
