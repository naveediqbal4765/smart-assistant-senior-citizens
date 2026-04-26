// ============================================================
// server.js - Main Express Server
// ============================================================
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const { errorHandler } = require("./middleware/errorHandler");

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize Express app
const app = express();

// ============================================================
// Middleware
// ============================================================

// Body parser
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);

// ============================================================
// Routes
// ============================================================

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date(),
  });
});

// API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/elders", require("./routes/elders"));
app.use("/api/caregivers", require("./routes/caregivers"));
app.use("/api/volunteers", require("./routes/volunteers"));
app.use("/api/sos", require("./routes/sos"));

// ============================================================
// 404 Handler
// ============================================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ============================================================
// Error Handler Middleware
// ============================================================
app.use(errorHandler);

// ============================================================
// Start Server
// ============================================================
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 Smart Assistant Backend Server                       ║
║   ✅ Server running on port ${PORT}                          ║
║   📍 Environment: ${process.env.NODE_ENV || "development"}                      ║
║   🔗 API URL: http://localhost:${PORT}/api                 ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

// ============================================================
// Handle Unhandled Promise Rejections
// ============================================================
process.on("unhandledRejection", (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

// ============================================================
// Handle Uncaught Exceptions
// ============================================================
process.on("uncaughtException", (err) => {
  console.error(`❌ Uncaught Exception: ${err.message}`);
  process.exit(1);
});

module.exports = app;
