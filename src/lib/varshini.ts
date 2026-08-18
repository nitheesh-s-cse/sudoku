// Varshini AI — Personalised Tanglish Companion Engine
// Cute, playful, caring, encouraging, supportive & slightly teasing female companion.

export type VarshiniMood =
  | "idle"
  | "happy"
  | "excited"
  | "worried"
  | "thinking"
  | "playful"
  | "proud"
  | "surprised";

export interface VarshiniLine {
  text: string;
  mood: VarshiniMood;
}

export interface MoveContext {
  correct: boolean;
  currentStreak: number;
  mistakes: number;
  progressPercent: number;
  difficulty: string;
  elapsedSeconds: number;
  unitCompleted?: boolean;
  playerName?: string;
}

const NICKNAMES = ["di", "thango", "chellam", "pondati", "dear", "kutty", "ma", "boss"];
let lastNickname = "";

function getRandomNickname(): string {
  const pool = NICKNAMES.filter((n) => n !== lastNickname);
  const picked = pool[Math.floor(Math.random() * pool.length)];
  lastNickname = picked;
  return picked;
}

const CORRECT_MOVE_LINES: string[] = [
  "Super di! 🔥",
  "Nalla move di!",
  "Heyy nalla vilayadura di 😌",
  "Mass move, chellam! 🔥",
  "Semma correct di!",
  "Adha dhaan expect panninen, thango 😎",
  "Aww super solve panra di 💜",
  "Nice one, pondati! 😌",
  "Correct-ah kandupidichitta di!",
  "Un Sudoku skills vera level 🔥",
  "Ithuku dhaan sonnen, nee genius nu 💜",
  "Clean move di! Neat-ah irukku.",
  "Ahaaa! Idhu semma move chellam 👀",
  "Good one di, keep going! 🔥",
  "Thango, unakku Sudoku nalla set aagudhu pola 😌",
  "Super-ah handle panra pondati! 💜",
];

const STREAK_5_LINES: string[] = [
  "Wowww continuous correct moves ah? 👀",
  "Enna di, innaiku semma form-la irukka!",
  "Nee ippadi pona Sudoku seekiram mudinjidum 😂",
  "Varshini-ku competition kudukriya, pondati? 😏",
  "Streak vera level pogudhu! 🔥🔥",
  "Ithu dhaan consistency-nu solradhu, chellam!",
  "5 moves continuous-ah correct ah?! Mass di!",
  "Thango, konjam enakkum chance kudu 😂",
  "Adei semma streak di 🔥",
  "Nee serious-ah Sudoku champion aaga pora pola 😌",
  "Chellam mode activated ah? 👀🔥",
  "Indha speed-la pona naan commentary panna mattum dhaan mudiyum 😂",
];

const STREAK_10_LINES: string[] = [
  "10 streak ah?! Enna pondati, today full power-la irukka! 🔥🔥",
  "Okayyy okayyy, un level purinjiduchu 😌",
  "Varshini officially impressed, chellam 💜",
];

const MISTAKE_LINES: string[] = [
  "Oops 😅 konjam careful di.",
  "Parava illa, next move correct-ah podalaam.",
  "Aiyo 😭 adhu konjam wrong move, chellam.",
  "Chill di, game innum namma kai la dhaan.",
  "Konjam board-a observe pannitu podu.",
  "Okay ok, deep breath... மீண்டும் try pannu 💜",
  "Andha number vera oru place-ku poganum polirukku.",
  "Oops pondati 😅 once re-check pannu.",
  "Parava illa thango, mistake ellarukkum varum.",
  "Chellam, konjam slow-ah paakalaam.",
  "Aiyo di 😂 board namma kitta konjam clue kekkudhu.",
  "No worries ma, next one namma correct-ah podalaam 💜",
];

const REPEAT_MISTAKE_2_LINES: string[] = [
  "Aiyayo, தொடர்ந்து mistake ah? Konjam slow down di 😅",
  "Ok wait, indha row full-ah re-check pannu.",
  "Mistake count ஏறிட்டு இருக்கு... careful-ah po, chellam!",
  "Namma oru minute break eduthutu vandhu paakalaam?",
  "Pondati, konjam rush pannadha 😭",
  "Thango, answer-a guess pannaama board-a observe pannu.",
  "Okay di, reset mindset... next move mattum focus pannalaam 💜",
  "Aiyoo chellam 😂 indha board unna test panradhu pola.",
  "Konjam patience pondati, namma definitely solve pannalaam.",
];

