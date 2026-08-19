// 💜 VARSHINI — FINAL HUMAN-LIKE GIRLY DIALOGUE SYSTEM
// 100% Tanglish in English letters. Zero Tamil Unicode.
// Cute, playful, caring, encouraging, slightly possessive/teasing female companion.

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
// DIALOGUE POOLS
// -------------------------------------------------------------------

const GREETING_NEW_PLAYER: string[] = [
  "Heyyy! 👀 Naan Varshini 💜 Ready ah play pannalaama?",
  "Hii! Naan Varshini 😌 Innaiku namma Sudoku partner naan dhaan.",
  "Hey {name}! 👋 Ready ah? Oru semma game podalaama?",
  "Hiii {name} 💜 Naan Varshini. Start pannalama?",
  "Awww finally vandhutiya 😌 Ready ah chellam?",
  "Heyyy! 😌 Sudoku-ku ready ah? Naan already ready.",
  "Va di... illa wait, naan dhaan unakku companion 😂 Start pannalaama?",
];

const GREETING_RETURNING_PLAYER: string[] = [
  "Ahaa, thirumbi vandhutiya 😌",
  "Welcome back diii 💜",
  "Enna thango, innaiku enna challenge?",
  "Pondati back to Sudoku ah? 👀",
  "Heyyy, miss pannita maari irundhuchu 😂",
  "Okayyy, comeback time ah? 🔥",
];

const CORRECT_MOVE_LINES: string[] = [
  "Super di! 🔥",
  "Nalla move di!",
  "Heyy nalla vilayadura 😌",
  "Mass move, chellam!",
  "Semma correct di!",
  "Ahaa, adha dhaan expect panninen 😎",
  "Aww super solve panra 💜",
  "Nice one, pondati!",
  "Correct-ah kandupidichitta!",
  "Un Sudoku skills vera level 🔥",
  "Ithuku dhaan sonnen, nee genius nu 😌",
  "Clean move! Neat-ah irukku.",
  "Ahaaa, idhu semma move chellam 👀",
  "Good one di, keep going!",
  "Thango, unakku Sudoku nalla set aagudhu pola 😌",
  "Super-ah handle panra pondati!",
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
  "Adei 10 continuous ah?! 😳",
  "Ippo konjam bayama irukku... nee romba nalla play panra 😂",
  "Thango, idhu konjam over confidence level-ku pochu 👀",
  "Okay boss, Sudoku board unakku surrender panniduchu pola 😭🔥",
  "10 streak... seri seri, naan accept panren. Nee nalla player 😂",
];

const FIRST_MISTAKE_LINES: string[] = [
  "Oops 😅 konjam careful di.",
  "Parava illa, next move correct-ah podalaam.",
  "Aiyo 😭 adhu konjam wrong move, chellam.",
  "Chill di, game innum namma kai la dhaan.",
  "Konjam board-a observe pannitu podu.",
  "Okay ok, deep breath... meendum try pannu 💜",
  "Andha number vera oru place-ku poganum polirukku.",
  "Oops pondati 😅 once re-check pannu.",
  "Parava illa thango, mistake ellarukkum varum.",
  "Chellam, konjam slow-ah paakalaam.",
  "Aiyo di 😂 board namma kitta konjam clue kekkudhu.",
  "No worries ma, next one namma correct-ah podalaam 💜",
  "Adei 😂 konjam miss aayiduchu.",
  "Hmm... idhu namma plan illa di 😭",
  "It's okay chellam, next one namma paathukalaam.",
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
  "Konjam patience pondati, namma definitely solve pannalaam.",
  "Wait wait... konjam slow-ah po ma.",
];

const THREE_PLUS_MISTAKES_LINES: string[] = [
  "Chellam, tension edukkadha. Sudoku dhaan, namma jeyichidalaam 💜",
  "Pondati relax! Mistake aana enna, next cell focus pannalaam 😌",
  "Okayyy stop 😂 guess panna vendam, board-a paakalaam.",
  "Thango, konjam breathe pannu... apram try pannalaam.",
  "Aiyo paavam 😭 indha puzzle unna romba test panradhu pola.",
  "Chellam, namma pace-a konjam reduce pannalaam.",
  "Nee tension aagura maari theriyudhu... chill di 💜",
  "One step at a time pondati. Namma mudichidalaam.",
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
  "Enna yosana romba deep-ah pochu? 😂",
  "Adei, board-a paathu ivlo serious-ah yosikkariya? 😭",
];

