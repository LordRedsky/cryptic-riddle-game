import { create } from 'zustand';
import { getTelegramUser, initTelegramSDK } from '../lib/telegram';

const SAVED_HIGH_SCORE_KEY = 'cryptic_decoder_high_score';
const SAVED_LANG_KEY = 'cryptic_decoder_lang';

export const useUserStore = create((set, get) => ({
  user: null,
  language: 'id', // 'id' | 'en'
  highScore: 0,
  puzzlesSolvedCount: 0,

  initUser: () => {
    initTelegramSDK();
    const tgUser = getTelegramUser();
    
    // Saved high score
    const savedHighScore = parseInt(localStorage.getItem(SAVED_HIGH_SCORE_KEY) || '0', 10);
    const savedLang = localStorage.getItem(SAVED_LANG_KEY) || (tgUser?.language_code === 'en' ? 'en' : 'id');

    set({
      user: tgUser,
      language: savedLang,
      highScore: savedHighScore,
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
  }
}));
