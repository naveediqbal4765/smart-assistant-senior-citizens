import React from "react";

const COLORS = {
  darkGreen: "#1C382A",
  mediumGreen: "#52b788",
  veryLightGreen: "#BAE4C7",
  red: "#e63946",
};

const DeleteAccount = () => {
  return (
    <div>
      <h2 style={{ fontSize: "20px", fontWeight: 700, color: COLORS.red, marginBottom: "25px" }}>
        ⚠️ Delete Account
      </h2>
      <div style={{
        backgroundColor: "#ffe0e0",
        border: `2px solid ${COLORS.red}`,
        borderRadius: "8px",
        padding: "20px",
        color: COLORS.red,
      }}>
        <p style={{ fontWeight: 600, marginBottom: "10px" }}>
          This action cannot be undone. All your data will be permanently deleted.
        </p>
        <button style={{
          padding: "10px 20px",
          backgroundColor: COLORS.red,
          color: "#FFFFFF",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: 600,
          fontSize: "13px",
        }}>
          Delete My Account
        </button>
      </div>
    </div>
  );
};

export default DeleteAccount;
