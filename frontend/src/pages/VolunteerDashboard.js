import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const VolunteerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="page-bg min-h-screen p-6">
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#1b4332" }}>
            Volunteer Dashboard
          </h1>
          <button onClick={() => { logout(); navigate("/login"); }} className="btn-primary" style={{ width: "auto" }}>
            Logout
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
          {/* Availability Status */}
          <div className="auth-card" style={{ textAlign: "center" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1b4332", marginBottom: "12px" }}>Status</h3>
            <button className="btn-primary" style={{ marginTop: "12px" }}>Go Online</button>
            <p style={{ fontSize: "0.85rem", color: "#6b7280", marginTop: "8px" }}>Currently Offline</p>
          </div>

          {/* Available Tasks */}
          <div className="auth-card">
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1b4332", marginBottom: "12px" }}>Available Tasks</h3>
            <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>0 tasks nearby</p>
            <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>Go online to see tasks</p>
          </div>

          {/* Completed Tasks */}
          <div className="auth-card">
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1b4332", marginBottom: "12px" }}>Completed</h3>
            <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>0 tasks completed</p>
            <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>0 points earned</p>
          </div>

          {/* Rewards */}
          <div className="auth-card">
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1b4332", marginBottom: "12px" }}>Rewards</h3>
            <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>⭐ 0 points</p>
            <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>🏆 0 badges</p>
          </div>

          {/* Skills */}
          <div className="auth-card">
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1b4332", marginBottom: "12px" }}>Your Skills</h3>
            <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>View your verified skills</p>
          </div>

          {/* Schedule */}
          <div className="auth-card">
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1b4332", marginBottom: "12px" }}>Schedule</h3>
            <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>View your availability</p>
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: "40px", fontSize: "0.9rem", color: "#6b7280" }}>
          🚀 Volunteer Dashboard - Module 1 Skeleton
        </p>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
