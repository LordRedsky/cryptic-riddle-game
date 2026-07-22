import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, Tv, Lock } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { showRewardedAd } from '../lib/adsgram';

export const HintModal = ({ isOpen, puzzle, onClose, blockId }) => {
  const language = useUserStore((state) => state.language);
  const [unlocked, setUnlocked] = useState(true); // Default unlocked for MVP, can gate with Adsgram
  const [loadingAd, setLoadingAd] = useState(false);

  if (!isOpen || !puzzle) return null;

  const hint = language === 'en' ? puzzle.hint_en : puzzle.hint_id;

  const handleWatchAd = () => {
    setLoadingAd(true);
    showRewardedAd({
      blockId,
      onSuccess: () => {
        setUnlocked(true);
        setLoadingAd(false);
      },
      onError: () => {
        setLoadingAd(false);
      }
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cyber-dark/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="cyber-card w-full max-w-xs rounded-2xl p-5 border border-cyber-yellow/40 shadow-glow-purple text-center relative"
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-cyber-muted hover:text-cyber-text"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex justify-center mb-2">
            <div className="p-2.5 rounded-full bg-cyber-yellow/10 text-cyber-yellow border border-cyber-yellow/30">
              <HelpCircle className="w-7 h-7" />
            </div>
          </div>

          <h4 className="font-cyber text-lg font-bold text-cyber-yellow uppercase tracking-wider mb-2">
            Petunjuk Clue
          </h4>

          {unlocked ? (
            <p className="text-sm text-cyber-text italic bg-cyber-dark/60 p-3 rounded-xl border border-white/5 mb-4">
              "{hint}"
            </p>
          ) : (
            <div className="my-3 p-3 bg-cyber-dark/60 rounded-xl border border-white/5">
              <Lock className="w-6 h-6 text-cyber-muted mx-auto mb-1" />
              <p className="text-xs text-cyber-muted">Tonton iklan singkat 5 detik untuk membuka hint ini gratis!</p>
            </div>
          )}

          {!unlocked ? (
            <button
              onClick={handleWatchAd}
              disabled={loadingAd}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyber-yellow to-amber-500 text-cyber-dark font-cyber font-bold uppercase text-xs flex items-center justify-center space-x-1.5 shadow-md active:scale-95 transition-all"
            >
              <Tv className="w-4 h-4" />
              <span>{loadingAd ? 'Memuat Iklan...' : 'Tonton Iklan = Buka Hint'}</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-cyber-surface hover:bg-cyber-surface/80 border border-white/10 text-cyber-text font-cyber font-bold uppercase text-xs"
            >
              Mengerti
            </button>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
