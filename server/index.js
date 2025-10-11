// index.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { initScheduledJobs } = require("./services/scheduler");

const authRoutes = require("./routes/auth");
const habitRoutes = require("./routes/habits");
const notificationRoutes = require("./routes/notifications");

const app = express();
const PORT = process.env.PORT || 5001;

const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.send("Habit Tracker Backend is running! 🚀");
});

app.use((err, req, res, next) => {
  console.error("💥 Unhandled Error:", err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  initScheduledJobs();
});
