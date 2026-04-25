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
};

const ElderMessages = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: "Sarah (Daughter)", message: "Hi Mom! How are you feeling today?", time: "10:30 AM", unread: true },
    { id: 2, sender: "Dr. Ahmed", message: "Your appointment is scheduled for tomorrow at 2 PM", time: "9:15 AM", unread: true },
    { id: 3, sender: "John (Son)", message: "I'll visit you this weekend", time: "Yesterday", unread: false },
  ]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  const handleScreenReaderToggle = () => {
    setScreenReaderEnabled(!screenReaderEnabled);
    if (!screenReaderEnabled) {
      const utterance = new SpeechSynthesisUtterance("Screen reader enabled");
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      alert(`Message sent to ${selectedChat}: "${newMessage}"`);
      setNewMessage("");
    }
  };

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: COLORS.dashboardBg }}>
      {/* Header */}
      <div style={{ position: "sticky", top: 0, backgroundColor: COLORS.darkGreen, padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <button onClick={() => navigate("/elder-dashboard")} style={{ background: "none", border: "none", color: COLORS.white, cursor: "pointer", fontSize: "20px" }}>
            Back
          </button>
          <h1 style={{ color: COLORS.white, margin: "0", fontSize: "24px", fontWeight: 700 }}>💬 Messages</h1>
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
      <div style={{ flex: 1, display: "flex", padding: "20px", gap: "20px", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
        {/* Chat List */}
        <div style={{ width: "300px", backgroundColor: COLORS.cardBg, borderRadius: "12px", padding: "15px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", overflowY: "auto" }}>
          <h3 style={{ color: COLORS.darkGreen, marginTop: "0", marginBottom: "15px" }}>Conversations</h3>
          {messages.map((msg) => (
            <button
              key={msg.id}
              onClick={() => setSelectedChat(msg.sender)}
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "10px",
                backgroundColor: selectedChat === msg.sender ? COLORS.mediumGreen : COLORS.white,
                color: selectedChat === msg.sender ? COLORS.white : COLORS.darkGreen,
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => !selectedChat && (e.target.style.backgroundColor = "#f0f0f0")}
              onMouseLeave={(e) => !selectedChat && (e.target.style.backgroundColor = COLORS.white)}
            >
              <div style={{ fontWeight: 600, fontSize: "13px" }}>{msg.sender}</div>
              <div style={{ fontSize: "11px", marginTop: "4px", opacity: 0.8 }}>{msg.time}</div>
            </button>
          ))}
        </div>

        {/* Chat Window */}
        <div style={{ flex: 1, backgroundColor: COLORS.cardBg, borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column" }}>
          {selectedChat ? (
            <>
              <h2 style={{ color: COLORS.darkGreen, marginTop: "0", marginBottom: "20px" }}>{selectedChat}</h2>
              <div style={{ flex: 1, overflowY: "auto", marginBottom: "20px", padding: "15px", backgroundColor: COLORS.white, borderRadius: "8px" }}>
                <div style={{ padding: "10px", backgroundColor: "#f0f0f0", borderRadius: "8px", marginBottom: "10px" }}>
                  <p style={{ margin: "0", fontSize: "13px", color: COLORS.darkGray }}>Hi! How can I help you today?</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type your message..."
                  style={{
                    flex: 1,
                    padding: "12px",
                    border: `1px solid ${COLORS.mediumGreen}`,
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  style={{
                    padding: "12px 20px",
                    backgroundColor: COLORS.mediumGreen,
                    color: COLORS.white,
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "13px",
                  }}
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: COLORS.darkGray }}>
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ElderMessages;
