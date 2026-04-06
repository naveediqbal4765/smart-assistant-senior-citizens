import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

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
  yellow: "#FFC107",
};

const ElderMedicationReminder = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);
  const [medications, setMedications] = useState([
    { id: 1, name: "Aspirin", dosage: "500mg", time: "08:00 AM", frequency: "Daily", taken: true, nextDue: "Tomorrow 8:00 AM" },
    { id: 2, name: "Blood Pressure Med", dosage: "10mg", time: "12:00 PM", frequency: "Daily", taken: false, nextDue: "Today 12:00 PM" },
    { id: 3, name: "Vitamin D", dosage: "1000 IU", time: "06:00 PM", frequency: "Daily", taken: false, nextDue: "Today 6:00 PM" },
    { id: 4, name: "Calcium Supplement", dosage: "600mg", time: "09:00 AM", frequency: "Twice Daily", taken: true, nextDue: "Today 6:00 PM" },
  ]);

  const handleScreenReaderToggle = () => {
    setScreenReaderEnabled(!screenReaderEnabled);
    if (!screenReaderEnabled) {
      const utterance = new SpeechSynthesisUtterance("Screen reader enabled");
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleMarkTaken = (id) => {
    setMedications(medications.map(med => med.id === id ? { ...med, taken: !med.taken } : med));
  };

  const upcomingMeds = medications.filter(m => !m.taken);

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: COLORS.dashboardBg }}>
      {/* Header */}
      <div style={{ position: "sticky", top: 0, backgroundColor: COLORS.darkGreen, padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <button onClick={() => navigate("/elder-dashboard")} style={{ background: "none", border: "none", color: COLORS.white, cursor: "pointer", fontSize: "20px" }}>
            ← Back
          </button>
          <h1 style={{ color: COLORS.white, margin: "0", fontSize: "24px", fontWeight: 700 }}>⏰ Medication Reminder</h1>
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
        {/* Upcoming Medications Alert */}
        {upcomingMeds.length > 0 && (
          <div style={{ backgroundColor: "#fff3e0", border: `2px solid ${COLORS.yellow}`, borderRadius: "12px", padding: "20px", marginBottom: "30px" }}>
            <h3 style={{ color: COLORS.darkGreen, margin: "0 0 10px 0", fontSize: "18px" }}>⚠️ Upcoming Medications</h3>
            <p style={{ color: COLORS.darkGray, margin: "0", fontSize: "14px" }}>
              You have {upcomingMeds.length} medication(s) to take today. Please take them on time!
            </p>
          </div>
        )}

        {/* Medications List */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
          {medications.map((med) => (
            <div
              key={med.id}
              style={{
                backgroundColor: COLORS.cardBg,
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                borderLeft: `4px solid ${med.taken ? COLORS.mediumGreen : COLORS.yellow}`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "15px" }}>
                <div>
                  <h4 style={{ color: COLORS.darkGreen, margin: "0 0 5px 0", fontSize: "16px", fontWeight: 700 }}>
                    {med.name}
                  </h4>
                  <p style={{ color: COLORS.darkGray, margin: "0", fontSize: "13px" }}>
                    {med.dosage}
                  </p>
                </div>
                {med.taken && <span style={{ fontSize: "24px" }}>✅</span>}
              </div>

              <div style={{ backgroundColor: COLORS.white, borderRadius: "8px", padding: "12px", marginBottom: "15px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "12px" }}>
                  <div>
                    <p style={{ color: COLORS.darkGray, margin: "0 0 4px 0" }}>Time</p>
                    <p style={{ color: COLORS.darkGreen, margin: "0", fontWeight: 600 }}>{med.time}</p>
                  </div>
                  <div>
                    <p style={{ color: COLORS.darkGray, margin: "0 0 4px 0" }}>Frequency</p>
                    <p style={{ color: COLORS.darkGreen, margin: "0", fontWeight: 600 }}>{med.frequency}</p>
                  </div>
                </div>
              </div>

              <p style={{ color: COLORS.darkGray, margin: "0 0 15px 0", fontSize: "12px" }}>
                Next due: {med.nextDue}
              </p>

              <button
                onClick={() => handleMarkTaken(med.id)}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: med.taken ? COLORS.mediumGreen : COLORS.white,
                  color: med.taken ? COLORS.white : COLORS.darkGreen,
                  border: `2px solid ${COLORS.mediumGreen}`,
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "13px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => !med.taken && (e.target.style.backgroundColor = "#f0f0f0")}
                onMouseLeave={(e) => !med.taken && (e.target.style.backgroundColor = COLORS.white)}
              >
                {med.taken ? "✅ Taken" : "Mark as Taken"}
              </button>
            </div>
          ))}
        </div>

        {/* Statistics */}
        <div style={{ marginTop: "40px", backgroundColor: COLORS.cardBg, borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <h3 style={{ color: COLORS.darkGreen, margin: "0 0 20px 0", fontSize: "18px", fontWeight: 700 }}>Today's Summary</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "15px" }}>
            <div style={{ backgroundColor: COLORS.white, padding: "15px", borderRadius: "8px", textAlign: "center" }}>
              <p style={{ color: COLORS.darkGray, margin: "0 0 8px 0", fontSize: "12px" }}>Total Medications</p>
              <p style={{ color: COLORS.darkGreen, margin: "0", fontSize: "28px", fontWeight: 700 }}>{medications.length}</p>
            </div>
            <div style={{ backgroundColor: COLORS.white, padding: "15px", borderRadius: "8px", textAlign: "center" }}>
              <p style={{ color: COLORS.darkGray, margin: "0 0 8px 0", fontSize: "12px" }}>Taken</p>
              <p style={{ color: COLORS.mediumGreen, margin: "0", fontSize: "28px", fontWeight: 700 }}>
                {medications.filter(m => m.taken).length}
              </p>
            </div>
            <div style={{ backgroundColor: COLORS.white, padding: "15px", borderRadius: "8px", textAlign: "center" }}>
              <p style={{ color: COLORS.darkGray, margin: "0 0 8px 0", fontSize: "12px" }}>Pending</p>
              <p style={{ color: COLORS.yellow, margin: "0", fontSize: "28px", fontWeight: 700 }}>
                {medications.filter(m => !m.taken).length}
              </p>
            </div>
            <div style={{ backgroundColor: COLORS.white, padding: "15px", borderRadius: "8px", textAlign: "center" }}>
              <p style={{ color: COLORS.darkGray, margin: "0 0 8px 0", fontSize: "12px" }}>Completion</p>
              <p style={{ color: COLORS.mediumGreen, margin: "0", fontSize: "28px", fontWeight: 700 }}>
                {Math.round((medications.filter(m => m.taken).length / medications.length) * 100)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ElderMedicationReminder;
