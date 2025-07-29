import React, { useState } from "react";
import { Edit3, Save } from "lucide-react";

function JournalEntry({ log, onSaveNote }) {
  const [isEditing, setIsEditing] = useState(false);
  const [note, setNote] = useState(log.note);

  const handleSave = () => {
    onSaveNote(log.date, note);
    setIsEditing(false);
  };

  const formattedDate = new Date(log.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC", // Ensure date is not shifted
  });

  return (
    <div className="bg-slate-700/50 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <p className="font-semibold text-slate-300">{formattedDate}</p>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 text-slate-400 hover:text-white"
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
            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            rows="3"
          ></textarea>
          <button
            onClick={handleSave}
            className="flex self-end items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1 px-3 rounded-lg"
          >
            <Save size={16} />
            <span>Save</span>
          </button>
        </div>
      ) : (
        <p className="text-slate-200 whitespace-pre-wrap">
          {note || (
            <span className="text-slate-500">No note for this day.</span>
          )}
        </p>
      )}
    </div>
  );
}

export default JournalEntry;
