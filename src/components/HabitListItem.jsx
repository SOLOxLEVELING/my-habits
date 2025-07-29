import React from "react";
import { Edit, Trash2, CheckCircle, XCircle, Flame, Bell } from "lucide-react"; // <-- Import Bell icon

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function HabitListItem({
  habit,
  onEdit,
  onDelete,
  onToggleComplete,
  onSelect,
}) {
  // This function prevents the click event from bubbling up to the parent container,
  // which would trigger the onSelect navigation.
  const handleButtonClick = (e, callback) => {
    e.stopPropagation();
    callback();
  };

  return (
    <div
      className="relative p-4 rounded-xl shadow-md transition-all duration-300 flex items-start gap-4 bg-slate-800 hover:bg-slate-700/50 cursor-pointer"
      onClick={() => onSelect(habit.id)}
    >
      <div className="flex-shrink-0">
        <div
          className={`w-12 h-12 ${habit.color} rounded-lg flex items-center justify-center text-2xl`}
        >
          {habit.icon}
        </div>
      </div>

      <div className="flex-grow">
        <div className="flex items-center gap-3">
          <h3 className="font-bold text-lg text-slate-100">{habit.name}</h3>
          {habit.current_streak > 0 && (
            <div className="flex items-center gap-1 bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full text-sm font-semibold">
              <Flame size={14} />
              <span>{habit.current_streak}</span>
            </div>
          )}
          {/* Reminder Indicator */}
          {habit.reminder_enabled && (
            <div
              className="text-sky-400"
              title={`Reminder set for ${habit.reminder_time}`}
            >
              <Bell size={16} />
            </div>
          )}
        </div>
        <p className="text-slate-400 text-sm mt-1">{habit.description}</p>
        <div className="flex gap-1 mt-2">
          {daysOfWeek.map((day) => (
            <span
              key={day}
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                habit.frequency.includes(day)
                  ? "bg-slate-700 text-slate-200"
                  : "bg-slate-800 text-slate-500"
              }`}
            >
              {day.slice(0, 1)}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={(e) =>
            handleButtonClick(e, () => onToggleComplete(habit.id))
          }
          className={`p-2 rounded-full transition-colors ${
            habit.completed
              ? "text-green-400 hover:bg-green-900/50"
              : "text-slate-500 hover:bg-slate-700"
          }`}
          aria-label={
            habit.completed ? "Mark as not completed" : "Mark as completed"
          }
        >
          {habit.completed ? <CheckCircle size={24} /> : <XCircle size={24} />}
        </button>
        <button
          onClick={(e) => handleButtonClick(e, () => onEdit(habit))}
          className="p-2 rounded-full text-slate-400 hover:text-blue-400 hover:bg-slate-700 transition-colors"
          aria-label="Edit habit"
        >
          <Edit size={20} />
        </button>
        <button
          onClick={(e) => handleButtonClick(e, () => onDelete(habit.id))}
          className="p-2 rounded-full text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-colors"
          aria-label="Delete habit"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}

export default HabitListItem;
