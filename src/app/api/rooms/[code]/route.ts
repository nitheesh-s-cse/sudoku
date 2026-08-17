import { db } from "@/db";
import { rooms } from "@/db/schema";
import { eq } from "drizzle-orm";
import { isValidRoomCode, serializeRoom } from "@/lib/room-utils";

export const dynamic = "force-dynamic";

async function findRoom(code: string) {
  const [row] = await db
    .select()
    .from(rooms)
    .where(eq(rooms.roomCode, code.toUpperCase()))
    .limit(1);
  return row;
}

export async function GET(request: Request, context: { params: Promise<{ code: string }> }) {
  const { code } = await context.params;
  if (!isValidRoomCode(code)) {
    return Response.json({ error: "Invalid room code" }, { status: 400 });
  }

  const row = await findRoom(code);
  if (!row) {
    return Response.json({ error: "Room not found" }, { status: 404 });
  }

  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const isOwner = !!token && token === row.playerToken;

  return Response.json({ room: serializeRoom(row, { includeSolution: isOwner }), isOwner });
}

export async function PATCH(request: Request, context: { params: Promise<{ code: string }> }) {
  const { code } = await context.params;
  if (!isValidRoomCode(code)) {
    return Response.json({ error: "Invalid room code" }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const row = await findRoom(code);
  if (!row) {
    return Response.json({ error: "Room not found" }, { status: 404 });
  }

  if (body.playerToken !== row.playerToken) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  const updates: Partial<typeof rooms.$inferInsert> = { updatedAt: new Date(), lastPlayerPing: new Date() };

  if (typeof body.selectedCell === "number" && body.selectedCell >= -1 && body.selectedCell < 81) {
    updates.selectedCell = body.selectedCell;
  }
  if (Array.isArray(body.notes)) {
    updates.notes = body.notes;
  }
  if (typeof body.elapsedSeconds === "number" && body.elapsedSeconds >= 0) {
    updates.elapsedSeconds = Math.floor(body.elapsedSeconds);
  }
  if (
    typeof body.status === "string" &&
    ["waiting", "playing", "paused", "completed", "abandoned", "offline"].includes(body.status) &&
    row.status !== "completed"
  ) {
    updates.status = body.status;
  }

  const [updated] = await db.update(rooms).set(updates).where(eq(rooms.roomCode, row.roomCode)).returning();

  return Response.json({ room: serializeRoom(updated, { includeSolution: true }) });
}
