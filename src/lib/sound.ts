"use client";

// Lightweight synthesized sound effects via the WebAudio API — no audio
// asset files needed, and nothing plays until a user gesture unlocks it.

let ctx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;
    ctx = new AudioCtx();
  }
  if (ctx.state === "suspended") {
    void ctx.resume();
  }
  return ctx;
}

function tone(freq: number, duration: number, type: OscillatorType, gain: number, delay = 0) {
  const audioCtx = getContext();
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const start = audioCtx.currentTime + delay;
  gainNode.gain.setValueAtTime(0, start);
  gainNode.gain.linearRampToValueAtTime(gain, start + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.001, start + duration);
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

export type SoundName = "select" | "correct" | "wrong" | "click" | "victory" | "hint";

export function playSound(name: SoundName, enabled: boolean) {
  if (!enabled) return;
  switch (name) {
    case "select":
      tone(520, 0.07, "sine", 0.05);
      break;
    case "click":
      tone(360, 0.06, "triangle", 0.05);
      break;
    case "correct":
      tone(660, 0.1, "sine", 0.08);
      tone(880, 0.14, "sine", 0.06, 0.06);
      break;
    case "wrong":
      tone(180, 0.18, "sawtooth", 0.06);
      break;
    case "hint":
      tone(440, 0.1, "sine", 0.06);
      tone(560, 0.12, "sine", 0.05, 0.08);
      break;
    case "victory":
      [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.22, "sine", 0.08, i * 0.11));
      break;
  }
}
