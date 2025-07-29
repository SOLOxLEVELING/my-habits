import React from "react";

function CalendarView({ logs, habitColor }) {
  const today = new Date();
  const days = [];
  // Create a set of logged dates for quick lookup
  const loggedDates = new Set(logs.map((log) => log.date));

  // Go back 182 days (26 weeks) to fill the calendar
  for (let i = 182; i > 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    days.push(date);
  }

  const colorClass = habitColor.replace("bg-", "bg-");
  const lightColorClass = colorClass.replace("500", "400");

  return (
    <div>
      <h3 className="text-lg font-bold text-slate-200 mb-3">Consistency</h3>
      <div className="grid grid-cols-[repeat(26,minmax(0,1fr))] grid-rows-7 gap-1">
        {days.map((day, index) => {
          const logDate = day.toISOString().split("T")[0];
          const hasLog = loggedDates.has(logDate);
          return (
            <div
              key={index}
              className="w-full aspect-square rounded-[3px] bg-slate-700/50"
              title={logDate}
            >
              {hasLog && (
                <div
                  className={`w-full h-full rounded-[3px] ${lightColorClass}`}
                ></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CalendarView;
