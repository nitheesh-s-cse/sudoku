import { db } from "@/db";
import { rooms } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { isValidRoomCode, serializeRoom } from "@/lib/room-utils";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = (url.searchParams.get("query") ?? "").trim();

  if (query.length < 2) {
    return Response.json({ error: "Enter a name or room ID" }, { status: 400 });
  }

  let row;
  if (isValidRoomCode(query)) {
    [row] = await db
      .select()
      .from(rooms)
      .where(eq(rooms.roomCode, query.toUpperCase()))
      .limit(1);
  } else {
    const matches = await db
      .select()
      .from(rooms)
      .where(eq(rooms.playerNameLower, query.toLowerCase()))
      .orderBy(desc(rooms.updatedAt))
      .limit(1);
    row = matches[0];
  }

  if (!row) {
    return Response.json({ error: "Player not found" }, { status: 404 });
  }

  return Response.json({ room: serializeRoom(row, { includeSolution: false }) });
}
