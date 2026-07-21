import React from 'react';

export const AnswerSlots = ({ answer, userInput, gameState }) => {
  if (!answer) return null;

  // Split answer into words to handle multi-word answers smoothly
  const words = answer.split(' ');
  let letterIndexCounter = 0;

  const isWrong = gameState === 'wrong';

  return (
    <div className={`flex flex-wrap justify-center items-center gap-2 my-4 w-full ${isWrong ? 'animate-shake' : ''}`}>
      {words.map((word, wordIdx) => {
        const letters = word.split('');
        return (
          <div key={wordIdx} className="flex space-x-1.5 items-center my-1">
            {letters.map((char, charIdx) => {
              const currentGlobalIndex = letterIndexCounter++;
              const typedLetter = userInput[currentGlobalIndex] || '';
              const isActive = userInput.length === currentGlobalIndex;

              let slotStyle = 'bg-cyber-surface/60 border-white/10 text-cyber-text';
              if (typedLetter) {
                slotStyle = 'bg-cyber-surface border-cyber-cyan text-cyber-cyan shadow-glow-cyan font-bold';
              }
              if (isActive && gameState === 'playing') {
                slotStyle += ' border-cyber-green animate-pulse';
              }
              if (isWrong) {
                slotStyle = 'bg-cyber-red/20 border-cyber-red text-cyber-red shadow-glow-red font-bold';
              }

              return (
                <div
                  key={charIdx}
                  className={`w-9 h-11 sm:w-11 sm:h-13 rounded-lg border-2 flex items-center justify-center text-xl sm:text-2xl font-cyber uppercase transition-all duration-150 ${slotStyle}`}
                >
                  {typedLetter}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
