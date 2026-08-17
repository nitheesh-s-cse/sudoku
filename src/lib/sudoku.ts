// A complete, dependency-free Sudoku engine: generator (with unique-solution
// guarantee), solver, and validators. Board representation is a flat 81-length
// number[] (row-major), 0 meaning "empty".

export type Board = number[];
export type Difficulty = "easy" | "medium" | "hard" | "extreme";

export const EMPTY_CELL = 0;

function indexOf(row: number, col: number) {
  return row * 9 + col;
}

function rowOf(index: number) {
  return Math.floor(index / 9);
}

function colOf(index: number) {
  return index % 9;
}

function boxOf(index: number) {
  const r = rowOf(index);
  const c = colOf(index);
  return Math.floor(r / 3) * 3 + Math.floor(c / 3);
}

export function isValidPlacement(board: Board, index: number, value: number): boolean {
  const r = rowOf(index);
  const c = colOf(index);
  for (let i = 0; i < 9; i++) {
    const rIdx = indexOf(r, i);
    const cIdx = indexOf(i, c);
    if (rIdx !== index && board[rIdx] === value) return false;
    if (cIdx !== index && board[cIdx] === value) return false;
  }
  const br = Math.floor(r / 3) * 3;
  const bc = Math.floor(c / 3) * 3;
  for (let dr = 0; dr < 3; dr++) {
    for (let dc = 0; dc < 3; dc++) {
      const idx = indexOf(br + dr, bc + dc);
      if (idx !== index && board[idx] === value) return false;
    }
  }
  return true;
}

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Fills a fully empty board into a complete, valid, randomized solution grid.
function fillBoard(board: Board): boolean {
  const emptyIndex = board.indexOf(0);
  if (emptyIndex === -1) return true;

  for (const value of shuffled([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
    if (isValidPlacement(board, emptyIndex, value)) {
      board[emptyIndex] = value;
      if (fillBoard(board)) return true;
      board[emptyIndex] = 0;
    }
  }
  return false;
}

export function generateSolvedBoard(): Board {
  const board = new Array(81).fill(0);
  fillBoard(board);
  return board;
}

// Counts solutions up to `limit` (stops early once found) — used to guarantee
// puzzles have exactly one solution.
function countSolutions(board: Board, limit = 2): number {
  const emptyIndex = board.indexOf(0);
  if (emptyIndex === -1) return 1;

  let count = 0;
  for (let value = 1; value <= 9; value++) {
    if (isValidPlacement(board, emptyIndex, value)) {
      board[emptyIndex] = value;
      count += countSolutions(board, limit - count);
      board[emptyIndex] = 0;
      if (count >= limit) break;
    }
  }
  return count;
}

export function hasUniqueSolution(board: Board): boolean {
  return countSolutions([...board], 2) === 1;
}

const DIFFICULTY_CLUES: Record<Difficulty, [number, number]> = {
  easy: [40, 45],
  medium: [32, 36],
  hard: [26, 30],
  extreme: [22, 25],
};

// Removes numbers from a solved board while preserving a unique solution,
// stopping once the target clue count is reached.
function digHoles(solved: Board, targetClues: number): Board {
  const puzzle = [...solved];
  const positions = shuffled(Array.from({ length: 81 }, (_, i) => i));
  let clues = 81;

  for (const pos of positions) {
    if (clues <= targetClues) break;
    const backup = puzzle[pos];
    if (backup === 0) continue;
    puzzle[pos] = 0;

    if (hasUniqueSolution(puzzle)) {
      clues--;
    } else {
      puzzle[pos] = backup;
    }
  }
  return puzzle;
}

export interface GeneratedPuzzle {
  puzzle: Board;
  solution: Board;
  difficulty: Difficulty;
}

export function generatePuzzle(difficulty: Difficulty = "medium"): GeneratedPuzzle {
  const solution = generateSolvedBoard();
  const [min, max] = DIFFICULTY_CLUES[difficulty];
  const targetClues = Math.floor(Math.random() * (max - min + 1)) + min;
  const puzzle = digHoles(solution, targetClues);
  return { puzzle, solution, difficulty };
}

export function solveBoard(board: Board): Board | null {
  const copy = [...board];
  const solved = fillBoardWithClues(copy);
  return solved ? copy : null;
}

function fillBoardWithClues(board: Board): boolean {
  const emptyIndex = board.indexOf(0);
  if (emptyIndex === -1) return true;
  for (let value = 1; value <= 9; value++) {
    if (isValidPlacement(board, emptyIndex, value)) {
      board[emptyIndex] = value;
      if (fillBoardWithClues(board)) return true;
      board[emptyIndex] = 0;
    }
  }
  return false;
}

export function isBoardComplete(board: Board): boolean {
  return board.every((v) => v !== 0);
}

export function isBoardCorrect(board: Board, solution: Board): boolean {
  return board.every((v, i) => v === solution[i]);
}

export function countFilled(board: Board): number {
  return board.filter((v) => v !== 0).length;
}

export function progressPercent(board: Board, puzzle: Board): number {
  const totalToFill = puzzle.filter((v) => v === 0).length;
  if (totalToFill === 0) return 100;
  const filledByPlayer = board.filter((v, i) => v !== 0 && puzzle[i] === 0).length;
  return Math.round((filledByPlayer / totalToFill) * 100);
}

export function getRow(index: number): number[] {
  const r = rowOf(index);
  return Array.from({ length: 9 }, (_, c) => indexOf(r, c));
}

export function getCol(index: number): number[] {
  const c = colOf(index);
  return Array.from({ length: 9 }, (_, r) => indexOf(r, c));
}

export function getBox(index: number): number[] {
  const r = rowOf(index);
  const c = colOf(index);
  const br = Math.floor(r / 3) * 3;
  const bc = Math.floor(c / 3) * 3;
  const cells: number[] = [];
  for (let dr = 0; dr < 3; dr++) {
    for (let dc = 0; dc < 3; dc++) {
      cells.push(indexOf(br + dr, bc + dc));
    }
  }
  return cells;
}

export function isUnitComplete(board: Board, unit: number[]): boolean {
  const values = unit.map((i) => board[i]);
  if (values.some((v) => v === 0)) return false;
  return new Set(values).size === 9;
}

// Finds a valid, unfilled cell to reveal as a hint (prefers the selected cell
// if it's empty, otherwise a random empty cell).
export function getHintCell(board: Board, solution: Board, preferredIndex?: number): number {
  if (
    preferredIndex !== undefined &&
    preferredIndex >= 0 &&
    board[preferredIndex] === 0
  ) {
    return preferredIndex;
  }
  const emptyCells = board
    .map((v, i) => (v === 0 ? i : -1))
    .filter((i) => i !== -1);
  if (emptyCells.length === 0) return -1;
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

export { rowOf, colOf, boxOf, indexOf };
