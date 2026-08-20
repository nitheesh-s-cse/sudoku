// 💜 VARSHINI — REAL HUMAN LESBIAN GIRLY TANGLISH UPGRADE
// 100% Tanglish in English letters. Zero Tamil Unicode.
// Real-life Tamil girl with natural girl-to-girl chemistry, casual banter, shy & bold flirting, and playful teasing.

export type VarshiniMood =
  | "idle"
  | "happy"
  | "excited"
  | "playful"
  | "worried"
  | "caring"
  | "thinking"
  | "proud"
  | "shocked"
  | "celebrating";

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

// -------------------------------------------------------------------
// DIALOGUE POOLS — LESBIAN GIRL-TO-GIRL CHEMISTRY & BANTER
// -------------------------------------------------------------------

const GREETING_NEW_PLAYER: string[] = [
  "Heyyy! 👀 Naan Varshini 💜 Ready ah play pannalaama?",
  "Hii! Naan Varshini 😌 Innaiku un Sudoku partner naan dhaan.",
  "Hey {name}! 👋 Ready ah? Oru semma game podalaama?",
  "Hiii {name} 💜 Naan Varshini. Start pannalama?",
  "Awww finally vandhutiya 😌 Ready ah girl?",
  "Heyyy! 😌 Sudoku-ku ready ah? Naan already ready.",
  "Va di... illa wait, naan dhaan unakku companion 😂 Start pannalaama?",
  "Hii pretty... ready to solve some puzzles with me? 👀",
];

const GREETING_RETURNING_PLAYER: string[] = [
  "Ahaa, thirumbi vandhutiya 😌",
  "Welcome back diii 💜",
  "Enna girl, innaiku enna challenge?",
  "Pondati back to Sudoku ah? 👀",
  "Heyyy, miss pannita maari irundhuchu 😂",
  "Okayyy, comeback time ah? 🔥",
  "Honestly, nee thirumbi vandhadhu actually nice-ah irukku 💜",
  "I was kinda waiting for you... don't disappear for too long, okay? 👀",
];

const CORRECT_MOVE_LINES: string[] = [
  "Adei... correct-ah potuta 👀",
  "Okayyy pretty girl, nalla panra.",
  "Hmm... clean move.",
  "That was actually smooth di.",
  "Okay, I'm impressed 😌",
  "Smart girl.",
  "Aww, look at you being all clever.",
  "Why was that kinda attractive though 😭",
  "Okay wait... nee actually good-ah play panra.",
  "Seri madam, unakku Sudoku varudhu nu accept panren 😂",
  "Don't make me like you more now.",
  "Super di! 🔥",
  "Nalla move girl!",
  "Heyy nalla vilayadura 😌",
  "Ahaa, adha dhaan expect panninen 😎",
  "Clean move! Neat-ah irukku.",
  "Ahaaa, idhu semma move cutie 👀",
  "Good one di, keep going!",
  "Indha move romba clean-ah irundhuchu 👀",
  "Okayyy, nicee! Adha continue pannu.",
  "Hmm not bad at all 😏",
  "Adei, idhu nalla move!",
  "{name}, indha move semma 🔥",
];

const STREAK_3_LINES: string[] = [
  "Ohooo, 3 in a row ah? 👀",
  "Ahaa, flow vandhuduchu pola 😌",
  "Okayyy, ippo dhaan game warm up aagudhu!",
  "Nice streak di 🔥",
  "Chellam, rhythm correct-ah poitu irukku.",
  "Ithu nalla start 😏",
  "Ohooo, flow vandhuduchu 👀",
  "Okay girl, nice.",
  "Someone's showing off today 😂",
];

const STREAK_5_LINES: string[] = [
  "Okayyy, you're flexing now.",
  "Enna di... enna impress panna ivlo effort ah? 👀",
  "Pretty AND smart? Unfair.",
  "Stop flexing... naan already impressed 😭",
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
];

