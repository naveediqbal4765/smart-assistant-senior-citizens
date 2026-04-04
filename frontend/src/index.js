// ============================================================
// src/index.js - React Application Entry Point
// Renders the root App component into the DOM
// ============================================================

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // Global styles including Tailwind CSS
import App from "./App";

// Create root and render the App component
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    {/* StrictMode helps detect potential problems in development */}
    <App />
  </React.StrictMode>
);
