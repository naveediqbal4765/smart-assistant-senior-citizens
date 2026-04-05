import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

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

// ---- COLOR SCHEME ----
const COLORS = {
  darkGreen: "#1C382A",
  mediumGreen: "#52b788",
  darkMediumGreen: "#2d6a4f",
  darkestGreen: "#1b4332",
  lightGreen: "#74c69d",
  paleGreen: "#A9C6B2",
  veryLightGreen: "#BAE4C7",
  white: "#FFFFFF",
  lightGray: "#f5f5f5",
  mediumGray: "#f0f0f0",
  darkGray: "#666666",
  lightDarkGray: "#999999",
  red: "#e63946",
  yellow: "#FFC107",
  dashboardBg: "#E2FFEB",
  cardBg: "#BAE4C7",
};

const ElderDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);
  const [medicationStates, setMedicationStates] = useState({});

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
    setMedicationStates(prev => ({
      ...prev,
      [medicationId]: !prev[medicationId]
    }));
  };

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: COLORS.dashboardBg }}>
      {/* ============================================================
          INTEGRATED HEADER WITH NAVBAR ON RIGHT
          ============================================================ */}
      <div
        style={{
          position: "sticky",
          top: 0,
          backgroundColor: COLORS.darkGreen,
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
        {/* Left Side: Logo + Title + Navigation */}
        <div style={{ display: "flex", alignItems: "center", gap: "clamp(8px, 2vw, 16px)", flex: 1, minWidth: "0" }}>
          <AppLogo size={Math.min(Math.max(32, window.innerWidth * 0.04), 48)} />
          <div style={{ minWidth: "0", flex: "0 1 auto" }}>
            <h1 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "clamp(16px, 3vw, 22px)", color: COLORS.white, margin: "0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              Smart Assistant
            </h1>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 400, fontSize: "clamp(10px, 1.5vw, 13px)", color: COLORS.veryLightGreen, margin: "0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              Care for Seniors, By Community
            </p>
          </div>

          {/* Navigation Links */}
          <div style={{ display: "flex", gap: "12px", alignItems: "center", marginLeft: "20px" }}>
            <button
              onClick={() => navigate("/elder-dashboard")}
              style={{
                background: "none",
                border: "none",
                color: COLORS.white,
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "13px",
                fontFamily: "Montserrat, sans-serif",
                transition: "all 0.3s ease",
                padding: "6px 10px",
                borderRadius: "6px",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = COLORS.mediumGreen;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
              }}
            >
              🏠 Home
            </button>

            <button
              onClick={() => {
                const event = new CustomEvent('openContactModal');
                window.dispatchEvent(event);
              }}
              style={{
                background: "none",
                border: "none",
                color: COLORS.white,
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "13px",
                fontFamily: "Montserrat, sans-serif",
                transition: "all 0.3s ease",
                padding: "6px 10px",
                borderRadius: "6px",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = COLORS.mediumGreen;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
              }}
            >
              📞 Contact
            </button>

            <button
              onClick={() => {
                const event = new CustomEvent('openAboutModal');
                window.dispatchEvent(event);
              }}
              style={{
                background: "none",
                border: "none",
                color: COLORS.white,
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "13px",
                fontFamily: "Montserrat, sans-serif",
                transition: "all 0.3s ease",
                padding: "6px 10px",
                borderRadius: "6px",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = COLORS.mediumGreen;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
              }}
            >
              ℹ️ About Us
            </button>
          </div>
        </div>

        {/* Right Side: Screen Reader + Profile */}
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {/* Screen Reader Toggle */}
          <button
            onClick={handleScreenReaderToggle}
            style={{
              padding: "8px 12px",
              backgroundColor: screenReaderEnabled ? COLORS.mediumGreen : COLORS.veryLightGreen,
              color: screenReaderEnabled ? COLORS.white : COLORS.darkGreen,
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
            {screenReaderEnabled ? "🔊" : "🔇"}
          </button>

          {/* Profile Dropdown - NOW ON RIGHT */}
          <Navbar screenReaderEnabled={screenReaderEnabled} onScreenReaderToggle={handleScreenReaderToggle} />
        </div>
      </div>

      {/* ============================================================
          MAIN CONTENT
          ============================================================ */}
      <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Welcome Section */}
          <div style={{ marginBottom: "30px" }}>
            <h2 style={{ fontSize: "28px", fontWeight: 700, color: COLORS.darkGreen, margin: "0 0 10px 0" }}>
              Welcome, {user?.fullName.split(" ")[0]}! 👋
            </h2>
            <p style={{ fontSize: "14px", color: COLORS.darkGray, margin: "0" }}>
              {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          {/* ============================================================
              1. SAFETY FIRST LAYER
              ============================================================ */}
          <div style={{ marginBottom: "30px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: COLORS.darkGreen, marginBottom: "15px" }}>
              🛡️ Safety First
            </h3>

            {/* Emergency Contacts Speed Dial */}
            <div style={{ backgroundColor: COLORS.cardBg, borderRadius: "12px", padding: "20px", marginBottom: "15px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
              <h4 style={{ fontSize: "14px", fontWeight: 600, color: COLORS.darkGreen, marginBottom: "15px" }}>
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
                      backgroundColor: COLORS.veryLightGreen,
                      border: "none",
                      borderRadius: "12px",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = COLORS.dashboardBg;
                      e.currentTarget.style.transform = "scale(1.05)";
                      e.currentTarget.style.color = COLORS.darkGreen;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = COLORS.veryLightGreen;
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.color = "inherit";
                    }}
                  >
                    <div style={{ fontSize: "32px" }}>{contact.emoji}</div>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: COLORS.darkGreen, textAlign: "center" }}>
                      {contact.name}
                    </div>
                    <div style={{ fontSize: "10px", color: COLORS.darkGreen, textAlign: "center" }}>
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
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: COLORS.darkGreen, marginBottom: "15px" }}>
              🏥 Medical Hub
            </h3>

            {/* Live Vitals Monitor */}
            <div style={{ backgroundColor: COLORS.cardBg, borderRadius: "12px", padding: "20px", marginBottom: "15px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
              <h4 style={{ fontSize: "14px", fontWeight: 600, color: COLORS.darkGreen, marginBottom: "15px" }}>
                Live Vitals Monitor
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "15px" }}>
                <div style={{ backgroundColor: COLORS.mediumGray, padding: "15px", borderRadius: "8px", textAlign: "center", borderLeft: `4px solid ${COLORS.red}` }}>
                  <div style={{ fontSize: "24px", fontWeight: 700, color: COLORS.red }}>❤️ {vitals.heartRate}</div>
                  <div style={{ fontSize: "12px", color: COLORS.darkGray, marginTop: "5px" }}>Heart Rate (bpm)</div>
                </div>
                <div style={{ backgroundColor: COLORS.mediumGray, padding: "15px", borderRadius: "8px", textAlign: "center", borderLeft: `4px solid ${COLORS.mediumGreen}` }}>
                  <div style={{ fontSize: "24px", fontWeight: 700, color: COLORS.mediumGreen }}>🫁 {vitals.oxygen}%</div>
                  <div style={{ fontSize: "12px", color: COLORS.darkGray, marginTop: "5px" }}>Oxygen Level</div>
                </div>
                <div style={{ backgroundColor: COLORS.mediumGray, padding: "15px", borderRadius: "8px", textAlign: "center", borderLeft: `4px solid ${COLORS.yellow}` }}>
                  <div style={{ fontSize: "24px", fontWeight: 700, color: COLORS.yellow }}>🌡️ {vitals.temperature}°C</div>
                  <div style={{ fontSize: "12px", color: COLORS.darkGray, marginTop: "5px" }}>Temperature</div>
                </div>
              </div>
              <p style={{ fontSize: "11px", color: COLORS.lightDarkGray, marginTop: "10px", textAlign: "center" }}>
                Last updated: {vitals.lastUpdated}
              </p>
            </div>

            {/* Today's Medications */}
            <div style={{ backgroundColor: COLORS.cardBg, borderRadius: "12px", padding: "20px", marginBottom: "15px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
              <h4 style={{ fontSize: "14px", fontWeight: 600, color: COLORS.darkGreen, marginBottom: "15px" }}>
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
                      backgroundColor: medicationStates[med.id] ? "#e8f5e9" : "#fff3e0",
                      borderRadius: "8px",
                      borderLeft: `4px solid ${medicationStates[med.id] ? COLORS.mediumGreen : COLORS.yellow}`,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: 600, color: COLORS.darkGreen }}>
                        {med.name}
                      </div>
                      <div style={{ fontSize: "12px", color: COLORS.darkGray }}>
                        {med.time}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      {medicationStates[med.id] && (
                        <div style={{ fontSize: "20px" }}>✅</div>
                      )}
                      <input
                        type="checkbox"
                        checked={medicationStates[med.id] || false}
                        onChange={() => handleMedicationTaken(med.id)}
                        style={{
                          width: "20px",
                          height: "20px",
                          cursor: "pointer",
                          accentColor: COLORS.mediumGreen,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Medical Vault */}
            <div style={{ backgroundColor: COLORS.cardBg, borderRadius: "12px", padding: "20px", marginBottom: "15px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
              <h4 style={{ fontSize: "14px", fontWeight: 600, color: COLORS.darkGreen, marginBottom: "15px" }}>
                📋 Medical Vault
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "10px" }}>
                <button style={{ padding: "12px", backgroundColor: COLORS.darkGreen, border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "12px", color: COLORS.white, transition: "all 0.3s ease" }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = COLORS.darkMediumGreen)}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.darkGreen)}
                >
                  📄 Lab Reports
                </button>
                <button style={{ padding: "12px", backgroundColor: COLORS.darkGreen, border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "12px", color: COLORS.white, transition: "all 0.3s ease" }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = COLORS.darkMediumGreen)}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.darkGreen)}
                >
                  💊 Prescriptions
                </button>
                <button style={{ padding: "12px", backgroundColor: COLORS.darkGreen, border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "12px", color: COLORS.white, transition: "all 0.3s ease" }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = COLORS.darkMediumGreen)}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.darkGreen)}
                >
                  📊 Health History
                </button>
              </div>
            </div>
          </div>

          {/* ============================================================
              3. MOBILITY & HELP LAYER
              ============================================================ */}
          <div style={{ marginBottom: "30px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: COLORS.darkGreen, marginBottom: "15px" }}>
              🚗 Mobility & Help
            </h3>

            <div style={{ backgroundColor: COLORS.cardBg, borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "15px" }}>
                <button style={{ padding: "20px", backgroundColor: COLORS.darkGreen, color: COLORS.white, border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "14px", transition: "all 0.3s ease" }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = COLORS.darkMediumGreen)}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.darkGreen)}
                >
                  📋 Task Request
                </button>
                <button style={{ padding: "20px", backgroundColor: COLORS.darkGreen, color: COLORS.white, border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "14px", transition: "all 0.3s ease" }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = COLORS.darkMediumGreen)}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.darkGreen)}
                >
                  🎤 AI Voice Assistant
                </button>
                <button style={{ padding: "20px", backgroundColor: COLORS.darkGreen, color: COLORS.white, border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "14px", transition: "all 0.3s ease" }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = COLORS.darkMediumGreen)}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.darkGreen)}
                >
                  🚕 Book a Ride
                </button>
                <button style={{ padding: "20px", backgroundColor: COLORS.darkGreen, color: COLORS.white, border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "14px", transition: "all 0.3s ease" }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = COLORS.darkMediumGreen)}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.darkGreen)}
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
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: COLORS.darkGreen, marginBottom: "15px" }}>
              💬 Communication & Utilities
            </h3>

            <div style={{ backgroundColor: COLORS.cardBg, borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "15px" }}>
                <button style={{ padding: "20px", backgroundColor: COLORS.darkGreen, color: COLORS.white, border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "14px", transition: "all 0.3s ease" }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = COLORS.darkMediumGreen)}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.darkGreen)}
                >
                  💬 Messages
                </button>
                <button style={{ padding: "20px", backgroundColor: COLORS.darkGreen, color: COLORS.white, border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "14px", transition: "all 0.3s ease" }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = COLORS.darkMediumGreen)}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.darkGreen)}
                >
                  🎵 Sleep Timer
                </button>
                <button style={{ padding: "20px", backgroundColor: COLORS.darkGreen, color: COLORS.white, border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "14px", transition: "all 0.3s ease" }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = COLORS.darkMediumGreen)}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.darkGreen)}
                >
                  ⏰ Medication Reminder
                </button>
                <button style={{ padding: "20px", backgroundColor: COLORS.darkGreen, color: COLORS.white, border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "14px", transition: "all 0.3s ease" }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = COLORS.darkMediumGreen)}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.darkGreen)}
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
                backgroundColor: COLORS.red,
                color: COLORS.white,
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "14px",
                fontFamily: "Montserrat, sans-serif",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.target.style.opacity = "1")}
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
          backgroundColor: COLORS.red,
          color: COLORS.white,
          border: `4px solid ${COLORS.white}`,
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
