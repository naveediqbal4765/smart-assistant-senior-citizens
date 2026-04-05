// ============================================================
// components/Footer.js - Footer Component
// ============================================================

import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: "#1C382A",
        color: "#FFFFFF",
        padding: "24px 20px",
        textAlign: "center",
        fontFamily: "Montserrat, sans-serif",
        borderTop: "2px solid #52b788",
        marginTop: "auto",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          alignItems: "center",
        }}
      >
        {/* Copyright */}
        <p
          style={{
            margin: "0",
            fontSize: "14px",
            fontWeight: 600,
            color: "#BAE4C7",
          }}
        >
          © {currentYear} Smart Assistant for Senior Citizens
        </p>

        {/* Divider */}
        <div
          style={{
            width: "40px",
            height: "2px",
            backgroundColor: "#52b788",
          }}
        />

        {/* Credits and Contact */}
        <p
          style={{
            margin: "0",
            fontSize: "13px",
            color: "#A9C6B2",
            lineHeight: "1.6",
          }}
        >
          Designed by Team SZABIST | Contact: +923399934981
        </p>

        {/* Additional Info */}
        <p
          style={{
            margin: "8px 0 0 0",
            fontSize: "11px",
            color: "#74c69d",
            opacity: 0.8,
          }}
        >
          Empowering Senior Citizens Through Technology
        </p>
      </div>
    </footer>
  );
};

export default Footer;
