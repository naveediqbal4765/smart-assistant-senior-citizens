// ============================================================
// config/database.js - MongoDB Connection
// ============================================================

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    console.log('🔗 Connecting to MongoDB...');
    console.log('📍 Connection String:', mongoUri.replace(/:[^:]*@/, ':****@')); // Hide password

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority',
      dbName: 'smartassistant', // Explicitly set database name
    });

    const dbName = conn.connection.name;
    const expectedDb = 'smartassistant';

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${dbName}`);

    // Verify we're connected to the correct database
    if (dbName !== expectedDb) {
      console.warn(`⚠️  WARNING: Connected to '${dbName}' but expected '${expectedDb}'`);
      console.warn('📝 Make sure your MONGODB_URI includes the database name: /smartassistant');
    } else {
      console.log(`✅ Connected to correct database: ${expectedDb}`);
    }

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️  MongoDB disconnected. Attempting to reconnect...");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("✅ MongoDB reconnected successfully");
    });

    return conn;
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
