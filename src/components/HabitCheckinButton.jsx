import React from "react";
import { Check } from "lucide-react";

function HabitCheckinButton({ completed, onToggle }) {
  const buttonClasses = completed
    ? "bg-green-500 text-white"
    : "bg-slate-700 text-slate-400 hover:bg-slate-600";

  const iconClasses = completed ? "scale-100 opacity-100" : "scale-0 opacity-0";

  return (
    <button
      onClick={onToggle}
      className={`relative w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500 ${buttonClasses}`}
      aria-label={
        completed ? "Mark habit as not complete" : "Mark habit as complete"
      }
    >
      {/* Circle outline for the unchecked state */}
      <div className="absolute inset-0 rounded-full border-2 border-slate-500"></div>

      {/* Animated checkmark for the completed state */}
      <Check
        size={28}
        className={`transform transition-all duration-300 ease-in-out ${iconClasses}`}
        strokeWidth={3}
      />
    </button>
  );
}

export default HabitCheckinButton;
