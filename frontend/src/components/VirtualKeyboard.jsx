import React from 'react';
import { Delete, RotateCcw } from 'lucide-react';

const QWERTY_ROW_1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
const QWERTY_ROW_2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
const QWERTY_ROW_3 = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];
const NUMBERS_ROW = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

export const VirtualKeyboard = ({
  answer = '',
  onType,
  onBackspace,
  onClear,
  disabled = false,
}) => {
  const hasNumbers = /[0-9]/.test(answer);

  return (
    <div className="w-full max-w-md mx-auto my-1 p-2 bg-cyber-card/95 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md">
      {/* Number Row (only if answer contains numbers) */}
      {hasNumbers && (
        <div className="flex justify-center gap-1 my-1">
          {NUMBERS_ROW.map((char) => (
            <button
              key={char}
              disabled={disabled}
              onClick={() => onType(char)}
              className="h-10 flex-1 bg-cyber-surface/90 hover:bg-cyber-cyan/20 active:bg-cyber-cyan/40 active:scale-95 border border-white/10 text-cyber-text font-cyber font-bold text-base rounded-lg transition-all duration-100 flex items-center justify-center disabled:opacity-40"
            >
              {char}
            </button>
          ))}
        </div>
      )}

      {/* Row 1: QWERTYUIOP */}
      <div className="flex justify-center gap-1 my-1">
        {QWERTY_ROW_1.map((char) => (
          <button
            key={char}
            disabled={disabled}
            onClick={() => onType(char)}
            className="h-11 flex-1 max-w-[38px] bg-cyber-surface/90 hover:bg-cyber-cyan/20 active:bg-cyber-cyan/40 active:scale-95 border border-white/10 text-cyber-text font-cyber font-bold text-lg rounded-lg transition-all duration-100 flex items-center justify-center disabled:opacity-40 shadow-sm"
          >
            {char}
          </button>
        ))}
      </div>

      {/* Row 2: ASDFGHJKL */}
      <div className="flex justify-center gap-1 my-1 px-2">
        {QWERTY_ROW_2.map((char) => (
          <button
            key={char}
            disabled={disabled}
            onClick={() => onType(char)}
            className="h-11 flex-1 max-w-[40px] bg-cyber-surface/90 hover:bg-cyber-cyan/20 active:bg-cyber-cyan/40 active:scale-95 border border-white/10 text-cyber-text font-cyber font-bold text-lg rounded-lg transition-all duration-100 flex items-center justify-center disabled:opacity-40 shadow-sm"
          >
            {char}
          </button>
        ))}
      </div>

      {/* Row 3: Clear + ZXCVBNM + Backspace */}
      <div className="flex justify-center gap-1.5 my-1">
        {/* Clear Button */}
        <button
          disabled={disabled}
          onClick={onClear}
          className="h-11 px-2.5 bg-cyber-surface/60 hover:bg-cyber-red/20 active:scale-95 border border-white/10 text-cyber-muted hover:text-cyber-red font-cyber text-xs font-bold uppercase rounded-lg transition-all duration-100 flex items-center justify-center space-x-1 disabled:opacity-40"
          title="Clear all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {QWERTY_ROW_3.map((char) => (
          <button
            key={char}
            disabled={disabled}
            onClick={() => onType(char)}
            className="h-11 flex-1 max-w-[40px] bg-cyber-surface/90 hover:bg-cyber-cyan/20 active:bg-cyber-cyan/40 active:scale-95 border border-white/10 text-cyber-text font-cyber font-bold text-lg rounded-lg transition-all duration-100 flex items-center justify-center disabled:opacity-40 shadow-sm"
          >
            {char}
          </button>
        ))}

        {/* Backspace Button */}
        <button
          disabled={disabled}
          onClick={onBackspace}
          className="h-11 px-3 bg-cyber-surface/80 hover:bg-cyber-yellow/20 active:scale-95 border border-white/10 text-cyber-yellow font-cyber font-bold rounded-lg transition-all duration-100 flex items-center justify-center space-x-1 disabled:opacity-40 shadow-sm"
          title="Backspace"
        >
          <Delete className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
