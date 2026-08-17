export type Difficulty = "easy" | "medium" | "hard" | "extreme";

export type GameStatus =
  | "waiting"
  | "playing"
  | "paused"
  | "completed"
  | "abandoned"
  | "offline";

export interface LastAction {
  type: "place" | "erase" | "hint";
  cell: number;
  value: number;
  correct: boolean;
  at: number; // epoch ms
}

export interface RoomPublicState {
  roomCode: string;
  playerName: string;
  difficulty: Difficulty;
  puzzle: number[];
  currentBoard: number[];
  notes: number[][];
  selectedCell: number;
  lastAction: LastAction | null;
  mistakes: number;
  maxMistakes: number;
  hintsUsed: number;
  bestStreak: number;
  currentStreak: number;
  elapsedSeconds: number;
  status: GameStatus;
  spectatorCount: number;
  progressPercent: number;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  // Only present for the owning client (never sent to spectators).
  solution?: number[];
}

export interface CreateRoomResponse {
  room: RoomPublicState;
  playerToken: string;
}
