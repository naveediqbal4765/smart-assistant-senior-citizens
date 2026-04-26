import React from "react";

const COLORS = {
  mediumGreen: "#52b788",
  darkMediumGreen: "#2d6a4f",
};

const SaveButton = ({ isLoading, onSave }) => {
  return (
    <div style={{ marginTop: "30px", paddingTop: "20px", borderTop: "2px solid #BAE4C7" }}>
      <button
        onClick={onSave}
        disabled={isLoading}
        style={{
          padding: "14px 32px",
          backgroundColor: COLORS.mediumGreen,
          color: "#FFFFFF",
          border: "none",
          borderRadius: "8px",
          cursor: isLoading ? "not-allowed" : "pointer",
          fontWeight: 600,
          fontSize: "14px",
          fontFamily: "Montserrat, sans-serif",
          transition: "all 0.3s ease",
          opacity: isLoading ? 0.7 : 1,
        }}
        onMouseEnter={(e) => !isLoading && (e.target.style.backgroundColor = COLORS.darkMediumGreen)}
        onMouseLeave={(e) => !isLoading && (e.target.style.backgroundColor = COLORS.mediumGreen)}
      >
        {isLoading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
};

export default SaveButton;
