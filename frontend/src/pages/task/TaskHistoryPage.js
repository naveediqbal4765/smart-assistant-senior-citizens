import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import TaskCard from "../../components/TaskCard";
import TaskFilter from "../../components/TaskFilter";
import TaskSearch from "../../components/TaskSearch";

// ============================================================
// TaskHistoryPage.js - Completed Tasks History Page
// ============================================================
// Shows history of completed tasks with ratings and reviews

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

const TaskHistoryPage = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    category: "",
    dateRange: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Mock data
  const mockTasks = [
    {
      id: 1,
      title: "Buy Groceries",
      description: "Bought milk, bread, eggs, and vegetables",
      category: "groceries",
      priority: "medium",
      status: "completed",
      date: "2025-04-20",
      time: "10:00",
      location: "24.8607, 67.0011",
      address: "Karachi, Pakistan",
      completedAt: "2025-04-20",
      assignedVolunteer: "Ahmed Khan",
      rating: 5,
      review: "Great volunteer, very helpful and friendly!",
    },
    {
      id: 2,
      title: "House Cleaning",
      description: "Cleaned the entire house",
      category: "housekeeping",
      priority: "low",
      status: "completed",
      date: "2025-04-18",
      time: "14:00",
      location: "24.8607, 67.0011",
      address: "Karachi, Pakistan",
      completedAt: "2025-04-18",
      assignedVolunteer: "Fatima Ali",
      rating: 4,
      review: "Good work, very professional",
    },
    {
      id: 3,
      title: "Medical Appointment",
      description: "Accompanied to doctor's appointment",
      category: "medical",
      priority: "high",
      status: "completed",
      date: "2025-04-15",
      time: "11:00",
      location: "24.8607, 67.0011",
      address: "Karachi, Pakistan",
      completedAt: "2025-04-15",
      assignedVolunteer: "Hassan Ahmed",
      rating: 5,
      review: "Excellent service, very caring and attentive",
    },
  ];

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    applyFiltersAndSearch();
  }, [tasks, filters, searchQuery]);

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      setTasks(mockTasks);
      toast.success("History loaded successfully");
    } catch (error) {
      toast.error("Failed to load history");
    } finally {
      setIsLoading(false);
    }
  };

  const applyFiltersAndSearch = () => {
    let filtered = [...tasks];

    // Apply filters
    if (filters.priority) {
      filtered = filtered.filter((t) => t.priority === filters.priority);
    }
    if (filters.category) {
      filtered = filtered.filter((t) => t.category === filters.category);
    }

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.assignedVolunteer.toLowerCase().includes(query)
      );
    }

    setFilteredTasks(filtered);
  };

  const getStats = () => {
    const totalRating = tasks.reduce((sum, t) => sum + (t.rating || 0), 0);
    const avgRating = tasks.length > 0 ? (totalRating / tasks.length).toFixed(1) : 0;

    return {
      total: tasks.length,
      avgRating: avgRating,
    };
  };

  const stats = getStats();

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
            Back
          </button>
          <h1 style={{ fontSize: "32px", fontWeight: 700, margin: "0 0 8px 0" }}>
            📜 Task History
          </h1>
          <p style={{ fontSize: "14px", color: COLORS.veryLightGreen, margin: "0" }}>
            View your completed tasks and volunteer ratings
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "30px 20px" }}>
        {/* Statistics */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
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
              textAlign: "center",
              borderTop: `4px solid ${COLORS.mediumGreen}`,
            }}
          >
            <div style={{ fontSize: "28px", fontWeight: 700, color: COLORS.darkGreen }}>
              {stats.total}
            </div>
            <div style={{ fontSize: "12px", color: COLORS.darkGray, fontFamily: "Montserrat, sans-serif" }}>
              Completed Tasks
            </div>
          </div>

          <div
            style={{
              backgroundColor: COLORS.white,
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              textAlign: "center",
              borderTop: `4px solid ${COLORS.yellow}`,
            }}
          >
            <div style={{ fontSize: "28px", fontWeight: 700, color: COLORS.darkGreen }}>
              ⭐ {stats.avgRating}
            </div>
            <div style={{ fontSize: "12px", color: COLORS.darkGray, fontFamily: "Montserrat, sans-serif" }}>
              Average Rating
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <TaskSearch onSearch={setSearchQuery} placeholder="Search history..." />
        <TaskFilter
          onFilterChange={setFilters}
          onReset={() =>
            setFilters({
              status: "",
              priority: "",
              category: "",
              dateRange: "",
            })
          }
        />

        {/* Tasks List */}
        {isLoading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p style={{ color: COLORS.darkGray, fontFamily: "Montserrat, sans-serif" }}>
              Loading history...
            </p>
          </div>
        ) : filteredTasks.length === 0 ? (
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
              📭 No completed tasks found.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
              gap: "20px",
            }}
          >
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                style={{
                  backgroundColor: COLORS.white,
                  borderRadius: "12px",
                  padding: "20px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  borderLeft: `4px solid ${COLORS.mediumGreen}`,
                }}
              >
                <h3
                  style={{
                    color: COLORS.darkGreen,
                    margin: "0 0 8px 0",
                    fontSize: "16px",
                    fontWeight: 700,
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  {task.title}
                </h3>

                <p
                  style={{
                    color: COLORS.darkGray,
                    margin: "0 0 12px 0",
                    fontSize: "13px",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  {task.description}
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginBottom: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      backgroundColor: COLORS.veryLightGreen,
                      color: COLORS.darkGreen,
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "11px",
                      fontWeight: 600,
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    {task.category}
                  </span>
                  <span
                    style={{
                      backgroundColor: COLORS.mediumGreen,
                      color: COLORS.white,
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "11px",
                      fontWeight: 600,
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    ✓ Completed
                  </span>
                </div>

                <div
                  style={{
                    fontSize: "12px",
                    color: COLORS.darkGray,
                    marginBottom: "12px",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  <p style={{ margin: "0 0 4px 0" }}>
                    <strong>Volunteer:</strong> {task.assignedVolunteer}
                  </p>
                  <p style={{ margin: "0 0 4px 0" }}>
                    <strong>Completed:</strong> {task.completedAt}
                  </p>
                  <p style={{ margin: "0" }}>
                    <strong>Rating:</strong> {"⭐".repeat(task.rating)} ({task.rating}/5)
                  </p>
                </div>

                {task.review && (
                  <div
                    style={{
                      backgroundColor: COLORS.lightGray,
                      borderRadius: "8px",
                      padding: "10px",
                      marginBottom: "12px",
                      fontSize: "12px",
                      color: COLORS.darkGray,
                      fontFamily: "Montserrat, sans-serif",
                      fontStyle: "italic",
                    }}
                  >
                    "{task.review}"
                  </div>
                )}

                <button
                  onClick={() => navigate(`/task-detail/${task.id}`, { state: { task } })}
                  style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: COLORS.mediumGreen,
                    color: COLORS.white,
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "13px",
                    fontFamily: "Montserrat, sans-serif",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = COLORS.darkMediumGreen)}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.mediumGreen)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskHistoryPage;
