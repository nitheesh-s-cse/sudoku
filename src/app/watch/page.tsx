"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { EmptyState } from "@/components/StateViews";
import { VarshiniBot } from "@/components/VarshiniBot";

export default function WatchEntryPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  async function handleSearch() {
    const trimmed = query.trim();
    if (trimmed.length < 2) return;
    setLoading(true);
    setNotFound(false);
    try {
      const res = await fetch(`/api/rooms/search?query=${encodeURIComponent(trimmed)}`);
      if (!res.ok) {
        setNotFound(true);
        return;
      }
      const data = await res.json();
      router.push(`/watch/${data.room.roomCode}`);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-x-hidden px-5 py-10">
      <AnimatedBackground />
      <Link href="/" className="safe-top absolute left-5 top-5 text-sm font-medium text-slate-400 hover:text-slate-200">
        ← Back
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong w-full max-w-sm rounded-3xl border border-white/10 p-7"
      >
        <h1 className="text-2xl font-black text-slate-50">Who do you want to watch?</h1>
        <p className="mt-1 text-sm text-slate-400">Enter a player name or Room ID.</p>

        <input
          autoFocus
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setNotFound(false);
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="e.g. Nitheesh or SUD-7K92X"
          className="mt-6 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-base text-slate-50 outline-none placeholder:text-slate-500 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-400/30"
        />

        <button
          onClick={handleSearch}
          disabled={loading || query.trim().length < 2}
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-500/30 hover:brightness-110 disabled:opacity-50"
        >
          {loading ? "Searching..." : "WATCH LIVE 👁"}
        </button>

        {!notFound && (
          <div className="mt-6">
            <VarshiniBot line={{ text: "Finding your player... 👀", mood: "thinking" }} layout="floating" size="sm" />
          </div>
        )}
      </motion.div>

      {notFound && (
        <div className="mt-6 w-full max-w-sm">
          <EmptyState
            title="Hmm... Varshini can't find that player 😅"
            subtitle="Double-check the spelling or ask them for their Room ID."
            actionLabel="TRY AGAIN"
            onAction={() => setNotFound(false)}
          />
        </div>
      )}
    </main>
  );
}