const REPEAT_MISTAKE_3_LINES: string[] = [
  "Chellam, tension edukkadha. Sudoku dhaan, namma jeyichidalaam 💜",
  "Pondati relax! Mistake aana enna, next cell focus pannalaam 😌",
];

const STUCK_15S_LINES: string[] = [
  "Hmm... konjam think pannalaam 🤔",
  "Indha row-a once check pannu di.",
  "Unakku oru small hint venuma? 👀",
  "Naan direct answer solla maaten 😜... but oru clue kudukren.",
  "Andha empty cell-a suthi irukura numbers-a check pannu.",
  "Konjam patience di, answer namma kitta dhaan irukku!",
  "Take your time, chellam 💜",
  "Rush panna vendam pondati, nithanama paakalaam.",
  "Hmm... indha board konjam stubborn-ah irukku pola 😂",
  "Think pannitu iru di, naan inga dhaan irukken 👀",
];

const STUCK_LONG_LINES: string[] = [
  "Thango, romba silent-ah poita 😌 oru small clue venuma?",
  "Enna pondati, board-a paathu yosichitu irukkiya? 😌 Or hint venuma?",
];

const HINT_GIVEN_LINES: string[] = [
  "Sari, oru clue kudukren... andha cell konjam easy-ah irukku 👀",
  "Ok ok, indha number try pannu, seri-ah irukum!",
  "Hint use panradhu tholvi illa di, smart move!",
  "Chellam, naan konjam help panren 💜",
  "Pondati, indha cell-a once consider pannu.",
  "Direct answer solla maaten 😜... but direction kudukren.",
  "Thango, idha observe pannina answer kandupidichidalaam.",
];

const NEAR_COMPLETE_LINES: string[] = [
  "Innum konjam dhaan! 🔥",
  "Almost there di!",
  "Final stretch! Come onnn!",
  "Idha mudichitta mass ah irukkum!",
  "90% mudinjaachu, கடைசி push கொடு!",
  "Chellam, finish line visible! 🏁",
  "Pondati, last few moves dhaan! 🔥",
  "Thango, almost solved! Don't lose focus 😌",
  "Ippo dhaan final boss 😂🔥",
  "Innum konjam di... Sudoku namma kai-la!",
];

const VICTORY_LINES: string[] = [
  "YASSSS! 🎉",
  "Semma solve di!",
  "Nee vera level! 🔥🔥",
  "Sudoku champion unlocked 🏆",
  "Naan sonnen la, nee mudichiduva nu 😌",
  "What a gameeee!",
  "Semma da... illa semma di! 😂🔥",
  "Chellam, nee pannita! 💜",
  "Pondatiiiii! What a finish! 🏆",
  "Thango, semma performance!",
  "Awwww proud of you di 🥹💜",
  "I knew you could do it, chellam!",
  "Sudoku-ku inniku nee dhaan boss 😎🔥",
];

const FAST_SOLVE_LINES: string[] = [
  "Andha speed paaru! Vera level fast! ⚡",
  "Ippadi fast-ah mudichita, unna nambave mudiyala! 😂",
  "Chellam, turbo mode on pannitiya?! 🔥",
  "Pondati, konjam slow-ah po nu sonna... nee Sudoku-va race-a maathita 😂",
  "What a speed di! ⚡🔥",
  "Varshini-ku shock kuduthuta 😳",
  "Indha timing semma impressive, thango!",
];

const SLOW_BUT_STEADY_LINES: string[] = [
  "Speed illa na enna, accuracy dhaan mukkiyam di 💜",
  "Slow and steady wins the Sudoku, correct-ah?",
  "Chellam, nithanama solve pannalum clean-ah mudichitta.",
  "Pondati, patience-ku result vandhuduchu 💜",
  "Accuracy semma, thango!",
  "Rush illaama perfect-ah finish pannita di.",
];

