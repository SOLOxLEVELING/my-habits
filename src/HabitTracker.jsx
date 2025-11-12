// src/HabitTracker.jsx

import React, { useState, useEffect, useCallback } from "react";
import { Plus, List, Calendar, Goal, LogOut } from "lucide-react";
import HabitDashboard from "./pages/HabitDashboard";
import HabitForm from "./components/HabitForm";
import TodayView from "./pages/TodayView";
import HabitDetailPage from "./pages/HabitDetailPage";
import NotificationManager from "./components/NotificationManager";
import * as api from "./api";

const isoToDayName = ["", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function HabitTracker({ user, onLogout }) {
  const [habits, setHabits] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [activeView, setActiveView] = useState("today");
  const [selectedHabitId, setSelectedHabitId] = useState(null);
  const [error, setError] = useState(null);

  const loadHabits = useCallback(async () => {
    if (!user?.token) return;
    try {
      setError(null);
      const data = await api.fetchHabits(user.token);
      const formattedHabits = data.map((habit) => {
        const today = new Date().toISOString().split("T")[0];
        const logs = habit.logs || [];
        const completedToday = logs.some(
          (log) => log.log_date && log.log_date.startsWith(today)
        );
        const loggedDates = new Set(
          logs.map((log) => log.log_date && log.log_date.split("T")[0])
        );
        let frequency = [];
        if (habit.frequency_type === "daily") {
          frequency = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        } else if (habit.frequency_details?.days) {
          frequency = habit.frequency_details.days.map(
            (dayNum) => isoToDayName[dayNum]
          );
        }
        return {
          ...habit,
          frequency,
          logs,
          completed: completedToday,
          loggedDates,
        };
      });
      setHabits(formattedHabits);
    } catch (error) {
      console.error("Error fetching habits:", error);
      setError("Failed to load habits. Please try again later.");
    }
  }, [user]);

  useEffect(() => {
    loadHabits();
  }, [loadHabits]);

  const handleSaveHabit = async (formData) => {
    try {
      await api.saveHabit(user.token, formData, editingHabit?.id);
      await loadHabits();
      handleCloseForm();
    } catch (error) {
      console.error("Error saving habit:", error);
      setError("Failed to save habit.");
    }
  };

  const handleSaveNote = async (habitId, logDate, newNote) => {
    try {
      await api.saveNote(user.token, habitId, logDate, newNote);
      await loadHabits();
    } catch (error) {
      console.error("Error saving note:", error);
      setError("Failed to save note.");
    }
  };

  const handleDeleteHabit = async (habitId) => {
    if (!window.confirm("Are you sure you want to delete this habit?")) return;
    try {
      await api.deleteHabit(user.token, habitId);
      setHabits((prev) => prev.filter((h) => h.id !== habitId));
      if (selectedHabitId === habitId) {
        handleDeselectHabit();
      }
    } catch (error) {
      console.error("Error deleting habit:", error);
      setError("Failed to delete habit.");
    }
  };

  const handleToggleComplete = async (habitId) => {
    const habitToToggle = habits.find((h) => h.id === habitId);
    if (!habitToToggle) return;

    const today = new Date().toISOString().split("T")[0];
    try {
      await api.toggleHabitLog(
        user.token,
        habitId,
        today,
        habitToToggle.completed
      );
      await loadHabits();
    } catch (error) {
      console.error("Error toggling habit completion:", error);
      setError("Failed to update habit status.");
    }
  };

  const handleOpenForm = (habit = null) => {
    setEditingHabit(habit);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingHabit(null);
  };

  const handleSelectHabit = (id) => setSelectedHabitId(id);
  const handleDeselectHabit = () => setSelectedHabitId(null);

  const selectedHabit = habits.find((h) => h.id === selectedHabitId);

  if (selectedHabit) {
    return (
      <div className="bg-slate-950 min-h-screen text-white font-sans p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <HabitDetailPage
            habit={selectedHabit}
            onBack={handleDeselectHabit}
            onSaveNote={handleSaveNote}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 min-h-screen text-white font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto relative">
        <NotificationManager user={user} />
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <Goal className="w-6 h-6 text-blue-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-100">
              Habit Tracker
            </h1>
          </div>
          <div className="flex items-center gap-4 self-end sm:self-center">
            <span className="text-slate-400 text-sm hidden sm:block">
              Welcome, {user.username}!
            </span>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-slate-400 hover:text-slate-100 bg-slate-800 hover:bg-slate-700 font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {error && (
          <div
            className="bg-red-500/20 text-red-300 p-4 rounded-lg mb-6"
            role="alert"
          >
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <nav className="flex bg-slate-800 p-1.5 rounded-lg w-full sm:w-auto">
            <button
              onClick={() => setActiveView("today")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md font-semibold transition-colors text-sm ${
                activeView === "today"
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-700/50"
              }`}
            >
              <Calendar size={18} /> Today
            </button>
            <button
              onClick={() => setActiveView("all")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md font-semibold transition-colors text-sm ${
                activeView === "all"
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-700/50"
              }`}
            >
              <List size={18} /> All Habits
            </button>
          </nav>
          <button
            onClick={() => handleOpenForm()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-lg shadow-lg transition-transform transform hover:scale-105"
          >
            <Plus size={20} />
            <span>New Habit</span>
          </button>
        </div>

        <main>
          {activeView === "today" ? (
            <TodayView
              habits={habits}
              onToggleComplete={handleToggleComplete}
              onSelectHabit={handleSelectHabit}
            />
          ) : (
            <HabitDashboard
              habits={habits}
              onEdit={handleOpenForm}
              onDelete={handleDeleteHabit}
              onToggleComplete={handleToggleComplete}
              onSelect={handleSelectHabit}
            />
          )}
        </main>
      </div>

      {isFormOpen && (
        <HabitForm
          habit={editingHabit}
          onSave={handleSaveHabit}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}
