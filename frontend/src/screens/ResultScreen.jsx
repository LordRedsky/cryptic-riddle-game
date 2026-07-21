import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Share2, RotateCcw, Trophy, Flame, CheckCircle, XCircle, Tv, Heart } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { useUserStore } from '../store/userStore';
import { shareScoreToTelegram } from '../lib/telegram';
import { showRewardedAd } from '../lib/adsgram';

export const ResultScreen = ({ adsgramBlockId = 'YOUR_ADSGRAM_BLOCK_ID' }) => {
  const { score, maxStreak, history, startGame, setScreen, reviveWithAd } = useGameStore();
  const language = useUserStore((state) => state.language);
  const [loadingAd, setLoadingAd] = useState(false);

  const puzzlesSolvedCount = history.filter((h) => h.result === 'correct').length;

  useEffect(() => {
    if (score > 0) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00F2FE', '#00FF87', '#FFD000'],
        });
      } catch (e) {
        console.warn('Confetti error:', e);
      }
    }
  }, [score]);

  const handleWatchAdForLives = () => {
    setLoadingAd(true);
    showRewardedAd({
      blockId: adsgramBlockId,
      onSuccess: () => {
        setLoadingAd(false);
        reviveWithAd(); // Restores 3 lives & resumes game session
      },
      onError: (err) => {
        setLoadingAd(false);
        console.warn("Failed to watch ad for extra lives:", err);
      }
    });
  };

  return (
    <div className="flex flex-col justify-between min-h-screen p-5 max-w-md mx-auto grid-bg relative">
      {/* Top Header */}
      <div className="text-center pt-4">
        <span className="text-xs font-cyber text-cyber-muted tracking-widest uppercase block">
          Session Complete
        </span>
        <h2 className="font-cyber text-3xl font-extrabold text-cyber-cyan text-glow-cyan uppercase">
          Hasil Permainan
        </h2>
      </div>

      {/* Hero Stats Card */}
      <div className="my-3 cyber-card p-5 rounded-3xl border border-cyber-cyan/30 text-center relative shadow-2xl">
        <div className="flex justify-center mb-1">
          <div className="p-2.5 rounded-full bg-cyber-yellow/10 text-cyber-yellow border border-cyber-yellow/30 shadow-glow-purple">
            <Trophy className="w-8 h-8" />
          </div>
        </div>

        <span className="text-[10px] font-cyber text-cyber-muted uppercase block">Total Poin</span>
        <h3 className="font-cyber text-4xl font-extrabold text-cyber-yellow text-glow-yellow mb-3">
          {score}
        </h3>

        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10">
          <div className="bg-cyber-surface/60 p-2 rounded-xl border border-white/5">
            <span className="text-[10px] font-cyber text-cyber-muted uppercase block">Puzzled Solved</span>
            <span className="font-cyber text-base font-bold text-cyber-green">
              {puzzlesSolvedCount} / {history.length}
            </span>
          </div>

          <div className="bg-cyber-surface/60 p-2 rounded-xl border border-white/5">
            <span className="text-[10px] font-cyber text-cyber-muted uppercase block">Max Streak</span>
            <div className="flex items-center justify-center space-x-1 font-cyber text-base font-bold text-cyber-yellow">
              <Flame className="w-4 h-4 fill-cyber-yellow" />
              <span>{maxStreak}🔥</span>
            </div>
          </div>
        </div>
      </div>

      {/* Revive Offer Box (Watch Ad = +3 Lives) */}
      <div className="mb-2 p-3 rounded-2xl bg-gradient-to-r from-purple-900/60 via-cyber-surface/80 to-purple-900/60 border border-cyber-purple/50 text-center shadow-lg">
        <div className="flex items-center justify-center space-x-1 mb-1 text-cyber-yellow font-cyber font-bold text-xs uppercase">
          <Heart className="w-4 h-4 text-cyber-red fill-cyber-red animate-pulse" />
          <span>Kehabisan Nyawa?</span>
        </div>
        <button
          onClick={handleWatchAdForLives}
          disabled={loadingAd}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-cyber-yellow via-amber-400 to-cyber-green text-cyber-dark font-cyber font-extrabold text-sm uppercase tracking-wider flex items-center justify-center space-x-2 shadow-glow-yellow active:scale-95 transition-all disabled:opacity-50"
        >
          <Tv className="w-4 h-4" />
          <span>{loadingAd ? 'Memuat Iklan...' : 'Nonton Iklan = +3 Nyawa & Lanjut!'}</span>
        </button>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto max-h-36 my-1 pr-1 space-y-1.5">
        <span className="text-[10px] font-cyber text-cyber-muted uppercase block mb-1">
          Ringkasan Puzzle:
        </span>
        {history.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-2 rounded-xl bg-cyber-surface/40 border border-white/5 text-xs font-cyber"
          >
            <div className="flex items-center space-x-2">
              {item.result === 'correct' ? (
                <CheckCircle className="w-4 h-4 text-cyber-green" />
              ) : (
                <XCircle className="w-4 h-4 text-cyber-red" />
              )}
              <span className="text-base">{item.puzzle.clues.join('')}</span>
              <span className="font-bold text-cyber-text uppercase">{item.puzzle.answer}</span>
            </div>

            <span className={item.result === 'correct' ? 'text-cyber-green font-bold' : 'text-cyber-muted'}>
              +{item.pointsEarned}
            </span>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="w-full space-y-2 pt-2 pb-3">
        <button
          onClick={() => shareScoreToTelegram(score, maxStreak, puzzlesSolvedCount)}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-500 via-cyber-cyan to-teal-400 text-cyber-dark font-cyber font-extrabold text-base uppercase tracking-wider flex items-center justify-center space-x-2 shadow-glow-cyan active:scale-98 transition-all"
        >
          <Share2 className="w-4 h-4" />
          <span>Share ke Group Telegram</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={startGame}
            className="py-2.5 rounded-xl bg-cyber-green text-cyber-dark font-cyber font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-1 active:scale-98 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Main Lagi</span>
          </button>

          <button
            onClick={() => setScreen('home')}
            className="py-2.5 rounded-xl bg-cyber-surface/60 hover:bg-cyber-surface border border-white/10 text-cyber-text font-cyber font-bold text-xs uppercase tracking-wider active:scale-98 transition-all"
          >
            Menu Utama
          </button>
        </div>
      </div>
    </div>
  );
};
