// routes/notifications.js

const express = require("express");
const router = express.Router();
const { sseMiddleware } = require("../services/notificationService");

// This is the endpoint the frontend will connect to
router.get("/stream", sseMiddleware);

module.exports = router;
