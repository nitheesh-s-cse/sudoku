"use client";

export type ConnState = "connected" | "connecting" | "reconnecting";

const CONFIG: Record<ConnState, { dot: string; label: string; text: string }> = {
  connected: { dot: "bg-emerald-400", label: "LIVE SYNC", text: "text-emerald-300" },
  connecting: { dot: "bg-amber-400", label: "CONNECTING…", text: "text-amber-300" },
  reconnecting: { dot: "bg-rose-400", label: "RECONNECTING…", text: "text-rose-300" },
};

export function ConnectionStatus({ state, compact }: { state: ConnState; compact?: boolean }) {
  const cfg = CONFIG[state];
  return (
    <div
      className={`glass flex items-center gap-1.5 rounded-full px-2 py-1 text-[0.62rem] font-semibold uppercase tracking-wide ${cfg.text} ${
        compact ? "" : "px-3 py-1.5 text-xs"
      }`}
      role="status"
    >
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot} ${state !== "connected" ? "animate-pulse" : ""}`} />
      {!compact && cfg.label}
    </div>
  );
}
