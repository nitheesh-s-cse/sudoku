"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { generatePuzzle, rowOf, colOf } from "@/lib/sudoku";

// A decorative, self-solving mini sudoku used behind the hero copy. Generates
// once on mount (client-only) and progressively "fills in" for ambience.
export function HeroSudokuPreview() {
  const [board, setBoard] = useState<number[] | null>(null);
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    const { solution } = generatePuzzle("easy");
    setBoard(solution);
  }, []);

  useEffect(() => {
    if (!board) return;
    const interval = setInterval(() => {
      setRevealed((r) => (r >= 81 ? 0 : r + 1));
    }, 90);
    return () => clearInterval(interval);
  }, [board]);

  if (!board) return null;

  return (
    <div className="mx-auto grid aspect-square w-full max-w-md grid-cols-9 gap-[2px] rounded-2xl border border-white/10 bg-white/[0.02] p-2 opacity-70">
      {board.map((value, index) => {
        const r = rowOf(index);
        const c = colOf(index);
        const show = index < revealed;
        return (
          <div
            key={index}
            className={`flex items-center justify-center rounded-[3px] text-[0.6rem] font-semibold text-violet-200/70 sm:text-xs ${
              (Math.floor(r / 3) + Math.floor(c / 3)) % 2 === 0 ? "bg-violet-500/[0.04]" : "bg-transparent"
            }`}
          >
            {show && (
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {value}
              </motion.span>
            )}
          </div>
        );
      })}
    </div>
  );
}
