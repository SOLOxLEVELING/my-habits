// src/pages/HabitDetailPage.jsx

import React from "react";
import CalendarView from "../components/CalendarView";
import ProgressChart from "../components/ProgressChart";
import JournalEntry from "../components/JournalEntry";
import { ArrowLeft, Flame, Star } from "lucide-react";
import { motion } from "framer-motion";

function HabitDetailPage({ habit, onBack, onSaveNote }) {
  const sortedLogs = [...(habit.logs || [])].sort(
    (a, b) => new Date(b.log_date) - new Date(a.log_date)
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.button
        variants={itemVariants}
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-blue-400 font-semibold mb-4 transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Dashboard
      </motion.button>

      <motion.div
        variants={itemVariants}
        className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg"
      >
        <header className="flex flex-col sm:flex-row items-start gap-5">
          <div
            className={`w-16 h-16 ${habit.color} rounded-lg flex items-center justify-center text-4xl flex-shrink-0 shadow-md`}
          >
            {habit.icon}
          </div>
          <div className="mt-2 sm:mt-0">
            <h1 className="text-3xl font-bold text-white">{habit.name}</h1>
            <p className="text-slate-400 mt-1 text-lg">{habit.description}</p>
          </div>
        </header>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
      >
        <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg p-5 flex items-center gap-4">
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
        <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg p-5 flex items-center gap-4">
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
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg"
      >
        <h3 className="text-xl font-bold text-slate-100 mb-5">Consistency</h3>
        <CalendarView
          loggedDates={habit.loggedDates}
          habitColor={habit.color}
        />
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg"
      >
        <h3 className="text-xl font-bold text-slate-100 mb-5">
          Weekly Progress
        </h3>
        <ProgressChart logs={sortedLogs} />
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg"
      >
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
      </motion.div>
    </motion.div>
  );
}

export default HabitDetailPage;
