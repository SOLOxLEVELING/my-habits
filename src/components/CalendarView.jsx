// src/components/CalendarView.jsx

import React from "react";
import { motion } from "framer-motion";

const colorMap = {
  "bg-blue-500": "bg-blue-400",
  "bg-green-500": "bg-green-400",
  "bg-sky-400": "bg-sky-300",
  "bg-purple-500": "bg-purple-400",
  "bg-red-500": "bg-red-400",
  "bg-yellow-500": "bg-yellow-400",
  "bg-indigo-500": "bg-indigo-400",
  "bg-pink-500": "bg-pink-400",
  "bg-blue-600": "bg-blue-500",
};

const toYYYYMMDD = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function CalendarView({ loggedDates, habitColor }) {
  const today = new Date();
  const days = Array.from({ length: 182 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    return date;
  }).reverse();

  const lightColorClass = colorMap[habitColor] || "bg-slate-400";

  return (
    <div className="grid grid-cols-7 sm:grid-cols-[repeat(26,minmax(0,1fr))] gap-1.5">
      {days.map((day, index) => {
        const logDate = toYYYYMMDD(day);
        const hasLog = loggedDates && loggedDates.has(logDate);

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.01, duration: 0.2 }}
            className={`w-full aspect-square rounded-[3px] transition-colors ${
              hasLog ? lightColorClass : "bg-slate-800"
            }`}
            title={logDate}
          ></motion.div>
        );
      })}
    </div>
  );
}

export default CalendarView;
