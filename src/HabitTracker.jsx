// src/HabitTracker.jsx

import React, { useState, useEffect } from "react";
import { Plus, List, Calendar, Goal, LogOut } from "lucide-react"; // Added Goal, LogOut
import HabitDashboard from "./pages/HabitDashboard";
import HabitForm from "./components/HabitForm";
import TodayView from "./pages/TodayView";
import HabitDetailPage from "./pages/HabitDetailPage";
import NotificationManager from "./components/NotificationManager";

const isoToDayName = ["", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";

export default function HabitTracker({ user, onLogout }) {
  const [habits, setHabits] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [activeView, setActiveView] = useState("today");
  const [selectedHabitId, setSelectedHabitId] = useState(null);

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
    // ... (logic unchanged)
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

  const handleSaveNote = async (habitId, logDate, newNote) => {
    // ... (logic unchanged)
    try {
      const response = await fetch(`${apiUrl}/api/habits/${habitId}/logs`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          log_date: logDate,
          note: newNote,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save the note.");
      }
      await fetchHabits();
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const handleDeleteHabit = async (habitId) => {
    // ... (logic unchanged)
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
    // ... (logic unchanged)
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
    // Changed background to darker slate-950
    return (
      <div className="bg-slate-950 min-h-screen text-white font-sans p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <HabitDetailPage
            habit={selectedHabit}
            logs={selectedHabit.logs}
            onBack={handleDeselectHabit}
            onSaveNote={handleSaveNote}
          />
        </div>
      </div>
    );
  }

  // Changed background to darker slate-950 and container to max-w-5xl
  return (
    <div className="bg-slate-950 min-h-screen text-white font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto relative">
        <NotificationManager user={user} />
        <header className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <Goal className="w-6 h-6 text-blue-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-100">
              Habit Tracker
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400 text-sm hidden sm:block">
              Welcome, {user.username}!
            </span>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-slate-400 hover:text-slate-100 bg-slate-800 hover:bg-slate-700 font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <nav className="flex bg-slate-800 p-1.5 rounded-lg">
            <button
              onClick={() => setActiveView("today")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition-colors text-sm ${
                activeView === "today"
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-700/50"
              }`}
            >
              <Calendar size={18} /> Today
            </button>
            <button
              onClick={() => setActiveView("all")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition-colors text-sm ${
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
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-lg shadow-lg transition-transform transform hover:scale-105"
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
