// src/HabitTracker.jsx

import React, { useState, useEffect } from "react";
import { Plus, List, Calendar } from "lucide-react";
import HabitDashboard from "./pages/HabitDashboard";
import HabitForm from "./components/HabitForm";
import TodayView from "./pages/TodayView";
import HabitDetailPage from "./pages/HabitDetailPage";
import NotificationManager from "./components/NotificationManager";

const isoToDayName = ["", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
// Corrected: Use import.meta.env for Vite projects
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";

// This component contains all the original logic from your App.jsx
export default function HabitTracker({ user, onLogout }) {
  const [habits, setHabits] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [activeView, setActiveView] = useState("today");
  const [selectedHabitId, setSelectedHabitId] = useState(null);

  // Helper to create authenticated fetch options
  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${user.token}`,
  });

  const fetchHabits = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/habits`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      let data = await response.json();

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
          loggedDates: loggedDates,
        };
      });
      setHabits(formattedHabits);
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchHabits();
    }
  }, [user]);

  const handleSaveHabit = async (formData) => {
    const isEditing = !!editingHabit;
    const url = isEditing
      ? `${apiUrl}/api/habits/${editingHabit.id}`
      : `${apiUrl}/api/habits`;
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to save the habit.");
      await fetchHabits();
      handleCloseForm();
    } catch (error) {
      console.error("Error saving habit:", error);
    }
  };

  const handleDeleteHabit = async (habitId) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const response = await fetch(`${apiUrl}/api/habits/${habitId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to delete the habit.");
      setHabits((prev) => prev.filter((h) => h.id !== habitId));
      if (selectedHabitId === habitId) {
        handleDeselectHabit();
      }
    } catch (error) {
      console.error("Error deleting habit:", error);
    }
  };

  const handleToggleComplete = async (habitId) => {
    const habitToToggle = habits.find((h) => h.id === habitId);
    if (!habitToToggle) return;

    const today = new Date().toISOString().split("T")[0];
    const isCompleted = habitToToggle.completed;

    if (isCompleted) {
      try {
        const response = await fetch(
          `${apiUrl}/api/habits/${habitId}/logs/${today}`,
          {
            method: "DELETE",
            headers: getAuthHeaders(),
          }
        );
        if (!response.ok && response.status !== 404)
          throw new Error("Failed to delete log");
        await fetchHabits();
      } catch (error) {
        console.error("Error deleting log:", error);
      }
    } else {
      try {
        const response = await fetch(`${apiUrl}/api/habits/${habitId}/logs`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ date: today }),
        });
        if (!response.ok) throw new Error("Failed to create log");
        await fetchHabits();
      } catch (error) {
        console.error("Error creating log:", error);
      }
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

  if (selectedHabitId) {
    const selectedHabit = habits.find((h) => h.id === selectedHabitId);
    if (!selectedHabit) {
      handleDeselectHabit();
      return null;
    }
    return (
      <div className="bg-slate-900 min-h-screen text-white font-sans p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <HabitDetailPage
            habit={selectedHabit}
            logs={selectedHabit.logs}
            onBack={handleDeselectHabit}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 min-h-screen text-white font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto relative">
        <NotificationManager user={user} />
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-100">
            Habit Tracker
          </h1>
          <div>
            <span className="text-slate-400 mr-4">
              Welcome, {user.username}!
            </span>
            <button
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="flex justify-between items-center mb-8">
          <nav className="flex bg-slate-800/50 p-1 rounded-lg">
            <button
              onClick={() => setActiveView("today")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition-colors ${
                activeView === "today"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:bg-slate-700"
              }`}
            >
              <Calendar size={18} /> Today
            </button>
            <button
              onClick={() => setActiveView("all")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition-colors ${
                activeView === "all"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:bg-slate-700"
              }`}
            >
              <List size={18} /> All Habits
            </button>
          </nav>
          <button
            onClick={() => handleOpenForm()}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
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
