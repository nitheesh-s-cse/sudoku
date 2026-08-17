"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { HeroSudokuPreview } from "@/components/HeroSudokuPreview";
import { HowToPlayModal } from "@/components/StateViews";
import { formatTime } from "@/components/GameHeader";
import { getBestTime, getRecentGames, type RecentGame } from "@/lib/client-storage";

export default function HomePage() {
  const [howToOpen, setHowToOpen] = useState(false);
  const [recentGames, setRecentGames] = useState<RecentGame[]>([]);
  const [bestTimes, setBestTimes] = useState<Record<string, number | null>>({});

  useEffect(() => {
    setRecentGames(getRecentGames());
    setBestTimes({
      easy: getBestTime("easy"),
      medium: getBestTime("medium"),
      hard: getBestTime("hard"),
      extreme: getBestTime("extreme"),
    });
  }, []);

  return (
    <main className="relative min-h-dvh w-full overflow-x-hidden">
      <AnimatedBackground />

      <section className="mx-auto flex min-h-dvh max-w-5xl flex-col items-center justify-center px-5 py-16 text-center sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-1.5 text-xs font-medium text-violet-200"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Real-time multiplayer spectating is live
        </motion.div>

        <div className="relative w-full">
          <div className="absolute inset-0 -z-10 mx-auto flex items-center justify-center opacity-40 sm:opacity-60">
            <HeroSudokuPreview />
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-gradient text-[clamp(3rem,13vw,7rem)] font-black leading-[0.95] tracking-tight"
          >
            SUDOKU
            <br />
            LIVE
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mx-auto mt-5 max-w-md text-balance text-base text-slate-300 sm:text-lg"
          >
            Solve it. Master it. Let them watch.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-9 flex w-full max-w-md flex-col gap-3 sm:flex-row"
        >
          <Link
            href="/play"
            className="flex-1 rounded-2xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500 bg-[length:200%_100%] px-6 py-4 text-center text-base font-bold text-white shadow-xl shadow-violet-500/30 transition-[background-position] duration-500 hover:bg-[length:100%_100%]"
          >
            🎮 PLAY SUDOKU
          </Link>
          <Link
            href="/watch"
            className="glass flex-1 rounded-2xl border border-white/15 px-6 py-4 text-center text-base font-bold text-slate-100 hover:bg-white/10"
          >
            👁 WATCH LIVE
          </Link>
        </motion.div>

        <button
          onClick={() => setHowToOpen(true)}
          className="mt-6 text-sm font-medium text-slate-400 underline decoration-dotted underline-offset-4 hover:text-slate-200"
        >
          How to play?
        </button>
      </section>

      <section className="relative mx-auto max-w-5xl px-5 pb-20 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="glass rounded-3xl border border-white/10 p-5">
            <h2 className="text-sm font-bold uppercase tracking-wide text-violet-300">🕓 Recent Games</h2>
            {recentGames.length === 0 ? (
              <p className="mt-3 text-sm text-slate-400">No games yet — start your first Sudoku above!</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {recentGames.slice(0, 5).map((g) => (
                  <li
                    key={`${g.roomCode}-${g.playedAt}`}
                    className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2 text-sm"
                  >
                    <span className="capitalize text-slate-200">
                      {g.difficulty} · {g.roomCode}
                    </span>
                    <span className={`text-xs font-semibold ${g.status === "completed" ? "text-emerald-300" : "text-slate-400"}`}>
                      {g.status === "completed" ? formatTime(g.elapsedSeconds) : g.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="glass rounded-3xl border border-white/10 p-5">
            <h2 className="text-sm font-bold uppercase tracking-wide text-violet-300">🏆 Best Times</h2>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {(["easy", "medium", "hard", "extreme"] as const).map((d) => (
                <div key={d} className="rounded-xl bg-white/[0.03] px-3 py-2">
                  <p className="text-xs capitalize text-slate-400">{d}</p>
                  <p className="text-sm font-bold text-slate-100">
                    {bestTimes[d] ? formatTime(bestTimes[d] as number) : "—"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <HowToPlayModal open={howToOpen} onClose={() => setHowToOpen(false)} />
    </main>
  );
}
