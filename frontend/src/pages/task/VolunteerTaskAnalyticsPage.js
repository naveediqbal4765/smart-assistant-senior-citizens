import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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

const VolunteerTaskAnalyticsPage = () => {
  const navigate = useNavigate();

  // Mock analytics data for the volunteer
  const analyticsData = {
    totalTasks: 15,
    completedTasks: 12,
    acceptedTasks: 2,
    pendingTasks: 1,
    completionRate: 80,
    averageRating: 4.7,
    totalReviews: 24,
    totalPoints: 480,
  };

  const tasksByCategory = [
    { category: "Grocery Shopping", count: 5, completed: 5 },
    { category: "Medical Appointments", count: 4, completed: 3 },
    { category: "Companionship", count: 3, completed: 2 },
    { category: "House Cleaning", count: 2, completed: 2 },
    { category: "Transportation", count: 1, completed: 0 },
  ];

  const tasksByStatus = [
    { status: "Completed", count: 12, color: COLORS.mediumGreen },
    { status: "Accepted", count: 2, color: COLORS.yellow },
    { status: "Pending", count: 1, color: COLORS.red },
  ];

  const recentCompletedTasks = [
    { taskName: "Buy Groceries", elder: "Fatima Ahmed", points: 50, rating: 5, date: "2025-04-25" },
    { taskName: "Medical Appointment", elder: "Aisha Hassan", points: 45, rating: 4, date: "2025-04-24" },
    { taskName: "House Cleaning", elder: "Hassan Ahmed", points: 40, rating: 4, date: "2025-04-23" },
    { taskName: "Companionship Visit", elder: "Fatima Ahmed", points: 35, rating: 5, date: "2025-04-22" },
  ];

  const monthlyTrends = [
    { month: "January", completed: 2, accepted: 1, pending: 0 },
    { month: "February", completed: 3, accepted: 1, pending: 0 },
    { month: "March", completed: 4, accepted: 2, pending: 1 },
    { month: "April", completed: 3, accepted: 1, pending: 0 },
  ];

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
            Task Analytics
          </h1>
          <p style={{ fontSize: "14px", color: COLORS.veryLightGreen, margin: "0" }}>
            Your task completion statistics and performance
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "30px 20px" }}>
        {/* Key Statistics */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          {/* Total Tasks */}
          <div
            style={{
              backgroundColor: COLORS.white,
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              borderTop: `4px solid ${COLORS.mediumGreen}`,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "32px", fontWeight: 700, color: COLORS.darkGreen }}>
              {analyticsData.totalTasks}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: COLORS.darkGray,
                fontFamily: "Montserrat, sans-serif",
                marginTop: "8px",
              }}
            >
              Total Tasks
            </div>
          </div>

          {/* Completed Tasks */}
          <div
            style={{
              backgroundColor: COLORS.white,
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              borderTop: `4px solid ${COLORS.mediumGreen}`,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "32px", fontWeight: 700, color: COLORS.darkGreen }}>
              {analyticsData.completedTasks}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: COLORS.darkGray,
                fontFamily: "Montserrat, sans-serif",
                marginTop: "8px",
              }}
            >
              Completed
            </div>
          </div>

          {/* Accepted Tasks */}
          <div
            style={{
              backgroundColor: COLORS.white,
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              borderTop: `4px solid ${COLORS.yellow}`,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "32px", fontWeight: 700, color: COLORS.darkGreen }}>
              {analyticsData.acceptedTasks}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: COLORS.darkGray,
                fontFamily: "Montserrat, sans-serif",
                marginTop: "8px",
              }}
            >
              Accepted
            </div>
          </div>

          {/* Pending Tasks */}
          <div
            style={{
              backgroundColor: COLORS.white,
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              borderTop: `4px solid ${COLORS.red}`,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "32px", fontWeight: 700, color: COLORS.darkGreen }}>
              {analyticsData.pendingTasks}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: COLORS.darkGray,
                fontFamily: "Montserrat, sans-serif",
                marginTop: "8px",
              }}
            >
              Pending
            </div>
          </div>

          {/* Completion Rate */}
          <div
            style={{
              backgroundColor: COLORS.white,
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              borderTop: `4px solid ${COLORS.mediumGreen}`,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "32px", fontWeight: 700, color: COLORS.darkGreen }}>
              {analyticsData.completionRate}%
            </div>
            <div
              style={{
                fontSize: "12px",
                color: COLORS.darkGray,
                fontFamily: "Montserrat, sans-serif",
                marginTop: "8px",
              }}
            >
              Completion Rate
            </div>
          </div>

          {/* Total Points */}
          <div
            style={{
              backgroundColor: COLORS.white,
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              borderTop: `4px solid ${COLORS.yellow}`,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "32px", fontWeight: 700, color: COLORS.darkGreen }}>
              {analyticsData.totalPoints}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: COLORS.darkGray,
                fontFamily: "Montserrat, sans-serif",
                marginTop: "8px",
              }}
            >
              Total Points
            </div>
          </div>

          {/* Average Rating */}
          <div
            style={{
              backgroundColor: COLORS.white,
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              borderTop: `4px solid ${COLORS.yellow}`,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "32px", fontWeight: 700, color: COLORS.darkGreen }}>
              {analyticsData.averageRating}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: COLORS.darkGray,
                fontFamily: "Montserrat, sans-serif",
                marginTop: "8px",
              }}
            >
              Average Rating
            </div>
          </div>
        </div>

        {/* Tasks by Status */}
        <div
          style={{
            backgroundColor: COLORS.white,
            borderRadius: "12px",
            padding: "30px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            marginBottom: "30px",
          }}
        >
          <h3
            style={{
              color: COLORS.darkGreen,
              margin: "0 0 20px 0",
              fontSize: "18px",
              fontWeight: 700,
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            Tasks by Status
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "15px",
            }}
          >
            {tasksByStatus.map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: COLORS.lightGray,
                  borderRadius: "8px",
                  padding: "15px",
                  textAlign: "center",
                  borderLeft: `4px solid ${item.color}`,
                }}
              >
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: 700,
                    color: item.color,
                  }}
                >
                  {item.count}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: COLORS.darkGray,
                    fontFamily: "Montserrat, sans-serif",
                    marginTop: "5px",
                  }}
                >
                  {item.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks by Category */}
        <div
          style={{
            backgroundColor: COLORS.white,
            borderRadius: "12px",
            padding: "30px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            marginBottom: "30px",
          }}
        >
          <h3
            style={{
              color: COLORS.darkGreen,
              margin: "0 0 20px 0",
              fontSize: "18px",
              fontWeight: 700,
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            Tasks by Category
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {tasksByCategory.map((item, idx) => (
              <div key={idx}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: COLORS.darkGreen,
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    {item.category}
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      color: COLORS.darkGray,
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    {item.completed}/{item.count}
                  </span>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "8px",
                    backgroundColor: COLORS.lightGray,
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${(item.completed / item.count) * 100}%`,
                      backgroundColor: COLORS.mediumGreen,
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Completed Tasks */}
        <div
          style={{
            backgroundColor: COLORS.white,
            borderRadius: "12px",
            padding: "30px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            marginBottom: "30px",
          }}
        >
          <h3
            style={{
              color: COLORS.darkGreen,
              margin: "0 0 20px 0",
              fontSize: "18px",
              fontWeight: 700,
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            Recent Completed Tasks
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {recentCompletedTasks.map((task, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "15px",
                  backgroundColor: COLORS.lightGray,
                  borderRadius: "8px",
                  borderLeft: `4px solid ${COLORS.mediumGreen}`,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: COLORS.darkGreen,
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    {task.taskName}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: COLORS.darkGray,
                      fontFamily: "Montserrat, sans-serif",
                      marginTop: "4px",
                    }}
                  >
                    {task.elder} • {task.date}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: COLORS.yellow,
                      marginBottom: "4px",
                    }}
                  >
                    ⭐ {task.rating}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: COLORS.mediumGreen,
                    }}
                  >
                    +{task.points} pts
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trends */}
        <div
          style={{
            backgroundColor: COLORS.white,
            borderRadius: "12px",
            padding: "30px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h3
            style={{
              color: COLORS.darkGreen,
              margin: "0 0 20px 0",
              fontSize: "18px",
              fontWeight: 700,
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            Monthly Trends
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "15px",
            }}
          >
            {monthlyTrends.map((month, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: COLORS.lightGray,
                  borderRadius: "8px",
                  padding: "15px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: COLORS.darkGreen,
                    fontFamily: "Montserrat, sans-serif",
                    marginBottom: "10px",
                  }}
                >
                  {month.month}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: 700,
                        color: COLORS.mediumGreen,
                      }}
                    >
                      {month.completed}
                    </div>
                    <div
                      style={{
                        fontSize: "9px",
                        color: COLORS.darkGray,
                        fontFamily: "Montserrat, sans-serif",
                      }}
                    >
                      Done
                    </div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: 700,
                        color: COLORS.yellow,
                      }}
                    >
                      {month.accepted}
                    </div>
                    <div
                      style={{
                        fontSize: "9px",
                        color: COLORS.darkGray,
                        fontFamily: "Montserrat, sans-serif",
                      }}
                    >
                      Accept
                    </div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: 700,
                        color: COLORS.red,
                      }}
                    >
                      {month.pending}
                    </div>
                    <div
                      style={{
                        fontSize: "9px",
                        color: COLORS.darkGray,
                        fontFamily: "Montserrat, sans-serif",
                      }}
                    >
                      Pend
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerTaskAnalyticsPage;
