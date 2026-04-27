import React, { useState } from "react";
import toast from "react-hot-toast";

// ============================================================
// TaskRatingModal.js - Task Rating and Review Modal Component
// ============================================================
// Modal for rating and reviewing completed tasks

const COLORS = {
  darkGreen: "#1C382A",
  mediumGreen: "#52b788",
  darkMediumGreen: "#2d6a4f",
  veryLightGreen: "#BAE4C7",
  white: "#FFFFFF",
  lightGray: "#f5f5f5",
  darkGray: "#666666",
  yellow: "#FFC107",
};

const TaskRatingModal = ({ isOpen, task, volunteer, onSubmit, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle rating submission
  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        taskId: task.id,
        volunteerId: volunteer.id,
        rating: rating,
        review: review,
      });
      toast.success("Thank you for your feedback!");
      handleClose();
    } catch (error) {
      toast.error(error.message || "Failed to submit rating");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle close
  const handleClose = () => {
    setRating(0);
    setReview("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={handleClose}
    >
      {/* Modal Content */}
      <div
        style={{
          backgroundColor: COLORS.white,
          borderRadius: "12px",
          padding: "30px",
          maxWidth: "500px",
          width: "90%",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              color: COLORS.darkGreen,
              margin: "0",
              fontSize: "20px",
              fontWeight: 700,
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            Rate This Task
          </h2>
          <button
            onClick={handleClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              color: COLORS.darkGray,
            }}
          >
            ✕
          </button>
        </div>

        {/* Task Info */}
        <div
          style={{
            backgroundColor: COLORS.veryLightGreen,
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "20px",
          }}
        >
          <h4
            style={{
              color: COLORS.darkGreen,
              margin: "0 0 8px 0",
              fontSize: "14px",
              fontWeight: 600,
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            {task.title}
          </h4>
          <p
            style={{
              color: COLORS.darkGray,
              margin: "0 0 8px 0",
              fontSize: "12px",
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            <strong>Volunteer:</strong> {volunteer.name}
          </p>
          <p
            style={{
              color: COLORS.darkGray,
              margin: "0",
              fontSize: "12px",
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            <strong>Completed:</strong> {task.completedDate}
          </p>
        </div>

        {/* Star Rating */}
        <div style={{ marginBottom: "25px", textAlign: "center" }}>
          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: 600,
              color: COLORS.darkGreen,
              marginBottom: "15px",
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            How would you rate this volunteer? *
          </label>

          {/* Star Display */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              marginBottom: "10px",
            }}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "40px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  opacity: star <= (hoverRating || rating) ? 1 : 0.3,
                  transform: star <= (hoverRating || rating) ? "scale(1.1)" : "scale(1)",
                }}
              >
                ⭐
              </button>
            ))}
          </div>

          {/* Rating Text */}
          {rating > 0 && (
            <p
              style={{
                color: COLORS.mediumGreen,
                margin: "0",
                fontSize: "13px",
                fontWeight: 600,
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent"}
            </p>
          )}
        </div>

        {/* Review Text */}
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
            Write a Review (Optional)
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your experience with this volunteer..."
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
          <p
            style={{
              fontSize: "11px",
              color: COLORS.darkGray,
              margin: "5px 0 0 0",
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            {review.length}/500 characters
          </p>
        </div>

        {/* Benefits Info */}
        <div
          style={{
            backgroundColor: COLORS.lightGray,
            borderRadius: "8px",
            padding: "12px",
            marginBottom: "20px",
            fontSize: "12px",
            color: COLORS.darkGray,
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          <p style={{ margin: "0 0 8px 0", fontWeight: 600 }}>
            💡 Your feedback helps:
          </p>
          <ul style={{ margin: "0", paddingLeft: "20px" }}>
            <li>Improve volunteer quality</li>
            <li>Build volunteer reputation</li>
            <li>Help other elders choose volunteers</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "flex-end",
          }}
        >
          {/* Cancel Button */}
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            style={{
              padding: "10px 20px",
              backgroundColor: COLORS.darkGray,
              color: COLORS.white,
              border: "none",
              borderRadius: "8px",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              fontWeight: 600,
              fontSize: "12px",
              fontFamily: "Montserrat, sans-serif",
              opacity: isSubmitting ? 0.7 : 1,
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) e.target.style.opacity = "0.8";
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) e.target.style.opacity = "1";
            }}
          >
            Skip
          </button>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
            style={{
              padding: "10px 20px",
              backgroundColor: COLORS.mediumGreen,
              color: COLORS.white,
              border: "none",
              borderRadius: "8px",
              cursor: isSubmitting || rating === 0 ? "not-allowed" : "pointer",
              fontWeight: 600,
              fontSize: "12px",
              fontFamily: "Montserrat, sans-serif",
              opacity: isSubmitting || rating === 0 ? 0.7 : 1,
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting && rating > 0) {
                e.target.style.backgroundColor = COLORS.darkMediumGreen;
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting && rating > 0) {
                e.target.style.backgroundColor = COLORS.mediumGreen;
              }
            }}
          >
            {isSubmitting ? "Submitting..." : "Submit Rating"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskRatingModal;
