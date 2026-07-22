import { create } from 'zustand';
import { getTelegramUser, initTelegramSDK } from '../lib/telegram';

const SAVED_HIGH_SCORE_KEY = 'cryptic_decoder_high_score';
const SAVED_LANG_KEY = 'cryptic_decoder_lang';
const REVEAL_COUNT_KEY = 'cryptic_decoder_reveal_count';
const REVEAL_DATE_KEY = 'cryptic_decoder_reveal_date';

const MAX_FREE_REVEALS_PER_DAY = 3;

const getTodayStr = () => new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"

const loadRevealState = () => {
  const today = getTodayStr();
  const savedDate = localStorage.getItem(REVEAL_DATE_KEY) || '';
  if (savedDate !== today) {
    // New day — reset
    localStorage.setItem(REVEAL_DATE_KEY, today);
    localStorage.setItem(REVEAL_COUNT_KEY, '0');
    return 0;
  }
  return parseInt(localStorage.getItem(REVEAL_COUNT_KEY) || '0', 10);
};

export const useUserStore = create((set, get) => ({
  user: null,
  language: 'id', // 'id' | 'en'
  highScore: 0,
  puzzlesSolvedCount: 0,

  // Daily reveal tracking (3 free uses/day; 4th+ needs ad)
  revealUsedToday: 0,

  initUser: () => {
    initTelegramSDK();
    const tgUser = getTelegramUser();

    const savedHighScore = parseInt(localStorage.getItem(SAVED_HIGH_SCORE_KEY) || '0', 10);
    const savedLang = localStorage.getItem(SAVED_LANG_KEY) || (tgUser?.language_code === 'en' ? 'en' : 'id');
    const revealUsedToday = loadRevealState();

    set({
      user: tgUser,
      language: savedLang,
      highScore: savedHighScore,
      revealUsedToday,
    });
  },

  setLanguage: (lang) => {
    localStorage.setItem(SAVED_LANG_KEY, lang);
    set({ language: lang });
  },

  updateHighScore: (newScore) => {
    const currentHigh = get().highScore;
    if (newScore > currentHigh) {
      localStorage.setItem(SAVED_HIGH_SCORE_KEY, newScore.toString());
      set({ highScore: newScore });
      return true;
    }
    return false;
  },

  incrementPuzzlesSolved: () => {
    set((state) => ({ puzzlesSolvedCount: state.puzzlesSolvedCount + 1 }));
  },

  // Returns true if free reveal is still available
  canRevealFree: () => {
    const count = loadRevealState();
    set({ revealUsedToday: count });
    return count < MAX_FREE_REVEALS_PER_DAY;
  },

  // Call when user uses a reveal (free or after-ad)
  useReveal: () => {
    const today = getTodayStr();
    const current = loadRevealState();
    const next = current + 1;
    localStorage.setItem(REVEAL_DATE_KEY, today);
    localStorage.setItem(REVEAL_COUNT_KEY, next.toString());
    set({ revealUsedToday: next });
  },

  // After watching ad, grant 1 extra reveal by resetting count to MAX-1
  // so the next useReveal() brings it to MAX
  grantAdReveal: () => {
    const today = getTodayStr();
    // Reset count to MAX so they get exactly 1 more use after ad
    localStorage.setItem(REVEAL_DATE_KEY, today);
    localStorage.setItem(REVEAL_COUNT_KEY, MAX_FREE_REVEALS_PER_DAY.toString());
    set({ revealUsedToday: MAX_FREE_REVEALS_PER_DAY });
  },

  getRevealUsedToday: () => loadRevealState(),
  maxFreeRevealsPerDay: MAX_FREE_REVEALS_PER_DAY,
}));
