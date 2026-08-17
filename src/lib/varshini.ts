// Varshini's contextual Tanglish dialogue engine. Pure rule-based reactions
// driven by real Sudoku game-state analysis (streaks, mistakes, time,
// difficulty, progress) — no repetition thanks to per-category history
// tracking + weighted random pick.

export type VarshiniMood =
  | "idle"
  | "happy"
  | "thinking"
  | "surprised"
  | "celebrating"
  | "concerned";

export interface VarshiniLine {
  text: string;
  mood: VarshiniMood;
}

const CORRECT_MOVE: string[] = [
  "Super di! 🔥",
  "Nalla move di!",
  "Heyy nalla vilayadura di 😌",
  "Mass move!",
  "Semma correct!",
  "Adha dhaan expect panninen 😎",
  "Aww super solve panra!",
  "Nice one di!",
  "Correct-ah kandupidichitta!",
  "Un Sudoku skills vera level 🔥",
  "Ithuku dhaan sonnen, nee genius nu 💜",
  "Clean move! Neat ah irukku.",
];

const STREAK_LINES: string[] = [
  "Wowww continuous correct moves ah? 👀",
  "Enna di, innaiku semma form-la irukka!",
  "Nee ippadi pona Sudoku seekiram mudinjidum 😂",
  "Varshini-ku competition kudukriya? 😏",
  "Streak vera level போகுது! 🔥🔥",
  "Ithu dhaan consistency-nu solradhu!",
];

const MISTAKE_LINES: string[] = [
  "Oops 😅 konjam careful di.",
  "Parava illa, next move correct ah podalaam.",
  "Aiyo 😭 adhu konjam wrong move.",
  "Chill di, game innum namma kai la dhaan.",
  "Konjam board-a observe pannitu podu.",
  " Okay ok, deep breath... mீண்டும் try pannu 💜",
  "Andha number vera oru place-ku poganum polirukku.",
];

const REPEAT_MISTAKE_LINES: string[] = [
  "Aiyayo, thொடர்ந்து mistake ah? Konjam slow down di 😅",
  "Ok wait, indha row full-ah re-check pannu.",
  "Mistake count ஏறிட்டு இருக்கு... careful-ah po!",
  "Namma oru minute break eduthutu vandhu paakalaam?",
];

const STUCK_LINES: string[] = [
  "Hmm... konjam think pannalaam 🤔",
  "Indha row-a once check pannu di.",
  "Unakku oru small hint venuma? 👀",
  "Naan direct answer solla maaten 😜... but oru clue kudukren.",
  "Andha empty cell-a suthi irukura numbers-a check pannu.",
  "Konjam patience di, answer namma kitta dhaan irukku!",
];

const NEAR_COMPLETE_LINES: string[] = [
  "Innum konjam dhaan! 🔥",
  "Almost there di!",
  "Final stretch! Come onnn!",
  "Idha mudichitta mass ah irukkum!",
  "90% mudinjaachu, kடைசி push கொடு!",
];

const VICTORY_LINES: string[] = [
  "YASSSS! 🎉",
  "Semma solve di!",
  "Nee vera level! 🔥🔥",
  "Sudoku champion unlocked 🏆",
  "Naan sonnen la, nee mudichiduva nu 😌",
  "What a gameeee!",
];

const IDLE_LINES: string[] = [
  "Naan ready, nee ready ah? 💜",
  "Board-a nithanama paaru, answer theriyum.",
  "Take your time di, no rush.",
  "Varshini idhu ippove kwatch panra 👀",
];

const HINT_GIVEN_LINES: string[] = [
  "Sari, oru clue kudukren... andha cell konjam easy-ah irukku 👀",
  "Ok ok, indha number try pannu, seri-ah irukum!",
  "Hint use panradhu tholvi illa di, smart move!",
];

