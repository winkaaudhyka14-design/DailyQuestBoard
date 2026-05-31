import React, { useState, useEffect } from 'react';

export default function StickyNote() {
  const [note, setNote] = useState<string>(() => {
    return localStorage.getItem('rpg_sticky_note') || '';
  });
  
  const [isSaved, setIsSaved] = useState<boolean>(true);

  useEffect(() => {
    setIsSaved(false);
    const debounceTimer = setTimeout(() => {
      localStorage.setItem('rpg_sticky_note', note);
      setIsSaved(true);
    }, 450); // debounce input to save database/storage writing rate

    return () => clearTimeout(debounceTimer);
  }, [note]);

  const handleClear = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus seluruh catatan pengingat harian ini?")) {
      setNote('');
    }
  };

  return (
    <div 
      className="relative w-full bg-[#fefcbf] border-2 border-[#d4a373] p-4 pt-6 pb-3 rounded-2xl shadow-[4px_4px_0_0_#d4a373] hover:rotate-0 transition-transform duration-300 md:rotate-[-0.5deg] text-stone-800"
      id="rpg-sticky-note"
    >
      {/* Visual Red Tag Pin at the center of the sticky note */}
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-2xl select-none filter drop-shadow-[0_2.5px_2px_rgba(0,0,0,0.2)] animate-bounce-subtle pointer-events-none">
        📌
      </div>

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-sm select-none">📝</span>
          <h4 className="font-serif text-sm font-black text-[#5d4037] uppercase tracking-wide">
            Catatan Fokus & Pengingat Harian
          </h4>
        </div>
        <div className="flex items-center gap-2">
          {/* Saved Status Indicator */}
          <span className="text-[9px] font-mono font-semibold text-stone-400 flex items-center gap-1 select-none">
            {isSaved ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                Tersimpan
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block animate-spin"></span>
                Mengetik...
              </>
            )}
          </span>
          
          {note.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="text-[10px] text-red-650 hover:text-red-850 font-serif font-black underline cursor-pointer hover:scale-105 transition-transform"
              title="Bersihkan isi catatan"
            >
              Hapus
            </button>
          )}
        </div>
      </div>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Tuliskan misi sampingan bebas, kalimat motivasi hari ini, atau catatan koin impianmu di sini... (tidak mempengaruhi stat utama)"
        className="w-full min-h-[4.5rem] bg-amber-50/10 hover:bg-amber-50/25 focus:bg-white border-2 border-dashed border-[#8b5e34]/25 focus:border-[#8b5e34]/50 rounded-xl p-2.5 text-xs text-stone-700 font-sans italic focus:outline-none transition-all placeholder:text-stone-400 resize-y shadow-inner leading-relaxed"
        maxLength={500}
      />

      <div className="mt-1.5 flex items-center justify-between text-[9px] font-mono text-stone-400 select-none">
        <span>*Catatan ini otomatis menetap di browser Anda harian.</span>
        <span>{note.length}/500</span>
      </div>
    </div>
  );
}
