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
      className="relative p-4 rounded-xl shadow-sm transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 hover:bg-slate-800/60 cursor-pointer"
      onClick={() => onSelect(habit.id)}
    >
      {/* Left: Icon and Main Info */}
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div
          className={`w-12 h-12 ${habit.color} rounded-lg flex items-center justify-center text-2xl flex-shrink-0`}
        >
          {habit.icon}
        </div>
        <div className="flex-grow">
          <h3 className="font-bold text-lg text-slate-50">{habit.name}</h3>
          <div className="flex items-center gap-3 mt-1">
            {habit.current_streak > 0 && (
              <div className="flex items-center gap-1 bg-orange-900/50 text-orange-400 px-2 py-0.5 rounded-full text-xs font-semibold">
                <Flame size={12} />
                <span>{habit.current_streak}</span>
              </div>
            )}
            {habit.reminder_enabled && (
              <div
                className="text-blue-400"
                title={`Reminder set for ${habit.reminder_time}`}
              >
                <Bell size={14} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Middle: Frequency */}
      <div className="flex-grow flex items-center justify-center">
        <div className="flex gap-1.5">
          {daysOfWeek.map((day) => (
            <span
              key={day}
              className={`text-xs font-semibold w-7 h-7 flex items-center justify-center rounded-full ${
                habit.frequency.includes(day)
                  ? "bg-slate-700 text-slate-300"
                  : "bg-slate-800 text-slate-600"
              }`}
            >
              {day.slice(0, 1)}
            </span>
          ))}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 self-end sm:self-center">
        <button
          onClick={(e) => handleButtonClick(e, () => onToggleComplete(habit.id))}
          className={`p-2 rounded-full transition-colors ${
            habit.completed
              ? "text-green-500 hover:bg-green-500/10"
              : "text-slate-600 hover:bg-slate-700/50"
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
          className="p-2 rounded-full text-slate-500 hover:text-blue-400 hover:bg-slate-700/50 transition-colors"
          aria-label="Edit habit"
        >
          <Edit size={20} />
        </button>
        <button
          onClick={(e) => handleButtonClick(e, () => onDelete(habit.id))}
          className="p-2 rounded-full text-slate-500 hover:text-red-400 hover:bg-slate-700/50 transition-colors"
          aria-label="Delete habit"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}

export default HabitListItem;
