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
};

const ElderSettings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);
  const [settings, setSettings] = useState({
    fontSize: "medium",
    highContrast: false,
    notifications: true,
    soundAlerts: true,
    locationSharing: true,
    darkMode: false,
    language: "English",
    theme: "green",
  });

  const [appInfo] = useState({
    version: "1.0.0",
    lastSync: "2 minutes ago",
    lastUpdate: "March 15, 2024",
    dataUsage: "45 MB",
  });

  const handleScreenReaderToggle = () => {
    setScreenReaderEnabled(!screenReaderEnabled);
    if (!screenReaderEnabled) {
      const utterance = new SpeechSynthesisUtterance("Screen reader enabled");
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSaveSettings = () => {
    alert("Settings saved successfully!");
  };

  const handleClearCache = () => {
    alert("Cache cleared successfully!");
  };

  const handleCheckUpdates = () => {
    alert("You are running the latest version!");
  };

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: COLORS.dashboardBg }}>
      {/* Header */}
      <div style={{ position: "sticky", top: 0, backgroundColor: COLORS.darkGreen, padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <button onClick={() => navigate("/elder-dashboard")} style={{ background: "none", border: "none", color: COLORS.white, cursor: "pointer", fontSize: "20px" }}>
            ← Back
          </button>
          <h1 style={{ color: COLORS.white, margin: "0", fontSize: "24px", fontWeight: 700 }}>⚙️ Settings</h1>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button onClick={handleScreenReaderToggle} style={{ padding: "8px 12px", backgroundColor: screenReaderEnabled ? COLORS.mediumGreen : COLORS.veryLightGreen, color: screenReaderEnabled ? COLORS.white : COLORS.darkGreen, border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: 600, fontSize: "12px" }}>
            {screenReaderEnabled ? "🔊" : "🔇"}
          </button>
          <Navbar screenReaderEnabled={screenReaderEnabled} onScreenReaderToggle={handleScreenReaderToggle} />
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px", maxWidth: "900px", margin: "0 auto", width: "100%" }}>
        {/* Display Settings */}
        <div style={{ backgroundColor: COLORS.cardBg, borderRadius: "12px", padding: "20px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <h3 style={{ color: COLORS.darkGreen, margin: "0 0 20px 0", fontSize: "18px", fontWeight: 700 }}>🎨 Display Settings</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <label style={{ display: "block", color: COLORS.darkGreen, fontWeight: 600, marginBottom: "8px", fontSize: "13px" }}>Font Size</label>
              <select
                value={settings.fontSize}
                onChange={(e) => handleSettingChange("fontSize", e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: `1px solid ${COLORS.mediumGreen}`,
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="xlarge">Extra Large</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", color: COLORS.darkGreen, fontWeight: 600, marginBottom: "8px", fontSize: "13px" }}>Language</label>
              <select
                value={settings.language}
                onChange={(e) => handleSettingChange("language", e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: `1px solid ${COLORS.mediumGreen}`,
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                <option value="English">English</option>
                <option value="Urdu">Urdu</option>
                <option value="Arabic">Arabic</option>
              </select>
            </div>

            <div>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: COLORS.darkGreen }}>
                <input
                  type="checkbox"
                  checked={settings.highContrast}
                  onChange={(e) => handleSettingChange("highContrast", e.target.checked)}
                  style={{ width: "18px", height: "18px", cursor: "pointer" }}
                />
                High Contrast Mode
              </label>
            </div>

            <div>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: COLORS.darkGreen }}>
                <input
                  type="checkbox"
                  checked={settings.darkMode}
                  onChange={(e) => handleSettingChange("darkMode", e.target.checked)}
                  style={{ width: "18px", height: "18px", cursor: "pointer" }}
                />
                Dark Mode
              </label>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div style={{ backgroundColor: COLORS.cardBg, borderRadius: "12px", padding: "20px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <h3 style={{ color: COLORS.darkGreen, margin: "0 0 20px 0", fontSize: "18px", fontWeight: 700 }}>🔔 Notification Settings</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: COLORS.darkGreen }}>
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => handleSettingChange("notifications", e.target.checked)}
                style={{ width: "18px", height: "18px", cursor: "pointer" }}
              />
              Enable Notifications
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: COLORS.darkGreen }}>
              <input
                type="checkbox"
                checked={settings.soundAlerts}
                onChange={(e) => handleSettingChange("soundAlerts", e.target.checked)}
                style={{ width: "18px", height: "18px", cursor: "pointer" }}
              />
              Sound Alerts
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: COLORS.darkGreen }}>
              <input
                type="checkbox"
                checked={settings.locationSharing}
                onChange={(e) => handleSettingChange("locationSharing", e.target.checked)}
                style={{ width: "18px", height: "18px", cursor: "pointer" }}
              />
              Location Sharing
            </label>
          </div>
        </div>

        {/* App Information */}
        <div style={{ backgroundColor: COLORS.cardBg, borderRadius: "12px", padding: "20px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <h3 style={{ color: COLORS.darkGreen, margin: "0 0 20px 0", fontSize: "18px", fontWeight: 700 }}>ℹ️ App Information</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
            <div style={{ backgroundColor: COLORS.white, padding: "12px", borderRadius: "8px" }}>
              <p style={{ color: COLORS.darkGray, margin: "0 0 4px 0", fontSize: "12px" }}>App Version</p>
              <p style={{ color: COLORS.darkGreen, margin: "0", fontSize: "14px", fontWeight: 600 }}>{appInfo.version}</p>
            </div>
            <div style={{ backgroundColor: COLORS.white, padding: "12px", borderRadius: "8px" }}>
              <p style={{ color: COLORS.darkGray, margin: "0 0 4px 0", fontSize: "12px" }}>Last Sync</p>
              <p style={{ color: COLORS.mediumGreen, margin: "0", fontSize: "14px", fontWeight: 600 }}>✅ {appInfo.lastSync}</p>
            </div>
            <div style={{ backgroundColor: COLORS.white, padding: "12px", borderRadius: "8px" }}>
              <p style={{ color: COLORS.darkGray, margin: "0 0 4px 0", fontSize: "12px" }}>Last Update</p>
              <p style={{ color: COLORS.darkGreen, margin: "0", fontSize: "14px", fontWeight: 600 }}>{appInfo.lastUpdate}</p>
            </div>
            <div style={{ backgroundColor: COLORS.white, padding: "12px", borderRadius: "8px" }}>
              <p style={{ color: COLORS.darkGray, margin: "0 0 4px 0", fontSize: "12px" }}>Data Usage</p>
              <p style={{ color: COLORS.darkGreen, margin: "0", fontSize: "14px", fontWeight: 600 }}>{appInfo.dataUsage}</p>
            </div>
          </div>
        </div>

        {/* App Actions */}
        <div style={{ backgroundColor: COLORS.cardBg, borderRadius: "12px", padding: "20px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <h3 style={{ color: COLORS.darkGreen, margin: "0 0 20px 0", fontSize: "18px", fontWeight: 700 }}>🔧 App Actions</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <button
              onClick={handleCheckUpdates}
              style={{
                padding: "12px",
                backgroundColor: COLORS.mediumGreen,
                color: COLORS.white,
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "13px",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = COLORS.darkMediumGreen)}
              onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.mediumGreen)}
            >
              🔄 Check for Updates
            </button>
            <button
              onClick={handleClearCache}
              style={{
                padding: "12px",
                backgroundColor: COLORS.veryLightGreen,
                color: COLORS.darkGreen,
                border: `2px solid ${COLORS.mediumGreen}`,
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "13px",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#f0f0f0")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.veryLightGreen)}
            >
              🗑️ Clear Cache
            </button>
          </div>
        </div>

        {/* Save Settings */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleSaveSettings}
            style={{
              flex: 1,
              padding: "12px",
              backgroundColor: COLORS.mediumGreen,
              color: COLORS.white,
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "14px",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = COLORS.darkMediumGreen)}
            onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.mediumGreen)}
          >
            ✅ Save Settings
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ElderSettings;
