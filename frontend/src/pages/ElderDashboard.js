import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

// ---- SVG Logo: Green cross with red heart ----
const AppLogo = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="30" y="10" width="40" height="80" rx="8" fill="#52b788" />
    <rect x="10" y="30" width="80" height="40" rx="8" fill="#52b788" />
    <rect x="34" y="14" width="32" height="72" rx="6" fill="#74c69d" />
    <rect x="14" y="34" width="72" height="32" rx="6" fill="#74c69d" />
    <circle cx="50" cy="50" r="18" fill="white" />
    <path
      d="M50 58 C50 58 38 50 38 43 C38 39 41 36 44.5 36 C46.5 36 48.5 37.2 50 39 C51.5 37.2 53.5 36 55.5 36 C59 36 62 39 62 43 C62 50 50 58 50 58Z"
      fill="#e63946"
    />
  </svg>
);

const ElderDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [showMedicationModal, setShowMedicationModal] = useState(false);

  // Mock data
  const emergencyContacts = [
    { id: 1, name: "Sarah", relation: "Daughter", phone: "+923001234567", emoji: "👩" },
    { id: 2, name: "John", relation: "Son", phone: "+923009876543", emoji: "👨" },
    { id: 3, name: "Dr. Ahmed", relation: "Doctor", phone: "+923005555555", emoji: "👨‍⚕️" },
  ];

  const todaysMedications = [
    { id: 1, name: "Aspirin", time: "08:00 AM", taken: true },
    { id: 2, name: "Blood Pressure Med", time: "12:00 PM", taken: false },
    { id: 3, name: "Vitamin D", time: "06:00 PM", taken: false },
  ];

  const vitals = {
    heartRate: 72,
    oxygen: 98,
    temperature: 36.5,
    lastUpdated: "Just now",
  };

  const handleScreenReaderToggle = () => {
    setScreenReaderEnabled(!screenReaderEnabled);
    if (!screenReaderEnabled) {
      const utterance = new SpeechSynthesisUtterance("Screen reader enabled");
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleEmergencyCall = (contact) => {
    if (screenReaderEnabled) {
      const utterance = new SpeechSynthesisUtterance(`Calling ${contact.name}`);
      window.speechSynthesis.speak(utterance);
    }
    alert(`Calling ${contact.name} at ${contact.phone}`);
  };

  const handleSOS = () => {
    if (screenReaderEnabled) {
      const utterance = new SpeechSynthesisUtterance("Emergency SOS activated");
      window.speechSynthesis.speak(utterance);
    }
    alert("🚨 SOS ACTIVATED! Emergency services and caregivers have been notified. Your location is being shared.");
  };

  const handleMedicationTaken = (medicationId) => {
    alert(`✅ Marked "${todaysMedications.find(m => m.id === medicationId).name}" as taken!`);
  };

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* ============================================================
          HEADER WITH SCREEN READER TOGGLE
          ============================================================ */}
      <div
        style={{
          position: "sticky",
          top: 0,
          backgroundColor: "#1C382A",
          padding: "clamp(12px, 2vw, 20px) clamp(16px, 4vw, 40px)",
          display: "flex",
          alignItems: "center",
          gap: "clamp(8px, 2vw, 16px)",
          zIndex: 10,
          flexWrap: "wrap",
          justifyContent: "space-between",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "clamp(8px, 2vw, 16px)", flex: 1 }}>
          <AppLogo size={Math.min(Math.max(32, window.innerWidth * 0.04), 48)} />
          <div style={{ minWidth: "0", flex: "1 1 auto" }}>
            <h1 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "clamp(16px, 3vw, 22px)", color: "#FFFFFF", margin: "0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              Smart Assistant
            </h1>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 400, fontSize: "clamp(10px, 1.5vw, 13px)", color: "#BAE4C7", margin: "0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              Care for Seniors, By Community
            </p>
          </div>
        </div>

        {/* Screen Reader Toggle */}
        <button
          onClick={handleScreenReaderToggle}
          style={{
            padding: "8px 16px",
            backgroundColor: screenReaderEnabled ? "#52b788" : "#FFFFFF",
            color: screenReaderEnabled ? "#FFFFFF" : "#1C382A",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "12px",
            fontFamily: "Montserrat, sans-serif",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        >
          {screenReaderEnabled ? "🔊 Voice ON" : "🔇 Voice OFF"}
        </button>
      </div>

      {/* ============================================================
          MAIN CONTENT
          ============================================================ */}
      <div style={{ flex: 1, padding: "20px", backgroundColor: "#f5f5f5", overflowY: "auto" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Welcome Section */}
          <div style={{ marginBottom: "30px" }}>
            <h2 style={{ fontSize: "28px", fontWeight: 700, color: "#1C382A", margin: "0 0 10px 0" }}>
              Welcome, {user?.fullName.split(" ")[0]}! 👋
            </h2>
            <p style={{ fontSize: "14px", color: "#666", margin: "0" }}>
              {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          {/* ============================================================
              1. SAFETY FIRST LAYER
              ============================================================ */}
          <div style={{ marginBottom: "30px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#1C382A", marginBottom: "15px" }}>
              🛡️ Safety First
            </h3>

            {/* Emergency Contacts Speed Dial */}
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "12px", padding: "20px", marginBottom: "15px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
              <h4 style={{ fontSize: "14px", fontWeight: 600, color: "#1C382A", marginBottom: "15px" }}>
                Emergency Contacts (One-Tap Calling)
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: "15px" }}>
                {emergencyContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => handleEmergencyCall(contact)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "10px",
                      padding: "15px",
                      backgroundColor: "#BAE4C7",
                      border: "none",
                      borderRadius: "12px",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#52b788";
                      e.currentTarget.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#BAE4C7";
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    <div style={{ fontSize: "32px" }}>{contact.emoji}</div>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "#1C382A", textAlign: "center" }}>
                      {contact.name}
                    </div>
                    <div style={{ fontSize: "10px", color: "#1C382A", textAlign: "center" }}>
                      {contact.relation}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ============================================================
              2. MEDICAL HUB
              ============================================================ */}
          <div style={{ marginBottom: "30px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#1C382A", marginBottom: "15px" }}>
              🏥 Medical Hub
            </h3>

            {/* Live Vitals Monitor */}
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "12px", padding: "20px", marginBottom: "15px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
              <h4 style={{ fontSize: "14px", fontWeight: 600, color: "#1C382A", marginBottom: "15px" }}>
                Live Vitals Monitor
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "15px" }}>
                <div style={{ backgroundColor: "#f0f0f0", padding: "15px", borderRadius: "8px", textAlign: "center" }}>
                  <div style={{ fontSize: "24px", fontWeight: 700, color: "#e63946" }}>❤️ {vitals.heartRate}</div>
                  <div style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>Heart Rate (bpm)</div>
                </div>
                <div style={{ backgroundColor: "#f0f0f0", padding: "15px", borderRadius: "8px", textAlign: "center" }}>
                  <div style={{ fontSize: "24px", fontWeight: 700, color: "#52b788" }}>🫁 {vitals.oxygen}%</div>
                  <div style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>Oxygen Level</div>
                </div>
                <div style={{ backgroundColor: "#f0f0f0", padding: "15px", borderRadius: "8px", textAlign: "center" }}>
                  <div style={{ fontSize: "24px", fontWeight: 700, color: "#FFC107" }}>🌡️ {vitals.temperature}°C</div>
                  <div style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>Temperature</div>
                </div>
              </div>
              <p style={{ fontSize: "11px", color: "#999", marginTop: "10px", textAlign: "center" }}>
                Last updated: {vitals.lastUpdated}
              </p>
            </div>

            {/* Today's Medications */}
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "12px", padding: "20px", marginBottom: "15px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
              <h4 style={{ fontSize: "14px", fontWeight: 600, color: "#1C382A", marginBottom: "15px" }}>
                💊 Today's Medication Schedule
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {todaysMedications.map((med) => (
                  <div
                    key={med.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px",
                      backgroundColor: med.taken ? "#e8f5e9" : "#fff3e0",
                      borderRadius: "8px",
                      borderLeft: `4px solid ${med.taken ? "#52b788" : "#FFC107"}`,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: 600, color: "#1C382A" }}>
                        {med.name}
                      </div>
                      <div style={{ fontSize: "12px", color: "#666" }}>
                        {med.time}
                      </div>
                    </div>
                    {med.taken ? (
                      <div style={{ fontSize: "20px" }}>✅</div>
                    ) : (
                      <button
                        onClick={() => handleMedicationTaken(med.id)}
                        style={{
                          padding: "8px 16px",
                          backgroundColor: "#52b788",
                          color: "#FFFFFF",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: 600,
                          fontSize: "12px",
                          fontFamily: "Montserrat, sans-serif",
                        }}
                      >
                        I took it
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Medical Vault */}
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "12px", padding: "20px", marginBottom: "15px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
              <h4 style={{ fontSize: "14px", fontWeight: 600, color: "#1C382A", marginBottom: "15px" }}>
                📋 Medical Vault
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "10px" }}>
                <button style={{ padding: "12px", backgroundColor: "#BAE4C7", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "12px" }}>
                  📄 Lab Reports
                </button>
                <button style={{ padding: "12px", backgroundColor: "#BAE4C7", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "12px" }}>
                  💊 Prescriptions
                </button>
                <button style={{ padding: "12px", backgroundColor: "#BAE4C7", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "12px" }}>
                  📊 Health History
                </button>
              </div>
            </div>
          </div>

          {/* ============================================================
              3. MOBILITY & HELP LAYER
              ============================================================ */}
          <div style={{ marginBottom: "30px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#1C382A", marginBottom: "15px" }}>
              🚗 Mobility & Help
            </h3>

            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "15px" }}>
                <button style={{ padding: "20px", backgroundColor: "#52b788", color: "#FFFFFF", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "14px", transition: "all 0.3s ease" }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#2d6a4f")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#52b788")}
                >
                  🛒 Request Groceries
                </button>
                <button style={{ padding: "20px", backgroundColor: "#52b788", color: "#FFFFFF", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "14px", transition: "all 0.3s ease" }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#2d6a4f")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#52b788")}
                >
                  🧹 Request Cleaning
                </button>
                <button style={{ padding: "20px", backgroundColor: "#52b788", color: "#FFFFFF", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "14px", transition: "all 0.3s ease" }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#2d6a4f")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#52b788")}
                >
                  🚕 Book a Ride
                </button>
                <button style={{ padding: "20px", backgroundColor: "#52b788", color: "#FFFFFF", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "14px", transition: "all 0.3s ease" }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#2d6a4f")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#52b788")}
                >
                  👥 Find Volunteer
                </button>
              </div>
            </div>
          </div>

          {/* ============================================================
              4. COMMUNICATION & UTILITY LAYER
              ============================================================ */}
          <div style={{ marginBottom: "30px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#1C382A", marginBottom: "15px" }}>
              💬 Communication & Utilities
            </h3>

            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "15px" }}>
                <button style={{ padding: "20px", backgroundColor: "#2d6a4f", color: "#FFFFFF", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "14px", transition: "all 0.3s ease" }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#1b4332")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#2d6a4f")}
                >
                  💬 Messages
                </button>
                <button style={{ padding: "20px", backgroundColor: "#2d6a4f", color: "#FFFFFF", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "14px", transition: "all 0.3s ease" }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#1b4332")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#2d6a4f")}
                >
                  🎵 Sleep Timer
                </button>
                <button style={{ padding: "20px", backgroundColor: "#2d6a4f", color: "#FFFFFF", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "14px", transition: "all 0.3s ease" }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#1b4332")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#2d6a4f")}
                >
                  ⚙️ Settings
                </button>
                <button style={{ padding: "20px", backgroundColor: "#2d6a4f", color: "#FFFFFF", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "14px", transition: "all 0.3s ease" }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#1b4332")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#2d6a4f")}
                >
                  📞 Support
                </button>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div style={{ marginBottom: "30px", textAlign: "center" }}>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              style={{
                padding: "12px 30px",
                backgroundColor: "#e63946",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "14px",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================
          FIXED SOS BUTTON (Always Visible at Bottom Center)
          ============================================================ */}
      <button
        onClick={handleSOS}
        style={{
          position: "fixed",
          bottom: "30px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          backgroundColor: "#e63946",
          color: "#FFFFFF",
          border: "4px solid #FFFFFF",
          fontSize: "48px",
          fontWeight: 700,
          cursor: "pointer",
          boxShadow: "0 8px 24px rgba(230, 57, 70, 0.4)",
          zIndex: 100,
          transition: "all 0.3s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "translateX(-50%) scale(1.1)";
          e.target.style.boxShadow = "0 12px 32px rgba(230, 57, 70, 0.6)";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "translateX(-50%) scale(1)";
          e.target.style.boxShadow = "0 8px 24px rgba(230, 57, 70, 0.4)";
        }}
      >
        🆘
      </button>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ElderDashboard;
