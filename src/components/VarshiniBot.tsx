"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { VarshiniLine, VarshiniMood } from "@/lib/varshini";

const MOOD_RING: Record<VarshiniMood, string> = {
  idle: "shadow-[0_0_24px_4px_rgba(217,70,239,0.35)] ring-fuchsia-400/40",
  happy: "shadow-[0_0_32px_8px_rgba(52,211,153,0.45)] ring-emerald-400/50",
  excited: "shadow-[0_0_36px_10px_rgba(245,158,11,0.55)] ring-amber-400/60",
  playful: "shadow-[0_0_32px_8px_rgba(236,72,153,0.5)] ring-pink-400/50",
  worried: "shadow-[0_0_28px_6px_rgba(251,113,133,0.45)] ring-rose-400/50",
  caring: "shadow-[0_0_32px_8px_rgba(192,132,252,0.5)] ring-purple-300/50",
  thinking: "shadow-[0_0_28px_6px_rgba(56,189,248,0.45)] ring-sky-400/50",
  proud: "shadow-[0_0_36px_10px_rgba(168,85,247,0.55)] ring-purple-400/60",
  shocked: "shadow-[0_0_36px_10px_rgba(250,204,21,0.55)] ring-yellow-400/60",
  celebrating: "shadow-[0_0_40px_12px_rgba(217,70,239,0.6)] ring-fuchsia-400/70",
};

const MOOD_EMOJI: Record<VarshiniMood, string> = {
  idle: "💜",
  happy: "😊",
  excited: "🔥",
  playful: "😏",
  worried: "😅",
  caring: "🥹",
  thinking: "🤔",
  proud: "😌",
  shocked: "😳",
  celebrating: "🎉",
};

interface VarshiniBotProps {
  line: VarshiniLine | null;
  size?: "sm" | "md" | "lg";
  layout?: "floating" | "panel";
}

export function VarshiniBot({ line, size = "md", layout = "panel" }: VarshiniBotProps) {
  const [visibleLine, setVisibleLine] = useState<VarshiniLine | null>(line);
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    if (!line) return;
    setIsThinking(true);
    const thinkTimer = setTimeout(() => {
      setIsThinking(false);
      setVisibleLine(line);
    }, 280);

    const autoClearTimer = setTimeout(() => {
      setVisibleLine(null);
    }, 5500);

    return () => {
      clearTimeout(thinkTimer);
      clearTimeout(autoClearTimer);
    };
  }, [line]);

  const dims = size === "sm" ? 52 : size === "lg" ? 96 : 72;
  const mood: VarshiniMood = isThinking ? "thinking" : (visibleLine?.mood ?? "idle");

  const getMotionAnimation = () => {
    switch (mood) {
      case "excited":
      case "celebrating":
        return { scale: [1, 1.12, 1], rotate: [0, 3, -3, 0] };
      case "shocked":
        return { scale: [1, 1.2, 1] };
      case "playful":
        return { rotate: [0, 6, -6, 0], scale: [1, 1.05, 1] };
      case "worried":
        return { x: [0, -3, 3, 0] };
      case "caring":
        return { scale: [1, 1.04, 1], y: [0, -2, 0] };
      case "thinking":
        return { scale: [1, 1.05, 1] };
      case "proud":
        return { y: [0, -5, 0], scale: [1, 1.08, 1] };
      case "happy":
        return { scale: [1, 1.06, 1] };
      default:
        return { scale: [1, 1.03, 1] };
    }
  };

  return (
    <div className={`flex items-center gap-3 ${layout === "panel" ? "flex-col text-center" : "flex-row"}`}>
      <div className="relative shrink-0">
        <motion.div
          animate={getMotionAnimation()}
          transition={{ duration: mood === "idle" ? 3.2 : 0.6, repeat: Infinity, ease: "easeInOut" }}
          className={`relative overflow-hidden rounded-full ring-2 ${MOOD_RING[mood]}`}
          style={{ width: dims, height: dims }}
        >
          <Image
            src="/images/varshini-avatar.png"
            alt="Varshini AI companion avatar"
            fill
            sizes={`${dims}px`}
            className="object-cover"
            priority
          />
        </motion.div>
        <span className="absolute -bottom-1 -right-1 text-lg select-none" aria-hidden>
          {MOOD_EMOJI[mood]}
        </span>
      </div>

      <div className={layout === "panel" ? "w-full" : "min-w-0 flex-1"}>
        <div className="flex items-center justify-center gap-1.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-fuchsia-300">Varshini 💜</p>
        </div>

        <AnimatePresence mode="wait">
          {isThinking ? (
            <motion.div
              key="thinking"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="glass mt-1 rounded-2xl rounded-tl-sm px-3 py-2 text-xs italic text-slate-400 flex items-center justify-center gap-1"
            >
              <span>Varshini is watching...</span>
              <motion.span
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                👀
              </motion.span>
            </motion.div>
          ) : visibleLine ? (
            <motion.div
              key={visibleLine.text}
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="glass mt-1 rounded-2xl rounded-tl-sm px-3.5 py-2 text-sm font-medium text-slate-100 shadow-lg shadow-purple-950/20"
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
              className="mt-1 text-xs text-slate-400"
            >
              Watching your moves… 💜
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
