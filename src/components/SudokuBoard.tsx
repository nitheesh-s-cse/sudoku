"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { boxOf, colOf, rowOf } from "@/lib/sudoku";

interface LastActionLike {
  cell: number;
  value: number;
  correct: boolean;
  at: number;
  type?: string;
}

interface SudokuBoardProps {
  puzzle: number[];
  board: number[];
  notes?: number[][];
  selectedCell: number;
  onSelectCell?: (index: number) => void;
  lastAction?: LastActionLike | null;
  readOnly?: boolean;
  dimmed?: boolean;
}

export function SudokuBoard({
  puzzle,
  board,
  notes,
  selectedCell,
  onSelectCell,
  lastAction,
  readOnly = false,
  dimmed = false,
}: SudokuBoardProps) {
  const [flash, setFlash] = useState<{ cell: number; correct: boolean; key: number } | null>(null);

  useEffect(() => {
    if (!lastAction || lastAction.type === "erase") return;
    setFlash({ cell: lastAction.cell, correct: lastAction.correct, key: lastAction.at });
    const timer = setTimeout(() => setFlash(null), 550);
    return () => clearTimeout(timer);
  }, [lastAction]);

  const selectedValue = selectedCell >= 0 ? board[selectedCell] : 0;
  const selectedRow = selectedCell >= 0 ? rowOf(selectedCell) : -1;
  const selectedCol = selectedCell >= 0 ? colOf(selectedCell) : -1;
  const selectedBox = selectedCell >= 0 ? boxOf(selectedCell) : -1;

  const cells = useMemo(() => Array.from({ length: 81 }, (_, i) => i), []);

  return (
    <div
      className={`relative mx-auto aspect-square w-full max-w-[min(94vw,540px)] select-none rounded-2xl border border-white/10 bg-slate-950/60 p-1.5 shadow-2xl transition-opacity ${dimmed ? "opacity-40" : ""}`}
    >
      <div className="grid h-full w-full grid-cols-9 grid-rows-9 gap-0 overflow-hidden rounded-xl">
        {cells.map((index) => {
          const r = rowOf(index);
          const c = colOf(index);
          const box = boxOf(index);
          const value = board[index];
          const isGiven = puzzle[index] !== 0;
          const isSelected = index === selectedCell;
          const isPeer = r === selectedRow || c === selectedCol || box === selectedBox;
          const cellNotes = notes?.[index] ?? [];

          const isFlashing = flash?.cell === index;
          const flashCorrect = flash?.correct;

          const borderRight = c % 3 === 2 && c !== 8 ? "border-r-2 border-r-violet-400/40" : "border-r border-r-white/5";
          const borderBottom = r % 3 === 2 && r !== 8 ? "border-b-2 border-b-violet-400/40" : "border-b border-b-white/5";

          let bg = "bg-transparent";
          if (isSelected) bg = "bg-violet-500/35";
          else if (isPeer) bg = "bg-white/[0.04]";

          return (
            <button
              key={index}
              type="button"
              disabled={readOnly}
              aria-label={`Row ${r + 1} column ${c + 1}${value ? `, value ${value}` : ", empty"}`}
              onClick={() => onSelectCell?.(index)}
              className={`relative flex items-center justify-center ${borderRight} ${borderBottom} ${bg} ${
                readOnly ? "cursor-default" : "cursor-pointer active:bg-violet-500/40"
              } transition-colors duration-150 ${isFlashing && !flashCorrect ? "animate-shake animate-error-glow" : ""} ${
                isFlashing && flashCorrect ? "animate-pulse-glow" : ""
              }`}
            >
              {value !== 0 ? (
                <motion.span
                  key={`${index}-${value}`}
                  initial={{ scale: 0.3, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 420, damping: 22 }}
                  className={`text-[clamp(0.95rem,3.6vw,1.5rem)] font-semibold ${
                    isGiven
                      ? "text-slate-200"
                      : isFlashing && !flashCorrect
                        ? "text-rose-300"
                        : "text-sky-300"
                  }`}
                >
                  {value}
                </motion.span>
              ) : cellNotes.length > 0 ? (
                <div className="grid grid-cols-3 gap-0 p-0.5 text-[0.5rem] leading-none text-slate-500">
                  {Array.from({ length: 9 }, (_, n) => n + 1).map((n) => (
                    <span key={n} className="flex h-[1.1em] w-[1.1em] items-center justify-center">
                      {cellNotes.includes(n) ? n : ""}
                    </span>
                  ))}
                </div>
              ) : null}

              {isSelected && !readOnly && (
                <motion.span
                  layoutId="cell-cursor"
                  className="pointer-events-none absolute inset-0 rounded-[3px] ring-2 ring-violet-400/70"
                  transition={{ type: "spring", stiffness: 500, damping: 32 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
