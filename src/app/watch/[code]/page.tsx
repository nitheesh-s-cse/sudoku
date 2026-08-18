"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { GameHeader } from "@/components/GameHeader";
import { SudokuBoard } from "@/components/SudokuBoard";
import { VarshiniBot } from "@/components/VarshiniBot";
import { LoadingState, EmptyState } from "@/components/StateViews";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { useSpectator } from "@/hooks/useSpectator";
import { spectatorCommentary } from "@/lib/varshini";
import confetti from "canvas-confetti";

export default function WatchRoomPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const router = useRouter();
  const { room, loading, notFound, connState, playerOnline } = useSpectator(code.toUpperCase());
  const [celebrated, setCelebrated] = useState(false);

  useEffect(() => {
    if (room?.status === "completed" && !celebrated) {
      setCelebrated(true);
      confetti({ particleCount: 160, spread: 110, origin: { y: 0.4 }, colors: ["#a855f7", "#38bdf8", "#ec4899"] });
    }
  }, [room?.status, celebrated]);

  if (loading) return <LoadingState text="Finding your player... 👀" />;

  if (notFound) {
    return (
      <main className="relative flex min-h-dvh items-center justify-center p-5">
        <AnimatedBackground />
        <EmptyState
          title="Hmm... Varshini can't find that player 😅"
          subtitle="This room may have ended or the code is wrong."
          actionLabel="TRY AGAIN"
          onAction={() => router.push("/watch")}
        />
      </main>
    );
  }

  if (!room) return <LoadingState />;

  return (
    <main className="relative min-h-dvh w-full pb-16">
      <AnimatedBackground />
      <GameHeader
        playerName={room.playerName}
        roomCode={room.roomCode}
        difficulty={room.difficulty}
        timerSeconds={room.elapsedSeconds}
        mistakes={room.mistakes}
        maxMistakes={room.maxMistakes}
        spectatorCount={room.spectatorCount}
        connState={connState}
        mode="spectator"
      />

      <div className="mx-auto max-w-3xl px-4 pt-6 text-center lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-gradient text-2xl font-black uppercase tracking-wide sm:text-3xl"
        >
          {room.playerName} is live 🔴
        </motion.h1>
        <p className="mt-1 text-sm text-slate-400">
          👀 LIVE VIEW — You are watching {room.playerName} solve Sudoku. {room.progressPercent}% complete.
        </p>
        {!playerOnline && room.status === "playing" && (
          <p className="mt-2 text-xs font-semibold text-amber-300">
            ⚠ {room.playerName}&apos;s connection looks quiet... waiting for their next move.
          </p>
        )}

        <div className="mt-6 flex justify-center">
          <SudokuBoard puzzle={room.puzzle} board={room.currentBoard} notes={room.notes} selectedCell={room.selectedCell} lastAction={room.lastAction} readOnly />
        </div>

        <div className="mt-6 flex justify-center">
          <VarshiniBot
            line={spectatorCommentary(
              room.playerName,
              room.status,
              room.lastAction?.type,
              room.lastAction ? { correct: room.lastAction.correct } : undefined,
              room.currentStreak,
              room.progressPercent
            )}
            layout="panel"
          />
        </div>

        {room.status === "completed" && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass mx-auto mt-6 max-w-sm rounded-2xl border border-white/10 p-5">
            <p className="text-lg font-bold text-emerald-300">🎉 Solved!</p>
            <p className="mt-1 text-sm text-slate-300">
              {room.playerName} finished in {Math.floor(room.elapsedSeconds / 60)}m {room.elapsedSeconds % 60}s with {room.mistakes} mistakes.
            </p>
            <Link
              href="/watch"
              className="mt-4 inline-block rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-2.5 text-sm font-bold text-white"
            >
              Watch Another
            </Link>
          </motion.div>
        )}

        {room.status === "abandoned" && (
          <p className="mt-6 text-sm text-slate-400">This game ended early. Search another player to keep watching.</p>
        )}
      </div>
    </main>
  );
}
