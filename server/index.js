// index.js (Full application code)

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const habitRoutes = require("./routes/habits"); //
const { initScheduledJobs } = require("./services/scheduler"); //

const app = express();
const PORT = process.env.PORT || 5001; // ✅ Using the new, correct port

// --- MIDDLEWARE SETUP (Order is important!) ---

// 1. Enable CORS for your frontend origin.
app.use(cors({ origin: "http://localhost:5173" }));

// 2. Enable the express.json middleware to parse JSON request bodies.
app.use(express.json()); //

// 3. Optional: Your logging middleware
app.use((req, res, next) => {
  console.log("\n=== Incoming Request ===");
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  console.log(`Origin: ${req.headers.origin}`);
  next();
});

// --- ROUTES ---
app.use("/api/habits", habitRoutes); //

app.get("/", (req, res) => {
  res.send("Habit Tracker Backend is running! 🚀"); //
});

// --- ERROR HANDLING ---
app.use((err, req, res, next) => {
  console.error("💥 Unhandled Error:", err.stack);
  res.status(500).json({ error: "Internal Server Error" }); //
});

// --- START SERVER ---
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`); //
  initScheduledJobs(); //
});
