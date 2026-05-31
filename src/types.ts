export interface Quest {
  id: string;
  title: string;
  category: 'combat' | 'magic' | 'vitality' | 'stealth';
  difficulty: 'easy' | 'medium' | 'hard';
  time: string;
  startTime?: string; // 24-hour format like "08:00"
  deadline?: string; // 24-hour format like "18:00"
  completed: boolean;
  penalized?: boolean; // Whether failed-quest penalty was applied
  expReward: number;
  goldReward: number;
  statReward: string;
}

export interface Character {
  name: string;
  role: 'fighter' | 'wizard' | 'rogue' | 'cleric';
  level: number;
  exp: number;
  gold: number;
  hp: number;
  maxHp: number;
  stats: {
    str: number;
    int: number;
    dex: number;
    con: number;
  };
  streak: number;
  questsCompleted: number;
}

export interface LogEntry {
  id: string;
  time: string;
  message: string;
  type: 'quest_complete' | 'level_up' | 'quest_create' | 'system' | 'quest_deleted';
}

export interface HistoryItem {
  id: string;
  questId: string;
  title: string;
  category: 'combat' | 'magic' | 'vitality' | 'stealth';
  difficulty: 'easy' | 'medium' | 'hard';
  completedAt: string; // Timestamp string
  expReward: number;
  goldReward: number;
  statReward: string;
}
