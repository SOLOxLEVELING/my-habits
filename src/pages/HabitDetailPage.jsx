// src/pages/HabitDetailPage.jsx

import React from "react";
import CalendarView from "../components/CalendarView";
import ProgressChart from "../components/ProgressChart";
import JournalEntry from "../components/JournalEntry";
import { ArrowLeft, Flame, Star } from "lucide-react";

function HabitDetailPage({ habit, logs, onBack, onSaveNote }) {
  // Sort logs by date, most recent first
  const sortedLogs = [...logs].sort(
    (a, b) => new Date(b.log_date) - new Date(a.log_date)
  );

  return (
    // The page is now a layout container, not a card itself
    <div className="animate-fade-in space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-blue-400 font-semibold mb-4 transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Dashboard
      </button>

      {/* Card 1: Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
        <header className="flex items-start gap-5">
          <div
            className={`w-16 h-16 ${habit.color} rounded-lg flex items-center justify-center text-4xl flex-shrink-0 shadow-md`}
          >
            {habit.icon}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{habit.name}</h1>
            <p className="text-slate-400 mt-1 text-lg">{habit.description}</p>
          </div>
        </header>
      </div>

      {/* Card 2: Stats */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg flex divide-x divide-slate-700">
        <div className="flex-1 p-5 flex items-center gap-4">
          <div className="p-3 bg-slate-800 rounded-full">
            <Flame className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">
              {habit.current_streak}
            </div>
            <div className="text-sm text-slate-400">Current Streak</div>
          </div>
        </div>
        <div className="flex-1 p-5 flex items-center gap-4">
          <div className="p-3 bg-slate-800 rounded-full">
            <Star className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">
              {habit.longest_streak}
            </div>
            <div className="text-sm text-slate-400">Longest Streak</div>
          </div>
        </div>
      </div>

      {/* Card 3: Consistency Calendar */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold text-slate-100 mb-5">Consistency</h3>
        <CalendarView
          loggedDates={habit.loggedDates}
          habitColor={habit.color}
        />
      </div>

      {/* Card 4: Weekly Progress Chart */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold text-slate-100 mb-5">
          Weekly Progress
        </h3>
        <ProgressChart logs={logs} />
      </div>

      {/* Card 5: Journal */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold text-slate-100 mb-5">
          Journal Entries
        </h3>
        <div className="space-y-4">
          {sortedLogs.length > 0 ? (
            sortedLogs.map((log) => (
              <JournalEntry
                key={log.id}
                log={log}
                onSaveNote={(date, note) => onSaveNote(habit.id, date, note)}
              />
            ))
          ) : (
            <p className="text-slate-500 text-center py-4">
              No log entries yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default HabitDetailPage;
