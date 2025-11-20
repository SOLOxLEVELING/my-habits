// src/components/NotificationManager.jsx

import React, { useEffect, useState } from "react";

// A simple "Ding" sound embedded so you don't need an external file
const NOTIFICATION_SOUND = "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU..."; // Shortened for readability in explanation, full string below

// Use this short beep sound:
const BEEP_URL = "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3"; 

function NotificationManager({ user }) {
  const [permission, setPermission] = useState(Notification.permission);

  useEffect(() => {
    // If no permission or no user logged in, don't connect
    if (permission !== "granted" || !user) return;

    // 1. Connect to the backend Notification Stream
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";
    
    // We pass the userId as a query param so the server knows who is connecting
    const eventSource = new EventSource(`${apiUrl}/api/notifications/stream?userId=${user.id}`);

    console.log("🎧 Connected to Notification Stream");

    // 2. Listen for messages from the server
    eventSource.onmessage = (event) => {
      // The server sends data as a string, so we parse it
      // If the server sends a simple "keep-alive" or empty message, ignore it
      if (event.data === "keep-alive") return;

      try {
        const data = JSON.parse(event.data);
        
        // 3. Trigger the System Notification
        new Notification("Habit Reminder", {
          body: data.message || "Time to complete your habit!",
          icon: "/pwa-192x192.png", // Ensure you have an icon in public folder, or remove this line
          tag: "habit-reminder"     // Prevents duplicate notifications stacking up
        });

        // 4. Play the Sound
        const audio = new Audio(BEEP_URL);
        audio.play().catch((e) => console.log("Audio play blocked:", e));
        
      } catch (error) {
        console.error("Error parsing notification data:", error);
      }
    };

    eventSource.onerror = (err) => {
      console.error("EventSource failed:", err);
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
      
      // Test the sound immediately
      const audio = new Audio(BEEP_URL);
      audio.play().catch(e => console.log("Test audio failed", e));
    }
  };

  if (permission !== "granted") {
    return (
      <div className="bg-blue-600/10 border border-blue-600/20 p-4 rounded-xl mb-6 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 rounded-full text-blue-400">
            {/* Bell Icon */}
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