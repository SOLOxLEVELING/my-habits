import React, { useState, useEffect, useCallback } from "react";
import { Plus, List, Calendar, Goal, LogOut, BarChart2, Sun, Moon } from "lucide-react";
import confetti from "canvas-confetti";
import HabitDashboard from "./pages/HabitDashboard";
import HabitForm from "./components/HabitForm";
import TodayView from "./pages/TodayView";
import HabitDetailPage from "./pages/HabitDetailPage";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import NotificationManager from "./components/NotificationManager";
import * as api from "./api";
import { useTheme } from "./context/ThemeContext";
import { playSound } from "./utils/sound";

const isoToDayName = ["", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function HabitTracker({ user, onLogout }) {
  const { theme, toggleTheme } = useTheme();
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

  // Calculate total completions for XP
  const totalCompletions = habits.reduce((total, habit) => {
    return total + (habit.logs ? habit.logs.length : 0);
  }, 0);

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
    const isCompleting = !habitToToggle.completed;

    try {
      await api.toggleHabitLog(
        user.token,
        habitId,
        today,
        habitToToggle.completed
      );
      
      // Optimistic update for immediate feedback
      setHabits(prev => prev.map(h => {
        if (h.id === habitId) {
          return { ...h, completed: isCompleting };
        }
        return h;
      }));

      if (isCompleting) {
        playSound("complete");
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']
        });
      }

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
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-white font-sans p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <div className="max-w-5xl mx-auto relative">
        <NotificationManager user={user} />
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <Goal className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">
              Habit Tracker
            </h1>
          </div>
          <div className="flex items-center gap-4 self-end sm:self-center">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <span className="text-slate-500 dark:text-slate-400 text-sm hidden sm:block">
              Welcome, {user.username}!
            </span>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors"
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
          <nav className="flex bg-slate-200 dark:bg-slate-800 p-1.5 rounded-lg w-full sm:w-auto transition-colors duration-300">
            <button
              onClick={() => setActiveView("today")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md font-semibold transition-colors text-sm ${
                activeView === "today"
                  ? "bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-300/50 dark:hover:bg-slate-700/50"
              }`}
            >
              <Calendar size={18} /> Today
            </button>
            <button
              onClick={() => setActiveView("all")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md font-semibold transition-colors text-sm ${
                activeView === "all"
                  ? "bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-300/50 dark:hover:bg-slate-700/50"
              }`}
            >
              <List size={18} /> All Habits
            </button>
            <button
              onClick={() => setActiveView("analytics")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md font-semibold transition-colors text-sm ${
                activeView === "analytics"
                  ? "bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-300/50 dark:hover:bg-slate-700/50"
              }`}
            >
              <BarChart2 size={18} /> Analytics
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
          ) : activeView === "analytics" ? (
            <AnalyticsDashboard habits={habits} />
          ) : (
            <HabitDashboard
              habits={habits}
              totalCompletions={totalCompletions}
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
