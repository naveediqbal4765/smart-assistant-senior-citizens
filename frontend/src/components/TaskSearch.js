import React, { useState } from "react";

// ============================================================
// TaskSearch.js - Task Search Component
// ============================================================
// Allows users to search tasks by title and description

const COLORS = {
  darkGreen: "#1C382A",
  mediumGreen: "#52b788",
  veryLightGreen: "#BAE4C7",
  white: "#FFFFFF",
  lightGray: "#f5f5f5",
  darkGray: "#666666",
};

const TaskSearch = ({ onSearch, placeholder = "Search tasks..." }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchQuery("");
    onSearch("");
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        marginBottom: "20px",
        alignItems: "center",
      }}
    >
      {/* Search Input */}
      <div
        style={{
          flex: 1,
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}
      >
        <span
          style={{
            position: "absolute",
            left: "12px",
            fontSize: "18px",
            color: COLORS.mediumGreen,
          }}
        >
          🔍
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder={placeholder}
          style={{
            width: "100%",
            padding: "12px 12px 12px 40px",
            border: `2px solid ${COLORS.veryLightGreen}`,
            borderRadius: "8px",
            fontSize: "13px",
            fontFamily: "Montserrat, sans-serif",
            color: COLORS.darkGreen,
            backgroundColor: COLORS.white,
            transition: "all 0.3s ease",
            boxSizing: "border-box",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = COLORS.mediumGreen;
            e.target.style.boxShadow = `0 0 0 3px ${COLORS.veryLightGreen}`;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = COLORS.veryLightGreen;
            e.target.style.boxShadow = "none";
          }}
        />

        {/* Clear Button */}
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            style={{
              position: "absolute",
              right: "12px",
              background: "none",
              border: "none",
              fontSize: "18px",
              cursor: "pointer",
              color: COLORS.darkGray,
              padding: "0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.color = COLORS.mediumGreen)}
            onMouseLeave={(e) => (e.target.style.color = COLORS.darkGray)}
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Search Info */}
      {searchQuery && (
        <span
          style={{
            fontSize: "12px",
            color: COLORS.darkGray,
            fontFamily: "Montserrat, sans-serif",
            whiteSpace: "nowrap",
          }}
        >
          Searching for: <strong>"{searchQuery}"</strong>
        </span>
      )}
    </div>
  );
};

export default TaskSearch;
