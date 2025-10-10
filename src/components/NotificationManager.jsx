// src/components/NotificationManager.js

import React, { useEffect, useState } from "react";

// The path to the sound file in your public folder
const NOTIFICATION_SOUND_URL = "/notification.wav";

function NotificationManager() {
  const [permission, setPermission] = useState(Notification.permission);

  // This effect runs once to set up the notification event listener
  useEffect(() => {
    // Don't do anything if permission is not granted
    if (permission !== "granted") {
      return;
    }

    // Establish a connection to our backend's SSE stream endpoint
    const eventSource = new EventSource(
      "http://localhost:5001/api/notifications/stream"
    );
    console.log("Connecting to notification stream...");

    // This function is called whenever the server sends a message
    eventSource.onmessage = (event) => {
      const notificationData = JSON.parse(event.data);
      console.log("Received notification:", notificationData);

      // Create and show the browser notification
      new Notification(notificationData.title, {
        body: notificationData.body,
        icon: notificationData.icon || "/favicon.ico",
      });

      // Play the notification sound
      const audio = new Audio(NOTIFICATION_SOUND_URL);
      audio.play().catch((error) => {
        // Autoplay can sometimes be blocked by the browser
        console.warn("Could not play notification sound:", error);
      });
    };

    // Handle any errors with the connection
    eventSource.onerror = (err) => {
      console.error("EventSource failed:", err);
      eventSource.close();
    };

    // Clean up the connection when the component is unmounted
    return () => {
      console.log("Closing notification stream.");
      eventSource.close();
    };
  }, [permission]); // This effect re-runs if the permission state changes

  // Function to request permission from the user
  // 👇 UPDATE THIS FUNCTION
  const requestPermission = async () => {
    const requestedPermission = await Notification.requestPermission();

    // --- START of ADDED CODE ---
    // This "unlocks" audio playback by playing a muted sound
    // in response to the user's click.
    if (requestedPermission === "granted") {
      try {
        const audio = new Audio(NOTIFICATION_SOUND_URL);
        audio.muted = true; // Play it silently
        await audio.play();
        console.log("Audio unlocked successfully.");
      } catch (error) {
        console.error("Audio unlock failed:", error);
      }
    }
    // --- END of ADDED CODE ---

    setPermission(requestedPermission);
  };

  // Render a button to enable notifications if they haven't been granted
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

  // If permission is granted, this component doesn't need to render anything
  return null;
}

// Basic styling for the permission request UI
const styles = {
  container: {
    padding: "15px",
    backgroundColor: "#f0f8ff",
    border: "1px solid #cce5ff",
    borderRadius: "8px",
    textAlign: "center",
    margin: "20px",
  },
  button: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default NotificationManager;
