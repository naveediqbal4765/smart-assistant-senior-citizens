// ============================================================
// components/Header.js - Reusable Header with Logo & Name
// ============================================================

import React from "react";
import RoleSwitcher from "./RoleSwitcher";

// ---- SVG Logo: Green cross with red heart ----
const AppLogo = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="30" y="10" width="40" height="80" rx="8" fill="#52b788" />
    <rect x="10" y="30" width="80" height="40" rx="8" fill="#52b788" />
    <rect x="34" y="14" width="32" height="72" rx="6" fill="#74c69d" />
    <rect x="14" y="34" width="72" height="32" rx="6" fill="#74c69d" />
    <circle cx="50" cy="50" r="18" fill="white" />
    <path
      d="M50 58 C50 58 38 50 38 43 C38 39 41 36 44.5 36 C46.5 36 48.5 37.2 50 39 C51.5 37.2 53.5 36 55.5 36 C59 36 62 39 62 43 C62 50 50 58 50 58Z"
      fill="#e63946"
    />
  </svg>
);

const Header = ({ showBorder = true }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        padding: "16px 24px",
        backgroundColor: "#FFFFFF",
        borderBottom: showBorder ? "1px solid #e0e0e0" : "none",
        boxShadow: showBorder ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
      }}
    >
      {/* Left side: Logo and Title */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <AppLogo size={40} />
        <div>
          <h1
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "20px",
              fontWeight: 700,
              color: "#1C382A",
              margin: "0",
              lineHeight: "1.2",
            }}
          >
            Smart Assistant
          </h1>
          <p
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "12px",
              fontWeight: 500,
              color: "#52b788",
              margin: "2px 0 0 0",
            }}
          >
            Senior Care Platform
          </p>
        </div>
      </div>

      {/* Right side: Role Switcher */}
      <RoleSwitcher />
    </div>
  );
};

export default Header;
