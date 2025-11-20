import React from "react";
import { motion } from "framer-motion";

export default function HabitHeatmap({ habits }) {
  // 1. Generate date map of total completions
  const completionMap = new Map();
  
  habits.forEach(habit => {
    if (habit.logs) {
      habit.logs.forEach(log => {
        const date = log.log_date.split('T')[0];
        completionMap.set(date, (completionMap.get(date) || 0) + 1);
      });
    }
  });

  // 2. Generate last 180 days (approx 6 months)
  const today = new Date();
  const days = Array.from({ length: 180 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    return d;
  }).reverse();

  const toYYYYMMDD = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getColor = (count) => {
    if (!count) return "bg-slate-100 dark:bg-slate-800";
    if (count === 1) return "bg-blue-200 dark:bg-blue-900";
    if (count === 2) return "bg-blue-400 dark:bg-blue-700";
    if (count === 3) return "bg-blue-600 dark:bg-blue-500";
    return "bg-blue-700 dark:bg-blue-400";
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">Consistency Heatmap</h3>
      <div className="flex flex-wrap gap-1 justify-center sm:justify-start">
        {days.map((day, i) => {
          const dateStr = toYYYYMMDD(day);
          const count = completionMap.get(dateStr) || 0;
          
          return (
            <motion.div
              key={dateStr}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.002 }}
              className={`w-3 h-3 sm:w-4 sm:h-4 rounded-sm ${getColor(count)}`}
              title={`${dateStr}: ${count} completions`}
            />
          );
        })}
      </div>
      <div className="flex items-center gap-2 mt-4 text-xs text-slate-500 dark:text-slate-400 justify-end">
        <span>Less</span>
        <div className="w-3 h-3 bg-slate-100 dark:bg-slate-800 rounded-sm" />
        <div className="w-3 h-3 bg-blue-200 dark:bg-blue-900 rounded-sm" />
        <div className="w-3 h-3 bg-blue-400 dark:bg-blue-700 rounded-sm" />
        <div className="w-3 h-3 bg-blue-600 dark:bg-blue-500 rounded-sm" />
        <div className="w-3 h-3 bg-blue-700 dark:bg-blue-400 rounded-sm" />
        <span>More</span>
      </div>
    </div>
  );
}
