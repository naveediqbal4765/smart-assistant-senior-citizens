// ============================================================
// components/ToastNotification.js - Toast Notification Component
// ============================================================

import React, { useEffect, useState } from "react";
import "../styles/ToastNotification.css";

/**
 * Toast Notification Component
 * Displays temporary notifications at the top of the screen
 * 
 * @param {string} message - Notification message
 * @param {string} type - Type: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Duration in milliseconds (default: 3000)
 * @param {function} onClose - Callback when toast closes
 */
const ToastNotification = ({ message, type = "info", duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!message) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);

    // Auto-close after duration
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        onClose();
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!isVisible || !message) {
    return null;
  }

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        <span className="toast-icon">
          {type === "success" && "Check"}
          {type === "error" && "Cross"}
          {type === "warning" && "Warning"}
          {type === "info" && "Info"}
        </span>
        <span className="toast-message">{message}</span>
      </div>
      <button
        className="toast-close"
        onClick={() => {
          setIsVisible(false);
          if (onClose) {
            onClose();
          }
        }}
      >
        
      </button>
    </div>
  );
};

export default ToastNotification;
