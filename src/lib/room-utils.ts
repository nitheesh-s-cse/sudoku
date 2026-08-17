import { customAlphabet } from "nanoid";
import type { rooms } from "@/db/schema";
import type { RoomPublicState } from "@/types/game";

const nanoid = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 6);

export function generateRoomCode(): string {
  return `SUD-${nanoid()}`;
}

export function isValidRoomCode(code: string): boolean {
  return /^SUD-[A-Z0-9]{6}$/.test(code.trim().toUpperCase());
}

export function normalizeName(name: string): string {
  return name.trim().slice(0, 20);
}

export function isValidPlayerName(name: string): boolean {
  const trimmed = name.trim();
  return trimmed.length >= 2 && trimmed.length <= 20 && /^[\p{L}\p{N}\s_.-]+$/u.test(trimmed);
}

type RoomRow = typeof rooms.$inferSelect;

export function serializeRoom(row: RoomRow, opts: { includeSolution?: boolean } = {}): RoomPublicState {
  const puzzle = row.puzzle as number[];
  const currentBoard = row.currentBoard as number[];
  const totalToFill = puzzle.filter((v) => v === 0).length;
  const filledByPlayer = currentBoard.filter((v, i) => v !== 0 && puzzle[i] === 0).length;
  const progressPercent = totalToFill === 0 ? 100 : Math.round((filledByPlayer / totalToFill) * 100);

  return {
    roomCode: row.roomCode,
    playerName: row.playerName,
    difficulty: row.difficulty as RoomPublicState["difficulty"],
    puzzle,
    currentBoard,
    notes: (row.notes as number[][]) ?? [],
    selectedCell: row.selectedCell ?? -1,
    lastAction: (row.lastAction as RoomPublicState["lastAction"]) ?? null,
    mistakes: row.mistakes,
    maxMistakes: row.maxMistakes,
    hintsUsed: row.hintsUsed,
    bestStreak: row.bestStreak,
    currentStreak: row.currentStreak,
    elapsedSeconds: row.elapsedSeconds,
    status: row.status as RoomPublicState["status"],
    spectatorCount: row.spectatorCount,
    progressPercent,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    completedAt: row.completedAt ? row.completedAt.toISOString() : null,
    ...(opts.includeSolution ? { solution: row.solution as number[] } : {}),
  };
}
