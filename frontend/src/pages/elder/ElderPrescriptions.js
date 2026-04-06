import React, { useState, useRef } from "react";
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

const ElderPrescriptions = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);
  const [prescriptions, setPrescriptions] = useState([
    { id: 1, name: "Aspirin", dosage: "500mg", frequency: "Twice daily", doctor: "Dr. Ahmed", date: "2024-03-15", expiryDate: "2025-03-15", image: "📄" },
    { id: 2, name: "Blood Pressure Med", dosage: "10mg", frequency: "Once daily", doctor: "Dr. Sarah", date: "2024-02-20", expiryDate: "2025-02-20", image: "📄" },
    { id: 3, name: "Vitamin D", dosage: "1000 IU", frequency: "Once daily", doctor: "Dr. Ahmed", date: "2024-01-10", expiryDate: "2025-01-10", image: "📄" },
  ]);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleScreenReaderToggle = () => {
    setScreenReaderEnabled(!screenReaderEnabled);
    if (!screenReaderEnabled) {
      const utterance = new SpeechSynthesisUtterance("Screen reader enabled");
      window.speechSynthesis.speak(utterance);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      alert("Unable to access camera. Please check permissions.");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      
      // Simulate adding prescription
      const newPrescription = {
        id: prescriptions.length + 1,
        name: "New Prescription",
        dosage: "To be filled",
        frequency: "To be filled",
        doctor: "To be filled",
        date: new Date().toISOString().split('T')[0],
        expiryDate: "To be filled",
        image: "📸",
      };
      setPrescriptions([newPrescription, ...prescriptions]);
      stopCamera();
      setShowCameraModal(false);
      alert("Prescription scanned successfully!");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      setCameraActive(false);
    }
  };

  const exportToPDF = (prescription) => {
    // Simulate PDF export
    const pdfContent = `
PRESCRIPTION DOCUMENT
=====================
Name: ${prescription.name}
Dosage: ${prescription.dosage}
Frequency: ${prescription.frequency}
Doctor: ${prescription.doctor}
Date: ${prescription.date}
Expiry Date: ${prescription.expiryDate}

This is a digital copy of your prescription.
Please keep this document safe.
    `;
    
    const element = document.createElement("a");
    const file = new Blob([pdfContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `prescription_${prescription.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    alert("Prescription exported successfully!");
  };

  const isExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
  };

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: COLORS.dashboardBg }}>
      {/* Header */}
      <div style={{ position: "sticky", top: 0, backgroundColor: COLORS.darkGreen, padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <button onClick={() => navigate("/elder-dashboard")} style={{ background: "none", border: "none", color: COLORS.white, cursor: "pointer", fontSize: "20px" }}>
            ← Back
          </button>
          <h1 style={{ color: COLORS.white, margin: "0", fontSize: "24px", fontWeight: 700 }}>💊 Prescriptions</h1>
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
        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "30px", flexWrap: "wrap" }}>
          <button
            onClick={() => setShowCameraModal(true)}
            style={{
              padding: "12px 24px",
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
            📷 Scan Prescription
          </button>
          <button
            style={{
              padding: "12px 24px",
              backgroundColor: COLORS.veryLightGreen,
              color: COLORS.darkGreen,
              border: `2px solid ${COLORS.mediumGreen}`,
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "14px",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#f0f0f0")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.veryLightGreen)}
          >
            📁 Upload Document
          </button>
        </div>

        {/* Prescriptions List */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
          {prescriptions.map((prescription) => (
            <div
              key={prescription.id}
              style={{
                backgroundColor: COLORS.cardBg,
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                borderTop: `4px solid ${isExpired(prescription.expiryDate) ? COLORS.red : COLORS.mediumGreen}`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "15px" }}>
                <div>
                  <h4 style={{ color: COLORS.darkGreen, margin: "0 0 5px 0", fontSize: "16px", fontWeight: 700 }}>
                    {prescription.name}
                  </h4>
                  <p style={{ color: COLORS.darkGray, margin: "0", fontSize: "13px" }}>
                    {prescription.dosage}
                  </p>
                </div>
                <span style={{ fontSize: "28px" }}>{prescription.image}</span>
              </div>

              <div style={{ backgroundColor: COLORS.white, borderRadius: "8px", padding: "12px", marginBottom: "15px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "12px" }}>
                  <div>
                    <p style={{ color: COLORS.darkGray, margin: "0 0 4px 0" }}>Frequency</p>
                    <p style={{ color: COLORS.darkGreen, margin: "0", fontWeight: 600 }}>{prescription.frequency}</p>
                  </div>
                  <div>
                    <p style={{ color: COLORS.darkGray, margin: "0 0 4px 0" }}>Doctor</p>
                    <p style={{ color: COLORS.darkGreen, margin: "0", fontWeight: 600 }}>{prescription.doctor}</p>
                  </div>
                  <div>
                    <p style={{ color: COLORS.darkGray, margin: "0 0 4px 0" }}>Date</p>
                    <p style={{ color: COLORS.darkGreen, margin: "0", fontWeight: 600 }}>{prescription.date}</p>
                  </div>
                  <div>
                    <p style={{ color: COLORS.darkGray, margin: "0 0 4px 0" }}>Expires</p>
                    <p style={{ color: isExpired(prescription.expiryDate) ? COLORS.red : COLORS.mediumGreen, margin: "0", fontWeight: 600 }}>
                      {prescription.expiryDate}
                    </p>
                  </div>
                </div>
              </div>

              {isExpired(prescription.expiryDate) && (
                <div style={{ backgroundColor: "#ffebee", border: `1px solid ${COLORS.red}`, borderRadius: "6px", padding: "8px", marginBottom: "15px", fontSize: "12px", color: COLORS.red, fontWeight: 600 }}>
                  ⚠️ This prescription has expired
                </div>
              )}

              <button
                onClick={() => exportToPDF(prescription)}
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
                📥 Export as PDF
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Camera Modal */}
      {showCameraModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
          onClick={() => {
            setShowCameraModal(false);
            stopCamera();
          }}
        >
          <div
            style={{
              backgroundColor: COLORS.white,
              borderRadius: "12px",
              padding: "20px",
              maxWidth: "500px",
              width: "90%",
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 700, color: COLORS.darkGreen, margin: "0" }}>
                📷 Scan Prescription
              </h2>
              <button
                onClick={() => {
                  setShowCameraModal(false);
                  stopCamera();
                }}
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

            {!cameraActive ? (
              <button
                onClick={startCamera}
                style={{
                  width: "100%",
                  padding: "15px",
                  backgroundColor: COLORS.mediumGreen,
                  color: COLORS.white,
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "14px",
                  marginBottom: "15px",
                }}
              >
                Start Camera
              </button>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  style={{
                    width: "100%",
                    borderRadius: "8px",
                    marginBottom: "15px",
                    backgroundColor: COLORS.darkGray,
                  }}
                />
                <canvas
                  ref={canvasRef}
                  width={500}
                  height={400}
                  style={{ display: "none" }}
                />
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={capturePhoto}
                    style={{
                      flex: 1,
                      padding: "12px",
                      backgroundColor: COLORS.mediumGreen,
                      color: COLORS.white,
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: "13px",
                    }}
                  >
                    📸 Capture
                  </button>
                  <button
                    onClick={stopCamera}
                    style={{
                      flex: 1,
                      padding: "12px",
                      backgroundColor: COLORS.veryLightGreen,
                      color: COLORS.darkGreen,
                      border: `2px solid ${COLORS.mediumGreen}`,
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: "13px",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ElderPrescriptions;
