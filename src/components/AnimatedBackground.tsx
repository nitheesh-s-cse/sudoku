"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  size: number;
  left: number;
  top: number;
  delay: number;
  duration: number;
  hue: number;
}

interface GridNumber {
  id: number;
  value: number;
  left: number;
  top: number;
  delay: number;
}

// Purely decorative: a faint drifting sudoku grid + soft floating orbs to give
// the landing screen depth without competing with foreground content.
// Randomized positions are generated client-side after mount (inside an
// effect) rather than during render, to avoid SSR/client hydration mismatches
// from Math.random().
export function AnimatedBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [gridNumbers, setGridNumbers] = useState<GridNumber[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 16 }, (_, i) => ({
        id: i,
        size: 4 + Math.random() * 10,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 6,
        duration: 6 + Math.random() * 6,
        hue: i % 3,
      })),
    );
    setGridNumbers(
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        value: Math.floor(Math.random() * 9) + 1,
        left: Math.random() * 92,
        top: Math.random() * 92,
        delay: Math.random() * 4,
      })),
    );
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div
        className="animate-grid-drift absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139,92,246,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.6) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      {particles.map((p) => (
        <motion.span
          key={p.id}
          className={`absolute rounded-full blur-[1px] ${
            p.hue === 0 ? "bg-violet-400/40" : p.hue === 1 ? "bg-sky-400/40" : "bg-fuchsia-400/40"
          }`}
          style={{ width: p.size, height: p.size, left: `${p.left}%`, top: `${p.top}%` }}
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {gridNumbers.map((n) => (
        <motion.span
          key={n.id}
          className="absolute select-none font-black text-violet-300/[0.08] text-6xl sm:text-7xl"
          style={{ left: `${n.left}%`, top: `${n.top}%` }}
          animate={{ opacity: [0.02, 0.12, 0.02] }}
          transition={{ duration: 5 + n.id, delay: n.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          {n.value}
        </motion.span>
      ))}

      <div className="absolute -left-32 top-1/4 h-72 w-72 animate-float-slow rounded-full bg-violet-600/25 blur-[100px]" />
      <div className="absolute -right-24 top-10 h-64 w-64 animate-float-slower rounded-full bg-sky-500/20 blur-[100px]" />
      <div className="absolute bottom-0 left-1/3 h-80 w-80 animate-float-slow rounded-full bg-fuchsia-600/15 blur-[110px]" />
    </div>
  );
}
