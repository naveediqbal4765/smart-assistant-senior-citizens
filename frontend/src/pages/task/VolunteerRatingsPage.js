import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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

const VolunteerRatingsPage = () => {
  const navigate = useNavigate();

  // Mock ratings data from elders
  const ratingsData = [
    {
      id: 1,
      elderName: "Fatima Ahmed",
      taskName: "Buy Groceries",
      rating: 5,
      review: "Excellent service! Very punctual and helpful. Highly recommended!",
      date: "2025-04-25",
      points: 50,
    },
    {
      id: 2,
      elderName: "Aisha Hassan",
      taskName: "Medical Appointment",
      rating: 4,
      review: "Good service. Helped me get to the hospital on time.",
      date: "2025-04-24",
      points: 45,
    },
    {
      id: 3,
      elderName: "Hassan Ahmed",
      taskName: "House Cleaning",
      rating: 4,
      review: "Did a good job cleaning the house. Very professional.",
      date: "2025-04-23",
      points: 40,
    },
    {
      id: 4,
      elderName: "Fatima Ahmed",
      taskName: "Companionship Visit",
      rating: 5,
      review: "Very kind and caring. Made me feel comfortable. Thank you!",
      date: "2025-04-22",
      points: 35,
    },
    {
      id: 5,
      elderName: "Aisha Hassan",
      taskName: "Grocery Shopping",
      rating: 3,
      review: "Completed the task but took longer than expected.",
      date: "2025-04-20",
      points: 30,
    },
    {
      id: 6,
      elderName: "Hassan Ahmed",
      taskName: "Transportation",
      rating: 5,
      review: "Safe and comfortable ride. Very attentive driver.",
      date: "2025-04-18",
      points: 50,
    },
  ];

  // Calculate statistics
  const totalRatings = ratingsData.length;
  const averageRating = (
    ratingsData.reduce((sum, r) => sum + r.rating, 0) / totalRatings
  ).toFixed(1);
  const totalPoints = ratingsData.reduce((sum, r) => sum + r.points, 0);
  const fiveStarCount = ratingsData.filter((r) => r.rating === 5).length;
  const fourStarCount = ratingsData.filter((r) => r.rating === 4).length;
  const threeStarCount = ratingsData.filter((r) => r.rating === 3).length;
  const twoStarCount = ratingsData.filter((r) => r.rating === 2).length;
  const oneStarCount = ratingsData.filter((r) => r.rating === 1).length;

  // Render star rating
  const renderStars = (rating) => {
    return (
      <div style={{ display: "flex", gap: "2px" }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            style={{
              color: star <= rating ? COLORS.yellow : COLORS.lightGray,
              fontSize: "16px",
            }}
          >
            ⭐
          </span>
        ))}
      </div>
    );
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
              fontWeight: 400,
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            Back
          </button>
          <h1 style={{ fontSize: "32px", fontWeight: 700, margin: "0 0 8px 0" }}>
            My Ratings
          </h1>
          <p style={{ fontSize: "14px", color: COLORS.veryLightGreen, margin: "0" }}>
            Ratings and reviews from elders
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "30px 20px" }}>
        {/* Statistics Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          {/* Total Ratings */}
          <div
            style={{
              backgroundColor: COLORS.white,
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              borderTop: `4px solid ${COLORS.mediumGreen}`,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "32px", fontWeight: 700, color: COLORS.darkGreen }}>
              {totalRatings}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: COLORS.darkGray,
                fontFamily: "Montserrat, sans-serif",
                marginTop: "8px",
              }}
            >
              Total Ratings
            </div>
          </div>

          {/* Average Rating */}
          <div
            style={{
              backgroundColor: COLORS.white,
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              borderTop: `4px solid ${COLORS.yellow}`,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "32px", fontWeight: 700, color: COLORS.darkGreen }}>
              {averageRating}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: COLORS.darkGray,
                fontFamily: "Montserrat, sans-serif",
                marginTop: "8px",
              }}
            >
              Average Rating
            </div>
          </div>

          {/* Total Points */}
          <div
            style={{
              backgroundColor: COLORS.white,
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              borderTop: `4px solid ${COLORS.mediumGreen}`,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "32px", fontWeight: 700, color: COLORS.darkGreen }}>
              {totalPoints}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: COLORS.darkGray,
                fontFamily: "Montserrat, sans-serif",
                marginTop: "8px",
              }}
            >
              Total Points
            </div>
          </div>

          {/* 5 Star Count */}
          <div
            style={{
              backgroundColor: COLORS.white,
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              borderTop: `4px solid ${COLORS.yellow}`,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "32px", fontWeight: 700, color: COLORS.darkGreen }}>
              {fiveStarCount}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: COLORS.darkGray,
                fontFamily: "Montserrat, sans-serif",
                marginTop: "8px",
              }}
            >
              5 Star Ratings
            </div>
          </div>
        </div>

        {/* Rating Distribution */}
        <div
          style={{
            backgroundColor: COLORS.white,
            borderRadius: "12px",
            padding: "30px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            marginBottom: "30px",
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
            Rating Distribution
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {[
              { stars: 5, count: fiveStarCount },
              { stars: 4, count: fourStarCount },
              { stars: 3, count: threeStarCount },
              { stars: 2, count: twoStarCount },
              { stars: 1, count: oneStarCount },
            ].map((item, idx) => (
              <div key={idx}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex", gap: "4px" }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        style={{
                          color: star <= item.stars ? COLORS.yellow : COLORS.lightGray,
                          fontSize: "14px",
                        }}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                  <span
                    style={{
                      fontSize: "12px",
                      color: COLORS.darkGray,
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    {item.count} ratings
                  </span>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "8px",
                    backgroundColor: COLORS.lightGray,
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${(item.count / totalRatings) * 100}%`,
                      backgroundColor: COLORS.mediumGreen,
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Ratings */}
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
            All Ratings
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {ratingsData.map((rating) => (
              <div
                key={rating.id}
                style={{
                  backgroundColor: COLORS.lightGray,
                  borderRadius: "12px",
                  padding: "20px",
                  borderLeft: `4px solid ${COLORS.mediumGreen}`,
                }}
              >
                {/* Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    marginBottom: "12px",
                  }}
                >
                  <div>
                    <h4
                      style={{
                        color: COLORS.darkGreen,
                        margin: "0 0 4px 0",
                        fontSize: "14px",
                        fontWeight: 600,
                        fontFamily: "Montserrat, sans-serif",
                      }}
                    >
                      {rating.elderName}
                    </h4>
                    <p
                      style={{
                        color: COLORS.darkGray,
                        margin: "0",
                        fontSize: "12px",
                        fontFamily: "Montserrat, sans-serif",
                      }}
                    >
                      Task: {rating.taskName} • {rating.date}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ marginBottom: "4px" }}>
                      {renderStars(rating.rating)}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: COLORS.mediumGreen,
                      }}
                    >
                      +{rating.points} pts
                    </div>
                  </div>
                </div>

                {/* Review */}
                <p
                  style={{
                    color: COLORS.darkGray,
                    margin: "0",
                    fontSize: "13px",
                    fontFamily: "Montserrat, sans-serif",
                    lineHeight: "1.5",
                    fontStyle: "italic",
                  }}
                >
                  "{rating.review}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerRatingsPage;
