import React from 'react';

export const TimerBar = ({ timeLeft, maxTime = 15 }) => {
  const percentage = Math.max(0, Math.min(100, (timeLeft / maxTime) * 100));

  // Determine color based on time remaining
  let barColorClass = 'bg-cyber-cyan shadow-glow-cyan';
  let textColorClass = 'text-cyber-cyan';

  if (timeLeft <= 5) {
    barColorClass = 'bg-cyber-red shadow-glow-red animate-pulse-fast';
    textColorClass = 'text-cyber-red animate-pulse';
  } else if (timeLeft <= 8) {
    barColorClass = 'bg-cyber-yellow shadow-sm';
    textColorClass = 'text-cyber-yellow';
  }

  return (
    <div className="w-full space-y-1 my-2">
      <div className="flex justify-between items-center px-1 text-xs font-cyber tracking-wider">
        <span className="text-cyber-muted uppercase">System Countdown</span>
        <span className={`font-bold text-sm ${textColorClass}`}>
          {timeLeft}s
        </span>
      </div>

      <div className="h-2.5 w-full bg-cyber-surface/80 rounded-full overflow-hidden p-0.5 border border-white/5 relative">
        <div
          className={`h-full rounded-full transition-all duration-300 ease-linear ${barColorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
