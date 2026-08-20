"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getStoredUser,
  setStoredUser,
  clearStoredUser,
  type UserSession,
} from "@/lib/client-storage";

interface HistoryItem {
  roomCode: string;
  playerName: string;
  difficulty: string;
  status: string;
  elapsedSeconds: number;
  mistakes: number;
  hintsUsed: number;
  playedAt: number;
}

interface UserAuthModalProps {
  open: boolean;
  onClose: () => void;
  onUserChange?: (user: UserSession | null) => void;
  onResumeRoom?: (roomCode: string, token?: string) => void;
}

export function UserAuthModal({
  open,
  onClose,
  onUserChange,
  onResumeRoom,
}: UserAuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [user, setUser] = useState<UserSession | null>(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [activeRoomCode, setActiveRoomCode] = useState<string | null>(null);
  const [activeRoomToken, setActiveRoomToken] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    if (open) {
      const u = getStoredUser();
      setUser(u);
      if (u) {
        setUsername(u.displayName);
        fetchUserData(u);
      }
    }
  }, [open]);

  async function fetchUserData(u: UserSession) {
    try {
      const res = await fetch(`/api/user/active-game?userToken=${u.token}&playerName=${encodeURIComponent(u.displayName)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.activeRoom) {
          setActiveRoomCode(data.activeRoom.roomCode);
          setActiveRoomToken(data.activePlayerToken);
        } else {
          setActiveRoomCode(null);
        }
        if (data.history) {
          setHistory(data.history);
        }
      }
    } catch {
      /* ignore */
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("Please enter both name and password.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: mode,
          displayName: username.trim(),
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      const session: UserSession = data.user;
      setStoredUser(session);
      setUser(session);
      onUserChange?.(session);
      await fetchUserData(session);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    clearStoredUser();
    setUser(null);
    setHistory([]);
    setActiveRoomCode(null);
    onUserChange?.(null);
  }

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          className="glass-strong relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 p-6 sm:p-8"
        >
          <button
            onClick={onClose}
            className="absolute right-5 top-5 text-lg text-slate-400 hover:text-slate-200"
          >
            ✕
          </button>

          {user ? (
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 text-xl font-bold text-white shadow-lg">
                  {user.displayName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-50">{user.displayName}</h2>
                  <p className="text-xs text-emerald-400">✓ One-Time Account Synced</p>
                </div>
              </div>

              {activeRoomCode && (
                <div className="mt-5 rounded-2xl border border-fuchsia-500/30 bg-fuchsia-500/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-fuchsia-300">
                    ⚡ Unfinished Game Found!
                  </p>
                  <p className="mt-1 text-sm text-slate-200">
                    Room Code: <strong className="text-white">{activeRoomCode}</strong>
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onResumeRoom?.(activeRoomCode, activeRoomToken || undefined);
                    }}
                    className="mt-3 w-full rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 py-2.5 text-xs font-bold uppercase tracking-wide text-white shadow-md shadow-violet-500/30"
                  >
                    ▶ RESUME UNFINISHED GAME
                  </button>
                </div>
              )}

              <div className="mt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Game History ({history.length})
                </h3>
                {history.length === 0 ? (
                  <p className="mt-2 text-xs text-slate-500">No games recorded yet. Start solving!</p>
                ) : (
                  <div className="mt-3 max-h-48 space-y-2 overflow-y-auto pr-1">
                    {history.map((g) => (
                      <div
                        key={g.roomCode}
                        className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-xs"
                      >
                        <div>
                          <span className="font-semibold text-slate-200">{g.roomCode}</span>
                          <span className="ml-2 uppercase text-slate-400">({g.difficulty})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={
                              g.status === "completed"
                                ? "text-emerald-400"
                                : g.status === "playing" || g.status === "paused"
                                ? "text-amber-300 font-semibold"
                                : "text-rose-400"
                            }
                          >
                            {g.status === "completed"
                              ? `🏆 ${Math.floor(g.elapsedSeconds / 60)}m ${g.elapsedSeconds % 60}s`
                              : g.status === "playing" || g.status === "paused"
                              ? "⚡ Active"
                              : "❌ Given Up"}
                          </span>
                          {(g.status === "playing" || g.status === "paused") && (
                            <button
                              onClick={() => {
                                onClose();
                                onResumeRoom?.(g.roomCode);
                              }}
                              className="rounded bg-violet-500/30 px-2 py-0.5 font-bold text-violet-200 hover:bg-violet-500/50"
                            >
                              Resume
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="mt-6 text-xs text-rose-400 hover:text-rose-300"
              >
                Log Out of Account
              </button>
            </div>
          ) : (
            <div>
              <div className="flex justify-center border-b border-white/10 pb-4">
                <div className="flex rounded-xl bg-white/5 p-1 text-xs font-semibold">
                  <button
                    onClick={() => {
                      setMode("login");
                      setError("");
                    }}
                    className={`rounded-lg px-6 py-2 transition-colors ${
                      mode === "login"
                        ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-md"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    LOGIN
                  </button>
                  <button
                    onClick={() => {
                      setMode("register");
                      setError("");
                    }}
                    className={`rounded-lg px-6 py-2 transition-colors ${
                      mode === "register"
                        ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-md"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    ONE-TIME SIGN UP
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="text-xs font-medium text-slate-300">Name</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your name"
                    className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-400/30"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-400/30"
                  />
                </div>

                {error && <p className="text-xs text-rose-300">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-violet-500/30 hover:brightness-110 disabled:opacity-60"
                >
                  {loading
                    ? "Processing..."
                    : mode === "login"
                    ? "LOGIN & RESUME GAME →"
                    : "CREATE ACCOUNT & SAVE HISTORY →"}
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
