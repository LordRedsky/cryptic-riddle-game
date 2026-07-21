import React from 'react';
import { useUserStore } from '../store/userStore';

export const ClueDisplay = ({ puzzle }) => {
  const language = useUserStore((state) => state.language);

  if (!puzzle) return null;

  const category = language === 'en' ? puzzle.category_en : puzzle.category_id;
  const difficultyStars = '★'.repeat(puzzle.difficulty) + '☆'.repeat(3 - puzzle.difficulty);

  return (
    <div className="flex flex-col items-center justify-center my-3 w-full">
      {/* Category Badge & Difficulty */}
      <div className="flex items-center space-x-2 mb-3">
        <span className="px-3 py-0.5 rounded-full text-xs font-cyber tracking-wider bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan">
          {category}
        </span>
        <span className="text-xs text-cyber-yellow font-cyber tracking-widest" title={`Difficulty: ${puzzle.difficulty}/3`}>
          {difficultyStars}
        </span>
      </div>

      {/* Emoji Clues Container */}
      <div className="cyber-card w-full py-6 px-4 rounded-2xl flex items-center justify-center space-x-3 shadow-lg border border-white/10 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-cyan/5 via-transparent to-cyber-purple/5 pointer-events-none" />
        
        {puzzle.clues.map((clue, idx) => (
          <div
            key={idx}
            className="text-4xl sm:text-5xl transform hover:scale-110 transition-transform duration-200 select-none drop-shadow-md"
          >
            {clue}
          </div>
        ))}
      </div>
    </div>
  );
};
