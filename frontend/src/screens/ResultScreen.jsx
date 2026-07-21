import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Share2, RotateCcw, Trophy, Flame, CheckCircle, XCircle } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { useUserStore } from '../store/userStore';
import { shareScoreToTelegram } from '../lib/telegram';

export const ResultScreen = () => {
  const { score, maxStreak, history, startGame, setScreen } = useGameStore();
  const language = useUserStore((state) => state.language);

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
      <div className="my-4 cyber-card p-6 rounded-3xl border border-cyber-cyan/30 text-center relative shadow-2xl">
        <div className="flex justify-center mb-2">
          <div className="p-3 rounded-full bg-cyber-yellow/10 text-cyber-yellow border border-cyber-yellow/30 shadow-glow-purple">
            <Trophy className="w-10 h-10" />
          </div>
        </div>

        <span className="text-xs font-cyber text-cyber-muted uppercase block">Total Poin</span>
        <h3 className="font-cyber text-5xl font-extrabold text-cyber-yellow text-glow-yellow mb-4">
          {score}
        </h3>

        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
          <div className="bg-cyber-surface/60 p-2.5 rounded-xl border border-white/5">
            <span className="text-[10px] font-cyber text-cyber-muted uppercase block">Puzzled Solved</span>
            <span className="font-cyber text-lg font-bold text-cyber-green">
              {puzzlesSolvedCount} / {history.length}
            </span>
          </div>

          <div className="bg-cyber-surface/60 p-2.5 rounded-xl border border-white/5">
            <span className="text-[10px] font-cyber text-cyber-muted uppercase block">Max Streak</span>
            <div className="flex items-center justify-center space-x-1 font-cyber text-lg font-bold text-cyber-yellow">
              <Flame className="w-4 h-4 fill-cyber-yellow" />
              <span>{maxStreak}🔥</span>
            </div>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto max-h-48 my-2 pr-1 space-y-2">
        <span className="text-xs font-cyber text-cyber-muted uppercase block mb-1">
          Ringkasan Puzzle:
        </span>
        {history.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-2.5 rounded-xl bg-cyber-surface/40 border border-white/5 text-xs font-cyber"
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
      <div className="w-full space-y-2.5 pt-3 pb-4">
        <button
          onClick={() => shareScoreToTelegram(score, maxStreak, puzzlesSolvedCount)}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 via-cyber-cyan to-teal-400 text-cyber-dark font-cyber font-extrabold text-lg uppercase tracking-wider flex items-center justify-center space-x-2 shadow-glow-cyan active:scale-98 transition-all"
        >
          <Share2 className="w-5 h-5" />
          <span>Share ke Group Telegram</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={startGame}
            className="py-3 rounded-xl bg-cyber-green text-cyber-dark font-cyber font-bold text-sm uppercase tracking-wider flex items-center justify-center space-x-1.5 active:scale-98 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Main Lagi</span>
          </button>

          <button
            onClick={() => setScreen('home')}
            className="py-3 rounded-xl bg-cyber-surface/60 hover:bg-cyber-surface border border-white/10 text-cyber-text font-cyber font-bold text-sm uppercase tracking-wider active:scale-98 transition-all"
          >
            Menu Utama
          </button>
        </div>
      </div>
    </div>
  );
};
