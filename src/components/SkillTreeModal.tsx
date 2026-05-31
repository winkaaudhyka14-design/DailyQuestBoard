import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, Shield, Zap, Lock, BookOpen, AlertCircle, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { Character } from '../types';

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  cost: number;
  bonusStat: 'str' | 'int' | 'dex' | 'con' | 'maxHp';
  bonusValue: number;
  prerequisiteId?: string;
  icon: string;
  category: 'Offensive' | 'Defensive' | 'Magical' | 'Utility';
  tier: number;
  x: number; // For layout/drawing lines
  y: number; // For layout/drawing lines
}

export const SKILL_TREE_DATA: SkillNode[] = [
  {
    id: 'resolve',
    name: "Adventurer's Resolve",
    description: "Tekad petualang pemula meningkatkan stamina tubuh secara permanen.",
    cost: 15,
    bonusStat: 'maxHp',
    bonusValue: 5,
    icon: '🛡️',
    category: 'Defensive',
    tier: 1,
    x: 50,
    y: 10
  },
  {
    id: 'heavy_strike',
    name: "Heavy Strike",
    description: "Serangan bertenaga penuh melatih otot lengan tangan.",
    cost: 25,
    bonusStat: 'str',
    bonusValue: 1,
    prerequisiteId: 'resolve',
    icon: '⚔️',
    category: 'Offensive',
    tier: 2,
    x: 20,
    y: 40
  },
  {
    id: 'iron_fortification',
    name: "Iron Wall Defense",
    description: "Pondasi pertahanan kokoh bagaikan dinding besi.",
    cost: 40,
    bonusStat: 'con',
    bonusValue: 2,
    prerequisiteId: 'heavy_strike',
    icon: '🧱',
    category: 'Defensive',
    tier: 3,
    x: 15,
    y: 75
  },
  {
    id: 'mind_focus',
    name: "Inner Mind Focus",
    description: "Meningkatkan konsentrasi dan pemahaman spiritual.",
    cost: 25,
    bonusStat: 'int',
    bonusValue: 1,
    prerequisiteId: 'resolve',
    icon: '🔮',
    category: 'Magical',
    tier: 2,
    x: 50,
    y: 40
  },
  {
    id: 'arcane_mastery',
    name: "Arcane Flow",
    description: "Merangsang sirkulasi energi magis di dalam pikiran.",
    cost: 45,
    bonusStat: 'int',
    bonusValue: 2,
    prerequisiteId: 'mind_focus',
    icon: '🌀',
    category: 'Magical',
    tier: 3,
    x: 50,
    y: 75
  },
  {
    id: 'fleet_footed',
    name: "Fleet Footed",
    description: "Langkah lincah melatih kecepatan reaksi dalam bertindak.",
    cost: 25,
    bonusStat: 'dex',
    bonusValue: 1,
    prerequisiteId: 'resolve',
    icon: '⚡',
    category: 'Utility',
    tier: 2,
    x: 80,
    y: 40
  },
  {
    id: 'shadow_step',
    name: "Shadow Step",
    description: "Gerakan rahasia meluncur sunyi tanpa terdeteksi.",
    cost: 40,
    bonusStat: 'dex',
    bonusValue: 2,
    prerequisiteId: 'fleet_footed',
    icon: '👣',
    category: 'Utility',
    tier: 3,
    x: 85,
    y: 75
  }
];

interface SkillTreeModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character;
  onUnlockSkill: (skillId: string, cost: number, bonusStat: string, bonusValue: number) => void;
  unlockedSkills: string[];
  playSynthSound: (type: any) => void;
}

