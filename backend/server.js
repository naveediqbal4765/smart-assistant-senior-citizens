// ============================================================
// server.js - Main Entry Point for Smart Assistant Backend
// Initializes Express, Socket.io, MongoDB, and all middleware
// ============================================================

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");

// Load environment variables from .env file
dotenv.config();

// Import database connection
const connectDB = require("./config/db");

// Import route files
const authRoutes = require("./routes/authRoutes");

// Import socket handler
const socketHandler = require("./sockets/socketHandler");

// Initialize Express app
const app = express();

// Create HTTP server (required for Socket.io)
const server = http.createServer(app);

// Initialize Socket.io with CORS settings
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000", // Allow frontend origin
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ============================================================
// MIDDLEWARE SETUP
// ============================================================

// Security headers (helmet protects against common vulnerabilities)
app.use(helmet());

// Enable CORS for frontend requests
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true, // Allow cookies/auth headers
  })
);

// Parse incoming JSON request bodies
app.use(express.json({ limit: "10mb" }));

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// HTTP request logger (only in development)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ============================================================
// RATE LIMITING - Prevent brute force attacks on auth routes
// ============================================================
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 20, // Max 20 requests per window per IP
  message: {
    success: false,
    message: "Too many requests from this IP. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiter specifically to auth routes
app.use("/api/auth", authLimiter);

// ============================================================
// API ROUTES
// ============================================================

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Smart Assistant API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Authentication routes (login, signup, OTP, OAuth)
app.use("/api/auth", authRoutes);

// TODO: Add more module routes as they are developed
// app.use("/api/users", userRoutes);         // Module 2: User Profile
// app.use("/api/tasks", taskRoutes);         // Module 3: Task Request
// app.use("/api/communication", commRoutes); // Module 4: Communication
// app.use("/api/health", healthRoutes);      // Module 5: Health & Medication
// app.use("/api/wellness", wellnessRoutes);  // Module 6: Wellness & Rehab
// app.use("/api/emergency", emergencyRoutes);// Module 7: Emergency & Safety
// app.use("/api/social", socialRoutes);      // Module 8: Social Circle
// app.use("/api/rewards", rewardRoutes);     // Module 9: Volunteer Rewards
// app.use("/api/travel", travelRoutes);      // Module 10: Smart Travel
// app.use("/api/adaptive", adaptiveRoutes);  // Module 11: Adaptive Assistance
// app.use("/api/guide", guideRoutes);        // Module 12: Emergency Guide

// ============================================================
// 404 HANDLER - Catch undefined routes
// ============================================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ============================================================
// GLOBAL ERROR HANDLER - Catch all unhandled errors
// ============================================================
app.use((err, req, res, next) => {
  console.error("Global Error:", err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    // Only show stack trace in development
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// ============================================================
// SOCKET.IO - Real-time event handling
// ============================================================
socketHandler(io); // Delegate all socket events to socketHandler

// ============================================================
// START SERVER
// ============================================================
const PORT = process.env.PORT || 5000;

// Connect to MongoDB first, then start the server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`\n🚀 Smart Assistant Server running on port ${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV}`);
    console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
    console.log(`💡 Health Check: http://localhost:${PORT}/api/health\n`);
  });
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err.message);
  server.close(() => process.exit(1)); // Gracefully shut down
});
