import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, CheckCircle, Bell, Sparkles, MousePointerClick, Play, Info } from 'lucide-react';

export interface SoundSettings {
  clicks: boolean;
  rewards: boolean;
  alarms: boolean;
}

interface SoundSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SoundSettings;
  onUpdateSettings: (settings: SoundSettings) => void;
  playSynthSound: (type: 'quest' | 'gold' | 'levelup' | 'click' | 'fail' | 'delete' | 'quest_complete' | 'alarm') => void;
}

export default function SoundSettingsModal({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  playSynthSound
}: SoundSettingsModalProps) {
  if (!isOpen) return null;

  const toggleCategory = (key: keyof SoundSettings) => {
    playSynthSound('click');
    const updated = {
      ...settings,
      [key]: !settings[key]
    };
    onUpdateSettings(updated);
  };

  const handleTestSound = (type: 'click' | 'gold' | 'alarm') => {
    playSynthSound(type);
  };

  return (
    <div className="fixed inset-0 bg-[#231d1a]/85 z-55 flex items-center justify-center p-4 backdrop-blur-md" id="sound-settings-modal">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        className="w-full max-w-md bg-[#fffdfa] border-6 border-[#8b5e34] p-6 rounded-[2rem] shadow-[0_8px_0_0_#5d4037] text-center space-y-6 relative"
        id="sound-settings-container"
      >
        <div className="flex items-center justify-between border-b-2 border-[#8b5e34]/15 pb-3">
          <div className="flex items-center gap-2 text-[#5d4037]">
            <Volume2 className="w-5 h-5 shrink-0" />
            <h3 className="font-serif text-lg font-black uppercase tracking-wide">
              Konfigurasi Audio RPG
            </h3>
          </div>
          <button
            onClick={() => {
              playSynthSound('click');
              onClose();
            }}
            className="text-[#8b5e34] hover:text-[#5d4037] p-1 bg-stone-100 hover:bg-stone-200 rounded-lg cursor-pointer border border-[#8b5e34]/25"
          >
            ❌
          </button>
        </div>

        <p className="text-xs text-stone-500 font-sans leading-relaxed text-left">
          Atur sirkuit suara sintetis yang ingin Anda dengar secara individual saat melakukan aktivitas petualangan game Anda!
        </p>

        {/* SETTINGS CARD COLUMN */}
        <div className="space-y-3.5 text-left">
          
          {/* UI CLICKS */}
          <div className="bg-white border-2 border-[#8b5e34]/25 p-3.5 rounded-2xl flex items-center justify-between shadow-[2px_2px_0_0_rgba(139,94,52,0.1)]">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-sky-50 rounded-xl text-sky-600 border border-sky-100 shrink-0 mt-0.5">
                <MousePointerClick className="w-4.5 h-4.5" />
              </div>
              <div className="space-y-0.5">
                <span className="font-mono text-xs font-black text-[#5d4037] block">SUARA KLIK & INTERAKSI</span>
                <p className="text-[10px] text-stone-500 leading-normal max-w-[190px]">
                  Feedback ketukan tombol dan beralih menu.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleTestSound('click')}
                disabled={!settings.clicks}
                className={`py-1 px-1.5 rounded-lg border text-[9px] font-bold font-mono transition-all flex items-center gap-0.5 cursor-pointer ${settings.clicks ? 'bg-sky-50 hover:bg-sky-100 text-sky-700 border-sky-200' : 'bg-stone-50 text-stone-400 border-stone-200 cursor-not-allowed'}`}
                title="Sintesis suara klik demo"
              >
                <Play className="w-2.5 h-2.5 fill-current" /> TES
              </button>
              
              <button
                onClick={() => toggleCategory('clicks')}
                className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 cursor-pointer border-2 ${settings.clicks ? 'bg-amber-500 border-amber-700' : 'bg-stone-300 border-stone-400'}`}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${settings.clicks ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          {/* REWARDS & LEVEL UP */}
          <div className="bg-white border-2 border-[#8b5e34]/25 p-3.5 rounded-2xl flex items-center justify-between shadow-[2px_2px_0_0_rgba(139,94,52,0.1)]">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-yellow-50 rounded-xl text-amber-600 border border-yellow-100 shrink-0 mt-0.5">
                <Sparkles className="w-4.5 h-4.5" />
              </div>
              <div className="space-y-0.5">
                <span className="font-mono text-xs font-black text-[#5d4037] block">SUARA REWARD & LEVEL UP</span>
                <p className="text-[10px] text-stone-500 leading-normal max-w-[190px]">
                  Klaim koin emas dambaan, pencapaian misi baru, dan naik tingkat.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleTestSound('gold')}
                disabled={!settings.rewards}
                className={`py-1 px-1.5 rounded-lg border text-[9px] font-bold font-mono transition-all flex items-center gap-0.5 cursor-pointer ${settings.rewards ? 'bg-yellow-50 hover:bg-yellow-100 text-amber-700 border-yellow-200' : 'bg-stone-50 text-stone-400 border-stone-200 cursor-not-allowed'}`}
                title="Sintesis suara koin demo"
              >
                <Play className="w-2.5 h-2.5 fill-current" /> TES
              </button>

              <button
                onClick={() => toggleCategory('rewards')}
                className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 cursor-pointer border-2 ${settings.rewards ? 'bg-amber-500 border-amber-700' : 'bg-stone-300 border-stone-400'}`}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${settings.rewards ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          {/* ALARMS & SIREN */}
          <div className="bg-white border-2 border-[#8b5e34]/25 p-3.5 rounded-2xl flex items-center justify-between shadow-[2px_2px_0_0_rgba(139,94,52,0.1)]">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-rose-50 rounded-xl text-rose-600 border border-rose-100 shrink-0 mt-0.5">
                <Bell className="w-4.5 h-4.5 animate-pulse" />
              </div>
              <div className="space-y-0.5">
                <span className="font-mono text-xs font-black text-[#5d4037] block">SUARA PENGINGAT ALARM</span>
                <p className="text-[10px] text-stone-500 leading-normal max-w-[190px]">
                  Bunyi tenggat waktu krisis ketika misi harian hampir kedaluwarsa.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleTestSound('alarm')}
                disabled={!settings.alarms}
                className={`py-1 px-1.5 rounded-lg border text-[9px] font-bold font-mono transition-all flex items-center gap-0.5 cursor-pointer ${settings.alarms ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200' : 'bg-stone-50 text-stone-400 border-stone-200 cursor-not-allowed'}`}
                title="Sintesis alarm demo"
              >
                <Play className="w-2.5 h-2.5 fill-current" /> TES
              </button>

              <button
                onClick={() => toggleCategory('alarms')}
                className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 cursor-pointer border-2 ${settings.alarms ? 'bg-amber-500 border-amber-700' : 'bg-stone-300 border-stone-400'}`}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${settings.alarms ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

        </div>

        {/* Informational tip */}
        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-start gap-2 text-left">
          <Info className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
          <p className="text-[9.5px] text-stone-500 leading-relaxed font-sans">
            Prefensi suara ini disimpan secara lokal di mesin browser Anda dan tidak akan hilang meskipun tab ditutup sementara.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            playSynthSound('click');
            onClose();
          }}
          className="w-full bg-[#8b5e34] hover:bg-[#7a512d] text-white font-mono font-black text-xs uppercase h-11 rounded-xl border-2 border-[#5d4037] transition-all cursor-pointer shadow-[0_3px_0_0_#5d4037] active:translate-y-[1px] active:shadow-none"
        >
          SIMPAN & KEMBALI
        </button>
      </motion.div>
    </div>
  );
}
