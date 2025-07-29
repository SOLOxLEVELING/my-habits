import React, { useState } from "react";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const iconOptions = [
  "📚",
  "🏃",
  "💧",
  "🧘",
  "🎨",
  "🎸",
  "💻",
  "🥕",
  "💪",
  "✍️",
];
const colorOptions = [
  "bg-blue-500",
  "bg-green-500",
  "bg-sky-400",
  "bg-purple-500",
  "bg-red-500",
  "bg-yellow-500",
  "bg-indigo-500",
  "bg-pink-500",
];

function HabitForm({ habit, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: habit?.name || "",
    description: habit?.description || "",
    color: habit?.color || colorOptions[0],
    icon: habit?.icon || iconOptions[0],
    frequency: habit?.frequency || [],
    // Add reminder fields to the form's state
    reminder_enabled: habit?.reminder_enabled || false,
    reminder_time: habit?.reminder_time || "09:00",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFrequencyChange = (day) => {
    setFormData((prev) => {
      const newFrequency = prev.frequency.includes(day)
        ? prev.frequency.filter((d) => d !== day)
        : [...prev.frequency, day];
      return { ...prev, frequency: newFrequency };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl w-full max-w-md m-4">
        <h2 className="text-2xl font-bold mb-6 text-slate-100">
          {habit ? "Edit Habit" : "Create New Habit"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-400 mb-1"
            >
              Habit Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-slate-400 mb-1"
            >
              Description
            </label>
            <input
              type="text"
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Icon & Color
            </label>
            <div className="flex items-center gap-4">
              <div className="relative w-1/2">
                <label
                  htmlFor="icon"
                  className="block text-sm font-medium text-slate-400 mb-1"
                >
                  Icon
                </label>
                <select
                  name="icon"
                  id="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  className="w-full appearance-none bg-slate-700 border border-slate-600 rounded-lg pl-3 pr-8 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {iconOptions.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-1/2">
                <label
                  htmlFor="color"
                  className="block text-sm font-medium text-slate-400 mb-1"
                >
                  Color
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      type="button"
                      key={color}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, color }))
                      }
                      className={`w-full h-8 rounded-md ${color} ${
                        formData.color === color
                          ? "ring-2 ring-offset-2 ring-offset-slate-800 ring-white"
                          : ""
                      }`}
                    ></button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Frequency
            </label>
            <div className="flex flex-wrap gap-2">
              {daysOfWeek.map((day) => (
                <button
                  type="button"
                  key={day}
                  onClick={() => handleFrequencyChange(day)}
                  className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-colors ${
                    formData.frequency.includes(day)
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-700 hover:bg-slate-600 text-slate-300"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* New Reminder Section */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Smart Reminders
            </label>
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="reminder_enabled"
                  className="font-semibold text-slate-200"
                >
                  Enable Notifications
                </label>
                <input
                  type="checkbox"
                  name="reminder_enabled"
                  id="reminder_enabled"
                  checked={formData.reminder_enabled}
                  onChange={handleChange}
                  className="w-5 h-5 rounded text-indigo-500 bg-slate-600 border-slate-500 focus:ring-indigo-500"
                />
              </div>
              {formData.reminder_enabled && (
                <div className="mt-4">
                  <label
                    htmlFor="reminder_time"
                    className="block text-sm font-medium text-slate-400 mb-1"
                  >
                    Reminder Time
                  </label>
                  <input
                    type="time"
                    name="reminder_time"
                    id="reminder_time"
                    value={formData.reminder_time}
                    onChange={handleChange}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 bg-slate-600 hover:bg-slate-500 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition-colors"
            >
              Save Habit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default HabitForm;
