// src/components/HabitCheckinButton.jsx

import React from "react";
import { Check } from "lucide-react";

function HabitCheckinButton({ completed, onToggle }) {
  const buttonClasses = completed
    ? "bg-green-500 text-white"
    : // Updated unchecked colors
      "bg-slate-800 text-slate-600 hover:bg-slate-700";

  const iconClasses = completed ? "scale-100 opacity-100" : "scale-0 opacity-0";

  return (
    <button
      onClick={onToggle}
      // Updated focus ring and classes
      className={`relative w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500 ${buttonClasses}`}
      aria-label={
        completed ? "Mark habit as not complete" : "Mark habit as complete"
      }
    >
      {/* Circle outline for the unchecked state */}
      <div className="absolute inset-0 rounded-full border-2 border-slate-700"></div>

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
