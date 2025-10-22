// src/components/JournalEntry.jsx

import React, { useState } from "react";
import { Edit3, Save } from "lucide-react";

function JournalEntry({ log, onSaveNote }) {
  const [isEditing, setIsEditing] = useState(false);
  const [note, setNote] = useState(log.notes);

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
    // Redesigned as a sub-item, not a card
    <div className="bg-slate-800 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <p className="font-semibold text-slate-200">{formattedDate}</p>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors" // Changed hover color
          >
            <Edit3 size={16} />
            <span>Edit</span>
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="flex flex-col gap-2">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            // Changed styles for textarea
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-100"
            rows="3"
          ></textarea>
          <button
            onClick={handleSave}
            // Changed button color
            className="flex self-end items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-3 rounded-lg transition-colors"
          >
            <Save size={16} />
            <span>Save</span>
          </button>
        </div>
      ) : (
        <p className="text-slate-300 whitespace-pre-wrap">
          {note || (
            <span className="text-slate-500">No note for this day.</span>
          )}
        </p>
      )}
    </div>
  );
}

export default JournalEntry;
