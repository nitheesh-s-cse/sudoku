import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import { generateUserToken, hashPassword, verifyPassword } from "@/lib/auth-utils";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: { action?: string; username?: string; displayName?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { action, username, displayName, password } = body;
  if (!password || password.trim().length < 3) {
    return Response.json({ error: "Password must be at least 3 characters." }, { status: 400 });
  }

  if (action === "register") {
    const rawName = (displayName || username || "").trim();
    if (rawName.length < 2 || rawName.length > 20) {
      return Response.json({ error: "Name must be 2-20 characters." }, { status: 400 });
    }
    const cleanUsername = rawName.toLowerCase();

    // Check if user already exists
    const existing = await db
      .select()
      .from(users)
      .where(or(eq(users.username, cleanUsername), eq(users.displayName, rawName)))
      .limit(1);

    if (existing.length > 0) {
      return Response.json({ error: "This name is already registered! Please login instead." }, { status: 409 });
    }

    const passwordHash = hashPassword(password);
    const token = generateUserToken();

    const [newUser] = await db
      .insert(users)
      .values({
        username: cleanUsername,
        displayName: rawName,
        passwordHash,
        token,
      })
      .returning();

    return Response.json({
      user: {
        id: newUser.id,
        username: newUser.username,
        displayName: newUser.displayName,
        token: newUser.token,
      },
    });
  }

  if (action === "login") {
    const rawName = (username || displayName || "").trim();
    const cleanUsername = rawName.toLowerCase();

    const [userRow] = await db
      .select()
      .from(users)
      .where(or(eq(users.username, cleanUsername), eq(users.displayName, rawName)))
      .limit(1);

    if (!userRow) {
      return Response.json({ error: "User not found. Check your name or sign up!" }, { status: 404 });
    }

    const isValid = verifyPassword(password, userRow.passwordHash);
    if (!isValid) {
      return Response.json({ error: "Incorrect password. Try again!" }, { status: 401 });
    }

    return Response.json({
      user: {
        id: userRow.id,
        username: userRow.username,
        displayName: userRow.displayName,
        token: userRow.token,
      },
    });
  }

  return Response.json({ error: "Invalid action" }, { status: 400 });
}
