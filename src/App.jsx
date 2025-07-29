import React, { useState } from "react";
import { Plus, List, Calendar } from "lucide-react";
import HabitDashboard from "./pages/HabitDashboard";
import HabitForm from "./components/HabitForm";
import TodayView from "./pages/TodayView";
import HabitDetailPage from "./pages/HabitDetailPage";
import { initialHabits, habitLogs } from "./data/mockData";

export default function App() {
  const [habits, setHabits] = useState(initialHabits);
  const [logs, setLogs] = useState(habitLogs);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [activeView, setActiveView] = useState("today");
  const [selectedHabitId, setSelectedHabitId] = useState(null);

  const handleOpenForm = (habit = null) => {
    setEditingHabit(habit);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingHabit(null);
  };

  const handleSaveHabit = (habitData) => {
    if (editingHabit) {
      // Update existing habit
      setHabits(
        habits.map((h) =>
          h.id === editingHabit.id ? { ...h, ...habitData } : h
        )
      );
    } else {
      // Add new habit, ensuring reminder fields have default values
      const newHabit = {
        ...habitData,
        id: Date.now(),
        completed: false,
        current_streak: 0,
        longest_streak: 0,
        // Ensure these are set even if form doesn't send them
        reminder_enabled: habitData.reminder_enabled || false,
        reminder_time: habitData.reminder_time || null,
      };
      setHabits([...habits, newHabit]);
    }
    handleCloseForm();
  };

  const handleDeleteHabit = (habitId) => {
    setHabits(habits.filter((h) => h.id !== habitId));
    const newLogs = { ...logs };
    delete newLogs[habitId];
    setLogs(newLogs);
  };

  const toggleComplete = (habitId) => {
    setHabits(
      habits.map((h) =>
        h.id === habitId ? { ...h, completed: !h.completed } : h
      )
    );
  };

  const handleSelectHabit = (id) => setSelectedHabitId(id);
  const handleDeselectHabit = () => setSelectedHabitId(null);

  const handleSaveNote = (habitId, logDate, newNote) => {
    setLogs((prevLogs) => {
      const newLogs = { ...prevLogs };
      const habitLogs = newLogs[habitId].map((log) => {
        if (log.date === logDate) {
          return { ...log, note: newNote };
        }
        return log;
      });
      newLogs[habitId] = habitLogs;
      return newLogs;
    });
  };

  // If a habit is selected, show the detail page
  if (selectedHabitId) {
    const selectedHabit = habits.find((h) => h.id === selectedHabitId);
    const selectedLogs = logs[selectedHabitId] || [];
    return (
      <div className="bg-slate-900 min-h-screen text-white font-sans p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <HabitDetailPage
            habit={selectedHabit}
            logs={selectedLogs}
            onBack={handleDeselectHabit}
            onSaveNote={handleSaveNote} // <-- Pass the new handler
          />
        </div>
      </div>
    );
  }

  // Otherwise, show the main dashboard with the view switcher
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
            <TodayView habits={habits} onToggleComplete={toggleComplete} />
          ) : (
            <HabitDashboard
              habits={habits}
              onEdit={handleOpenForm}
              onDelete={handleDeleteHabit}
              onToggleComplete={toggleComplete}
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
