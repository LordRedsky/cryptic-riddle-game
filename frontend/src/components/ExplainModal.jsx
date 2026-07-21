import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowRight, Globe } from 'lucide-react';
import { useUserStore } from '../store/userStore';

export const ExplainModal = ({
  isOpen,
  puzzle,
  gameState,
  pointsEarned,
  onNext,
}) => {
  const { language, setLanguage } = useUserStore();

  if (!isOpen || !puzzle) return null;

  const isSuccess = gameState === 'correct';
  const explanation = language === 'en' ? puzzle.explanation_en : puzzle.explanation_id;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cyber-dark/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={`cyber-card w-full max-w-sm rounded-3xl p-6 border-2 shadow-2xl text-center relative ${
            isSuccess ? 'border-cyber-green/50' : 'border-cyber-red/50'
          }`}
        >
          {/* Header Icon */}
          <div className="flex justify-center mb-3">
            {isSuccess ? (
              <div className="p-3 rounded-full bg-cyber-green/10 text-cyber-green border border-cyber-green/30 shadow-glow-green">
                <CheckCircle2 className="w-10 h-10" />
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
              isSuccess ? 'text-cyber-green text-glow-green' : 'text-cyber-red text-glow-red'
            }`}
          >
            {isSuccess ? 'Jawaban Benar!' : 'Waktu Habis!'}
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

          {/* Next Button */}
          <button
            onClick={onNext}
            className={`w-full py-3.5 rounded-xl font-cyber font-bold text-lg uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg active:scale-98 transition-all ${
              isSuccess
                ? 'bg-gradient-to-r from-cyber-green to-emerald-500 text-cyber-dark shadow-glow-green'
                : 'bg-gradient-to-r from-cyber-cyan to-blue-500 text-cyber-dark shadow-glow-cyan'
            }`}
          >
            <span>Lanjut</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
