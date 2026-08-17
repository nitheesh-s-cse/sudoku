"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";

interface RoomShareModalProps {
  roomCode: string;
  playerName: string;
  open: boolean;
  onClose: () => void;
}

export function RoomShareModal({ roomCode, playerName, open, onClose }: RoomShareModalProps) {
  const [copied, setCopied] = useState(false);
  const watchUrl =
    typeof window !== "undefined" ? `${window.location.origin}/watch/${roomCode}` : `/watch/${roomCode}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  }

  async function handleNativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Watch me live on Sudoku Live",
          text: `Scan to watch ${playerName} solve Sudoku live! Room: ${roomCode}`,
          url: watchUrl,
        });
      } catch {
        /* user cancelled */
      }
    } else {
      await handleCopy();
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong safe-bottom w-full max-w-sm rounded-t-3xl border border-white/10 p-6 text-center sm:rounded-3xl"
          >
            <p className="text-sm text-slate-400">Scan to watch {playerName} live</p>
            <div className="mx-auto my-4 w-fit rounded-2xl bg-white p-3">
              <QRCodeSVG value={watchUrl} size={168} bgColor="#ffffff" fgColor="#0a081c" level="M" />
            </div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Room ID</p>
            <p className="text-gradient mt-1 text-3xl font-black tracking-[0.15em]">{roomCode}</p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                onClick={handleCopy}
                className="glass rounded-xl border border-white/10 py-3 text-sm font-semibold text-slate-100 hover:bg-white/10"
              >
                {copied ? "Copied ✓" : "Copy Room ID"}
              </button>
              <button
                onClick={handleNativeShare}
                className="rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 hover:brightness-110"
              >
                Share Live ↗
              </button>
            </div>
            <button onClick={onClose} className="mt-4 text-xs text-slate-500 hover:text-slate-300">
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
