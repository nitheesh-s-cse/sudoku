"use client";

// Persistence for local device convenience data & User session

const KEYS = {
  playerName: "sudoku-live:player-name",
  roomToken: (code: string) => `sudoku-live:token:${code.toUpperCase()}`,
  recentGames: "sudoku-live:recent-games",
  bestTimes: "sudoku-live:best-times",
  soundEnabled: "sudoku-live:sound-enabled",
  spectatorId: "sudoku-live:spectator-id",
  userSession: "sudoku-live:user-session",
  activeRoomCode: "sudoku-live:active-room-code",
};

export interface RecentGame {
  roomCode: string;
  playerName: string;
  difficulty: string;
  status: string;
  elapsedSeconds: number;
  playedAt: number;
}

export interface UserSession {
  id: number;
  username: string;
  displayName: string;
  token: string;
}

function safeGet(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* ignore quota errors */
  }
}

function safeRemove(key: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

export function getStoredPlayerName(): string {
  return safeGet(KEYS.playerName) ?? "";
}

export function setStoredPlayerName(name: string) {
  safeSet(KEYS.playerName, name);
}

export function getRoomToken(roomCode: string): string | null {
  return safeGet(KEYS.roomToken(roomCode));
}

export function setRoomToken(roomCode: string, token: string) {
  safeSet(KEYS.roomToken(roomCode), token);
}

export function getRecentGames(): RecentGame[] {
  const raw = safeGet(KEYS.recentGames);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as RecentGame[];
  } catch {
    return [];
  }
}

export function addRecentGame(game: RecentGame) {
  const games = getRecentGames().filter((g) => g.roomCode !== game.roomCode);
  games.unshift(game);
  safeSet(KEYS.recentGames, JSON.stringify(games.slice(0, 8)));
}

export function clearRecentGames() {
  safeRemove(KEYS.recentGames);
}

export function getBestTime(difficulty: string): number | null {
  const raw = safeGet(KEYS.bestTimes);
  if (!raw) return null;
  try {
    const times = JSON.parse(raw) as Record<string, number>;
    return times[difficulty] ?? null;
  } catch {
    return null;
  }
}

export function setBestTimeIfBetter(difficulty: string, seconds: number): boolean {
  const raw = safeGet(KEYS.bestTimes);
  let times: Record<string, number> = {};
  try {
    times = raw ? (JSON.parse(raw) as Record<string, number>) : {};
  } catch {
    times = {};
  }
  const current = times[difficulty];
  if (current === undefined || seconds < current) {
    times[difficulty] = seconds;
    safeSet(KEYS.bestTimes, JSON.stringify(times));
    return true;
  }
  return false;
}

export function isSoundEnabled(): boolean {
  const raw = safeGet(KEYS.soundEnabled);
  return raw === null ? true : raw === "1";
}

export function setSoundEnabled(enabled: boolean) {
  safeSet(KEYS.soundEnabled, enabled ? "1" : "0");
}

export function getSpectatorId(): string {
  let id = safeGet(KEYS.spectatorId);
  if (!id) {
    id = `spec-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;
    safeSet(KEYS.spectatorId, id);
  }
  return id;
}

// User Session Auth Helpers
export function getStoredUser(): UserSession | null {
  const raw = safeGet(KEYS.userSession);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserSession;
  } catch {
    return null;
  }
}

export function setStoredUser(user: UserSession) {
  safeSet(KEYS.userSession, JSON.stringify(user));
  if (user.displayName) {
    setStoredPlayerName(user.displayName);
  }
}

export function clearStoredUser() {
  safeRemove(KEYS.userSession);
}

// Active Room Code (For Auto Resume on Tab Refresh / Close)
export function getActiveRoomCode(): string | null {
  return safeGet(KEYS.activeRoomCode);
}

export function setActiveRoomCode(code: string) {
  safeSet(KEYS.activeRoomCode, code.toUpperCase());
}

export function clearActiveRoomCode() {
  safeRemove(KEYS.activeRoomCode);
}
