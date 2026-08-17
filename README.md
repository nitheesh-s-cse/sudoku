# 🔥 Sudoku Live

> **Solve it. Master it. Let them watch.**

A premium, futuristic, mobile-first Sudoku web app with **real, working, cross-device live spectating**, a unique puzzle every game, and **Varshini 💜** — a Tanglish-speaking AI companion who reacts to your moves in real time.

This is a genuinely working full-stack product — not a prototype. Two different devices/browsers really do talk to each other through the database:

1. **Device A** — Nitheesh opens the site, enters his name, picks a difficulty, and a fresh, uniquely-solvable Sudoku puzzle is generated for him. He gets a Room ID (`SUD-7K92X`).
2. **Device B** — A friend opens **Watch Live**, types `Nitheesh` (or the Room ID), and instantly lands on a **read-only** live view of Nitheesh's board.
3. **Device A** enters a number → **Device B** sees the cell update within ~1–2 seconds, with the same shake/glow/pulse animations, live mistake count, timer, and spectator count.

---

## ⚠️ Important note about the tech stack (read this first)

The original brief asked for Firebase/Supabase. **This project runs inside a sandboxed platform that only provisions a Next.js + PostgreSQL (Drizzle ORM) environment** — there is no Firebase/Supabase project available to wire up here, and the platform's own guardrails require using Postgres via Drizzle for all persistence.

So the real-time engine was built as **actually-real, server-authoritative synchronization on top of Postgres**, instead of faking it:

