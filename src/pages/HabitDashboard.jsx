import React from "react";
import HabitListItem from "../components/HabitListItem";

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
    <div className="space-y-4">
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
    </div>
  );
}

export default HabitDashboard;
