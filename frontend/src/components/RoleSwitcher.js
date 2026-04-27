import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const COLORS = {
  darkGreen: "#1C382A",
  mediumGreen: "#52b788",
  veryLightGreen: "#BAE4C7",
  white: "#FFFFFF",
  lightGray: "#f5f5f5",
  darkGray: "#666666",
};

const RoleSwitcher = () => {
  const { user, updateUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const roles = [
    { id: "elder", label: "👴 Elder", color: "#52b788" },
    { id: "caregiver", label: "💚 Caregiver", color: "#2d6a4f" },
    { id: "volunteer", label: "🤝 Volunteer", color: "#1b4332" },
  ];

  const handleRoleSwitch = (newRole) => {
    if (newRole === user?.role) {
      setIsOpen(false);
      return;
    }

    // Update user role in context
    updateUser({ role: newRole });

    // Store in localStorage
    const updatedUser = { ...user, role: newRole };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    sessionStorage.setItem("user", JSON.stringify(updatedUser));

    toast.success(`Switched to ${roles.find(r => r.id === newRole)?.label}`);
    setIsOpen(false);
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Role Switcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: "8px 16px",
          backgroundColor: COLORS.mediumGreen,
          color: COLORS.white,
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: 600,
          fontSize: "12px",
          fontFamily: "Montserrat, sans-serif",
          transition: "all 0.3s ease",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#2d6a4f")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.mediumGreen)}
      >
        {roles.find(r => r.id === user?.role)?.label || "Switch Role"}
        <span style={{ fontSize: "10px" }}>▼</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: "0",
            marginTop: "8px",
            backgroundColor: COLORS.white,
            border: `2px solid ${COLORS.mediumGreen}`,
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 1000,
            minWidth: "180px",
            overflow: "hidden",
          }}
        >
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => handleRoleSwitch(role.id)}
              style={{
                width: "100%",
                padding: "12px 16px",
                backgroundColor: user?.role === role.id ? role.color : "transparent",
                color: user?.role === role.id ? COLORS.white : COLORS.darkGreen,
                border: "none",
                borderBottom: `1px solid ${COLORS.veryLightGreen}`,
                textAlign: "left",
                cursor: "pointer",
                fontWeight: user?.role === role.id ? 600 : 500,
                fontSize: "13px",
                fontFamily: "Montserrat, sans-serif",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (user?.role !== role.id) {
                  e.target.style.backgroundColor = COLORS.lightGray;
                }
              }}
              onMouseLeave={(e) => {
                if (user?.role !== role.id) {
                  e.target.style.backgroundColor = "transparent";
                }
              }}
            >
              {role.label}
              {user?.role === role.id && " ✓"}
            </button>
          ))}
        </div>
      )}

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
          }}
        />
      )}
    </div>
  );
};

export default RoleSwitcher;
