// ============================================================
// sockets/socketHandler.js - Socket.io Real-time Event Handler
// Manages: SOS broadcasting, live chat, volunteer notifications
// ============================================================

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ============================================================
// socketHandler - Main Socket.io event manager
// @param {Object} io - Socket.io server instance
// ============================================================
const socketHandler = (io) => {

  // ---- Socket Authentication Middleware ----
  // Verify JWT token before allowing socket connection
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token; // Token sent from frontend

      if (!token) {
        return next(new Error("Authentication token required"));
      }

      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      if (!user || user.isDeleted) {
        return next(new Error("User not found"));
      }

      socket.user = user; // Attach user to socket for use in events
      next(); // Allow connection
    } catch (error) {
      next(new Error("Invalid authentication token"));
    }
  });

  // ---- Connection Handler ----
  io.on("connection", (socket) => {
    console.log(`🔌 User connected: ${socket.user.fullName} (${socket.user.role}) - Socket: ${socket.id}`);

    // Join user to their personal room (for targeted notifications)
    socket.join(`user:${socket.user._id}`);

    // Join role-based room (for broadcasting to all elders/caregivers/volunteers)
    socket.join(`role:${socket.user.role}`);

    // ============================================================
    // SOS EMERGENCY BROADCASTING
    // Elder triggers SOS → broadcasts to all linked caregivers and nearby volunteers
    // ============================================================
    socket.on("sos:trigger", async (data) => {
      try {
        const { location, message } = data;
        const elder = socket.user;

        console.log(`🚨 SOS triggered by: ${elder.fullName}`);

        // Broadcast SOS to all caregivers linked to this elder
        if (elder.caregiverData?.linkedElderId) {
          io.to(`user:${elder.caregiverData.linkedElderId}`).emit("sos:received", {
            elderId: elder._id,
            elderName: elder.fullName,
            location: location || elder.location,
            message: message || "Emergency! Please help!",
            timestamp: new Date().toISOString(),
          });
        }

        // TODO: Broadcast to nearby volunteers based on geolocation
        // This will be implemented in the Emergency & Safety module

        // Acknowledge SOS was sent
        socket.emit("sos:acknowledged", {
          success: true,
          message: "SOS sent to your emergency contacts",
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error("SOS Error:", error);
        socket.emit("sos:error", { message: "Failed to send SOS" });
      }
    });

    // ============================================================
    // LIVE LOCATION SHARING
    // Elder shares real-time location with caregiver
    // ============================================================
    socket.on("location:update", async (data) => {
      try {
        const { lat, lng } = data;

        // Update user location in database
        await User.findByIdAndUpdate(socket.user._id, {
          location: {
            type: "Point",
            coordinates: [lng, lat], // MongoDB uses [longitude, latitude]
          },
        });

        // Broadcast location to linked caregiver
        if (socket.user.role === "elder") {
          // TODO: Find linked caregiver and emit location
          // io.to(`user:${caregiverId}`).emit("location:elderUpdate", { lat, lng });
        }
      } catch (error) {
        console.error("Location Update Error:", error);
      }
    });

    // ============================================================
    // LIVE CHAT MESSAGING
    // Real-time messaging between elder, caregiver, and volunteer
    // ============================================================
    socket.on("chat:message", async (data) => {
      try {
        const { recipientId, message, messageType } = data;

        // Emit message to recipient's personal room
        io.to(`user:${recipientId}`).emit("chat:newMessage", {
          senderId: socket.user._id,
          senderName: socket.user.fullName,
          senderRole: socket.user.role,
          message,
          messageType: messageType || "text", // text, image, voice
          timestamp: new Date().toISOString(),
        });

        // TODO: Save message to database (Communication module)
      } catch (error) {
        console.error("Chat Message Error:", error);
      }
    });

    // ============================================================
    // VOLUNTEER AVAILABILITY TOGGLE
    // Volunteer goes online/offline for task matching
    // ============================================================
    socket.on("volunteer:toggleAvailability", async (data) => {
      try {
        const { isLive } = data;

        // Update volunteer availability in database
        await User.findByIdAndUpdate(socket.user._id, {
          "volunteerData.isLive": isLive,
        });

        // Notify the volunteer of status change
        socket.emit("volunteer:availabilityUpdated", {
          isLive,
          message: isLive ? "You are now available for tasks" : "You are now offline",
        });

        console.log(`👤 Volunteer ${socket.user.fullName} is now ${isLive ? "ONLINE" : "OFFLINE"}`);
      } catch (error) {
        console.error("Volunteer Availability Error:", error);
      }
    });

    // ============================================================
    // DISCONNECT HANDLER
    // ============================================================
    socket.on("disconnect", (reason) => {
      console.log(`🔌 User disconnected: ${socket.user.fullName} - Reason: ${reason}`);

      // If volunteer disconnects, mark them as offline
      if (socket.user.role === "volunteer") {
        User.findByIdAndUpdate(socket.user._id, {
          "volunteerData.isLive": false,
        }).catch(console.error);
      }
    });
  });
};

module.exports = socketHandler;