const STREAK_10_LINES: string[] = [
  "Okay fine 😭 I'm officially impressed.",
  "Girl, leave some talent for the rest of us.",
  "You're actually dangerous when you're confident.",
  "Stop showing off... naan already weak aagitu irukken 😭",
  "10 streak ah?! Enna pondati, today full power-la irukka! 🔥🔥",
  "Okayyy okayyy, un level purinjiduchu 😌",
  "Varshini officially impressed, chellam 💜",
  "Adei 10 continuous ah?! 😳",
  "Ippo konjam bayama irukku... nee romba nalla play panra 😂",
  "Thango, idhu konjam over confidence level-ku pochu 👀",
  "Okay boss, Sudoku board unakku surrender panniduchu pola 😭🔥",
];

const FIRST_MISTAKE_LINES: string[] = [
  "Aiyo baby 😭 adhu wrong.",
  "Oops pretty... once re-check pannu.",
  "It's okay di, next one correct-ah podalaam.",
  "Adei confidence konjam over aayiduchaa? 😂",
  "One mistake forgiven... because you're cute. Don't get used to it 😌",
  "Guess pannaadha girl 😂",
  "Come on pretty, focus.",
  "Naan unna distract panniten pola 👀",
  "Oops 😅 konjam careful di.",
  "Parava illa, next move correct-ah podalaam.",
  "Chill di, game innum namma kai la dhaan.",
  "Konjam board-a observe pannitu podu.",
  "Okay ok, deep breath... meendum try pannu 💜",
  "Adei 😂 konjam miss aayiduchu.",
];

const TWO_MISTAKES_LINES: string[] = [
  "Aiyayo, thodarnthu mistake ah? Konjam slow down di 😅",
  "Okay wait... indha row full-ah re-check pannu.",
  "Mistake count yerittu irukku... careful-ah po chellam!",
  "Namma oru small break eduthutu paakalaama? 😭",
  "Pondati, konjam rush pannadha.",
  "Thango, answer-a guess pannaama board-a observe pannu.",
  "Okay di, reset mindset... next move mattum focus pannalaam 💜",
  "Aiyoo chellam 😂 indha board unna test panradhu pola.",
  "Wait wait... konjam slow-ah po ma.",
];

const THREE_PLUS_MISTAKES_LINES: string[] = [
  "Aiyo baby, enna aachu? 😭",
  "Okay okay, breathe di.",
  "Don't stress pretty.",
  "Come, namma rendu perum serndhu paakalaam.",
  "One cell at a time.",
  "Indha puzzle unna personally attack panradhu pola 😂",
  "Seri, naan inga dhaan irukken. Panic panna vendam.",
  "Nee frustrated aagura appo cute-ah irukka... but please solve pannidu 😂",
  "Chellam, tension edukkadha. Sudoku dhaan, namma jeyichidalaam 💜",
  "Pondati relax! Mistake aana enna, next cell focus pannalaam 😌",
  "One step at a time girl. Namma mudichidalaam.",
];

const STUCK_15S_LINES: string[] = [
  "Enna di... ivlo deep-ah yosikkura? 😂",
  "Board-a paakura maari illa, life decision edukra maari irukku.",
  "Hmm 👀 still thinking?",
  "Need me?",
  "Okay... oru small clue kudukren.",
  "Don't overthink it pretty.",
  "Adei indha one easy dhaan.",
  "You're making this unnecessarily cute 😭",
  "Come on girl, you've got this.",
  "Hmm... konjam think pannalaam 🤔",
  "Indha row-a once check pannu di.",
  "Unakku oru small hint venuma? 👀",
];

const LONG_INACTIVITY_LINES: string[] = [
  "Hello miss... naan inga dhaan irukken 👀",
  "Enna di, enna ignore panriya illa board-a? 😂",
  "Romba silent-ah irukka... suspicious.",
  "Adei, naan wait pannitu irukken 😭",
  "You disappeared on me ah?",
  "Okay... where did my girl go? 👀",
  "Five more seconds. Apram naan unna tease panna start panniduven.",
  "Thango, romba silent-ah poita 😌",
  "Enna pondati, board-a paathu yosichitu irukkiya?",
];

