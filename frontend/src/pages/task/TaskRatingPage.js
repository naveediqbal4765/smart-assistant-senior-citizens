import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// ============================================================
// TaskRatingPage.js - Task Rating & Volunteer Review Page
// ============================================================
// Allows users to rate volunteers and view volunteer profiles

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

const TaskRatingPage = () => {
  const navigate = useNavigate();

  const [volunteers, setVolunteers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState("rating");

  // Mock data
  const mockVolunteers = [
    {
      id: 1,
      name: "Ahmed Khan",
      rating: 4.8,
      reviews: 24,
      completedTasks: 45,
      skills: ["Grocery Shopping", "Companionship"],
      bio: "Friendly and reliable volunteer with 2 years of experience",
      joinDate: "2023-01-15",
    },
    {
      id: 2,
      name: "Fatima Ali",
      rating: 4.9,
      reviews: 31,
      completedTasks: 58,
      skills: ["Medical Assistance", "Transportation"],
      bio: "Professional caregiver with medical background",
      joinDate: "2022-06-20",
    },
    {
      id: 3,
      name: "Hassan Ahmed",
      rating: 4.7,
      reviews: 18,
      completedTasks: 32,
      skills: ["Companionship", "Cleaning"],
      bio: "Patient and caring volunteer",
      joinDate: "2023-09-10",
    },
    {
      id: 4,
      name: "Aisha Hassan",
      rating: 4.6,
      reviews: 15,
      completedTasks: 28,
      skills: ["Cooking", "Housekeeping"],
      bio: "Experienced in household management",
      joinDate: "2023-11-05",
    },
  ];

  useEffect(() => {
    loadVolunteers();
  }, []);

  const loadVolunteers = async () => {
    setIsLoading(true);
    try {
      setVolunteers(mockVolunteers);
      toast.success("Volunteers loaded");
    } catch (error) {
      toast.error("Failed to load volunteers");
    } finally {
      setIsLoading(false);
    }
  };

  const getSortedVolunteers = () => {
    const sorted = [...volunteers];
    if (sortBy === "rating") {
      sorted.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "tasks") {
      sorted.sort((a, b) => b.completedTasks - a.completedTasks);
    } else if (sortBy === "reviews") {
      sorted.sort((a, b) => b.reviews - a.reviews);
    }
    return sorted;
  };

  return (
    <div style={{ backgroundColor: COLORS.lightGray, minHeight: "100vh", paddingBottom: "40px" }}>
      {/* Header */}
      <div style={{ backgroundColor: COLORS.darkGreen, padding: "30px 20px", color: COLORS.white }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "none",
              border: "none",
              color: COLORS.white,
              cursor: "pointer",
              fontSize: "16px",
              marginBottom: "15px",
              fontWeight: 600,
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            ← Back
          </button>
          <h1 style={{ fontSize: "32px", fontWeight: 700, margin: "0 0 8px 0" }}>
            ⭐ Volunteer Ratings
          </h1>
          <p style={{ fontSize: "14px", color: COLORS.veryLightGreen, margin: "0" }}>
            View and rate our trusted volunteers
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "30px 20px" }}>
        {/* Sort Options */}
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
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: "12px",
              border: `2px solid ${COLORS.veryLightGreen}`,
              borderRadius: "8px",
              fontSize: "13px",
              fontFamily: "Montserrat, sans-serif",
              cursor: "pointer",
              backgroundColor: COLORS.white,
              color: COLORS.darkGreen,
              maxWidth: "300px",
            }}
          >
            <option value="rating">Highest Rating</option>
            <option value="tasks">Most Tasks Completed</option>
            <option value="reviews">Most Reviews</option>
          </select>
        </div>

        {/* Volunteers Grid */}
        {isLoading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p style={{ color: COLORS.darkGray, fontFamily: "Montserrat, sans-serif" }}>
              Loading volunteers...
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "20px",
            }}
          >
            {getSortedVolunteers().map((volunteer) => (
              <div
                key={volunteer.id}
                style={{
                  backgroundColor: COLORS.white,
                  borderRadius: "12px",
                  padding: "20px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  borderTop: `4px solid ${COLORS.mediumGreen}`,
                }}
              >
                {/* Name and Rating */}
                <div style={{ marginBottom: "15px" }}>
                  <h3
                    style={{
                      color: COLORS.darkGreen,
                      margin: "0 0 8px 0",
                      fontSize: "16px",
                      fontWeight: 700,
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    {volunteer.name}
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span style={{ fontSize: "18px" }}>
                      {"⭐".repeat(Math.floor(volunteer.rating))}
                    </span>
                    <span
                      style={{
                        color: COLORS.darkGray,
                        fontSize: "13px",
                        fontFamily: "Montserrat, sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      {volunteer.rating} ({volunteer.reviews} reviews)
                    </span>
                  </div>
                </div>

                {/* Bio */}
                <p
                  style={{
                    color: COLORS.darkGray,
                    margin: "0 0 15px 0",
                    fontSize: "12px",
                    fontFamily: "Montserrat, sans-serif",
                    lineHeight: "1.5",
                  }}
                >
                  {volunteer.bio}
                </p>

                {/* Stats */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px",
                    marginBottom: "15px",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: COLORS.lightGray,
                      borderRadius: "8px",
                      padding: "10px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: 700,
                        color: COLORS.darkGreen,
                      }}
                    >
                      {volunteer.completedTasks}
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
                      backgroundColor: COLORS.lightGray,
                      borderRadius: "8px",
                      padding: "10px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: 700,
                        color: COLORS.darkGreen,
                      }}
                    >
                      {volunteer.reviews}
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

                {/* Skills */}
                <div style={{ marginBottom: "15px" }}>
                  <p
                    style={{
                      color: COLORS.darkGreen,
                      margin: "0 0 8px 0",
                      fontSize: "12px",
                      fontWeight: 600,
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    Skills
                  </p>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {volunteer.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        style={{
                          backgroundColor: COLORS.veryLightGreen,
                          color: COLORS.darkGreen,
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "11px",
                          fontWeight: 600,
                          fontFamily: "Montserrat, sans-serif",
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Join Date */}
                <p
                  style={{
                    color: COLORS.darkGray,
                    margin: "0 0 15px 0",
                    fontSize: "11px",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  Joined: {volunteer.joinDate}
                </p>

                {/* View Profile Button */}
                <button
                  style={{
                    width: "100%",
                    padding: "10px",
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
                  View Profile
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskRatingPage;
