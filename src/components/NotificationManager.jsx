// src/components/NotificationManager.jsx

import React, { useEffect, useState } from "react";

const NOTIFICATION_SOUND_URL = "/notification.wav";
// Corrected: Use import.meta.env for Vite projects
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";

// The NotificationManager now needs the user object to get the token
function NotificationManager({ user }) {
  const [permission, setPermission] = useState(Notification.permission);

  useEffect(() => {
    if (permission !== "granted" || !user?.token) {
      return;
    }

    // Pass the token as a query parameter for authentication with EventSource
    const eventSource = new EventSource(
      `${apiUrl}/api/notifications/stream?token=${user.token}`
    );
    console.log("Connecting to notification stream...");

    eventSource.onmessage = (event) => {
      const notificationData = JSON.parse(event.data);
      new Notification(notificationData.title, {
        body: notificationData.body,
        icon: notificationData.icon || "/favicon.ico",
      });
      new Audio(NOTIFICATION_SOUND_URL)
        .play()
        .catch((e) => console.warn("Audio play failed", e));
    };

    eventSource.onerror = (err) => {
      console.error("EventSource failed:", err);
      eventSource.close();
    };

    return () => {
      console.log("Closing notification stream.");
      eventSource.close();
    };
  }, [permission, user]); // Re-run if permission or user changes

  const requestPermission = async () => {
    const requestedPermission = await Notification.requestPermission();
    if (requestedPermission === "granted") {
      try {
        // Unlock audio on user interaction
        const audio = new Audio(NOTIFICATION_SOUND_URL);
        audio.muted = true;
        await audio.play();
      } catch (error) {
        console.error("Audio unlock failed:", error);
      }
    }
    setPermission(requestedPermission);
  };

  if (permission !== "granted") {
    return (
      <div className="p-4 mb-4 text-center bg-slate-800 border border-slate-700 rounded-lg">
        <p className="text-slate-300">
          Enable notifications to get habit reminders.
        </p>
        <button
          onClick={requestPermission}
          className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          Enable Notifications
        </button>
      </div>
    );
  }

  return null;
}

export default NotificationManager;
