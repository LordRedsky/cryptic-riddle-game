import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Trophy, HelpCircle, Globe, Zap } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { useGameStore } from '../store/gameStore';

export const HomeScreen = () => {
  const { user, highScore, language, setLanguage } = useUserStore();
  const startGame = useGameStore((state) => state.startGame);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-5 max-w-md mx-auto grid-bg relative">
      {/* Top Bar: User & Lang */}
      <div className="w-full flex items-center justify-between pt-2">
        <div className="flex items-center space-x-2.5 bg-cyber-surface/60 px-3 py-1.5 rounded-full border border-white/5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyber-cyan to-cyber-purple flex items-center justify-center font-cyber font-bold text-cyber-dark text-xs uppercase shadow-sm">
            {user?.first_name ? user.first_name[0] : 'U'}
          </div>
          <span className="text-xs font-cyber font-semibold text-cyber-text truncate max-w-[120px]">
            {user?.first_name || 'Cyber Agent'}
          </span>
        </div>

        <button
          onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
          className="flex items-center space-x-1.5 text-xs font-cyber bg-cyber-surface/60 hover:bg-cyber-surface px-3 py-1.5 rounded-full border border-white/5 text-cyber-muted hover:text-cyber-cyan transition-all"
        >
          <Globe className="w-3.5 h-3.5" />
          <span className="font-bold">{language.toUpperCase()}</span>
        </button>
      </div>

      {/* Main Hero & Logo */}
      <div className="my-auto flex flex-col items-center text-center space-y-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="p-4 rounded-3xl bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan mb-2 shadow-glow-cyan">
            <Zap className="w-14 h-14 animate-pulse" />
          </div>
        </motion.div>

        <div>
          <h1 className="font-cyber text-4xl sm:text-5xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-white to-cyber-green text-glow-cyan uppercase">
            Cryptic
          </h1>
          <h2 className="font-cyber text-2xl sm:text-3xl font-bold tracking-widest text-cyber-cyan/80 uppercase">
            Decoder
          </h2>
          <p className="text-xs font-cyber text-cyber-muted tracking-widest mt-1 uppercase">
            {language === 'en' ? 'Decode emoji riddles under pressure' : 'Pecahkan teka-teki emoji serba cepat'}
          </p>
        </div>

        {/* High Score Card */}
        <div className="cyber-card px-6 py-3 rounded-2xl flex items-center space-x-3 border border-cyber-yellow/30 shadow-glow-purple">
          <Trophy className="w-6 h-6 text-cyber-yellow" />
          <div className="text-left">
            <span className="text-[10px] font-cyber uppercase tracking-wider text-cyber-muted block">
              High Score
            </span>
            <span className="font-cyber text-xl font-bold text-cyber-yellow text-glow-yellow">
              {highScore} PTS
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full space-y-3 pb-6">
        <button
          onClick={startGame}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyber-cyan via-teal-400 to-cyber-green text-cyber-dark font-cyber font-extrabold text-xl uppercase tracking-wider flex items-center justify-center space-x-2 shadow-glow-cyan hover:brightness-110 active:scale-98 transition-all"
        >
          <Play className="w-6 h-6 fill-cyber-dark" />
          <span>{language === 'en' ? 'Start Game' : 'Mulai Bermain'}</span>
        </button>

        <button
          onClick={() => setShowHowToPlay(true)}
          className="w-full py-3 rounded-xl bg-cyber-surface/60 hover:bg-cyber-surface border border-white/10 text-cyber-muted hover:text-cyber-text font-cyber font-bold text-sm uppercase tracking-wider flex items-center justify-center space-x-2 transition-all"
        >
          <HelpCircle className="w-4 h-4" />
          <span>{language === 'en' ? 'How To Play' : 'Cara Bermain'}</span>
        </button>
      </div>

      {/* How To Play Modal */}
      {showHowToPlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cyber-dark/80 backdrop-blur-md">
          <div className="cyber-card w-full max-w-sm rounded-3xl p-6 border border-cyber-cyan/30 text-left relative">
            <h3 className="font-cyber text-xl font-bold text-cyber-cyan uppercase mb-3 flex items-center space-x-2">
              <HelpCircle className="w-5 h-5" />
              <span>Cara Bermain</span>
            </h3>
            <ul className="text-xs text-cyber-text space-y-2.5 mb-5 leading-relaxed">
              <li>1. 🧩 <b>Tebak Kata:</b> Analisa kombinasi emoji/simbol yang muncul.</li>
              <li>2. ⏱️ <b>15 Detik:</b> Jawab sebelum timer 15 detik habis.</li>
              <li>3. ⌨️ <b>Virtual Keyboard:</b> Tekan huruf untuk mengisi jawaban.</li>
              <li>4. ⚡ <b>Penalti:</b> Tebakan salah mengurangi waktu <b>-3 detik</b>.</li>
              <li>5. 🔥 <b>Streak:</b> Jawab 5 berturut-turut untuk bonus poin <b>1.5x</b>.</li>
            </ul>
            <button
              onClick={() => setShowHowToPlay(false)}
              className="w-full py-2.5 bg-cyber-cyan text-cyber-dark font-cyber font-bold rounded-xl uppercase text-sm"
            >
              Paham, Ayok Main!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
