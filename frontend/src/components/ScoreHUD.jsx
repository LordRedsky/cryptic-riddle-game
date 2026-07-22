import React from 'react';
import { Flame, Heart, HelpCircle, Eye } from 'lucide-react';

export const ScoreHUD = ({
  score,
  streak,
  lives,
  currentIndex,
  totalPuzzles,
  onOpenHint,
  onOpenReveal,
  revealUsedToday = 0,
  maxFreeReveals = 3,
}) => {
  const revealsLeft = Math.max(0, maxFreeReveals - revealUsedToday);

  return (
    <div className="flex items-center justify-between w-full px-2 py-2 bg-cyber-surface/40 rounded-xl border border-white/5 backdrop-blur-md">
      {/* Level / Index */}
      <div className="flex items-center space-x-1">
        <span className="text-xs font-cyber text-cyber-muted uppercase">Lvl</span>
        <span className="text-sm font-cyber font-bold text-cyber-cyan">
          #{currentIndex + 1}
        </span>
      </div>

      {/* Score & Streak */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1">
          <span className="text-xs font-cyber text-cyber-muted">PTS:</span>
          <span className="text-base font-cyber font-bold text-cyber-green text-glow-green">
            {score}
          </span>
        </div>

        {streak > 0 && (
          <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-cyber-yellow/10 border border-cyber-yellow/30 text-cyber-yellow text-xs font-cyber animate-pulse">
            <Flame className="w-3.5 h-3.5 fill-cyber-yellow" />
            <span className="font-bold">x{streak}</span>
            {streak >= 5 && <span className="text-[10px] text-cyber-green font-bold">1.5x</span>}
          </div>
        )}
      </div>

      {/* Lives, Reveal & Hint Buttons */}
      <div className="flex items-center space-x-2">
        <div className="flex space-x-0.5">
          {[1, 2, 3].map((heartNum) => (
            <Heart
              key={heartNum}
              className={`w-4 h-4 ${
                heartNum <= lives
                  ? 'text-cyber-red fill-cyber-red'
                  : 'text-cyber-muted opacity-30'
              }`}
            />
          ))}
        </div>

        {/* Reveal Button */}
        <button
          onClick={onOpenReveal}
          className="relative p-1 rounded-lg bg-cyber-yellow/10 hover:bg-cyber-yellow/20 text-cyber-yellow border border-cyber-yellow/30 active:scale-95 transition-all"
          title="Buka 3 Huruf"
        >
          <Eye className="w-4 h-4" />
          {/* Badge: remaining reveals */}
          <span
            className={`absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] px-0.5 rounded-full text-[9px] font-cyber font-bold flex items-center justify-center ${
              revealsLeft > 0
                ? 'bg-cyber-yellow text-cyber-dark'
                : 'bg-cyber-red/80 text-white'
            }`}
          >
            {revealsLeft > 0 ? revealsLeft : '!'}
          </span>
        </button>

        {/* Hint Button */}
        <button
          onClick={onOpenHint}
          className="p-1 rounded-lg bg-cyber-cyan/10 hover:bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/30 active:scale-95 transition-all"
          title="Hint"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

