import React from "react";
import { motion } from "framer-motion";
import { Trophy, Star } from "lucide-react";

export default function LevelProgress({ totalCompletions }) {
  // 1 completion = 10 XP
  // Level = floor(XP / 100) + 1
  // 10 completions per level
  const xpPerLevel = 100;
  const xpPerCompletion = 10;
  
  const currentXP = totalCompletions * xpPerCompletion;
  const level = Math.floor(currentXP / xpPerLevel) + 1;
  const xpInCurrentLevel = currentXP % xpPerLevel;
  const progressPercent = (xpInCurrentLevel / xpPerLevel) * 100;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center gap-4 shadow-lg relative overflow-hidden transition-colors">
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <Trophy size={64} />
      </div>
      
      <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full text-slate-900 font-bold text-xl shadow-lg border-2 border-yellow-200">
        {level}
      </div>
      
      <div className="flex-1 z-10">
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
            <Star size={14} className="text-yellow-500 dark:text-yellow-400 fill-yellow-500 dark:fill-yellow-400" />
            Level {level}
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            {xpInCurrentLevel} / {xpPerLevel} XP
          </span>
        </div>
        
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-300 dark:border-slate-700">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}
