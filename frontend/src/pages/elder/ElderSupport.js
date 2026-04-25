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

const ElderSupport = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);

  const communityVolunteers = [
    { id: 1, name: "Ahmed Hassan", role: "Healthcare Volunteer", phone: "+923001234567", email: "ahmed@example.com", availability: "Mon-Fri 9AM-5PM", rating: 4.8, services: ["Medical Support", "Medication Reminders"] },
    { id: 2, name: "Fatima Khan", role: "Elderly Care Specialist", phone: "+923009876543", email: "fatima@example.com", availability: "Daily 8AM-6PM", rating: 4.9, services: ["Personal Care", "Companionship"] },
    { id: 3, name: "Muhammad Ali", role: "Transportation Volunteer", phone: "+923005555555", email: "ali@example.com", availability: "Weekends", rating: 4.7, services: ["Rides", "Errands"] },
    { id: 4, name: "Aisha Malik", role: "Nutrition Counselor", phone: "+923004444444", email: "aisha@example.com", availability: "Tue-Thu 10AM-4PM", rating: 4.6, services: ["Diet Planning", "Meal Prep"] },
    { id: 5, name: "Hassan Raza", role: "Tech Support Volunteer", phone: "+923003333333", email: "hassan@example.com", availability: "Mon-Sat 2PM-8PM", rating: 4.8, services: ["Tech Help", "App Support"] },
    { id: 6, name: "Zainab Ahmed", role: "Fitness Coach", phone: "+923002222222", email: "zainab@example.com", availability: "Daily 6AM-8AM, 5PM-7PM", rating: 4.7, services: ["Exercise Guidance", "Mobility Training"] },
  ];

  const emergencyContacts = [
    { name: "Emergency Hotline", phone: "911", description: "24/7 Emergency Services" },
    { name: "Poison Control", phone: "1-800-222-1222", description: "Poison Emergency" },
    { name: "Mental Health Crisis", phone: "988", description: "Suicide & Crisis Lifeline" },
    { name: "Senior Abuse Hotline", phone: "1-855-500-3537", description: "Report Elder Abuse" },
  ];

  const handleScreenReaderToggle = () => {
    setScreenReaderEnabled(!screenReaderEnabled);
    if (!screenReaderEnabled) {
      const utterance = new SpeechSynthesisUtterance("Screen reader enabled");
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCall = (phone) => {
    alert(`Calling ${phone}...`);
  };

  const handleEmail = (email) => {
    alert(`Opening email to ${email}...`);
  };

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: COLORS.dashboardBg }}>
      {/* Header */}
      <div style={{ position: "sticky", top: 0, backgroundColor: COLORS.darkGreen, padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <button onClick={() => navigate("/elder-dashboard")} style={{ background: "none", border: "none", color: COLORS.white, cursor: "pointer", fontSize: "20px" }}>
            Back
          </button>
          <h1 style={{ color: COLORS.white, margin: "0", fontSize: "24px", fontWeight: 700 }}>📞 Support & Help</h1>
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
        {/* Emergency Contacts */}
        <div style={{ marginBottom: "40px" }}>
          <h2 style={{ color: COLORS.red, marginBottom: "15px", fontSize: "20px", fontWeight: 700 }}>🚨 Emergency Contacts</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px" }}>
            {emergencyContacts.map((contact, idx) => (
              <div key={idx} style={{ backgroundColor: "#ffebee", border: `2px solid ${COLORS.red}`, borderRadius: "12px", padding: "15px" }}>
                <h4 style={{ color: COLORS.red, margin: "0 0 5px 0", fontSize: "16px", fontWeight: 700 }}>
                  {contact.name}
                </h4>
                <p style={{ color: COLORS.darkGray, margin: "0 0 10px 0", fontSize: "13px" }}>
                  {contact.description}
                </p>
                <button
                  onClick={() => handleCall(contact.phone)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: COLORS.red,
                    color: COLORS.white,
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "13px",
                  }}
                >
                  📞 {contact.phone}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Community Volunteers */}
        <div>
          <h2 style={{ color: COLORS.darkGreen, marginBottom: "15px", fontSize: "20px", fontWeight: 700 }}>👥 Community Volunteers</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
            {communityVolunteers.map((volunteer) => (
              <div
                key={volunteer.id}
                style={{
                  backgroundColor: COLORS.cardBg,
                  borderRadius: "12px",
                  padding: "20px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "15px" }}>
                  <div>
                    <h4 style={{ color: COLORS.darkGreen, margin: "0 0 5px 0", fontSize: "16px", fontWeight: 700 }}>
                      {volunteer.name}
                    </h4>
                    <p style={{ color: COLORS.darkGray, margin: "0", fontSize: "13px" }}>
                      {volunteer.role}
                    </p>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "20px", marginBottom: "4px" }}>⭐</div>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: COLORS.mediumGreen }}>
                      {volunteer.rating}
                    </div>
                  </div>
                </div>

                <div style={{ backgroundColor: COLORS.white, borderRadius: "8px", padding: "12px", marginBottom: "15px" }}>
                  <p style={{ color: COLORS.darkGray, margin: "0 0 8px 0", fontSize: "12px" }}>
                    <strong>Availability:</strong> {volunteer.availability}
                  </p>
                  <p style={{ color: COLORS.darkGray, margin: "0", fontSize: "12px" }}>
                    <strong>Services:</strong> {volunteer.services.join(", ")}
                  </p>
                </div>

                <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                  <button
                    onClick={() => handleCall(volunteer.phone)}
                    style={{
                      flex: 1,
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
                    📞 Call
                  </button>
                  <button
                    onClick={() => handleEmail(volunteer.email)}
                    style={{
                      flex: 1,
                      padding: "10px",
                      backgroundColor: COLORS.veryLightGreen,
                      color: COLORS.darkGreen,
                      border: `2px solid ${COLORS.mediumGreen}`,
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: "12px",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = "#f0f0f0")}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.veryLightGreen)}
                  >
                    📧 Email
                  </button>
                </div>

                <div style={{ fontSize: "12px", color: COLORS.darkGray, textAlign: "center" }}>
                  {volunteer.phone}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ElderSupport;