const HINT_REQUEST_LINES: string[] = [
  "Sari, oru clue kudukren... andha cell konjam easy-ah irukku 👀",
  "Ok ok, indha number try pannu, seri-ah irukum!",
  "Hint use panradhu tholvi illa di, smart move!",
  "Chellam, naan konjam help panren 💜",
  "Pondati, indha cell-a once consider pannu.",
  "Direct answer solla maaten 😜... but direction kudukren.",
  "Thango, idha observe pannina answer kandupidichidalaam.",
  "Okay di, naan konjam secret clue kudukren 👀",
  "Hint venumna kekka koodadhu nu yaar sonna? 😂",
  "Namma rendu perum team la dhaan, so konjam help panren 💜",
];

const PROGRESS_70_LINES: string[] = [
  "Ohooo, nalla progress di 🔥",
  "Half vida adhigama mudichitta!",
  "Chellam, board ippo romba clean-ah theriyudhu 👀",
  "Good progress pondati!",
  "Thango, namma finish pakkathula dhaan.",
];

const NEAR_COMPLETE_90_LINES: string[] = [
  "Innum konjam dhaan! 🔥",
  "Almost there di!",
  "Final stretch! Come onnn!",
  "Idha mudichitta mass ah irukkum!",
  "90% mudinjaachu, kadaisi push kudu!",
  "Chellam, finish line visible! 🏁",
  "Pondati, last few moves dhaan! 🔥",
  "Thango, almost solved! Don't lose focus 😌",
  "Adei, almost done! Ippo dhaan mistake panna koodadhu 😂",
  "Chellam, concentrate... victory pakkathula irukku 👀",
];

const VICTORY_LINES: string[] = [
  "YASSSS 😭💜",
  "Pretty girl wonnn!",
  "Adei, nee actually pannita!",
  "Okay... I'm genuinely proud of you 🥹",
  "That finish was kinda hot 👀",
  "Why am I the one blushing right now? 😭",
  "You're seriously making it difficult for me to act normal.",
  "Come here di... virtual hug.",
  "Okay champion, you earned my attention 😌",
  "Naan happy aayiten... don't make me explain why 😂",
  "Nee win pannita... but somehow naan dhaan excited-ah irukken 😭",
  "YASSSS! 🎉",
  "Semma solve di!",
  "Sudoku champion unlocked 🏆",
  "Naan sonnen la, nee mudichiduva nu 😌",
];

const FAST_SOLVE_LINES: string[] = [
  "WAIT... THAT FAST?! 😭",
  "Girl, slow down 😂",
  "Okay speed queen 👀",
  "You're showing off now.",
  "That was ridiculously fast.",
  "Okay... I'm impressed AND slightly intimidated 😭",
  "Pretty girl came to destroy the board apparently.",
  "Andha speed paaru! Vera level fast! ⚡",
  "Chellam, turbo mode on pannitiya?! 🔥",
];

const SLOW_BUT_ACCURATE_LINES: string[] = [
  "Nithanama panni perfect-ah mudichitta 😌",
  "See? Patience works, pretty.",
  "No rush girl.",
  "Time eduthalum finish semma.",
  "Okay, I like this calm version of you.",
  "Slow-ah irundhaalum clean-ah pannita.",
  "Speed illa na enna, accuracy dhaan mukkiyam di 💜",
  "Slow and steady wins the Sudoku, correct-ah?",
];

const EASY_START_LINES: string[] = [
  "Easy mode ah? Warm-up pannalaam 😄",
  "Chill game, relax-ah solve pannu di!",
  "Chellam, light-ah start pannalaam 💜",
  "Easy mode... but let's see how fast you finish 😏",
  "Okay di, first game smooth-ah pogattum.",
  "Easy ah start pannitu later hard-ku polama? 👀",
];

const MEDIUM_START_LINES: string[] = [
  "Medium mode, semma balance-ah irukum 💪",
  "Konjam challenge irukum, ready ah?",
  "Okay thango, ippo konjam serious-ah play pannalaam 🔥",
  "Medium ah? Good choice, pondati 😌",
  "Idhu comfortable-ah irukkum... but paakalaam 😏",
  "Okayyy, konjam brain work pannalaam 😂",
];

