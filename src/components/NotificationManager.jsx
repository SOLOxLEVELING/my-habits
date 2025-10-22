// src/components/NotificationManager.jsx

import React, { useEffect, useState } from "react";

const NOTIFICATION_SOUND_URL = "/notification.wav";
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";

function NotificationManager({ user }) {
  const [permission, setPermission] = useState(Notification.permission);

  useEffect(() => {
    // ... (logic unchanged)
    if (permission !== "granted" || !user?.token) {
      return;
    }

    const eventSource = new EventSource(
      `${apiUrl}/api/notifications/stream?token=${user.token}`
    );
    console.log("Connecting to notification stream...");

    eventSource.addEventListener("habit_reminder", (event) => {
      const notificationData = JSON.parse(event.data);
      console.log("Received habit reminder:", notificationData);

      new Notification(notificationData.title, {
        body: notificationData.body,
        icon: notificationData.icon || "/favicon.ico",
      });

      new Audio(NOTIFICATION_SOUND_URL)
        .play()
        .catch((e) => console.warn("Audio play failed", e));
    });

    eventSource.addEventListener("connection_success", (event) => {
      const data = JSON.parse(event.data);
      console.log("Successfully connected to notifications:", data.title);
    });

    eventSource.onerror = (err) => {
      console.error("EventSource failed:", err);
      eventSource.close();
    };

    return () => {
      console.log("Closing notification stream.");
      eventSource.close();
    };
  }, [permission, user]);

  const requestPermission = async () => {
    // ... (logic unchanged)
    const requestedPermission = await Notification.requestPermission();
    if (requestedPermission === "granted") {
      try {
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
    // Redesigned permission banner
    return (
      <div className="p-4 mb-6 text-center bg-slate-900 border border-slate-800 rounded-xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-slate-300">
          Enable notifications to get smart habit reminders.
        </p>
        <button
          onClick={requestPermission}
          // Updated button style
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          Enable Notifications
        </button>
      </div>
    );
  }

  return null;
}

export default NotificationManager;
