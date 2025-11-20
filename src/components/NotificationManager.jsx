// src/components/NotificationManager.jsx

import React, { useEffect, useState } from "react";

const NOTIFICATION_SOUND_URL = "/notification.wav";

function NotificationManager({ user }) {
  const [permission, setPermission] = useState(Notification.permission);

  useEffect(() => {
    if (permission !== "granted" || !user) return;

    // Check for habits every hour
    const checkHabits = () => {
      const now = new Date();
      const currentHour = now.getHours();

      // Only notify between 9 AM and 9 PM
      if (currentHour < 9 || currentHour > 21) return;

      // Logic to check local storage or fetch habits could go here
      // For now, we'll rely on the user keeping the tab open or simple time-based reminders
      // In a real app, we'd check the actual habit status from the API or passed props
    };

    const interval = setInterval(checkHabits, 3600000); // Check every hour
    return () => clearInterval(interval);
  }, [permission, user]);

  const requestPermission = async () => {
    const requestedPermission = await Notification.requestPermission();
    if (requestedPermission === "granted") {
      new Notification("Notifications Enabled", {
        body: "We'll remind you to complete your habits!",
        icon: "/favicon.ico",
      });
      try {
        const audio = new Audio(NOTIFICATION_SOUND_URL);
        await audio.play();
      } catch (e) {
        console.log("Audio play failed", e);
      }
    }
    setPermission(requestedPermission);
  };

  if (permission !== "granted") {
    return (
      <div className="bg-blue-600/10 border border-blue-600/20 p-4 rounded-xl mb-6 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 rounded-full text-blue-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
          </div>
          <div>
            <h4 className="font-bold text-blue-100 text-sm">Enable Notifications</h4>
            <p className="text-blue-300 text-xs">Get reminders to keep your streak alive.</p>
          </div>
        </div>
        <button
          onClick={requestPermission}
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors whitespace-nowrap"
        >
          Allow
        </button>
      </div>
    );
  }

  return null;
}

export default NotificationManager;
