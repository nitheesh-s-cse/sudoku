"use client";

import { motion } from "framer-motion";

interface NumberPadProps {
  remaining: Record<number, number>;
  onNumber: (n: number) => void;
  onErase: () => void;
  onHint?: () => void;
  disabled?: boolean;
}

export function NumberPad({ remaining, onNumber, onErase, onHint, disabled }: NumberPadProps) {
  return (
    <div className="mx-auto w-full max-w-[min(94vw,540px)] space-y-2">
      <div className="grid grid-cols-9 gap-1.5 sm:gap-2">
        {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => {
          const left = remaining[n] ?? 0;
          const isDone = left <= 0;
          return (
            <motion.button
              key={n}
              type="button"
              disabled={disabled || isDone}
              whileTap={{ scale: 0.86 }}
              onClick={() => onNumber(n)}
              className={`glass flex aspect-square flex-col items-center justify-center rounded-xl border border-white/10 text-base font-semibold transition-colors sm:text-lg ${
                isDone ? "opacity-25" : "text-slate-50 hover:bg-white/10 active:bg-violet-500/30"
              }`}
            >
              <span>{n}</span>
              <span className="text-[0.5rem] font-normal text-slate-400 sm:text-[0.6rem]">{left} left</span>
            </motion.button>
          );
        })}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <motion.button
          type="button"
          disabled={disabled}
          whileTap={{ scale: 0.9 }}
          onClick={onErase}
          className="glass flex items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-slate-100 hover:bg-white/10 active:bg-white/20"
          aria-label="Erase"
        >
          <span className="text-lg">⌫</span> Erase
        </motion.button>
        {onHint && (
          <motion.button
            type="button"
            disabled={disabled}
            whileTap={{ scale: 0.9 }}
            onClick={onHint}
            className="glass flex items-center justify-center gap-1.5 rounded-xl border border-fuchsia-400/30 py-3 text-sm font-medium text-fuchsia-200 hover:bg-fuchsia-500/10"
            aria-label="Get a hint from Varshini"
          >
            <span className="text-lg">💡</span> Hint
          </motion.button>
        )}
      </div>
    </div>
  );
}
