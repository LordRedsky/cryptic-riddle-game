import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X } from 'lucide-react';
import { useUserStore } from '../store/userStore';

export const HintModal = ({ isOpen, puzzle, onClose }) => {
  const language = useUserStore((state) => state.language);

  if (!isOpen || !puzzle) return null;

  const hint = language === 'en' ? puzzle.hint_en : puzzle.hint_id;

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

          <p className="text-sm text-cyber-text italic bg-cyber-dark/60 p-3 rounded-xl border border-white/5 mb-4">
            "{hint}"
          </p>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-cyber-surface hover:bg-cyber-surface/80 border border-white/10 text-cyber-text font-cyber font-bold uppercase text-sm"
          >
            Mengerti
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
