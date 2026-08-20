import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  serial,
  index,
} from "drizzle-orm/pg-core";

// Registered users table for One-Time Login / Auth & History
export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    username: text("username").notNull().unique(), // lowercase username for lookup
    displayName: text("display_name").notNull(),
    passwordHash: text("password_hash").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("users_username_idx").on(table.username)],
);

// A "room" is a single Sudoku session created by a player.
// It holds the puzzle, the live board state, and metadata used
// both by the player's own client and by any spectators polling it.
export const rooms = pgTable(
  "rooms",
  {
    id: serial("id").primaryKey(),
    roomCode: text("room_code").notNull().unique(),
    playerName: text("player_name").notNull(),
    playerNameLower: text("player_name_lower").notNull(),
    userId: integer("user_id"), // Optional link to registered user

    // Secret token only known to the creator's browser. Required on every
    // mutation so spectators (who only ever see roomCode) can never write.
    playerToken: text("player_token").notNull(),

    difficulty: text("difficulty").notNull().default("medium"),
    puzzle: jsonb("puzzle").notNull(), // 81-length array, 0 = empty
    solution: jsonb("solution").notNull(), // 81-length array
    currentBoard: jsonb("current_board").notNull(), // 81-length array, player progress
    notes: jsonb("notes").notNull().default([]), // 81-length array of number[] pencil marks

    selectedCell: integer("selected_cell").default(-1),
    lastAction: jsonb("last_action"), // { type, cell, value, correct, at }

    mistakes: integer("mistakes").notNull().default(0),
    maxMistakes: integer("max_mistakes").notNull().default(3),
    hintsUsed: integer("hints_used").notNull().default(0),
    bestStreak: integer("best_streak").notNull().default(0),
    currentStreak: integer("current_streak").notNull().default(0),

    elapsedSeconds: integer("elapsed_seconds").notNull().default(0),
    status: text("status").notNull().default("playing"), // waiting|playing|paused|completed|abandoned|offline

    spectatorCount: integer("spectator_count").notNull().default(0),

    lastPlayerPing: timestamp("last_player_ping", { withTimezone: true }).defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (table) => [index("rooms_player_name_lower_idx").on(table.playerNameLower)],
);

// Ephemeral heartbeat rows from spectators
export const spectatorPings = pgTable("spectator_pings", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").notNull(),
  spectatorId: text("spectator_id").notNull(),
  lastSeen: timestamp("last_seen", { withTimezone: true }).defaultNow().notNull(),
});

// Move log, used for the post-game replay feature.
export const moves = pgTable("moves", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").notNull(),
  cell: integer("cell").notNull(),
  value: integer("value").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  elapsedSeconds: integer("elapsed_seconds").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