const DIFFICULTY_START_LINES: Record<string, string[]> = {
  easy: ["Easy mode ah? Warm-up pannalaam 😄", "Chill game, relax-ah solve pannu!"],
  medium: ["Medium mode, semma balance ah irukum 💪", "Konjam challenge irukum, ready ah?"],
  hard: ["Hard mode ah?! Semma confidence 🔥", "Ok ok serious mode on pannalaam!"],
  extreme: [
    "EXTREME ah?! Nee brave dhaan di 😳",
    "Idhu real challenge... naan kooda konjam nervous ah irukken 😅",
  ],
};

const FAST_SOLVE_LINES: string[] = [
  "Andha speed paaru! Vera level fast! ⚡",
  "Ippadi fast-ah mudichita, unnala nambatta mudiyala!",
];

const SLOW_BUT_STEADY_LINES: string[] = [
  "Speed illa na enna, accuracy dhaan mukkiyam di 💜",
  "Slow and steady wins the Sudoku, correct-ah?",
];

function pick<T>(arr: T[], exclude?: T): T {
  const pool = exclude && arr.length > 1 ? arr.filter((v) => v !== exclude) : arr;
  return pool[Math.floor(Math.random() * pool.length)];
}

// Tracks the last line shown per category so we never repeat back-to-back.
const lastShown = new Map<string, string>();

function pickUnique(category: string, arr: string[]): string {
  const last = lastShown.get(category);
  const line = pick(arr, last);
  lastShown.set(category, line);
  return line;
}

export function resetVarshiniMemory() {
  lastShown.clear();
}

export interface MoveContext {
  correct: boolean;
  currentStreak: number;
  mistakes: number;
  progressPercent: number;
  difficulty: string;
  elapsedSeconds: number;
  unitCompleted?: boolean;
}

export function reactToMove(ctx: MoveContext): VarshiniLine {
  if (!ctx.correct) {
    if (ctx.mistakes >= 2) {
      return { text: pickUnique("repeatMistake", REPEAT_MISTAKE_LINES), mood: "concerned" };
    }
    return { text: pickUnique("mistake", MISTAKE_LINES), mood: "concerned" };
  }

  if (ctx.currentStreak > 0 && ctx.currentStreak % 5 === 0) {
    return { text: pickUnique("streak", STREAK_LINES), mood: "surprised" };
  }

  if (ctx.unitCompleted) {
    return {
      text: "Indha part konjam tricky... but nee semma handle pannita! 🔥",
      mood: "happy",
    };
  }

  if (ctx.progressPercent >= 90) {
    return { text: pickUnique("near", NEAR_COMPLETE_LINES), mood: "happy" };
  }

  return { text: pickUnique("correct", CORRECT_MOVE), mood: "happy" };
}

export function reactToStuck(): VarshiniLine {
  return { text: pickUnique("stuck", STUCK_LINES), mood: "thinking" };
}

export function reactToHint(): VarshiniLine {
  return { text: pickUnique("hint", HINT_GIVEN_LINES), mood: "thinking" };
}

export function reactToIdle(): VarshiniLine {
  return { text: pickUnique("idle", IDLE_LINES), mood: "idle" };
}

export function reactToStart(difficulty: string): VarshiniLine {
  const lines = DIFFICULTY_START_LINES[difficulty] ?? DIFFICULTY_START_LINES.medium;
  return { text: pick(lines), mood: "happy" };
}

export function reactToVictory(elapsedSeconds: number, difficulty: string): VarshiniLine {
  const base = pickUnique("victory", VICTORY_LINES);
  const fastThreshold = difficulty === "extreme" ? 900 : difficulty === "hard" ? 600 : 300;
  if (elapsedSeconds <= fastThreshold) {
    return { text: `${base} ${pick(FAST_SOLVE_LINES)}`, mood: "celebrating" };
  }
  return { text: `${base} ${pick(SLOW_BUT_STEADY_LINES)}`, mood: "celebrating" };
}

export function greetingForRoom(playerName: string): VarshiniLine {
  return {
    text: `Vaanga ${playerName}! Naan Varshini, unga Sudoku companion 💜 Start pannalaama?`,
    mood: "happy",
  };
}
