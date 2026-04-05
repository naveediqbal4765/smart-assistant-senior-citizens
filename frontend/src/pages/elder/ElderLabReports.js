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
  yellow: "#FFC107",
};

const ElderLabReports = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);

  const labReports = [
    { id: 1, name: "Blood Test", date: "2024-03-10", doctor: "Dr. Ahmed", status: "Normal", results: "All values within normal range" },
    { id: 2, name: "Cholesterol Panel", date: "2024-02-28", doctor: "Dr. Sarah", status: "Slightly High", results: "LDL: 150 mg/dL (Normal: <100)" },
    { id: 3, name: "Thyroid Function", date: "2024-02-15", doctor: "Dr. Ahmed", status: "Normal", results: "TSH: 2.5 mIU/L (Normal: 0.4-4.0)" },
    { id: 4, name: "Liver Function", date: "2024-01-30", doctor: "Dr. Khan", status: "Normal", results: "All liver enzymes normal" },
    { id: 5, name: "Kidney Function", date: "2024-01-15", doctor: "Dr. Ahmed", status: "Normal", results: "Creatinine: 0.9 mg/dL (Normal: 0.7-1.3)" },
  ];

  const handleScreenReaderToggle = () => {
    setScreenReaderEnabled(!screenReaderEnabled);
    if (!screenReaderEnabled) {
      const utterance = new SpeechSynthesisUtterance("Screen reader enabled");
      window.speechSynthesis.speak(utterance);
    }
  };

  const downloadReport = (report) => {
    alert(`Downloading ${report.name} from ${report.date}...`);
  };

  const getStatusColor = (status) => {
    if (status === "Normal") return COLORS.mediumGreen;
    if (status === "Slightly High") return COLORS.yellow;
    return COLORS.red;
  };

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: COLORS.dashboardBg }}>
      {/* Header */}
      <div style={{ position: "sticky", top: 0, backgroundColor: COLORS.darkGreen, padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <button onClick={() => navigate("/elder-dashboard")} style={{ background: "none", border: "none", color: COLORS.white, cursor: "pointer", fontSize: "20px" }}>
            ← Back
          </button>
          <h1 style={{ color: COLORS.white, margin: "0", fontSize: "24px", fontWeight: 700 }}>📄 Lab Reports</h1>
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
        {/* Summary Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", marginBottom: "30px" }}>
          <div style={{ backgroundColor: COLORS.cardBg, borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", textAlign: "center" }}>
            <p style={{ color: COLORS.darkGray, margin: "0 0 8px 0", fontSize: "12px" }}>Total Reports</p>
            <p style={{ color: COLORS.darkGreen, margin: "0", fontSize: "28px", fontWeight: 700 }}>{labReports.length}</p>
          </div>
          <div style={{ backgroundColor: COLORS.cardBg, borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", textAlign: "center" }}>
            <p style={{ color: COLORS.darkGray, margin: "0 0 8px 0", fontSize: "12px" }}>Normal Results</p>
            <p style={{ color: COLORS.mediumGreen, margin: "0", fontSize: "28px", fontWeight: 700 }}>4</p>
          </div>
          <div style={{ backgroundColor: COLORS.cardBg, borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", textAlign: "center" }}>
            <p style={{ color: COLORS.darkGray, margin: "0 0 8px 0", fontSize: "12px" }}>Attention Needed</p>
            <p style={{ color: COLORS.yellow, margin: "0", fontSize: "28px", fontWeight: 700 }}>1</p>
          </div>
        </div>

        {/* Lab Reports List */}
        <h2 style={{ color: COLORS.darkGreen, marginBottom: "20px", fontSize: "20px", fontWeight: 700 }}>Your Lab Reports</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
          {labReports.map((report) => (
            <div
              key={report.id}
              style={{
                backgroundColor: COLORS.cardBg,
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                borderTop: `4px solid ${getStatusColor(report.status)}`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "15px" }}>
                <div>
                  <h4 style={{ color: COLORS.darkGreen, margin: "0 0 5px 0", fontSize: "16px", fontWeight: 700 }}>
                    {report.name}
                  </h4>
                  <p style={{ color: COLORS.darkGray, margin: "0", fontSize: "13px" }}>
                    {report.date}
                  </p>
                </div>
                <span style={{ padding: "6px 12px", backgroundColor: getStatusColor(report.status), color: COLORS.white, borderRadius: "20px", fontSize: "11px", fontWeight: 600 }}>
                  {report.status}
                </span>
              </div>

              <div style={{ backgroundColor: COLORS.white, borderRadius: "8px", padding: "12px", marginBottom: "15px" }}>
                <p style={{ color: COLORS.darkGray, margin: "0 0 8px 0", fontSize: "12px" }}>
                  <strong>Doctor:</strong> {report.doctor}
                </p>
                <p style={{ color: COLORS.darkGray, margin: "0", fontSize: "12px" }}>
                  <strong>Results:</strong> {report.results}
                </p>
              </div>

              <button
                onClick={() => downloadReport(report)}
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: COLORS.mediumGreen,
                  color: COLORS.white,
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "12px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = COLORS.darkMediumGreen)}
                onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.mediumGreen)}
              >
                📥 Download Report
              </button>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ElderLabReports;
