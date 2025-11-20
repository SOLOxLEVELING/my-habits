import React from "react";
import { motion } from "framer-motion";
import LevelProgress from "../components/LevelProgress";
import BadgeList from "../components/BadgeList";
import HabitListItem from "../components/HabitListItem";

export default function HabitDashboard({
  habits,
  totalCompletions,
  onEdit,
  onDelete,
  onToggleComplete,
  onSelect,
}) {
  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        <LevelProgress totalCompletions={totalCompletions || 0} />
        <BadgeList habits={habits} />
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">Your Habits</h2>
        
        {habits.length === 0 ? (
          <div className="text-center bg-slate-100 dark:bg-slate-800 p-10 rounded-lg border border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-semibold mb-2 text-slate-700 dark:text-slate-300">
              No habits yet!
            </h2>
            <p className="text-slate-500 dark:text-slate-400">Click "New Habit" to get started.</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4"
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
        )}
      </div>
    </div>
  );
}
