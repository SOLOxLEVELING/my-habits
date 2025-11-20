// src/components/HabitListItem.jsx

import React from "react";
import { Edit, Trash2, CheckCircle, XCircle, Flame, Bell } from "lucide-react";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function HabitListItem({
  habit,
  onEdit,
  onDelete,
  onToggleComplete,
  onSelect,
}) {
  const handleButtonClick = (e, callback) => {
    e.stopPropagation();
    callback();
  };

  return (
    <div
      className="relative p-4 rounded-xl shadow-sm transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer overflow-hidden"
      onClick={() => onSelect(habit.id)}
    >
      {/* Left: Icon and Main Info - This will grow */}
      <div className="flex items-center gap-4 w-full sm:flex-1 min-w-0">
        <div
          className={`w-12 h-12 ${habit.color} rounded-lg flex items-center justify-center text-2xl flex-shrink-0 text-white shadow-sm`}
        >
          {habit.icon}
        </div>
        <div className="flex-grow min-w-0">
            <div className="flex items-center gap-2">
              <h3 className={`font-bold text-lg ${habit.completed ? "text-slate-400 dark:text-slate-500 line-through" : "text-slate-900 dark:text-slate-100"}`}>
                {habit.name}
              </h3>
              {habit.category && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  habit.category === "Health" ? "bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400" :
                  habit.category === "Work" ? "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400" :
                  habit.category === "Learning" ? "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400" :
                  habit.category === "Mindfulness" ? "bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400" :
                  habit.category === "Fitness" ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" :
                  "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                }`}>
                  {habit.category}
                </span>
              )}
            </div>
          <div className="flex items-center gap-3 mt-1">
            {habit.current_streak > 0 && (
              <div className="flex items-center gap-1 bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full text-xs font-semibold">
                <Flame size={12} />
                <span>{habit.current_streak}</span>
              </div>
            )}
            {habit.reminder_enabled && (
              <div
                className="text-blue-500 dark:text-blue-400"
                title={`Reminder set for ${habit.reminder_time}`}
              >
                <Bell size={14} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Middle: Frequency - This will not grow */}
      <div className="sm:flex-none flex items-center justify-center">
        <div className="flex gap-1.5">
          {daysOfWeek.map((day) => (
            <span
              key={day}
              className={`text-xs font-semibold w-7 h-7 flex items-center justify-center rounded-full ${
                habit.frequency.includes(day)
                  ? "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600"
              }`}
            >
              {day.slice(0, 1)}
            </span>
          ))}
        </div>
      </div>

      {/* Right: Actions - This will not grow */}
      <div className="flex items-center gap-1 sm:gap-2 sm:flex-none self-end sm:self-center">
        <button
          onClick={(e) => handleButtonClick(e, () => onToggleComplete(habit.id))}
          className={`p-2 rounded-full transition-colors ${
            habit.completed
              ? "text-green-600 dark:text-green-500 hover:bg-green-100 dark:hover:bg-green-500/10"
              : "text-slate-400 dark:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700/50"
          }`}
          aria-label={
            habit.completed ? "Mark as not completed" : "Mark as completed"
          }
        >
          {habit.completed ? (
            <CheckCircle size={24} />
          ) : (
            <XCircle size={24} />
          )}
        </button>
        <button
          onClick={(e) => handleButtonClick(e, () => onEdit(habit))}
          className="p-2 rounded-full text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
          aria-label="Edit habit"
        >
          <Edit size={20} />
        </button>
        <button
          onClick={(e) => handleButtonClick(e, () => onDelete(habit.id))}
          className="p-2 rounded-full text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
          aria-label="Delete habit"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}

export default HabitListItem;