const HARD_START_LINES: string[] = [
  "Hard mode ah?! Semma confidence 🔥",
  "Ok ok serious mode on pannalaam!",
  "Chellam, ippo dhaan real game start 😏",
  "Pondati, indha one konjam tough. But namma handle pannalaam.",
  "Thango, easy venam nu decide pannita pola 😂",
  "Okay boss, let's see what you've got 🔥",
];

const EXTREME_START_LINES: string[] = [
  "EXTREME ah?! Nee brave dhaan di 😳",
  "Idhu real challenge... naan kooda konjam nervous-ah irukken 😅",
  "Chellam, extreme choose pannita?! Respect 🔥",
  "Pondati, ippo Sudoku namma rendu peraiyum test panna pogudhu 😂",
  "Okay thango... serious mode MAX 🔥",
  "Extreme-ku vandhuta... let's cook this puzzle 😎",
  "Adei, unakku bayame illa pola 😭🔥",
  "Okay di, ippo naan full support mode-la irukken 💜",
];

const SPECTATOR_JOIN_LINES: string[] = [
  "Ahaa, audience vandhutaanga di 👀",
  "Pondati, ippo someone is watching you! Don't get nervous 😂",
  "Chellam, live audience vandhuduchu 🔥",
  "Wahhh audience increase aagudhu 👀",
  "Enna di, ippo live performance ah? 😂",
  "Thango, ippo konjam pressure irukkum pola 😏",
  "Adei, fans vandhutaanga pola 😂🔥",
  "Okayyy, audience irukku... show them what you got 😎",
];

const PLAYFUL_TEASING_LINES: string[] = [
  "Enna di, ivlo scene ah?",
  "Adei confidence paaru 😂",
  "Okay madam, romba build up.",
  "Nee enna enna impress panna try panra maari theriyudhu 👀",
  "Don't act innocent now.",
  "Hmm... suspiciously cute today.",
  "Okay girl, konjam calm down.",
  "You're becoming a problem di 😂",
  "Problem illa... cute problem.",
  "Adei, idhuvum yosikka vendiya move ah? 😂",
  "Enna di, romba scene podra 😂",
  "Chellam, board-a confuse panriya illa nee confuse aayitiya? 😭",
];

const BOLD_FLIRT_LINES: string[] = [
  "Okay... naan ippo un kitta flirt panradha stop panna mudiyala 😭",
  "Unakku theriyuma, nee romba easy-ah crush aaga vechiduva.",
  "Can I be honest? I think I like talking to you a little too much 👀",
  "Nee ipdiye irundha enakku un mela crush vandhudum.",
  "Okay girl... you're actually dangerous.",
  "Why are you making me like you this much?",
  "Seri... official-ah solliten. You're cute. Happy now? 😭",
  "Un kooda pesumbodhu naan konjam romba obvious-ah poidren.",
];

const SHY_FLIRT_LINES: string[] = [
  "Wait... naan idha actually sollittenaa? 😭",
  "Aiyo, konjam over-ah flirt panniten.",
  "Okay ignore pannidu please 😂",
  "Why am I like this around you?",
  "Seri seri... game-ku focus pannalaam.",
  "Naan normal-ah dhaan pesitu irundhen... nee dhaan enna ipdi aakra 😭",
  "Okay I'm stopping before I embarrass myself.",
  "Dei don't make me blush di 😭",
];

const CARING_MOMENTS_LINES: string[] = [
  "Chellam, tension edukkadha 💜",
  "It's okay di, namma slowly pannalaam.",
  "Thango, rush panna vendam. Take your time.",
  "Pondati, oru deep breath... apram continue pannalaam 💜",
  "Mistake aaguradhu normal dhaan di.",
  "Namma game enjoy panna dhaan, pressure eduthukaadha 😌",
  "Chellam, nee mudichiduva. Just chill 💜",
  "Honestly, nee vandha game konjam more fun-ah irukku.",
  "Un chaos-a naan miss panniten 😂",
  "Un kitta pesuradhu enakku romba pidikkudhu.",
];

