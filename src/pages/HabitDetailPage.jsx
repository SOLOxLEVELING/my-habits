import React from "react";
import CalendarView from "../components/CalendarView";
import ProgressChart from "../components/ProgressChart";
import JournalEntry from "../components/JournalEntry"; // <-- Import JournalEntry
import { ArrowLeft, Flame, Star } from "lucide-react";

function HabitDetailPage({ habit, logs, onBack, onSaveNote }) {
  // <-- Add onSaveNote prop
  return (
    <div className="animate-fade-in">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-300 hover:text-white font-semibold mb-6"
      >
        <ArrowLeft size={20} />
        Back to Dashboard
      </button>

      <div className="bg-slate-800 p-6 rounded-2xl space-y-8">
        <header className="flex items-start gap-4">
          <div
            className={`w-16 h-16 ${habit.color} rounded-lg flex items-center justify-center text-4xl flex-shrink-0`}
          >
            {habit.icon}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{habit.name}</h1>
            <p className="text-slate-400 mt-1">{habit.description}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-orange-400">
              <Flame size={20} />
              <span className="text-2xl font-bold">{habit.current_streak}</span>
            </div>
            <div className="text-sm text-slate-400">Current Streak</div>
          </div>
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-yellow-400">
              <Star size={20} />
              <span className="text-2xl font-bold">{habit.longest_streak}</span>
            </div>
            <div className="text-sm text-slate-400">Longest Streak</div>
          </div>
        </div>

        <CalendarView logs={logs} habitColor={habit.color} />
        <ProgressChart logs={logs} />

        {/* Journal Section */}
        <div>
          <h3 className="text-lg font-bold text-slate-200 mb-3">
            Journal Entries
          </h3>
          <div className="space-y-4">
            {logs.length > 0 ? (
              logs.map((log) => (
                <JournalEntry
                  key={log.date}
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
    </div>
  );
}

export default HabitDetailPage;