- The player's device pushes every move to a server API route, which validates it against the true solution **server-side** (the client never holds authority) and persists the new board state to Postgres.
- The spectator device polls a lightweight endpoint every **~1.2 seconds** (and the player heartbeats every 5s), so updates propagate in near real time across devices/networks — genuinely, not simulated in one browser tab.
- This is a legitimate, production-grade pattern (the same one Google Docs' original sync, or any "short-poll" live dashboard, is built on) and it satisfies every functional requirement in the brief: two real devices, a real database, real cross-device sync, no client-side spectator write access.

If you want **sub-100ms push-based realtime** instead of ~1s polling, see [Swapping in Firebase / Supabase Realtime](#-optional-swapping-in-firebase--supabase-realtime) below — the codebase is structured so this is a localized change (one hook on the spectator side, one on the player side), not a rewrite.

---

## ✨ Feature checklist

- 🎲 **Real Sudoku engine** — backtracking generator + unique-solution solver, 4 difficulties (Easy/Medium/Hard/Extreme), a brand-new puzzle every game.
- 🔐 **Server-authoritative moves** — every placement/erase/hint is validated against the true solution in an API route using a secret per-room `playerToken`; spectators can never mutate a board.
- 📡 **Real cross-device sync** — Postgres-backed rooms + short-poll sync (player heartbeat + spectator poll), reconnect handling, live connection status pill (🟢 LIVE SYNC / 🟡 CONNECTING / 🔴 RECONNECTING).
- 👁 **Spectator mode** — search by player name or Room ID, live read-only board, live mistake/timer/progress, live spectator count, "player looks offline" detection.
- 💜 **Varshini AI companion** — large, non-repeating, contextual Tanglish dialogue engine reacting to correct moves, mistakes, streaks, being stuck, near-completion, hints, and victory — driven by actual game-state analysis (streak counters, unit-completion checks, progress %, elapsed time vs. difficulty), not canned single-line text.
- 🎉 **Victory screen** — confetti, stats (time, accuracy, hints, best streak, spectators), personal-best tracking (per difficulty, stored locally).
- 📱 **Mobile-first UI** — glassmorphism, neon gradients, floating particles, animated sudoku background, big touch-friendly board + number pad with "N left" counters, safe-area support, installable PWA manifest.
- 🔊 Optional synthesized sound effects (WebAudio, no autoplay, toggled by user gesture).
- 🔗 **Sharing** — Room ID copy, QR code, native Web Share API.
- 🧭 Home dashboard — Play / Watch Live / How to Play / Recent Games / Best Times (all local, no login required).

---

## 🏗️ Architecture

```
src/
  db/
    schema.ts        Drizzle tables: rooms, spectator_pings, moves
    index.ts          Postgres connection (Drizzle)
  lib/
    sudoku.ts          Generator / solver / validators (backtracking, unique-solution digging)
    varshini.ts         Tanglish dialogue engine (contextual, non-repeating)
    room-utils.ts        Room code gen, validation, DB row → public JSON serializer
    client-storage.ts     LocalStorage helpers (player name, room tokens, recent games, best times)
    sound.ts               WebAudio synthesized SFX
  hooks/
    usePlayerGame.ts   Player-side state machine: loads room, ticks timer, sends moves, heartbeats
    useSpectator.ts     Spectator-side polling hook
  components/           SudokuBoard, NumberPad, VarshiniBot, GameHeader, ConnectionStatus,
                         RoomShareModal (QR), VictoryScreen, DifficultySelector, StateViews, ...
  app/
    page.tsx             Landing + dashboard
    play/page.tsx         Name → Difficulty → Room created → Share
    game/[code]/page.tsx    Player's live game screen (owner-only, token-gated)
    watch/page.tsx           Watch Live search screen
    watch/[code]/page.tsx     Spectator live view (read-only)
    api/rooms/route.ts        POST create room (generates puzzle + secret token)
    api/rooms/[code]/route.ts   GET room state / PATCH lightweight updates (pause, selected cell, timer)
    api/rooms/[code]/move/route.ts   POST — the authoritative move validator (place/erase/hint)
    api/rooms/[code]/spectate/route.ts POST — spectator heartbeat + live public state + spectator count
    api/rooms/search/route.ts    GET — find a room by player name or Room ID
```

### Data model (Postgres via Drizzle)

- **`rooms`** — one row per game: puzzle, solution, live board, notes/pencil-marks, selected cell, last action (for spectator animation), mistakes, hints, streaks, timer, status, spectator count, and a secret `player_token` that gates all writes.
- **`spectator_pings`** — heartbeat rows (`room_id`, `spectator_id`, `last_seen`) used purely to compute an accurate "N watching" count (a spectator counts if it pinged within the last ~12s).
- **`moves`** — append-only move log (cell, value, correctness, timestamp) — powers the "recent activity" history and is ready to drive a future full replay feature.

### Security model

- The **solution** is only ever sent to the browser that presents the correct `playerToken` (the room creator). Spectators and the public `GET`/`search` routes never receive it.
- All writes (`PATCH`, `/move`) require `playerToken` to match the row in Postgres — a spectator holding only the Room ID cannot mutate anything (verified with 403 responses in this project's own smoke tests).
- Every move is **re-validated server-side** against the stored solution; the client cannot "tell" the server a wrong answer is correct.
- Player names and Room ID formats are validated both client- and server-side.

---

## 🧑‍💻 Local development

```bash
npm install
npx drizzle-kit push     # sync the schema in src/db/schema.ts to Postgres
npm run dev
```

Environment variables (`.env`):

```
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

---

## 🚀 Deploying to production

### Recommended: Vercel + a managed Postgres (Neon / Supabase Postgres / Railway)

1. **Push this repo to GitHub** (or GitLab/Bitbucket).
2. **Create a Postgres database.** Easiest options:
   - [Neon](https://neon.tech) — free serverless Postgres, gives you a `DATABASE_URL` instantly.
   - [Supabase](https://supabase.com) → Project Settings → Database → Connection string (use the **pooled** connection string, port 6543, for serverless).
   - [Railway](https://railway.app) → New Project → Provision PostgreSQL.
3. **Import the project into Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new) → Import your Git repo.
   - Framework preset: **Next.js** (auto-detected).
   - Build command: `next build` (default). Output: default.
4. **Add environment variables** in Vercel → Project Settings → Environment Variables:
   - `DATABASE_URL` = your Postgres connection string from step 2.
5. **Push the schema** once, from your local machine (pointed at the production DB):
   ```bash
   DATABASE_URL="your-production-url" npx drizzle-kit push
   ```
6. **Deploy.** Vercel will build and give you a production URL, e.g. `https://sudoku-live.vercel.app`.
7. **Verify:** open `/api/health` — it should return `{"ok":true}`. Then open the app, click **Play Sudoku** on one device/browser and **Watch Live** with the same Room ID on another (or your phone) — the board should sync live.

### Alternative: any Node host (Render, Railway, Fly.io, a VPS)

```bash
npm install
npm run build
DATABASE_URL="..." npm run start
```
Make sure the platform keeps the Node process alive (`next start`) and exposes port `3000` (or set `PORT`).

### PWA install

Because `public/manifest.json` + the icons are wired up in `app/layout.tsx`, once deployed over HTTPS, visitors can "Add to Home Screen" on mobile for an app-like standalone experience.

---

## 🔄 Optional: swapping in Firebase / Supabase Realtime

If you'd rather have push-based, sub-100ms realtime instead of the ~1s polling used here, the change is localized to the hooks — the game/UI logic doesn't need to change:

1. Keep Postgres/Drizzle as the source of truth for puzzle generation, validation, and history (or migrate `rooms` to Firestore/Supabase tables — the shape in `src/types/game.ts` maps directly).
2. Replace the body of `src/hooks/useSpectator.ts`'s polling `useEffect` with a realtime subscription:
   - **Supabase:** `supabase.channel('room:'+code).on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'rooms', filter: \`room_code=eq.${code}\` }, payload => setRoom(payload.new))`.
   - **Firebase:** mirror each `rooms` row into a Realtime Database path `/rooms/{code}` on every write in `api/rooms/[code]/move/route.ts`, then in the hook use `onValue(ref(db, '/rooms/'+code), snap => setRoom(snap.val()))`.
3. Keep the **move validation API route as-is** — never let the client write the authoritative board directly to Firebase/Supabase from the browser; always go through your server so cheating/corruption isn't possible.
4. Add `NEXT_PUBLIC_FIREBASE_*` / `NEXT_PUBLIC_SUPABASE_*` env vars for the client SDK, and server-only credentials (service account / service role key) for the API routes that also need to write.

---

## 🤖 About Varshini

Varshini is a **rule-based contextual dialogue engine** (`src/lib/varshini.ts`), not a hosted LLM — this keeps her instant (no network latency mid-game), free to run, and 100% on-brand/Tanglish. She picks from large per-situation phrase pools, tracks the last line shown per category so she doesn't repeat herself back-to-back, and her reactions are driven by real Sudoku state: current streak, mistake count, row/column/box completion, puzzle progress %, and elapsed time vs. difficulty-scaled thresholds.

If you'd like her to use a real generative model (e.g. Gemini) for even more variety, add a `GEMINI_API_KEY` server env var and create `app/api/varshini/route.ts` that calls the Gemini API with the current game context and falls back to the local phrase engine if the request fails or is slow — this keeps her fast and reliable even if the AI call has latency.

---

## 🛠️ Tech stack actually used

- **Next.js 16** (App Router, Turbopack build)
- **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion** — animations/transitions
- **canvas-confetti** — victory celebration
- **qrcode.react** — Room ID QR sharing
- **Drizzle ORM + PostgreSQL** — persistence and the real-time source of truth
- **Web Share API / Clipboard API / WebAudio API** — native-feeling mobile integrations, no extra dependencies

---

## 📋 Using this project with Gemini / other AI website builders

This repo is already a complete, working implementation — but if you want to keep iterating with an AI pair-programmer (Gemini, Claude, Cursor, etc.), paste this README plus a short prompt like:

> "Here is my existing Sudoku Live codebase (Next.js + Drizzle + Postgres). Add [feature] without breaking the existing move-validation security model in `api/rooms/[code]/move/route.ts`."

Point it at:
- `src/lib/sudoku.ts` for puzzle logic changes,
- `src/lib/varshini.ts` for AI companion dialogue,
- `src/hooks/usePlayerGame.ts` / `useSpectator.ts` for sync behavior,
- `src/app/api/rooms/**` for backend/security changes.

This keeps any AI-assisted edits scoped and prevents accidental regressions to the security or sync model described above.
