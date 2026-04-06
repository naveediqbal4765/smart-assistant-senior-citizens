import React, { useState, useEffect } from "react";
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
  yellow: "#FFC107",
};

const ElderSleepTimer = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);
  const [minutes, setMinutes] = useState(30);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [selectedSound, setSelectedSound] = useState("rain");

  const sounds = [
    { id: "rain", name: "🌧️ Rain Sounds", description: "Gentle rainfall" },
    { id: "ocean", name: "🌊 Ocean Waves", description: "Soothing ocean waves" },
    { id: "forest", name: "🌲 Forest Ambience", description: "Birds and nature sounds" },
    { id: "white", name: "⚪ White Noise", description: "Calming white noise" },
    { id: "meditation", name: "🧘 Meditation", description: "Guided meditation" },
  ];

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      alert("Sleep timer finished! Good night!");
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleScreenReaderToggle = () => {
    setScreenReaderEnabled(!screenReaderEnabled);
    if (!screenReaderEnabled) {
      const utterance = new SpeechSynthesisUtterance("Screen reader enabled");
      window.speechSynthesis.speak(utterance);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(minutes * 60);
  };

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: COLORS.dashboardBg }}>
      {/* Header */}
      <div style={{ position: "sticky", top: 0, backgroundColor: COLORS.darkGreen, padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <button onClick={() => navigate("/elder-dashboard")} style={{ background: "none", border: "none", color: COLORS.white, cursor: "pointer", fontSize: "20px" }}>
            ← Back
          </button>
          <h1 style={{ color: COLORS.white, margin: "0", fontSize: "24px", fontWeight: 700 }}>🎵 Sleep Timer</h1>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button onClick={handleScreenReaderToggle} style={{ padding: "8px 12px", backgroundColor: screenReaderEnabled ? COLORS.mediumGreen : COLORS.veryLightGreen, color: screenReaderEnabled ? COLORS.white : COLORS.darkGreen, border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: 600, fontSize: "12px" }}>
            {screenReaderEnabled ? "🔊" : "🔇"}
          </button>
          <Navbar screenReaderEnabled={screenReaderEnabled} onScreenReaderToggle={handleScreenReaderToggle} />
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "40px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ backgroundColor: COLORS.cardBg, borderRadius: "20px", padding: "40px", maxWidth: "500px", width: "100%", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          {/* Timer Display */}
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div style={{ fontSize: "80px", fontWeight: 700, color: COLORS.darkGreen, marginBottom: "20px", fontFamily: "monospace" }}>
              {formatTime(timeLeft)}
            </div>
            <p style={{ fontSize: "16px", color: COLORS.darkGray, margin: "0" }}>
              {isRunning ? "Timer Running..." : "Ready to sleep?"}
            </p>
          </div>

          {/* Sound Selection */}
          <div style={{ marginBottom: "30px" }}>
            <h3 style={{ color: COLORS.darkGreen, marginBottom: "15px", fontSize: "16px", fontWeight: 600 }}>Select Sound</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {sounds.map((sound) => (
                <button
                  key={sound.id}
                  onClick={() => setSelectedSound(sound.id)}
                  style={{
                    padding: "12px",
                    backgroundColor: selectedSound === sound.id ? COLORS.mediumGreen : COLORS.white,
                    color: selectedSound === sound.id ? COLORS.white : COLORS.darkGreen,
                    border: `2px solid ${selectedSound === sound.id ? COLORS.mediumGreen : COLORS.veryLightGreen}`,
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "12px",
                    transition: "all 0.3s ease",
                  }}
                >
                  {sound.name}
                </button>
              ))}
            </div>
          </div>

          {/* Duration Selection */}
          <div style={{ marginBottom: "30px" }}>
            <h3 style={{ color: COLORS.darkGreen, marginBottom: "15px", fontSize: "16px", fontWeight: 600 }}>Duration</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
              {[15, 30, 45, 60].map((min) => (
                <button
                  key={min}
                  onClick={() => {
                    setMinutes(min);
                    setTimeLeft(min * 60);
                  }}
                  disabled={isRunning}
                  style={{
                    padding: "12px",
                    backgroundColor: minutes === min ? COLORS.mediumGreen : COLORS.white,
                    color: minutes === min ? COLORS.white : COLORS.darkGreen,
                    border: `2px solid ${minutes === min ? COLORS.mediumGreen : COLORS.veryLightGreen}`,
                    borderRadius: "8px",
                    cursor: isRunning ? "not-allowed" : "pointer",
                    fontWeight: 600,
                    fontSize: "13px",
                    opacity: isRunning ? 0.5 : 1,
                  }}
                >
                  {min}m
                </button>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {!isRunning ? (
              <button
                onClick={handleStart}
                style={{
                  padding: "15px",
                  backgroundColor: COLORS.mediumGreen,
                  color: COLORS.white,
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: "16px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = COLORS.darkMediumGreen)}
                onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.mediumGreen)}
              >
                ▶️ Start
              </button>
            ) : (
              <button
                onClick={handlePause}
                style={{
                  padding: "15px",
                  backgroundColor: COLORS.yellow,
                  color: COLORS.darkGreen,
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: "16px",
                  transition: "all 0.3s ease",
                }}
              >
                ⏸️ Pause
              </button>
            )}
            <button
              onClick={handleReset}
              style={{
                padding: "15px",
                backgroundColor: COLORS.white,
                color: COLORS.darkGreen,
                border: `2px solid ${COLORS.mediumGreen}`,
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "16px",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#f0f0f0")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.white)}
            >
              🔄 Reset
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ElderSleepTimer;