const LONG_INACTIVITY_LINES: string[] = [
  "Thango, romba silent-ah poita 😌",
  "Enna pondati, board-a paathu yosichitu irukkiya?",
  "Heyy... alive ah? 😂",
  "Chellam, naan inga wait pannitu irukken 👀",
  "Enna di, answer unakku message anuppanumaa? 😂",
  "Take your time ma, no rush 💜",
  "Hmm... indha silence konjam suspicious-ah irukku 😏",
  "Pondati, next move eppo nu naan wait panren.",
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
  "Ippo dhaan final boss 😂🔥",
  "Innum konjam di... Sudoku namma kai-la!",
  "Adei, almost done! Ippo dhaan mistake panna koodadhu 😂",
  "Chellam, concentrate... victory pakkathula irukku 👀",
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
  "Adei, semma finish diii 🔥",
  "Chellam, unakku oru virtual hug kudukkanum pola 🥹💜",
  "Okayyy, today I'm proud of you 😌",
  "Nee mudichitta... naan happy 😭💜",
];

const FAST_SOLVE_LINES: string[] = [
  "Andha speed paaru! Vera level fast! ⚡",
  "Ippadi fast-ah mudichita, unna nambave mudiyala! 😂",
  "Chellam, turbo mode on pannitiya?! 🔥",
  "Pondati, Sudoku-va race-a maathita 😂",
  "What a speed di! ⚡🔥",
  "Varshini-ku shock kuduthuta 😳",
  "Indha timing semma impressive, thango!",
  "Adei, konjam slow-ah play pannalaam nu nenachen 😂",
  "Enna speed idhu pondati?! 😭🔥",
  "Okayyy speed queen 👑🔥",
  "Ippo dhaan puriyudhu, yen nee easy mode choose pannina nu 😂",
];

const SLOW_BUT_ACCURATE_LINES: string[] = [
  "Speed illa na enna, accuracy dhaan mukkiyam di 💜",
  "Slow and steady wins the Sudoku, correct-ah?",
  "Chellam, nithanama solve pannalum clean-ah mudichitta.",
  "Pondati, patience-ku result vandhuduchu 💜",
  "Accuracy semma, thango!",
  "Rush illaama perfect-ah finish pannita di.",
  "Nalla calm-ah play panni mudichitta. Proud 😌💜",
  "Time konjam eduthaalum result semma.",
  "Chellam, quality over speed 😌",
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
  "Adei, idhuvum yosikka vendiya move ah? 😂",
  "Enna di, romba scene podra 😂",
  "Chellam, board-a confuse panriya illa nee confuse aayitiya? 😭",
  "Thango, konjam over confidence pola 😏",
  "Okayyy boss, naan paathutu irukken 👀",
  "Hmm... indha move pathi enakku konjam doubt dhaan 😂",
  "Pondati, guess panna try pannadha nu sonnen la 😭",
  "Adei, naan watch panren nu marandhutiya? 😂",
  "Okay okay, naan edhuvum sollala... 👀😂",
];

const CARING_MOMENTS_LINES: string[] = [
  "Chellam, tension edukkadha 💜",
  "It's okay di, namma slowly pannalaam.",
  "Thango, rush panna vendam. Take your time.",
  "Pondati, oru deep breath... apram continue pannalaam 💜",
  "Mistake aaguradhu normal dhaan di.",
  "Namma game enjoy panna dhaan, pressure eduthukaadha 😌",
  "Chellam, nee mudichiduva. Just chill 💜",
];

const EXTRA_CUTE_LINES: string[] = [
  "Aww chellam 🥹💜",
  "Hehe, proud of you 😌",
  "En pondati nalla play panra 😂💜",
  "Thango, indha move-ku oru heart kudukkanum ❤️",
  "Aww, semma cute-ah solve panra 😭",
  "Okayyy, today you're making me proud 😌💜",
  "Chellam, you're actually good at this 👀",
  "Hehe, naan sonnen la nee pannuva nu 💜",
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
    chosen = chosen.replace("{name}", "thango");
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
    return { text: pickUniqueLine(EXTRA_CUTE_LINES, ctx.playerName), mood: "proud" };
  }

  // Progress milestones
  if (ctx.progressPercent >= 90 && Math.random() < 0.5) {
    return { text: pickUniqueLine(NEAR_COMPLETE_90_LINES, ctx.playerName), mood: "excited" };
  }

  if (ctx.progressPercent >= 70 && Math.random() < 0.3) {
    return { text: pickUniqueLine(PROGRESS_70_LINES, ctx.playerName), mood: "happy" };
  }

  // Intelligent Frequency (Rule 29): Only speak on ~50% of routine correct moves
  if (moveCounter % 2 === 0) {
    // 10% chance of playful tease on routine moves
    if (Math.random() < 0.1) {
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
