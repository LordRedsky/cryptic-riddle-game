import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { ScoreHUD } from '../components/ScoreHUD';
import { TimerBar } from '../components/TimerBar';
import { ClueDisplay } from '../components/ClueDisplay';
import { AnswerSlots } from '../components/AnswerSlots';
import { VirtualKeyboard } from '../components/VirtualKeyboard';
import { ExplainModal } from '../components/ExplainModal';
import { HintModal } from '../components/HintModal';

export const GameScreen = () => {
  const inputRef = useRef(null);

  const {
    currentPuzzle,
    currentIndex,
    puzzles,
    userInput,
    timeLeft,
    score,
    streak,
    lives,
    gameState,
    isHintOpen,
    isExplainOpen,
    typeLetter,
    backspace,
    clearInput,
    tickTimer,
    nextPuzzle,
    toggleHint,
    toggleExplain,
  } = useGameStore();

  // Active Timer Loop
  useEffect(() => {
    let interval = null;
    if (gameState === 'playing') {
      interval = setInterval(() => {
        tickTimer();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState, tickTimer]);

  // Global Physical & Mobile Input Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== 'playing') return;

      if (e.key === 'Backspace') {
        backspace();
      } else if (e.key === 'Escape') {
        clearInput();
      } else if (/^[a-zA-Z0-9]$/.test(e.key)) {
        typeLetter(e.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, backspace, clearInput, typeLetter]);

  // Focus hidden input on slot tap to summon native mobile OS keyboard if desired
  const focusNativeInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleHiddenInputChange = (e) => {
    const val = e.target.value;
    if (!val) return;
    const lastChar = val[val.length - 1];
    if (/^[a-zA-Z0-9]$/.test(lastChar)) {
      typeLetter(lastChar.toUpperCase());
    }
    e.target.value = '';
  };

  if (!currentPuzzle) return null;

  const currentHistoryItem = useGameStore.getState().history.slice(-1)[0];
  const pointsEarned = currentHistoryItem ? currentHistoryItem.pointsEarned : 0;

  return (
    <div className="flex flex-col justify-between min-h-screen p-4 max-w-md mx-auto grid-bg relative overflow-hidden select-none">
      {/* Hidden Native Input element for summoning phone OS keyboard */}
      <input
        ref={inputRef}
        type="text"
        className="opacity-0 absolute top-0 left-0 w-1 h-1 pointer-events-none"
        onChange={handleHiddenInputChange}
        autoComplete="off"
        autoCapitalize="characters"
      />

      {/* Top Header & HUD */}
      <div>
        <ScoreHUD
          score={score}
          streak={streak}
          lives={lives}
          currentIndex={currentIndex}
          totalPuzzles={puzzles.length}
          onOpenHint={() => toggleHint(true)}
        />

        <TimerBar timeLeft={timeLeft} maxTime={15} />

        <ClueDisplay puzzle={currentPuzzle} />
      </div>

      {/* Center: Answer Slots (Tapping summons native phone keyboard) */}
      <div className="my-auto cursor-pointer" onClick={focusNativeInput}>
        <AnswerSlots
          answer={currentPuzzle.answer}
          userInput={userInput}
          gameState={gameState}
        />
        <p className="text-[10px] text-center font-cyber text-cyber-muted tracking-wider uppercase opacity-60">
          Tekan kotak untuk ketik lewat keyboard HP / PC
        </p>
      </div>

      {/* Bottom: QWERTY Virtual Keyboard */}
      <div>
        <VirtualKeyboard
          answer={currentPuzzle.answer}
          onType={typeLetter}
          onBackspace={backspace}
          onClear={clearInput}
          disabled={gameState !== 'playing'}
        />
      </div>

      {/* Modals */}
      <ExplainModal
        isOpen={isExplainOpen}
        puzzle={currentPuzzle}
        gameState={gameState}
        pointsEarned={pointsEarned}
        onNext={nextPuzzle}
      />

      <HintModal
        isOpen={isHintOpen}
        puzzle={currentPuzzle}
        onClose={() => toggleHint(false)}
      />
    </div>
  );
};
