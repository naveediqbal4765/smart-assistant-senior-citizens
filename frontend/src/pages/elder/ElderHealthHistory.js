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

const ElderHealthHistory = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);

  // Mock historical data
  const heartRateHistory = [
    { date: "Today", value: 72, time: "10:30 AM" },
    { date: "Yesterday", value: 70, time: "10:15 AM" },
    { date: "2 days ago", value: 75, time: "9:45 AM" },
    { date: "3 days ago", value: 68, time: "11:00 AM" },
    { date: "4 days ago", value: 73, time: "10:20 AM" },
    { date: "5 days ago", value: 71, time: "10:10 AM" },
    { date: "6 days ago", value: 74, time: "10:40 AM" },
  ];

  const oxygenHistory = [
    { date: "Today", value: 98, time: "10:30 AM" },
    { date: "Yesterday", value: 97, time: "10:15 AM" },
    { date: "2 days ago", value: 99, time: "9:45 AM" },
    { date: "3 days ago", value: 96, time: "11:00 AM" },
    { date: "4 days ago", value: 98, time: "10:20 AM" },
    { date: "5 days ago", value: 97, time: "10:10 AM" },
    { date: "6 days ago", value: 99, time: "10:40 AM" },
  ];

  const temperatureHistory = [
    { date: "Today", value: 36.5, time: "10:30 AM" },
    { date: "Yesterday", value: 36.4, time: "10:15 AM" },
    { date: "2 days ago", value: 36.6, time: "9:45 AM" },
    { date: "3 days ago", value: 36.3, time: "11:00 AM" },
    { date: "4 days ago", value: 36.5, time: "10:20 AM" },
    { date: "5 days ago", value: 36.4, time: "10:10 AM" },
    { date: "6 days ago", value: 36.7, time: "10:40 AM" },
  ];

  const handleScreenReaderToggle = () => {
    setScreenReaderEnabled(!screenReaderEnabled);
    if (!screenReaderEnabled) {
      const utterance = new SpeechSynthesisUtterance("Screen reader enabled");
      window.speechSynthesis.speak(utterance);
    }
  };

  const getHeartRateStatus = (value) => {
    if (value < 60 || value > 100) return { status: "Abnormal", color: COLORS.red };
    return { status: "Normal", color: COLORS.mediumGreen };
  };

  const getOxygenStatus = (value) => {
    if (value < 95) return { status: "Low", color: COLORS.red };
    return { status: "Normal", color: COLORS.mediumGreen };
  };

  const getTemperatureStatus = (value) => {
    if (value < 36 || value > 37.5) return { status: "Abnormal", color: COLORS.red };
    return { status: "Normal", color: COLORS.mediumGreen };
  };

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: COLORS.dashboardBg }}>
      {/* Header */}
      <div style={{ position: "sticky", top: 0, backgroundColor: COLORS.darkGreen, padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <button onClick={() => navigate("/elder-dashboard")} style={{ background: "none", border: "none", color: COLORS.white, cursor: "pointer", fontSize: "20px" }}>
            Back
          </button>
          <h1 style={{ color: COLORS.white, margin: "0", fontSize: "24px", fontWeight: 700 }}>Chart Health History</h1>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
      <div style={{ position: "fixed", bottom: "20px", left: "20px", zIndex: 90 }}> 
        <button 
          onClick={handleScreenReaderToggle} 
          style={{ 
            backgroundColor: screenReaderEnabled ? "#52b788" : "#1C382A", 
            color: "#FFFFFF", 
            padding: "10px 20px", 
            borderRadius: "30px", 
            border: "none", 
            cursor: "pointer", 
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)", 
            display: "flex", 
            alignItems: "center", 
            gap: "8px", 
            fontSize: "12px", 
            fontWeight: 600, 
            transition: "all 0.3s ease" 
          }} 
        > 
          <span style={{ width: "10px", height: "10px", backgroundColor: screenReaderEnabled ? "#fff" : "#ff4d4d", borderRadius: "50%", display: "inline-block" }}></span> 
          {screenReaderEnabled ? "Screen Reader On" : "Screen Reader Off"} 
        </button> 
      </div>
          <Navbar screenReaderEnabled={screenReaderEnabled} onScreenReaderToggle={handleScreenReaderToggle} />
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
        {/* Heart Rate History */}
        <div style={{ marginBottom: "30px" }}>
          <h2 style={{ color: COLORS.darkGreen, marginBottom: "15px", fontSize: "20px", fontWeight: 700 }}>Heart Heart Rate History</h2>
          <div style={{ backgroundColor: COLORS.cardBg, borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", marginBottom: "20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px" }}>
              {heartRateHistory.map((record, idx) => {
                const status = getHeartRateStatus(record.value);
                return (
                  <div key={idx} style={{ backgroundColor: COLORS.white, padding: "15px", borderRadius: "8px", borderLeft: `4px solid ${status.color}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                      <div style={{ fontSize: "14px", fontWeight: 600, color: COLORS.darkGreen }}>{record.date}</div>
                      <span style={{ padding: "4px 8px", backgroundColor: status.color, color: COLORS.white, borderRadius: "4px", fontSize: "11px", fontWeight: 600 }}>{status.status}</span>
                    </div>
                    <div style={{ fontSize: "28px", fontWeight: 700, color: COLORS.red, marginBottom: "8px" }}>{record.value} bpm</div>
                    <div style={{ fontSize: "12px", color: COLORS.darkGray }}>Recorded at {record.time}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Oxygen Level History */}
        <div style={{ marginBottom: "30px" }}>
          <h2 style={{ color: COLORS.darkGreen, marginBottom: "15px", fontSize: "20px", fontWeight: 700 }}>Lungs Oxygen Level History</h2>
          <div style={{ backgroundColor: COLORS.cardBg, borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", marginBottom: "20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px" }}>
              {oxygenHistory.map((record, idx) => {
                const status = getOxygenStatus(record.value);
                return (
                  <div key={idx} style={{ backgroundColor: COLORS.white, padding: "15px", borderRadius: "8px", borderLeft: `4px solid ${status.color}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                      <div style={{ fontSize: "14px", fontWeight: 600, color: COLORS.darkGreen }}>{record.date}</div>
                      <span style={{ padding: "4px 8px", backgroundColor: status.color, color: COLORS.white, borderRadius: "4px", fontSize: "11px", fontWeight: 600 }}>{status.status}</span>
                    </div>
                    <div style={{ fontSize: "28px", fontWeight: 700, color: COLORS.mediumGreen, marginBottom: "8px" }}>{record.value}%</div>
                    <div style={{ fontSize: "12px", color: COLORS.darkGray }}>Recorded at {record.time}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Temperature History */}
        <div style={{ marginBottom: "30px" }}>
          <h2 style={{ color: COLORS.darkGreen, marginBottom: "15px", fontSize: "20px", fontWeight: 700 }}>Temperature Temperature History</h2>
          <div style={{ backgroundColor: COLORS.cardBg, borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px" }}>
              {temperatureHistory.map((record, idx) => {
                const status = getTemperatureStatus(record.value);
                return (
                  <div key={idx} style={{ backgroundColor: COLORS.white, padding: "15px", borderRadius: "8px", borderLeft: `4px solid ${status.color}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                      <div style={{ fontSize: "14px", fontWeight: 600, color: COLORS.darkGreen }}>{record.date}</div>
                      <span style={{ padding: "4px 8px", backgroundColor: status.color, color: COLORS.white, borderRadius: "4px", fontSize: "11px", fontWeight: 600 }}>{status.status}</span>
                    </div>
                    <div style={{ fontSize: "28px", fontWeight: 700, color: COLORS.yellow, marginBottom: "8px" }}>{record.value}°C</div>
                    <div style={{ fontSize: "12px", color: COLORS.darkGray }}>Recorded at {record.time}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Health Summary */}
        <div style={{ backgroundColor: COLORS.cardBg, borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <h3 style={{ color: COLORS.darkGreen, margin: "0 0 20px 0", fontSize: "18px", fontWeight: 700 }}>Up Health Summary</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
            <div style={{ backgroundColor: COLORS.white, padding: "15px", borderRadius: "8px", textAlign: "center" }}>
              <p style={{ color: COLORS.darkGray, margin: "0 0 8px 0", fontSize: "12px" }}>Average Heart Rate</p>
              <p style={{ color: COLORS.red, margin: "0", fontSize: "24px", fontWeight: 700 }}>72 bpm</p>
            </div>
            <div style={{ backgroundColor: COLORS.white, padding: "15px", borderRadius: "8px", textAlign: "center" }}>
              <p style={{ color: COLORS.darkGray, margin: "0 0 8px 0", fontSize: "12px" }}>Average Oxygen</p>
              <p style={{ color: COLORS.mediumGreen, margin: "0", fontSize: "24px", fontWeight: 700 }}>98%</p>
            </div>
            <div style={{ backgroundColor: COLORS.white, padding: "15px", borderRadius: "8px", textAlign: "center" }}>
              <p style={{ color: COLORS.darkGray, margin: "0 0 8px 0", fontSize: "12px" }}>Average Temperature</p>
              <p style={{ color: COLORS.yellow, margin: "0", fontSize: "24px", fontWeight: 700 }}>36.5°C</p>
            </div>
            <div style={{ backgroundColor: COLORS.white, padding: "15px", borderRadius: "8px", textAlign: "center" }}>
              <p style={{ color: COLORS.darkGray, margin: "0 0 8px 0", fontSize: "12px" }}>Health Status</p>
              <p style={{ color: COLORS.mediumGreen, margin: "0", fontSize: "24px", fontWeight: 700 }}>Check Good</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ElderHealthHistory;
