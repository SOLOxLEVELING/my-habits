// src/components/JournalEntry.jsx

import React, { useState } from "react";
import { Edit3, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function JournalEntry({ log, onSaveNote }) {
  const [isEditing, setIsEditing] = useState(false);
  const [note, setNote] = useState(log.note || "");

  const handleSave = () => {
    onSaveNote(log.log_date, note);
    setIsEditing(false);
  };

  const formattedDate = new Date(log.log_date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  return (
    <div className="bg-slate-800 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <p className="font-semibold text-slate-200 text-sm sm:text-base">
          {formattedDate}
        </p>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors text-sm"
          >
            <Edit3 size={16} />
            <span>Edit</span>
          </button>
        )}
      </div>

      <AnimatePresence>
        {isEditing ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-col gap-2 overflow-hidden"
          >
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-100"
              rows="3"
            ></textarea>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="py-1.5 px-3 bg-slate-600 hover:bg-slate-500 rounded-lg font-semibold transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-3 rounded-lg transition-colors text-sm"
              >
                <Save size={16} />
                <span>Save</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <p className="text-slate-300 whitespace-pre-wrap text-sm sm:text-base">
            {note || (
              <span className="text-slate-500">No note for this day.</span>
            )}
          </p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default JournalEntry;
