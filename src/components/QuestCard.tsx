import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sword, Sparkles, Heart, Compass, Skull, Star, 
  Clock, Zap, Coins, TrendingUp, RotateCcw, Check, Trash2, AlertTriangle 
} from 'lucide-react';
import { Quest } from '../types';

interface QuestCardProps {
  quest: Quest;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  playSynthSound: (type: 'quest' | 'gold' | 'levelup' | 'click' | 'fail' | 'delete' | 'quest_complete') => void;
  currentTime?: Date;
  onApplyPenalty?: (id: string) => void;
  key?: React.Key;
}

export default function QuestCard({ quest, onToggle, onDelete, playSynthSound, currentTime, onApplyPenalty }: QuestCardProps) {
  const [particles, setParticles] = React.useState<{ id: number; x: number; y: number; rotate: number; char: string; scale: number; duration: number }[]>([]);

  const triggerCelebration = () => {
    const chars = ['✨', '⭐', '🎉', '🌟', '🛡️', '⚔️', '🔥', '👑', '💎', '🌸', '⚡'];
    const newParticles = Array.from({ length: 24 }).map((_, i) => {
      const angle = (Math.random() * 360 * Math.PI) / 180;
      const distance = 50 + Math.random() * 120; // Flight distance outward
      return {
        id: Date.now() + i + Math.random(),
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance - 25, // Upward gravity drag feel
        rotate: Math.random() * 360,
        char: chars[Math.floor(Math.random() * chars.length)],
        scale: 0.7 + Math.random() * 0.8,
        duration: 0.9 + Math.random() * 0.6
      };
    });
    setParticles(newParticles);
    setTimeout(() => {
      setParticles([]);
    }, 1500);
  };

  let cardBgColor = 'bg-gradient-to-br from-[#fffaff] to-[#f5f5f5]';
  let cardBorderColor = 'border-[#8b5e34]';
  let cardShadowColor = 'shadow-[4px_4px_0_0_#e2d6c3] hover:shadow-[6px_6px_0_0_#8b5e34]';
  let iconBadgeColor = 'bg-stone-200 text-stone-800 border-stone-300';
  let claimButtonClass = 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-800 shadow-[0_2.5px_0_0_#065f46]';
  let categoryText = 'Lain-lain';
  let categoryIcon = <Sword className="w-3.5 h-3.5" />;

  if (quest.category === 'combat') {
    cardBgColor = 'bg-gradient-to-br from-[#fff1f2] via-[#ffe4e6] to-[#fecdd3]'; // Pastel Rose DuoGradient
    cardBorderColor = 'border-[#b91c1c]'; // Deep crimson structure
    cardShadowColor = 'shadow-[4px_4px_0_0_#fecdd3] hover:shadow-[6px_6px_0_0_#f43f5e]';
    iconBadgeColor = 'bg-rose-100 text-rose-800 border-rose-300';
    claimButtonClass = 'bg-rose-600 hover:bg-rose-700 text-white border-rose-800 shadow-[0_2.5px_0_0_#9f1239] hover:shadow-md';
    categoryText = 'Combat (STR)';
    categoryIcon = <Sword className="w-3.5 h-3.5 text-rose-600" />;
  } else if (quest.category === 'magic') {
    cardBgColor = 'bg-gradient-to-br from-[#f5f3ff] via-[#f3e8ff] to-[#edd9ff]'; // Pastel Lavender/Indigo DuoGradient
    cardBorderColor = 'border-[#6d28d9]'; // Deep indigo structure
    cardShadowColor = 'shadow-[4px_4px_0_0_#ddd6fe] hover:shadow-[6px_6px_0_0_#8b5cf6]';
    iconBadgeColor = 'bg-purple-100 text-purple-800 border-purple-300';
    claimButtonClass = 'bg-purple-650 hover:bg-purple-750 text-white border-purple-800 shadow-[0_2.5px_0_0_#5c1499] hover:shadow-md';
    categoryText = 'Magic (INT)';
    categoryIcon = <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-pulse" />;
  } else if (quest.category === 'vitality') {
    cardBgColor = 'bg-gradient-to-br from-[#f0fdf4] via-[#e8f5e9] to-[#dcfce7]'; // Pastel Mint/Green DuoGradient
    cardBorderColor = 'border-[#047857]'; // Deep forest-emerald structure
    cardShadowColor = 'shadow-[4px_4px_0_0_#c6f6d5] hover:shadow-[6px_6px_0_0_#10b981]';
    iconBadgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    claimButtonClass = 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-800 shadow-[0_2.5px_0_0_#065f46] hover:shadow-md';
    categoryText = 'Vitality (CON)';
    categoryIcon = <Heart className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />;
  } else if (quest.category === 'stealth') {
    cardBgColor = 'bg-gradient-to-br from-[#fefce8] via-[#fff9c4] to-[#fef9c3]'; // Pastel Warm Sunshine DuoGradient
    cardBorderColor = 'border-[#b45309]'; // Deep wood amber structure
    cardShadowColor = 'shadow-[4px_4px_0_0_#fef08a] hover:shadow-[6px_6px_0_0_#f59e0b]';
    iconBadgeColor = 'bg-amber-100 text-[#78350f] border-amber-300';
    claimButtonClass = 'bg-amber-500 hover:bg-amber-600 text-white border-amber-700 shadow-[0_2.5px_0_0_#92400e] hover:shadow-md';
    categoryText = 'Stealth (DEX)';
    categoryIcon = <Compass className="w-3.5 h-3.5 text-[#b45309]" />;
  }

  // Check if quest is late
  let isLate = false;
  let remainingText = '';

  if (quest.deadline && !quest.completed && currentTime) {
    const [deadHour, deadMin] = quest.deadline.split(':').map(Number);
    const deadTime = new Date(currentTime);
    deadTime.setHours(deadHour, deadMin, 0, 0);

    if (currentTime > deadTime) {
      isLate = true;
    } else {
      const diffMs = deadTime.getTime() - currentTime.getTime();
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      if (diffHrs > 0) {
        remainingText = `${diffHrs}j ${diffMins}m`;
      } else {
        remainingText = `${diffMins}m`;
      }
    }
  }

  // Check if quest has not started yet
  let isNotStartedYet = false;
  let timeToStartText = '';

  if (quest.startTime && !quest.completed && currentTime) {
    const [startHour, startMin] = quest.startTime.split(':').map(Number);
    const startTime = new Date(currentTime);
    startTime.setHours(startHour, startMin, 0, 0);

    if (currentTime < startTime) {
      isNotStartedYet = true;
      const diffMs = startTime.getTime() - currentTime.getTime();
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      if (diffHrs > 0) {
        timeToStartText = `${diffHrs}j ${diffMins}m`;
      } else {
        timeToStartText = `${diffMins}m`;
      }
    }
  }

  const isActive = quest.startTime && quest.deadline && !isNotStartedYet && !isLate && !quest.completed;

  return (
    <motion.div 
      layout
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      whileHover={quest.completed ? {} : { scale: 1.025, y: -2, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.2 }}
      className={`rounded-3xl border-4 p-5 flex flex-col justify-between transition-all duration-300 group ${cardShadowColor} relative overflow-hidden ${cardBgColor} ${
        quest.completed 
          ? 'opacity-65 ring-1 ring-stone-500/10 border-stone-400 bg-stone-100 shadow-none' 
          : cardBorderColor
      }`}
      id={`quest-card-${quest.id}`}
    >
      {/* Celebration Confetti Particles */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.span
            key={p.id}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.1, rotate: 0 }}
            animate={{ 
              x: p.x, 
              y: p.y, 
              opacity: [1, 1, 0.8, 0], 
              scale: [0.1, p.scale, p.scale * 1.2, 0],
              rotate: p.rotate 
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: p.duration, ease: [0.1, 0.8, 0.25, 1] }}
            className="absolute left-1/2 top-1/2 -ml-4 -mt-4 text-xl pointer-events-none z-50 select-none selection:bg-transparent"
          >
            {p.char}
          </motion.span>
        ))}
      </AnimatePresence>
      {/* Category & Difficulty Header */}
      <div className="flex items-center justify-between mb-3 border-b-2 border-dashed border-[#8b5e34]/15 pb-2">
        <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border-2 ${iconBadgeColor}`}>
          <span className="inline-flex items-center gap-1">
            {categoryIcon}
            <span>{categoryText}</span>
          </span>
        </span>

        <span className="flex items-center gap-0.5 font-bold">
          {quest.difficulty === 'hard' && (
            <>
              <Skull className="w-3.5 h-3.5 text-red-600 animate-bounce" />
              <span className="text-[10px] text-red-700 font-mono font-black uppercase ml-0.5">Boss</span>
            </>
          )}
          {quest.difficulty === 'medium' && (
            <>
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
              <span className="text-[10px] text-amber-800 font-mono font-black uppercase ml-0.5">Elite</span>
            </>
          )}
          {quest.difficulty === 'easy' && (
            <>
              <Star className="w-3.5 h-3.5 text-stone-400" />
              <span className="text-[10px] text-stone-600 font-mono font-black uppercase ml-0.5">Minion</span>
            </>
          )}
        </span>
      </div>

      {/* Quest Title & Schedule */}
      <div className="space-y-1 mb-3 flex-1">
        <h4 className={`font-serif text-base font-black tracking-wide leading-snug break-words ${
          quest.completed 
            ? 'line-through text-stone-500 italic' 
            : 'text-[#5d4037] group-hover:text-[#8b5e34]'
        }`}>
          {quest.title}
        </h4>
        
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[#8b5e34] text-xs font-mono font-bold">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#8b5e34]" />
            <span>{quest.time || 'Sepanjang hari'}</span>
          </div>
          {quest.deadline && (
            <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md border ${
              isLate 
                ? 'bg-red-50 border-red-200 text-red-800' 
                : 'bg-amber-50 border-amber-200 text-amber-950 text-[10px]'
            }`}>
              <AlertTriangle className={`w-3 h-3 ${isLate ? 'text-red-500 animate-pulse' : 'text-amber-500'}`} />
              <span>Batas: {quest.deadline} {remainingText && `(${remainingText} sisa)`}</span>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Banner */}
      {isNotStartedYet && !quest.completed && (
        <div className="bg-amber-50/70 border-2 border-amber-400 text-amber-950 rounded-xl p-3 mb-3 flex flex-col gap-1 shadow-sm font-serif" id={`upcoming-banner-${quest.id}`}>
          <div className="flex items-start gap-2">
            <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-tight">
              <p className="text-xs font-black uppercase tracking-wider text-amber-800">⏳ BELUM DIMULAI</p>
              <p className="text-[10px] font-bold text-stone-650">Misi harian aktif dalam {timeToStartText} (pukul {quest.startTime}).</p>
            </div>
          </div>
        </div>
      )}

      {/* Active Banner */}
      {isActive && (
        <div className="bg-emerald-50 border-2 border-emerald-500 text-emerald-950 rounded-xl p-3 mb-3 flex flex-col gap-1 shadow-sm font-serif" id={`active-banner-${quest.id}`}>
          <div className="flex items-start gap-2">
            <div className="relative flex h-5 w-5 shrink-0 mt-0.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-emerald-500 items-center justify-center text-[10px]">⚔️</span>
            </div>
            <div className="leading-tight">
              <p className="text-xs font-black uppercase tracking-wider text-emerald-800">✨ SEDANG BERLANGSUNG</p>
              <p className="text-[10px] font-bold text-stone-700">Misi hari ini aktif! Laksanakan dan klaim EXP sebelum batas pukul {quest.deadline}!</p>
            </div>
          </div>
        </div>
      )}

      {/* Late Warning Alert Banner */}
      {isLate && !quest.penalized && !quest.completed && (
        <div className="bg-red-50 border-2 border-red-500 rounded-xl p-3 mb-3 flex flex-col gap-2 shadow-sm text-red-950 font-serif" id={`late-warning-${quest.id}`}>
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="leading-tight">
              <p className="text-xs font-black uppercase tracking-wider text-red-800">⚠️ JADWAL TERLEWAT!</p>
              <p className="text-[10px] font-bold text-red-700">Misi harian ini telah melewati batas pukul {quest.deadline}.</p>
            </div>
          </div>
          {onApplyPenalty && (
            <button
              onClick={() => onApplyPenalty(quest.id)}
              className="w-full py-1.5 bg-red-600 hover:bg-red-700 text-white font-mono font-black text-[9px] rounded-lg cursor-pointer transition-all active:translate-y-[1px] shadow-[2px_2px_0_0_#991b1b] active:shadow-none uppercase tracking-wider h-7"
              id={`penalty-btn-${quest.id}`}
            >
              💀 TERIMA HUKUMAN PENALTY
            </button>
          )}
        </div>
      )}

      {/* Already Penalized Indicator */}
      {quest.penalized && !quest.completed && (
        <div className="bg-stone-100 border-2 border-stone-300 rounded-xl p-2.5 mb-3 flex items-center gap-2 text-stone-700 font-mono" id={`penalized-info-${quest.id}`}>
          <Skull className="w-4 h-4 text-stone-500 animate-bounce" />
          <div className="leading-tight">
            <p className="text-[10px] font-black uppercase">⚠️ TELAH DIHUKUM</p>
            <p className="text-[9px] font-bold text-stone-500">Misi terlambat. Nyawa (HP) & Gold telah terpotong.</p>
          </div>
        </div>
      )}

      {/* Reward Badges & Completion Controls */}
      <div className="border-t-2 border-[#8b5e34]/15 pt-3 mt-auto flex flex-col gap-3">
        <div className="flex flex-wrap gap-1.5">
          {/* EXP Tag */}
          <span className="inline-flex items-center gap-0.5 bg-blue-100/70 border border-blue-300 rounded-lg px-2 py-0.5 text-[10px] font-black text-blue-800">
            <Zap className="w-3 h-3 text-blue-600" />
            <span>+{quest.expReward} EXP</span>
          </span>

          {/* GOLD Tag */}
          <span className="inline-flex items-center gap-0.5 bg-yellow-100/70 border border-yellow-300 rounded-lg px-2 py-0.5 text-[10px] font-black text-amber-800">
            <Coins className="w-3 h-3 text-amber-600" />
            <span>+{quest.goldReward} G</span>
          </span>

          {/* ATTRIBUTE Tag */}
          <span className="inline-flex items-center gap-0.5 bg-purple-100/70 border border-purple-300 rounded-lg px-2 py-0.5 text-[10px] font-black text-purple-800">
            <TrendingUp className="w-3 h-3 text-purple-600" />
            <span>{quest.statReward}</span>
          </span>
        </div>

        {/* Action button row */}
        <div className="flex items-center justify-between gap-1 border-t border-dashed border-[#8b5e34]/10 pt-2">
          {!(isLate && !quest.completed) && (
            <button
              onClick={() => {
                if (isNotStartedYet) return;
                if (!quest.completed) {
                  playSynthSound('quest_complete');
                  triggerCelebration();
                } else {
                  playSynthSound('click');
                }
                onToggle(quest.id);
              }}
              disabled={isNotStartedYet}
              className={`px-4 py-2 rounded-xl border-2 font-serif text-xs font-black transition-all active:translate-y-[2px] active:shadow-none flex items-center justify-center gap-2 cursor-pointer ${
                quest.completed
                  ? 'bg-[#e2d6c3] text-[#8b5e34] border-[#8b5e34] hover:bg-[#d8c8b0]'
                  : isNotStartedYet
                    ? 'bg-stone-100 text-stone-400 border-stone-300 cursor-not-allowed shadow-none'
                    : claimButtonClass
              }`}
              title={quest.completed ? "Ganti ke Belum selesai" : isNotStartedYet ? "Misi belum memasuki jam mulai" : "Selesaikan Misi!"}
              id={`complete-btn-${quest.id}`}
            >
              {quest.completed ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Batal</span>
                </>
              ) : isNotStartedYet ? (
                <>
                  <Clock className="w-3.5 h-3.5" />
                  <span>Belum Mulai</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3px]" />
                  <span>Klaim EXP</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={() => {
              playSynthSound('click');
              onDelete(quest.id);
            }}
            className="p-2 text-[#8b5e34]/70 hover:text-red-650 rounded-xl hover:bg-stone-200/40 transition-colors"
            title="Hapus Misi"
            id="delete-btn"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Watermark completed tag */}
      {quest.completed && (
        <div className="absolute right-0 bottom-0 pointer-events-none opacity-5 p-1 select-none -translate-x-1 font-black text-[#5d4037] font-serif leading-none text-2xl">
          SELESAI
        </div>
      )}
    </motion.div>
  );
}
