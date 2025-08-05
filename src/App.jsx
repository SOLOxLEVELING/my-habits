import React, { useState, useEffect } from "react";
import { Plus, List, Calendar } from "lucide-react";
import HabitDashboard from "./pages/HabitDashboard";
import HabitForm from "./components/HabitForm";
import TodayView from "./pages/TodayView";
import HabitDetailPage from "./pages/HabitDetailPage";

// Helper to convert day numbers from DB to day names for the frontend
const isoToDayName = ["", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function App() {
  // State is now initialized as empty. It will be filled by the API call.
  const [habits, setHabits] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [activeView, setActiveView] = useState("today");
  const [selectedHabitId, setSelectedHabitId] = useState(null);

  // --- API FUNCTIONS ---

  // 1. Fetch all habits from the backend
  const fetchHabits = async () => {
    try {
      // === CHANGE THIS LINE ===
      const response = await fetch("http://localhost:5001/api/habits"); // ✅ Use the full backend URL
      if (!response.ok) throw new Error("Network response was not ok");
      let data = await response.json();

      // Format the data from the DB to match what the frontend components expect
      const formattedHabits = data.map((habit) => {
        const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
        const logs = habit.logs || [];

        // Check if there is a log entry for today
        // --- THIS IS THE LINE TO CHANGE ---

        // BEFORE:
        // const completedToday = logs.some((log) => log.log_date === today);

        // AFTER:
        const completedToday = logs.some(
          (log) => log.log_date && log.log_date.startsWith(today)
        );

        // NEW: Create a Set of date strings ('YYYY-MM-DD') for the calendar
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
          completed: completedToday, // <-- Added this calculated property
          loggedDates: loggedDates, // Added the new Set to the habit object
        };
      });

      setHabits(formattedHabits);
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  }; // <-- Add this closing brace to properly close fetchHabits function

  // Run fetchHabits() once when the app loads
  useEffect(() => {
    fetchHabits();
  }, []);

  // 2. Save a new habit or update an existing one
  const handleSaveHabit = async (formData) => {
    const isEditing = !!editingHabit;
    // === CHANGE THIS LINE ===
    const url = isEditing
      ? `http://localhost:5001/api/habits/${editingHabit.id}` // ✅ Use the full backend URL
      : "http://localhost:5001/api/habits"; // ✅ Use the full backend URL
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save the habit.");

      await fetchHabits(); // Re-fetch all data to get the latest state from the DB
      handleCloseForm();
    } catch (error) {
      console.error("Error saving habit:", error);
    }
  };

  // 3. Delete a habit
  const handleDeleteHabit = async (habitId) => {
    if (!window.confirm("Are you sure you want to delete this habit?")) return;

    try {
      // === CHANGE THIS LINE ===
      const response = await fetch(
        `http://localhost:5001/api/habits/${habitId}`,
        {
          // ✅ Use the full backend URL
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete the habit.");

      // For a faster UI, we can remove the habit from the local state immediately
      setHabits((prev) => prev.filter((h) => h.id !== habitId));
      if (selectedHabitId === habitId) {
        handleDeselectHabit();
      }
    } catch (error) {
      console.error("Error deleting habit:", error);
    }
  };

  // 4. Mark a habit as complete for today
  const handleToggleComplete = async (habitId) => {
    const habitToToggle = habits.find((h) => h.id === habitId);
    if (!habitToToggle) return;

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const isCompleted = habitToToggle.completed;

    // If the habit is already completed, we want to DELETE the log
    if (isCompleted) {
      try {
        const response = await fetch(
          `http://localhost:5001/api/habits/${habitId}/logs/${today}`, // Notice the date is now in the URL
          { method: "DELETE" }
        );
        // A 404 is okay here, it might just mean the state was out of sync
        if (!response.ok && response.status !== 404) {
          throw new Error("Failed to delete habit log");
        }
        await fetchHabits(); // Refresh all data
      } catch (error) {
        console.error("Error deleting habit log:", error);
      }
    } else {
      // If the habit is not completed, we want to POST a new log (your existing logic)
      try {
        const response = await fetch(
          `http://localhost:5001/api/habits/${habitId}/logs`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ date: today }),
          }
        );
        if (!response.ok) throw new Error("Failed to log habit completion");
        await fetchHabits(); // Refresh all data
      } catch (error) {
        console.error("Error creating habit log:", error);
      }
    }
  };

  // 5. Save a note for a specific log entry
  const handleSaveNote = async (habitId, logDate, newNote) => {
    // Note: Your backend doesn't have a route for updating notes yet.
    // This will require a new route like: PUT /api/habits/:habitId/logs/:logDate
    console.log("Note saving not implemented in backend yet.", {
      habitId,
      logDate,
      newNote,
    });
  };

  // --- UI Handlers ---
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

  // --- Render Logic ---
  if (selectedHabitId) {
    const selectedHabit = habits.find((h) => h.id === selectedHabitId);
    // If habit was deleted while being viewed, go back to dashboard
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
            onSaveNote={handleSaveNote}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 min-h-screen text-white font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-100">
            Habit Tracker
          </h1>
          <button
            onClick={() => handleOpenForm()}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
          >
            <Plus size={20} />
            <span>New Habit</span>
          </button>
        </header>

        <nav className="flex justify-center mb-8 bg-slate-800/50 p-1 rounded-lg w-fit mx-auto">
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
