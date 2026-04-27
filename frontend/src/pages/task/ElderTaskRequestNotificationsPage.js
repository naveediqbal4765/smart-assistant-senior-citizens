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

const ElderTaskRequestNotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  // Mock notifications data - only volunteer accepted and task completion notifications
  const mockNotifications = [
    {
      id: 1,
      type: "volunteer_accepted",
      title: "Volunteer Accepted Task",
      message: "Ahmed Khan has accepted the task 'Buy Groceries' - Priority: Medium, Scheduled: Tomorrow at 10:00 AM, Distance: 2.5 km",
      volunteerName: "Ahmed Khan",
      taskName: "Buy Groceries",
      taskDetails: "Priority: Medium, Scheduled: Tomorrow at 10:00 AM, Distance: 2.5 km",
      volunteerRating: 4.8,
      timestamp: new Date(Date.now() - 5 * 60000),
      read: false,
    },
    {
      id: 2,
      type: "task_completed",
      title: "Task Completed",
      message: "Hassan Ali has completed the task 'Medical Appointment' - Rating: 5 stars",
      volunteerName: "Hassan Ali",
      taskName: "Medical Appointment",
      taskDetails: "Completed successfully with 5-star rating",
      volunteerRating: 4.9,
      timestamp: new Date(Date.now() - 15 * 60000),
      read: false,
    },
    {
      id: 3,
      type: "volunteer_accepted",
      title: "Volunteer Accepted Task",
      message: "Fatima Ali has accepted the task 'Companionship Visit' - Priority: Medium, Scheduled: Saturday at 2:00 PM, Distance: 2.1 km",
      volunteerName: "Fatima Ali",
      taskName: "Companionship Visit",
      taskDetails: "Priority: Medium, Scheduled: Saturday at 2:00 PM, Distance: 2.1 km",
      volunteerRating: 4.7,
      timestamp: new Date(Date.now() - 30 * 60000),
      read: true,
    },
    {
      id: 4,
      type: "task_completed",
      title: "Task Completed",
      message: "Ahmed Khan has completed the task 'Grocery Shopping' - Rating: 4 stars",
      volunteerName: "Ahmed Khan",
      taskName: "Grocery Shopping",
      taskDetails: "Completed successfully with 4-star rating",
      volunteerRating: 4.8,
      timestamp: new Date(Date.now() - 60 * 60000),
      read: true,
    },
  ];

  // Load notifications on mount
  useEffect(() => {
    setNotifications(mockNotifications);
  }, []);

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
            Task Notifications
          </h1>
          <p style={{ fontSize: "14px", color: COLORS.veryLightGreen, margin: "0" }}>
            Volunteer acceptance notifications for your tasks
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "30px 20px" }}>
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
                  borderLeft: `5px solid ${COLORS.mediumGreen}`,
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
                    <div style={{ fontSize: "24px" }}>✅</div>
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

                      {/* Volunteer Details */}
                      <div
                        style={{
                          backgroundColor: COLORS.lightGray,
                          borderRadius: "8px",
                          padding: "12px",
                          marginBottom: "8px",
                          fontSize: "12px",
                          fontFamily: "Montserrat, sans-serif",
                          color: COLORS.darkGray,
                        }}
                      >
                        <p style={{ margin: "0 0 4px 0" }}>
                          <strong>Volunteer:</strong> {notification.volunteerName}
                        </p>
                        <p style={{ margin: "0 0 4px 0" }}>
                          <strong>Rating:</strong> ⭐ {notification.volunteerRating}/5
                        </p>
                        <p style={{ margin: "0" }}>
                          <strong>Task:</strong> {notification.taskName}
                        </p>
                      </div>

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
    </div>
  );
};

export default ElderTaskRequestNotificationsPage;
