// src/components/ProgressChart.jsx

import React from "react";
import { motion } from "framer-motion";

function ProgressChart({ logs }) {
  const getWeeklyCompletions = () => {
    const today = new Date();
    const weeklyData = [0, 0, 0, 0];
    const weekBoundaries = Array.from({ length: 5 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (4 - i) * 7);
      return d;
    });

    (logs || []).forEach((log) => {
      const logDate = new Date(log.log_date);
      for (let i = 0; i < 4; i++) {
        if (logDate >= weekBoundaries[i] && logDate < weekBoundaries[i + 1]) {
          weeklyData[i]++;
          break;
        }
      }
    });
    return weeklyData;
  };

  const weeklyCompletions = getWeeklyCompletions();
  const maxCompletions = Math.max(...weeklyCompletions, 1);
  const labels = ["3w ago", "2w ago", "Last wk", "This wk"];

  return (
    <div className="flex justify-around items-end h-48 bg-slate-800 p-4 rounded-lg w-full">
      {weeklyCompletions.map((count, index) => (
        <div key={index} className="flex flex-col items-center w-1/4 h-full">
          <div className="text-sm font-bold text-slate-100 mb-1">{count}</div>
          <motion.div
            className="w-10 bg-blue-600 rounded-t-sm"
            initial={{ height: 0 }}
            animate={{ height: `${(count / maxCompletions) * 80}%` }}
            transition={{ duration: 0.5, type: "spring", stiffness: 50 }}
            title={`${count} completions`}
          ></motion.div>
          <div className="text-xs text-slate-400 mt-2">{labels[index]}</div>
        </div>
      ))}
    </div>
  );
}

export default ProgressChart;
