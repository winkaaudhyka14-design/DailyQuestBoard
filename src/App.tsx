import React, { useState, useEffect, useRef } from 'react';
import { 
  Sword, Shield, Sparkles, Compass, Volume2, VolumeX, 
  User, Award, Coins, Trophy, Scroll, HelpCircle, Heart, Zap, Star, DoorOpen,
  Clock, AlertTriangle, Check, Brain, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Import local types
import { Quest, Character, LogEntry, HistoryItem } from './types';

// Import extracted components
import RoleSelector from './components/RoleSelector';
import LevelUpModal from './components/LevelUpModal';
import QuestForm from './components/QuestForm';
import QuestCard from './components/QuestCard';
import AdventureLog from './components/AdventureLog';
import HistorySidebar from './components/HistorySidebar';
import GameLauncher from './components/GameLauncher';
import PenaltyQuizModal from './components/PenaltyQuizModal';
import DailyExpQuizModal from './components/DailyExpQuizModal';
import AmbientBackgroundAnimation from './components/AmbientBackgroundAnimation';
import SkillTreeModal, { SKILL_TREE_DATA } from './components/SkillTreeModal';
import SoundSettingsModal, { SoundSettings } from './components/SoundSettingsModal';
import StickyNote from './components/StickyNote';

const DEFAULT_QUESTS: Quest[] = [
  {
    id: 'q1',
    title: 'Sparing Pagi (Latihan Olahraga/Pushups)',
    category: 'vitality',
    difficulty: 'easy',
    time: '07:00 - 08:30 (Pagi Hari)',
    startTime: '07:00',
    deadline: '08:30',
    completed: false,
    penalized: false,
    expReward: 50,
    goldReward: 10,
    statReward: 'CON +1'
  },
  {
    id: 'q2',
    title: 'Membaca Kitab Sihir (Membaca Buku/Belajar)',
    category: 'magic',
    difficulty: 'medium',
    time: '09:00 - 11:30 (Pagi/Siang)',
    startTime: '09:00',
    deadline: '11:30',
    completed: false,
    penalized: false,
    expReward: 100,
    goldReward: 25,
    statReward: 'INT +2'
  },
  {
    id: 'q3',
    title: 'Menyelesaikan Quest Utama (Selesaikan Projek/Tugas)',
    category: 'combat',
    difficulty: 'hard',
    time: '13:00 - 16:30 (Siang Hari)',
    startTime: '13:00',
    deadline: '16:30',
    completed: false,
    penalized: false,
    expReward: 180,
    goldReward: 50,
    statReward: 'STR +3'
  },
  {
    id: 'q4',
    title: 'Menyapu Kuil Cadangan (Membersihkan Meja/Rumah)',
    category: 'stealth',
    difficulty: 'easy',
    time: '17:00 - 18:30 (Sore Hari)',
    startTime: '17:00',
    deadline: '18:30',
    completed: false,
    penalized: false,
    expReward: 50,
    goldReward: 10,
    statReward: 'DEX +1'
  }
];

export default function App() {
  // Sound controls
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('rpg_sound_enabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [soundSettings, setSoundSettings] = useState<SoundSettings>(() => {
    const saved = localStorage.getItem('rpg_sound_settings');
    return saved !== null ? JSON.parse(saved) : { clicks: true, rewards: true, alarms: true };
  });

  const [unlockedSkills, setUnlockedSkills] = useState<string[]>(() => {
    const saved = localStorage.getItem('rpg_unlocked_skills');
    return saved !== null ? JSON.parse(saved) : [];
  });

  const [isSkillTreeOpen, setIsSkillTreeOpen] = useState<boolean>(false);
  const [isSoundSettingsOpen, setIsSoundSettingsOpen] = useState<boolean>(false);

  // State
  const [character, setCharacter] = useState<Character>(() => {
    const saved = localStorage.getItem('rpg_character_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          hp: parsed.hp !== undefined ? parsed.hp : 100,
          maxHp: parsed.maxHp !== undefined ? parsed.maxHp : 100
        };
      } catch (e) {
        console.error("Error parsing history character", e);
      }
    }
    return {
      name: 'Satria Pemula',
      role: 'fighter',
      level: 1,
      exp: 0,
      gold: 50,
      hp: 100,
      maxHp: 100,
      stats: {
        str: 14,
        int: 7,
        dex: 9,
        con: 12
      },
      streak: 1,
      questsCompleted: 0
    };
  });

  const [quests, setQuests] = useState<Quest[]>(() => {
    const saved = localStorage.getItem('rpg_quests_list');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((q: any) => ({
          ...q,
          penalized: q.penalized !== undefined ? q.penalized : false
        }));
      } catch (e) {
        console.error("Error parsing history quests", e);
      }
    }
    return DEFAULT_QUESTS;
  });

  const [logs, setLogs] = useState<LogEntry[]>(() => {
    const saved = localStorage.getItem('rpg_adventure_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing logs", e);
      }
    }
    return [
      {
        id: 'init-log',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        message: '🧭 Petualangan barumu dimulai! Sambutlah hari ini dengan penuh semangat harian.',
        type: 'system'
      }
    ];
  });

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('rpg_quests_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing quests history", e);
      }
    }
    return [];
  });

  // UI state
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [roleSelectorOpen, setRoleSelectorOpen] = useState<boolean>(false);
  const [levelUpModalOpen, setLevelUpModalOpen] = useState<boolean>(false);
  const [levelUpDetails, setLevelUpDetails] = useState<{ oldLevel: number; newLevel: number }>({ oldLevel: 1, newLevel: 1 });
  const [editingName, setEditingName] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>(character.name);
  const [hasAdventureStarted, setHasAdventureStarted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isPenaltyQuizOpen, setIsPenaltyQuizOpen] = useState<boolean>(false);
  const [penaltyQuizQuest, setPenaltyQuizQuest] = useState<Quest | null>(null);
  const [isQuestFormOpen, setIsQuestFormOpen] = useState<boolean>(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState<boolean>(false);

  // States for daily EXP quiz wisdom trial
  const [isDailyExpQuizOpen, setIsDailyExpQuizOpen] = useState<boolean>(false);
  const [dailyQuizCount, setDailyQuizCount] = useState<number>(() => {
    const d = new Date();
    const today = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    const lastDate = localStorage.getItem('rpg_daily_quiz_date');
    if (lastDate !== today) {
      return 0;
    }
    const savedCount = localStorage.getItem('rpg_daily_quiz_count');
    return savedCount ? parseInt(savedCount, 10) : 0;
  });

  // Keep daily quiz count persisted
  useEffect(() => {
    const d = new Date();
    const today = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    localStorage.setItem('rpg_daily_quiz_count', dailyQuizCount.toString());
    localStorage.setItem('rpg_daily_quiz_date', today);
  }, [dailyQuizCount]);

  // State for active notifications
  const [activeToast, setActiveToast] = useState<{ id: string; title: string; type: 'start' | 'lapse' | 'success'; message: string } | null>(null);

  // Keep track of which quests have already played their alarm/start sounds in this session
  const playedAlarmsRef = useRef<Set<string>>(new Set());
  const playedStartsRef = useRef<Set<string>>(new Set());

  // Toast automatic dismiss effect
  useEffect(() => {
    if (activeToast) {
      const timer = setTimeout(() => {
        setActiveToast(null);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [activeToast]);

  // Real-time ticking Clock connection, Start of Activity notifications & Alarm checks
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      quests.forEach(q => {
        // 1. Check if activity has started
        if (q.startTime && !q.completed && !q.penalized) {
          const [startHour, startMin] = q.startTime.split(':').map(Number);
          const startTimeDate = new Date(now);
          startTimeDate.setHours(startHour, startMin, 0, 0);

          // If current time crossed start time, and not notified yet
          if (now >= startTimeDate && !playedStartsRef.current.has(q.id)) {
            // Also ensure it is before the deadline (if deadline exists)
            let isBeforeDeadline = true;
            if (q.deadline) {
              const [deadHour, deadMin] = q.deadline.split(':').map(Number);
              const deadTimeDate = new Date(now);
              deadTimeDate.setHours(deadHour, deadMin, 0, 0);
              if (now >= deadTimeDate) {
                isBeforeDeadline = false;
              }
            }

            if (isBeforeDeadline) {
              playedStartsRef.current.add(q.id);
              playSynthSound('quest');
              addLog(`🕒 MISI BARU DIMULAI: Misi "${q.title}" telah memasuki jam jadwal (${q.startTime})! Silakan laksanakan & klaim EXP Anda! ⚡`, 'system');
              setActiveToast({
                id: q.id,
                title: q.title,
                type: 'start',
                message: `Misi "${q.title}" telah dimulai sekarang! Silakan klaim kuota EXP sebelum terlewat.`
              });
            }
          }
        }

        // 2. Check if active quest has crossed its deadline and needs an alarm
        if (q.deadline && !q.completed && !q.penalized) {
          const [deadHour, deadMin] = q.deadline.split(':').map(Number);
          const deadTime = new Date(now);
          deadTime.setHours(deadHour, deadMin, 0, 0);

          if (now > deadTime && !playedAlarmsRef.current.has(q.id)) {
            playedAlarmsRef.current.add(q.id);
            playSynthSound('alarm');
            addLog(`🚨 ALARM BATAS WAKTU: Misi "${q.title}" telah melampaui batas jam harian (${q.deadline})! Anda dinyatakan melupakan aktivitas ini!`, 'system');
            setActiveToast({
              id: q.id,
              title: q.title,
              type: 'lapse',
              message: `Misi "${q.title}" terlewat! Hubungi Papan Trial untuk menerima Hukuman & meminimalkan denda.`
            });
          }
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [quests, soundEnabled]);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('rpg_character_state', JSON.stringify(character));
  }, [character]);

  useEffect(() => {
    localStorage.setItem('rpg_quests_list', JSON.stringify(quests));
  }, [quests]);

  useEffect(() => {
    localStorage.setItem('rpg_adventure_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('rpg_quests_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('rpg_sound_enabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('rpg_sound_settings', JSON.stringify(soundSettings));
  }, [soundSettings]);

  useEffect(() => {
    localStorage.setItem('rpg_unlocked_skills', JSON.stringify(unlockedSkills));
  }, [unlockedSkills]);

  // Audio Synthesis Helper
  const playSynthSound = (type: 'quest' | 'gold' | 'levelup' | 'click' | 'fail' | 'delete' | 'quest_complete' | 'alarm') => {
    if (!soundEnabled) return;
    
    // Check individual sound category overrides
    if (type === 'click' || type === 'delete' || type === 'fail') {
      if (!soundSettings.clicks) return;
    } else if (type === 'alarm') {
      if (!soundSettings.alarms) return;
    } else {
      // Reward chime / level up / quest complete
      if (!soundSettings.rewards) return;
    }

    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(350, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === 'quest' || type === 'quest_complete') {
        const now = ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.36);
        });
      } else if (type === 'gold') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(987.77, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1975.53, ctx.currentTime + 0.06);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else if (type === 'levelup') {
        const now = ctx.currentTime;
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = idx % 2 === 0 ? 'triangle' : 'sine';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.1, now + idx * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8 + idx * 0.04);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.05);
          osc.stop(now + 1.2);
        });
      } else if (type === 'fail') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'delete') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'alarm') {
        const now = ctx.currentTime;
        // Dual freq beeping alarm synthesizer
        for (let i = 0; i < 6; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(i % 2 === 0 ? 880 : 987.77, now + i * 0.22);
          gain.gain.setValueAtTime(0, now + i * 0.22);
          gain.gain.linearRampToValueAtTime(0.12, now + i * 0.22 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.22 + 0.18);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.22);
          osc.stop(now + i * 0.22 + 0.2);
        }
      }
    } catch (e) {
      console.warn("AudioContext audio synth bypassed:", e);
    }
  };

  // Level Up Calculation
  const getRequiredExp = (level: number) => {
    return level * 1000;
  };

  // Add Log Entry
  const addLog = (message: string, type: LogEntry['type']) => {
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newEntry: LogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      time: timeString,
      message,
      type
    };
    setLogs(prev => [newEntry, ...prev.slice(0, 49)]); // Keep latest 50 entries
  };

  // Award EXP and trigger Level Up calculations from Wisdom Quiz
  const handleAwardExp = (amount: number) => {
    setCharacter(prevChar => {
      let nextExp = prevChar.exp + amount;
      let nextLevel = prevChar.level;
      let nextStats = { ...prevChar.stats };
      let expReq = getRequiredExp(nextLevel);
      let nextMaxHp = prevChar.maxHp || 100;
      let isLeveledUp = false;

      // Level up check loop
      while (nextExp >= expReq) {
        nextExp -= expReq;
        nextLevel += 1;
        expReq = getRequiredExp(nextLevel);
        // Level up bonus stats
        nextStats.str += 1;
        nextStats.int += 1;
        nextStats.dex += 1;
        nextStats.con += 1;
        nextMaxHp += 10;
        isLeveledUp = true;
      }

      let nextHp = prevChar.hp || 100;
      if (isLeveledUp) {
        nextHp = nextMaxHp; // Fully heal on level up
        setTimeout(() => {
          playSynthSound('levelup');
          setLevelUpDetails({ oldLevel: prevChar.level, newLevel: nextLevel });
          setLevelUpModalOpen(true);
        }, 300);
        addLog(`🎉 LEVEL UP! ${prevChar.name} berhasil mencapai Level ${nextLevel}! Semua stat meningkat +1!`, 'level_up');
      }

      return {
        ...prevChar,
        level: nextLevel,
        exp: nextExp,
        hp: nextHp,
        maxHp: nextMaxHp,
        stats: nextStats
      };
    });
  };

  // Action: Toggle Completed State
  const toggleQuest = (id: string) => {
    const targetQuest = quests.find(q => q.id === id);
    if (!targetQuest) return;

    const isNowCompleted = !targetQuest.completed;
    
    // Play sounds
    if (isNowCompleted) {
      playSynthSound('quest');
      setTimeout(() => playSynthSound('gold'), 185);
    } else {
      playSynthSound('fail');
    }

    // Process Character Level, Stats, Gold, EXP Change
    if (isNowCompleted) {
      const completionTime = new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
      const newHistoryItem: HistoryItem = {
        id: `history-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        questId: id,
        title: targetQuest.title,
        category: targetQuest.category,
        difficulty: targetQuest.difficulty,
        completedAt: completionTime,
        expReward: targetQuest.expReward,
        goldReward: targetQuest.goldReward,
        statReward: targetQuest.statReward
      };
      setHistory(prev => [newHistoryItem, ...prev]);
    } else {
      setHistory(prev => {
        const index = prev.findIndex(item => item.questId === id);
        if (index !== -1) {
          const updated = [...prev];
          updated.splice(index, 1);
          return updated;
        }
        return prev;
      });
    }

    setQuests(prev => prev.map(q => {
      if (q.id === id) {
        return { ...q, completed: isNowCompleted };
      }
      return q;
    }));

    // Reward multipliers
    const expDelta = isNowCompleted ? targetQuest.expReward : -targetQuest.expReward;
    const goldDelta = isNowCompleted ? targetQuest.goldReward : -targetQuest.goldReward;
    
    // Pre-calculate Level Up
    let checkExp = character.exp + expDelta;
    let checkLevel = character.level;
    let checkExpReq = getRequiredExp(checkLevel);
    let isLeveledUp = false;

    if (isNowCompleted) {
      while (checkExp >= checkExpReq) {
        checkExp -= checkExpReq;
        checkLevel += 1;
        checkExpReq = getRequiredExp(checkLevel);
        isLeveledUp = true;
      }
    }

    setCharacter(prevChar => {
      let nextExp = prevChar.exp + expDelta;
      let nextGold = Math.max(0, prevChar.gold + goldDelta);
      let nextLevel = prevChar.level;
      let nextStats = { ...prevChar.stats };
      let expReq = getRequiredExp(nextLevel);
      let nextMaxHp = prevChar.maxHp || 100;

      // Check stat reward
      const statKey = targetQuest.category === 'combat' ? 'str' 
                    : targetQuest.category === 'magic' ? 'int' 
                    : targetQuest.category === 'vitality' ? 'con' 
                    : 'dex';

      const statMultiplier = isNowCompleted ? 1 : -1;
      const statPoint = targetQuest.difficulty === 'hard' ? 3 : targetQuest.difficulty === 'medium' ? 2 : 1;
      
      nextStats[statKey] = Math.max(1, nextStats[statKey] + (statPoint * statMultiplier));

      if (isNowCompleted) {
        // Level up check
        while (nextExp >= expReq) {
          nextExp -= expReq;
          nextLevel += 1;
          expReq = getRequiredExp(nextLevel);
          // Level up bonus stats
          nextStats.str += 1;
          nextStats.int += 1;
          nextStats.dex += 1;
          nextStats.con += 1;
          nextMaxHp += 10;
        }
      } else {
        if (nextExp < 0) {
          if (nextLevel > 1) {
            nextLevel -= 1;
            nextExp = getRequiredExp(nextLevel) + nextExp;
          } else {
            nextExp = 0;
          }
        }
      }

      // HP heal upon completion
      const hpHeal = isNowCompleted
        ? (targetQuest.difficulty === 'hard' ? 15 : targetQuest.difficulty === 'medium' ? 10 : 5)
        : 0;
      let nextHp = Math.min(nextMaxHp, (prevChar.hp || 100) + hpHeal);

      if (isNowCompleted && isLeveledUp) {
        nextHp = nextMaxHp; // Fully heal on level up
        setTimeout(() => {
          playSynthSound('levelup');
          setLevelUpDetails({ oldLevel: prevChar.level, newLevel: nextLevel });
          setLevelUpModalOpen(true);
        }, 300);
        addLog(`🎉 LEVEL UP! ${prevChar.name} berhasil mencapai Level ${nextLevel}! Semua stat meningkat +1!`, 'level_up');
      }

      const countDelta = isNowCompleted ? 1 : -1;

      return {
        ...prevChar,
        level: nextLevel,
        exp: nextExp,
        gold: nextGold,
        hp: nextHp,
        maxHp: nextMaxHp,
        stats: nextStats,
        questsCompleted: Math.max(0, prevChar.questsCompleted + countDelta)
      };
    });

    if (isNowCompleted) {
      addLog(`⚔️ Selesai: "${targetQuest.title}" (+${targetQuest.expReward} EXP, +${targetQuest.goldReward} Gold, ${targetQuest.statReward})!`, 'quest_complete');
      if (!isLeveledUp) {
        setActiveToast({
          id: targetQuest.id,
          title: 'MISI SELESAI! 🎉',
          type: 'success',
          message: `Menyelesaikan satu misi! +${targetQuest.expReward} EXP dan +${targetQuest.goldReward} Gold telah diklaim.`
        });
      }
    } else {
      addLog(`↩️ Dibatalkan: Misi "${targetQuest.title}" dikembalikan ke Papan Misi harian.`, 'system');
    }
  };

  // Action: Trigger Trial Penalty Quiz instead of immediate penalty
  const handleApplyPenalty = (id: string) => {
    const targetQuest = quests.find(q => q.id === id);
    if (!targetQuest) return;

    playSynthSound('click');
    setPenaltyQuizQuest(targetQuest);
    setIsPenaltyQuizOpen(true);
  };

  // Finalize the quiz results and apply score-based penalty
  const handleCompletePenaltyQuiz = (score: number) => {
    if (!penaltyQuizQuest) return;

    const targetQuest = penaltyQuizQuest;
    const hpLossBase = targetQuest.difficulty === 'hard' ? 30 : targetQuest.difficulty === 'medium' ? 20 : 10;
    const goldLossBase = targetQuest.difficulty === 'hard' ? 15 : targetQuest.difficulty === 'medium' ? 10 : 5;

    // Multipliers:
    // 5/5: 0% penalty
    // 3-4/5: 50% penalty
    // 0-2/5: 100% penalty
    let penaltyMultiplier = 1;
    if (score === 5) {
      penaltyMultiplier = 0;
    } else if (score >= 3) {
      penaltyMultiplier = 0.5;
    }

    const hpLoss = Math.ceil(hpLossBase * penaltyMultiplier);
    const goldLoss = Math.ceil(goldLossBase * penaltyMultiplier);

    setCharacter(prevChar => {
      const currentMax = prevChar.maxHp || 100;
      const nextHp = Math.max(0, (prevChar.hp || 100) - hpLoss);
      const nextGold = Math.max(0, prevChar.gold - goldLoss);

      let finalHp = nextHp;
      let finalGold = nextGold;

      // If HP reaches 0, faint mechanics!
      if (nextHp === 0 && hpLoss > 0) {
        finalHp = Math.floor(currentMax * 0.5); // revive at 50% HP
        finalGold = Math.max(0, prevChar.gold - 30); // additional penalty
        setTimeout(() => {
          alert(`💀 ${prevChar.name} pingsan karena terlalu banyak misi terlambat/gagal! Menginap darurat di Inn untuk memulihkan diri harian, kehilangan biaya tambahan 30 Gold.`);
        }, 100);
      }

      return {
        ...prevChar,
        hp: finalHp,
        gold: finalGold,
        maxHp: currentMax
      };
    });

    setQuests(prev => prev.map(q => {
      if (q.id === targetQuest.id) {
        return { ...q, penalized: true };
      }
      return q;
    }));

    if (score === 5) {
      addLog(`😇 AMPUNAN DEWA: Menjawab 5/5 dalam Trial! Bebas denda HP & Gold untuk misi "${targetQuest.title}"! ✨`, 'quest_complete');
    } else if (score >= 3) {
      addLog(`⚠️ DENDA REDUKSI: Berhasil menjawab ${score}/5 soal! Kehilangan dikurangi 50%: -${hpLoss} HP dan -${goldLoss} Gold untuk misi "${targetQuest.title}"!`, 'system');
    } else {
      addLog(`💀 DENDA PENUH: Menjawab ${score}/5 soal! Kehilangan penuh -${hpLoss} HP dan -${goldLoss} Gold untuk misi "${targetQuest.title}"!`, 'system');
    }

    setIsPenaltyQuizOpen(false);
    setPenaltyQuizQuest(null);
  };

  // Action: Add New Quest
  const handleAddNewQuest = (
    title: string, 
    category: 'combat' | 'magic' | 'vitality' | 'stealth', 
    difficulty: 'easy' | 'medium' | 'hard', 
    time: string,
    startTime?: string,
    deadline?: string
  ) => {
    let expReward = 50;
    let goldReward = 10;
    let statRewardStr = '';

    if (difficulty === 'medium') {
      expReward = 100;
      goldReward = 25;
    } else if (difficulty === 'hard') {
      expReward = 180;
      goldReward = 50;
    }

    const statKey = category === 'combat' ? 'STR' 
                  : category === 'magic' ? 'INT' 
                  : category === 'vitality' ? 'CON' 
                  : 'DEX';
    
    const points = difficulty === 'hard' ? 3 : difficulty === 'medium' ? 2 : 1;
    statRewardStr = `${statKey} +${points}`;

    let computedTime = time || 'Sepanjang hari';
    if (startTime && deadline) {
      computedTime = `${startTime} - ${deadline}${time ? ` (${time})` : ''}`;
    } else if (startTime) {
      computedTime = `Mulai: ${startTime}${time ? ` (${time})` : ''}`;
    } else if (deadline) {
      computedTime = `Hingga: ${deadline}${time ? ` (${time})` : ''}`;
    }

    const newQuest: Quest = {
      id: `quest-${Date.now()}`,
      title,
      category,
      difficulty,
      time: computedTime,
      startTime: startTime || undefined,
      deadline: deadline || undefined,
      completed: false,
      penalized: false,
      expReward,
      goldReward,
      statReward: statRewardStr
    };

    setQuests(prev => [...prev, newQuest]);
    addLog(`📜 Misi Terdaftar: "${title}" telah dipaku di Papan Misi.`, 'quest_create');
  };

  // Action: Delete Quest
  const handleClearQuest = (id: string) => {
    const target = quests.find(q => q.id === id);
    if (!target) return;
    
    playSynthSound('delete');
    setQuests(prev => prev.filter(q => q.id !== id));
    addLog(`🗑️ Misi dihapus: "${target.title}" dilepas dari papan.`, 'quest_deleted');
  };

  // Action: Choose RPG class
  const selectRole = (role: Character['role']) => {
    playSynthSound('click');
    const initialStats = {
      fighter: { str: 14, int: 7, dex: 9, con: 12 },
      wizard: { str: 6, int: 15, dex: 9, con: 8 },
      rogue: { str: 9, int: 10, dex: 14, con: 9 },
      cleric: { str: 10, int: 9, dex: 8, con: 15 },
    };

    setCharacter(prev => ({
      ...prev,
      role,
      stats: { ...initialStats[role] }
    }));

    addLog(`🌿 Ganti Kelas: Memilih jalan sebagai [${getRoleName(role)}]! Atribut bawaan telah disesuaikan.`, 'system');
    setRoleSelectorOpen(false);
  };

  // Action: Reset Adventure State
  const handleResetAdventure = () => {
    playSynthSound('click');
    setIsResetConfirmOpen(true);
  };

  // Action: Confirm and execute reset
  const executeResetAdventure = () => {
    playSynthSound('fail');
    localStorage.removeItem('rpg_character_state');
    localStorage.removeItem('rpg_quests_list');
    localStorage.removeItem('rpg_adventure_logs');
    localStorage.removeItem('rpg_quests_history');
    localStorage.removeItem('rpg_daily_quiz_count');
    localStorage.removeItem('rpg_daily_quiz_date');
    
    setDailyQuizCount(0);
    setHistory([]);
    playedAlarmsRef.current = new Set();
    playedStartsRef.current = new Set();
    setCharacter({
      name: 'Satria Pemula',
      role: 'fighter',
      level: 1,
      exp: 0,
      gold: 50,
      stats: {
        str: 14,
        int: 7,
        dex: 9,
        con: 12
      },
      streak: 1,
      questsCompleted: 0
    });
    setQuests([]);
    setUnlockedSkills([]);
    localStorage.removeItem('rpg_unlocked_skills');
    setLogs([
      {
        id: `init-${Date.now()}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        message: '🧭 Petualangan barumu dimulai kembali dengan batu lembaran baru!',
        type: 'system'
      }
    ]);
    setIsResetConfirmOpen(false);
  };

  // Action: Unlock a skill in the Skill Tree
  const handleUnlockSkill = (skillId: string, cost: number, bonusStat: string, bonusValue: number) => {
    setCharacter(prev => {
      const nextGold = prev.gold - cost;
      const nextStats = { ...prev.stats };
      let nextMaxHp = prev.maxHp;
      let nextHp = prev.hp;

      if (bonusStat === 'maxHp') {
        nextMaxHp += bonusValue;
        nextHp += bonusValue;
      } else if (bonusStat === 'str') {
        nextStats.str += bonusValue;
      } else if (bonusStat === 'int') {
        nextStats.int += bonusValue;
      } else if (bonusStat === 'dex') {
        nextStats.dex += bonusValue;
      } else if (bonusStat === 'con') {
        nextStats.con += bonusValue;
      }

      return {
        ...prev,
        gold: nextGold,
        maxHp: nextMaxHp,
        hp: Math.min(nextMaxHp, nextHp),
        stats: nextStats
      };
    });

    setUnlockedSkills(prev => [...prev, skillId]);

    const skillNode = SKILL_TREE_DATA.find(node => node.id === skillId);
    const skillName = skillNode ? skillNode.name : 'Keahlian Baru';
    addLog(`🌲 Keahlian Baru Dibuka: Anda berhasil melatih perk "${skillName}"! Bonus ${bonusStat.toUpperCase()} +${bonusValue} permanen diperoleh!`, 'level_up');
  };

  // Action: Clear and Manage Historical Records
  const handleClearHistory = () => {
    setHistory([]);
    addLog("🧹 Kitab sejarah petualangan dibersihkan sepenuhnya.", "system");
  };

  const handleRemoveHistoryItem = (itemId: string) => {
    setHistory(prev => prev.filter(item => item.id !== itemId));
  };

  // Utility Role Name helpers
  const getRoleName = (role: Character['role']) => {
    switch(role) {
      case 'fighter': return 'Knight (Ksatria)';
      case 'wizard': return 'Mage (Penyihir)';
      case 'rogue': return 'Rogue (Pencuri)';
      case 'cleric': return 'Cleric (Pendeta)';
    }
  };

  const getRoleIcon = (role: Character['role'], sizeClass = "w-6 h-6") => {
    switch(role) {
      case 'fighter': return <Sword className={`${sizeClass} text-rose-600`} id="icon-fighter" />;
      case 'wizard': return <Sparkles className={`${sizeClass} text-violet-600`} id="icon-wizard" />;
      case 'rogue': return <Compass className={`${sizeClass} text-amber-600`} id="icon-rogue" />;
      case 'cleric': return <Shield className={`${sizeClass} text-emerald-600`} id="icon-cleric" />;
    }
  };

  const getRoleTheme = (role: Character['role']) => {
    switch(role) {
      case 'fighter': return {
        primary: 'bg-[#fff5f5] border-[#e2a0a0]',
        badge: 'bg-[#ffe3e3] text-[#a94442] border-[#e2a0a0]',
        text: 'text-[#a94442]'
      };
      case 'wizard': return {
        primary: 'bg-[#fcf8e3] border-[#faebcc]',
        badge: 'bg-[#fcf8e3] text-[#8a6d3b] border-[#faebcc]',
        text: 'text-[#8a6d3b]'
      };
      case 'rogue': return {
        primary: 'bg-[#fbf5ee] border-[#dfc3a7]',
        badge: 'bg-[#fbf5ee] text-[#8a5d3b] border-[#dfc3a7]',
        text: 'text-[#8a5d3b]'
      };
      case 'cleric': return {
        primary: 'bg-[#f4fbf7] border-[#cceedd]',
        badge: 'bg-[#e6f7ed] text-[#3c763d] border-[#cceedd]',
        text: 'text-[#3c763d]'
      };
    }
  };

  // Quests filtered
  const filteredQuests = quests.filter(q => {
    if (filter === 'active') return !q.completed;
    if (filter === 'completed') return q.completed;
    return true;
  });

  const percentExp = Math.min(100, Math.floor((character.exp / getRequiredExp(character.level)) * 100));

  return (
    <div className="min-h-screen text-[#5d4037] font-sans pb-16 selection:bg-[#8b5e34] selection:text-white relative bg-[#f8f1e5]" id="rpg-app-root">
      
      {/* Toast Alert Popups */}
      <AnimatePresence>
        {activeToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white border-4 border-[#8b5e34] rounded-2xl p-4 shadow-[4px_4px_0_0_#8b5e34] font-serif"
            id="rpg-toast-alert"
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-xl border-2 shrink-0 ${
                activeToast.type === 'start'
                  ? 'bg-green-600 border-[#3d5a2a] text-white' 
                  : activeToast.type === 'success'
                  ? 'bg-[#10b981] border-[#047857] text-white'
                  : 'bg-red-600 border-[#851d1d] text-white'
              }`}>
                {activeToast.type === 'start' ? (
                  <Sparkles className="w-5 h-5 animate-pulse" />
                ) : activeToast.type === 'success' ? (
                  <Check className="w-5 h-5 stroke-[3px]" />
                ) : (
                  <AlertTriangle className="w-5 h-5 animate-bounce" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold uppercase text-[10px] tracking-wider text-[#5d4037]">
                    {activeToast.type === 'start' 
                      ? '🔔 MISI DI-ALARM' 
                      : activeToast.type === 'success'
                      ? '🏆 MISI SELESAI'
                      : '🚨 JADWAL TERLEWAT'}
                  </h4>
                  <button 
                    onClick={() => setActiveToast(null)}
                    className="text-stone-400 hover:text-stone-700 text-xs font-mono font-bold px-1 transition-colors"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-xs font-black text-[#5d4037] mt-1 leading-snug break-words">
                  {activeToast.title}
                </p>
                <p className="text-[11px] text-[#8b5e34] mt-1 leading-tight font-sans">
                  {activeToast.message}
                </p>
              </div>
            </div>
            {activeToast.type === 'start' && (
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => {
                    playSynthSound('quest_complete');
                    toggleQuest(activeToast.id);
                    setActiveToast(null);
                  }}
                  className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white border-2 border-[#3d5a2a] rounded-lg font-mono font-black text-[10px] uppercase shadow-[1px_1px_0_0_#3d5a2a] active:translate-y-0.5 transition-all cursor-pointer"
                >
                  🚀 Klaim EXP Sekarang
                </button>
              </div>
            )}
            {activeToast.type === 'lapse' && (
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => {
                    playSynthSound('click');
                    const targetQuest = quests.find(q => q.id === activeToast.id);
                    if (targetQuest) {
                      setPenaltyQuizQuest(targetQuest);
                      setIsPenaltyQuizOpen(true);
                    }
                    setActiveToast(null);
                  }}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white border-2 border-[#851d1d] rounded-lg font-mono font-black text-[10px] uppercase shadow-[1px_1px_0_0_#851d1d] active:translate-y-0.5 transition-all cursor-pointer"
                >
                  ⚖️ Jalani Trial Penalti
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Immersive Fantasy Blurred Background Image */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none bg-cover bg-center select-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1519074069444-1ba4e6664104?q=80&w=1920&auto=format&fit=crop')`,
        }}
        id="fantasy-bg-overlay"
      >
        {/* Soft blur and cozy amber/parchment tint overlay */}
        <div className="absolute inset-0 bg-[#fffdf5]/80 backdrop-blur-[6px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#fbf8f3]/60 to-[#f8f1e5]/90" />
        
        {/* Colorful floating sparkles and retro magical assets */}
        <AmbientBackgroundAnimation />
      </div>

      <div className="relative z-10">
        {/* Top thin aesthetic wooden color bar */}
        <div className="h-2 bg-[#8b5e34] w-full" />
      
      {/* Top Header Navbar */}
      <header className="border-b-4 border-[#8b5e34] bg-[#fffcf5] text-[#5d4037] shadow-[0_4px_0_0_#d4a373] px-4 md:px-8 py-3 sticky top-0 z-40 navbar" id="top-navbar">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#8b5e34] text-white p-2 rounded-xl border-2 border-[#5d4037] shadow-[2px_2px_0_0_#5d4037]">
              <Scroll className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h1 className="font-serif text-xl md:text-2xl font-black tracking-wider uppercase text-[#5d4037]">
                Daily Quest Board
              </h1>
              <p className="text-[10px] text-[#8b5e34] uppercase font-mono tracking-widest font-bold">
                Level-up Your Life • Gamified RPG Tracker
              </p>
            </div>
          </div>

          {/* Live RPG Clock Widget */}
          <div className="bg-[#ebdcb9]/30 border-2 border-[#8b5e34] px-4 py-1.5 rounded-2xl shadow-[2px_2px_0_0_#8b5e34] flex items-center gap-3 text-[#5d4037] font-mono" id="rpg-live-clock">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
              <span className="text-[9px] md:text-[10px] font-black text-[#8b5e34] uppercase tracking-wider">JAM PETUALANG:</span>
            </div>
            <div className="flex items-center gap-1.5 font-bold text-xs md:text-sm">
              <span className="bg-white border border-[#8b5e34]/30 px-2 py-0.5 rounded-lg shadow-sm font-black text-[#5d4037]">
                {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <span className="text-[10px] text-[#8b5e34] font-black uppercase">
                {currentTime.toLocaleDateString('id-ID', { weekday: 'short', day: '2-digit', month: 'short' })}
              </span>
            </div>
          </div>

          {/* Sound, Resets, Config controls */}
          <div className="flex items-center gap-2.5">
            {/* NEW HIGHLY ATTRACTIVE EXP TRIVIA QUIZ BUTTON */}
            <button
              onClick={() => {
                playSynthSound('click');
                setIsDailyExpQuizOpen(true);
              }}
              className="px-3 md:px-4 py-2 text-xs border-2 border-[#1a331a] bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono font-black rounded-xl shadow-[2px_2px_0_0_#1a331a] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer relative overflow-hidden animate-pulse"
              title="Uji Pengetahuan Akademik & Menangkan Tambahan EXP (+50 EXP / Soal)!"
              id="header-daily-exp-quiz-btn"
            >
              <Brain className="w-4 h-4 text-yellow-300 fill-yellow-300 shrink-0" />
              <span className="hidden sm:inline">KUIS BONUS EXP</span>
              <span className="sm:hidden">🧠 KUIS</span>
              <span className="bg-amber-400 text-stone-950 text-[10px] rounded-full px-2 py-0.5 leading-none border border-[#8b5e34] font-black shadow-sm">
                {5 - dailyQuizCount}
              </span>
            </button>

            <button 
              onClick={() => { playSynthSound('click'); setHasAdventureStarted(false); }}
              className="px-3.5 py-2 text-xs border-2 border-[#8b5e34] bg-amber-400 hover:bg-amber-300 text-stone-900 font-mono font-black rounded-xl shadow-[2px_2px_0_0_#8b5e34] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
              title="Kembali ke Layar Peluncur / Welcome"
              id="back-to-launcher-btn"
            >
              <DoorOpen className="w-3.5 h-3.5" /> GERBANG UTAMA
            </button>

            <div className="flex items-center">
              <button 
                type="button"
                onClick={() => { playSynthSound('click'); setSoundEnabled(!soundEnabled); }}
                className={`p-2.5 rounded-l-xl border-2 border-r-0 transition-all cursor-pointer ${
                  soundEnabled 
                    ? 'border-[#8b5e34] bg-[#ffd700] text-[#5d4037] shadow-[2px_2px_0_0_#8b5e34] hover:bg-[#ffe040]' 
                    : 'border-[#8b5e34] bg-[#e2d6c3] text-[#8b5e34] shadow-[2px_2px_0_0_#8b5e34] hover:bg-[#d8c8b0]'
                }`}
                title={soundEnabled ? "Mute Master Audio" : "Unmute Master Audio"}
                id="sound-toggle-btn"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-[#5d4037]" /> : <VolumeX className="w-4 h-4 text-[#8b5e34]" />}
              </button>
              <button 
                type="button"
                onClick={() => { playSynthSound('click'); setIsSoundSettingsOpen(true); }}
                className="p-2.5 rounded-r-xl border-2 bg-[#fffdfa] hover:bg-amber-50 text-[#8b5e34] border-[#8b5e34] shadow-[2px_2px_0_0_#8b5e34] hover:shadow-md cursor-pointer transition-all"
                title="Konfigurasi Detail Efek Suara (Individual)"
                id="sound-settings-cfg-btn"
              >
                ⚙️
              </button>
            </div>

            <button
              onClick={handleResetAdventure}
              className="px-4 py-2 text-xs border-2 border-[#8b5e34] bg-red-100 hover:bg-red-200 text-red-800 font-mono font-black rounded-xl shadow-[2px_2px_0_0_#8b5e34] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-1 cursor-pointer"
              title="Mulai Ulang Petualangan"
              id="reset-adventure-btn"
            >
              RESET 💀
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid App Setup */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 mt-8 space-y-6" id="main-content">
        
        {/* CHARACTER PROFILE AREA */}
        <section 
          className="border-4 border-[#8b5e34] rounded-[2rem] p-6 shadow-[0_8px_0_0_#d4a373] relative overflow-hidden text-[#5d4037] bg-cover bg-center"
          style={{
            backgroundImage: `url('https://i.pinimg.com/originals/e2/a6/f8/e2a6f87f8fe30760d63761171cebb959.jpg')`
          }}
          id="character-hub-section"
        >
          {/* Cozy castle soft overlay for readability */}
          <div className="absolute inset-0 bg-[#fffef4]/80 backdrop-blur-[1px] z-0 pointer-events-none" />

          {/* Wooden texture subtle background */}
          <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none select-none text-9xl font-black z-0">
            ⚔️
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
            
            {/* AVATAR COLUMN */}
            <div className="flex flex-col items-center">
              <div 
                onClick={() => { playSynthSound('click'); setRoleSelectorOpen(true); }}
                className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-[#ffd700] p-1 border-4 border-[#8b5e34] hover:border-[#5d4037] cursor-pointer shadow-[4px_4px_0_0_#8b5e34] transition-all hover:scale-105 flex items-center justify-center relative group"
                id="avatar-frame"
                title="Ganti Kelas Petualang"
              >
                <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center relative shadow-inner animate-pulse-gold">
                  {getRoleIcon(character.role, "w-10 h-10")}
                </div>
                {/* Level Tag */}
                <div className="absolute -bottom-2 -right-1 bg-[#ffd700] text-[#5d4037] font-mono font-black text-xs px-2.5 py-0.5 rounded-full border-2 border-[#8b5e34] shadow-[2px_2px_0_0_#8b5e34] flex items-center gap-0.5">
                  <span>Lv.</span>
                  <span className="text-sm font-black">{character.level}</span>
                </div>
              </div>
              
              <button 
                onClick={() => { playSynthSound('click'); setRoleSelectorOpen(true); }}
                className="mt-4 px-2.5 py-1 bg-white border-2 border-[#8b5e34] rounded-lg text-[9px] font-black text-[#8b5e34] uppercase tracking-wider hover:bg-[#e2d6c3]/30 transition-colors cursor-pointer"
                id="change-class-indicator-btn"
              >
                Ganti Kelas 🛡️
              </button>
            </div>

            {/* SUMMARY STATS COLUMN */}
            <div className="flex-1 space-y-4 w-full">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b-2 border-dashed border-[#8b5e34]/15 pb-4">
                
                {/* Name area */}
                <div className="text-center md:text-left">
                  {editingName ? (
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <input 
                        type="text" 
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        className="bg-white border-2 border-[#8b5e34] text-xs font-black px-2 py-1 rounded focus:outline-none text-[#5d4037]"
                        maxLength={20}
                        id="editing-name-input"
                        autoFocus
                      />
                      <button 
                        onClick={() => {
                          playSynthSound('click');
                          setCharacter(prev => ({ ...prev, name: tempName.trim() || prev.name }));
                          setEditingName(false);
                          addLog(`✏️ Mengganti nama petualang menjadi: "${tempName.trim() || character.name}"`, 'system');
                        }}
                        className="bg-emerald-600 border border-[#8b5e34] text-white px-2 py-1 rounded text-[10px] font-black cursor-pointer"
                        id="save-name-btn"
                      >
                        Simpan
                      </button>
                      <button 
                        onClick={() => { playSynthSound('click'); setEditingName(false); }}
                        className="bg-stone-200 border border-[#8b5e34] text-stone-700 px-2 py-1 rounded text-[10px] font-black cursor-pointer"
                        id="cancel-name-btn"
                      >
                        Batal
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                      <h2 
                        onClick={() => { setTempName(character.name); setEditingName(true); playSynthSound('click'); }}
                        className="font-serif text-xl md:text-3xl font-black text-[#5d4037] hover:text-[#8b5e34] cursor-pointer underline decoration-dotted decoration-[#8b5e34]/30"
                        title="Klik untuk mengubah nama petualang Anda"
                        id="character-name-display"
                      >
                        {character.name}
                      </h2>
                      <span className="text-[10px] md:text-xs font-mono font-black tracking-widest uppercase px-2.5 py-1 rounded-lg border-2 bg-yellow-105 text-[#8b5e34] border-[#8b5e34] shadow-[1px_1px_0_0_#8b5e34]">
                        {getRoleName(character.role)}
                      </span>
                    </div>
                  )}
                  <p className="text-[10px] text-[#8b5e34] uppercase font-mono tracking-widest pt-1 mt-0.5 font-bold">
                    🏷️ klik nama untuk kustomisasi kemauan Anda
                  </p>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <div className="flex items-center gap-1.5 bg-purple-50 text-purple-800 border-2 border-purple-200 px-3.5 py-1.5 rounded-xl font-bold text-xs shadow-[1px_1px_0_0_#e2d6c3]">
                    <Trophy className="w-4 h-4 text-purple-700 animate-bounce" />
                    <span>Misi Selesai:</span>
                    <span className="font-mono text-sm font-black text-purple-900">{character.questsCompleted}</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 bg-yellow-50 text-amber-800 border-2 border-[#ffd700] px-3.5 py-1.5 rounded-xl font-bold text-xs shadow-[1px_1px_0_0_#e2d6c3]">
                    <Coins className="w-4 h-4 text-amber-600" />
                    <span>Emas:</span>
                    <span className="font-mono text-sm font-black text-amber-900">{character.gold}</span>
                    <div className="w-3 h-3 bg-[#ffd700] rounded-full border border-amber-600"></div>
                  </div>

                  <div className="flex items-center gap-1 bg-blue-50 text-blue-800 border-2 border-blue-200 px-3.5 py-1.5 rounded-xl font-bold text-xs italic shadow-[1px_1px_0_0_#e2d6c3]">
                    <Award className="w-4 h-4 text-blue-600" />
                    <span>Gelar:</span>
                    <span className="text-blue-900 font-bold">
                      {character.level >= 10 ? 'Prajurit Utama' : character.level >= 5 ? 'Penjelajah Pagi' : 'Petualang Pemula'}
                    </span>
                  </div>
                </div>

              </div>

              {/* HP (HEALTH POINTS) GAUGE */}
              <div className="space-y-1.5 pb-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-rose-700 font-black flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" /> HP (NYAWA KEHIDUPAN)
                  </span>
                  <div className="flex items-center gap-2">
                    {character.hp < character.maxHp && (
                      <button
                        onClick={() => {
                          if (character.gold < 25) {
                            alert("Keping Emas Anda tidak cukup untuk tidur di Penginapan! (Butuh 25 Gold 🪙)");
                            return;
                          }
                          playSynthSound('levelup');
                          setCharacter(prev => ({
                            ...prev,
                            gold: prev.gold - 25,
                            hp: prev.maxHp
                          }));
                          addLog(`🛌 Menginap di Penginapan: -25 Gold. Nyawa pulih sepenuhnya (HP ${character.maxHp}/${character.maxHp})!`, 'system');
                        }}
                        className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 border-2 border-rose-800 text-white font-mono font-black text-[9px] rounded-lg transition-all cursor-pointer shadow-[1px_1px_0_0_#8b5e34] active:translate-y-[1px] active:shadow-none"
                        title="Tidur di Penginapan (Inn) seharga 25 Gold untuk memulihkan seluruh HP!"
                        id="rest-at-inn-btn"
                      >
                        🛌 TIDUR DI INN (-25🪙)
                      </button>
                    )}
                    <span className="text-[#5d4037] font-black">
                      {character.hp} / {character.maxHp} HP
                    </span>
                  </div>
                </div>
                <div className="w-full h-7 bg-[#e2d6c3] border-2 border-[#8b5e34] rounded-full overflow-hidden relative shadow-inner p-0.5">
                  <div 
                    className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-rose-400 rounded-full shadow-[inset_0_-4px_0_rgba(0,0,0,0.15)] transition-all duration-300 ease-out" 
                    style={{ width: `${Math.min(100, Math.floor((character.hp / character.maxHp) * 100))}%` }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,0.8)] uppercase tracking-widest pointer-events-none">
                    KESEHATAN NYAWA: {character.hp} / {character.maxHp}
                  </span>
                </div>
              </div>

              {/* EXP PROGRESS BAR */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#8b5e34] font-black flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-blue-500 animate-pulse" /> EXP (EXPERIENCE POINTS)
                  </span>
                  <span className="text-[#5d4037] font-black">
                    {character.exp} / {getRequiredExp(character.level)} EXP
                  </span>
                </div>
                <div className="w-full h-7 bg-[#e2d6c3] border-2 border-[#8b5e34] rounded-full overflow-hidden relative shadow-inner p-0.5">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 rounded-full shadow-[inset_0_-4px_0_rgba(0,0,0,0.15)] transition-all duration-500 ease-out" 
                    style={{ width: `${percentExp}%` }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-[#5d4037] uppercase tracking-widest pointer-events-none">
                    {percentExp}% PETUALANGAN
                  </span>
                </div>
              </div>

            </div>

            {/* RPG STATS COLUMN */}
            <div className="border-t-2 md:border-t-0 md:border-l-2 border-[#e2d6c3] pt-4 md:pt-0 md:pl-6 w-full md:w-64">
              <p className="text-[10px] uppercase font-mono tracking-widest text-[#8b5e34] mb-2.5 font-black select-none text-center md:text-left">
                Statistik Atribut RPG
              </p>
              <div className="grid grid-cols-2 gap-3 pb-1">
                
                {/* STR */}
                <div className="bg-gradient-to-br from-[#fff1f2] to-[#ffe4e6] border-2 border-rose-450 p-2.5 rounded-2xl flex items-center gap-2 shadow-[3px_3px_0_0_#fda4af] hover:scale-105 transition-all">
                  <div className="p-1 px-1.5 bg-rose-600 text-white rounded font-mono font-black text-[9px] select-none text-center">
                    STR
                  </div>
                  <div className="leading-tight">
                    <span className="block text-[8px] text-rose-800 uppercase font-mono font-bold">Kekuatan</span>
                    <strong className="text-sm font-mono font-black text-rose-950">{character.stats.str}</strong>
                  </div>
                </div>

                {/* INT */}
                <div className="bg-gradient-to-br from-[#f5f3ff] to-[#f3e8ff] border-2 border-violet-450 p-2.5 rounded-2xl flex items-center gap-2 shadow-[3px_3px_0_0_#ddd6fe] hover:scale-105 transition-all">
                  <div className="p-1 px-1.5 bg-violet-600 text-white rounded font-mono font-black text-[9px] select-none text-center">
                    INT
                  </div>
                  <div className="leading-tight">
                    <span className="block text-[8px] text-purple-800 uppercase font-mono font-bold">Pintar</span>
                    <strong className="text-sm font-mono font-black text-purple-950">{character.stats.int}</strong>
                  </div>
                </div>

                {/* DEX */}
                <div className="bg-gradient-to-br from-[#fefce8] to-[#fef9c3] border-2 border-amber-500 p-2.5 rounded-2xl flex items-center gap-2 shadow-[3px_3px_0_0_#fef08a] hover:scale-105 transition-all">
                  <div className="p-1 px-1.5 bg-amber-500 text-white rounded font-mono font-black text-[9px] select-none text-center">
                    DEX
                  </div>
                  <div className="leading-tight">
                    <span className="block text-[8px] text-amber-900 uppercase font-mono font-bold">Lincah</span>
                    <strong className="text-sm font-mono font-black text-amber-950">{character.stats.dex}</strong>
                  </div>
                </div>

                {/* CON */}
                <div className="bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7] border-2 border-emerald-450 p-2.5 rounded-2xl flex items-center gap-2 shadow-[3px_3px_0_0_#a7f3d0] hover:scale-105 transition-all">
                  <div className="p-1 px-1.5 bg-emerald-600 text-white rounded font-mono font-black text-[9px] select-none text-center">
                    CON
                  </div>
                  <div className="leading-tight">
                    <span className="block text-[8px] text-emerald-800 uppercase font-mono font-bold">Stamina</span>
                    <strong className="text-sm font-mono font-black text-emerald-950">{character.stats.con}</strong>
                  </div>
                </div>

              </div>

              {/* Skill Tree Upgrade Button */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => {
                    playSynthSound('click');
                    setIsSkillTreeOpen(true);
                  }}
                  className="w-full h-10 px-3 py-2 text-xs border-2 border-[#5d4037] bg-gradient-to-r from-amber-600 via-amber-550 to-amber-600 hover:from-amber-700 hover:to-amber-700 text-white font-serif font-black rounded-xl shadow-[3px_3px_0_0_#5d4037] hover:shadow-md hover:scale-[1.02] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2"
                  title="Gunakan emas untuk membuka bonus status permanen!"
                  id="open-skilltree-btn"
                >
                  <span className="text-sm">🌲</span> POHON KEAHLIAN (+STAT)
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* LAYOUT WITH FULL FOCUS ON ACTIVE QUESTS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="layout-grid">
          
          {/* COLUMN 1: QUEST BOARD & ACTIVITY TIMELINE - COMPACT SINGLE-VIEW CONSTRAINED FOCUS */}
          <div className="lg:col-span-12 flex flex-col space-y-6" id="column-board">
            
            {/* Small persistent notes / sticky focus reminders */}
            <StickyNote />

            {/* Wooden Scroll Board Frame */}
            <div className="bg-[#fffdfa] border-4 border-[#8b5e34] rounded-3xl shadow-[0_8px_0_0_#d4a373] overflow-hidden">
              <div className="bg-white rounded-2xl border-2 border-dashed border-[#8b5e34]/30 overflow-hidden">
                
                {/* Header Board section */}
                <div className="bg-[#fff9e6] border-b-4 border-[#8b5e34] px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <Scroll className="w-5 h-5 text-[#8b5e34]" />
                    <div>
                      <h3 className="font-serif text-lg md:text-xl font-black tracking-wider text-[#5d4037] uppercase">
                        📋 PAPAN MISI PETUALANG
                      </h3>
                      <p className="text-[10px] text-[#8b5e34] uppercase font-mono tracking-widest pt-0.5 font-bold">
                        Klik Misi yang Selesai untuk Menuntut Imbalan!
                      </p>
                    </div>
                  </div>

                  {/* Quest Actions & Filters Group */}
                  <div className="flex items-center gap-3 flex-wrap">
                    {/* TRIGGER MODAL BUTTON: PAPAN TULIS MISI BARU */}
                    <button
                      onClick={() => {
                        playSynthSound('click');
                        setIsQuestFormOpen(true);
                      }}
                      className="flex items-center gap-2 h-10 px-4 py-2 text-xs border-2 border-[#5d4037] bg-[#8b5e34] hover:bg-[#7a512d] text-white font-serif font-black rounded-xl shadow-[3px_3px_0_0_#5d4037] hover:shadow-md hover:scale-[1.03] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer animate-bounce-subtle"
                      title="Klik untuk membuka papan tulis dan merancang misi harian Anda!"
                      id="trigger-add-quest-modal-btn"
                    >
                      <Plus className="w-4 h-4 text-amber-300 pointer-events-none stroke-[3]" />
                      <span>TULIS MISI BARU</span>
                    </button>

                    {/* Quest Filters */}
                    <div className="flex items-center bg-[#fffcf5] p-1 rounded-xl border-2 border-[#8b5e34] text-xs font-serif font-black h-10 overflow-x-auto whitespace-nowrap shadow-[2px_2px_0_0_#8b5e34]">
                    <button 
                      onClick={() => { playSynthSound('click'); setFilter('all'); }}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                        filter === 'all' 
                          ? 'bg-[#8b5e34] text-white' 
                          : 'text-[#8b5e34] hover:bg-stone-100'
                      }`}
                      id="filter-all"
                    >
                      Semua ({quests.length})
                    </button>
                    <button 
                      onClick={() => { playSynthSound('click'); setFilter('active'); }}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                        filter === 'active' 
                          ? 'bg-[#8b5e34] text-white' 
                          : 'text-[#8b5e34] hover:bg-stone-100'
                      }`}
                      id="filter-active"
                    >
                      Aktif ({quests.filter(q => !q.completed).length})
                    </button>
                    <button 
                      onClick={() => { playSynthSound('click'); setFilter('completed'); }}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                        filter === 'completed' 
                          ? 'bg-[#8b5e34] text-white' 
                          : 'text-[#8b5e34] hover:bg-stone-100'
                      }`}
                      id="filter-completed"
                    >
                      Selesai ({quests.filter(q => q.completed).length})
                    </button>
                  </div>
                  </div>
                </div>

                {/* Quest List Box (Bento themed Cards) */}
                <div className="p-6 bg-[#fbf8f3] space-y-4" id="quests-container">
                  <AnimatePresence initial={false}>
                    {filteredQuests.length === 0 ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-12 px-4 rounded-3xl border-4 border-dashed border-[#8b5e34]/30 bg-[#fffcf5] space-y-3"
                      >
                        <HelpCircle className="w-12 h-12 text-[#8b5e34] mx-auto animate-bounce" />
                        <div className="space-y-1">
                          <p className="font-serif text-lg text-[#5d4037] font-black">Tidak ada Misi Tertulis</p>
                          <p className="text-xs text-[#8b5e34] max-w-sm mx-auto font-medium">
                            Saatnya membuat rencana misimu sendiri hari ini dengan menggunakan formulir "Papan Tulis Misi Baru" di sisi kanan!
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            playSynthSound('click');
                            setQuests(DEFAULT_QUESTS);
                            addLog(`🍂 Misi sampel dimasukkan kembali ke papan quest.`, 'system');
                          }}
                          className="px-4 py-2 bg-[#8b5e34] hover:bg-[#7a512d] text-xs text-white rounded-xl border-2 border-[#5d4037] shadow-[2px_2px_0_0_#5d4037] active:translate-y-[1px] transition-all font-serif font-black cursor-pointer"
                          id="load-sample-quests-btn"
                        >
                          Muat Ulang Misi Contoh
                        </button>
                      </motion.div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredQuests.map((quest) => (
                          <QuestCard 
                            key={quest.id}
                            quest={quest}
                            onToggle={toggleQuest}
                            onDelete={handleClearQuest}
                            playSynthSound={playSynthSound}
                            currentTime={currentTime}
                            onApplyPenalty={handleApplyPenalty}
                          />
                        ))}
                      </div>
                    )}
                  </AnimatePresence>
                </div>

              </div>
            </div>

            {/* ADVENTURE LOG TIMELINE */}
            <AdventureLog logs={logs} />

          </div>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="max-w-6xl mx-auto px-4 md:px-8 mt-12 py-3 text-center space-y-1.5" id="footer-section">
        <div className="flex justify-between items-center text-[#8b5e34]/70">
          <div className="h-[2.5px] flex-grow bg-[#8b5e34]/30"></div>
          <div className="px-6 text-[10px] font-black tracking-[0.4em] uppercase text-center font-serif leading-none">
            ⚔️ Daily Quest Board • Dirancang untuk Petualang Sejati ⚔️
          </div>
          <div className="h-[2.5px] flex-grow bg-[#8b5e34]/30"></div>
        </div>
        <p className="text-[10px] text-[#8b5e34] font-mono font-bold pt-1">
          Teknologi Sound Chime disintesis secara dinamis langsung pada peramban Anda.
        </p>
      </footer>

      {/* Overlays */}
      <HistorySidebar 
        history={history}
        onClearHistory={handleClearHistory}
        onRemoveHistoryItem={handleRemoveHistoryItem}
        playSynthSound={playSynthSound}
        character={character}
        setCharacter={setCharacter}
        addLog={addLog}
      />

      <RoleSelector 
        isOpen={roleSelectorOpen}
        onClose={() => setRoleSelectorOpen(false)}
        onSelectRole={selectRole}
        playSynthSound={playSynthSound}
      />

      <LevelUpModal 
        isOpen={levelUpModalOpen}
        level={character.level}
        onClose={() => setLevelUpModalOpen(false)}
      />

      <PenaltyQuizModal
        isOpen={isPenaltyQuizOpen}
        questTitle={penaltyQuizQuest?.title || ''}
        questDifficulty={penaltyQuizQuest?.difficulty || 'easy'}
        onClose={() => {
          setIsPenaltyQuizOpen(false);
          setPenaltyQuizQuest(null);
        }}
        onCompleteQuiz={handleCompletePenaltyQuiz}
        playSynthSound={playSynthSound}
      />

      <DailyExpQuizModal
        isOpen={isDailyExpQuizOpen}
        onClose={() => setIsDailyExpQuizOpen(false)}
        dailyQuizCount={dailyQuizCount}
        setDailyQuizCount={setDailyQuizCount}
        playSynthSound={playSynthSound}
        onAwardExp={handleAwardExp}
        addLog={addLog}
      />

      {/* NEW RPG SKILL TREE LEVEL-UP BONUS MODAL */}
      <AnimatePresence>
        {isSkillTreeOpen && (
          <SkillTreeModal
            isOpen={isSkillTreeOpen}
            onClose={() => setIsSkillTreeOpen(false)}
            character={character}
            onUnlockSkill={handleUnlockSkill}
            unlockedSkills={unlockedSkills}
            playSynthSound={playSynthSound}
          />
        )}
      </AnimatePresence>

      {/* NEW SYNTHESIZER SOUND SETTINGS INDIVIDUAL SECTOR SELECTION MODAL */}
      <AnimatePresence>
        {isSoundSettingsOpen && (
          <SoundSettingsModal
            isOpen={isSoundSettingsOpen}
            onClose={() => setIsSoundSettingsOpen(false)}
            settings={soundSettings}
            onUpdateSettings={setSoundSettings}
            playSynthSound={playSynthSound}
          />
        )}
      </AnimatePresence>

      <QuestForm 
        isOpen={isQuestFormOpen}
        onClose={() => setIsQuestFormOpen(false)}
        onAddQuest={handleAddNewQuest}
        playSynthSound={playSynthSound}
      />

      {/* CUSTOM RETRO CONFIRM RESET DIALOG MODAL */}
      <AnimatePresence>
        {isResetConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#231d1a]/85 backdrop-blur-md" id="reset-confirm-overlay">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="w-full max-w-sm bg-[#fffaf5] border-4 border-red-750 p-6 rounded-3xl shadow-[0_8px_0_0_#991b1b] text-center space-y-5"
              id="reset-confirm-card"
            >
              <div className="mx-auto w-14 h-14 bg-red-100 border-2 border-red-600 rounded-2xl flex items-center justify-center text-red-600 animate-bounce mt-1">
                <AlertTriangle className="w-8 h-8 shrink-0 pointer-events-none" />
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-base md:text-lg font-black text-rose-900 uppercase tracking-wide">
                  ⚠️ RESET SELURUH GAME?
                </h3>
                <p className="text-xs text-stone-600 font-sans leading-relaxed">
                  Semua stats karakter, level, koin emas harian Anda, log penjelajahan, serta jatah kuis harian akan dibersihkan kembali ke awal mula!
                </p>
                <p className="text-[10px] font-mono font-bold text-red-600 bg-red-50 p-1.5 rounded-lg border border-red-200">
                  ⚠️ Tindakan ini bersifat permanen!
                </p>
              </div>

              <div className="flex gap-3 h-11 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    playSynthSound('click');
                    setIsResetConfirmOpen(false);
                  }}
                  className="w-1/2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-mono font-bold text-xs uppercase rounded-xl border-2 border-stone-300 transition-all cursor-pointer shadow-[0_2.5px_0_0_#ccc] active:translate-y-[1px] active:shadow-none"
                >
                  BATAL
                </button>
                <button
                  type="button"
                  onClick={executeResetAdventure}
                  className="w-1/2 bg-red-600 hover:bg-red-700 text-white font-mono font-black text-xs uppercase rounded-xl border-2 border-red-800 transition-all cursor-pointer shadow-[0_2.5px_0_0_#991b1b] active:translate-y-[1px] active:shadow-none"
                  id="confirm-reset-btn"
                >
                  YA, RESET! 💀
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      </div> {/* End .relative.z-10 */}

      <AnimatePresence>
        {!hasAdventureStarted && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.6, ease: 'easeInOut' } }}
            className="fixed inset-0"
            style={{ zIndex: 99999 }}
          >
            <GameLauncher 
              character={character} 
              setCharacter={setCharacter} 
              onStartAdventure={() => {
                setHasAdventureStarted(true);
                addLog(`⚔️ Gerbang petualangan terbuka! [${character.name}] melangkah gagah bersiap memaku quest!`, 'system');
              }} 
              playSynthSound={playSynthSound} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
