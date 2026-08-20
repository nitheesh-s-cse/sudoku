import { db } from "@/db";
import { rooms, moves, users } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: { userToken?: string; playerName?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid body" }, { status: 400 });
  }

  const { userToken, playerName } = body;
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
    return Response.json({ success: true, count: 0 });
  }

  const userRooms = userId
    ? await db.select({ id: rooms.id }).from(rooms).where(eq(rooms.userId, userId))
    : await db.select({ id: rooms.id }).from(rooms).where(eq(rooms.playerNameLower, cleanName));

  const roomIds = userRooms.map((r) => r.id);

  if (roomIds.length > 0) {
    await db.delete(moves).where(inArray(moves.roomId, roomIds));
    if (userId) {
      await db.delete(rooms).where(eq(rooms.userId, userId));
    } else {
      await db.delete(rooms).where(eq(rooms.playerNameLower, cleanName));
    }
  }

  return Response.json({ success: true, count: roomIds.length });
}
