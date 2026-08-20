import { randomBytes } from "crypto";
import { db } from "@/db";
import { rooms, users } from "@/db/schema";
import { generatePuzzle, type Difficulty } from "@/lib/sudoku";
import { generateRoomCode, isValidPlayerName, normalizeName, serializeRoom } from "@/lib/room-utils";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

const VALID_DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard", "extreme"];

export async function POST(request: Request) {
  let body: { playerName?: string; difficulty?: string; userToken?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  let userId: number | null = null;
  if (body.userToken) {
    const [userRow] = await db.select().from(users).where(eq(users.token, body.userToken)).limit(1);
    if (userRow) {
      userId = userRow.id;
    }
  }

  const playerNameRaw = normalizeName(body.playerName ?? "");
  if (!isValidPlayerName(playerNameRaw)) {
    return Response.json(
      { error: "Name must be 2-20 characters, letters/numbers/spaces only." },
      { status: 400 },
    );
  }

  const difficulty = VALID_DIFFICULTIES.includes(body.difficulty as Difficulty)
    ? (body.difficulty as Difficulty)
    : "medium";

  const { puzzle, solution } = generatePuzzle(difficulty);
  const playerToken = randomBytes(24).toString("hex");

  let roomCode = generateRoomCode();
  let attempts = 0;
  // Extremely unlikely collision, but guard anyway.
  while (attempts < 5) {
    const existing = await db.select().from(rooms).where(eq(rooms.roomCode, roomCode)).limit(1);
    if (existing.length === 0) break;
    roomCode = generateRoomCode();
    attempts++;
  }

  const [row] = await db
    .insert(rooms)
    .values({
      roomCode,
      playerName: playerNameRaw,
      playerNameLower: playerNameRaw.toLowerCase(),
      userId,
      playerToken,
      difficulty,
      puzzle,
      solution,
      currentBoard: [...puzzle],
      notes: Array.from({ length: 81 }, () => []),
      selectedCell: -1,
      status: "playing",
    })
    .returning();

  return Response.json({
    room: serializeRoom(row, { includeSolution: true }),
    playerToken,
  });
}
