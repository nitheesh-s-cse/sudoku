import { db } from "@/db";
import { rooms, moves } from "@/db/schema";
import { eq } from "drizzle-orm";
import { isValidRoomCode } from "@/lib/room-utils";
import { serializeRoom } from "@/lib/room-utils";
import { getBox, getCol, getRow, getHintCell, isBoardComplete, isUnitComplete } from "@/lib/sudoku";

export const dynamic = "force-dynamic";

interface MoveBody {
  playerToken?: string;
  action?: "place" | "erase" | "hint";
  cell?: number;
  value?: number;
  elapsedSeconds?: number;
}

export async function POST(request: Request, context: { params: Promise<{ code: string }> }) {
  const { code } = await context.params;
  if (!isValidRoomCode(code)) {
    return Response.json({ error: "Invalid room code" }, { status: 400 });
  }

  let body: MoveBody;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const [row] = await db.select().from(rooms).where(eq(rooms.roomCode, code.toUpperCase())).limit(1);
  if (!row) {
    return Response.json({ error: "Room not found" }, { status: 404 });
  }
  if (body.playerToken !== row.playerToken) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }
  if (row.status === "completed" || row.status === "abandoned") {
    return Response.json({ error: "Game already finished" }, { status: 409 });
  }

  const puzzle = row.puzzle as number[];
  const solution = row.solution as number[];
  const board = [...(row.currentBoard as number[])];
  const notes = (row.notes as number[][]) ?? Array.from({ length: 81 }, () => []);

  let mistakes = row.mistakes;
  let hintsUsed = row.hintsUsed;
  let currentStreak = row.currentStreak;
  let bestStreak = row.bestStreak;
  let status = row.status;
  let completedAt = row.completedAt;

  let cell = body.cell;
  let value = body.value ?? 0;
  let isCorrect = false;
  let unitCompleted = false;
  const action = body.action;

  if (action === "hint") {
    cell = getHintCell(board, solution, body.cell);
    if (cell === -1) {
      return Response.json({ error: "No empty cells left" }, { status: 400 });
    }
    value = solution[cell];
    board[cell] = value;
    notes[cell] = [];
    hintsUsed += 1;
    isCorrect = true;
  } else if (action === "place") {
    if (typeof cell !== "number" || cell < 0 || cell > 80) {
      return Response.json({ error: "Invalid cell" }, { status: 400 });
    }
    if (puzzle[cell] !== 0) {
      return Response.json({ error: "Cannot overwrite a given clue" }, { status: 400 });
    }
    if (typeof value !== "number" || value < 1 || value > 9) {
      return Response.json({ error: "Invalid value" }, { status: 400 });
    }
    isCorrect = solution[cell] === value;
    if (isCorrect) {
      board[cell] = value;
      notes[cell] = [];
      currentStreak += 1;
      bestStreak = Math.max(bestStreak, currentStreak);

      const row9 = getRow(cell);
      const col9 = getCol(cell);
      const box9 = getBox(cell);
      unitCompleted =
        isUnitComplete(board, row9) || isUnitComplete(board, col9) || isUnitComplete(board, box9);
    } else {
      mistakes += 1;
      currentStreak = 0;
      if (mistakes >= row.maxMistakes) {
        status = "abandoned";
      }
    }
  } else if (action === "erase") {
    if (typeof cell !== "number" || cell < 0 || cell > 80) {
      return Response.json({ error: "Invalid cell" }, { status: 400 });
    }
    if (puzzle[cell] !== 0) {
      return Response.json({ error: "Cannot erase a given clue" }, { status: 400 });
    }
    board[cell] = 0;
    value = 0;
    isCorrect = true;
  } else {
    return Response.json({ error: "Invalid action" }, { status: 400 });
  }

  if (status === "playing" && isBoardComplete(board) && board.every((v, i) => v === solution[i])) {
    status = "completed";
    completedAt = new Date();
  }

  const elapsedSeconds =
    typeof body.elapsedSeconds === "number" && body.elapsedSeconds >= 0
      ? Math.floor(body.elapsedSeconds)
      : row.elapsedSeconds;

  const [updated] = await db
    .update(rooms)
    .set({
      currentBoard: board,
      notes,
      mistakes,
      hintsUsed,
      currentStreak,
      bestStreak,
      status,
      completedAt,
      elapsedSeconds,
      selectedCell: cell ?? row.selectedCell,
      lastAction: { type: action, cell, value, correct: isCorrect, at: Date.now() },
      updatedAt: new Date(),
      lastPlayerPing: new Date(),
    })
    .where(eq(rooms.roomCode, row.roomCode))
    .returning();

  if (action !== "erase") {
    await db.insert(moves).values({
      roomId: row.id,
      cell: cell ?? -1,
      value,
      isCorrect,
      elapsedSeconds,
    });
  }

  return Response.json({
    room: serializeRoom(updated, { includeSolution: true }),
    moveResult: { correct: isCorrect, unitCompleted, cell, value, action },
  });
}
