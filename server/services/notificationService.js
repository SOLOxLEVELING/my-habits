// services/notificationService.js

// This object will hold all active client connections, keyed by user ID.
const clients = {};

// Function to send a notification to a specific user
const sendNotification = (userId, data) => {
  const client = clients[userId];
  if (client && client.res) {
    // Format the message according to the SSE specification
    // The `data:` prefix is required, and it must end with two newlines `\n\n`
    client.res.write(`data: ${JSON.stringify(data)}\n\n`);
    console.log(`🚀 Sent notification to user ${userId}: ${data.title}`);
    return true;
  }
  console.log(`ℹ️ User ${userId} not connected. Cannot send notification.`);
  return false;
};

// Middleware to handle a new client connecting to our stream
const sseMiddleware = (req, res) => {
  // We'll use a hardcoded user ID for now, but in a real app,
  // this would come from your authentication middleware (e.g., req.user.id)
  const userId = 1;

  // Set headers for SSE connection
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders(); // Flush the headers to establish the connection

  // Store the client's response object to be used later
  clients[userId] = { res };
  console.log(`✅ User ${userId} connected for notifications.`);

  // Send a confirmation message to the client
  sendNotification(userId, {
    title: "Notifications Enabled!",
    body: "You will now receive habit reminders here.",
  });

  // Handle the client disconnecting
  req.on("close", () => {
    delete clients[userId];
    console.log(`❌ User ${userId} disconnected.`);
  });
};

module.exports = {
  sendNotification,
  sseMiddleware,
};
