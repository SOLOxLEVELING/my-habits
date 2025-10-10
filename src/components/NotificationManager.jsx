// src/components/NotificationManager.jsx

import React, { useEffect, useState } from "react";

// The path to the sound file in your public folder
const NOTIFICATION_SOUND_URL = "/notification.wav";

// Define the API URL from environment variables with a local fallback
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";

function NotificationManager() {
  const [permission, setPermission] = useState(Notification.permission);

  // This effect runs once to set up the notification event listener
  useEffect(() => {
    if (permission !== "granted") {
      return;
    }

    // ✅ Establish a connection using the apiUrl variable
    const eventSource = new EventSource(`${apiUrl}/api/notifications/stream`);
    console.log("Connecting to notification stream...");

    eventSource.onmessage = (event) => {
      const notificationData = JSON.parse(event.data);
      console.log("Received notification:", notificationData);

      new Notification(notificationData.title, {
        body: notificationData.body,
        icon: notificationData.icon || "/favicon.ico",
      });

      const audio = new Audio(NOTIFICATION_SOUND_URL);
      audio.play().catch((error) => {
        console.warn("Could not play notification sound:", error);
      });
    };

    eventSource.onerror = (err) => {
      console.error("EventSource failed:", err);
      eventSource.close();
    };

    return () => {
      console.log("Closing notification stream.");
      eventSource.close();
    };
  }, [permission]);

  const requestPermission = async () => {
    const requestedPermission = await Notification.requestPermission();

    if (requestedPermission === "granted") {
      try {
        const audio = new Audio(NOTIFICATION_SOUND_URL);
        audio.muted = true;
        await audio.play();
        console.log("Audio unlocked successfully.");
      } catch (error) {
        console.error("Audio unlock failed:", error);
      }
    }

    setPermission(requestedPermission);
  };

  if (permission !== "granted") {
    return (
      <div style={styles.container}>
        <p>Enable notifications to get habit reminders.</p>
        <button onClick={requestPermission} style={styles.button}>
          Enable Notifications
        </button>
      </div>
    );
  }

  return null;
}

// Basic styling for the permission request UI
const styles = {
  container: {
    padding: "15px",
    backgroundColor: "rgba(30, 41, 59, 0.8)", // Adjusted for dark theme
    border: "1px solid #334155",
    borderRadius: "8px",
    textAlign: "center",
    margin: "20px 0",
    color: "#e2e8f0",
  },
  button: {
    backgroundColor: "#4f46e5", // Indigo color from your app
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },
};

export default NotificationManager;
