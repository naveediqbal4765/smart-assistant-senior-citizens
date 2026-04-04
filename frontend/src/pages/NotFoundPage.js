// ============================================================
// pages/NotFoundPage.js - 404 Not Found Page
// ============================================================

import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <div className="min-h-screen bg-auth flex items-center justify-center p-4">
    <div className="text-center text-white">
      <div className="text-8xl mb-6">🔍</div>
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-neutral-300 text-senior-base mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/login" className="btn-primary inline-block max-w-xs">
        Go Back to Login
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
