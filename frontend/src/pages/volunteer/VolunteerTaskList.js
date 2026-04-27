import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import TaskCard from "../../components/TaskCard";
import TaskFilter from "../../components/TaskFilter";
import TaskSearch from "../../components/TaskSearch";

// ============================================================
// VolunteerTaskList.js - Volunteer Task Browsing & Application Page
// ============================================================
// Allows volunteers to browse and apply for available tasks

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

const VolunteerTaskList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    category: "",
    dateRange: "",
  });
  const [activeTab, setActiveTab] = useState("available");
  const [isLoading, setIsLoading] = useState(false);
  const [appliedTasks, setAppliedTasks] = useState([]);

  // Mock data
  const mockTasks = [
    {
      id: 1,
      title: "Buy Groceries",
      description: "Need to buy milk, bread, eggs, and vegetables from the market",
      category: "groceries",
      priority: "medium",
      status: "pending",
      date: "2025-04-28",
      time: "10:00",
      location: "24.8607, 67.0011",
      address: "Karachi, Pakistan",
      distance: "2.5 km",
      elderName: "Fatima Ahmed",
      elderRating: 4.8,
      createdAt: "2025-04-27",
    },
    {
      id: 2,
      title: "Medical Appointment",
      description: "Need transportation to doctor's appointment at hospital",
      category: "medical",
      priority: "high",
      status: "pending",
      date: "2025-04-27",
      time: "11:00",
      location: "24.8607, 67.0011",
      address: "Karachi, Pakistan",
      distance: "1.8 km",
      elderName: "Ahmed Khan",
      elderRating: 4.9,
      createdAt: "2025-04-25",
    },
    {
      id: 3,
      title: "House Cleaning",
      description: "Need help with general house cleaning and organizing",
      category: "housekeeping",
      priority: "low",
      status: "pending",
      date: "2025-04-29",
      time: "14:00",
      location: "24.8607, 67.0011",
      address: "Karachi, Pakistan",
      distance: "3.2 km",
      elderName: "Aisha Hassan",
      elderRating: 4.7,
      createdAt: "2025-04-26",
    },
  ];

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    applyFiltersAndSearch();
  }, [tasks, filters, searchQuery, activeTab]);

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      setTasks(mockTasks);
      toast.success("Tasks loaded successfully");
    } catch (error) {
      toast.error("Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  };

  const applyFiltersAndSearch = () => {
    let filtered = [...tasks];

    // Filter by tab
    if (activeTab === "available") {
      filtered = filtered.filter((t) => !appliedTasks.includes(t.id));
    } else if (activeTab === "applied") {
      filtered = filtered.filter((t) => appliedTasks.includes(t.id));
    }

    // Apply other filters
    if (filters.status) {
      filtered = filtered.filter((t) => t.status === filters.status);
    }
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
          t.elderName.toLowerCase().includes(query)
      );
    }

    setFilteredTasks(filtered);
  };

  const handleApplyTask = (taskId) => {
    if (!appliedTasks.includes(taskId)) {
      setAppliedTasks([...appliedTasks, taskId]);
      toast.success("Application submitted! Waiting for elder confirmation.");
    }
  };

  const getStats = () => {
    return {
      available: tasks.filter((t) => !appliedTasks.includes(t.id)).length,
      applied: appliedTasks.length,
    };
  };

  const stats = getStats();

  return (
    <div style={{ backgroundColor: COLORS.lightGray, minHeight: "100vh", paddingBottom: "40px" }}>
      {/* Header */}
      <div style={{ backgroundColor: COLORS.darkGreen, padding: "30px 20px", color: COLORS.white }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <button
            onClick={() => navigate("/volunteer-dashboard")}
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
            ← Back to Dashboard
          </button>
          <h1 style={{ fontSize: "32px", fontWeight: 700, margin: "0 0 8px 0" }}>
            🤝 Available Tasks
          </h1>
          <p style={{ fontSize: "14px", color: COLORS.veryLightGreen, margin: "0" }}>
            Browse and apply for tasks in your area
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
              {stats.available}
            </div>
            <div style={{ fontSize: "12px", color: COLORS.darkGray, fontFamily: "Montserrat, sans-serif" }}>
              Available Tasks
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
              {stats.applied}
            </div>
            <div style={{ fontSize: "12px", color: COLORS.darkGray, fontFamily: "Montserrat, sans-serif" }}>
              Applied
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "20px",
            borderBottom: `2px solid ${COLORS.veryLightGreen}`,
          }}
        >
          {["available", "applied"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "12px 20px",
                backgroundColor: activeTab === tab ? COLORS.mediumGreen : "transparent",
                color: activeTab === tab ? COLORS.white : COLORS.darkGreen,
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "13px",
                fontFamily: "Montserrat, sans-serif",
                borderBottom: activeTab === tab ? `3px solid ${COLORS.darkGreen}` : "none",
                transition: "all 0.3s ease",
              }}
            >
              {tab === "available" && `Available (${stats.available})`}
              {tab === "applied" && `Applied (${stats.applied})`}
            </button>
          ))}
        </div>

        {/* Search and Filter */}
        <TaskSearch onSearch={setSearchQuery} placeholder="Search tasks..." />
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
              Loading tasks...
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
              📭 No tasks found.
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
                  borderLeft: `4px solid ${
                    task.priority === "high"
                      ? COLORS.red
                      : task.priority === "medium"
                      ? COLORS.yellow
                      : COLORS.mediumGreen
                  }`,
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
                      backgroundColor:
                        task.priority === "high"
                          ? COLORS.red
                          : task.priority === "medium"
                          ? COLORS.yellow
                          : COLORS.mediumGreen,
                      color: COLORS.white,
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "11px",
                      fontWeight: 600,
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    {task.priority}
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
                    <strong>Elder:</strong> {task.elderName} ⭐ {task.elderRating}
                  </p>
                  <p style={{ margin: "0 0 4px 0" }}>
                    <strong>Date:</strong> {task.date} at {task.time}
                  </p>
                  <p style={{ margin: "0" }}>
                    <strong>Distance:</strong> {task.distance}
                  </p>
                </div>

                <button
                  onClick={() => handleApplyTask(task.id)}
                  disabled={appliedTasks.includes(task.id)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: appliedTasks.includes(task.id)
                      ? COLORS.darkGray
                      : COLORS.mediumGreen,
                    color: COLORS.white,
                    border: "none",
                    borderRadius: "8px",
                    cursor: appliedTasks.includes(task.id) ? "not-allowed" : "pointer",
                    fontWeight: 600,
                    fontSize: "13px",
                    fontFamily: "Montserrat, sans-serif",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!appliedTasks.includes(task.id)) {
                      e.target.style.backgroundColor = COLORS.darkMediumGreen;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!appliedTasks.includes(task.id)) {
                      e.target.style.backgroundColor = COLORS.mediumGreen;
                    }
                  }}
                >
                  {appliedTasks.includes(task.id) ? "✓ Applied" : "Apply Now"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerTaskList;
