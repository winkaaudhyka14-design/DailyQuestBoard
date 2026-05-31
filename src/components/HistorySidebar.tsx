import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  History, ChevronLeft, Calendar, 
  Trash2, Sword, Sparkles, Heart, Compass, 
  Trophy, BookOpen, Coins, FlaskConical, Crown, Info, X, Award, ShieldAlert, Zap
} from 'lucide-react';
import { HistoryItem, Character } from '../types';

interface HistorySidebarProps {
  history: HistoryItem[];
  onClearHistory: () => void;
  onRemoveHistoryItem: (id: string) => void;
  playSynthSound: (type: 'quest' | 'gold' | 'levelup' | 'click' | 'fail' | 'delete' | 'quest_complete') => void;
  character: Character;
  setCharacter: React.Dispatch<React.SetStateAction<Character>>;
  addLog: (message: string, type: 'quest_complete' | 'level_up' | 'quest_create' | 'system' | 'quest_deleted') => void;
}

interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  effectType: 'str' | 'int' | 'dex' | 'con' | 'exp' | 'level';
  effectValue: number;
  icon: string;
  colorClass: string;
  bgClass: string;
}

const POTION_ITEMS: ShopItem[] = [
  {
    id: 'potion_str',
    name: 'Elixir Keberanian',
    description: 'Rebusan minyak keberanian merah membara untuk menambah Kekuatan Fisik petualang berpangkat ksatria.',
    cost: 45,
    effectType: 'str',
    effectValue: 2,
    icon: '⚔️',
    colorClass: 'text-rose-650 border-rose-300',
    bgClass: 'bg-rose-50'
  },
  {
    id: 'potion_int',
    name: 'Teh Kebijaksanaan',
    description: 'Sari buah biru mistis yang dipetik dari kuil dewa kebijaksanaan untuk menajamkan kemampuan logika.',
    cost: 45,
    effectType: 'int',
    effectValue: 2,
    icon: '🔮',
    colorClass: 'text-violet-650 border-[#8b5e34]',
    bgClass: 'bg-violet-50/70'
  },
  {
    id: 'potion_dex',
    name: 'Minyak Gesit Lembah',
    description: 'Minyak langka untuk memoles alas kaki Anda agar dapat melangkah secepat bayangan kegelapan.',
    cost: 45,
    effectType: 'dex',
    effectValue: 2,
    icon: '⚡',
    colorClass: 'text-amber-650 border-[#8b5e34]',
    bgClass: 'bg-amber-50/70'
  },
  {
    id: 'potion_con',
    name: 'Ekstrak Akar Hayat',
    description: 'Ramuan kental beraroma tanah lembap untuk memperkuat ketahanan imun tubuh dan kapasitas stamina.',
    cost: 45,
    effectType: 'con',
    effectValue: 2,
    icon: '🪵',
    colorClass: 'text-emerald-650 border-emerald-300',
    bgClass: 'bg-emerald-50'
  },
  {
    id: 'potion_exp',
    name: 'Kristal Spiritual Suci',
    description: 'Serpihan kristal sihir yang meledak melepaskan remah-remah ingatan spiritual petualangan masa lalu.',
    cost: 30,
    effectType: 'exp',
    effectValue: 40,
    icon: '✨',
    colorClass: 'text-blue-650 border-blue-300',
    bgClass: 'bg-blue-50'
  },
  {
    id: 'potion_level',
    name: 'Gulungan Berkat Agung',
    description: 'Mantra berlapis emas legendaris yang seketika menerobos tingkatan latihan batin, langsung naik level!',
    cost: 240,
    effectType: 'level',
    effectValue: 1,
    icon: '👑',
    colorClass: 'text-[#8b5e34] border-[#8b5e34]',
    bgClass: 'bg-yellow-50'
  }
];

