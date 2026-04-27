import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import TaskCard from "../../components/TaskCard";
import TaskForm from "../../components/TaskForm";
import TaskFilter from "../../components/TaskFilter";
import TaskSearch from "../../components/TaskSearch";
import TaskAssignmentModal from "../../components/TaskAssignmentModal";
import TaskRatingModal from "../../components/TaskRatingModal";

// ============================================================
// ElderTaskRequest.js - Enhanced Task Request Page
// ============================================================
// Allows elders to create, view, manage, and track tasks
// Features: Voice-to-text, GPS location, real-time updates, filtering, search

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

const ElderTaskRequest = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State Management
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    category: "",
    dateRange: "",
  });
  const [activeTab, setActiveTab] = useState("active"); // active, completed, all
  const [isLoading, setIsLoading] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [cancelConfirmation, setCancelConfirmation] = useState(null);

  // Mock data - Replace with API calls
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
      createdAt: "2025-04-27",
      assignedVolunteer: null,
      distance: null,
    },
    {
      id: 2,
      title: "House Cleaning",
      description: "Need help with general house cleaning and organizing",
      category: "housekeeping",
      priority: "low",
      status: "assigned",
      date: "2025-04-29",
      time: "14:00",
      location: "24.8607, 67.0011",
      address: "Karachi, Pakistan",
      createdAt: "2025-04-26",
      assignedVolunteer: "Ahmed Khan",
      distance: "2.5 km",
    },
    {
      id: 3,
      title: "Medical Appointment",
      description: "Need transportation to doctor's appointment at hospital",
      category: "medical",
      priority: "high",
      status: "in-progress",
      date: "2025-04-27",
      time: "11:00",
      location: "24.8607, 67.0011",
      address: "Karachi, Pakistan",
      createdAt: "2025-04-25",
      assignedVolunteer: "Fatima Ali",
      distance: "1.8 km",
    },
    {
      id: 4,
      title: "Companionship Visit",
      description: "Would like someone to visit and chat for a couple of hours",
      category: "companionship",
      priority: "low",
      status: "completed",
      date: "2025-04-26",
      time: "15:00",
      location: "24.8607, 67.0011",
      address: "Karachi, Pakistan",
      createdAt: "2025-04-20",
      assignedVolunteer: "Hassan Ahmed",
      distance: "3.2 km",
      completedAt: "2025-04-26",
      rating: 5,
      review: "Great volunteer, very helpful and friendly!",
    },
  ];

  const mockVolunteers = [
    {
      id: 1,
      name: "Ahmed Khan",
      distance: 2.5,
      rating: 4.8,
      skills: ["Grocery Shopping", "Companionship"],
    },
    {
      id: 2,
      name: "Fatima Ali",
      distance: 1.8,
      rating: 4.9,
      skills: ["Medical Assistance", "Transportation"],
    },
    {
      id: 3,
      name: "Hassan Ahmed",
      distance: 3.2,
      rating: 4.7,
      skills: ["Companionship", "Cleaning"],
    },
  ];

  // Load tasks on mount
  useEffect(() => {
    loadTasks();
  }, []);

  // Apply filters and search
  useEffect(() => {
    applyFiltersAndSearch();
  }, [tasks, filters, searchQuery, activeTab]);

  // Load tasks from API or mock data
  const loadTasks = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/tasks', {
      //   headers: { 'Authorization': `Bearer ${accessToken}` }
      // });
      // const data = await response.json();
      // setTasks(data.tasks);

      // Using mock data for now
      setTasks(mockTasks);
      toast.success("Tasks loaded successfully");
    } catch (error) {
      toast.error("Failed to load tasks");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters and search
  const applyFiltersAndSearch = () => {
    let filtered = [...tasks];

    // Filter by tab
    if (activeTab === "active") {
      filtered = filtered.filter((t) => t.status !== "completed" && t.status !== "cancelled");
    } else if (activeTab === "completed") {
      filtered = filtered.filter((t) => t.status === "completed");
    }

    // Filter by status
    if (filters.status) {
      filtered = filtered.filter((t) => t.status === filters.status);
    }

    // Filter by priority
    if (filters.priority) {
      filtered = filtered.filter((t) => t.priority === filters.priority);
    }

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter((t) => t.category === filters.category);
    }

    // Filter by date range
    if (filters.dateRange) {
      const today = new Date();
      filtered = filtered.filter((t) => {
        const taskDate = new Date(t.date);
        if (filters.dateRange === "today") {
          return taskDate.toDateString() === today.toDateString();
        } else if (filters.dateRange === "week") {
          const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
          return taskDate >= today && taskDate <= weekFromNow;
        } else if (filters.dateRange === "month") {
          const monthFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
          return taskDate >= today && taskDate <= monthFromNow;
        } else if (filters.dateRange === "past") {
          return taskDate < today;
        }
        return true;
      });
    }

    // Search by title and description
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query)
      );
    }

    setFilteredTasks(filtered);
  };

  // Handle create task
  const handleCreateTask = async (formData) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/tasks', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${accessToken}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(formData)
      // });

      const newTask = {
        id: tasks.length + 1,
        ...formData,
        status: "pending",
        createdAt: new Date().toISOString().split("T")[0],
        assignedVolunteer: null,
      };

      setTasks([newTask, ...tasks]);
      setShowTaskForm(false);
      toast.success("✅ Task request has been successfully posted");
    } catch (error) {
      toast.error("Failed to create task");
      console.error(error);
    }
  };

  // Handle view task details
  const handleViewDetails = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      navigate(`/elder-task-detail/${taskId}`, { state: { task } });
    }
  };

  // Handle cancel task
  const handleCancelTask = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task.status === "pending") {
      // Remove immediately if pending
      setTasks(tasks.filter((t) => t.id !== taskId));
      toast.success("Task cancelled successfully");
    } else if (task.status === "assigned") {
      // Show confirmation if assigned
      setCancelConfirmation(taskId);
    }
  };

  // Confirm cancel task
  const confirmCancelTask = (taskId) => {
    setTasks(
      tasks.map((t) =>
        t.id === taskId ? { ...t, status: "cancelled" } : t
      )
    );
    setCancelConfirmation(null);
    toast.success("Task cancelled and volunteer notified");
  };

  // Handle complete task
  const handleCompleteTask = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    setSelectedTask(task);
    setShowRatingModal(true);
  };

  // Handle rating submission
  const handleRatingSubmit = async (ratingData) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/tasks/${ratingData.taskId}/rate`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${accessToken}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(ratingData)
      // });

      setTasks(
        tasks.map((t) =>
          t.id === ratingData.taskId
            ? {
                ...t,
                status: "completed",
                rating: ratingData.rating,
                review: ratingData.review,
                completedAt: new Date().toISOString().split("T")[0],
              }
            : t
        )
      );

      setShowRatingModal(false);
      setSelectedTask(null);
      toast.success("Thank you for your feedback!");
    } catch (error) {
      toast.error("Failed to submit rating");
      console.error(error);
    }
  };

  // Get statistics
  const getStats = () => {
    return {
      total: tasks.length,
      active: tasks.filter((t) => t.status !== "completed" && t.status !== "cancelled")
        .length,
      completed: tasks.filter((t) => t.status === "completed").length,
      pending: tasks.filter((t) => t.status === "pending").length,
    };
  };

  const stats = getStats();

  return (
    <div style={{ backgroundColor: COLORS.lightGray, minHeight: "100vh", paddingBottom: "40px" }}>
      {/* Header */}
      <div style={{ backgroundColor: COLORS.darkGreen, padding: "30px 20px", color: COLORS.white }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <button
            onClick={() => navigate("/elder-dashboard")}
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
            📋 Task Request System
          </h1>
          <p style={{ fontSize: "14px", color: COLORS.veryLightGreen, margin: "0" }}>
            Create, manage, and track your task requests
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "30px 20px" }}>
        {/* Statistics Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "15px",
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
              textAlign: "center",
              borderTop: `4px solid ${COLORS.mediumGreen}`,
            }}
          >
            <div style={{ fontSize: "28px", fontWeight: 700, color: COLORS.darkGreen }}>
              {stats.total}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: COLORS.darkGray,
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Total Tasks
            </div>
          </div>

          {/* Active Tasks */}
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
              {stats.active}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: COLORS.darkGray,
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Active Tasks
            </div>
          </div>

          {/* Pending Tasks */}
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
            <div
              style={{
                fontSize: "12px",
                color: COLORS.darkGray,
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Pending
            </div>
          </div>

          {/* Completed Tasks */}
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
            <div
              style={{
                fontSize: "12px",
                color: COLORS.darkGray,
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Completed
            </div>
          </div>
        </div>

        {/* Create Task Button */}
        {!showTaskForm && (
          <button
            onClick={() => setShowTaskForm(true)}
            style={{
              padding: "15px 30px",
              backgroundColor: COLORS.mediumGreen,
              color: COLORS.white,
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "16px",
              fontFamily: "Montserrat, sans-serif",
              marginBottom: "30px",
              transition: "all 0.3s ease",
              width: "100%",
              maxWidth: "300px",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = COLORS.darkMediumGreen)}
            onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.mediumGreen)}
          >
            ➕ Create New Task Request
          </button>
        )}

        {/* Task Form */}
        {showTaskForm && (
          <div style={{ marginBottom: "30px" }}>
            <TaskForm
              onSubmit={handleCreateTask}
              onCancel={() => setShowTaskForm(false)}
              isEditing={false}
            />
          </div>
        )}

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "20px",
            borderBottom: `2px solid ${COLORS.veryLightGreen}`,
          }}
        >
          {["active", "completed", "all"].map((tab) => (
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
              onMouseEnter={(e) => {
                if (activeTab !== tab) {
                  e.target.style.backgroundColor = COLORS.veryLightGreen;
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab) {
                  e.target.style.backgroundColor = "transparent";
                }
              }}
            >
              {tab === "active" && `Active (${stats.active})`}
              {tab === "completed" && `Completed (${stats.completed})`}
              {tab === "all" && `All (${stats.total})`}
            </button>
          ))}
        </div>

        {/* Search and Filter */}
        <TaskSearch onSearch={setSearchQuery} placeholder="Search tasks by title or description..." />
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
              📭 No tasks found. Create a new task request to get started!
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
              <div key={task.id}>
                <TaskCard
                  task={task}
                  userRole="elder"
                  onViewDetails={handleViewDetails}
                  onCancel={handleCancelTask}
                  onComplete={handleCompleteTask}
                />

                {/* Cancel Confirmation Modal */}
                {cancelConfirmation === task.id && (
                  <div
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 1000,
                    }}
                    onClick={() => setCancelConfirmation(null)}
                  >
                    <div
                      style={{
                        backgroundColor: COLORS.white,
                        borderRadius: "12px",
                        padding: "30px",
                        maxWidth: "400px",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h3
                        style={{
                          color: COLORS.darkGreen,
                          margin: "0 0 15px 0",
                          fontSize: "18px",
                          fontWeight: 700,
                          fontFamily: "Montserrat, sans-serif",
                        }}
                      >
                        Cancel Task?
                      </h3>
                      <p
                        style={{
                          color: COLORS.darkGray,
                          margin: "0 0 20px 0",
                          fontSize: "13px",
                          fontFamily: "Montserrat, sans-serif",
                        }}
                      >
                        A volunteer has already accepted this task. Are you sure you want to cancel?
                      </p>
                      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                        <button
                          onClick={() => setCancelConfirmation(null)}
                          style={{
                            padding: "10px 20px",
                            backgroundColor: COLORS.darkGray,
                            color: COLORS.white,
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: 600,
                            fontSize: "12px",
                            fontFamily: "Montserrat, sans-serif",
                          }}
                        >
                          Keep Task
                        </button>
                        <button
                          onClick={() => confirmCancelTask(task.id)}
                          style={{
                            padding: "10px 20px",
                            backgroundColor: COLORS.red,
                            color: COLORS.white,
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: 600,
                            fontSize: "12px",
                            fontFamily: "Montserrat, sans-serif",
                          }}
                        >
                          Cancel Task
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {selectedTask && (
        <TaskRatingModal
          isOpen={showRatingModal}
          task={selectedTask}
          volunteer={{
            id: 1,
            name: selectedTask.assignedVolunteer || "Volunteer",
          }}
          onSubmit={handleRatingSubmit}
          onClose={() => {
            setShowRatingModal(false);
            setSelectedTask(null);
          }}
        />
      )}
    </div>
  );
};

export default ElderTaskRequest;
