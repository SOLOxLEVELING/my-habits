import React from "react";

function ProgressChart({ logs }) {
  // Simple logic to get completions for the last 4 weeks
  const getWeeklyCompletions = () => {
    const today = new Date();
    const weeklyData = [0, 0, 0, 0];
    const weeksAgo = [
      new Date(new Date().setDate(today.getDate() - 28)),
      new Date(new Date().setDate(today.getDate() - 21)),
      new Date(new Date().setDate(today.getDate() - 14)),
      new Date(new Date().setDate(today.getDate() - 7)),
    ];

    logs.forEach((log) => {
      const logDate = new Date(log.date);
      if (logDate >= weeksAgo[0] && logDate < weeksAgo[1]) weeklyData[0]++;
      else if (logDate >= weeksAgo[1] && logDate < weeksAgo[2]) weeklyData[1]++;
      else if (logDate >= weeksAgo[2] && logDate < weeksAgo[3]) weeklyData[2]++;
      else if (logDate >= weeksAgo[3]) weeklyData[3]++;
    });
    return weeklyData;
  };

  const weeklyCompletions = getWeeklyCompletions();
  const maxCompletions = Math.max(...weeklyCompletions, 1); // Avoid division by zero
  const labels = ["3w ago", "2w ago", "Last wk", "This wk"];

  return (
    <div>
      <h3 className="text-lg font-bold text-slate-200 mb-3">Weekly Progress</h3>
      <div className="flex justify-around items-end h-40 bg-slate-800/50 p-4 rounded-lg">
        {weeklyCompletions.map((count, index) => (
          <div key={index} className="flex flex-col items-center w-1/4">
            <div className="text-sm font-bold text-slate-100">{count}</div>
            <div
              className="w-8 bg-indigo-500 rounded-t-sm transition-all duration-300"
              style={{ height: `${(count / maxCompletions) * 100}%` }}
              title={`${count} completions`}
            ></div>
            <div className="text-xs text-slate-400 mt-1">{labels[index]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProgressChart;
