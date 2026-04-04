import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ElderDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="page-bg min-h-screen p-6">
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#1b4332" }}>
            Welcome, {user?.fullName.split(" ")[0]}! 👋
          </h1>
          <button onClick={() => { logout(); navigate("/login"); }} className="btn-primary" style={{ width: "auto" }}>
            Logout
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
          {/* SOS Button */}
          <div className="auth-card" style={{ textAlign: "center", padding: "40px 20px" }}>
            <button style={{ width: "120px", height: "120px", borderRadius: "50%", backgroundColor: "#e63946", color: "white", border: "none", fontSize: "2rem", fontWeight: 700, cursor: "pointer", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
              🆘
            </button>
            <p style={{ marginTop: "16px", fontSize: "1rem", fontWeight: 700, color: "#1b4332" }}>Emergency SOS</p>
          </div>

          {/* Health Stats */}
          <div className="auth-card">
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1b4332", marginBottom: "12px" }}>Health Stats</h3>
            <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>❤️ Heart Rate: -- bpm</p>
            <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>🫁 Oxygen: -- %</p>
            <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>🌡️ Temperature: -- °C</p>
          </div>

          {/* Request Help */}
          <div className="auth-card" style={{ textAlign: "center" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1b4332", marginBottom: "12px" }}>Need Help?</h3>
            <button className="btn-primary" style={{ marginTop: "12px" }}>Request Task</button>
          </div>

          {/* Medications */}
          <div className="auth-card">
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1b4332", marginBottom: "12px" }}>Medications</h3>
            <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>No medications scheduled</p>
          </div>

          {/* Emergency Contacts */}
          <div className="auth-card">
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1b4332", marginBottom: "12px" }}>Emergency Contacts</h3>
            <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>View your emergency contacts</p>
          </div>

          {/* Messages */}
          <div className="auth-card">
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1b4332", marginBottom: "12px" }}>Messages</h3>
            <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>No new messages</p>
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: "40px", fontSize: "0.9rem", color: "#6b7280" }}>
          🚀 Elder Dashboard - Module 1 Skeleton (More features coming soon!)
        </p>
      </div>
    </div>
  );
};

export default ElderDashboard;
