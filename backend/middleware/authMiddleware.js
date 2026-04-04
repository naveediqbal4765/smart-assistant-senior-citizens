// ============================================================
// middleware/authMiddleware.js - JWT Authentication Middleware
// Protects routes by verifying JWT tokens in request headers
// ============================================================

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ============================================================
// protect - Middleware to verify JWT and attach user to request
// Usage: router.get("/protected", protect, controller)
// ============================================================
const protect = async (req, res, next) => {
  let token;

  // Check for Bearer token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1]; // Extract token after "Bearer "
  }

  // If no token found, deny access
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No authentication token provided.",
    });
  }

  try {
    // Verify the token using the JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user from the decoded token payload
    const user = await User.findById(decoded.id).select("-password -otp -otpExpiry");

    // Check if user still exists (might have been deleted)
    if (!user || user.isDeleted) {
      return res.status(401).json({
        success: false,
        message: "The user belonging to this token no longer exists.",
      });
    }

    // Check if user account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Your account has been deactivated. Please contact support.",
      });
    }

    // Check if password was changed after the token was issued
    if (user.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        success: false,
        message: "Password was recently changed. Please log in again.",
      });
    }

    // Attach user to request object for use in controllers
    req.user = user;
    next(); // Proceed to the next middleware/controller
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please log in again.",
      });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired. Please log in again.",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Authentication error. Please try again.",
    });
  }
};

// ============================================================
// authorize - Middleware to restrict access by role
// Usage: router.get("/elder-only", protect, authorize("elder"), controller)
// ============================================================
const authorize = (...roles) => {
  return (req, res, next) => {
    // Check if the authenticated user's role is in the allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. This route is restricted to: ${roles.join(", ")}`,
      });
    }
    next(); // Role is authorized, proceed
  };
};

module.exports = { protect, authorize };
