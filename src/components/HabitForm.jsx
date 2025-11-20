// src/components/HabitForm.jsx

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const dayNameToIso = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };

const iconOptions = [ "📚", "🏃", "💧", "🧘", "🎨", "🎸", "💻", "🥕", "💪", "✍️" ];
const colorOptions = [ "bg-blue-500", "bg-green-500", "bg-sky-400", "bg-purple-500", "bg-red-500", "bg-yellow-500", "bg-indigo-500", "bg-pink-500" ];

const getInitialFormData = (habit) => {
    const isDaily = habit?.frequency_type === 'daily';
    // If habit exists and is daily, pre-fill all days. Otherwise, use provided frequency.
    const frequency_days = isDaily ? [...daysOfWeek] : (habit?.frequency || []);

    return {
        name: habit?.name || "",
        description: habit?.description || "",
        color: habit?.color || colorOptions[0],
        icon: habit?.icon || iconOptions[0],
        frequency_type: habit?.frequency_type || 'specific_days',
        frequency_days: frequency_days,
        reminder_enabled: habit?.reminder_enabled || false,
        reminder_time: habit?.reminder_time || "09:00",
        category: habit?.category || "Health",
    };
};


function HabitForm({ habit, onSave, onClose }) {
  const [formData, setFormData] = useState(getInitialFormData(habit));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFrequencyDayChange = (day) => {
    if (formData.frequency_type !== 'specific_days') return;

    setFormData((prev) => {
      const newFrequency = prev.frequency_days.includes(day)
        ? prev.frequency_days.filter((d) => d !== day)
        : [...prev.frequency_days, day];
      return { ...prev, frequency_days: newFrequency };
    });
  };

  const handleFrequencyTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      frequency_type: type,
      frequency_days: type === 'daily' ? [...daysOfWeek] : [],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const dataToSave = {
      name: formData.name,
      description: formData.description,
      color: formData.color,
      icon: formData.icon,
      frequency_type: formData.frequency_type,
      reminder_enabled: formData.reminder_enabled,
      reminder_time: formData.reminder_time,
      category: formData.category,
    };

    if (formData.frequency_type === 'daily') {
      dataToSave.frequency_details = null;
    } else {
      dataToSave.frequency_details = {
        days: formData.frequency_days.map(day => dayNameToIso[day]).sort(),
      };
    }
    
    onSave(dataToSave);
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring", damping: 20, stiffness: 200 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl w-full max-w-md m-4 border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          {habit ? "Edit Habit" : "Create New Habit"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Habit Name</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-slate-100 transition-colors" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Description (Optional)</label>
            <input type="text" name="description" id="description" value={formData.description} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-slate-100 transition-colors" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Icon, Color & Category</label>
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <div className="relative w-1/2">
                  <label htmlFor="icon" className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Icon</label>
                  <select name="icon" id="icon" value={formData.icon} onChange={handleChange} className="w-full appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg pl-3 pr-8 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg transition-colors" style={{ fontSize: "1.25rem" }}>
                    {iconOptions.map((icon) => <option key={icon} value={icon} style={{ fontSize: "1.25rem" }}>{icon}</option>)}
                  </select>
                </div>
                <div className="w-1/2">
                  <label htmlFor="category" className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Category</label>
                  <select name="category" id="category" value={formData.category} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-slate-100 text-sm transition-colors">
                    <option value="Health">Health</option>
                    <option value="Work">Work</option>
                    <option value="Learning">Learning</option>
                    <option value="Mindfulness">Mindfulness</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Color</label>
                <div className="grid grid-cols-8 gap-2">
                  {colorOptions.map((color) => (
                    <button type="button" key={color} onClick={() => setFormData((prev) => ({ ...prev, color }))} className={`w-full aspect-square rounded-md ${color} ${formData.color === color ? "ring-2 ring-offset-2 ring-offset-slate-100 dark:ring-offset-slate-900 ring-slate-400 dark:ring-white" : ""}`}></button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Frequency</label>
            <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg mb-3 border border-slate-200 dark:border-slate-700">
              <button type="button" onClick={() => handleFrequencyTypeChange('daily')} className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${formData.frequency_type === 'daily' ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"}`}>Daily</button>
              <button type="button" onClick={() => handleFrequencyTypeChange('specific_days')} className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${formData.frequency_type === 'specific_days' ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"}`}>Specific Days</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {daysOfWeek.map((day) => (
                <button type="button" key={day} onClick={() => handleFrequencyDayChange(day)} className={`flex-1 px-2 py-1.5 text-xs font-semibold rounded-full transition-colors ${formData.frequency_days.includes(day) ? "bg-slate-600 text-white" : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700"} ${formData.frequency_type === 'daily' ? 'cursor-not-allowed opacity-50' : ''}`}>
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Smart Reminders</label>
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <label htmlFor="reminder_enabled" className="font-semibold text-slate-900 dark:text-slate-100">Enable Notifications</label>
                <input type="checkbox" name="reminder_enabled" id="reminder_enabled" checked={formData.reminder_enabled} onChange={handleChange} className="w-5 h-5 rounded text-blue-500 bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:ring-blue-500" />
              </div>
              <AnimatePresence>
                {formData.reminder_enabled && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-4 overflow-hidden">
                    <label htmlFor="reminder_time" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Reminder Time</label>
                    <input type="time" name="reminder_time" id="reminder_time" value={formData.reminder_time} onChange={handleChange} className="w-full bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-slate-100" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="py-2 px-4 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg font-semibold transition-colors">Cancel</button>
            <button type="submit" className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow-lg shadow-blue-500/30">Save Habit</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default HabitForm;
