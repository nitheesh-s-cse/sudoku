"use client";

import { useEffect, useRef, useState } from "react";
import type { RoomPublicState } from "@/types/game";
import type { ConnState } from "@/components/ConnectionStatus";
import { getSpectatorId } from "@/lib/client-storage";

interface UseSpectatorResult {
  room: RoomPublicState | null;
  loading: boolean;
  notFound: boolean;
  connState: ConnState;
  playerOnline: boolean;
}

const POLL_MS = 1200;

export function useSpectator(roomCode: string): UseSpectatorResult {
  const [room, setRoom] = useState<RoomPublicState | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [connState, setConnState] = useState<ConnState>("connecting");
  const [playerOnline, setPlayerOnline] = useState(true);
  const failsRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const spectatorId = getSpectatorId();

    async function poll() {
      try {
        const res = await fetch(`/api/rooms/${roomCode}/spectate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ spectatorId }),
        });
        if (res.status === 404) {
          if (!cancelled) {
            setNotFound(true);
            setLoading(false);
          }
          return;
        }
        if (!res.ok) throw new Error("bad status");
        const data = await res.json();
        if (!cancelled) {
          setRoom(data.room);
          setPlayerOnline(data.playerOnline);
          setConnState("connected");
          failsRef.current = 0;
        }
      } catch {
        if (!cancelled) {
          failsRef.current += 1;
          setConnState(failsRef.current > 1 ? "reconnecting" : "connecting");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    poll();
    const interval = setInterval(poll, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [roomCode]);

  return { room, loading, notFound, connState, playerOnline };
}
