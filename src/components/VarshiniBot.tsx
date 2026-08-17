"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { VarshiniLine, VarshiniMood } from "@/lib/varshini";

const MOOD_RING: Record<VarshiniMood, string> = {
  idle: "shadow-[0_0_28px_6px_rgba(217,70,239,0.35)]",
  happy: "shadow-[0_0_32px_8px_rgba(52,211,153,0.4)]",
  thinking: "shadow-[0_0_28px_6px_rgba(56,189,248,0.4)]",
  surprised: "shadow-[0_0_32px_8px_rgba(250,204,21,0.4)]",
  celebrating: "shadow-[0_0_40px_10px_rgba(217,70,239,0.55)]",
  concerned: "shadow-[0_0_28px_6px_rgba(251,113,133,0.4)]",
};

const MOOD_EMOJI: Record<VarshiniMood, string> = {
  idle: "💜",
  happy: "😄",
  thinking: "🤔",
  surprised: "😲",
  celebrating: "🎉",
  concerned: "😅",
};

interface VarshiniBotProps {
  line: VarshiniLine | null;
  size?: "sm" | "md" | "lg";
  layout?: "floating" | "panel";
}

export function VarshiniBot({ line, size = "md", layout = "panel" }: VarshiniBotProps) {
  const [visibleLine, setVisibleLine] = useState<VarshiniLine | null>(line);

  useEffect(() => {
    if (!line) return;
    setVisibleLine(line);
    const timer = setTimeout(() => setVisibleLine(null), 4800);
    return () => clearTimeout(timer);
  }, [line]);

  const dims = size === "sm" ? 52 : size === "lg" ? 96 : 72;
  const mood = visibleLine?.mood ?? "idle";

  return (
    <div className={`flex items-center gap-3 ${layout === "panel" ? "flex-col text-center" : "flex-row"}`}>
      <div className="relative shrink-0">
        <motion.div
          animate={{
            scale: mood === "surprised" ? [1, 1.15, 1] : mood === "celebrating" ? [1, 1.1, 1] : [1, 1.03, 1],
          }}
          transition={{ duration: mood === "idle" ? 3.2 : 0.6, repeat: Infinity, ease: "easeInOut" }}
          className={`relative overflow-hidden rounded-full ring-2 ring-fuchsia-400/40 ${MOOD_RING[mood]}`}
          style={{ width: dims, height: dims }}
        >
          <Image
            src="/images/varshini-avatar.png"
            alt="Varshini AI companion avatar"
            fill
            sizes={`${dims}px`}
            className="object-cover"
          />
        </motion.div>
        <span className="absolute -bottom-1 -right-1 text-lg select-none" aria-hidden>
          {MOOD_EMOJI[mood]}
        </span>
      </div>

      <div className={layout === "panel" ? "w-full" : "min-w-0 flex-1"}>
        <p className="text-xs font-semibold uppercase tracking-wide text-fuchsia-300">Varshini 💜</p>
        <AnimatePresence mode="wait">
          {visibleLine ? (
            <motion.div
              key={visibleLine.text}
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="glass mt-1 rounded-2xl rounded-tl-sm px-3 py-2 text-sm text-slate-100"
              role="status"
              aria-live="polite"
            >
              {visibleLine.text}
            </motion.div>
          ) : (
            <motion.p
              key="idle-caption"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="mt-1 text-sm text-slate-400"
            >
              Watching your moves…
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
