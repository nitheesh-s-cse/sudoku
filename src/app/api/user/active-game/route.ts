import { db } from "@/db";
import { rooms, users } from "@/db/schema";
import { eq, and, inArray, desc } from "drizzle-orm";
import { serializeRoom } from "@/lib/room-utils";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userToken = searchParams.get("userToken");
  const playerName = searchParams.get("playerName");

  let userId: number | null = null;
  let cleanName = playerName ? playerName.trim().toLowerCase() : "";

  if (userToken) {
    const [userRow] = await db.select().from(users).where(eq(users.token, userToken)).limit(1);
    if (userRow) {
      userId = userRow.id;
      cleanName = userRow.username;
    }
  }

  if (!userId && !cleanName) {
    return Response.json({ activeRoom: null, history: [] });
  }

  // Find active room (status 'playing' or 'paused')
  const activeConditions = userId
    ? and(eq(rooms.userId, userId), inArray(rooms.status, ["playing", "paused"]))
    : and(eq(rooms.playerNameLower, cleanName), inArray(rooms.status, ["playing", "paused"]));

  const [activeRoom] = await db
    .select()
    .from(rooms)
    .where(activeConditions)
    .orderBy(desc(rooms.updatedAt))
    .limit(1);

  // Fetch full game history
  const historyConditions = userId ? eq(rooms.userId, userId) : eq(rooms.playerNameLower, cleanName);

  const historyRows = await db
    .select()
    .from(rooms)
    .where(historyConditions)
    .orderBy(desc(rooms.createdAt))
    .limit(20);

  return Response.json({
    activeRoom: activeRoom ? serializeRoom(activeRoom, { includeSolution: true }) : null,
    activePlayerToken: activeRoom ? activeRoom.playerToken : null,
    history: historyRows.map((r) => ({
      roomCode: r.roomCode,
      playerName: r.playerName,
      difficulty: r.difficulty,
      status: r.status,
      elapsedSeconds: r.elapsedSeconds,
      mistakes: r.mistakes,
      hintsUsed: r.hintsUsed,
      playedAt: new Date(r.createdAt).getTime(),
    })),
  });
}
