// src/components/NotificationManager.jsx

import React, { useEffect, useState } from "react";

// Use this short beep sound:
const BEEP_URL = "/notification.wav"

function NotificationManager({ user }) {
  const [permission, setPermission] = useState(Notification.permission);

  useEffect(() => {
    // If no permission or no user logged in, don't connect
    if (permission !== "granted" || !user || !user.token) return;

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";
    
    // ✅ FIX 1: Send 'token' instead of 'userId' to fix the 401 Error
    const eventSource = new EventSource(`${apiUrl}/api/notifications/stream?token=${user.token}`);

    console.log("🎧 Connecting to Notification Stream...");

    // ✅ FIX 2: Listen specifically for "habit_reminder" events
    // The backend sends: event: habit_reminder
    eventSource.addEventListener("habit_reminder", (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Trigger the System Notification
        new Notification(data.title || "Habit Reminder", {
          body: data.body || "Time to complete your habit!",
          icon: "/pwa-192x192.png",
          tag: "habit-reminder"
        });

        // Play the Sound
        const audio = new Audio(BEEP_URL);
        audio.play().catch((e) => console.log("Audio play blocked:", e));
        
      } catch (error) {
        console.error("Error parsing notification data:", error);
      }
    });

    // Optional: Listen for connection success to verify it works
    eventSource.addEventListener("connection_success", (event) => {
        console.log("✅ Notification System Connected!");
    });

    eventSource.onerror = (err) => {
      // Simple error logging
      console.error("EventSource connection issue (check token or server status).");
      eventSource.close();
    };

    // Cleanup: Close connection when component unmounts
    return () => {
      eventSource.close();
    };
  }, [permission, user]);

  const requestPermission = async () => {
    const requestedPermission = await Notification.requestPermission();
    setPermission(requestedPermission);

    if (requestedPermission === "granted") {
      new Notification("Notifications Enabled", {
        body: "You will now receive habit reminders!",
      });
      const audio = new Audio(BEEP_URL);
      audio.play().catch(e => console.log("Test audio failed", e));
    }
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