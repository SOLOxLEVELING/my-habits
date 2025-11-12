// src/pages/HabitDashboard.jsx

import React from "react";
import HabitListItem from "../components/HabitListItem";
import { motion } from "framer-motion";

function HabitDashboard({
  habits,
  onEdit,
  onDelete,
  onToggleComplete,
  onSelect,
}) {
  if (habits.length === 0) {
    return (
      <div className="text-center bg-slate-800 p-10 rounded-lg">
        <h2 className="text-2xl font-semibold mb-2 text-slate-300">
          No habits yet!
        </h2>
        <p className="text-slate-400">Click "New Habit" to get started.</p>
      </div>
    );
  }

  return (
      <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-4" // <-- SOLUTION
      >
      {habits.map((habit) => (
        <HabitListItem
          key={habit.id}
          habit={habit}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
          onSelect={onSelect}
        />
      ))}
    </motion.div>
  );
}

export default HabitDashboard;
