import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// ============================================================
// TaskNotificationsPage.js - Real-time Task Notifications Page
// ============================================================
// Shows real-time notifications for task updates

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

const TaskNotificationsPage = () => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  // Mock data
  const mockNotifications = [
    {
      id: 1,
      type: "task_assigned",
      title: "Task Assigned",
      message: "Ahmed Khan has accepted your 'Buy Groceries' task",
      timestamp: "2 minutes ago",
      read: false,
      taskId: 1,
      icon: "✓",
    },
    {
      id: 2,
      type: "task_completed",
      title: "Task Completed",
      message: "Fatima Ali has completed your 'Medical Appointment' task",
      timestamp: "1 hour ago",
      read: false,
      taskId: 2,
      icon: "✓",
    },
    {
      id: 3,
      type: "volunteer_applied",
      title: "Volunteer Applied",
      message: "Hassan Ahmed has applied for your 'House Cleaning' task",
      timestamp: "3 hours ago",
      read: true,
      taskId: 3,
      icon: "👤",
    },
    {
      id: 4,
      type: "emergency_alert",
      title: "Emergency Alert",
      message: "Your emergency SOS has been triggered. Help is on the way!",
      timestamp: "5 hours ago",
      read: true,
      taskId: null,
      icon: "🚨",
    },
    {
      id: 5,
      type: "reminder",
      title: "Task Reminder",
      message: "Reminder: Your 'Companionship Visit' task is scheduled for tomorrow at 3 PM",
      timestamp: "1 day ago",
      read: true,
      taskId: 5,
      icon: "⏰",
    },
  ];

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      setNotifications(mockNotifications);
      toast.success("Notifications loaded");
    } catch (error) {
      toast.error("Failed to load notifications");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = (notificationId) => {
    setNotifications(
      notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const handleDelete = (notificationId) => {
    setNotifications(notifications.filter((n) => n.id !== notificationId));
    toast.success("Notification deleted");
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "task_assigned":
        return COLORS.mediumGreen;
      case "task_completed":
        return COLORS.mediumGreen;
      case "volunteer_applied":
        return COLORS.yellow;
      case "emergency_alert":
        return COLORS.red;
      case "reminder":
        return COLORS.yellow;
      default:
        return COLORS.darkGray;
    }
  };

  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((n) => !n.read)
      : notifications;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div style={{ backgroundColor: COLORS.lightGray, minHeight: "100vh", paddingBottom: "40px" }}>
      {/* Header */}
      <div style={{ backgroundColor: COLORS.darkGreen, padding: "30px 20px", color: COLORS.white }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "none",
              border: "none",
              color: COLORS.white,
              cursor: "pointer",
              fontSize: "16px",
              marginBottom: "15px",
              fontWeight: 600,
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            Back
          </button>
          <h1 style={{ fontSize: "32px", fontWeight: 700, margin: "0 0 8px 0" }}>
            🔔 Notifications
          </h1>
          <p style={{ fontSize: "14px", color: COLORS.veryLightGreen, margin: "0" }}>
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}` : "All caught up!"}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "30px 20px" }}>
        {/* Filter and Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            flexWrap: "wrap",
            gap: "15px",
          }}
        >
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => setFilter("all")}
              style={{
                padding: "8px 16px",
                backgroundColor: filter === "all" ? COLORS.mediumGreen : COLORS.white,
                color: filter === "all" ? COLORS.white : COLORS.darkGreen,
                border: `2px solid ${COLORS.veryLightGreen}`,
                borderRadius: "20px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "12px",
                fontFamily: "Montserrat, sans-serif",
                transition: "all 0.3s ease",
              }}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              style={{
                padding: "8px 16px",
                backgroundColor: filter === "unread" ? COLORS.mediumGreen : COLORS.white,
                color: filter === "unread" ? COLORS.white : COLORS.darkGreen,
                border: `2px solid ${COLORS.veryLightGreen}`,
                borderRadius: "20px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "12px",
                fontFamily: "Montserrat, sans-serif",
                transition: "all 0.3s ease",
              }}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              style={{
                padding: "8px 16px",
                backgroundColor: COLORS.darkGray,
                color: COLORS.white,
                border: "none",
                borderRadius: "20px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "12px",
                fontFamily: "Montserrat, sans-serif",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
              onMouseLeave={(e) => (e.target.style.opacity = "1")}
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Notifications List */}
        {isLoading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p style={{ color: COLORS.darkGray, fontFamily: "Montserrat, sans-serif" }}>
              Loading notifications...
            </p>
          </div>
        ) : filteredNotifications.length === 0 ? (
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
              📭 No notifications found.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                style={{
                  backgroundColor: notification.read ? COLORS.white : COLORS.veryLightGreen,
                  borderRadius: "12px",
                  padding: "20px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  borderLeft: `4px solid ${getNotificationColor(notification.type)}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  gap: "15px",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "8px",
                    }}
                  >
                    <span style={{ fontSize: "20px" }}>{notification.icon}</span>
                    <h3
                      style={{
                        color: COLORS.darkGreen,
                        margin: "0",
                        fontSize: "14px",
                        fontWeight: 700,
                        fontFamily: "Montserrat, sans-serif",
                      }}
                    >
                      {notification.title}
                      {!notification.read && (
                        <span
                          style={{
                            display: "inline-block",
                            width: "8px",
                            height: "8px",
                            backgroundColor: COLORS.red,
                            borderRadius: "50%",
                            marginLeft: "8px",
                          }}
                        />
                      )}
                    </h3>
                  </div>

                  <p
                    style={{
                      color: COLORS.darkGray,
                      margin: "0 0 8px 0",
                      fontSize: "13px",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    {notification.message}
                  </p>

                  <p
                    style={{
                      color: COLORS.darkGray,
                      margin: "0",
                      fontSize: "11px",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    {notification.timestamp}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                  }}
                >
                  {!notification.read && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
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
                      onMouseEnter={(e) => (e.target.style.backgroundColor = COLORS.darkMediumGreen)}
                      onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.mediumGreen)}
                    >
                      Mark Read
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(notification.id)}
                    style={{
                      padding: "6px 12px",
                      backgroundColor: COLORS.darkGray,
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskNotificationsPage;
