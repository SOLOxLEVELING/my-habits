// routes/habits.js

const express = require("express");
const router = express.Router();
const habitController = require("../controllers/habitController");
const { protect } = require("../middleware/authMiddleware");

// This single line protects all habit routes below it.
router.use(protect);

router
  .route("/")
  .get(habitController.getAllHabits)
  .post(habitController.createHabit);

router
  .route("/:id")
  .get(habitController.getHabitById)
  .put(habitController.updateHabit)
  .delete(habitController.deleteHabit);

router.post("/:id/logs", habitController.addHabitLog);
router.delete("/:id/logs/:date", habitController.deleteHabitLog);
router.put("/:habitId/logs", habitController.updateLogNote);

module.exports = router;
