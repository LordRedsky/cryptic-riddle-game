import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowRight, Globe, Tv, Heart, Skull } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { useGameStore } from '../store/gameStore';
import { showRewardedAd } from '../lib/adsgram';

export const ExplainModal = ({
  isOpen,
  puzzle,
  gameState,
  pointsEarned,
  onNext,
  blockId,
}) => {
  const { language, setLanguage } = useUserStore();
  const lives = useGameStore((state) => state.lives);
  const reviveWithAd = useGameStore((state) => state.reviveWithAd);
  const [loadingAd, setLoadingAd] = useState(false);

  if (!isOpen || !puzzle) return null;

  const isSuccess = gameState === 'correct';
  const isGameOver = !isSuccess && lives <= 0;
  const explanation = language === 'en' ? puzzle.explanation_en : puzzle.explanation_id;

  const handleReviveAd = () => {
    setLoadingAd(true);
    showRewardedAd({
      blockId,
      onSuccess: () => {
        setLoadingAd(false);
        reviveWithAd();
      },
      onError: () => {
        setLoadingAd(false);
      },
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cyber-dark/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={`cyber-card w-full max-w-sm rounded-3xl p-6 border-2 shadow-2xl text-center relative ${
            isSuccess
              ? 'border-cyber-green/50'
              : isGameOver
              ? 'border-cyber-red/80 shadow-[0_0_40px_rgba(255,50,50,0.2)]'
              : 'border-cyber-red/50'
          }`}
        >
          {/* Header Icon */}
          <div className="flex justify-center mb-3">
            {isSuccess ? (
              <div className="p-3 rounded-full bg-cyber-green/10 text-cyber-green border border-cyber-green/30 shadow-glow-green">
                <CheckCircle2 className="w-10 h-10" />
              </div>
            ) : isGameOver ? (
              <div className="p-3 rounded-full bg-cyber-red/15 text-cyber-red border border-cyber-red/50 shadow-glow-red">
                <Skull className="w-10 h-10" />
              </div>
            ) : (
              <div className="p-3 rounded-full bg-cyber-red/10 text-cyber-red border border-cyber-red/30 shadow-glow-red">
                <XCircle className="w-10 h-10" />
              </div>
            )}
          </div>

          {/* Title & Points */}
          <h3
            className={`font-cyber text-2xl font-bold uppercase tracking-wider mb-1 ${
              isSuccess
                ? 'text-cyber-green text-glow-green'
                : isGameOver
                ? 'text-cyber-red text-glow-red'
                : 'text-cyber-red text-glow-red'
            }`}
          >
            {isSuccess ? 'Jawaban Benar!' : isGameOver ? 'GAME OVER!' : 'Waktu Habis!'}
          </h3>

          {isSuccess && (
            <p className="text-sm font-cyber text-cyber-cyan mb-3">
              +{pointsEarned} Points
            </p>
          )}

          {/* Correct Answer reveal */}
          <div className="my-3 py-2 px-4 rounded-xl bg-cyber-surface/80 border border-white/10">
            <span className="text-xs font-cyber text-cyber-muted block uppercase">Jawaban:</span>
            <span className="text-xl font-cyber font-bold text-cyber-yellow tracking-widest uppercase">
              {puzzle.answer}
            </span>
          </div>

          {/* Game Over — Revive with Ad section */}
          {isGameOver && (
            <div className="mb-4 rounded-2xl overflow-hidden border border-cyber-red/30">
              {/* Banner */}
              <div className="bg-gradient-to-r from-red-900/60 via-cyber-surface to-red-900/60 px-3 py-2 flex items-center justify-center space-x-2">
                <Heart className="w-4 h-4 text-cyber-red fill-cyber-red animate-pulse" />
                <span className="text-xs font-cyber font-bold text-cyber-red uppercase tracking-wide">
                  Nyawa Habis!
                </span>
              </div>

              {/* Ad Revive Button */}
              <div className="bg-cyber-dark/40 p-3">
                <p className="text-[11px] text-cyber-muted mb-2.5 leading-relaxed">
                  Tonton iklan singkat dan dapatkan{' '}
                  <span className="text-cyber-yellow font-bold">+3 nyawa</span> untuk lanjut bermain!
                </p>
                <button
                  onClick={handleReviveAd}
                  disabled={loadingAd}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyber-yellow via-amber-400 to-cyber-green text-cyber-dark font-cyber font-extrabold text-sm uppercase tracking-wider flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(255,208,0,0.35)] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Tv className="w-4 h-4" />
                  <span>{loadingAd ? 'Memuat Iklan...' : '🎬 Tonton Iklan = +3 Nyawa!'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Language Switcher */}
          <div className="flex justify-end mb-2">
            <button
              onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
              className="flex items-center space-x-1 text-xs text-cyber-muted hover:text-cyber-cyan transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language.toUpperCase()}</span>
            </button>
          </div>

          {/* Educational Explanation Box */}
          <div className="text-left text-xs text-cyber-text/90 leading-relaxed bg-cyber-dark/60 p-3.5 rounded-xl border border-white/5 mb-5 max-h-36 overflow-y-auto">
            <span className="font-cyber font-bold text-cyber-cyan block mb-1">
              💡 Tahukah Kamu?
            </span>
            {explanation}
          </div>

          {/* Next / End Button */}
          <button
            onClick={onNext}
            className={`w-full py-3.5 rounded-xl font-cyber font-bold text-lg uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg active:scale-98 transition-all ${
              isSuccess
                ? 'bg-gradient-to-r from-cyber-green to-emerald-500 text-cyber-dark shadow-glow-green'
                : isGameOver
                ? 'bg-gradient-to-r from-cyber-red/70 to-red-700 text-white shadow-glow-red'
                : 'bg-gradient-to-r from-cyber-cyan to-blue-500 text-cyber-dark shadow-glow-cyan'
            }`}
          >
            <span>{isGameOver ? 'Lihat Hasil' : 'Lanjut'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

