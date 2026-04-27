import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const COLORS = {
  darkGreen: "#1C382A",
  mediumGreen: "#52b788",
  darkMediumGreen: "#2d6a4f",
  veryLightGreen: "#BAE4C7",
  white: "#FFFFFF",
  lightGray: "#f5f5f5",
  darkGray: "#666666",
  red: "#e63946",
  yellow: "#FFC107",
};

const VolunteerNotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [sosActive, setSosActive] = useState(false);
  const [sosNotification, setSosNotification] = useState(null);

  // Mock notifications data - only task requests, reviews, and feedback
  const mockNotifications = [
    {
      id: 1,
      type: "task_request",
      title: "New Task Request",
      message: "Fatima Ahmed has requested the task 'Buy Groceries' - Priority: Medium, Scheduled: Tomorrow at 10:00 AM",
      elderName: "Fatima Ahmed",
      taskName: "Buy Groceries",
      taskDetails: "Priority: Medium, Scheduled: Tomorrow at 10:00 AM",
      timestamp: new Date(Date.now() - 5 * 60000),
      read: false,
    },
    {
      id: 2,
      type: "review_feedback",
      title: "Review & Points Received",
      message: "Aisha Hassan gave you 5 stars and 50 points for completing 'Medical Appointment' task",
      elderName: "Aisha Hassan",
      taskName: "Medical Appointment",
      points: 50,
      rating: 5,
      timestamp: new Date(Date.now() - 15 * 60000),
      read: false,
    },
    {
      id: 3,
      type: "task_request",
      title: "New Task Request",
      message: "Hassan Ahmed has requested the task 'House Cleaning' - Priority: Low, Scheduled: Next Week",
      elderName: "Hassan Ahmed",
      taskName: "House Cleaning",
      taskDetails: "Priority: Low, Scheduled: Next Week",
      timestamp: new Date(Date.now() - 30 * 60000),
      read: true,
    },
    {
      id: 4,
      type: "review_feedback",
      title: "Review & Points Received",
      message: "Fatima Ahmed gave you 4 stars and 40 points for completing 'Companionship Visit' task",
      elderName: "Fatima Ahmed",
      taskName: "Companionship Visit",
      points: 40,
      rating: 4,
      timestamp: new Date(Date.now() - 60 * 60000),
      read: true,
    },
    {
      id: 5,
      type: "task_reminder",
      title: "Task Reminder",
      message: "You have to complete 'Grocery Shopping' task which has been scheduled for tomorrow at 3:00 PM",
      taskName: "Grocery Shopping",
      scheduledTime: "3:00 PM",
      timestamp: new Date(Date.now() - 120 * 60000),
      read: true,
    },
  ];

  // Load notifications on mount
  useEffect(() => {
    setNotifications(mockNotifications);
  }, []);

  // Simulate SOS trigger (only if volunteer is in radius range)
  useEffect(() => {
    const sosTimer = setTimeout(() => {
      triggerSOS();
    }, 3000);

    return () => clearTimeout(sosTimer);
  }, []);

  // Play emergency sound
  const playEmergencySound = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(1200, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0, audioContext.currentTime + 0.6);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.6);
  };

  // Trigger vibration
  const triggerVibration = () => {
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
  };

  // Handle SOS notification
  const triggerSOS = () => {
    setSosActive(true);
    setSosNotification({
      id: Date.now(),
      type: "sos",
      title: "🚨 EMERGENCY SOS ALERT 🚨",
      message: "Fatima Ahmed has triggered the SOS button! You are in the radius range.",
      elderName: "Fatima Ahmed",
      timestamp: new Date(),
      read: false,
    });

    playEmergencySound();
    triggerVibration();

    toast.error("EMERGENCY: Fatima Ahmed triggered SOS! You are in radius range!", {
      duration: 10000,
      icon: "🚨",
    });

    setTimeout(() => {
      setSosActive(false);
    }, 10000);
  };

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  // Delete notification
  const deleteNotification = (id) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
    toast.success("Notification deleted");
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "task_request":
        return "📋";
      case "review_feedback":
        return "⭐";
      case "task_reminder":
        return "⏰";
      case "sos":
        return "🚨";
      default:
        return "📢";
    }
  };

  // Get notification color based on type
  const getNotificationColor = (type) => {
    switch (type) {
      case "sos":
        return COLORS.red;
      case "review_feedback":
        return COLORS.yellow;
      case "task_reminder":
        return COLORS.yellow;
      default:
        return COLORS.mediumGreen;
    }
  };

  // Format timestamp
  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div style={{ backgroundColor: COLORS.lightGray, minHeight: "100vh", paddingBottom: "40px" }}>
      {/* Header */}
      <div style={{ backgroundColor: COLORS.darkGreen, padding: "30px 20px", color: COLORS.white }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "none",
              border: "none",
              color: COLORS.white,
              cursor: "pointer",
              fontSize: "16px",
              marginBottom: "15px",
              fontWeight: 400,
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            Back
          </button>
          <h1 style={{ fontSize: "32px", fontWeight: 700, margin: "0 0 8px 0" }}>
            Notifications
          </h1>
          <p style={{ fontSize: "14px", color: COLORS.veryLightGreen, margin: "0" }}>
            Task requests, reviews, and feedback from elders
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "30px 20px" }}>
        {/* SOS Alert Banner */}
        {sosActive && sosNotification && (
          <div
            style={{
              backgroundColor: COLORS.red,
              color: COLORS.white,
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "30px",
              boxShadow: "0 4px 20px rgba(230, 57, 70, 0.4)",
              animation: "pulse 1s infinite",
            }}
          >
            <h2 style={{ fontSize: "24px", fontWeight: 700, margin: "0 0 10px 0" }}>
              🚨 EMERGENCY SOS ALERT 🚨
            </h2>
            <p style={{ fontSize: "16px", margin: "0 0 15px 0" }}>
              {sosNotification.message}
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                style={{
                  padding: "10px 20px",
                  backgroundColor: COLORS.white,
                  color: COLORS.red,
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "14px",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                Help Now
              </button>
              <button
                onClick={() => setSosActive(false)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "rgba(255,255,255,0.2)",
                  color: COLORS.white,
                  border: "2px solid white",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "14px",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div
            style={{
              backgroundColor: COLORS.white,
              borderRadius: "12px",
              padding: "40px",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <p
              style={{
                color: COLORS.darkGray,
                fontSize: "16px",
                fontFamily: "Montserrat, sans-serif",
                margin: "0",
              }}
            >
              📭 No notifications yet
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {notifications.map((notification) => (
              <div
                key={notification.id}
                style={{
                  backgroundColor: COLORS.white,
                  borderRadius: "12px",
                  padding: "20px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  borderLeft: `5px solid ${getNotificationColor(notification.type)}`,
                  opacity: notification.read ? 0.7 : 1,
                }}
              >
                {/* Notification Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ display: "flex", gap: "12px", flex: 1 }}>
                    <div style={{ fontSize: "24px" }}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3
                        style={{
                          color: COLORS.darkGreen,
                          margin: "0 0 5px 0",
                          fontSize: "16px",
                          fontWeight: 600,
                          fontFamily: "Montserrat, sans-serif",
                        }}
                      >
                        {notification.title}
                      </h3>
                      <p
                        style={{
                          color: COLORS.darkGray,
                          margin: "0 0 8px 0",
                          fontSize: "14px",
                          fontFamily: "Montserrat, sans-serif",
                          lineHeight: "1.5",
                        }}
                      >
                        {notification.message}
                      </p>
                      <p
                        style={{
                          color: COLORS.darkGray,
                          margin: "0",
                          fontSize: "12px",
                          fontFamily: "Montserrat, sans-serif",
                        }}
                      >
                        {formatTime(notification.timestamp)}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: "flex", gap: "8px", marginLeft: "10px" }}>
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: COLORS.mediumGreen,
                          color: COLORS.white,
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: 600,
                          fontSize: "11px",
                          fontFamily: "Montserrat, sans-serif",
                          transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) =>
                          (e.target.style.backgroundColor = COLORS.darkMediumGreen)
                        }
                        onMouseLeave={(e) =>
                          (e.target.style.backgroundColor = COLORS.mediumGreen)
                        }
                      >
                        Mark Read
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: COLORS.red,
                        color: COLORS.white,
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: "11px",
                        fontFamily: "Montserrat, sans-serif",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
                      onMouseLeave={(e) => (e.target.style.opacity = "1")}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CSS for pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 4px 20px rgba(230, 57, 70, 0.4);
          }
          50% {
            box-shadow: 0 4px 30px rgba(230, 57, 70, 0.8);
          }
        }
      `}</style>
    </div>
  );
};

export default VolunteerNotificationsPage;
