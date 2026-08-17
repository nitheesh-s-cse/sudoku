import { db } from "@/db";
import { rooms, spectatorPings } from "@/db/schema";
import { and, eq, gt, sql } from "drizzle-orm";
import { isValidRoomCode, serializeRoom } from "@/lib/room-utils";

export const dynamic = "force-dynamic";

const ACTIVE_WINDOW_MS = 12_000;

export async function POST(request: Request, context: { params: Promise<{ code: string }> }) {
  const { code } = await context.params;
  if (!isValidRoomCode(code)) {
    return Response.json({ error: "Invalid room code" }, { status: 400 });
  }

  let body: { spectatorId?: string };
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  const spectatorId = body.spectatorId ?? "anonymous";

  const [row] = await db.select().from(rooms).where(eq(rooms.roomCode, code.toUpperCase())).limit(1);
  if (!row) {
    return Response.json({ error: "Room not found" }, { status: 404 });
  }

  const existing = await db
    .select()
    .from(spectatorPings)
    .where(and(eq(spectatorPings.roomId, row.id), eq(spectatorPings.spectatorId, spectatorId)))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(spectatorPings)
      .set({ lastSeen: new Date() })
      .where(eq(spectatorPings.id, existing[0].id));
  } else {
    await db.insert(spectatorPings).values({ roomId: row.id, spectatorId });
  }

  const cutoff = new Date(Date.now() - ACTIVE_WINDOW_MS);
  const activeCountResult = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(spectatorPings)
    .where(and(eq(spectatorPings.roomId, row.id), gt(spectatorPings.lastSeen, cutoff)));
  const spectatorCount = activeCountResult[0]?.count ?? 0;

  const [updated] = await db
    .update(rooms)
    .set({ spectatorCount })
    .where(eq(rooms.roomCode, row.roomCode))
    .returning();

  // Detect if the player itself has gone quiet (no move/heartbeat in a while)
  // so spectators can see an accurate "offline/reconnecting" status.
  const playerQuiet = Date.now() - new Date(updated.lastPlayerPing ?? updated.updatedAt).getTime() > 20_000;

  return Response.json({
    room: serializeRoom(updated, { includeSolution: false }),
    playerOnline: !playerQuiet,
  });
}
