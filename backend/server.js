// ============================================================
// server.js - Main Express Server
// ============================================================
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const { errorHandler } = require("./middleware/errorHandler");

// Import rate limiters and CORS protection
const {
  generalLimiter,
  authLimiter,
  signupLimiter,
  passwordResetLimiter,
  otpVerificationLimiter,
  otpResendLimiter,
  apiEndpointLimiter,
  uploadLimiter,
  oauthLimiter,
} = require("./middleware/rateLimiter");

const {
  corsMiddleware,
  strictCorsMiddleware,
  corsErrorHandler,
  securityHeadersMiddleware,
  requestValidationMiddleware,
  csrfTokenMiddleware,
} = require("./middleware/corsProtection");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to database (async)
connectDB().catch(err => {
  console.error(`❌ Failed to connect to MongoDB: ${err.message}`);
  process.exit(1);
});

// ============================================================
// Security Middleware
// ============================================================

// Helmet - Set security HTTP headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https:"],
      fontSrc: ["'self'", "data:"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
}));

// ============================================================
// Middleware
// ============================================================

// Body parser
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// CORS Protection
app.use(corsMiddleware);

// Security Headers
app.use(securityHeadersMiddleware);

// Request Validation
app.use(requestValidationMiddleware);

// General Rate Limiter (applies to all routes)
app.use(generalLimiter);

// CSRF Token Middleware (applied after route-specific handlers)
app.use(csrfTokenMiddleware);

// ============================================================
// Routes
// ============================================================

// Health check (no rate limiting)
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date(),
  });
});

// ============================================================
// Authentication Routes (with rate limiting)
// ============================================================
const authRouter = require("./routes/auth");

// Apply strict CORS to auth routes
app.use("/api/auth", strictCorsMiddleware);

// Apply specific rate limiters to auth endpoints
app.post("/api/auth/login", authLimiter, authRouter);
app.post("/api/auth/signup", signupLimiter, authRouter);
app.post("/api/auth/forgot-password", passwordResetLimiter, authRouter);
app.post("/api/auth/verify-reset-otp", otpVerificationLimiter, authRouter);
app.post("/api/auth/reset-password", passwordResetLimiter, authRouter);
app.post("/api/auth/resend-reset-otp", otpResendLimiter, authRouter);
app.post("/api/auth/verify-otp", otpVerificationLimiter, authRouter);
app.post("/api/auth/resend-otp", otpResendLimiter, authRouter);
app.post("/api/auth/google", oauthLimiter, authRouter);
app.post("/api/auth/google/callback", oauthLimiter, authRouter);
app.post("/api/auth/facebook", oauthLimiter, authRouter);
app.post("/api/auth/facebook/callback", oauthLimiter, authRouter);

// Other auth routes
app.use("/api/auth", authRouter);

// ============================================================
// API Routes (with rate limiting)
// ============================================================

// Apply API endpoint rate limiter
app.use("/api/", apiEndpointLimiter);

app.use("/api/profile", require("./routes/profile"));
app.use("/api/location", require("./routes/location"));
app.use("/api/users", require("./routes/users"));
app.use("/api/elders", require("./routes/elders"));
app.use("/api/caregivers", require("./routes/caregivers"));
app.use("/api/volunteers", require("./routes/volunteers"));
app.use("/api/sos", require("./routes/sos"));

// File upload routes (with upload rate limiter)
app.post("/api/upload", uploadLimiter, (req, res) => {
  // Upload handler
  res.status(200).json({
    success: true,
    message: "File uploaded successfully",
  });
});

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
// CORS Error Handler
// ============================================================
app.use(corsErrorHandler);

// ============================================================
// Error Handler Middleware
// ============================================================
app.use(errorHandler);

// ============================================================
// Start Server
// ============================================================
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`\n╔════════════════════════════════════════════════════════╗\n║                                                        ║\n║   🚀 Smart Assistant Backend Server                   ║\n║   ✅ Server running on port ${PORT}                          ║\n║   📋 Environment: ${process.env.NODE_ENV || "development"}                      ║\n║   🔗 API URL: http://localhost:${PORT}/api                 ║\n║   🔒 Rate Limiting: ENABLED                           ║\n║   🛡️  CORS Protection: ENABLED                         ║\n║   🔐 Security Headers: ENABLED                         ║\n║                                                        ║\n╚════════════════════════════════════════════════════════╝\n  `);
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
