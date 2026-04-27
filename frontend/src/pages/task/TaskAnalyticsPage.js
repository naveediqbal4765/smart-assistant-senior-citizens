import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// ============================================================
// TaskAnalyticsPage.js - Task Analytics & Statistics Dashboard
// ============================================================
// Shows comprehensive analytics and statistics about tasks

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

const TaskAnalyticsPage = () => {
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data
  const mockAnalytics = {
    overview: {
      totalTasks: 127,
      completedTasks: 89,
      pendingTasks: 23,
      inProgressTasks: 15,
      completionRate: 70,
      avgCompletionTime: "2.3 days",
    },
    byCategory: {
      groceries: 35,
      housekeeping: 28,
      medical: 32,
      companionship: 20,
      transportation: 12,
    },
    byPriority: {
      high: 32,
      medium: 58,
      low: 37,
    },
    byVolunteer: [
      { name: "Ahmed Khan", tasks: 24, rating: 4.8 },
      { name: "Fatima Ali", tasks: 31, rating: 4.9 },
      { name: "Hassan Ahmed", tasks: 18, rating: 4.7 },
      { name: "Aisha Hassan", tasks: 16, rating: 4.6 },
    ],
    monthlyTrend: [
      { month: "Jan", tasks: 12 },
      { month: "Feb", tasks: 18 },
      { month: "Mar", tasks: 22 },
      { month: "Apr", tasks: 28 },
    ],
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      setAnalytics(mockAnalytics);
      toast.success("Analytics loaded");
    } catch (error) {
      toast.error("Failed to load analytics");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !analytics) {
    return (
      <div style={{ backgroundColor: COLORS.lightGray, minHeight: "100vh", paddingBottom: "40px" }}>
        <div style={{ backgroundColor: COLORS.darkGreen, padding: "30px 20px", color: COLORS.white }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <h1 style={{ fontSize: "32px", fontWeight: 700, margin: "0" }}>
              📊 Task Analytics
            </h1>
          </div>
        </div>
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p style={{ color: COLORS.darkGray, fontFamily: "Montserrat, sans-serif" }}>
            Loading analytics...
          </p>
        </div>
      </div>
    );
  }

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
              fontWeight: 600,
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            ← Back
          </button>
          <h1 style={{ fontSize: "32px", fontWeight: 700, margin: "0 0 8px 0" }}>
            📊 Task Analytics
          </h1>
          <p style={{ fontSize: "14px", color: COLORS.veryLightGreen, margin: "0" }}>
            Comprehensive task statistics and insights
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "30px 20px" }}>
        {/* Overview Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "15px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              backgroundColor: COLORS.white,
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              borderTop: `4px solid ${COLORS.mediumGreen}`,
            }}
          >
            <div style={{ fontSize: "28px", fontWeight: 700, color: COLORS.darkGreen }}>
              {analytics.overview.totalTasks}
            </div>
            <div style={{ fontSize: "12px", color: COLORS.darkGray, fontFamily: "Montserrat, sans-serif" }}>
              Total Tasks
            </div>
          </div>

          <div
            style={{
              backgroundColor: COLORS.white,
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              borderTop: `4px solid ${COLORS.mediumGreen}`,
            }}
          >
            <div style={{ fontSize: "28px", fontWeight: 700, color: COLORS.darkGreen }}>
              {analytics.overview.completedTasks}
            </div>
            <div style={{ fontSize: "12px", color: COLORS.darkGray, fontFamily: "Montserrat, sans-serif" }}>
              Completed
            </div>
          </div>

          <div
            style={{
              backgroundColor: COLORS.white,
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              borderTop: `4px solid ${COLORS.yellow}`,
            }}
          >
            <div style={{ fontSize: "28px", fontWeight: 700, color: COLORS.darkGreen }}>
              {analytics.overview.pendingTasks}
            </div>
            <div style={{ fontSize: "12px", color: COLORS.darkGray, fontFamily: "Montserrat, sans-serif" }}>
              Pending
            </div>
          </div>

          <div
            style={{
              backgroundColor: COLORS.white,
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              borderTop: `4px solid ${COLORS.mediumGreen}`,
            }}
          >
            <div style={{ fontSize: "28px", fontWeight: 700, color: COLORS.darkGreen }}>
              {analytics.overview.completionRate}%
            </div>
            <div style={{ fontSize: "12px", color: COLORS.darkGray, fontFamily: "Montserrat, sans-serif" }}>
              Completion Rate
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          {/* Tasks by Category */}
          <div
            style={{
              backgroundColor: COLORS.white,
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <h3
              style={{
                color: COLORS.darkGreen,
                margin: "0 0 15px 0",
                fontSize: "16px",
                fontWeight: 700,
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Tasks by Category
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {Object.entries(analytics.byCategory).map(([category, count]) => (
                <div key={category}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "4px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: COLORS.darkGreen,
                        fontFamily: "Montserrat, sans-serif",
                        textTransform: "capitalize",
                      }}
                    >
                      {category}
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: COLORS.darkGray,
                        fontFamily: "Montserrat, sans-serif",
                      }}
                    >
                      {count}
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
                        width: `${(count / analytics.overview.totalTasks) * 100}%`,
                        backgroundColor: COLORS.mediumGreen,
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
              padding: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <h3
              style={{
                color: COLORS.darkGreen,
                margin: "0 0 15px 0",
                fontSize: "16px",
                fontWeight: 700,
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Tasks by Priority
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {Object.entries(analytics.byPriority).map(([priority, count]) => (
                <div key={priority}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "4px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: COLORS.darkGreen,
                        fontFamily: "Montserrat, sans-serif",
                        textTransform: "capitalize",
                      }}
                    >
                      {priority}
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: COLORS.darkGray,
                        fontFamily: "Montserrat, sans-serif",
                      }}
                    >
                      {count}
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
                        width: `${(count / analytics.overview.totalTasks) * 100}%`,
                        backgroundColor:
                          priority === "high"
                            ? COLORS.red
                            : priority === "medium"
                            ? COLORS.yellow
                            : COLORS.mediumGreen,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Volunteers */}
        <div
          style={{
            backgroundColor: COLORS.white,
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            marginBottom: "30px",
          }}
        >
          <h3
            style={{
              color: COLORS.darkGreen,
              margin: "0 0 15px 0",
              fontSize: "16px",
              fontWeight: 700,
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            Top Volunteers
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "15px",
            }}
          >
            {analytics.byVolunteer.map((volunteer, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: COLORS.lightGray,
                  borderRadius: "8px",
                  padding: "15px",
                }}
              >
                <h4
                  style={{
                    color: COLORS.darkGreen,
                    margin: "0 0 8px 0",
                    fontSize: "13px",
                    fontWeight: 700,
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  {volunteer.name}
                </h4>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "12px",
                    color: COLORS.darkGray,
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  <span>
                    <strong>Tasks:</strong> {volunteer.tasks}
                  </span>
                  <span>
                    <strong>Rating:</strong> ⭐ {volunteer.rating}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trend */}
        <div
          style={{
            backgroundColor: COLORS.white,
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h3
            style={{
              color: COLORS.darkGreen,
              margin: "0 0 15px 0",
              fontSize: "16px",
              fontWeight: 700,
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            Monthly Task Trend
          </h3>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: "15px",
              height: "200px",
            }}
          >
            {analytics.monthlyTrend.map((data, idx) => (
              <div
                key={idx}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: `${(data.tasks / 30) * 150}px`,
                    backgroundColor: COLORS.mediumGreen,
                    borderRadius: "4px",
                  }}
                />
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: COLORS.darkGray,
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  {data.month}
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    color: COLORS.darkGray,
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  {data.tasks}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskAnalyticsPage;
