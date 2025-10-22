// src/components/CalendarView.jsx

import React from "react";

// This color map ensures Tailwind CSS includes all these classes in the final build.
const colorMap = {
  "bg-blue-500": "bg-blue-400",
  "bg-green-500": "bg-green-400",
  "bg-sky-400": "bg-sky-300",
  "bg-purple-500": "bg-purple-400",
  "bg-red-500": "bg-red-400",
  "bg-yellow-500": "bg-yellow-400",
  "bg-indigo-500": "bg-indigo-400",
  "bg-pink-500": "bg-pink-400",
  // Add our new blue accent just in case
  "bg-blue-600": "bg-blue-500",
};

// A timezone-safe helper function to get a 'YYYY-MM-DD' string from a Date object
const toYYYYMMDD = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function CalendarView({ loggedDates, habitColor }) {
  const today = new Date();
  const days = [];

  for (let i = 182; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    days.push(date);
  }

  // Use the color map to get the correct light color class
  const lightColorClass = colorMap[habitColor] || "bg-slate-400"; // Fallback color

  return (
    // Note: The h3 title is now in the parent HabitDetailPage.jsx
    <div className="grid grid-cols-[repeat(26,minmax(0,1fr))] grid-rows-7 gap-1">
      {days.map((day, index) => {
        const logDate = toYYYYMMDD(day);
        const hasLog = loggedDates && loggedDates.has(logDate);

        return (
          <div
            key={index}
            className={`w-full aspect-square rounded-[3px] transition-colors ${
              hasLog ? lightColorClass : "bg-slate-800" // Changed empty color
            }`}
            title={logDate}
          ></div>
        );
      })}
    </div>
  );
}

export default CalendarView;
