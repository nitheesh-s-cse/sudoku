"use client";

import { motion } from "framer-motion";
import type { Difficulty } from "@/types/game";

const OPTIONS: { id: Difficulty; label: string; desc: string; clues: string; color: string }[] = [
  { id: "easy", label: "Easy", desc: "Relaxed warm-up", clues: "40-45 clues", color: "from-emerald-400 to-teal-400" },
  { id: "medium", label: "Medium", desc: "Balanced challenge", clues: "32-36 clues", color: "from-sky-400 to-blue-500" },
  { id: "hard", label: "Hard", desc: "For sharp minds", clues: "26-30 clues", color: "from-violet-400 to-purple-500" },
  { id: "extreme", label: "Extreme", desc: "Brutal logic only", clues: "22-25 clues", color: "from-rose-400 to-fuchsia-500" },
];

interface DifficultySelectorProps {
  value: Difficulty;
  onChange: (d: Difficulty) => void;
}

export function DifficultySelector({ value, onChange }: DifficultySelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {OPTIONS.map((opt) => {
        const active = value === opt.id;
        return (
          <motion.button
            key={opt.id}
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(opt.id)}
            className={`glass relative overflow-hidden rounded-2xl border p-4 text-left transition-all ${
              active ? "border-violet-400/70 glow-violet" : "border-white/10 hover:border-white/20"
            }`}
          >
            {active && (
              <motion.div
                layoutId="difficulty-glow"
                className={`absolute inset-0 -z-10 bg-gradient-to-br ${opt.color} opacity-20`}
              />
            )}
            <p className="text-base font-bold text-slate-50">{opt.label}</p>
            <p className="mt-0.5 text-xs text-slate-400">{opt.desc}</p>
            <p className="mt-2 text-[0.65rem] font-medium uppercase tracking-wide text-violet-300">{opt.clues}</p>
          </motion.button>
        );
      })}
    </div>
  );
}
