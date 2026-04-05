const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Elder = require("../models/Elder");

// ============================================================
// EXERCISE & PHYSICAL REHABILITATION ROUTES
// ============================================================

// GET all exercises (with health-based filtering)
router.get("/", auth, async (req, res) => {
  try {
    const elder = await Elder.findOne({ userId: req.user.id });

    if (!elder) {
      return res.status(404).json({ message: "Elder not found" });
    }

    // Define all exercises
    const allExercises = [
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
          "Do 10 repetitions of each movement",
        ],
        benefits: ["Reduces neck stiffness", "Improves mobility", "Relieves tension"],
        cautions: ["Do not force the stretch", "Stop if you feel pain", "Move slowly and deliberately"],
        targetConditions: ["Hypertension", "Arthritis"],
        aiGuidance: "Keep your movements slow and controlled. Breathe deeply throughout the exercise.",
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
          "Repeat 15 times in each direction",
        ],
        benefits: ["Improves shoulder mobility", "Increases circulation", "Strengthens shoulders"],
        cautions: ["Do not overextend", "Keep movements smooth", "Stop if dizzy"],
        targetConditions: ["Diabetes", "Hypertension"],
        aiGuidance: "Make smooth, controlled circles. If you feel any pain, reduce the circle size.",
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
          "Repeat 12 times, then switch to left leg",
        ],
        benefits: ["Strengthens leg muscles", "Improves balance", "Increases mobility"],
        cautions: ["Use a sturdy chair", "Keep movements slow", "Do not lock knees"],
        targetConditions: ["Diabetes", "Arthritis"],
        aiGuidance: "Keep your back straight and move slowly. Engage your core muscles.",
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
          "Return to starting position and repeat on other side",
        ],
        benefits: ["Improves balance", "Prevents falls", "Strengthens core"],
        cautions: ["Always have support nearby", "Do not rush", "Stop if feeling unsteady"],
        targetConditions: ["Hypertension", "General wellness"],
        aiGuidance: "Keep your eyes focused on a fixed point. Breathe steadily throughout.",
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
          "Cool down by walking slowly for 2 minutes",
        ],
        benefits: ["Improves cardiovascular health", "Increases circulation", "Boosts mood"],
        cautions: ["Wear comfortable shoes", "Stay hydrated", "Stop if short of breath"],
        targetConditions: ["Diabetes", "Hypertension"],
        aiGuidance: "Maintain a steady pace. You should be able to talk while exercising.",
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
          "Repeat 15 times on each side",
        ],
        benefits: ["Improves flexibility", "Aids digestion", "Reduces back stiffness"],
        cautions: ["Move slowly", "Do not force the twist", "Keep hips stable"],
        targetConditions: ["Arthritis", "General wellness"],
        aiGuidance: "Keep your hips still and only rotate your upper body. Breathe naturally.",
      },
    ];

    // Filter exercises based on elder's medical conditions
    const recommendedExercises = allExercises.filter((exercise) => {
      return exercise.targetConditions.some((condition) =>
        elder.medicalConditions.includes(condition)
      );
    });

    res.json({
      allExercises,
      recommendedExercises: recommendedExercises.length > 0 ? recommendedExercises : allExercises,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching exercises", error: error.message });
  }
});

// GET single exercise
router.get("/:exerciseId", auth, async (req, res) => {
  try {
    const { exerciseId } = req.params;

    const allExercises = [
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
          "Do 10 repetitions of each movement",
        ],
        benefits: ["Reduces neck stiffness", "Improves mobility", "Relieves tension"],
        cautions: ["Do not force the stretch", "Stop if you feel pain", "Move slowly and deliberately"],
        targetConditions: ["Hypertension", "Arthritis"],
        aiGuidance: "Keep your movements slow and controlled. Breathe deeply throughout the exercise.",
      },
      // ... other exercises
    ];

    const exercise = allExercises.find((e) => e.id === parseInt(exerciseId));

    if (!exercise) {
      return res.status(404).json({ message: "Exercise not found" });
    }

    res.json(exercise);
  } catch (error) {
    res.status(500).json({ message: "Error fetching exercise", error: error.message });
  }
});

// RECORD exercise completion
router.post("/:exerciseId/complete", auth, async (req, res) => {
  try {
    const { exerciseId } = req.params;

    const elder = await Elder.findOne({ userId: req.user.id });

    if (!elder) {
      return res.status(404).json({ message: "Elder not found" });
    }

    // Find exercise in progress
    const exerciseProgress = elder.exerciseProgress.find((e) => e.exerciseId === exerciseId);

    if (exerciseProgress) {
      exerciseProgress.completedCount += 1;
      exerciseProgress.lastCompleted = new Date();
    } else {
      elder.exerciseProgress.push({
        exerciseId,
        exerciseName: req.body.exerciseName,
        completedCount: 1,
        lastCompleted: new Date(),
        difficulty: req.body.difficulty,
      });
    }

    await elder.save();

    res.json({
      message: "Exercise completion recorded",
      exerciseProgress: elder.exerciseProgress,
    });
  } catch (error) {
    res.status(500).json({ message: "Error recording exercise", error: error.message });
  }
});

// GET exercise progress
router.get("/progress/all", auth, async (req, res) => {
  try {
    const elder = await Elder.findOne({ userId: req.user.id });

    if (!elder) {
      return res.status(404).json({ message: "Elder not found" });
    }

    res.json(elder.exerciseProgress);
  } catch (error) {
    res.status(500).json({ message: "Error fetching progress", error: error.message });
  }
});

// AI FORM CHECK (simulated)
router.post("/ai-check", auth, async (req, res) => {
  try {
    const { exerciseId, exerciseName } = req.body;

    // Simulate AI analysis
    const feedback = {
      status: "good",
      message: `Great form! Your ${exerciseName} looks good. Keep up the good work!`,
      suggestions: [
        "Maintain steady breathing",
        "Keep movements controlled",
        "Avoid rushing through repetitions",
      ],
      score: 85,
    };

    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: "Error analyzing form", error: error.message });
  }
});

module.exports = router;