export default function SkillTreeModal({
  isOpen,
  onClose,
  character,
  onUnlockSkill,
  unlockedSkills,
  playSynthSound
}: SkillTreeModalProps) {
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);

  if (!isOpen) return null;

  const isUnlocked = (id: string) => unlockedSkills.includes(id);

  const canUnlock = (node: SkillNode) => {
    if (isUnlocked(node.id)) return false;
    if (node.prerequisiteId && !isUnlocked(node.prerequisiteId)) return false;
    return character.gold >= node.cost;
  };

  const getPrereqName = (prereqId?: string) => {
    if (!prereqId) return '';
    const found = SKILL_TREE_DATA.find(n => n.id === prereqId);
    return found ? found.name : '';
  };

  const handlePurchase = (node: SkillNode) => {
    if (!canUnlock(node)) return;
    playSynthSound('levelup');
    onUnlockSkill(node.id, node.cost, node.bonusStat, node.bonusValue);
    setSelectedNode(node);
  };

  const currentHoveredNode = selectedNode || SKILL_TREE_DATA[0];

  return (
    <div className="fixed inset-0 bg-[#231d1a]/85 z-50 flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto" id="skilltree-modal">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[#fffdf7] border-8 border-[#8b5e34] w-full max-w-4xl rounded-[2.5rem] shadow-[0_16px_0_0_#5d4037] flex flex-col md:flex-row overflow-hidden max-h-[90vh] md:max-h-[80vh] relative z-20"
        id="skilltree-container"
      >
        
        {/* Dynamic Branching Connection SVG overlay for background */}
        <div className="absolute inset-0 pointer-events-none opacity-15 hidden md:block" style={{ zIndex: 0 }}>
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Draw lines */}
            {SKILL_TREE_DATA.filter(n => n.prerequisiteId).map(node => {
              const prereq = SKILL_TREE_DATA.find(p => p.id === node.prerequisiteId);
              if (!prereq) return null;
              
              // Map map coordinates roughly (percentages) to pixels assuming 60% of container width is the map
              const x1 = `${prereq.x * 0.6 + 5}%`;
              const y1 = `${prereq.y * 0.8 + 8}%`;
              const x2 = `${node.x * 0.6 + 5}%`;
              const y2 = `${node.y * 0.8 + 8}%`;
              
              const unlockedPath = isUnlocked(node.id) && isUnlocked(prereq.id);

              return (
                <line
                  key={`${node.id}-${prereq.id}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={unlockedPath ? "#d97706" : "#8b5e34"}
                  strokeWidth={unlockedPath ? "4" : "2"}
                  strokeDasharray={unlockedPath ? "none" : "6,6"}
                />
              );
            })}
          </svg>
        </div>

        {/* LEFT PANEL: Interactive Skill Tree Map */}
        <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col justify-between border-b-4 md:border-b-0 md:border-r-4 border-[#8b5e34] relative z-10 overflow-y-auto">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-[#8b5e34]/15">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-amber-700 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-md">
                  🌲 Pohon Keunikan RPG
                </span>
                <h2 className="font-serif text-xl md:text-2xl font-black text-[#5d4037] mt-0.5">
                  POHON KEAHLIAN
                </h2>
              </div>
              <div className="flex items-center gap-1.5 bg-yellow-50 text-amber-800 border-2 border-[#ffd700] px-3 py-1 rounded-xl shadow-[1px_1px_0_0_#e2d6c3]">
                <span className="font-mono text-xs font-bold">Dompet:</span>
                <span className="font-mono text-sm font-black text-amber-600 font-bold">{character.gold}🪙</span>
              </div>
            </div>

            <p className="text-stone-500 text-xs font-sans leading-relaxed mb-6">
              Investasikan koin emas hasil kerja keras petualangan harian Anda untuk melatih kemampuan permanen, melampaui batas level biasa!
            </p>

            {/* Mobile Branch Connector indicator list */}
            <div className="grid grid-cols-1 gap-4 text-left md:hidden my-2 border-2 border-dashed border-[#8b5e34]/20 p-3 rounded-2xl bg-amber-50/35">
              <span className="text-[10px] font-mono font-bold uppercase text-[#8b5e34]">Alur Prasyarat:</span>
              <div className="text-[10px] space-y-1 font-mono text-stone-600">
                <div>• <span className="font-bold text-[#8b5e34]">Heavit Strike</span> butuh <span className="underline">Adventurer's Resolve</span></div>
                <div>• <span className="font-bold text-[#8b5e34]">Iron Wall Defense</span> butuh <span className="underline">Heavy Strike</span></div>
                <div>• <span className="font-bold text-[#8b5e34]">Inner Mind Focus</span> butuh <span className="underline">Adventurer's Resolve</span></div>
                <div>• <span className="font-bold text-[#8b5e34]">Arcane Flow</span> butuh <span className="underline">Inner Mind Focus</span></div>
                <div>• <span className="font-bold text-[#8b5e34]">Fleet Footed</span> butuh <span className="underline">Adventurer's Resolve</span></div>
                <div>• <span className="font-bold text-[#8b5e34]">Shadow Step</span> butuh <span className="underline">Fleet Footed</span></div>
              </div>
            </div>

            {/* Map Canvas / Nodes container (Responsive grid layout on mobile, absolute percentage-based map on desktop) */}
            <div className="relative bg-gradient-to-br from-[#fffdf2] to-[#fcf4e8] border-4 border-[#8b5e34]/40 p-6 md:p-10 rounded-3xl h-[28rem] md:h-[22rem] shadow-inner flex flex-wrap md:block justify-center gap-4 content-start overflow-y-auto">
              {SKILL_TREE_DATA.map((node) => {
                const unlocked = isUnlocked(node.id);
                const focusable = canUnlock(node);
                const selected = selectedNode?.id === node.id;

                return (
                  <motion.button
                    key={node.id}
                    onClick={() => {
                      playSynthSound('click');
                      setSelectedNode(node);
                    }}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      left: `${node.x}%`,
                      top: `${node.y}%`
                    }}
                    className={`
                      relative md:absolute md:-ml-8 md:-mt-8 w-14 h-14 md:w-16 md:h-16 rounded-2xl border-4 flex flex-col items-center justify-center cursor-pointer transition-all duration-300
                      ${unlocked 
                        ? 'bg-amber-450 border-amber-600 text-white shadow-[0_5px_0_0_#92400e] hover:shadow-[0_2px_0_0_#92400e] md:translate-y-0 translate-y-[-2px]' 
                        : focusable
                          ? 'bg-[#fff] border-amber-500 text-[#5d4037] shadow-[0_5px_0_0_#d97706] hover:scale-105 hover:bg-yellow-50'
                          : 'bg-stone-100 border-stone-300 text-stone-400 select-none shadow-[0_3px_0_0_#ccc]'
                      }
                      ${selected ? 'ring-4 ring-offset-2 ring-yellow-600 scale-105 z-10' : ''}
                    `}
                    id={`skill-node-${node.id}`}
                  >
                    <span className="text-2xl filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)] leading-none mb-1">
                      {node.icon}
                    </span>
                    <span className="text-[7.5px] uppercase font-mono font-black tracking-tighter max-w-[50px] overflow-hidden whitespace-nowrap text-ellipsis leading-none text-center">
                      {node.name.split(' ')[0]}
                    </span>

                    {/* Prerequisite Indicator overlay */}
                    {node.prerequisiteId && !isUnlocked(node.prerequisiteId) && !unlocked && (
                      <div className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-stone-500 rounded-full flex items-center justify-center border-2 border-white text-white">
                        <Lock className="w-2.5 h-2.5" />
                      </div>
                    )}

                    {/* Active Buyable indicator particle ring */}
                    {focusable && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                      </span>
                    )}

                    {/* Unlocked Completed Checkmark */}
                    {unlocked && (
                      <CheckCircle2 className="w-4 h-4 text-amber-100 absolute -bottom-1 -right-1 bg-amber-600 rounded-full border border-white" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 flex items-center justify-between text-[10px] font-mono text-[#8b5e34]">
            <div className="flex gap-4">
              <span className="flex items-center gap-1">
                <span className="w-3 w-3 h-3 bg-amber-400 rounded-sm border border-amber-600 block shadow-sm"></span> Terbuka
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 w-3 h-3 bg-[#fff] rounded-sm border-2 border-amber-500 block shadow-sm"></span> Dapat Dibeli
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 w-3 h-3 bg-stone-100 rounded-sm border border-stone-300 block shadow-xs"></span> Terkunci Prasyarat / Miskin
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Details & Purchase Screen */}
        <div className="w-full md:w-2/5 bg-[#fbf8f3] p-6 md:p-8 flex flex-col justify-between overflow-y-auto min-h-[16rem]">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentHoveredNode.id}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="space-y-6 flex-grow flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-[#8b5e34] flex items-center justify-center text-3xl">
                    {currentHoveredNode.icon}
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-black text-[#5d4037] leading-tight flex items-center gap-1.5 flex-wrap">
                      {currentHoveredNode.name}
                    </h3>
                    <span className="inline-block text-[9px] font-mono font-bold tracking-widest text-[#8b5e34] uppercase py-0.5 px-1.5 bg-amber-100 rounded-md border border-amber-200 mt-1">
                      {currentHoveredNode.category} TIER {currentHoveredNode.tier}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-white border-2 border-[#e2d6c3] rounded-2xl shadow-inner text-stone-600 space-y-2 text-xs font-sans leading-relaxed text-left">
                  <span className="text-[10px] font-mono text-stone-400 font-bold uppercase block">DESKRIPSI KEMAMPUAN:</span>
                  <p>{currentHoveredNode.description}</p>
                </div>

                {/* Permanent Bonus Section */}
                <div className="p-4 bg-amber-50/50 border-2 border-dashed border-[#8b5e34]/30 rounded-2xl text-left space-y-2">
                  <span className="text-[10px] font-mono text-amber-700 font-bold uppercase block tracking-wider">🌟 EFEK BONUS PERMANEN:</span>
                  <div className="flex items-center gap-2">
                    {currentHoveredNode.bonusStat === 'maxHp' ? (
                      <span className="bg-rose-500 text-white font-mono font-black text-xs px-2.5 py-1 rounded-lg">
                        Maksimal HP +{currentHoveredNode.bonusValue}
                      </span>
                    ) : (
                      <span className="bg-amber-500 text-white font-mono font-black text-xs px-2.5 py-1 rounded-lg uppercase">
                        {currentHoveredNode.bonusStat.toUpperCase()} +{currentHoveredNode.bonusValue}
                      </span>
                    )}
                    <span className="text-[10px] text-stone-500 font-sans italic">Ditambahkan instan ke status utama.</span>
                  </div>
                </div>

                {/* Prerequisites info box */}
                {currentHoveredNode.prerequisiteId && (
                  <div className="flex items-center gap-2 text-[11px] font-mono text-left px-1">
                    <span className="text-stone-400">Butuh Keahlian:</span>
                    <span className={`font-bold py-0.5 px-2 rounded-md ${isUnlocked(currentHoveredNode.prerequisiteId) ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' : 'text-red-700 bg-red-50 border border-red-200'}`}>
                      {isUnlocked(currentHoveredNode.prerequisiteId) ? '✅' : '🔒'} {getPrereqName(currentHoveredNode.prerequisiteId)}
                    </span>
                  </div>
                )}
              </div>

              {/* PURCHASE STATUS BUTTON & LOGIC */}
              <div className="space-y-3 pt-6 border-t-2 border-dashed border-[#e2d6c3]/60">
                <div className="flex items-center justify-between text-xs font-mono font-bold">
                  <span className="text-stone-500">Kebutuhan Latihan:</span>
                  <span className="text-[#5d4037] flex items-center gap-1 text-sm font-black">
                    {currentHoveredNode.cost} Gold 🪙
                  </span>
                </div>

                {isUnlocked(currentHoveredNode.id) ? (
                  <div className="w-full h-11 bg-emerald-100 text-emerald-800 border-2 border-emerald-500/30 rounded-xl flex items-center justify-center gap-2 font-mono font-black text-xs uppercase shadow-inner">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    Keahlian Telah Dikuasai! ✨
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handlePurchase(currentHoveredNode)}
                    disabled={!canUnlock(currentHoveredNode)}
                    className={`
                      w-full h-11 rounded-xl font-mono font-black text-xs uppercase border-2 transition-all cursor-pointer flex items-center justify-center gap-2
                      ${canUnlock(currentHoveredNode)
                        ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-700 shadow-[0_3px_0_0_#92400e] active:translate-y-[1px] active:shadow-none'
                        : 'bg-stone-200 border-stone-300 text-stone-400 select-none shadow-none cursor-not-allowed'
                      }
                    `}
                    id="skilltree-buy-btn"
                  >
                    {!isUnlocked(currentHoveredNode.id) && currentHoveredNode.prerequisiteId && !isUnlocked(currentHoveredNode.prerequisiteId) ? (
                      <>
                        <Lock className="w-4 h-4" />
                        Prasyarat Belum Terbuka 🔒
                      </>
                    ) : character.gold < currentHoveredNode.cost ? (
                      <>
                        <AlertCircle className="w-4 h-4" />
                        Emas Tidak Mencukupi! 🪙
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin-slow" />
                        PELAJARI KEAHLIAN (-{currentHoveredNode.cost}🪙)
                      </>
                    )}
                  </button>
                )}
              </div>

            </motion.div>
          </AnimatePresence>

          <button
            type="button"
            onClick={() => {
              playSynthSound('click');
              onClose();
            }}
            className="w-full mt-6 h-10 bg-stone-100 hover:bg-stone-200 text-stone-700 font-mono font-bold text-xs uppercase rounded-xl border-2 border-stone-300 transition-all cursor-pointer shadow-[0_2.5px_0_0_#ccc] active:translate-y-[1px] active:shadow-none"
            id="skilltree-close-btn"
          >
            Kembali Berkelana
          </button>
        </div>

      </motion.div>
    </div>
  );
}
