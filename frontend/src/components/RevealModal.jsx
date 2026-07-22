import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, X, Tv, Sparkles, Lock } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { showRewardedAd } from '../lib/adsgram';

export const RevealModal = ({
  isOpen,
  onClose,
  onReveal,          // callback: called after confirm (free or post-ad)
  blockId,
}) => {
  const { canRevealFree, useReveal, grantAdReveal, revealUsedToday, maxFreeRevealsPerDay } =
    useUserStore();
  const [loadingAd, setLoadingAd] = useState(false);

  if (!isOpen) return null;

  const isFree = canRevealFree();
  const remaining = Math.max(0, maxFreeRevealsPerDay - revealUsedToday);

  const handleFreeReveal = () => {
    useReveal();
    onReveal();
    onClose();
  };

  const handleWatchAd = () => {
    setLoadingAd(true);
    showRewardedAd({
      blockId,
      onSuccess: () => {
        setLoadingAd(false);
        grantAdReveal();  // sets count = MAX, so next useReveal makes it MAX+1 (one extra)
        useReveal();      // consume that one use
        onReveal();
        onClose();
      },
      onError: () => {
        setLoadingAd(false);
      },
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cyber-dark/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 24 }}
          transition={{ type: 'spring', damping: 20, stiffness: 260 }}
          className="cyber-card w-full max-w-xs rounded-3xl p-6 border border-cyber-yellow/40 shadow-[0_0_40px_rgba(255,208,0,0.15)] text-center relative overflow-hidden"
        >
          {/* Decorative glow blob */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyber-yellow/10 rounded-full blur-2xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-1.5 rounded-lg text-cyber-muted hover:text-cyber-text hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Icon header */}
          <div className="flex justify-center mb-3">
            <div className="p-3 rounded-full bg-cyber-yellow/10 border border-cyber-yellow/30 shadow-[0_0_16px_rgba(255,208,0,0.3)]">
              <Eye className="w-8 h-8 text-cyber-yellow" />
            </div>
          </div>

          <h4 className="font-cyber text-xl font-bold text-cyber-yellow uppercase tracking-wider mb-1">
            Buka 3 Huruf
          </h4>
          <p className="text-xs text-cyber-muted mb-4 leading-relaxed">
            Tampilkan 3 huruf acak dari jawaban sebagai bantuan.
          </p>

          {/* Usage counter */}
          <div className="flex items-center justify-center space-x-2 mb-5">
            {Array.from({ length: maxFreeRevealsPerDay }).map((_, i) => (
              <div
                key={i}
                className={`w-8 h-2 rounded-full transition-all duration-300 ${
                  i < revealUsedToday
                    ? 'bg-cyber-red/40'
                    : 'bg-cyber-yellow/80 shadow-[0_0_6px_rgba(255,208,0,0.5)]'
                }`}
              />
            ))}
          </div>

          {isFree ? (
            <>
              {/* Free use info */}
              <div className="flex items-center justify-center space-x-1.5 mb-4 px-3 py-2 rounded-xl bg-cyber-green/10 border border-cyber-green/20">
                <Sparkles className="w-4 h-4 text-cyber-green" />
                <span className="text-xs font-cyber text-cyber-green font-bold">
                  Sisa gratis hari ini: {remaining} kali
                </span>
              </div>

              <button
                onClick={handleFreeReveal}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyber-yellow via-amber-400 to-orange-400 text-cyber-dark font-cyber font-extrabold text-sm uppercase tracking-wider flex items-center justify-center space-x-2 shadow-[0_4px_20px_rgba(255,208,0,0.35)] active:scale-95 transition-all"
              >
                <Eye className="w-4.5 h-4.5" />
                <span>Buka 3 Huruf Gratis!</span>
              </button>
            </>
          ) : (
            <>
              {/* Locked state — need ad */}
              <div className="my-3 p-3 rounded-xl bg-cyber-dark/60 border border-white/8">
                <Lock className="w-5 h-5 text-cyber-muted mx-auto mb-1.5" />
                <p className="text-xs text-cyber-muted leading-relaxed">
                  Jatah gratis hari ini sudah habis.
                  <br />
                  Tonton iklan singkat untuk 1 kali buka lagi!
                </p>
              </div>

              <button
                onClick={handleWatchAd}
                disabled={loadingAd}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 via-cyber-purple to-pink-500 text-white font-cyber font-extrabold text-sm uppercase tracking-wider flex items-center justify-center space-x-2 shadow-[0_4px_20px_rgba(139,92,246,0.35)] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Tv className="w-4.5 h-4.5" />
                <span>{loadingAd ? 'Memuat Iklan...' : 'Tonton Iklan = Buka 1 Hint!'}</span>
              </button>
            </>
          )}

          <p className="text-[10px] text-cyber-muted/60 mt-3">
            Sisa hari ini: {remaining}/{maxFreeRevealsPerDay} gratis
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
