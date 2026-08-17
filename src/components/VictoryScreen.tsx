"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { formatTime } from "@/components/GameHeader";
import { VarshiniBot } from "@/components/VarshiniBot";
import type { VarshiniLine } from "@/lib/varshini";

interface VictoryScreenProps {
  playerName: string;
  difficulty: string;
  elapsedSeconds: number;
  mistakes: number;
  hintsUsed: number;
  bestStreak: number;
  spectatorCount: number;
  isNewBest: boolean;
  varshiniLine: VarshiniLine;
  onPlayAgain?: () => void;
  onNewRoom?: () => void;
  onWatchAnother?: () => void;
  onClose?: () => void;
}

export function VictoryScreen({
  playerName,
  difficulty,
  elapsedSeconds,
  mistakes,
  hintsUsed,
  bestStreak,
  spectatorCount,
  isNewBest,
  varshiniLine,
  onPlayAgain,
  onNewRoom,
  onWatchAnother,
  onClose,
}: VictoryScreenProps) {
  useEffect(() => {
    const duration = 2000;
    const end = Date.now() + duration;
    const colors = ["#a855f7", "#38bdf8", "#ec4899", "#34d399"];

    (function frame() {
      confetti({ particleCount: 4, angle: 60, spread: 70, origin: { x: 0 }, colors });
      confetti({ particleCount: 4, angle: 120, spread: 70, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
    confetti({ particleCount: 140, spread: 100, origin: { y: 0.4 }, colors });
  }, []);

  const totalMoves = mistakes + (81 - mistakes);
  const accuracy = totalMoves > 0 ? Math.round(((totalMoves - mistakes) / totalMoves) * 100) : 100;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 250 }}
        className="glass-strong relative w-full max-w-md rounded-3xl border border-white/10 p-6 text-center sm:p-8"
      >
        <motion.h1
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 300 }}
          className="text-gradient animate-breathe text-4xl font-black sm:text-5xl"
        >
          SOLVED! 🎉
        </motion.h1>
        <p className="mt-2 text-lg font-semibold text-slate-100">{playerName}</p>
        {isNewBest && (
          <p className="mt-1 text-xs font-bold uppercase tracking-wide text-amber-300">🏆 New personal best!</p>
        )}

        <div className="mt-5 grid grid-cols-3 gap-2.5 text-left">
          <Stat label="Time" value={formatTime(elapsedSeconds)} />
          <Stat label="Difficulty" value={difficulty} capitalize />
          <Stat label="Mistakes" value={String(mistakes)} />
          <Stat label="Accuracy" value={`${accuracy}%`} />
          <Stat label="Hints" value={String(hintsUsed)} />
          <Stat label="Best streak" value={String(bestStreak)} />
        </div>

        <p className="mt-3 text-xs text-slate-400">👁 {spectatorCount} spectators watched this game</p>

        <div className="mt-5 flex justify-center">
          <VarshiniBot line={varshiniLine} layout="panel" />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          {onPlayAgain && (
            <button
              onClick={onPlayAgain}
              className="rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/30 hover:brightness-110"
            >
              Play Again
            </button>
          )}
          {onNewRoom && (
            <button
              onClick={onNewRoom}
              className="glass rounded-xl border border-white/10 py-3 text-sm font-semibold text-slate-100 hover:bg-white/10"
            >
              New Room
            </button>
          )}
          {onWatchAnother && (
            <button
              onClick={onWatchAnother}
              className="glass rounded-xl border border-white/10 py-3 text-sm font-semibold text-slate-100 hover:bg-white/10"
            >
              Watch Another
            </button>
          )}
        </div>
        {onClose && (
          <button onClick={onClose} className="mt-4 text-xs text-slate-500 hover:text-slate-300">
            Close
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}

function Stat({ label, value, capitalize }: { label: string; value: string; capitalize?: boolean }) {
  return (
    <div className="glass rounded-xl border border-white/10 px-2.5 py-2">
      <p className="text-[0.6rem] uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`text-sm font-bold text-slate-50 ${capitalize ? "capitalize" : ""}`}>{value}</p>
    </div>
  );
}