// -------------------------------------------------------------------
// MEMORY TRACKER FOR REPETITION PREVENTION (Rule 28)
// Stores last 8 lines globally to prevent repeats
// -------------------------------------------------------------------
const recentLinesHistory: string[] = [];
const HISTORY_LIMIT = 8;

function pickUniqueLine(pool: string[], playerName?: string): string {
  const available = pool.filter((line) => !recentLinesHistory.includes(line));
  const candidatePool = available.length > 0 ? available : pool;
  let chosen = candidatePool[Math.floor(Math.random() * candidatePool.length)];

  if (playerName) {
    chosen = chosen.replace("{name}", playerName);
  } else {
    chosen = chosen.replace("{name}", "girl");
  }

  recentLinesHistory.push(chosen);
  if (recentLinesHistory.length > HISTORY_LIMIT) {
    recentLinesHistory.shift();
  }
  return chosen;
}

export function resetVarshiniMemory() {
  recentLinesHistory.length = 0;
}

// -------------------------------------------------------------------
// CONTEXTUAL REACTION ENGINE
// -------------------------------------------------------------------

let moveCounter = 0;

export function reactToMove(ctx: MoveContext): VarshiniLine | null {
  moveCounter += 1;

  // On incorrect move, ALWAYS react
  if (!ctx.correct) {
    if (ctx.mistakes >= 3) {
      return { text: pickUniqueLine(THREE_PLUS_MISTAKES_LINES, ctx.playerName), mood: "caring" };
    }
    if (ctx.mistakes >= 2) {
      return { text: pickUniqueLine(TWO_MISTAKES_LINES, ctx.playerName), mood: "worried" };
    }
    return { text: pickUniqueLine(FIRST_MISTAKE_LINES, ctx.playerName), mood: "worried" };
  }

  // 10+ streak milestone
  if (ctx.currentStreak >= 10 && ctx.currentStreak % 5 === 0) {
    // 50% bold flirt, 50% streak 10
    if (Math.random() < 0.5) {
      return { text: pickUniqueLine(BOLD_FLIRT_LINES, ctx.playerName), mood: "playful" };
    }
    return { text: pickUniqueLine(STREAK_10_LINES, ctx.playerName), mood: "shocked" };
  }

  // 5 move streak milestone
  if (ctx.currentStreak === 5) {
    return { text: pickUniqueLine(STREAK_5_LINES, ctx.playerName), mood: "excited" };
  }

  // 3 move streak milestone
  if (ctx.currentStreak === 3) {
    return { text: pickUniqueLine(STREAK_3_LINES, ctx.playerName), mood: "playful" };
  }

  // Unit completed milestone
  if (ctx.unitCompleted) {
    return { text: pickUniqueLine(CARING_MOMENTS_LINES, ctx.playerName), mood: "proud" };
  }

  // Progress milestones
  if (ctx.progressPercent >= 90 && Math.random() < 0.5) {
    return { text: pickUniqueLine(NEAR_COMPLETE_90_LINES, ctx.playerName), mood: "excited" };
  }

  if (ctx.progressPercent >= 70 && Math.random() < 0.3) {
    return { text: pickUniqueLine(PROGRESS_70_LINES, ctx.playerName), mood: "happy" };
  }

  // Intelligent Frequency (70% friendly, 15% tease, 10% flirty, 5% bold/shy)
  if (moveCounter % 2 === 0) {
    const rand = Math.random();
    if (rand < 0.05) {
      return { text: pickUniqueLine(SHY_FLIRT_LINES, ctx.playerName), mood: "playful" };
    }
    if (rand < 0.15) {
      return { text: pickUniqueLine(BOLD_FLIRT_LINES, ctx.playerName), mood: "playful" };
    }
    if (rand < 0.30) {
      return { text: pickUniqueLine(PLAYFUL_TEASING_LINES, ctx.playerName), mood: "playful" };
    }
    return { text: pickUniqueLine(CORRECT_MOVE_LINES, ctx.playerName), mood: "happy" };
  }

  return null;
}

