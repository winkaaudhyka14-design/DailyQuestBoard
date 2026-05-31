import React from 'react';
import { Award, Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import LevelUpCelebration from './LevelUpCelebration';

interface LevelUpModalProps {
  isOpen: boolean;
  level: number;
  onClose: () => void;
}

export default function LevelUpModal({ isOpen, level, onClose }: LevelUpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-md animate-fade-in" id="levelup-alert-modal">
      {/* Page-wide Retro RPG Star Exploder & Confetti Shower */}
      <LevelUpCelebration isOpen={isOpen} />

      <motion.div 
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        className="bg-[#fffdf2] border-8 border-yellow-500 rounded-[2.5rem] p-8 max-w-md w-full shadow-[0_12px_0_0_#b58a10] text-center space-y-6 relative overflow-hidden z-10"

      >
        {/* Dynamic Sparkle background */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-yellow-100 to-transparent pointer-events-none opacity-50" />

        <div className="w-24 h-24 bg-yellow-400 border-4 border-yellow-600 rounded-full mx-auto flex items-center justify-center shadow-lg relative animate-bounce">
          <Award className="w-14 h-14 text-stone-900 stroke-[2px]" />
          <div className="absolute inset-0 rounded-full border-4 border-dashed border-white opacity-40 animate-spin" />
        </div>

        <div className="space-y-2 relative z-10">
          <p className="text-[10px] tracking-[0.3em] font-black uppercase text-yellow-600">SELAMAT PETUALANG!</p>
          <h3 className="font-serif text-3xl font-black text-[#5d4037] leading-tight">
            LEVEL UP! <br />
            <span className="text-yellow-600 text-4xl">LEVEL {level}</span>
          </h3>
          <p className="text-xs text-[#8b5e34] max-w-xs mx-auto leading-relaxed">
            Anda telah membuktikan ketangguhan dan integritas harian Anda. Gelar kehormatan baru telah ditanamkan ke dalam jiwa Anda!
          </p>
        </div>

        {/* Level Up reward buffs */}
        <div className="bg-[#fffbeb] border-2 border-[#e2d6c3] p-4 rounded-2xl relative z-10 space-y-2.5 shadow-inner text-left">
          <p className="font-mono text-xs font-bold text-[#8b5e34] uppercase flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-emerald-600" /> BONUS ATTRIBUTES REWARD:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono text-[#5d4037] font-black">
            <div className="bg-[#fff] border border-[#e2d6c3] rounded-lg p-2 flex justify-between">
              <span>💪 Kekuatan (STR)</span>
              <span className="text-emerald-600">+1 Point</span>
            </div>
            <div className="bg-[#fff] border border-[#e2d6c3] rounded-lg p-2 flex justify-between">
              <span>🧠 Kecerdasan (INT)</span>
              <span className="text-emerald-600">+1 Point</span>
            </div>
            <div className="bg-[#fff] border border-[#e2d6c3] rounded-lg p-2 flex justify-between">
              <span>⚡ Kecekatan (DEX)</span>
              <span className="text-emerald-600">+1 Point</span>
            </div>
            <div className="bg-[#fff] border border-[#e2d6c3] rounded-lg p-2 flex justify-between">
              <span>❤️ Stamina (CON)</span>
              <span className="text-emerald-600">+1 Point</span>
            </div>
          </div>
          <p className="text-[9px] text-[#8b5e34] italic pt-1 text-center font-sans">
            Sistem secara otomatis mendistribusikan berkah status ke petualang Anda.
          </p>
        </div>

        <button 
          onClick={onClose}
          className="w-full bg-[#8b5e34] hover:bg-[#7a512d] text-white py-3.5 rounded-2xl font-serif font-black text-sm uppercase tracking-wider relative z-10 shadow-[0_4px_0_0_#5d4037] active:shadow-none active:translate-y-[4px] transition-all cursor-pointer"
          id="levelup-claim-btn"
        >
          Klaim Kekuatan &amp; Lanjutkan! ⚔️
        </button>
      </motion.div>
    </div>
  );
}
