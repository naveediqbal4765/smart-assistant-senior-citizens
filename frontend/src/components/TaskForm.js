import React, { useState, useRef } from "react";
import toast from "react-hot-toast";

// ============================================================
// TaskForm.js - Task Creation/Edit Form Component
// ============================================================
// Comprehensive form for creating and editing tasks with voice-to-text support

const COLORS = {
  darkGreen: "#1C382A",
  mediumGreen: "#52b788",
  darkMediumGreen: "#2d6a4f",
  veryLightGreen: "#BAE4C7",
  white: "#FFFFFF",
  lightGray: "#f5f5f5",
  darkGray: "#666666",
  red: "#e63946",
};

const TaskForm = ({ onSubmit, onCancel, initialData = null, isEditing = false }) => {
  const [formData, setFormData] = useState(
    initialData || {
      title: "",
      description: "",
      category: "groceries",
      priority: "medium",
      date: "",
      time: "",
      location: "",
      address: "",
      notes: "",
    }
  );

  const [isListening, setIsListening] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const recognitionRef = useRef(null);

  // Initialize speech recognition
  const initializeSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition not supported in your browser");
      return null;
    }
    return new SpeechRecognition();
  };

  // Handle voice input for task description
  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      recognitionRef.current = initializeSpeechRecognition();
    }

    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      toast.loading("Listening... Speak now");
    }

    recognitionRef.current.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      setFormData((prev) => ({
        ...prev,
        description: prev.description + " " + transcript,
      }));

      toast.success("Voice input added to description");
    };

    recognitionRef.current.onerror = (event) => {
      toast.error(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };
  };

  // Handle get current location
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData((prev) => ({
          ...prev,
          location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        }));
        toast.success("Location captured successfully");
        setIsGettingLocation(false);
      },
      (error) => {
        toast.error(`Location error: ${error.message}`);
        setIsGettingLocation(false);
      }
    );
  };

  // Handle form input change
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error("Please enter a task title");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Please enter a task description");
      return;
    }

    if (!formData.date) {
      toast.error("Please select a date");
      return;
    }

    if (!formData.location.trim()) {
      toast.error("Please enter a location");
      return;
    }

    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: COLORS.white,
        borderRadius: "12px",
        padding: "30px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h2
        style={{
          color: COLORS.darkGreen,
          margin: "0 0 25px 0",
          fontSize: "22px",
          fontWeight: 700,
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        {isEditing ? "Edit Task" : "Create New Task"}
      </h2>

      {/* Task Title */}
      <div style={{ marginBottom: "20px" }}>
        <label
          style={{
            display: "block",
            fontSize: "13px",
            fontWeight: 600,
            color: COLORS.darkGreen,
            marginBottom: "8px",
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          Task Title *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          placeholder="e.g., Buy groceries, Clean house"
          style={{
            width: "100%",
            padding: "12px",
            border: `2px solid ${COLORS.veryLightGreen}`,
            borderRadius: "8px",
            fontSize: "13px",
            fontFamily: "Montserrat, sans-serif",
            boxSizing: "border-box",
            color: COLORS.darkGreen,
          }}
        />
      </div>

      {/* Task Description */}
      <div style={{ marginBottom: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <label
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: COLORS.darkGreen,
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            Task Description *
          </label>
          <button
            type="button"
            onClick={handleVoiceInput}
            style={{
              padding: "6px 12px",
              backgroundColor: isListening ? COLORS.red : COLORS.mediumGreen,
              color: COLORS.white,
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "11px",
              fontFamily: "Montserrat, sans-serif",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              if (!isListening) e.target.style.backgroundColor = COLORS.darkMediumGreen;
            }}
            onMouseLeave={(e) => {
              if (!isListening) e.target.style.backgroundColor = COLORS.mediumGreen;
            }}
          >
            {isListening ? "🎤 Stop Recording" : "🎤 Voice Input"}
          </button>
        </div>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Describe what help you need..."
          style={{
            width: "100%",
            padding: "12px",
            border: `2px solid ${COLORS.veryLightGreen}`,
            borderRadius: "8px",
            fontSize: "13px",
            fontFamily: "Montserrat, sans-serif",
            boxSizing: "border-box",
            minHeight: "100px",
            resize: "vertical",
            color: COLORS.darkGreen,
          }}
        />
      </div>

      {/* Category and Priority */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "15px",
          marginBottom: "20px",
        }}
      >
        {/* Category */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: 600,
              color: COLORS.darkGreen,
              marginBottom: "8px",
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange("category", e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              border: `2px solid ${COLORS.veryLightGreen}`,
              borderRadius: "8px",
              fontSize: "13px",
              fontFamily: "Montserrat, sans-serif",
              cursor: "pointer",
              backgroundColor: COLORS.white,
              color: COLORS.darkGreen,
            }}
          >
            <option value="groceries">🛒 Groceries</option>
            <option value="housekeeping">🏠 Housekeeping</option>
            <option value="medical">🏥 Medical</option>
            <option value="companionship">👥 Companionship</option>
            <option value="transportation">🚗 Transportation</option>
            <option value="other">📋 Other</option>
          </select>
        </div>

        {/* Priority */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: 600,
              color: COLORS.darkGreen,
              marginBottom: "8px",
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            Priority *
          </label>
          <select
            value={formData.priority}
            onChange={(e) => handleInputChange("priority", e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              border: `2px solid ${COLORS.veryLightGreen}`,
              borderRadius: "8px",
              fontSize: "13px",
              fontFamily: "Montserrat, sans-serif",
              cursor: "pointer",
              backgroundColor: COLORS.white,
              color: COLORS.darkGreen,
            }}
          >
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>
        </div>
      </div>

      {/* Date and Time */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "15px",
          marginBottom: "20px",
        }}
      >
        {/* Date */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: 600,
              color: COLORS.darkGreen,
              marginBottom: "8px",
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            Date *
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange("date", e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              border: `2px solid ${COLORS.veryLightGreen}`,
              borderRadius: "8px",
              fontSize: "13px",
              fontFamily: "Montserrat, sans-serif",
              boxSizing: "border-box",
              color: COLORS.darkGreen,
            }}
          />
        </div>

        {/* Time */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: 600,
              color: COLORS.darkGreen,
              marginBottom: "8px",
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            Time (Optional)
          </label>
          <input
            type="time"
            value={formData.time}
            onChange={(e) => handleInputChange("time", e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              border: `2px solid ${COLORS.veryLightGreen}`,
              borderRadius: "8px",
              fontSize: "13px",
              fontFamily: "Montserrat, sans-serif",
              boxSizing: "border-box",
              color: COLORS.darkGreen,
            }}
          />
        </div>
      </div>

      {/* Location */}
      <div style={{ marginBottom: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <label
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: COLORS.darkGreen,
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            Location *
          </label>
          <button
            type="button"
            onClick={handleGetLocation}
            disabled={isGettingLocation}
            style={{
              padding: "6px 12px",
              backgroundColor: COLORS.mediumGreen,
              color: COLORS.white,
              border: "none",
              borderRadius: "6px",
              cursor: isGettingLocation ? "not-allowed" : "pointer",
              fontWeight: 600,
              fontSize: "11px",
              fontFamily: "Montserrat, sans-serif",
              opacity: isGettingLocation ? 0.7 : 1,
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              if (!isGettingLocation) e.target.style.backgroundColor = COLORS.darkMediumGreen;
            }}
            onMouseLeave={(e) => {
              if (!isGettingLocation) e.target.style.backgroundColor = COLORS.mediumGreen;
            }}
          >
            {isGettingLocation ? "📍 Getting..." : "📍 Use My Location"}
          </button>
        </div>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => handleInputChange("location", e.target.value)}
          placeholder="Enter location or coordinates"
          style={{
            width: "100%",
            padding: "12px",
            border: `2px solid ${COLORS.veryLightGreen}`,
            borderRadius: "8px",
            fontSize: "13px",
            fontFamily: "Montserrat, sans-serif",
            boxSizing: "border-box",
            color: COLORS.darkGreen,
          }}
        />
      </div>

      {/* Address */}
      <div style={{ marginBottom: "20px" }}>
        <label
          style={{
            display: "block",
            fontSize: "13px",
            fontWeight: 600,
            color: COLORS.darkGreen,
            marginBottom: "8px",
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          Address (Optional)
        </label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => handleInputChange("address", e.target.value)}
          placeholder="Enter full address"
          style={{
            width: "100%",
            padding: "12px",
            border: `2px solid ${COLORS.veryLightGreen}`,
            borderRadius: "8px",
            fontSize: "13px",
            fontFamily: "Montserrat, sans-serif",
            boxSizing: "border-box",
            color: COLORS.darkGreen,
          }}
        />
      </div>

      {/* Additional Notes */}
      <div style={{ marginBottom: "25px" }}>
        <label
          style={{
            display: "block",
            fontSize: "13px",
            fontWeight: 600,
            color: COLORS.darkGreen,
            marginBottom: "8px",
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          Additional Notes (Optional)
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => handleInputChange("notes", e.target.value)}
          placeholder="Any additional information..."
          style={{
            width: "100%",
            padding: "12px",
            border: `2px solid ${COLORS.veryLightGreen}`,
            borderRadius: "8px",
            fontSize: "13px",
            fontFamily: "Montserrat, sans-serif",
            boxSizing: "border-box",
            minHeight: "80px",
            resize: "vertical",
            color: COLORS.darkGreen,
          }}
        />
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          justifyContent: "flex-end",
        }}
      >
        {/* Cancel Button */}
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: "12px 24px",
            backgroundColor: COLORS.darkGray,
            color: COLORS.white,
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "13px",
            fontFamily: "Montserrat, sans-serif",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
          onMouseLeave={(e) => (e.target.style.opacity = "1")}
        >
          Cancel
        </button>

        {/* Submit Button */}
        <button
          type="submit"
          style={{
            padding: "12px 24px",
            backgroundColor: COLORS.mediumGreen,
            color: COLORS.white,
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "13px",
            fontFamily: "Montserrat, sans-serif",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = COLORS.darkMediumGreen)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.mediumGreen)}
        >
          {isEditing ? "Update Task" : "Create Task"}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
