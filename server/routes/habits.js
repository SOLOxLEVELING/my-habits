const express = require("express");
const router = express.Router();
const habitController = require("../controllers/habitController");

// GET /api/habits - Get all habits
router.get("/", habitController.getAllHabits);

// GET /api/habits/:id - Get a single habit with its logs
router.get("/:id", habitController.getHabitById);

// POST /api/habits - Create a new habit
router.post("/", habitController.createHabit);

// PUT /api/habits/:id - Update an existing habit
router.put("/:id", habitController.updateHabit);

// DELETE /api/habits/:id - Delete a habit
router.delete("/:id", habitController.deleteHabit);

// POST /api/habits/:id/logs - Log a habit completion for a day
router.post("/:id/logs", habitController.addHabitLog);

// PUT /api/habits/:habitId/logs - Update a note for a specific log
router.put("/:habitId/logs", habitController.updateLogNote);

module.exports = router;
