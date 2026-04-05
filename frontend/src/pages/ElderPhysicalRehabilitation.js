import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const COLORS = {
  darkGreen: "#1C382A",
  mediumGreen: "#52b788",
  darkMediumGreen: "#2d6a4f",
  veryLightGreen: "#BAE4C7",
  white: "#FFFFFF",
  darkGray: "#666666",
  dashboardBg: "#E2FFEB",
  cardBg: "#BAE4C7",
  red: "#e63946",
  yellow: "#FFC107",
};

const ElderPhysicalRehabilitation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [exerciseProgress, setExerciseProgress] = useState({});
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Exercises tailored to elder health conditions
  const exercises = [
    {
      id: 1,
      name: "Neck Stretches",
      difficulty: "Easy",
      duration: "5 mins",
      reps: "10 reps",
      description: "Gentle neck stretches to improve flexibility and reduce stiffness",
      instructions: [
        "Sit upright with shoulders relaxed",
        "Slowly turn your head to the right, hold for 15 seconds",
        "Return to center and turn to the left, hold for 15 seconds",
        "Tilt your head towards right shoulder, hold for 15 seconds",
        "Repeat on the left side",
        "Do 10 repetitions of each movement"
      ],
      benefits: ["Reduces neck stiffness", "Improves mobility", "Relieves tension"],
      cautions: ["Do not force the stretch", "Stop if you feel pain", "Move slowly and deliberately"],
      targetConditions: ["Hypertension", "Arthritis"],
      aiGuidance: "Keep your movements slow and controlled. Breathe deeply throughout the exercise."
    },
    {
      id: 2,
      name: "Arm Circles",
      difficulty: "Easy",
      duration: "5 mins",
      reps: "15 reps",
      description: "Gentle arm circles to improve shoulder mobility and circulation",
      instructions: [
        "Stand or sit upright with feet shoulder-width apart",
        "Extend both arms out to the sides at shoulder height",
        "Make small circles forward for 30 seconds",
        "Reverse direction and make circles backward for 30 seconds",
        "Gradually increase circle size if comfortable",
        "Repeat 15 times in each direction"
      ],
      benefits: ["Improves shoulder mobility", "Increases circulation", "Strengthens shoulders"],
      cautions: ["Do not overextend", "Keep movements smooth", "Stop if dizzy"],
      targetConditions: ["Diabetes", "Hypertension"],
      aiGuidance: "Make smooth, controlled circles. If you feel any pain, reduce the circle size."
    },
    {
      id: 3,
      name: "Seated Leg Lifts",
      difficulty: "Medium",
      duration: "8 mins",
      reps: "12 reps",
      description: "Strengthen leg muscles while seated for safety and stability",
      instructions: [
        "Sit upright in a sturdy chair with back support",
        "Keep your back against the chair",
        "Slowly lift your right leg straight out in front of you",
        "Hold for 2 seconds at the top",
        "Lower your leg slowly without touching the floor",
        "Repeat 12 times, then switch to left leg"
      ],
      benefits: ["Strengthens leg muscles", "Improves balance", "Increases mobility"],
      cautions: ["Use a sturdy chair", "Keep movements slow", "Do not lock knees"],
      targetConditions: ["Diabetes", "Arthritis"],
      aiGuidance: "Keep your back straight and move slowly. Engage your core muscles."
    },
    {
      id: 4,
      name: "Standing Balance Exercise",
      difficulty: "Medium",
      duration: "5 mins",
      reps: "3 sets",
      description: "Improve balance and prevent falls with guided balance training",
      instructions: [
        "Stand near a wall or sturdy furniture for support",
        "Stand with feet hip-width apart",
        "Shift your weight to your right foot",
        "Lift your left foot slightly off the ground",
        "Hold for 10-15 seconds",
        "Return to starting position and repeat on other side"
      ],
      benefits: ["Improves balance", "Prevents falls", "Strengthens core"],
      cautions: ["Always have support nearby", "Do not rush", "Stop if feeling unsteady"],
      targetConditions: ["Hypertension", "General wellness"],
      aiGuidance: "Keep your eyes focused on a fixed point. Breathe steadily throughout."
    },
    {
      id: 5,
      name: "Gentle Walking in Place",
      difficulty: "Easy",
      duration: "10 mins",
      reps: "Continuous",
      description: "Low-impact cardio exercise to improve heart health and circulation",
      instructions: [
        "Stand upright with good posture",
        "Lift your knees gently as you walk in place",
        "Swing your arms naturally",
        "Maintain a steady, comfortable pace",
        "Continue for 10 minutes",
        "Cool down by walking slowly for 2 minutes"
      ],
      benefits: ["Improves cardiovascular health", "Increases circulation", "Boosts mood"],
      cautions: ["Wear comfortable shoes", "Stay hydrated", "Stop if short of breath"],
      targetConditions: ["Diabetes", "Hypertension"],
      aiGuidance: "Maintain a steady pace. You should be able to talk while exercising."
    },
    {
      id: 6,
      name: "Seated Torso Twists",
      difficulty: "Easy",
      duration: "5 mins",
      reps: "15 reps",
      description: "Improve flexibility and digestion with gentle torso twists",
      instructions: [
        "Sit upright in a chair with feet flat on the floor",
        "Cross your arms over your chest",
        "Slowly twist your torso to the right",
        "Hold for 2 seconds",
        "Return to center and twist to the left",
        "Repeat 15 times on each side"
      ],
      benefits: ["Improves flexibility", "Aids digestion", "Reduces back stiffness"],
      cautions: ["Move slowly", "Do not force the twist", "Keep hips stable"],
      targetConditions: ["Arthritis", "General wellness"],
      aiGuidance: "Keep your hips still and only rotate your upper body. Breathe naturally."
    }
  ];

  const handleScreenReaderToggle = () => {
    setScreenReaderEnabled(!screenReaderEnabled);
    if (!screenReaderEnabled) {
      const utterance = new SpeechSynthesisUtterance("Screen reader enabled");
      window.speechSynthesis.speak(utterance);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      alert("Unable to access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      setCameraActive(false);
    }
  };

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      
      // Simulate AI analysis
      const aiResponse = `✅ Great form! Your ${selectedExercise.name} looks good. ${selectedExercise.aiGuidance}`;
      alert(aiResponse);
      
      // Update progress
      setExerciseProgress(prev => ({
        ...prev,
        [selectedExercise.id]: (prev[selectedExercise.id] || 0) + 1
      }));
    }
  };

  const markExerciseComplete = (exerciseId) => {
    setExerciseProgress(prev => ({
      ...prev,
      [exerciseId]: (prev[exerciseId] || 0) + 1
    }));
    alert("✅ Exercise completed! Great job!");
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty === "Easy") return COLORS.mediumGreen;
    if (difficulty === "Medium") return COLORS.yellow;
    return COLORS.red;
  };

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: COLORS.dashboardBg }}>
      {/* Header */}
      <div style={{ position: "sticky", top: 0, backgroundColor: COLORS.darkGreen, padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <button onClick={() => navigate("/elder-dashboard")} style={{ background: "none", border: "none", color: COLORS.white, cursor: "pointer", fontSize: "20px" }}>
            ← Back
          </button>
          <h1 style={{ color: COLORS.white, margin: "0", fontSize: "24px", fontWeight: 700 }}>💪 Physical Rehabilitation</h1>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button onClick={handleScreenReaderToggle} style={{ padding: "8px 12px", backgroundColor: screenReaderEnabled ? COLORS.mediumGreen : COLORS.veryLightGreen, color: screenReaderEnabled ? COLORS.white : COLORS.darkGreen, border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: 600, fontSize: "12px" }}>
            {screenReaderEnabled ? "🔊" : "🔇"}
          </button>
          <Navbar screenReaderEnabled={screenReaderEnabled} onScreenReaderToggle={handleScreenReaderToggle} />
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
        {!selectedExercise ? (
          <>
            {/* Welcome Section */}
            <div style={{ backgroundColor: COLORS.cardBg, borderRadius: "12px", padding: "20px", marginBottom: "30px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
              <h2 style={{ color: COLORS.darkGreen, margin: "0 0 10px 0", fontSize: "20px", fontWeight: 700 }}>Welcome to Physical Rehabilitation</h2>
              <p style={{ color: COLORS.darkGray, margin: "0", fontSize: "14px", lineHeight: "1.6" }}>
                These exercises are personalized based on your health conditions. Start with easy exercises and gradually progress. Always consult your doctor before starting a new exercise routine.
              </p>
            </div>

            {/* Exercise List */}
            <h2 style={{ color: COLORS.darkGreen, marginBottom: "20px", fontSize: "20px", fontWeight: 700 }}>Recommended Exercises</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
              {exercises.map((exercise) => (
                <div
                  key={exercise.id}
                  style={{
                    backgroundColor: COLORS.cardBg,
                    borderRadius: "12px",
                    padding: "20px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    borderTop: `4px solid ${getDifficultyColor(exercise.difficulty)}`,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "15px" }}>
                    <div>
                      <h4 style={{ color: COLORS.darkGreen, margin: "0 0 5px 0", fontSize: "16px", fontWeight: 700 }}>
                        {exercise.name}
                      </h4>
                      <p style={{ color: COLORS.darkGray, margin: "0", fontSize: "13px" }}>
                        {exercise.description}
                      </p>
                    </div>
                    <span style={{ padding: "6px 12px", backgroundColor: getDifficultyColor(exercise.difficulty), color: COLORS.white, borderRadius: "20px", fontSize: "11px", fontWeight: 600, whiteSpace: "nowrap" }}>
                      {exercise.difficulty}
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "15px", fontSize: "12px" }}>
                    <div style={{ backgroundColor: COLORS.white, padding: "8px", borderRadius: "6px" }}>
                      <p style={{ color: COLORS.darkGray, margin: "0 0 4px 0" }}>Duration</p>
                      <p style={{ color: COLORS.darkGreen, margin: "0", fontWeight: 600 }}>{exercise.duration}</p>
                    </div>
                    <div style={{ backgroundColor: COLORS.white, padding: "8px", borderRadius: "6px" }}>
                      <p style={{ color: COLORS.darkGray, margin: "0 0 4px 0" }}>Reps</p>
                      <p style={{ color: COLORS.darkGreen, margin: "0", fontWeight: 600 }}>{exercise.reps}</p>
                    </div>
                  </div>

                  <div style={{ marginBottom: "15px" }}>
                    <p style={{ color: COLORS.darkGray, margin: "0 0 8px 0", fontSize: "12px", fontWeight: 600 }}>Target Conditions:</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {exercise.targetConditions.map((condition, idx) => (
                        <span key={idx} style={{ backgroundColor: COLORS.mediumGreen, color: COLORS.white, padding: "4px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: 600 }}>
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={() => setSelectedExercise(exercise)}
                      style={{
                        flex: 1,
                        padding: "10px",
                        backgroundColor: COLORS.mediumGreen,
                        color: COLORS.white,
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: "12px",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => (e.target.style.backgroundColor = COLORS.darkMediumGreen)}
                      onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.mediumGreen)}
                    >
                      📖 View Details
                    </button>
                    <button
                      onClick={() => {
                        setSelectedExercise(exercise);
                        setTimeout(() => setShowCamera(true), 100);
                      }}
                      style={{
                        flex: 1,
                        padding: "10px",
                        backgroundColor: COLORS.darkGreen,
                        color: COLORS.white,
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: "12px",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => (e.target.style.backgroundColor = COLORS.darkMediumGreen)}
                      onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.darkGreen)}
                    >
                      📹 Start Exercise
                    </button>
                  </div>

                  {exerciseProgress[exercise.id] && (
                    <div style={{ marginTop: "10px", padding: "8px", backgroundColor: "#e8f5e9", borderRadius: "6px", textAlign: "center" }}>
                      <p style={{ color: COLORS.mediumGreen, margin: "0", fontSize: "12px", fontWeight: 600 }}>
                        ✅ Completed {exerciseProgress[exercise.id]} time(s)
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Exercise Details View */}
            <button
              onClick={() => {
                setSelectedExercise(null);
                setShowCamera(false);
                stopCamera();
              }}
              style={{
                marginBottom: "20px",
                padding: "10px 20px",
                backgroundColor: COLORS.veryLightGreen,
                color: COLORS.darkGreen,
                border: `2px solid ${COLORS.mediumGreen}`,
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "13px",
              }}
            >
              ← Back to Exercises
            </button>

            <div style={{ backgroundColor: COLORS.cardBg, borderRadius: "12px", padding: "20px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "20px" }}>
                <div>
                  <h2 style={{ color: COLORS.darkGreen, margin: "0 0 10px 0", fontSize: "24px", fontWeight: 700 }}>
                    {selectedExercise.name}
                  </h2>
                  <p style={{ color: COLORS.darkGray, margin: "0", fontSize: "14px" }}>
                    {selectedExercise.description}
                  </p>
                </div>
                <span style={{ padding: "8px 16px", backgroundColor: getDifficultyColor(selectedExercise.difficulty), color: COLORS.white, borderRadius: "20px", fontSize: "12px", fontWeight: 600 }}>
                  {selectedExercise.difficulty}
                </span>
              </div>

              {/* Exercise Info Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "15px", marginBottom: "20px" }}>
                <div style={{ backgroundColor: COLORS.white, padding: "15px", borderRadius: "8px" }}>
                  <p style={{ color: COLORS.darkGray, margin: "0 0 8px 0", fontSize: "12px" }}>Duration</p>
                  <p style={{ color: COLORS.darkGreen, margin: "0", fontSize: "18px", fontWeight: 700 }}>{selectedExercise.duration}</p>
                </div>
                <div style={{ backgroundColor: COLORS.white, padding: "15px", borderRadius: "8px" }}>
                  <p style={{ color: COLORS.darkGray, margin: "0 0 8px 0", fontSize: "12px" }}>Repetitions</p>
                  <p style={{ color: COLORS.darkGreen, margin: "0", fontSize: "18px", fontWeight: 700 }}>{selectedExercise.reps}</p>
                </div>
                <div style={{ backgroundColor: COLORS.white, padding: "15px", borderRadius: "8px" }}>
                  <p style={{ color: COLORS.darkGray, margin: "0 0 8px 0", fontSize: "12px" }}>Difficulty</p>
                  <p style={{ color: getDifficultyColor(selectedExercise.difficulty), margin: "0", fontSize: "18px", fontWeight: 700 }}>{selectedExercise.difficulty}</p>
                </div>
              </div>

              {/* Instructions */}
              <div style={{ marginBottom: "20px" }}>
                <h3 style={{ color: COLORS.darkGreen, margin: "0 0 12px 0", fontSize: "16px", fontWeight: 700 }}>📋 Instructions</h3>
                <ol style={{ color: COLORS.darkGray, margin: "0", paddingLeft: "20px", fontSize: "13px", lineHeight: "1.8" }}>
                  {selectedExercise.instructions.map((instruction, idx) => (
                    <li key={idx} style={{ marginBottom: "8px" }}>{instruction}</li>
                  ))}
                </ol>
              </div>

              {/* Benefits */}
              <div style={{ marginBottom: "20px" }}>
                <h3 style={{ color: COLORS.darkGreen, margin: "0 0 12px 0", fontSize: "16px", fontWeight: 700 }}>✨ Benefits</h3>
                <ul style={{ color: COLORS.darkGray, margin: "0", paddingLeft: "20px", fontSize: "13px", lineHeight: "1.8" }}>
                  {selectedExercise.benefits.map((benefit, idx) => (
                    <li key={idx} style={{ marginBottom: "6px" }}>{benefit}</li>
                  ))}
                </ul>
              </div>

              {/* Cautions */}
              <div style={{ marginBottom: "20px", backgroundColor: "#fff3e0", padding: "15px", borderRadius: "8px", borderLeft: `4px solid ${COLORS.yellow}` }}>
                <h3 style={{ color: COLORS.darkGreen, margin: "0 0 12px 0", fontSize: "16px", fontWeight: 700 }}>⚠️ Important Cautions</h3>
                <ul style={{ color: COLORS.darkGray, margin: "0", paddingLeft: "20px", fontSize: "13px", lineHeight: "1.8" }}>
                  {selectedExercise.cautions.map((caution, idx) => (
                    <li key={idx} style={{ marginBottom: "6px" }}>{caution}</li>
                  ))}
                </ul>
              </div>

              {/* AI Guidance */}
              <div style={{ backgroundColor: "#e3f2fd", padding: "15px", borderRadius: "8px", borderLeft: `4px solid ${COLORS.mediumGreen}`, marginBottom: "20px" }}>
                <h3 style={{ color: COLORS.darkGreen, margin: "0 0 8px 0", fontSize: "14px", fontWeight: 700 }}>🤖 AI Guidance</h3>
                <p style={{ color: COLORS.darkGray, margin: "0", fontSize: "13px" }}>{selectedExercise.aiGuidance}</p>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => setShowCamera(true)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    backgroundColor: COLORS.mediumGreen,
                    color: COLORS.white,
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "13px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = COLORS.darkMediumGreen)}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.mediumGreen)}
                >
                  📹 Start with Camera
                </button>
                <button
                  onClick={() => markExerciseComplete(selectedExercise.id)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    backgroundColor: COLORS.darkGreen,
                    color: COLORS.white,
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "13px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = COLORS.darkMediumGreen)}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.darkGreen)}
                >
                  ✅ Mark as Complete
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Camera Modal */}
      {showCamera && selectedExercise && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
          onClick={() => {
            setShowCamera(false);
            stopCamera();
          }}
        >
          <div
            style={{
              backgroundColor: COLORS.white,
              borderRadius: "12px",
              padding: "20px",
              maxWidth: "600px",
              width: "90%",
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 700, color: COLORS.darkGreen, margin: "0" }}>
                📹 {selectedExercise.name} - AI Guided
              </h2>
              <button
                onClick={() => {
                  setShowCamera(false);
                  stopCamera();
                }}
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

            {/* Instructions */}
            <div style={{ backgroundColor: "#e3f2fd", padding: "12px", borderRadius: "8px", marginBottom: "15px" }}>
              <p style={{ color: COLORS.darkGray, margin: "0", fontSize: "12px" }}>
                <strong>Instructions:</strong> {selectedExercise.instructions[0]}
              </p>
            </div>

            {!cameraActive ? (
              <button
                onClick={startCamera}
                style={{
                  width: "100%",
                  padding: "15px",
                  backgroundColor: COLORS.mediumGreen,
                  color: COLORS.white,
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "14px",
                  marginBottom: "15px",
                }}
              >
                🎥 Start Camera
              </button>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  style={{
                    width: "100%",
                    borderRadius: "8px",
                    marginBottom: "15px",
                    backgroundColor: COLORS.darkGray,
                  }}
                />
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={400}
                  style={{ display: "none" }}
                />
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={captureFrame}
                    style={{
                      flex: 1,
                      padding: "12px",
                      backgroundColor: COLORS.mediumGreen,
                      color: COLORS.white,
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: "13px",
                    }}
                  >
                    📸 Capture & Get AI Feedback
                  </button>
                  <button
                    onClick={() => {
                      stopCamera();
                      setCameraActive(false);
                    }}
                    style={{
                      flex: 1,
                      padding: "12px",
                      backgroundColor: COLORS.veryLightGreen,
                      color: COLORS.darkGreen,
                      border: `2px solid ${COLORS.mediumGreen}`,
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: "13px",
                    }}
                  >
                    Stop Camera
                  </button>
                </div>
              </>
            )}

            {/* AI Feedback Section */}
            <div style={{ marginTop: "15px", padding: "12px", backgroundColor: "#f0f0f0", borderRadius: "8px" }}>
              <p style={{ color: COLORS.darkGray, margin: "0", fontSize: "12px" }}>
                <strong>💡 AI Tip:</strong> {selectedExercise.aiGuidance}
              </p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ElderPhysicalRehabilitation;