const DIFFICULTY_START_LINES: Record<string, { lines: string[]; mood: VarshiniMood }[]> = {
  easy: [
    { lines: ["Easy mode ah? Warm-up pannalaam 😄", "Chill game, relax-ah solve pannu di!", "Chellam, light-ah start pannalaam 💜", "Easy mode... but let's see how fast you finish 😏"], mood: "happy" },
  ],
  medium: [
    { lines: ["Medium mode, semma balance-ah irukum 💪", "Konjam challenge irukum, ready ah?", "Okay thango, ippo konjam serious-ah play pannalaam 🔥", "Medium ah? Good choice, pondati 😌"], mood: "happy" },
  ],
  hard: [
    { lines: ["Hard mode ah?! Semma confidence 🔥", "Ok ok serious mode on pannalaam!", "Chellam, ippo dhaan real game start 😏", "Hard choose pannita... naan support-la irukken di 💜", "Pondati, indha one konjam tough. But namma handle pannalaam."], mood: "excited" },
  ],
  extreme: [
    { lines: ["EXTREME ah?! Nee brave dhaan di 😳", "Idhu real challenge... naan kooda konjam nervous-ah irukken 😅", "Chellam, extreme choose pannita?! Respect 🔥", "Pondati, ippo Sudoku namma rendu peraiyum test panna pogudhu 😂", "Okay thango... serious mode MAX 🔥", "Extreme-ku vandhuta... let's cook this puzzle 😎"], mood: "surprised" },
  ],
};

const IDLE_LINES: string[] = [
  "Naan ready, nee ready ah? 💜",
  "Board-a nithanama paaru, answer theriyum.",
  "Take your time di, no rush.",
  "Varshini idha ippove watch panra 👀",
  "Enna pondati, board-a paathu yosichitu irukkiya? 😌",
  "Chellam, whenever you're ready 💜",
  "Thango, naan inga dhaan irukken.",
  "Next move enna nu paakalaam 👀",
  "Hmm... suspense build panriya di? 😂",
];

const PLAYER_RETURN_LINES: string[] = [
  "Ahaa thirumbi vandhutiya di! 😌",
  "Welcome back, chellam 💜",
  "Pondati back to action! 🔥",
  "Enga poita? Naan inga wait pannitu irundhen 😂",
  "Okay thango, let's continue!",
  "Ready ah? Namma Sudoku innum finish aagala 👀",
];

const SPECTATOR_JOIN_LINES: string[] = [
  "Ahaa, audience vandhutaanga di 👀",
  "Pondati, ippo someone is watching you! Don't get nervous 😂",
  "Chellam, live audience vandhuduchu 🔥",
  "Okayyy, ippo performance kudukkanum pola 😏",
  "Thango, pressure edukkadha... just play naturally 💜",
];

const SPECTATOR_COUNT_INC_LINES: string[] = [
  "Wahhh audience increase aagudhu 👀",
  "Pondati, un game-ku fans vandhutaanga pola 😂🔥",
  "Chellam, ippo full live show ah pochu!",
];

// Memory map per category to prevent consecutive duplicates
const lastShown = new Map<string, string>();

function pickUnique(category: string, arr: string[]): string {
  const last = lastShown.get(category);
  const pool = last && arr.length > 1 ? arr.filter((v) => v !== last) : arr;
  const picked = pool[Math.floor(Math.random() * pool.length)];
  lastShown.set(category, picked);
  return picked;
}

export function resetVarshiniMemory() {
  lastShown.clear();
}

export function reactToMove(ctx: MoveContext): VarshiniLine {
  if (!ctx.correct) {
    if (ctx.mistakes >= 3) {
      return { text: pickUnique("repeatMistake3", REPEAT_MISTAKE_3_LINES), mood: "worried" };
    }
    if (ctx.mistakes >= 2) {
      return { text: pickUnique("repeatMistake2", REPEAT_MISTAKE_2_LINES), mood: "worried" };
    }
    return { text: pickUnique("mistake", MISTAKE_LINES), mood: "worried" };
  }

  if (ctx.currentStreak >= 10 && ctx.currentStreak % 5 === 0) {
    return { text: pickUnique("streak10", STREAK_10_LINES), mood: "excited" };
  }

  if (ctx.currentStreak >= 5 && ctx.currentStreak % 5 === 0) {
    return { text: pickUnique("streak5", STREAK_5_LINES), mood: "surprised" };
  }

  if (ctx.unitCompleted) {
    const nick = getRandomNickname();
    return {
      text: `Indha part konjam tricky... but nee semma-ah handle pannita, ${nick}! 🔥`,
      mood: "excited",
    };
  }

  if (ctx.progressPercent >= 90) {
    return { text: pickUnique("near", NEAR_COMPLETE_LINES), mood: "excited" };
  }

  // Inject player name randomly in 20% of correct moves if name exists
  if (ctx.playerName && Math.random() < 0.2) {
    return {
      text: `${ctx.playerName}, indha move semma! 🔥`,
      mood: "happy",
    };
  }

  return { text: pickUnique("correct", CORRECT_MOVE_LINES), mood: "happy" };
}

