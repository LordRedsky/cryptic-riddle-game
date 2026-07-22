import { create } from 'zustand';
import { getAllPuzzles, shuffleArray } from '../lib/puzzleLoader';
import { sendHapticFeedback } from '../lib/telegram';
import { useUserStore } from './userStore';

export const useGameStore = create((set, get) => ({
  // Navigation & Session State
  screen: 'home', // 'home' | 'game' | 'result'
  gameState: 'idle', // 'idle' | 'playing' | 'correct' | 'wrong' | 'timeout'
  
  // Game Session Data
  puzzles: [],
  currentIndex: 0,
  currentPuzzle: null,
  userInput: [],
  
  // Gameplay Mechanics
  timeLeft: 15,
  score: 0,
  streak: 0,
  maxStreak: 0,
  lives: 3,
  
  // Modals
  isHintOpen: false,
  isExplainOpen: false,

  // Reveal feature: Set of global letter indices that are revealed
  revealedIndices: new Set(),

  // Session History
  history: [], // [{ id, puzzle, result: 'correct'|'timeout'|'failed', pointsEarned, timeSpent }]

  // --- ACTIONS ---

  setScreen: (screen) => set({ screen }),

  startGame: () => {
    const allPuzzles = getAllPuzzles();
    const shuffledPuzzles = shuffleArray(allPuzzles);
    
    set({
      screen: 'game',
      gameState: 'playing',
      puzzles: shuffledPuzzles,
      currentIndex: 0,
      score: 0,
      streak: 0,
      maxStreak: 0,
      lives: 3,
      history: [],
      isHintOpen: false,
      isExplainOpen: false,
    });

    get().loadPuzzle(0);
  },

  loadPuzzle: (index) => {
    const { puzzles } = get();
    if (index >= puzzles.length) {
      get().endGame();
      return;
    }

    const puzzle = puzzles[index];

    set({
      currentIndex: index,
      currentPuzzle: puzzle,
      userInput: [],
      timeLeft: 15,
      gameState: 'playing',
      isExplainOpen: false,
      isHintOpen: false,
      revealedIndices: new Set(), // Clear reveals per puzzle
    });
  },

  typeLetter: (letter) => {
    const { gameState, currentPuzzle, userInput } = get();
    if (gameState !== 'playing' || !currentPuzzle) return;

    const targetAnswer = currentPuzzle.answer.replace(/\s+/g, '').toUpperCase();
    if (userInput.length >= targetAnswer.length) return;

    sendHapticFeedback('light');
    const newInput = [...userInput, letter];
    set({ userInput: newInput });

    // Auto check when all slots are filled
    if (newInput.length === targetAnswer.length) {
      get().submitAnswer(newInput.join(''));
    }
  },

  backspace: () => {
    const { gameState, userInput } = get();
    if (gameState !== 'playing' || userInput.length === 0) return;
    
    sendHapticFeedback('light');
    set({ userInput: userInput.slice(0, -1) });
  },

  clearInput: () => {
    const { gameState } = get();
    if (gameState !== 'playing') return;
    
    sendHapticFeedback('light');
    set({ userInput: [] });
  },

  submitAnswer: (attempt) => {
    const { currentPuzzle, timeLeft, score, streak, maxStreak, history } = get();
    if (!currentPuzzle) return;

    const correctAnswer = currentPuzzle.answer.replace(/\s+/g, '').toUpperCase();
    const isCorrect = attempt.toUpperCase() === correctAnswer;

    if (isCorrect) {
      sendHapticFeedback('success');
      
      const newStreak = streak + 1;
      const multiplier = newStreak >= 5 ? 1.5 : 1.0;
      const pointsEarned = Math.round(timeLeft * 10 * multiplier);
      const newScore = score + pointsEarned;
      const newMaxStreak = Math.max(maxStreak, newStreak);

      useUserStore.getState().incrementPuzzlesSolved();
      useUserStore.getState().updateHighScore(newScore);

      const newHistoryItem = {
        id: currentPuzzle.id,
        puzzle: currentPuzzle,
        result: 'correct',
        pointsEarned,
        timeSpent: 15 - timeLeft,
      };

      set({
        score: newScore,
        streak: newStreak,
        maxStreak: newMaxStreak,
        gameState: 'correct',
        isExplainOpen: true,
        history: [...history, newHistoryItem],
      });
    } else {
      sendHapticFeedback('error');
      
      // Penalty: -3 seconds timer deduction
      const newTime = Math.max(0, timeLeft - 3);
      set({
        timeLeft: newTime,
        gameState: 'wrong',
        userInput: [], // Reset input on wrong attempt
      });

      // Reset wrong state back to playing after shake animation finishes (400ms)
      setTimeout(() => {
        if (get().gameState === 'wrong') {
          set({ gameState: 'playing' });
        }
      }, 400);

      if (newTime === 0) {
        get().handleTimeout();
      }
    }
  },

  tickTimer: () => {
    const { gameState, timeLeft } = get();
    if (gameState !== 'playing') return;

    if (timeLeft <= 1) {
      set({ timeLeft: 0 });
      get().handleTimeout();
    } else {
      set({ timeLeft: timeLeft - 1 });
    }
  },

  handleTimeout: () => {
    sendHapticFeedback('warning');
    const { currentPuzzle, history } = get();

    const newLives = get().lives - 1;
    const newHistoryItem = {
      id: currentPuzzle.id,
      puzzle: currentPuzzle,
      result: 'timeout',
      pointsEarned: 0,
      timeSpent: 15,
    };

    set({
      streak: 0, // Break streak on timeout
      lives: newLives,
      gameState: 'timeout',
      isExplainOpen: true,
      history: [...history, newHistoryItem],
    });
  },

  nextPuzzle: () => {
    const { currentIndex, lives } = get();
    if (lives <= 0) {
      get().endGame();
    } else {
      get().loadPuzzle(currentIndex + 1);
    }
  },

  reviveWithAd: () => {
    sendHapticFeedback('success');
    const { currentIndex } = get();
    set({
      lives: 3,
      screen: 'game',
      gameState: 'playing',
      isExplainOpen: false,
      isHintOpen: false,
    });
    get().loadPuzzle(currentIndex + 1);
  },

  toggleHint: (show) => set({ isHintOpen: show !== undefined ? show : !get().isHintOpen }),
  toggleExplain: (show) => set({ isExplainOpen: show !== undefined ? show : !get().isExplainOpen }),

  // Reveal 3 random unrevealed letter positions from the current puzzle
  revealRandomLetters: () => {
    const { currentPuzzle, revealedIndices } = get();
    if (!currentPuzzle) return;

    // Flatten answer into letters (ignoring spaces), building index list
    const letters = currentPuzzle.answer.replace(/\s+/g, '').toUpperCase();
    const totalCount = letters.length;

    // Find all indices not yet revealed
    const unrevealed = [];
    for (let i = 0; i < totalCount; i++) {
      if (!revealedIndices.has(i)) unrevealed.push(i);
    }

    // Pick up to 3 random indices from unrevealed
    const toReveal = [];
    const pool = [...unrevealed];
    const pickCount = Math.min(3, pool.length);
    for (let i = 0; i < pickCount; i++) {
      const randIdx = Math.floor(Math.random() * pool.length);
      toReveal.push(pool[randIdx]);
      pool.splice(randIdx, 1);
    }

    const newSet = new Set(revealedIndices);
    toReveal.forEach((idx) => newSet.add(idx));
    set({ revealedIndices: newSet });
  },

  endGame: () => {
    const { score } = get();
    useUserStore.getState().updateHighScore(score);
    set({
      screen: 'result',
      gameState: 'idle',
      isExplainOpen: false,
      isHintOpen: false,
    });
  }
}));
