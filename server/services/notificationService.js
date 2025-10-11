// services/notificationService.js

const jwt = require("jsonwebtoken");
const db = require("../db");

const clients = {};

const sendNotification = (userId, data) => {
  const client = clients[userId];
  if (client && client.res) {
    client.res.write(`data: ${JSON.stringify(data)}\n\n`);
    return true;
  }
  return false;
};

// Updated to authenticate via token in query parameter
const sseMiddleware = async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userResult = await db.query("SELECT id FROM users WHERE id = $1", [
      decoded.id,
    ]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }
    const userId = userResult.rows[0].id;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    clients[userId] = { res };
    console.log(`✅ User ${userId} connected for notifications.`);

    sendNotification(userId, {
      title: "Notifications Enabled!",
      body: "You will now receive habit reminders here.",
    });

    req.on("close", () => {
      delete clients[userId];
      console.log(`❌ User ${userId} disconnected.`);
    });
  } catch (error) {
    console.error("SSE Auth Error:", error.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

module.exports = {
  sendNotification,
  sseMiddleware,
};
