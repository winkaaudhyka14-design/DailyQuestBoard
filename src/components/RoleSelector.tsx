import React from 'react';
import { Sword, Sparkles, Compass, Shield, Scroll } from 'lucide-react';
import { motion } from 'motion/react';
import { Character } from '../types';

interface RoleSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: Character['role']) => void;
  playSynthSound: (type: 'click') => void;
}

export default function RoleSelector({ isOpen, onClose, onSelectRole, playSynthSound }: RoleSelectorProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm" id="role-selector-modal">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#fffcf5] border-4 border-[#8b5e34] p-6 rounded-3xl max-w-lg w-full shadow-[0_8px_0_0_#d4a373] space-y-6"
      >
        <div className="text-center space-y-2">
          <h3 className="font-serif text-2xl font-black text-[#5d4037] tracking-wide flex items-center justify-center gap-2">
            <Scroll className="w-5 h-5 text-[#8b5e34] animate-pulse" /> PILIH KELAS PETUALANG
          </h3>
          <p className="text-xs text-[#8b5e34] font-medium uppercase font-mono">
            Setiap kelas memiliki statistik dasar yang memandu takdir harianmu!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Knight */}
          <button 
            onClick={() => onSelectRole('fighter')}
            className="p-4 rounded-2xl border-4 border-[#8b5e34] bg-white hover:bg-rose-50 group text-left transition-all shadow-[4px_4px_0_0_#8b5e34] hover:shadow-[6px_6px_0_0_#8b5e34] active:translate-y-[2px] active:shadow-none"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-rose-100 border-2 border-rose-300 rounded-xl group-hover:scale-110 transition-transform">
                <Sword className="w-5 h-5 text-rose-600" />
              </div>
              <span className="font-serif text-base font-black text-[#5d4037]">Knight</span>
            </div>
            <p className="text-xs text-[#8b5e34] leading-relaxed">Ahli petarung disiplin tinggi. Fokus: Olahraga &amp; Pekerjaan berat.</p>
            <div className="mt-3 flex items-center gap-2 font-mono text-[10px] text-rose-800 font-bold bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-md w-fit">
              <span>STR +14</span> • <span>CON +12</span>
            </div>
          </button>

          {/* Wizard */}
          <button 
            onClick={() => onSelectRole('wizard')}
            className="p-4 rounded-2xl border-4 border-[#8b5e34] bg-white hover:bg-violet-50 group text-left transition-all shadow-[4px_4px_0_0_#8b5e34] hover:shadow-[6px_6px_0_0_#8b5e34] active:translate-y-[2px] active:shadow-none"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-1 px-2.5 bg-violet-100 border-2 border-violet-300 rounded-xl group-hover:scale-110 transition-transform">
                <Sparkles className="w-4 h-5 text-violet-600" />
              </div>
              <span className="font-serif text-base font-black text-[#5d4037]">Mage</span>
            </div>
            <p className="text-xs text-[#8b5e34] leading-relaxed">Cendekiawan bijaksana. Fokus: Belajar, membaca, eksplorasi ide.</p>
            <div className="mt-3 flex items-center gap-2 font-mono text-[10px] text-violet-850 font-bold bg-violet-50 border border-violet-200 px-2.5 py-1 rounded-md w-fit">
              <span>INT +15</span> • <span>STR +6</span>
            </div>
          </button>

          {/* Rogue */}
          <button 
            onClick={() => onSelectRole('rogue')}
            className="p-4 rounded-2xl border-4 border-[#8b5e34] bg-white hover:bg-amber-50 group text-left transition-all shadow-[4px_4px_0_0_#8b5e34] hover:shadow-[6px_6px_0_0_#8b5e34] active:translate-y-[2px] active:shadow-none"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-amber-100 border-2 border-amber-300 rounded-xl group-hover:scale-110 transition-transform">
                <Compass className="w-5 h-5 text-amber-600" />
              </div>
              <span className="font-serif text-base font-black text-[#5d4037]">Rogue</span>
            </div>
            <p className="text-xs text-[#8b5e34] leading-relaxed">Petualang cepat dan rapi. Fokus: Berbenah kamar, mencuci, tugas lincah.</p>
            <div className="mt-3 flex items-center gap-2 font-mono text-[10px] text-amber-800 font-bold bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md w-fit">
              <span>DEX +14</span> • <span>INT +10</span>
            </div>
          </button>

          {/* Cleric */}
          <button 
            onClick={() => onSelectRole('cleric')}
            className="p-4 rounded-2xl border-4 border-[#8b5e34] bg-white hover:bg-emerald-50 group text-left transition-all shadow-[4px_4px_0_0_#8b5e34] hover:shadow-[6px_6px_0_0_#8b5e34] active:translate-y-[2px] active:shadow-none"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-100 border-2 border-emerald-300 rounded-xl group-hover:scale-110 transition-transform">
                <Shield className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="font-serif text-base font-black text-[#5d4037]">Cleric</span>
            </div>
            <p className="text-xs text-[#8b5e34] leading-relaxed">Penjaga kesehatan &amp; tubuh. Fokus: Kebiasaan air minum &amp; tidur sehat.</p>
            <div className="mt-3 flex items-center gap-2 font-mono text-[10px] text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md w-fit">
              <span>CON +15</span> • <span>STR +10</span>
            </div>
          </button>
        </div>

        <div className="flex justify-end pt-3 border-t border-[#e2d6c3]">
          <button 
            onClick={() => { playSynthSound('click'); onClose(); }}
            className="px-5 py-2.5 text-[#8b5e34] hover:text-[#5d4037] hover:bg-[#e2d6c3]/30 rounded-xl text-xs font-black border-2 border-[#8b5e34] bg-white shadow-[2px_2px_0_0_#8b5e34] active:translate-y-[1px] active:shadow-none"
          >
            Kembali ke Kedai
          </button>
        </div>
      </motion.div>
    </div>
  );
}
