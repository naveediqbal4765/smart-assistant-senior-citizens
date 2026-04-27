import React, { useState } from "react";

// ============================================================
// TaskFilter.js - Task Filtering Component
// ============================================================
// Allows users to filter tasks by status, priority, date, and category

const COLORS = {
  darkGreen: "#1C382A",
  mediumGreen: "#52b788",
  darkMediumGreen: "#2d6a4f",
  veryLightGreen: "#BAE4C7",
  white: "#FFFFFF",
  lightGray: "#f5f5f5",
  darkGray: "#666666",
};

const TaskFilter = ({ onFilterChange, onReset }) => {
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    category: "",
    dateRange: "",
  });

  // Handle filter change
  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Handle reset
  const handleReset = () => {
    setFilters({
      status: "",
      priority: "",
      category: "",
      dateRange: "",
    });
    onReset();
  };

  return (
    <div
      style={{
        backgroundColor: COLORS.veryLightGreen,
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "20px",
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
        🔍 Filter Tasks
      </h3>

      {/* Filter Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "15px",
          marginBottom: "15px",
        }}
      >
        {/* Status Filter */}
        <div>
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
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              border: `2px solid ${COLORS.mediumGreen}`,
              borderRadius: "8px",
              fontSize: "13px",
              fontFamily: "Montserrat, sans-serif",
              cursor: "pointer",
              backgroundColor: COLORS.white,
              color: COLORS.darkGreen,
            }}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="assigned">Assigned</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
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
            Priority
          </label>
          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange("priority", e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              border: `2px solid ${COLORS.mediumGreen}`,
              borderRadius: "8px",
              fontSize: "13px",
              fontFamily: "Montserrat, sans-serif",
              cursor: "pointer",
              backgroundColor: COLORS.white,
              color: COLORS.darkGreen,
            }}
          >
            <option value="">All Priorities</option>
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
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
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              border: `2px solid ${COLORS.mediumGreen}`,
              borderRadius: "8px",
              fontSize: "13px",
              fontFamily: "Montserrat, sans-serif",
              cursor: "pointer",
              backgroundColor: COLORS.white,
              color: COLORS.darkGreen,
            }}
          >
            <option value="">All Categories</option>
            <option value="groceries">🛒 Groceries</option>
            <option value="housekeeping">🏠 Housekeeping</option>
            <option value="medical">🏥 Medical</option>
            <option value="companionship">👥 Companionship</option>
            <option value="transportation">🚗 Transportation</option>
            <option value="other">📋 Other</option>
          </select>
        </div>

        {/* Date Range Filter */}
        <div>
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
            Date Range
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange("dateRange", e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              border: `2px solid ${COLORS.mediumGreen}`,
              borderRadius: "8px",
              fontSize: "13px",
              fontFamily: "Montserrat, sans-serif",
              cursor: "pointer",
              backgroundColor: COLORS.white,
              color: COLORS.darkGreen,
            }}
          >
            <option value="">All Dates</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="past">Past Tasks</option>
          </select>
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={handleReset}
        style={{
          padding: "10px 20px",
          backgroundColor: COLORS.darkGray,
          color: COLORS.white,
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: 600,
          fontSize: "13px",
          fontFamily: "Montserrat, sans-serif",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
        onMouseLeave={(e) => (e.target.style.opacity = "1")}
      >
        Reset Filters
      </button>
    </div>
  );
};

export default TaskFilter;
