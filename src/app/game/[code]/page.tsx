"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { GameHeader } from "@/components/GameHeader";
import { SudokuBoard } from "@/components/SudokuBoard";
import { NumberPad } from "@/components/NumberPad";
import { VarshiniBot } from "@/components/VarshiniBot";
import { RoomShareModal } from "@/components/RoomShareModal";
import { VictoryScreen } from "@/components/VictoryScreen";
import { LoadingState, EmptyState } from "@/components/StateViews";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { usePlayerGame } from "@/hooks/usePlayerGame";
import { addRecentGame, setBestTimeIfBetter } from "@/lib/client-storage";
import { reactToVictory } from "@/lib/varshini";

export default function GamePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const router = useRouter();
  const {
    room,
    loading,
    unauthorized,
    notFound,
    connState,
    varshiniLine,
    selectCell,
    placeNumber,
    eraseSelected,
    requestHint,
    togglePause,
    remaining,
  } = usePlayerGame(code.toUpperCase());

  const [shareOpen, setShareOpen] = useState(false);
  const [savedResult, setSavedResult] = useState(false);
  const [isNewBest, setIsNewBest] = useState(false);

  useEffect(() => {
    if (room && room.status === "completed" && !savedResult) {
      setSavedResult(true);
      addRecentGame({
        roomCode: room.roomCode,
        playerName: room.playerName,
        difficulty: room.difficulty,
        status: "completed",
        elapsedSeconds: room.elapsedSeconds,
        playedAt: Date.now(),
      });
      setIsNewBest(setBestTimeIfBetter(room.difficulty, room.elapsedSeconds));
    }
    if (room && room.status === "abandoned" && !savedResult) {
      setSavedResult(true);
      addRecentGame({
        roomCode: room.roomCode,
        playerName: room.playerName,
        difficulty: room.difficulty,
        status: "abandoned",
        elapsedSeconds: room.elapsedSeconds,
        playedAt: Date.now(),
      });
    }
  }, [room, savedResult]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!room || room.selectedCell < 0) return;
      if (e.key >= "1" && e.key <= "9") placeNumber(Number(e.key));
      if (e.key === "Backspace" || e.key === "Delete") eraseSelected();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [room, placeNumber, eraseSelected]);

  if (loading) return <LoadingState />;

  if (notFound) {
    return (
      <main className="relative flex min-h-dvh items-center justify-center p-5">
        <AnimatedBackground />
        <EmptyState
          title="This room doesn't exist anymore 😅"
          subtitle="It may have expired or the code was mistyped."
          actionLabel="Start a new game"
          onAction={() => router.push("/play")}
        />
      </main>
    );
  }

  if (unauthorized) {
    return (
      <main className="relative flex min-h-dvh items-center justify-center p-5">
        <AnimatedBackground />
        <EmptyState
          title="This isn't your game to play 👀"
          subtitle="Looks like this Room ID belongs to someone else. Want to watch instead?"
          actionLabel="Watch this room live"
          onAction={() => router.push(`/watch/${code.toUpperCase()}`)}
        />
      </main>
    );
  }

  if (!room) return <LoadingState />;

  const isPaused = room.status === "paused";
  const isGameOver = room.status === "abandoned";

  return (
    <main className="relative min-h-dvh w-full pb-40 lg:pb-10">
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
        mode="player"
        onShare={() => setShareOpen(true)}
      />

      <div className="mx-auto grid max-w-5xl gap-6 px-4 pt-6 lg:grid-cols-[1fr_280px] lg:px-8">
        <div className="order-1">
          <div className="mb-4 flex items-center justify-between lg:hidden">
            <VarshiniBot line={varshiniLine} layout="floating" size="sm" />
            <button onClick={togglePause} className="glass rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-200">
              {isPaused ? "▶ Resume" : "⏸ Pause"}
            </button>
          </div>

          <SudokuBoard
            puzzle={room.puzzle}
            board={room.currentBoard}
            notes={room.notes}
            selectedCell={room.selectedCell}
            onSelectCell={selectCell}
            lastAction={room.lastAction}
            dimmed={isPaused || isGameOver}
          />

          {isPaused && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={togglePause}
                className="rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/30"
              >
                ▶ Resume Game
              </button>
            </div>
          )}

          <div className="fixed inset-x-0 bottom-0 z-20 mt-6 border-t border-white/10 bg-slate-950/80 px-4 pb-3 pt-3 backdrop-blur-xl lg:static lg:border-0 lg:bg-transparent lg:px-0 lg:pb-0 lg:pt-6 safe-bottom">
            <NumberPad remaining={remaining} onNumber={placeNumber} onErase={eraseSelected} onHint={requestHint} disabled={isPaused || isGameOver} />
          </div>
        </div>

        <aside className="order-2 hidden lg:block">
          <div className="glass sticky top-24 rounded-3xl border border-white/10 p-5">
            <VarshiniBot line={varshiniLine} layout="panel" size="lg" />
            <div className="mt-6 space-y-2 text-sm">
              <StatRow label="Streak" value={String(room.currentStreak)} />
              <StatRow label="Best streak" value={String(room.bestStreak)} />
              <StatRow label="Hints used" value={String(room.hintsUsed)} />
              <StatRow label="Progress" value={`${room.progressPercent}%`} />
            </div>
            <button
              onClick={togglePause}
              className="glass mt-5 w-full rounded-xl border border-white/10 py-2.5 text-sm font-semibold text-slate-200 hover:bg-white/10"
            >
              {isPaused ? "▶ Resume" : "⏸ Pause"}
            </button>
            <Link href="/play" className="mt-2 block text-center text-xs text-slate-500 hover:text-slate-300">
              Leave game
            </Link>
          </div>
        </aside>
      </div>

      <RoomShareModal roomCode={room.roomCode} playerName={room.playerName} open={shareOpen} onClose={() => setShareOpen(false)} />

      {room.status === "completed" && (
        <VictoryScreen
          playerName={room.playerName}
          difficulty={room.difficulty}
          elapsedSeconds={room.elapsedSeconds}
          mistakes={room.mistakes}
          hintsUsed={room.hintsUsed}
          bestStreak={room.bestStreak}
          spectatorCount={room.spectatorCount}
          isNewBest={isNewBest}
          varshiniLine={reactToVictory(room.elapsedSeconds, room.difficulty)}
          onPlayAgain={() => router.push("/play")}
          onNewRoom={() => router.push("/play")}
          onWatchAnother={() => router.push("/watch")}
        />
      )}

      {isGameOver && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-5 backdrop-blur-md"
        >
          <div className="glass-strong w-full max-w-sm rounded-3xl border border-white/10 p-7 text-center">
            <h1 className="text-3xl font-black text-rose-300">GAME OVER</h1>
            <p className="mt-2 text-sm text-slate-400">Too many mistakes — but every attempt makes you sharper!</p>
            <div className="mt-4">
              <VarshiniBot line={{ text: "Parava illa di, next round semma-ah try pannu! 💜", mood: "concerned" }} layout="panel" />
            </div>
            <button
              onClick={() => router.push("/play")}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 py-3 text-sm font-bold text-white"
            >
              Try Again
            </button>
          </div>
        </motion.div>
      )}
    </main>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2">
      <span className="text-slate-400">{label}</span>
      <span className="font-semibold text-slate-100">{value}</span>
    </div>
  );
}
