import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

// ============================================================
// VolunteerProfilePage.js - Volunteer Profile Display Page
// ============================================================
// Shows volunteer's profile with details, skills, and messaging option

const COLORS = {
  darkGreen: "#1C382A",
  mediumGreen: "#52b788",
  darkMediumGreen: "#2d6a4f",
  veryLightGreen: "#BAE4C7",
  white: "#FFFFFF",
  lightGray: "#f5f5f5",
  darkGray: "#666666",
  red: "#e63946",
  yellow: "#FFC107",
};

const VolunteerProfilePage = () => {
  const navigate = useNavigate();
  const { volunteerId } = useParams();
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Mock volunteer data - Replace with API call
  const mockVolunteer = {
    id: 1,
    name: "Ahmed Khan",
    profilePicture: "https://via.placeholder.com/150",
    rating: 4.8,
    reviews: 24,
    completedTasks: 45,
    skills: ["Grocery Shopping", "Companionship", "Cleaning", "Transportation"],
    bio: "Friendly and reliable volunteer with 2 years of experience helping seniors in the community.",
    joinDate: "2023-01-15",
    responseTime: "Usually responds within 2 hours",
    languages: ["Urdu", "English"],
    recentReviews: [
      {
        id: 1,
        elder: "Fatima Ahmed",
        rating: 5,
        comment: "Very helpful and punctual. Highly recommended!",
        date: "2025-04-20",
      },
      {
        id: 2,
        elder: "Hassan Ali",
        rating: 5,
        comment: "Great person, very caring and attentive.",
        date: "2025-04-15",
      },
      {
        id: 3,
        elder: "Aisha Hassan",
        rating: 4,
        comment: "Good service, very professional.",
        date: "2025-04-10",
      },
    ],
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setIsSending(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/messages`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${accessToken}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     volunteerId: mockVolunteer.id,
      //     message: message
      //   })
      // });

      toast.success("Message sent successfully!");
      setMessage("");
      setShowMessageModal(false);
    } catch (error) {
      toast.error("Failed to send message");
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div style={{ backgroundColor: COLORS.lightGray, minHeight: "100vh", paddingBottom: "40px" }}>
      {/* Header */}
      <div style={{ backgroundColor: COLORS.darkGreen, padding: "30px 20px", color: COLORS.white }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "none",
              border: "none",
              color: COLORS.white,
              cursor: "pointer",
              fontSize: "16px",
              marginBottom: "15px",
              fontWeight: 400,
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            Back
          </button>
          <h1 style={{ fontSize: "32px", fontWeight: 700, margin: "0 0 8px 0" }}>
            Volunteer Profile
          </h1>
          <p style={{ fontSize: "14px", color: COLORS.veryLightGreen, margin: "0" }}>
            View volunteer details and send a message
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "30px 20px" }}>
        {/* Profile Card */}
        <div
          style={{
            backgroundColor: COLORS.white,
            borderRadius: "12px",
            padding: "30px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            marginBottom: "30px",
          }}
        >
          {/* Profile Header */}
          <div
            style={{
              display: "flex",
              gap: "30px",
              marginBottom: "30px",
              flexWrap: "wrap",
              alignItems: "start",
            }}
          >
            {/* Profile Picture */}
            <div>
              <img
                src={mockVolunteer.profilePicture}
                alt={mockVolunteer.name}
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "12px",
                  objectFit: "cover",
                  border: `4px solid ${COLORS.mediumGreen}`,
                }}
              />
            </div>

            {/* Profile Info */}
            <div style={{ flex: 1, minWidth: "250px" }}>
              <h2
                style={{
                  color: COLORS.darkGreen,
                  margin: "0 0 10px 0",
                  fontSize: "28px",
                  fontWeight: 700,
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                {mockVolunteer.name}
              </h2>

              {/* Rating */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "15px",
                }}
              >
                <span style={{ fontSize: "20px" }}>
                  {"⭐".repeat(Math.floor(mockVolunteer.rating))}
                </span>
                <span
                  style={{
                    color: COLORS.darkGray,
                    fontSize: "14px",
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 600,
                  }}
                >
                  {mockVolunteer.rating} ({mockVolunteer.reviews} reviews)
                </span>
              </div>

              {/* Bio */}
              <p
                style={{
                  color: COLORS.darkGray,
                  margin: "0 0 15px 0",
                  fontSize: "13px",
                  fontFamily: "Montserrat, sans-serif",
                  lineHeight: "1.6",
                }}
              >
                {mockVolunteer.bio}
              </p>

              {/* Stats */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "15px",
                  marginBottom: "15px",
                }}
              >
                <div
                  style={{
                    backgroundColor: COLORS.veryLightGreen,
                    borderRadius: "8px",
                    padding: "12px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "20px",
                      fontWeight: 700,
                      color: COLORS.darkGreen,
                    }}
                  >
                    {mockVolunteer.completedTasks}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: COLORS.darkGray,
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    Tasks Completed
                  </div>
                </div>
                <div
                  style={{
                    backgroundColor: COLORS.veryLightGreen,
                    borderRadius: "8px",
                    padding: "12px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "20px",
                      fontWeight: 700,
                      color: COLORS.darkGreen,
                    }}
                  >
                    {mockVolunteer.reviews}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: COLORS.darkGray,
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    Reviews
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div
                style={{
                  fontSize: "12px",
                  color: COLORS.darkGray,
                  fontFamily: "Montserrat, sans-serif",
                  lineHeight: "1.8",
                }}
              >
                <p style={{ margin: "0 0 5px 0" }}>
                  <strong>Joined:</strong> {mockVolunteer.joinDate}
                </p>
                <p style={{ margin: "0 0 5px 0" }}>
                  <strong>Response Time:</strong> {mockVolunteer.responseTime}
                </p>
                <p style={{ margin: "0" }}>
                  <strong>Languages:</strong> {mockVolunteer.languages.join(", ")}
                </p>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div style={{ marginBottom: "30px" }}>
            <h3
              style={{
                color: COLORS.darkGreen,
                margin: "0 0 15px 0",
                fontSize: "16px",
                fontWeight: 700,
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Skills
            </h3>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {mockVolunteer.skills.map((skill, idx) => (
                <span
                  key={idx}
                  style={{
                    backgroundColor: COLORS.mediumGreen,
                    color: COLORS.white,
                    padding: "8px 16px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: 600,
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Message Button */}
          <button
            onClick={() => setShowMessageModal(true)}
            style={{
              padding: "12px 30px",
              backgroundColor: COLORS.mediumGreen,
              color: COLORS.white,
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "14px",
              fontFamily: "Montserrat, sans-serif",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = COLORS.darkMediumGreen)}
            onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.mediumGreen)}
          >
            Send Message
          </button>
        </div>

        {/* Recent Reviews */}
        <div
          style={{
            backgroundColor: COLORS.white,
            borderRadius: "12px",
            padding: "30px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h3
            style={{
              color: COLORS.darkGreen,
              margin: "0 0 20px 0",
              fontSize: "18px",
              fontWeight: 700,
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            Recent Reviews
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {mockVolunteer.recentReviews.map((review) => (
              <div
                key={review.id}
                style={{
                  borderLeft: `4px solid ${COLORS.mediumGreen}`,
                  paddingLeft: "15px",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    marginBottom: "8px",
                  }}
                >
                  <h4
                    style={{
                      color: COLORS.darkGreen,
                      margin: "0",
                      fontSize: "14px",
                      fontWeight: 600,
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    {review.elder}
                  </h4>
                  <span style={{ fontSize: "14px" }}>
                    {"⭐".repeat(review.rating)}
                  </span>
                </div>
                <p
                  style={{
                    color: COLORS.darkGray,
                    margin: "0 0 5px 0",
                    fontSize: "12px",
                    fontFamily: "Montserrat, sans-serif",
                    lineHeight: "1.5",
                  }}
                >
                  {review.comment}
                </p>
                <p
                  style={{
                    color: COLORS.darkGray,
                    margin: "0",
                    fontSize: "11px",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  {review.date}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
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
          onClick={() => setShowMessageModal(false)}
        >
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
                Send Message
              </h2>
              <button
                onClick={() => setShowMessageModal(false)}
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

            {/* Recipient Info */}
            <div
              style={{
                backgroundColor: COLORS.veryLightGreen,
                borderRadius: "8px",
                padding: "15px",
                marginBottom: "20px",
              }}
            >
              <p
                style={{
                  color: COLORS.darkGreen,
                  margin: "0",
                  fontSize: "13px",
                  fontWeight: 600,
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                To: {mockVolunteer.name}
              </p>
            </div>

            {/* Message Input */}
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
                Your Message *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                style={{
                  width: "100%",
                  padding: "12px",
                  border: `2px solid ${COLORS.veryLightGreen}`,
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontFamily: "Montserrat, sans-serif",
                  boxSizing: "border-box",
                  minHeight: "120px",
                  resize: "vertical",
                  color: COLORS.darkGreen,
                }}
              />
            </div>

            {/* Action Buttons */}
            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setShowMessageModal(false)}
                disabled={isSending}
                style={{
                  padding: "10px 20px",
                  backgroundColor: COLORS.darkGray,
                  color: COLORS.white,
                  border: "none",
                  borderRadius: "8px",
                  cursor: isSending ? "not-allowed" : "pointer",
                  fontWeight: 600,
                  fontSize: "12px",
                  fontFamily: "Montserrat, sans-serif",
                  opacity: isSending ? 0.7 : 1,
                  transition: "all 0.3s ease",
                }}
              >
                Cancel
              </button>

              <button
                onClick={handleSendMessage}
                disabled={isSending || !message.trim()}
                style={{
                  padding: "10px 20px",
                  backgroundColor: COLORS.mediumGreen,
                  color: COLORS.white,
                  border: "none",
                  borderRadius: "8px",
                  cursor: isSending || !message.trim() ? "not-allowed" : "pointer",
                  fontWeight: 600,
                  fontSize: "12px",
                  fontFamily: "Montserrat, sans-serif",
                  opacity: isSending || !message.trim() ? 0.7 : 1,
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isSending && message.trim()) {
                    e.target.style.backgroundColor = COLORS.darkMediumGreen;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSending && message.trim()) {
                    e.target.style.backgroundColor = COLORS.mediumGreen;
                  }
                }}
              >
                {isSending ? "Sending..." : "Send Message"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerProfilePage;
