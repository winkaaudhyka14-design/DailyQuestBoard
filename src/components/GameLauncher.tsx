import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sword, Sparkles, Scroll, Shield, Compass, Heart, Crown, HelpCircle } from 'lucide-react';
import { Character } from '../types';

interface GameLauncherProps {
  character: Character;
  setCharacter: React.Dispatch<React.SetStateAction<Character>>;
  onStartAdventure: () => void;
  playSynthSound: (type: 'quest' | 'gold' | 'levelup' | 'click' | 'fail' | 'delete' | 'quest_complete') => void;
}

export default function GameLauncher({ 
  character, 
  setCharacter, 
  onStartAdventure,
  playSynthSound 
}: GameLauncherProps) {
  // Local temporary setup
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [name, setName] = useState<string>(character.name);
  const [selectedRole, setSelectedRole] = useState<Character['role']>(character.role);

  const roles = [
    {
      id: 'fighter' as const,
      name: 'Fighter (Ksatria)',
      icon: '⚔️',
      statLine: 'STR (Fisik / Olahraga)',
      desc: 'Sangat direkomendasikan untuk petualang yang ingin disiplin latihan otot, lari harian, push-up, kinesis, dan menjaga energi stamina tubuh agar selalu prima.',
      colorClass: 'border-rose-400 bg-rose-50 text-rose-900',
      badgeClass: 'bg-rose-100 text-rose-800'
    },
    {
      id: 'wizard' as const,
      name: 'Wizard (Penyihir)',
      icon: '🔮',
      statLine: 'INT (Logika / Belajar)',
      desc: 'Terbaik bagi Anda yang mengejar peningkatan kecerdasan batin, fokus membaca materi pelajaran, menulis esai, coding, belajar bahasa asing, atau riset.',
      colorClass: 'border-violet-400 bg-violet-50 text-violet-900',
      badgeClass: 'bg-violet-100 text-violet-800'
    },
    {
      id: 'rogue' as const,
      name: 'Rogue (Pencuri)',
      icon: '⚡',
      statLine: 'DEX (Kerapian / Fokus)',
      desc: 'Bagi pencari ketangkasan kilat. Melacak aktivitas menjauhi distraksi handphone, bangun pagi tepat waktu, merapikan meja kerja, serta pengerjaan tugas gesit.',
      colorClass: 'border-amber-400 bg-amber-50 text-amber-900',
      badgeClass: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'cleric' as const,
      name: 'Cleric (Biarawan)',
      icon: '🌳',
      statLine: 'CON (Imunitas / Sehat)',
      desc: 'Tepat untuk melacak aktivitas bernapas tenang meditasi, meredakan ketegangan jiwa, minum air putih cukup harian, tidur 8 jam, tidur awal, dan berbuat baik.',
      colorClass: 'border-emerald-400 bg-emerald-50 text-emerald-900',
      badgeClass: 'bg-emerald-100 text-emerald-800'
    }
  ];

  const handleStart = () => {
    // Save selections
    const roleStats = {
      fighter: { str: 14, int: 7, dex: 9, con: 12 },
      wizard: { str: 6, int: 15, dex: 10, con: 11 },
      rogue: { str: 9, int: 10, dex: 14, con: 9 },
      cleric: { str: 8, int: 11, dex: 8, con: 15 }
    };

    const cleanName = name.trim() || 'Satria Pemula';
    
    setCharacter(prev => ({
      ...prev,
      name: cleanName,
      role: selectedRole,
      stats: roleStats[selectedRole]
    }));

    playSynthSound('levelup');
    onStartAdventure();
  };

  const selectRoleHandler = (role: Character['role']) => {
    playSynthSound('click');
    setSelectedRole(role);
  };

  // Render distinct micro SVG animations for each of the selectable roles
  const renderRoleIllustration = (roleId: Character['role'], isActive: boolean) => {
    switch (roleId) {
      case 'fighter':
        return (
          <div className="w-20 h-20 md:w-24 md:h-24 relative flex items-center justify-center bg-rose-100 rounded-2xl border-2 border-rose-300 overflow-hidden shrink-0 shadow-inner">
            <svg width="72" height="72" viewBox="0 0 64 64" className="overflow-visible">
              {/* Target / Shield backing */}
              <circle cx="32" cy="32" r="22" fill="#ef9a9a" opacity="0.3" />
              <circle cx="32" cy="32" r="16" fill="#e57373" opacity="0.4" />
              {/* Helmet */}
              <rect x="22" y="24" width="20" height="20" rx="3" fill="#90a4ae" />
              <polygon points="18,24 22,18 42,18 46,24" fill="#78909c" />
              <motion.path 
                d="M32,18 L32,6 C32,6 36,4 32,1 C28,4 32,6 32,6" 
                stroke="#d32f2f" 
                strokeWidth="3.5" 
                fill="none" 
                opacity="1"
                animate={isActive ? { rotate: [-15, 15, -15], scaleY: [1, 1.15, 1] } : {}}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
              />
              {/* Eyes visor grill */}
              <rect x="26" y="28" width="12" height="4" fill="#263238" />
              <line x1="29" y1="28" x2="29" y2="32" stroke="#cfd8dc" strokeWidth="1" />
              <line x1="32" y1="28" x2="32" y2="32" stroke="#cfd8dc" strokeWidth="1" />
              <line x1="35" y1="28" x2="35" y2="32" stroke="#cfd8dc" strokeWidth="1" />
              
              {/* Swinging Broadsword */}
              <motion.g
                animate={isActive ? { rotate: [-40, 25, -40] } : { rotate: -15 }}
                transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '20px 45px' }}
              >
                {/* Hilt */}
                <rect x="18" y="42" width="4" height="12" rx="1" fill="#ffd54f" />
                <rect x="14" y="44" width="12" height="3" rx="0.5" fill="#ffd54f" />
                {/* Blade */}
                <polygon points="18,44 18,12 20,6 22,12 22,44" fill="#eceff1" stroke="#b0bec5" strokeWidth="0.5" />
                <line x1="20" y1="12" x2="20" y2="44" stroke="#cfd8dc" strokeWidth="0.5" />
              </motion.g>
            </svg>
          </div>
        );
      case 'wizard':
        return (
          <div className="w-20 h-20 md:w-24 md:h-24 relative flex items-center justify-center bg-violet-100 rounded-2xl border-2 border-violet-300 overflow-hidden shrink-0 shadow-inner">
            <svg width="72" height="72" viewBox="0 0 64 64" className="overflow-visible">
              <circle cx="32" cy="32" r="22" fill="#d1c4e9" opacity="0.3" />
              {/* Casting floaters */}
              <motion.circle 
                cx="16" cy="18" r="2.5" fill="#e040fb"
                animate={isActive ? { y: [-6, 6, -6], scale: [0.7, 1.3, 0.7], opacity: [0.4, 0.9, 0.4] } : { opacity: 0.5 }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
              <motion.circle 
                cx="48" cy="22" r="3.5" fill="#00e5ff"
                animate={isActive ? { y: [8, -8, 8], scale: [1.3, 0.7, 1.3], opacity: [0.9, 0.4, 0.9] } : { opacity: 0.7 }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
              />
              
              {/* Wizards hat */}
              <motion.polygon 
                points="16,36 32,8 48,36" 
                fill="#512da8" 
                animate={isActive ? { rotate: [-4, 4, -4], y: [-1, 2, -1] } : {}}
                transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '32px 36px' }}
              />
              {/* Star details on Hat */}
              <polygon points="32,18 33,21 36,21 34,23 35,26 32,24 29,26 30,23 28,21 31,21" fill="#ffd54f" />
              <ellipse cx="32" cy="36" rx="20" ry="4" fill="#311b92" />

              {/* Glowing crystal ball or casting palm staff */}
              <motion.circle 
                cx="32" cy="46" r="8" fill="#64ffda" 
                animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              />
              <path d="M26,52 L28,60 L36,60 L38,52 Z" fill="#7d5228" />
            </svg>
          </div>
        );
      case 'rogue':
        return (
          <div className="w-20 h-20 md:w-24 md:h-24 relative flex items-center justify-center bg-amber-100 rounded-2xl border-2 border-amber-300 overflow-hidden shrink-0 shadow-inner">
            <svg width="72" height="72" viewBox="0 0 64 64" className="overflow-visible">
              <circle cx="32" cy="32" r="22" fill="#ffe0b2" opacity="0.3" />
              {/* Dark cowl or mask */}
              <rect x="20" y="24" width="24" height="24" rx="10" fill="#37474f" />
              <path d="M20,24 C20,14 44,14 44,24 Z" fill="#263238" />
              
              {/* Nimble alert glowing yellow assassin eyes */}
              <motion.g 
                animate={isActive ? { scaleX: [1, 0.1, 1, 1, 0.1, 1] } : {}}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
                style={{ transformOrigin: '32px 28px' }}
              >
                <circle cx="27" cy="28" r="2.5" fill="#ffeb3b" />
                <circle cx="37" cy="28" r="2.5" fill="#ffeb3b" />
              </motion.g>

              {/* Swift slashing daggers on the side */}
              <motion.g
                animate={isActive ? { x: [-3, 8, -3], y: [2, -6, 2], rotate: [0, 15, 0] } : {}}
                transition={{ duration: 0.7, repeat: Infinity, ease: 'easeOut' }}
              >
                <path d="M46,42 L56,32 L58,34 L48,44 Z" fill="#cfd8dc" stroke="#90a4ae" strokeWidth="1" />
                <rect x="42" y="42" width="6" height="4" rx="1" fill="#ffd54f" transform="rotate(45, 42, 42)" />
              </motion.g>

              {/* Active flipping gold coins */}
              <motion.circle 
                cx="14" cy="36" r="4.5" fill="#ffca28" stroke="#ff8f00" strokeWidth="1.5"
                animate={isActive ? { y: [12, -22, 12], rotateY: [0, 360] } : {}}
                transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
              />
            </svg>
          </div>
        );
      case 'cleric':
        return (
          <div className="w-20 h-20 md:w-24 md:h-24 relative flex items-center justify-center bg-emerald-100 rounded-2xl border-2 border-emerald-300 overflow-hidden shrink-0 shadow-inner">
            <svg width="72" height="72" viewBox="0 0 64 64" className="overflow-visible">
              <circle cx="32" cy="32" r="23" fill="#a5d6a7" opacity="0.25" />
              
              {/* Soft holy cross outline */}
              <motion.path 
                d="M32,10 L32,54 M10,32 L54,32" 
                stroke="#66bb6a" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                opacity="0.2"
                animate={{ scale: [0.95, 1.05, 0.95] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ transformOrigin: '32px 32px' }}
              />

              {/* Gentle therapeutic branch with leaves */}
              <motion.path 
                d="M18,48 C24,42 40,42 46,18" 
                stroke="#2e7d32" 
                strokeWidth="4.5" 
                strokeLinecap="round" 
                fill="none" 
              />
              {/* Left Leaf Leaflets */}
              <motion.path 
                d="M26,38 C22,34 24,28 28,30 Z" 
                fill="#4caf50" 
                animate={isActive ? { rotate: [-8, 8, -8] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ transformOrigin: '28px 30px' }}
              />
              {/* Right Leaf Leaflets */}
              <motion.path 
                d="M38,28 C36,22 42,20 40,26 Z" 
                fill="#81c784" 
                animate={isActive ? { rotate: [10, -10, 10] } : {}}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                style={{ transformOrigin: '40px 26px' }}
              />

              {/* Pulsing holy halo ring */}
              <circle cx="32" cy="32" r="14" stroke="#ffeb3b" strokeWidth="2.5" fill="none" opacity="0.6" strokeDasharray="4 2" />
              <motion.circle 
                cx="32" cy="32" r="21" stroke="#81c784" strokeWidth="1.5" fill="none" 
                animate={{ scale: [1, 1.4], opacity: [0.8, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
              />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-100 bg-cover bg-center flex flex-col items-center overflow-y-auto ${
        currentStep === 1 ? "py-6 sm:py-10 px-4" : "justify-start p-0"
      }`}
      style={{
        backgroundImage: `url('https://i.pinimg.com/originals/e2/a6/f8/e2a6f87f8fe30760d63761171cebb959.jpg')`
      }}
      id="launcher-screen-root"
    >
      {/* Heavy scenic overlay mirroring a retro fantasy lighting rig */}
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-900/70 to-amber-900/45 backdrop-blur-[3px]" />

      <motion.div 
        key={currentStep}
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={
          currentStep === 1 
            ? "relative z-10 max-w-md sm:max-w-lg md:max-w-xl w-[92%] bg-[#fdf8ee] rounded-[2rem] border-6 border-[#8b5e34] shadow-[0_20px_50px_rgba(0,0,0,0.65)] overflow-hidden text-[#5d4037] my-auto flex flex-col"
            : "relative z-10 w-full min-h-screen bg-[#fdf8ee] text-[#5d4037] flex flex-col overflow-y-auto"
        }
        id="launcher-board-canvas"
      >
        {/* Golden medieval header banding */}
        <div className={`bg-[#8b5e34] text-center border-b-4 border-[#5d4037] relative flex flex-col items-center select-none ${
          currentStep === 1 ? "py-4 sm:py-5 px-4" : "py-8 px-6"
        }`}>
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-28 scale-x-75 sm:scale-x-100 sm:w-36 h-2 bg-yellow-400 rounded-b-md" />
          
          <div className="flex items-center gap-1 sm:gap-2 mb-1 mt-1">
            <Sword className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-yellow-300 animate-pulse" />
            <span className="font-mono text-[9px] sm:text-xs font-black text-yellow-200 tracking-[0.18em] sm:tracking-[0.25em] uppercase">
              {currentStep === 1 ? 'GERBANG UTAMA KEDAI' : 'KUSTOMISASI KARAKTER UTAMA'}
            </span>
            <Sword className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-yellow-300 animate-pulse transform scale-x-[-1]" />
          </div>

          <h1 className={`font-serif font-black text-white tracking-widest drop-shadow-md leading-none uppercase ${
            currentStep === 1 ? "text-xl sm:text-2xl md:text-3xl" : "text-4xl md:text-6xl"
          }`}>
            DAILY QUEST BOARD
          </h1>
          <p className={`text-yellow-100 font-mono tracking-widest font-black mt-1.5 uppercase ${
            currentStep === 1 ? "text-[8px] sm:text-[10px]" : "text-xs md:text-sm"
          }`}>
            {currentStep === 1 ? '🚀 JADIKAN HIDUPMU SEBAGAI JALUR RPG EPIK' : '✍️ ISI NAMA DAN KELAS ATRIBUT UNTUK MEMULAI'}
          </p>
        </div>

        {/* STEP 1: WELCOME SCREEN WITH STATIC SHIELD EMBLEM */}
        {currentStep === 1 ? (
          <>
            <div className="p-4 sm:p-6 md:p-7 space-y-4 sm:space-y-5 flex-1 overflow-y-auto custom-scrollbar flex flex-col justify-center">
              
              {/* Central static cute shield emblem banner */}
              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-100/80 rounded-full flex items-center justify-center border-4 border-[#8b5e34] shadow-md mb-2 shrink-0">
                  <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-[#8b5e34]" />
                </div>
                <div className="bg-[#fffcf7] border-2 border-[#8b5e34]/30 px-4 py-2 rounded-2xl max-w-xs sm:max-w-md shadow-sm">
                  <p className="text-[11px] sm:text-xs font-serif font-bold italic text-stone-750 leading-relaxed">
                    🛡️ "Keberhasilan kemajuan besar dibangun dari kedisiplinan murni misi harianmu!"
                  </p>
                </div>
              </div>

              {/* Magnificent landing board welcome layout */}
              <div className="bg-[#ebdcb9]/40 border-2 border-dashed border-[#8b5e34]/50 p-4 sm:p-5 rounded-2xl text-center space-y-2.5 sm:space-y-3.5 shadow-sm">
                <h2 className="font-serif text-base sm:text-lg md:text-xl font-black text-[#8b5e34] uppercase tracking-wider drop-shadow-sm">
                  SELAMAT DATANG DI PETUALANGAN ANDA!
                </h2>
                
                <p className="text-[11px] sm:text-xs md:text-sm font-medium leading-relaxed font-serif max-w-md mx-auto text-stone-700">
                  Ubah urusan rutin harian Anda menjadi misi RPG yang menantang! Di Papan Misi Dewan Kedai, setiap kemajuan belajar, olahraga, maupun ibadah dapat memberikan Anda keping emas dan medali kebanggaan.
                </p>

                <div className="flex justify-center flex-wrap gap-x-2 gap-y-1 pt-1 font-mono text-[8px] sm:text-[10px] font-black text-[#8b5e34]">
                  <span className="flex items-center gap-1 bg-[#ebdcb9]/60 px-2.5 py-1 rounded-md border border-[#8b5e34]/20">⚔️ SELESAIKAN MISI</span>
                  <span className="flex items-center gap-1 bg-[#ebdcb9]/60 px-2.5 py-1 rounded-md border border-[#8b5e34]/20">🪙 KUMPULKAN EMAS</span>
                  <span className="flex items-center gap-1 bg-[#ebdcb9]/60 px-2.5 py-1 rounded-md border border-[#8b5e34]/20">👑 NAIK LEVEL</span>
                </div>
              </div>

            </div>

            {/* Bottom launcher launch CTA for Welcome step */}
            <div className="bg-[#ebdcb9] py-4 sm:py-5 px-4 border-t-4 border-[#8b5e34] text-center flex flex-col items-center justify-center gap-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  playSynthSound('click');
                  setCurrentStep(2);
                }}
                className="w-full sm:w-5/6 py-2.5 sm:py-3 bg-yellow-400 hover:bg-yellow-300 text-stone-900 font-serif font-black text-xs sm:text-sm uppercase tracking-widest rounded-xl border-2 sm:border-4 border-[#5d4037] shadow-[0_4px_0_0_#8b5e34,0_6px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_2px_0_0_#8b5e34] hover:translate-y-[2px] transition-all cursor-pointer flex items-center justify-center gap-2 active:translate-y-1 active:shadow-none"
                id="start-adventure-welcome-btn"
              >
                <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-stone-900 animate-bounce" />
                <span>AYO BERPETUALANG SEKARANG! ⚔️</span>
                <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-stone-900 animate-bounce" />
              </motion.button>
              
              <p className="text-[9px] sm:text-[10px] font-mono text-[#8b5e34] font-black tracking-wide flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-yellow-600 animate-pulse" /> KETUK UNTUK MEMULAI KUSTOMISASI ATRIBUT <Sparkles className="w-3.5 h-3.5 text-yellow-600 animate-pulse" />
              </p>
            </div>
          </>
        ) : (
          /* STEP 2: SETUP SCREEN - NAMA & PILIH DISIPLIN UTAMA (FULL SCREEN INTEGRATED VIEW) */
          <>
            <div className="p-8 md:p-16 max-w-6xl w-full mx-auto space-y-10 flex-1 relative">
              
              {/* Flexbox for name selection and back button inline to prevent overlay */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b-2 border-stone-200/40">
                <div className="space-y-3 flex-grow">
                  <label className="text-sm md:text-base font-mono font-black text-[#8b5e34] uppercase tracking-widest block">
                    👤 NAMA PETUALANG ANDA:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (Math.random() < 0.2) playSynthSound('click');
                      }}
                      placeholder="Tulis nama ksatria/penyihir Anda..."
                      className="w-full px-8 py-5 font-serif font-black bg-white rounded-2xl border-4 border-[#8b5e34] focus:outline-none focus:ring-4 focus:ring-yellow-400/40 text-[#5d4037] tracking-wider text-lg md:text-2xl shadow-[0_6px_0_0_#8b5e34] transition-all placeholder-stone-400"
                      maxLength={24}
                    />
                    <span className="absolute right-6 top-1/2 transform -translate-y-1/2 text-sm md:text-base opacity-60 font-mono font-black animate-pulse">
                      {name.length}/24
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => { playSynthSound('click'); setCurrentStep(1); }}
                  className="px-6 py-4.5 text-xs md:text-sm border-2 border-[#8b5e34] bg-white hover:bg-amber-50 text-[#8b5e34] font-mono font-black rounded-xl shadow-[3px_3px_0_0_#8b5e34] active:translate-y-[1px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer self-start md:self-end shrink-0"
                  id="back-to-step-1-btn"
                >
                  ← KEMBALI KE SAMBUTAN
                </button>
              </div>

              {/* Starting Role selector */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b-2 border-stone-200/40 pb-2">
                  <span className="text-sm md:text-base font-mono font-black text-[#8b5e34] uppercase tracking-widest block">
                    🛡️ PILIH DISIPLIN UTAMA (FOKUS GAYA HIDUP):
                  </span>
                  <span className="font-mono text-[10px] md:text-xs font-black text-[#8b5e34] uppercase bg-yellow-200 px-3 py-1.5 rounded-lg border border-[#8b5e34]/15">
                    BISA DIGANTI NANTI KAPAN SAJA
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {roles.map((role) => {
                    const isSelected = selectedRole === role.id;
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => selectRoleHandler(role.id)}
                        className={`p-6 md:p-8 border-4 rounded-[2.5rem] text-left transition-all relative cursor-pointer flex gap-5 items-start justify-between ${
                          isSelected
                            ? `${role.colorClass} border-yellow-500 shadow-[6px_6px_0_0_#8b5e34] scale-102`
                            : 'border-[#ebdcb9] bg-white hover:bg-[#fffcf7] text-[#5d4037] hover:scale-[1.01]'
                        }`}
                        id={`launcher-role-${role.id}`}
                      >
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-3xl md:text-4xl">{role.icon}</span>
                              <span className="font-serif text-lg md:text-2xl font-black uppercase text-[#5d4037]">
                                {role.name}
                              </span>
                            </div>
                          </div>

                          <p className="text-xs md:text-sm font-mono font-black mt-1.5 border-y border-stone-300/40 py-1.5 inline-block text-amber-900 uppercase">
                            Stat Utama: {role.statLine}
                          </p>

                          <p className="text-sm md:text-base text-stone-650 leading-relaxed font-semibold">
                            {role.desc}
                          </p>

                          <div className="pt-2 flex items-center">
                            {isSelected ? (
                              <span className="bg-yellow-400 text-stone-900 border-2 border-[#5d4037] text-xs font-mono font-black px-3.5 py-1.5 rounded-xl">
                                DISIPLIN AKTIF
                              </span>
                            ) : (
                              <span className="text-xs font-mono text-stone-450 font-bold uppercase border border-stone-300 px-3.5 py-1.5 rounded-xl">
                                Klik Pilih
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Integrated dynamic custom micro vector animation */}
                        <div className="pt-1.5 select-none shrink-0 animate-pulse">
                          {renderRoleIllustration(role.id, isSelected)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Big epic bottom startup launcher launch CTA! */}
            <div className="bg-[#ebdcb9] py-10 px-8 border-t-4 border-[#8b5e34] text-center flex flex-col items-center justify-center gap-4 mt-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStart}
                className="w-full sm:w-2/3 py-5 bg-yellow-400 hover:bg-yellow-300 text-stone-900 font-serif font-black text-lg md:text-xl uppercase tracking-widest rounded-2xl border-4 border-[#5d4037] shadow-[0_8px_0_0_#8b5e34,0_12px_24px_rgba(0,0,0,0.35)] hover:shadow-[0_4px_0_0_#8b5e34] hover:translate-y-1 transition-all cursor-pointer flex items-center justify-center gap-4 active:translate-y-2 active:shadow-none"
                id="start-adventure-cta-btn"
              >
                <Crown className="w-7 h-7 text-stone-900 animate-spin-slow" />
                <span>MULAI PETUALANGAN UTAMAMU! ⚔️</span>
                <Crown className="w-7 h-7 text-stone-900 animate-spin-slow" />
              </motion.button>
              
              <div className="flex items-center gap-5 text-sm font-mono font-bold text-[#8b5e34] mt-2">
                <button 
                  onClick={() => { playSynthSound('click'); setCurrentStep(1); }} 
                  className="underline hover:text-[#5d4037] font-black cursor-pointer"
                >
                  Kembali ke Screen Sambutan
                </button>
                <span className="opacity-50">|</span>
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-600 animate-pulse" /> REBUT EMAS DAN STATUS KEWIBAWAAN SETIAP HARI!
                </span>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
