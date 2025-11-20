import React from "react";
import { motion } from "framer-motion";
import { Medal, Flame, Zap, Crown } from "lucide-react";

export default function BadgeList({ habits }) {
  // Calculate streaks
  const getStreak = (habit) => {
    // Simplified streak calculation for demo
    // In a real app, this would be more robust based on consecutive days
    if (!habit.logs || habit.logs.length === 0) return 0;
    
    const sortedLogs = [...habit.logs].sort((a, b) => new Date(b.log_date) - new Date(a.log_date));
    const today = new Date().toISOString().split('T')[0];
    
    // Check if completed today or yesterday to keep streak alive
    const lastLog = sortedLogs[0].log_date.split('T')[0];
    // Simple check: just return log count as "streak" for this MVP to show progress easily
    // Real implementation would check consecutive dates
    return habit.logs.length; 
  };

  const maxStreak = habits.reduce((max, h) => Math.max(max, getStreak(h)), 0);

  const badges = [
    {
      id: "starter",
      name: "Starter",
      desc: "3 day streak",
      icon: <Zap size={20} />,
      color: "text-blue-400",
      bg: "bg-blue-400/10 border-blue-400/20",
      unlocked: maxStreak >= 3
    },
    {
      id: "consistent",
      name: "Consistent",
      desc: "7 day streak",
      icon: <Medal size={20} />,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10 border-emerald-400/20",
      unlocked: maxStreak >= 7
    },
    {
      id: "master",
      name: "Master",
      desc: "30 day streak",
      icon: <Crown size={20} />,
      color: "text-yellow-400",
      bg: "bg-yellow-400/10 border-yellow-400/20",
      unlocked: maxStreak >= 30
    },
    {
      id: "onfire",
      name: "On Fire",
      desc: "10+ streak",
      icon: <Flame size={20} />,
      color: "text-orange-500",
      bg: "bg-orange-500/10 border-orange-500/20",
      unlocked: maxStreak >= 10
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {badges.map((badge) => (
        <div 
          key={badge.id}
          className={`p-3 rounded-lg border flex flex-col items-center text-center transition-all ${
            badge.unlocked 
              ? `${badge.bg} border-opacity-50` 
              : "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-40 grayscale"
          }`}
        >
          <div className={`mb-2 p-2 rounded-full bg-white dark:bg-slate-950 ${badge.unlocked ? badge.color : "text-slate-400 dark:text-slate-600"}`}>
            {badge.icon}
          </div>
          <div className="font-bold text-sm text-slate-800 dark:text-slate-200">{badge.name}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">{badge.desc}</div>
        </div>
      ))}
    </div>
  );
}
