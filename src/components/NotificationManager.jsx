// src/components/NotificationManager.jsx

import React, { useEffect, useState } from "react";

const NOTIFICATION_SOUND_URL = "/notification.wav";
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";

function NotificationManager({ user }) {
  const [permission, setPermission] = useState(Notification.permission);

  useEffect(() => {
    if (permission !== "granted" || !user?.token) {
      return;
    }

    const eventSource = new EventSource(
      `${apiUrl}/api/notifications/stream?token=${user.token}`
    );
    console.log("Connecting to notification stream...");

    // IMPORTANT: We now listen for a SPECIFIC event type
    eventSource.addEventListener("habit_reminder", (event) => {
      const notificationData = JSON.parse(event.data);
      console.log("Received habit reminder:", notificationData);

      // This code will ONLY run for real reminders
      new Notification(notificationData.title, {
        body: notificationData.body,
        icon: notificationData.icon || "/favicon.ico",
      });

      new Audio(NOTIFICATION_SOUND_URL)
        .play()
        .catch((e) => console.warn("Audio play failed", e));
    });

    // You can optionally listen for the success message for debugging
    eventSource.addEventListener("connection_success", (event) => {
      const data = JSON.parse(event.data);
      console.log("Successfully connected to notifications:", data.title);
      // We DON'T show a pop-up or play a sound here
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
    // ... (rest of this function is unchanged)
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
    // ... (rest of the component is unchanged)
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
