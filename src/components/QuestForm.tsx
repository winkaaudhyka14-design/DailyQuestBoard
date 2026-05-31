import React, { useState } from 'react';
import { Plus, Zap, Coins, TrendingUp, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface QuestFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAddQuest: (title: string, category: 'combat' | 'magic' | 'vitality' | 'stealth', difficulty: 'easy' | 'medium' | 'hard', time: string, startTime?: string, deadline?: string) => void;
  playSynthSound: (type: 'click') => void;
}

export default function QuestForm({ isOpen, onClose, onAddQuest, playSynthSound }: QuestFormProps) {
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'combat' | 'magic' | 'vitality' | 'stealth'>('vitality');
  const [newDifficulty, setNewDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [newTime, setNewTime] = useState('');
  const [newStartTime, setNewStartTime] = useState('');
  const [newDeadline, setNewDeadline] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddQuest(
      newTitle, 
      newCategory, 
      newDifficulty, 
      newTime, 
      newStartTime || undefined, 
      newDeadline || undefined
    );
    setNewTitle('');
    setNewTime('');
    setNewStartTime('');
    setNewDeadline('');
    onClose(); // Auto-close modal after successful creation
  };

  const calculateExp = () => {
    if (newDifficulty === 'hard') return 180;
    if (newDifficulty === 'medium') return 100;
    return 50;
  };

  const calculateGold = () => {
    if (newDifficulty === 'hard') return 50;
    if (newDifficulty === 'medium') return 25;
    return 10;
  };

  const calculateStat = () => {
    const amount = newDifficulty === 'hard' ? 3 : newDifficulty === 'medium' ? 2 : 1;
    switch (newCategory) {
      case 'combat': return `STR +${amount}`;
      case 'magic': return `INT +${amount}`;
      case 'vitality': return `CON +${amount}`;
      case 'stealth': return `DEX +${amount}`;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#231d1a]/85 backdrop-blur-md overflow-y-auto" id="quest-creator-overlay">
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="w-full max-w-lg bg-[#fdfbf7] border-4 border-[#8b5e34] rounded-3xl shadow-[0_12px_0_0_#5d4037] overflow-hidden flex flex-col relative"
            id="creator-modal-card"
          >
            {/* Header with decorative scroll title */}
            <div className="bg-[#fff9e6] border-b-4 border-[#8b5e34] px-6 py-4.5 flex items-center justify-between relative shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-[#8b5e34] text-white p-2 w-10 h-10 rounded-xl border-2 border-[#5d4037] flex items-center justify-center shadow-[1px_1.5px_0_0_#5d4037]">
                  <Plus className="w-5 h-5 text-yellow-300 pointer-events-none" />
                </div>
                <div className="leading-tight">
                  <h3 className="font-serif text-lg md:text-xl font-black tracking-wider text-[#5d4037] uppercase">
                    ✍️ PAPAN TULIS MISI BARU
                  </h3>
                  <p className="text-[10px] text-[#8b5e34] font-mono font-black uppercase tracking-widest leading-none">
                    Daftarkan Petualangan & Rencana Harian Anda
                  </p>
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => { playSynthSound('click'); onClose(); }}
                className="p-1 px-2 rounded-lg border-2 border-stone-300 hover:border-[#8b5e34] bg-white transition-all cursor-pointer text-stone-500 hover:text-stone-850 font-mono font-bold text-xs flex items-center gap-1"
                title="Tutup Form Misi"
                id="close-creator-modal-btn"
              >
                <X className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">BATAL</span>
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              
              {/* Title Input */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-[#8b5e34] uppercase tracking-widest block">
                  🛡️ Deskripsi Nama Misi (Quest) <span className="text-red-500 font-extrabold">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Pushup 20x, Belajar Pemrograman Python, atau Tilawah..."
                  className="w-full border-2 border-[#8b5e34] rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#8b5e34]/15 focus:outline-none bg-[#fefdfa] text-sm text-[#5d4037] font-bold placeholder-[#a89078] shadow-inner"
                  maxLength={60}
                  id="new-title-input"
                  autoFocus
                />
              </div>

              {/* Grid Category & Difficulty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Category Selection */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-[#8b5e34] uppercase tracking-widest block">
                    ✨ Kelas Atribut Atribut
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e: any) => { playSynthSound('click'); setNewCategory(e.target.value); }}
                    className="w-full border-2 border-[#8b5e34] rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#8b5e34]/15 focus:outline-none bg-[#fefdfa] text-[#5d4037] font-bold cursor-pointer"
                    id="new-category-select"
                  >
                    <option value="vitality">❤️ Vitality ( boosts CON )</option>
                    <option value="magic">🔮 Magic ( boosts INT )</option>
                    <option value="combat">⚔️ Combat ( boosts STR )</option>
                    <option value="stealth">🎯 Stealth ( boosts DEX )</option>
                  </select>
                </div>

                {/* Difficulty Selection */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-[#8b5e34] uppercase tracking-widest block">
                    🔥 Tingkat Kesulitan Misi
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['easy', 'medium', 'hard'] as const).map((diff) => (
                      <button
                        key={diff}
                        type="button"
                        onClick={() => { playSynthSound('click'); setNewDifficulty(diff); }}
                        className={`py-2.5 text-xs font-mono font-black uppercase rounded-xl border-2 transition-all active:translate-y-[1px] cursor-pointer ${
                          newDifficulty === diff
                            ? 'bg-amber-100 border-[#8b5e34] text-[#8b5e34] shadow-sm'
                            : 'border-[#e2d6c3] bg-[#fffcf5] text-stone-400 hover:border-[#8b5e34]'
                        }`}
                        id={`diff-btn-${diff}`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Mission Time & Hard Deadline Grid */}
              <div className="grid grid-cols-2 gap-3 bg-[#8b5e34]/5 p-4 rounded-2xl border-2 border-dashed border-[#8b5e34]/15">
                <div className="space-y-1">
                  <label className="block text-[9px] font-black text-[#8b5e34] uppercase tracking-wider">
                    🕒 Jam Mulai (Opsional)
                  </label>
                  <input
                    type="time"
                    value={newStartTime}
                    onChange={(e) => { playSynthSound('click'); setNewStartTime(e.target.value); }}
                    className="w-full border-2 border-[#8b5e34] rounded-lg px-2.5 py-1.5 bg-[#fefdfa] text-xs text-[#5d4037] font-bold cursor-pointer focus:ring-0 focus:outline-none"
                    id="new-starttime-input"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-black text-[#8b5e34] uppercase tracking-wider">
                    ⚠️ Batas Akhir Penalti (Opsional)
                  </label>
                  <input
                    type="time"
                    value={newDeadline}
                    onChange={(e) => { playSynthSound('click'); setNewDeadline(e.target.value); }}
                    className="w-full border-2 border-[#8b5e34] rounded-lg px-2.5 py-1.5 bg-[#fefdfa] text-xs text-[#5d4037] font-bold cursor-pointer focus:ring-0 focus:outline-none"
                    id="new-deadline-input"
                  />
                </div>

                <div className="col-span-2 space-y-1 pt-1.5 border-t border-dashed border-[#8b5e34]/10">
                  <label className="block text-[9px] font-black text-[#8b5e34] uppercase tracking-wider">
                    🏷️ Keterangan Jadwal Tambahan (Opsional)
                  </label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="Contoh: Jam 7 Pagi sebelum berangkat kerja..."
                    className="w-full border-2 border-[#8b5e34] rounded-lg px-2.5 py-1.5 bg-[#fefdfa] text-xs text-[#5d4037] font-bold placeholder-[#a89078] focus:ring-0 focus:outline-none"
                    maxLength={32}
                    id="new-time-input"
                  />
                </div>
              </div>

              {/* Display calculated rewards */}
              <div className="bg-gradient-to-br from-[#fffdf5] to-[#fff9e6] p-4 rounded-2xl border-2 border-[#cbd5e1] shadow-inner space-y-1.5 font-mono text-xs text-stone-700 select-none">
                <p className="font-extrabold text-[#8b5e34] uppercase mb-1 flex items-center gap-1">
                  🎁 BONUS IMBALAN PETUALANGAN NYATA:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-white border p-2 rounded-xl text-center">
                    <span className="block text-[8px] uppercase text-stone-400 font-bold">Poin EXP</span>
                    <span className="text-blue-700 font-extrabold text-sm">+{calculateExp()}</span>
                  </div>
                  <div className="bg-white border p-2 rounded-xl text-center">
                    <span className="block text-[8px] uppercase text-stone-400 font-bold">Koin Gold</span>
                    <span className="text-amber-700 font-extrabold text-sm">+{calculateGold()}</span>
                  </div>
                  <div className="bg-white border p-2 rounded-xl text-center">
                    <span className="block text-[8px] uppercase text-stone-400 font-bold">Atribut Atb</span>
                    <span className="text-purple-800 font-extrabold text-xs uppercase">{calculateStat()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex gap-3 h-14">
                <button
                  type="button"
                  onClick={() => { playSynthSound('click'); onClose(); }}
                  className="w-1/3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-mono font-black text-xs uppercase rounded-2xl border-2 border-stone-300 transition-all cursor-pointer shadow-[0_3px_0_0_#ccc] active:translate-y-1 active:shadow-none"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-[#8b5e34] text-white rounded-2xl font-serif font-black text-sm uppercase tracking-wider shadow-[0_4px_0_0_#5d4037] hover:bg-[#7a512d] active:shadow-none active:translate-y-1 transition-all cursor-pointer"
                  id="submit-quest-btn"
                >
                  🚀 DAFTAR PETUALANGAN!
                </button>
              </div>

            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
