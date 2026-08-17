"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RoomPublicState } from "@/types/game";
import type { ConnState } from "@/components/ConnectionStatus";
import { getRoomToken } from "@/lib/client-storage";
import { reactToHint, reactToMove, reactToStuck, reactToVictory, type VarshiniLine } from "@/lib/varshini";
import { playSound } from "@/lib/sound";
import { isSoundEnabled } from "@/lib/client-storage";

interface UsePlayerGameResult {
  room: RoomPublicState | null;
  loading: boolean;
  unauthorized: boolean;
  notFound: boolean;
  connState: ConnState;
  varshiniLine: VarshiniLine | null;
  selectCell: (index: number) => void;
  placeNumber: (n: number) => void;
  eraseSelected: () => void;
  requestHint: () => void;
  togglePause: () => void;
  remaining: Record<number, number>;
}

const STUCK_TIMEOUT_MS = 25_000;
const HEARTBEAT_MS = 5000;

export function usePlayerGame(roomCode: string): UsePlayerGameResult {
  const [room, setRoom] = useState<RoomPublicState | null>(null);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [connState, setConnState] = useState<ConnState>("connecting");
  const [varshiniLine, setVarshiniLine] = useState<VarshiniLine | null>(null);
  const [elapsed, setElapsed] = useState(0);

  const tokenRef = useRef<string | null>(null);
  const busyRef = useRef(false);
  const stuckTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const soundEnabledRef = useRef(true);

  useEffect(() => {
    soundEnabledRef.current = isSoundEnabled();
  }, []);

  const resetStuckTimer = useCallback(() => {
    if (stuckTimerRef.current) clearTimeout(stuckTimerRef.current);
    stuckTimerRef.current = setTimeout(() => {
      setVarshiniLine(reactToStuck());
    }, STUCK_TIMEOUT_MS);
  }, []);

  // Initial load
  useEffect(() => {
    const token = getRoomToken(roomCode);
    if (!token) {
      setUnauthorized(true);
      setLoading(false);
      return;
    }
    tokenRef.current = token;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/rooms/${roomCode}?token=${token}`);
        if (res.status === 404) {
          if (!cancelled) setNotFound(true);
          return;
        }
        const data = await res.json();
        if (!cancelled) {
          if (!data.isOwner) {
            setUnauthorized(true);
          } else {
            setRoom(data.room);
            setElapsed(data.room.elapsedSeconds);
            setConnState("connected");
            resetStuckTimer();
          }
        }
      } catch {
        if (!cancelled) setConnState("reconnecting");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      if (stuckTimerRef.current) clearTimeout(stuckTimerRef.current);
    };
  }, [roomCode, resetStuckTimer]);

  // Local timer tick + periodic heartbeat. Uses a ref for the latest
  // `elapsed` value so the interval isn't torn down/recreated every second
  // (which would otherwise prevent the 5s heartbeat from ever firing).
  const elapsedRef = useRef(0);
  useEffect(() => {
    elapsedRef.current = elapsed;
  }, [elapsed]);

  const roomStatus = room?.status;

  useEffect(() => {
    if (roomStatus !== "playing") return;
    const tick = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(tick);
  }, [roomStatus]);

  useEffect(() => {
    if (roomStatus !== "playing" || !tokenRef.current) return;
    const heartbeat = setInterval(async () => {
      try {
        await fetch(`/api/rooms/${roomCode}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ playerToken: tokenRef.current, elapsedSeconds: elapsedRef.current }),
        });
        setConnState("connected");
      } catch {
        setConnState("reconnecting");
      }
    }, HEARTBEAT_MS);
    return () => clearInterval(heartbeat);
  }, [roomStatus, roomCode]);

  const applyMoveResult = useCallback(
    (data: { room: RoomPublicState; moveResult: { correct: boolean; unitCompleted: boolean; action: string } }) => {
      setRoom(data.room);
      setConnState("connected");
      resetStuckTimer();

      const enabled = soundEnabledRef.current;
      if (data.moveResult.action === "hint") {
        setVarshiniLine(reactToHint());
        playSound("hint", enabled);
      } else if (data.moveResult.action === "place") {
        playSound(data.moveResult.correct ? "correct" : "wrong", enabled);
        if (data.room.status === "completed") {
          setVarshiniLine(reactToVictory(data.room.elapsedSeconds, data.room.difficulty));
          playSound("victory", enabled);
        } else {
          setVarshiniLine(
            reactToMove({
              correct: data.moveResult.correct,
              currentStreak: data.room.currentStreak,
              mistakes: data.room.mistakes,
              progressPercent: data.room.progressPercent,
              difficulty: data.room.difficulty,
              elapsedSeconds: data.room.elapsedSeconds,
              unitCompleted: data.moveResult.unitCompleted,
            }),
          );
        }
      }
    },
    [resetStuckTimer],
  );

  const sendMove = useCallback(
    async (action: "place" | "erase" | "hint", cell?: number, value?: number) => {
      if (!tokenRef.current || busyRef.current) return;
      busyRef.current = true;
      try {
        const res = await fetch(`/api/rooms/${roomCode}/move`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ playerToken: tokenRef.current, action, cell, value, elapsedSeconds: elapsed }),
        });
        if (res.ok) {
          const data = await res.json();
          applyMoveResult(data);
        } else {
          setConnState("connected");
        }
      } catch {
        setConnState("reconnecting");
      } finally {
        busyRef.current = false;
      }
    },
    [roomCode, elapsed, applyMoveResult],
  );

  const selectCell = useCallback(
    (index: number) => {
      setRoom((prev) => (prev ? { ...prev, selectedCell: index } : prev));
      playSound("select", soundEnabledRef.current);
      if (tokenRef.current) {
        fetch(`/api/rooms/${roomCode}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ playerToken: tokenRef.current, selectedCell: index }),
        }).catch(() => setConnState("reconnecting"));
      }
    },
    [roomCode],
  );

  const placeNumber = useCallback(
    (n: number) => {
      if (!room || room.selectedCell < 0) return;
      if (room.puzzle[room.selectedCell] !== 0) return;
      void sendMove("place", room.selectedCell, n);
    },
    [room, sendMove],
  );

  const eraseSelected = useCallback(() => {
    if (!room || room.selectedCell < 0) return;
    if (room.puzzle[room.selectedCell] !== 0) return;
    if (room.currentBoard[room.selectedCell] === 0) return;
    void sendMove("erase", room.selectedCell, 0);
  }, [room, sendMove]);

  const requestHint = useCallback(() => {
    if (!room) return;
    void sendMove("hint", room.selectedCell >= 0 ? room.selectedCell : undefined);
  }, [room, sendMove]);

  const togglePause = useCallback(() => {
    if (!room || !tokenRef.current) return;
    const nextStatus = room.status === "paused" ? "playing" : "paused";
    setRoom((prev) => (prev ? { ...prev, status: nextStatus } : prev));
    fetch(`/api/rooms/${roomCode}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerToken: tokenRef.current, status: nextStatus }),
    }).catch(() => setConnState("reconnecting"));
  }, [room, roomCode]);

  const remaining: Record<number, number> = {};
  for (let n = 1; n <= 9; n++) {
    remaining[n] = 9 - (room?.currentBoard.filter((v) => v === n).length ?? 0);
  }

  return {
    room: room ? { ...room, elapsedSeconds: elapsed } : null,
    loading,
    unauthorized,
    notFound,
    connState,
    varshiniLine,
    selectCell,
    placeNumber,
    eraseSelected,
    requestHint,
    togglePause,
    remaining,
  };
}