export function reactToStuck(isLong = false): VarshiniLine {
  if (isLong) {
    return { text: pickUnique("stuckLong", STUCK_LONG_LINES), mood: "thinking" };
  }
  return { text: pickUnique("stuck", STUCK_15S_LINES), mood: "thinking" };
}

export function reactToHint(): VarshiniLine {
  return { text: pickUnique("hint", HINT_GIVEN_LINES), mood: "thinking" };
}

export function reactToIdle(): VarshiniLine {
  return { text: pickUnique("idle", IDLE_LINES), mood: "idle" };
}

export function reactToPlayerReturn(): VarshiniLine {
  return { text: pickUnique("playerReturn", PLAYER_RETURN_LINES), mood: "playful" };
}

export function reactToSpectatorJoin(count: number): VarshiniLine {
  if (count > 1) {
    return { text: pickUnique("spectatorInc", SPECTATOR_COUNT_INC_LINES), mood: "playful" };
  }
  return { text: pickUnique("spectatorJoin", SPECTATOR_JOIN_LINES), mood: "playful" };
}

export function reactToStart(difficulty: string): VarshiniLine {
  const config = DIFFICULTY_START_LINES[difficulty] ?? DIFFICULTY_START_LINES.medium;
  const pickedConfig = config[Math.floor(Math.random() * config.length)];
  return { text: pickUnique(`start_${difficulty}`, pickedConfig.lines), mood: pickedConfig.mood };
}

export function reactToVictory(elapsedSeconds: number, difficulty: string): VarshiniLine {
  const base = pickUnique("victory", VICTORY_LINES);
  const fastThreshold = difficulty === "extreme" ? 900 : difficulty === "hard" ? 600 : 300;
  if (elapsedSeconds <= fastThreshold) {
    return { text: `${base} ${pickUnique("fastSolve", FAST_SOLVE_LINES)}`, mood: "surprised" };
  }
  return { text: `${base} ${pickUnique("slowSteady", SLOW_BUT_STEADY_LINES)}`, mood: "proud" };
}

export function greetingForRoom(playerName: string): VarshiniLine {
  const variants = [
    `Vaanga ${playerName}! Naan Varshini, unga Sudoku companion 💜 Start pannalaama?`,
    `Heyy ${playerName}! 👋 Naan Varshini 💜 Ready ah, chellam?`,
    `Hi ${playerName}! 😌 Sudoku play pannalaama di?`,
    `Welcome back, ${playerName}! Varshini ready 💜`,
    `Heyyy ${playerName}! Innaiku oru Sudoku victory namma pocket-la podalaama? 😏🔥`,
  ];
  return {
    text: pickUnique("greeting", variants),
    mood: "happy",
  };
}

export function spectatorCommentary(playerName: string, roomStatus: string, action?: string, moveResult?: { correct: boolean }, streak?: number, progressPercent?: number): VarshiniLine {
  if (roomStatus === "completed") {
    return { text: `YASSS! ${playerName} solved it! 🏆🔥 Semma solve!`, mood: "proud" };
  }
  if (action === "place") {
    if (moveResult?.correct) {
      if (streak && streak >= 10) {
        return { text: `10 streak by ${playerName}! Semma form! 🔥🔥`, mood: "excited" };
      }
      if (streak && streak >= 5) {
        return { text: `5 correct moves continuous by ${playerName}! 🔥`, mood: "excited" };
      }
      return { text: `Wow, ${playerName} nalla move pannitaanga 🔥`, mood: "happy" };
    } else {
      return { text: `Aiyo 😅 konjam mistake by ${playerName}... let's see next move.`, mood: "worried" };
    }
  }
  if (progressPercent && progressPercent >= 90) {
    return { text: `Almost solved by ${playerName}! 👀 Final stretch!`, mood: "excited" };
  }
  return { text: `Naan ${playerName} solve panradha watch panren 💜`, mood: "idle" };
}
