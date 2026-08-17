"use client";

import { motion, AnimatePresence } from "framer-motion";
import { VarshiniBot } from "@/components/VarshiniBot";

export function LoadingState({ text = "Varshini is preparing your Sudoku... ✨" }: { text?: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
        className="h-12 w-12 rounded-full border-2 border-violet-400/30 border-t-violet-400"
      />
      <p className="text-sm text-slate-300">{text}</p>
    </div>
  );
}

export function EmptyState({
  title,
  subtitle,
  actionLabel,
  onAction,
}: {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass mx-auto flex max-w-sm flex-col items-center gap-4 rounded-3xl border border-white/10 p-8 text-center"
    >
      <VarshiniBot line={{ text: title, mood: "concerned" }} layout="panel" />
      {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-500/30 hover:brightness-110"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}

export function HowToPlayModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong safe-bottom max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-white/10 p-6 sm:rounded-3xl"
          >
            <h2 className="text-gradient text-2xl font-black">How to play Sudoku</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li>🎯 Fill the 9×9 grid so every row, column, and 3×3 box contains the digits 1-9 exactly once.</li>
              <li>👆 Tap a cell to select it, then tap a number on the pad to fill it in.</li>
              <li>🔴 3 mistakes allowed — Varshini will warn you as you get close!</li>
              <li>💡 Stuck? Tap Hint — Varshini reveals one cell (it slightly lowers your streak bragging rights, not your score).</li>
              <li>👁 Share your Room ID or QR code so friends can watch your board update live, in real time.</li>
              <li>🏆 Finish the grid correctly to trigger your victory celebration and see your stats.</li>
            </ul>
            <button
              onClick={onClose}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 py-3 text-sm font-bold text-white"
            >
              Got it!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
