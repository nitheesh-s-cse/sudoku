"use client";

import Link from "next/link";
import type { Difficulty } from "@/types/game";
import { ConnectionStatus, type ConnState } from "@/components/ConnectionStatus";

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
  extreme: "Extreme",
};

interface GameHeaderProps {
  playerName: string;
  roomCode: string;
  difficulty: Difficulty;
  timerSeconds: number;
  mistakes: number;
  maxMistakes: number;
  spectatorCount: number;
  connState: ConnState;
  mode: "player" | "spectator";
  onShare?: () => void;
}

export function GameHeader({
  playerName,
  roomCode,
  difficulty,
  timerSeconds,
  mistakes,
  maxMistakes,
  spectatorCount,
  connState,
  mode,
  onShare,
}: GameHeaderProps) {
  return (
    <header className="glass safe-top sticky top-0 z-30 w-full rounded-b-2xl border-b border-white/10 px-3 py-2.5 sm:px-5">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <Link href="/" className="shrink-0 text-lg font-black tracking-tight text-gradient sm:text-xl">
            SL
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="truncate text-sm font-semibold text-slate-50 sm:text-base">{playerName}</p>
              {mode === "player" && (
                <span className="flex items-center gap-1 rounded-full bg-rose-500/15 px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide text-rose-300">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-400" /> Live
                </span>
              )}
            </div>
            <p className="truncate text-[0.68rem] text-slate-400">
              {roomCode} · {DIFFICULTY_LABEL[difficulty]}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-1 text-xs text-slate-300 sm:flex">
            <span aria-hidden>👁</span>
            {spectatorCount} watching
          </div>
          <div className="glass rounded-lg px-2 py-1 text-xs font-semibold tabular-nums text-slate-100 sm:text-sm">
            ⏱ {formatTime(timerSeconds)}
          </div>
          <div
            className={`glass rounded-lg px-2 py-1 text-xs font-semibold tabular-nums sm:text-sm ${
              mistakes >= maxMistakes ? "text-rose-300" : "text-slate-100"
            }`}
          >
            ❌ {mistakes}/{maxMistakes}
          </div>
          {onShare && (
            <button
              type="button"
              onClick={onShare}
              className="glass hidden rounded-lg px-2.5 py-1.5 text-xs font-semibold text-violet-200 hover:bg-white/10 sm:block"
            >
              Share
            </button>
          )}
          <ConnectionStatus state={connState} compact />
        </div>
      </div>
      <div className="mx-auto mt-1 flex max-w-4xl items-center justify-between text-[0.65rem] text-slate-400 sm:hidden">
        <span>👁 {spectatorCount} watching</span>
        {onShare && (
          <button type="button" onClick={onShare} className="font-semibold text-violet-300">
            Share Room ↗
          </button>
        )}
      </div>
    </header>
  );
}

export { formatTime };
