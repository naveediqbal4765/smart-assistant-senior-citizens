// ============================================================
// config/db.js - MongoDB Atlas Connection Configuration
// Uses Mongoose to connect to the MongoDB Atlas cluster
// ============================================================

const mongoose = require("mongoose");

// connectDB - Async function to establish MongoDB connection
const connectDB = async () => {
  try {
    // Connect to MongoDB Atlas using the URI from environment variables
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // These options ensure stable connection behavior
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if no server found
      socketTimeoutMS: 45000,         // Close sockets after 45 seconds of inactivity
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);

    // Handle connection events for monitoring
    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️  MongoDB disconnected. Attempting to reconnect...");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("✅ MongoDB reconnected successfully");
    });

    return conn;
  } catch (error) {
    // Log the error and exit the process if DB connection fails
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit with failure code
  }
};

module.exports = connectDB;
