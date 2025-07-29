require("dotenv").config();

const express = require("express");
const cors = require("cors");
const habitRoutes = require("./routes/habits");
const { initScheduledJobs } = require("./services/scheduler"); // <-- Import the scheduler

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/habits", habitRoutes);

app.get("/", (req, res) => {
  res.send("Habit Tracker Backend is running! 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  // Initialize the cron jobs when the server starts
  initScheduledJobs(); // <-- Start the scheduler
});
