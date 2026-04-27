import React, { useState, useEffect } from "react";
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

const CaregiverTaskAnalyticsPage = () => {
  const navigate = useNavigate();

  // Fixed elder name - this caregiver is assigned to this elder only
  const elderName = "Fatima Ahmed";

  // Mock analytics data for the elder
  const analyticsData = {
    totalTasks: 12,
    completedTasks: 8,
    pendingTasks: 3,
    cancelledTasks: 1,
    completionRate: 67,
    averageRating: 4.8,
    totalReviews: 24,
  };

  const tasksByCategory = [
    { category: "Grocery Shopping", count: 4, completed: 3 },
    { category: "Medical Appointments", count: 3, completed: 2 },
    { category: "Companionship", count: 2, completed: 2 },
    { category: "House Cleaning", count: 2, completed: 1 },
    { category: "Transportation", count: 1, completed: 0 },
  ];

  const tasksByPriority = [
    { priority: "High", count: 3, completed: 2 },
    { priority: "Medium", count: 6, completed: 5 },
    { priority: "Low", count: 3, completed: 1 },
  ];

  const topVolunteers = [
    { name: "Ahmed Khan", tasksCompleted: 5, rating: 4.9 },
    { name: "Fatima Ali", tasksCompleted: 2, rating: 4.8 },
    { name: "Hassan Ahmed", tasksCompleted: 1, rating: 4.7 },
  ];

  const monthlyTrends = [
    { month: "January", tasks: 2, completed: 1 },
    { month: "February", tasks: 3, completed: 2 },
    { month: "March", tasks: 4, completed: 3 },
    { month: "April", tasks: 3, completed: 2 },
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
            Task statistics for {elderName}
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

          {/* Pending Tasks */}
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

          {/* Total Reviews */}
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
              {analyticsData.totalReviews}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: COLORS.darkGray,
                fontFamily: "Montserrat, sans-serif",
                marginTop: "8px",
              }}
            >
              Total Reviews
            </div>
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

        {/* Tasks by Priority */}
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
            Tasks by Priority
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "15px",
            }}
          >
            {tasksByPriority.map((item, idx) => (
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
                    fontSize: "24px",
                    fontWeight: 700,
                    color: COLORS.darkGreen,
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
                  {item.priority} Priority
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: COLORS.darkGray,
                    fontFamily: "Montserrat, sans-serif",
                    marginTop: "3px",
                  }}
                >
                  {item.completed} completed
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Volunteers */}
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
            Top Volunteers
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {topVolunteers.map((volunteer, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "15px",
                  backgroundColor: COLORS.lightGray,
                  borderRadius: "8px",
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
                    {volunteer.name}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: COLORS.darkGray,
                      fontFamily: "Montserrat, sans-serif",
                      marginTop: "4px",
                    }}
                  >
                    {volunteer.tasksCompleted} tasks completed
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: COLORS.yellow,
                  }}
                >
                  ⭐ {volunteer.rating}
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
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: 700,
                        color: COLORS.mediumGreen,
                      }}
                    >
                      {month.tasks}
                    </div>
                    <div
                      style={{
                        fontSize: "10px",
                        color: COLORS.darkGray,
                        fontFamily: "Montserrat, sans-serif",
                      }}
                    >
                      Total
                    </div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: 700,
                        color: COLORS.mediumGreen,
                      }}
                    >
                      {month.completed}
                    </div>
                    <div
                      style={{
                        fontSize: "10px",
                        color: COLORS.darkGray,
                        fontFamily: "Montserrat, sans-serif",
                      }}
                    >
                      Done
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

export default CaregiverTaskAnalyticsPage;
