// index.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const habitRoutes = require("./routes/habits");
const { initScheduledJobs } = require("./services/scheduler");
const notificationRoutes = require("./routes/notifications");

const app = express();
const PORT = process.env.PORT || 5001;

// --- 1. MIDDLEWARE SETUP ---
// Middleware should always come before your routes.

// Enable CORS for your frontend origin.
app.use(cors({ origin: "http://localhost:5173" }));

// Enable the express.json middleware to parse JSON request bodies.
app.use(express.json());

// Your logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// --- 2. ROUTES ---
// All your API routes should be registered after the middleware.

app.use("/api/notifications", notificationRoutes); // Route for notifications
app.use("/api/habits", habitRoutes); // Route for habits

app.get("/", (req, res) => {
  res.send("Habit Tracker Backend is running! 🚀");
});

// --- 3. ERROR HANDLING & SERVER START ---
// (The rest of your file is fine)
app.use((err, req, res, next) => {
  console.error("💥 Unhandled Error:", err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  initScheduledJobs();
});
