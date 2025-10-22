// src/pages/TodayView.jsx

import React from "react";
import HabitCheckinButton from "../components/HabitCheckinButton";
import { Flame, Coffee } from "lucide-react"; // Added icon for empty state

// Helper to get the current day in 'Mon', 'Tue', etc. format
const getToday = () => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const todayIndex = new Date().getDay();
  return days[todayIndex];
};

function TodayView({ habits, onToggleComplete }) {
  const today = getToday();
  const todaysHabits = habits.filter((habit) =>
    habit.frequency.includes(today)
  );

  if (todaysHabits.length === 0) {
    // Redesigned empty state card
    return (
      <div className="text-center bg-slate-900 border border-slate-800 p-12 rounded-xl shadow-lg animate-fade-in">
        <Coffee className="w-16 h-16 mx-auto text-slate-700 mb-4" />
        <h2 className="text-2xl font-semibold mb-2 text-slate-100">
          No habits for today.
        </h2>
        <p className="text-slate-500">Enjoy your day off or add a new habit!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-100 border-b border-slate-800 pb-3 mb-6">
        Today's Habits
      </h2>
      {todaysHabits.map((habit) => (
        <div
          key={habit.id}
          // Redesigned card
          className="p-4 rounded-xl flex items-center gap-4 bg-slate-900 border border-slate-800 shadow-sm"
        >
          <HabitCheckinButton
            completed={habit.completed}
            onToggle={() => onToggleComplete(habit.id)}
          />
          <div className="flex-grow">
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-lg text-slate-50">{habit.name}</h3>
              {habit.current_streak > 0 && (
                // Tweaked streak colors
                <div className="flex items-center gap-1 bg-orange-900/50 text-orange-400 px-2 py-0.5 rounded-full text-sm font-semibold">
                  <Flame size={14} />
                  <span>{habit.current_streak}</span>
                </div>
              )}
            </div>
            <p className="text-slate-400 text-sm mt-1">{habit.description}</p>
          </div>
          <div
            className={`w-12 h-12 ${habit.color} rounded-lg flex items-center justify-center text-2xl flex-shrink-0`}
          >
            {habit.icon}
          </div>
        </div>
      ))}
    </div>
  );
}

export default TodayView;
