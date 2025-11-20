// src/pages/TodayView.jsx

import React from "react";
import HabitCheckinButton from "../components/HabitCheckinButton";
import { Flame, Coffee } from "lucide-react";
import { motion } from "framer-motion";

const getToday = () => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[new Date().getDay()];
};

function TodayView({ habits, onToggleComplete, onSelectHabit }) {
  const today = getToday();
  const todaysHabits = habits.filter(
    (habit) =>
      habit.frequency_type === "daily" ||
      (habit.frequency_type === "specific_days" &&
        habit.frequency.includes(today))
  );

  if (todaysHabits.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 rounded-xl shadow-lg transition-colors"
      >
        <Coffee className="w-16 h-16 mx-auto text-slate-400 dark:text-slate-700 mb-4" />
        <h2 className="text-2xl font-semibold mb-2 text-slate-800 dark:text-slate-100">
          No habits for today.
        </h2>
        <p className="text-slate-500 dark:text-slate-500">Enjoy your day off or add a new habit!</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-3 mb-6">
        Today's Habits
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {todaysHabits.map((habit, index) => (
          <motion.div
            key={habit.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="p-4 rounded-xl flex items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
            onClick={() => onSelectHabit(habit.id)}
          >
            <HabitCheckinButton
              completed={habit.completed}
              onToggle={(e) => {
                e.stopPropagation();
                onToggleComplete(habit.id);
              }}
            />
            <div className="flex-grow">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-50">
                  {habit.name}
                </h3>
                {habit.current_streak > 0 && (
                  <div className="flex items-center gap-1 bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full text-sm font-semibold">
                    <Flame size={14} />
                    <span>{habit.current_streak}</span>
                  </div>
                )}
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                {habit.description}
              </p>
            </div>
            <div
              className={`w-12 h-12 ${habit.color} rounded-lg flex items-center justify-center text-2xl flex-shrink-0 text-white shadow-sm`}
            >
              {habit.icon}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default TodayView;
