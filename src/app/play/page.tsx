"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { DifficultySelector } from "@/components/DifficultySelector";
import { RoomShareModal } from "@/components/RoomShareModal";
import { VarshiniBot } from "@/components/VarshiniBot";
import type { Difficulty, CreateRoomResponse } from "@/types/game";
import { getStoredPlayerName, setStoredPlayerName, setRoomToken } from "@/lib/client-storage";
import { reactToStart } from "@/lib/varshini";

type Step = "name" | "difficulty" | "share";

export default function PlayPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("name");
  const [name, setName] = useState(getStoredPlayerName());
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [createdRoom, setCreatedRoom] = useState<CreateRoomResponse | null>(null);

  function validateName(value: string) {
    const trimmed = value.trim();
    if (trimmed.length < 2 || trimmed.length > 20) return "Name must be 2-20 characters.";
    if (!/^[\p{L}\p{N}\s_.-]+$/u.test(trimmed)) return "Use letters, numbers, and spaces only.";
    return "";
  }

  function handleNameSubmit() {
    const err = validateName(name);
    if (err) {
      setError(err);
      return;
    }
    setError("");
    setStoredPlayerName(name.trim());
    setStep("difficulty");
  }

  async function handleStartGame() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName: name.trim(), difficulty }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Could not create room");
      }
      const data: CreateRoomResponse = await res.json();
      setRoomToken(data.room.roomCode, data.playerToken);
      setCreatedRoom(data);
      setStep("share");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-x-hidden px-5 py-10">
      <AnimatedBackground />

      <Link href="/" className="absolute left-5 top-5 text-sm font-medium text-slate-400 hover:text-slate-200 safe-top">
        ← Back
      </Link>

      <AnimatePresence mode="wait">
        {step === "name" && (
          <motion.div
            key="name"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-strong w-full max-w-sm rounded-3xl border border-white/10 p-7"
          >
            <h1 className="text-2xl font-black text-slate-50">Who&apos;s solving today?</h1>
            <p className="mt-1 text-sm text-slate-400">Enter your name to get started.</p>

            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleNameSubmit()}
              placeholder="Enter your name"
              maxLength={20}
              className="mt-6 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-base text-slate-50 outline-none placeholder:text-slate-500 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-400/30"
            />
            {error && <p className="mt-2 text-sm text-rose-300">{error}</p>}

            <button
              onClick={handleNameSubmit}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-500/30 hover:brightness-110"
            >
              START GAME →
            </button>

            <div className="mt-6">
              <VarshiniBot line={{ text: "Naan Varshini! Ready-ah unga peru sollunga 💜", mood: "idle" }} layout="floating" size="sm" />
            </div>
          </motion.div>
        )}

        {step === "difficulty" && (
          <motion.div
            key="difficulty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-strong w-full max-w-md rounded-3xl border border-white/10 p-7"
          >
            <h1 className="text-2xl font-black text-slate-50">Pick your difficulty</h1>
            <p className="mt-1 text-sm text-slate-400">Every game is a freshly generated, unique puzzle.</p>

            <div className="mt-6">
              <DifficultySelector value={difficulty} onChange={setDifficulty} />
            </div>

            {error && <p className="mt-3 text-sm text-rose-300">{error}</p>}

            <button
              onClick={handleStartGame}
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-500/30 hover:brightness-110 disabled:opacity-60"
            >
              {loading ? "Generating your puzzle..." : "CREATE ROOM →"}
            </button>
            <button onClick={() => setStep("name")} className="mt-3 w-full text-xs text-slate-500 hover:text-slate-300">
              ← Change name
            </button>
          </motion.div>
        )}

        {step === "share" && createdRoom && (
          <motion.div
            key="share"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-strong w-full max-w-sm rounded-3xl border border-white/10 p-7 text-center"
          >
            <h1 className="text-2xl font-black text-slate-50">You&apos;re all set, {createdRoom.room.playerName}!</h1>
            <p className="mt-2 text-sm text-slate-400">Share this Room ID with friends to let them watch you live.</p>

            <p className="mt-5 text-xs uppercase tracking-wide text-slate-400">Room ID</p>
            <p className="text-gradient text-3xl font-black tracking-[0.15em]">{createdRoom.room.roomCode}</p>

            <div className="mt-5">
              <VarshiniBot line={reactToStart(difficulty)} layout="panel" />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <ShareButtons room={createdRoom} />
              <button
                onClick={() => router.push(`/game/${createdRoom.room.roomCode}`)}
                className="rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-500/30 hover:brightness-110"
              >
                START SOLVING →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function ShareButtons({ room }: { room: CreateRoomResponse }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="glass rounded-xl border border-white/10 py-3.5 text-sm font-semibold text-slate-100 hover:bg-white/10"
      >
        COPY / SHARE ROOM ID
      </button>
      <RoomShareModal roomCode={room.room.roomCode} playerName={room.room.playerName} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
