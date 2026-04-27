import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import TaskCard from "../../components/TaskCard";
import TaskFilter from "../../components/TaskFilter";
import TaskSearch from "../../components/TaskSearch";

// ============================================================
// CaregiverTaskManagement.js - Caregiver Task Management Page
// ============================================================
// Allows caregivers to manage tasks for linked elders

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

const CaregiverTaskManagement = () => {
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
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedElder, setSelectedElder] = useState("all");

  // Mock data
  const mockElders = [
    { id: 1, name: "Mother (Fatima)" },
    { id: 2, name: "Father (Ahmed)" },
    { id: 3, name: "Grandmother (Aisha)" },
  ];

  const mockTasks = [
    {
      id: 1,
      elderId: 1,
      elderName: "Mother (Fatima)",
      title: "Buy Groceries",
      description: "Need to buy milk, bread, eggs, and vegetables",
      category: "groceries",
      priority: "medium",
      status: "pending",
      date: "2025-04-28",
      time: "10:00",
      location: "24.8607, 67.0011",
      address: "Karachi, Pakistan",
      createdAt: "2025-04-27",
      assignedVolunteer: null,
    },
    {
      id: 2,
      elderId: 1,
      elderName: "Mother (Fatima)",
      title: "Medical Appointment",
      description: "Doctor's appointment at hospital",
      category: "medical",
      priority: "high",
      status: "assigned",
      date: "2025-04-27",
      time: "11:00",
      location: "24.8607, 67.0011",
      address: "Karachi, Pakistan",
      createdAt: "2025-04-25",
      assignedVolunteer: "Fatima Ali",
    },
    {
      id: 3,
      elderId: 2,
      elderName: "Father (Ahmed)",
      title: "House Cleaning",
      description: "General house cleaning and organizing",
      category: "housekeeping",
      priority: "low",
      status: "in-progress",
      date: "2025-04-29",
      time: "14:00",
      location: "24.8607, 67.0011",
      address: "Karachi, Pakistan",
      createdAt: "2025-04-26",
      assignedVolunteer: "Ahmed Khan",
    },
  ];

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    applyFiltersAndSearch();
  }, [tasks, filters, searchQuery, activeTab, selectedElder]);

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

    // Filter by elder
    if (selectedElder !== "all") {
      filtered = filtered.filter((t) => t.elderId === parseInt(selectedElder));
    }

    // Filter by tab
    if (activeTab === "pending") {
      filtered = filtered.filter((t) => t.status === "pending");
    } else if (activeTab === "assigned") {
      filtered = filtered.filter((t) => t.status === "assigned" || t.status === "in-progress");
    } else if (activeTab === "completed") {
      filtered = filtered.filter((t) => t.status === "completed");
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

  const getStats = () => {
    return {
      total: tasks.length,
      pending: tasks.filter((t) => t.status === "pending").length,
      assigned: tasks.filter((t) => t.status === "assigned" || t.status === "in-progress").length,
      completed: tasks.filter((t) => t.status === "completed").length,
    };
  };

  const stats = getStats();

  return (
    <div style={{ backgroundColor: COLORS.lightGray, minHeight: "100vh", paddingBottom: "40px" }}>
      {/* Header */}
      <div style={{ backgroundColor: COLORS.darkGreen, padding: "30px 20px", color: COLORS.white }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <button
            onClick={() => navigate("/caregiver-dashboard")}
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
            👨‍⚕️ Task Management
          </h1>
          <p style={{ fontSize: "14px", color: COLORS.veryLightGreen, margin: "0" }}>
            Manage tasks for your linked elders
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
              Total Tasks
            </div>
          </div>

          <div
            style={{
              backgroundColor: COLORS.white,
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              textAlign: "center",
              borderTop: `4px solid ${COLORS.red}`,
            }}
          >
            <div style={{ fontSize: "28px", fontWeight: 700, color: COLORS.darkGreen }}>
              {stats.pending}
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
              textAlign: "center",
              borderTop: `4px solid ${COLORS.yellow}`,
            }}
          >
            <div style={{ fontSize: "28px", fontWeight: 700, color: COLORS.darkGreen }}>
              {stats.assigned}
            </div>
            <div style={{ fontSize: "12px", color: COLORS.darkGray, fontFamily: "Montserrat, sans-serif" }}>
              Assigned
            </div>
          </div>

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
              {stats.completed}
            </div>
            <div style={{ fontSize: "12px", color: COLORS.darkGray, fontFamily: "Montserrat, sans-serif" }}>
              Completed
            </div>
          </div>
        </div>

        {/* Elder Selection */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: 600,
              color: COLORS.darkGreen,
              marginBottom: "8px",
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            Select Elder
          </label>
          <select
            value={selectedElder}
            onChange={(e) => setSelectedElder(e.target.value)}
            style={{
              padding: "12px",
              border: `2px solid ${COLORS.veryLightGreen}`,
              borderRadius: "8px",
              fontSize: "13px",
              fontFamily: "Montserrat, sans-serif",
              cursor: "pointer",
              backgroundColor: COLORS.white,
              color: COLORS.darkGreen,
              maxWidth: "300px",
            }}
          >
            <option value="all">All Elders</option>
            {mockElders.map((elder) => (
              <option key={elder.id} value={elder.id}>
                {elder.name}
              </option>
            ))}
          </select>
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
          {["all", "pending", "assigned", "completed"].map((tab) => (
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
              {tab === "all" && `All (${stats.total})`}
              {tab === "pending" && `Pending (${stats.pending})`}
              {tab === "assigned" && `Assigned (${stats.assigned})`}
              {tab === "completed" && `Completed (${stats.completed})`}
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
              <TaskCard
                key={task.id}
                task={task}
                userRole="caregiver"
                onViewDetails={() => navigate(`/task-detail/${task.id}`, { state: { task } })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CaregiverTaskManagement;
