import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="page-bg flex items-center justify-center min-h-screen p-4">
      <div className="auth-card w-full max-w-sm text-center">
        <h1 style={{ fontSize: "4rem", fontWeight: 800, color: "#e63946", marginBottom: "16px" }}>
          404
        </h1>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1b4332", marginBottom: "12px" }}>
          Page Not Found
        </h2>
        <p style={{ fontSize: "0.95rem", color: "#6b7280", marginBottom: "24px" }}>
          Sorry, the page you're looking for doesn't exist.
        </p>
        <button onClick={() => navigate("/")} className="btn-primary">
          Go Home
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
