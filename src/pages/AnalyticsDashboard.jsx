import React from "react";
import HabitHeatmap from "../components/HabitHeatmap";
import ProgressChart from "../components/ProgressChart";
import { BarChart2, Calendar as CalendarIcon } from "lucide-react";

export default function AnalyticsDashboard({ habits }) {
  // Flatten all logs for the ProgressChart
  const allLogs = habits.flatMap(h => h.logs || []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <BarChart2 className="text-blue-600 dark:text-blue-500" />
          Analytics
        </h2>
        <p className="text-slate-500 dark:text-slate-400">Visualize your progress and consistency.</p>
      </header>

      <section>
        <HabitHeatmap habits={habits} />
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">Weekly Overview</h3>
          <ProgressChart logs={allLogs} />
        </div>
        
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-center items-center text-center shadow-sm transition-colors">
          <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
            <CalendarIcon className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Detailed History</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-4">Select a specific habit from the dashboard to view its full calendar history.</p>
        </div>
      </section>
    </div>
  );
}