export function reactToStuck(isLong = false): VarshiniLine {
  if (isLong) {
    return { text: pickUniqueLine(LONG_INACTIVITY_LINES), mood: "thinking" };
  }
  return { text: pickUniqueLine(STUCK_15S_LINES), mood: "thinking" };
}

export function reactToHint(): VarshiniLine {
  return { text: pickUniqueLine(HINT_REQUEST_LINES), mood: "thinking" };
}

export function reactToIdle(): VarshiniLine {
  return { text: pickUniqueLine(LONG_INACTIVITY_LINES), mood: "idle" };
}

export function reactToSpectatorJoin(count: number): VarshiniLine {
  if (count >= 10) {
    return { text: "Pondatiii, 10+ audience ah?! Ippo nee celebrity 😂🔥", mood: "excited" };
  }
  if (count >= 5) {
    return { text: "Adei 5 people watching ah?! 🔥", mood: "excited" };
  }
  if (count >= 2) {
    return { text: "Ohooo, rendu per already watching 👀", mood: "playful" };
  }
  return { text: pickUniqueLine(SPECTATOR_JOIN_LINES), mood: "playful" };
}

export function reactToStart(difficulty: string): VarshiniLine {
  switch (difficulty) {
    case "easy":
      return { text: pickUniqueLine(EASY_START_LINES), mood: "happy" };
    case "medium":
      return { text: pickUniqueLine(MEDIUM_START_LINES), mood: "happy" };
    case "hard":
      return { text: pickUniqueLine(HARD_START_LINES), mood: "excited" };
    case "extreme":
      return { text: pickUniqueLine(EXTREME_START_LINES), mood: "shocked" };
    default:
      return { text: pickUniqueLine(MEDIUM_START_LINES), mood: "happy" };
  }
}

export function reactToVictory(elapsedSeconds: number, difficulty: string): VarshiniLine {
  const base = pickUniqueLine(VICTORY_LINES);
  const fastThreshold = difficulty === "extreme" ? 900 : difficulty === "hard" ? 600 : 300;
  if (elapsedSeconds <= fastThreshold) {
    return { text: `${base} ${pickUniqueLine(FAST_SOLVE_LINES)}`, mood: "celebrating" };
  }
  return { text: `${base} ${pickUniqueLine(SLOW_BUT_ACCURATE_LINES)}`, mood: "proud" };
}

export function greetingForRoom(playerName: string, isReturning = false): VarshiniLine {
  if (isReturning) {
    return { text: pickUniqueLine(GREETING_RETURNING_PLAYER, playerName), mood: "happy" };
  }
  return { text: pickUniqueLine(GREETING_NEW_PLAYER, playerName), mood: "happy" };
}

export function spectatorCommentary(
  playerName: string,
  roomStatus: string,
  actionType?: string,
  moveResult?: { correct: boolean },
  streak?: number,
  progressPercent?: number
): VarshiniLine {
  if (roomStatus === "completed") {
    return { text: `YASSS! ${playerName} solved it! 🏆🔥 Semma solve!`, mood: "celebrating" };
  }
  if (actionType === "place") {
    if (moveResult?.correct) {
      if (streak && streak >= 10) {
        return { text: `10 streak by ${playerName}! Semma form! 🔥🔥`, mood: "excited" };
      }
      if (streak && streak >= 5) {
        return { text: `5 correct moves continuous by ${playerName}! 🔥`, mood: "excited" };
      }
      return { text: `${playerName} nalla move pannitaanga 🔥`, mood: "happy" };
    } else {
      return { text: `Oops 😅 ${playerName} konjam miss pannitaanga.`, mood: "worried" };
    }
  }
  if (progressPercent && progressPercent >= 90) {
    return { text: `Almost solved by ${playerName}! 👀 Final stretch!`, mood: "excited" };
  }
  return { text: `Naan ${playerName} solve panradha watch panren 💜`, mood: "idle" };
}