export default function HistorySidebar({ 
  history, 
  onClearHistory, 
  onRemoveHistoryItem, 
  playSynthSound,
  character,
  setCharacter,
  addLog
}: HistorySidebarProps) {
  // Navigation / Modal States
  const [activeMenu, setActiveMenu] = useState<'none' | 'history' | 'shop' | 'status' | 'guide'>('none');
  const [shopFeedback, setShopFeedback] = useState<{message: string; type: 'success' | 'error'} | null>(null);

  const getCategoryTheme = (category: string) => {
    switch(category) {
      case 'combat': return 'bg-rose-50 border-rose-200 text-rose-800';
      case 'magic': return 'bg-violet-50 text-violet-800 border-violet-200';
      case 'vitality': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'stealth': return 'bg-amber-50 text-amber-800 border-amber-200';
      default: return 'bg-[#fffbf4] text-stone-800 border-stone-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'combat': return <Sword className="w-3 h-3 text-rose-600" />;
      case 'magic': return <Sparkles className="w-3 h-3 text-violet-600" />;
      case 'vitality': return <Heart className="w-3 h-3 text-emerald-600" />;
      case 'stealth': return <Compass className="w-3 h-3 text-amber-600" />;
      default: return <BookOpen className="w-3 h-3" />;
    }
  };

  const menuItems = [
    { id: 'history', label: 'Riwayat', icon: <History className="w-5.5 h-5.5 text-amber-900 group-hover:scale-110" />, badge: history.length },
    { id: 'shop', label: 'Kedai Alkemi', icon: <FlaskConical className="w-5.5 h-5.5 text-indigo-900 group-hover:scale-110" />, labelColor: 'text-indigo-400' },
    { id: 'status', label: 'Gelar Atribut', icon: <Crown className="w-5.5 h-5.5 text-[#8b5e34] group-hover:scale-110" /> },
    { id: 'guide', label: 'Kitab Panduan', icon: <Info className="w-5.5 h-5.5 text-emerald-900 group-hover:scale-110" /> },
  ];

  const handleMenuClick = (menuId: 'history' | 'shop' | 'status' | 'guide') => {
    playSynthSound('click');
    if (activeMenu === menuId) {
      setActiveMenu('none');
    } else {
      setActiveMenu(menuId);
      setShopFeedback(null);
    }
  };

  // Stats calculation
  const totalGoldFromHistory = history.reduce((sum, item) => sum + item.goldReward, 0);
  const totalExpFromHistory = history.reduce((sum, item) => sum + item.expReward, 0);

  // Shop purchase logic
  const handleBuyPotion = (item: ShopItem) => {
    if (character.gold < item.cost) {
      playSynthSound('fail');
      setShopFeedback({
        message: `❌ Keping emas Anda tidak mencukupi untuk menukar [${item.name}].`,
        type: 'error'
      });
      return;
    }

    // Process Purchase
    playSynthSound('gold');
    
    setCharacter(prevChar => {
      const updatedGold = prevChar.gold - item.cost;
      let updatedStats = { ...prevChar.stats };
      let updatedLevel = prevChar.level;
      let updatedExp = prevChar.exp;
      
      if (item.effectType === 'str') updatedStats.str += item.effectValue;
      if (item.effectType === 'int') updatedStats.int += item.effectValue;
      if (item.effectType === 'dex') updatedStats.dex += item.effectValue;
      if (item.effectType === 'con') updatedStats.con += item.effectValue;
      
      if (item.effectType === 'exp') {
        const requiredExpVal = 100 + (updatedLevel - 1) * 25; // standard RPG scaling formula used in app
        updatedExp += item.effectValue;
        if (updatedExp >= requiredExpVal) {
          updatedExp -= requiredExpVal;
          updatedLevel += 1;
          updatedStats.str += 1;
          updatedStats.int += 1;
          updatedStats.dex += 1;
          updatedStats.con += 1;
          setTimeout(() => playSynthSound('levelup'), 400);
          addLog(`👑 KEDAHSYATAN ALKEMI! [${prevChar.name}] naik ke Level ${updatedLevel} setelah menyerap energi ramuan spiritual!`, 'level_up');
        }
      }

      if (item.effectType === 'level') {
        updatedLevel += 1;
        updatedStats.str += 1;
        updatedStats.int += 1;
        updatedStats.dex += 1;
        updatedStats.con += 1;
        setTimeout(() => playSynthSound('levelup'), 100);
        addLog(`👑 KEDAHSYATAN ALKEMI! [${prevChar.name}] merobek gulungan berkat magis dan naik ke Level ${updatedLevel}!`, 'level_up');
      }

      const logMsg = item.effectType === 'exp' 
        ? `🧪 Mengonsumsi [${item.name}]: Membuka ingatan petualang kuno (+${item.effectValue} EXP)!`
        : item.effectType === 'level'
        ? `🧪 Mengonsumsi [${item.name}]: Naik tingkat latihan instan!`
        : `🧪 Meminum ramuan [${item.name}]: Membosster status ${item.effectType.toUpperCase()} Anda sebesar +${item.effectValue}!`;

      addLog(logMsg, 'quest_complete');

      return {
        ...prevChar,
        gold: updatedGold,
        level: updatedLevel,
        exp: updatedExp,
        stats: updatedStats
      };
    });

    setShopFeedback({
      message: `✨ Berhasil menukar [${item.name}]! Khasiat ramuan langsung ditambahkan ke jiwamu.`,
      type: 'success'
    });
  };

  const getCustomTitle = (char: Character) => {
    const totalStats = char.stats.str + char.stats.int + char.stats.dex + char.stats.con;
    if (char.level >= 15) return 'Legenda Pelindung Kerajaan (Aura Platinum)';
    if (char.level >= 10) return 'Ksatria Utama Guild Elit';
    if (char.level >= 5) {
      if (char.role === 'wizard') return 'Penyihir Agung Menara Lilin';
      if (char.role === 'fighter') return 'Prajurit Berani Pengejar Mimpi';
      if (char.role === 'rogue') return 'Pemburu Bayangan Senyap';
      return 'Biarawan Pembuat Keajaiban';
    }
    return 'Petualang Pemula';
  };

  const getClassDescription = (role: Character['role']) => {
    switch (role) {
      case 'fighter': return 'Berfokus pada kekuatan fisik dan kebugaran tubuh. Menggunakan energi harian untuk latihan fisik, angkat beban, olahraga, dan melatih otot lengan serta stamina dada.';
      case 'wizard': return 'Menghabiskan waktu dengan mempelajari kitab kuno, menyerap pengetahuan logika fungsional, coding, membaca buku non-fiksi, dan mengerjakan tugas matematika.';
      case 'rogue': return 'Bergerak dalam diam demi efisiensi tinggi, berfokus ke disiplin harian, pengerjaan cepat yang bersih, fokus penuh tanpa distraksi HP, dan bangun pagi tepat waktu.';
      case 'cleric': return 'Membawa energi ketenangan, meditasi pernapasan teratur harian, menjaga asupan gizi buah, tidur berkualitas, mendengarkan orang lain, berbuat baik, dan refleksi hidup.';
    }
  };

  return (
    <>
      {/* 1. DOCKED VERTICAL CONTROL STRIP (Attached flat to left edge) */}
      <div 
        className="fixed left-0 top-[22%] z-50 flex flex-col bg-[#ebdcb9] border-y-4 border-r-4 border-[#8b5e34] rounded-r-2xl shadow-[4px_6px_15px_rgba(139,94,52,0.3)] p-2 items-center w-[72px] gap-4"
        id="rpg-control-dock"
      >
        {/* Tiny Carved Wood Header indicator */}
        <div className="w-10 h-1.5 bg-[#8b5e34] rounded-full animate-pulse" />

        {menuItems.map((item) => {
          const isSelected = activeMenu === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id as any)}
              className={`p-2 w-full rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center relative group ${
                isSelected 
                  ? 'bg-yellow-400 text-stone-950 border-[#8b5e34] shadow-none scale-105' 
                  : 'bg-white hover:bg-[#fff9ed] border-[#c0af8e] text-[#5d4037] hover:scale-105 active:scale-95'
              }`}
              title={item.label}
              id={`nav-btn-${item.id}`}
            >
              {item.icon}
              
              {/* Badge for History or other events */}
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-650 text-white rounded-full border border-white font-mono font-black text-[8.5px] w-[18px] h-[18px] flex items-center justify-center leading-none">
                  {item.badge}
                </span>
              )}

              {/* Unique Minimal text underneath menu icons */}
              <span className="text-[10px] uppercase font-serif font-extrabold tracking-wide mt-1 text-[#5d4037] block text-center leading-none">
                {item.id === 'history' ? 'REKOR' : item.id === 'shop' ? 'KEDAI' : item.id === 'status' ? 'GELAR' : 'INFO'}
              </span>
            </button>
          );
        })}

        {/* Small Golden Coin Counter under sidebar menus */}
        <div className="flex flex-col items-center border-t-2 border-[#d4a373]/50 pt-2 w-full">
          <Coins className="w-4.5 h-4.5 text-amber-500 animate-bounce" />
          <span className="font-mono text-[10px] font-black text-amber-800 leading-none mt-1">
            {character.gold}g
          </span>
        </div>
      </div>

      {/* Side Backdrops */}
      {activeMenu !== 'none' && (
        <div 
          onClick={() => setActiveMenu('none')}
          className="fixed inset-0 bg-black/45 backdrop-blur-[2px] z-40 transition-opacity"
          id="dock-backdrop"
        />
      )}

      {/* MENU CONTENT DRAWERS & PANELS */}
      <AnimatePresence mode="wait">
        
        {/* SUBMENU 1: Buku Riwayat Misi Drawer */}
        {activeMenu === 'history' && (
          <motion.aside
            key="history-drawer"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed left-[72px] top-0 bottom-0 w-[310px] md:w-[350px] bg-[#fffbf4] border-r-8 border-[#8b5e34] shadow-[10px_0_35px_rgba(0,0,0,0.3)] z-50 flex flex-col pt-4 overflow-hidden"
            id="submenu-history-drawer"
          >
            {/* Header */}
            <div className="px-5 pb-3 border-b-4 border-[#8b5e34] bg-[#ebdcb9]/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-[#8b5e34]" />
                  <div>
                    <h3 className="font-serif text-lg md:text-xl font-black text-[#5d4037] tracking-wider uppercase leading-snug">
                      BUKU RIWAYAT
                    </h3>
                    <span className="text-[11px] md:text-[12px] uppercase font-mono tracking-wider text-[#8b5e34] font-bold block leading-none">
                      catatan pencapaian petualang
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveMenu('none')}
                  className="p-1 px-1.5 text-stone-600 hover:bg-stone-200/50 rounded-lg text-xs font-black border border-stone-200 bg-white cursor-pointer"
                  title="Tutup Laci"
                  id="close-history-drawer-btn"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Acc stats badge */}
              <div className="bg-white border-2 border-[#8b5e34] p-3 rounded-xl flex flex-col gap-1.5 shadow-[2px_2px_0_0_#8b5e34]">
                <p className="text-[10px] md:text-[11px] font-mono font-black uppercase text-[#8b5e34] flex items-center gap-1 border-b border-[#e2d6c3] pb-1">
                  <Trophy className="w-3.5 h-3.5 text-yellow-500" /> REKOR AKUMULASI MISI SELESAI
                </p>
                <div className="grid grid-cols-3 gap-1.5 text-center">
                  <div className="p-1 leading-tight">
                    <span className="block text-[9px] md:text-[10px] text-stone-500 font-mono font-bold uppercase">Selesai</span>
                    <strong className="text-sm md:text-base font-mono text-[#5d4037] font-black">{history.length} x</strong>
                  </div>
                  <div className="p-1 leading-tight border-x border-[#ebdcb9]">
                    <span className="block text-[9px] md:text-[10px] text-stone-500 font-mono font-bold uppercase">EXP Total</span>
                    <strong className="text-sm md:text-base font-mono text-blue-700 font-black">+{totalExpFromHistory}</strong>
                  </div>
                  <div className="p-1 leading-tight">
                    <span className="block text-[9px] md:text-[10px] text-stone-500 font-mono font-bold uppercase">Emas</span>
                    <strong className="text-sm md:text-base font-mono text-amber-700 font-black">+{totalGoldFromHistory}g</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#fffdf7] custom-scrollbar">
              {history.length === 0 ? (
                <div className="text-center py-24 px-6 space-y-4">
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#8b5e34]/40 flex items-center justify-center mx-auto bg-[#fffcf5]">
                    <Calendar className="w-6 h-6 text-[#8b5e34]/50" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-serif text-sm font-bold text-[#5d4037]">Gulungan Sejarah Kosong</p>
                    <p className="text-[11px] text-[#8b5e34]/80 leading-relaxed max-w-[200px] mx-auto">
                      Selesaikan misi harian Anda di papan quest untuk mencatat prestasi heroik Anda di sini!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {history.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="p-3 bg-white border-2 border-[#8b5e34] rounded-xl hover:shadow-[3px_3px_0_0_#8b5e34] transition-all relative group flex flex-col gap-2 shadow-[1px_1px_0_0_#8b5e34]"
                    >
                      <div className="flex items-center justify-between text-[9px] font-mono border-b border-[#e2d6c3]/40 pb-1.5">
                        <span className="text-stone-400 font-bold flex items-center gap-1">
                          <Calendar className="w-3" />
                          {item.completedAt}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded-md border text-[8px] font-black uppercase flex items-center gap-1 ${getCategoryTheme(item.category)}`}>
                          {getCategoryIcon(item.category)}
                          <span>{item.category}</span>
                        </span>
                      </div>
                      <h5 className="font-serif text-xs font-black text-[#5d4037] leading-tight uppercase pr-4">
                        {item.title}
                      </h5>
                      <div className="flex flex-wrap items-center gap-1 text-[8px] font-mono font-black">
                        <span className="bg-blue-50 text-blue-800 border border-blue-200 px-1 rounded">
                          +{item.expReward} EXP
                        </span>
                        <span className="bg-amber-50 text-amber-800 border border-yellow-200 px-1 rounded">
                          +{item.goldReward}g G
                        </span>
                        <span className="bg-purple-50 text-purple-800 border border-purple-200 px-1 rounded uppercase">
                          {item.statReward}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          playSynthSound('delete');
                          onRemoveHistoryItem(item.id);
                        }}
                        className="absolute right-2 top-2 p-1 text-stone-300 hover:text-red-650 opacity-0 group-hover:opacity-100 transition-opacity rounded hover:bg-stone-100 cursor-pointer"
                        title="Hapus baris catatan ini"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer wipe */}
            {history.length > 0 && (
              <div className="p-4 border-t-2 border-[#8b5e34] bg-[#ebdcb9]/20 flex flex-col gap-2">
                <button
                  onClick={() => {
                    if (window.confirm("Apakah Anda yakin ingin bersihkan seluruh rekaman sejarah petualangan?")) {
                      playSynthSound('fail');
                      onClearHistory();
                    }
                  }}
                  className="w-full py-2 bg-red-50 text-red-800 hover:bg-red-100 border-2 border-red-300 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Bersihkan Catatan Sejarah
                </button>
              </div>
            )}
          </motion.aside>
        )}

        {/* SUBMENU 2: Toko Ramuan Sihir (Dapur Alkemi) Menu Drawer */}
        {activeMenu === 'shop' && (
          <motion.aside
            key="shop-drawer"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed left-[72px] top-0 bottom-0 w-[310px] md:w-[350px] bg-[#fdfaf2] border-r-8 border-[#5c4033] shadow-[10px_0_35px_rgba(0,0,0,0.3)] z-50 flex flex-col pt-4 overflow-hidden text-[#5c4033]"
            id="submenu-shop-drawer"
          >
            {/* Header */}
            <div className="px-5 pb-3 border-b-4 border-[#8b5e34] bg-[#ebdcb9]/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-indigo-700 animate-pulse" />
                  <div>
                    <h3 className="font-serif text-lg md:text-xl font-black text-[#8b5e34] tracking-wider uppercase leading-snug">
                      DAPUR ALKEMI
                    </h3>
                    <span className="text-[11px] md:text-[12px] uppercase font-mono tracking-wider text-indigo-850 font-bold block leading-none">
                      TUKARKAN EMAS UNTUK PENINGKATAN STAT
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveMenu('none')}
                  className="p-1 px-1.5 text-stone-600 hover:bg-stone-200/50 rounded-lg text-xs font-black border border-stone-200 bg-white cursor-pointer"
                  title="Tutup Kedai"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Informative description */}
              <p className="text-[10px] italic text-[#8b5e34] leading-relaxed">
                "Keping emas yang diperoleh dari memaku misi harian berharga di papan tulis dapat digunakan untuk meminum ramuan hasil rumusan ramuan dari penyihir menara lilin."
              </p>
            </div>

            {/* Main Shop items scroll area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#fffdfa] custom-scrollbar">
              
              {/* Feedback toast message */}
              {shopFeedback && (
                <div className={`p-3 border-2 rounded-xl text-[11px] font-bold leading-tight ${
                  shopFeedback.type === 'success' 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                    : 'bg-red-50 text-red-800 border-red-300'
                }`}>
                  {shopFeedback.message}
                </div>
              )}

              <div className="space-y-3">
                <p className="text-[9px] font-mono font-black text-[#8b5e34] uppercase tracking-wide">
                  🧪 PILIHAN ELIXIR & BERKAT (TERSEDIA):
                </p>

                {POTION_ITEMS.map((potion) => {
                  const canAfford = character.gold >= potion.cost;
                  return (
                    <div
                      key={potion.id}
                      className={`p-3 border-2 rounded-xl transition-all flex flex-col gap-2 relative group ${potion.bgClass} ${
                        canAfford 
                          ? 'border-[#8b5e34] hover:shadow-[3px_3px_0_0_#8b5e34]' 
                          : 'border-stone-200 opacity-75'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{potion.icon}</span>
                          <div>
                            <h4 className="font-serif text-xs font-black text-[#5d4037] uppercase">
                              {potion.name}
                            </h4>
                            <span className="text-[8px] font-mono font-black text-blue-800 uppercase bg-white/60 px-1 rounded">
                              +{potion.effectValue} {potion.effectType.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        {/* Gold price tab */}
                        <div className="flex items-center gap-1 font-mono text-[10px] font-black text-amber-800 bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded-lg">
                          <Coins className="w-3 h-3 text-amber-600" />
                          <span>{potion.cost}g</span>
                        </div>
                      </div>

                      <p className="text-xs text-stone-700 leading-relaxed font-sans pr-1">
                        {potion.description}
                      </p>

                      {/* Buy Action Button */}
                      <button
                        onClick={() => handleBuyPotion(potion)}
                        className={`w-full py-1.5 text-xs font-mono font-black uppercase rounded-lg border-2 transition-all cursor-pointer flex items-center justify-center gap-1 ${
                          canAfford
                            ? 'bg-amber-400 hover:bg-amber-300 text-stone-900 border-[#8b5e34] shadow-[1px_1px_0_0_#8b5e34]'
                            : 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed'
                        }`}
                      >
                        🧪 MINUM RAMUAN ({potion.cost} EMAS)
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer with player Balance overview */}
            <div className="p-3 bg-amber-50/50 border-t-2 border-[#5c4033] flex items-center justify-between">
              <span className="text-[10px] font-serif font-bold text-[#8b5e34]">
                Kantung Uang Emas saat ini:
              </span>
              <strong className="flex items-center gap-1 font-mono text-sm font-black text-amber-800 bg-white px-2.5 py-1 border border-amber-300 rounded-xl">
                <Coins className="w-4 h-4 text-amber-500 animate-spin-slow" />
                {character.gold}g
              </strong>
            </div>
          </motion.aside>
        )}

        {/* SUBMENU 3: Gelar & Atribut Codex (Faksi) Drawer */}
        {activeMenu === 'status' && (
          <motion.aside
            key="status-drawer"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed left-[72px] top-0 bottom-0 w-[310px] md:w-[350px] bg-[#fdfcf6] border-r-8 border-[#3d4a3e] shadow-[10px_0_35px_rgba(0,0,0,0.3)] z-50 flex flex-col pt-4 overflow-hidden"
            id="submenu-status-drawer"
          >
            {/* Header */}
            <div className="px-5 pb-3 border-b-4 border-[#8b5e34] bg-[#ebdcb9]/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-yellow-600 animate-pulse" />
                  <div>
                    <h3 className="font-serif text-lg md:text-xl font-black text-[#5d4037] tracking-wider uppercase leading-snug">
                      CODEX KELAS & GELAR
                    </h3>
                    <span className="text-[11px] md:text-[12px] uppercase font-mono tracking-wider text-[#8b5e34] font-bold block leading-none">
                      DESKRIPSI TINGKAT LINGKAR ATRIBUTFU
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveMenu('none')}
                  className="p-1 px-1.5 text-stone-600 hover:bg-stone-200/50 rounded-lg text-xs font-black border border-stone-200 bg-white cursor-pointer"
                  title="Tutup Codex"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Scrollable description box */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#fffdfa] custom-scrollbar">
              
              {/* Profile Card Summary */}
              <div className="bg-white border-2 border-[#8b5e34] p-4 rounded-xl space-y-3 shadow-[2px_2px_0_0_#8b5e34] text-[#5d4037]">
                <div className="border-b border-[#ebdcb9] pb-2 flex items-center justify-between">
                  <h4 className="font-serif font-black text-sm uppercase text-amber-900 flex items-center gap-1">
                    <Award className="w-4 h-4 text-yellow-500" /> RESUME PETUALANG
                  </h4>
                  <span className="font-mono text-[9px] bg-[#8b5e34] text-white px-2 py-0.5 rounded-full font-black">
                    Lv. {character.level}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] leading-snug">
                  <div>
                    <span className="text-stone-400 font-bold block text-[8px] uppercase font-mono">Nama Karakter</span>
                    <strong className="text-[#5d4037] font-serif font-black text-xs uppercase">{character.name}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 font-bold block text-[8px] uppercase font-mono">Profesi RPG</span>
                    <strong className="text-indigo-800 font-serif font-black text-xs uppercase">{character.role}</strong>
                  </div>
                  <div className="col-span-2 pt-1">
                    <span className="text-stone-400 font-bold block text-[8px] uppercase font-mono">Gelar Aktif Hari Ini</span>
                    <strong className="text-amber-800 font-serif font-black text-[11px] uppercase leading-none">
                      🏆 {getCustomTitle(character)}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Class Descriptions details */}
              <div className="space-y-4">
                <p className="text-[11px] font-mono font-black text-[#8b5e34] uppercase tracking-wide">
                  ⚔️ CODEX PROFESI GAYA HIDUP & PRINSIP PENINGKATAN:
                </p>

                <div className="p-3 bg-[#e8f5e9]/60 border-2 border-emerald-400 rounded-xl space-y-1.5 text-stone-850">
                  <h5 className="font-serif text-sm font-black text-emerald-950 uppercase">
                    🌳 CLERIC (BIARAWAN) - BOOST CON
                  </h5>
                  <p className="text-xs md:text-[13px] leading-relaxed font-sans text-stone-700">
                    Meningkatkan kekebalan mental dan kesehatan jasmani Anda. Digunakan untuk melacak aktivitas ketenangan jiwa, istirahat teratur, minum air putih, dan makan makanan organik berserat.
                  </p>
                </div>

                <div className="p-3 bg-[#eef2ff]/60 border-2 border-indigo-400 rounded-xl space-y-1.5 text-stone-850">
                  <h5 className="font-serif text-sm font-black text-indigo-950 uppercase">
                    🔮 WIZARD (PENYIHIR) - BOOST INT
                  </h5>
                  <p className="text-xs md:text-[13px] leading-relaxed font-sans text-stone-700">
                    Mengasah kapasitas otak Anda. Sangat cocok digunakan untuk melacak kemajuan membaca novel/buku ensiklopedia, menulis ulasan, belajar koding, dan berdiskusi logis.
                  </p>
                </div>

                <div className="p-3 bg-[#fff1f2]/60 border-2 border-rose-400 rounded-xl space-y-1.5 text-stone-850">
                  <h5 className="font-serif text-sm font-black text-rose-950 uppercase">
                    ⚔️ FIGHTER (KSATRIA) - BOOST STR
                  </h5>
                  <p className="text-xs md:text-[13px] leading-relaxed font-sans text-stone-700">
                    Menyuburkan kekuatan mekanik fisik. Dipandu untuk melacak jadwal olahraga Anda: pushup harian, angkat beban besi barbel, lari keliling kompleks, dan olahraga lincah bulu tangkis.
                  </p>
                </div>

                <div className="p-3 bg-[#fffbeb]/65 border-2 border-amber-400 rounded-xl space-y-1.5 text-stone-850">
                  <h5 className="font-serif text-sm font-black text-amber-950 uppercase">
                    ⚡ ROGUE (PENCURI) - BOOST DEX
                  </h5>
                  <p className="text-xs md:text-[13px] leading-relaxed font-sans text-stone-700">
                    Melatih kecepatan gerak kerja harian untuk mendobrak rasa malas. Digunakan untuk memantau pengerjaan PR tepat waktu, menjauhkan HP saat kerja, dan merapikan kamar tidur pagi-pagi.
                  </p>
                </div>
              </div>
            </div>
          </motion.aside>
        )}

        {/* SUBMENU 4: Panduan Aturan Misi Drawer */}
        {activeMenu === 'guide' && (
          <motion.aside
            key="guide-drawer"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed left-[72px] top-0 bottom-0 w-[310px] md:w-[350px] bg-[#fffcf3] border-r-8 border-[#2e5d34] shadow-[10px_0_35px_rgba(0,0,0,0.3)] z-50 flex flex-col pt-4 overflow-hidden"
            id="submenu-guide-drawer"
          >
            {/* Header */}
            <div className="px-5 pb-3 border-b-4 border-emerald-800 bg-emerald-50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-800" />
                  <div>
                    <h3 className="font-serif text-lg md:text-xl font-black text-[#5d4037] tracking-wider uppercase leading-snug">
                      SERAT PEDOMAN RPG
                    </h3>
                    <span className="text-[11px] md:text-[12px] uppercase font-mono tracking-wider text-[#8b5e34] font-bold block leading-none">
                      BAGAIMANA CARA BERIKUT BERHASIL?
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveMenu('none')}
                  className="p-1 px-1.5 text-[#5d4037] hover:bg-stone-200/50 rounded-lg text-xs font-black border border-stone-200 bg-white cursor-pointer"
                  title="Tutup Panduan"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Scroll view of guidance text */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#fffcf7] custom-scrollbar text-[#5d4037] font-sans pr-3 text-xs leading-relaxed">
              
              <div className="space-y-4">
                <div className="border-[#ebdcb9] border-2 bg-white rounded-xl p-3.5 space-y-2.5">
                  <p className="font-sans font-black text-xs md:text-sm text-amber-950 tracking-wide uppercase leading-none border-b border-[#ebdcb9] pb-2 flex justify-between">
                    <span>🪙 1. DISIPLIN & PENGHARGAAN</span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 rounded font-mono font-bold">MISI</span>
                  </p>
                  <p className="text-stone-700 text-xs md:text-[13.5px] leading-relaxed">
                    Setiap misi harian yang Anda selesaikan di <strong>Papan Misi Petualang</strong> memberikan peningkatan EXP, pundi-pundi koin emas, serta tambahan atribut status unik untuk perkembangan bekal petualang harian Anda.
                  </p>
                </div>

                <div className="border-[#ebdcb9] border-2 bg-white rounded-xl p-3.5 space-y-2.5">
                  <p className="font-sans font-black text-xs md:text-sm text-amber-950 tracking-wide uppercase leading-none border-b border-[#ebdcb9] pb-2 flex justify-between">
                    <span>👑 2. PROGRESI LEVEL UP</span>
                    <span className="text-[10px] bg-yellow-105 text-yellow-850 px-1.5 rounded font-mono font-bold">LEVEL UP</span>
                  </p>
                  <p className="text-stone-700 text-xs md:text-[13.5px] leading-relaxed">
                    Saat akumulasi EXP mencapai ambang batas maksimal, petualang otomatis naik level! Semua poin atribut dasar (STR, INT, DEX, CON) seketika meningkat +1, melambangkan peningkatan disiplin hidup.
                  </p>
                </div>

                <div className="border-[#ebdcb9] border-2 bg-white rounded-xl p-3.5 space-y-2.5">
                  <p className="font-sans font-black text-xs md:text-sm text-indigo-950 tracking-wide uppercase leading-none border-b border-[#ebdcb9] pb-2 flex justify-between">
                    <span>🥋 3. GANTI KELAS KARAKTER</span>
                    <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 rounded font-mono font-bold">PROFESI</span>
                  </p>
                  <p className="text-stone-700 text-xs md:text-[13.5px] leading-relaxed">
                    Penasaran dengan gaya hidup atau latihan batin lain? Cukup <strong>klik avatar lingkar profil Anda</strong> kapan saja untuk berganti faksi kelas petualangan (Fighter, Wizard, Rogue, Cleric) demi adaptasi disiplin harian.
                  </p>
                </div>

                <div className="border-[#ebdcb9] border-2 bg-white rounded-xl p-3.5 space-y-2.5">
                  <p className="font-sans font-black text-xs md:text-sm text-emerald-950 tracking-wide uppercase leading-none border-b border-[#ebdcb9] pb-2 flex justify-between">
                    <span>🎧 4. EFEK SUARA KEDAI</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 rounded font-mono font-bold">AUDIO</span>
                  </p>
                  <p className="text-stone-700 text-xs md:text-[13.5px] leading-relaxed">
                    Dengarkan audio nada synthesizer magis yang dirancang khusus untuk memuaskan pencapaian Anda. Anda dapat membisukan (mute/unmute) audio harian lewat tombol speaker di bar navigasi kanan atas layar.
                  </p>
                </div>

                <div className="border-[#ebdcb9] border-2 bg-white rounded-xl p-3.5 space-y-2.5">
                  <p className="font-sans font-black text-xs md:text-sm text-[#2b4c2b] tracking-wide uppercase leading-none border-b border-[#ebdcb9] pb-2 flex justify-between">
                    <span>🧠 5. UJIAN KEBIJAKSANAAN</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-900 px-1.5 rounded font-mono font-bold">GAME EXP</span>
                  </p>
                  <p className="text-stone-700 text-xs md:text-[13.5px] leading-relaxed">
                    Ingin tambahan EXP melimpah? Uji kecerdasan akademik Anda lewat mini-game <strong>Ujian Kebijaksanaan</strong> harian. Dapatkan tambahan <strong>+50 EXP</strong> setiap jawaban benar untuk maksimal 5 jatah soal menantang per hari!
                  </p>
                </div>
              </div>

              <div className="text-center py-6 block select-none">
                <span className="text-stone-400 font-mono font-bold text-[10px] uppercase tracking-widest leading-none">
                  🛡️ SEMOGA SUKSES PETUALANG 🛡️
                </span>
              </div>
            </div>
          </motion.aside>
        )}

      </AnimatePresence>
    </>
  );
}
