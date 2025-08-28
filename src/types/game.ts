export interface GameState {
  currentDay: number;
  stars: number;
  level: number;
  mode: 'normal' | 'chaos';
  currentScreen: 'main' | 'allocation' | 'mission' | 'results';
  playerCards: PlayerCard[]; // 玩家卡包
  activeMissions: Mission[]; // 当前进行中的任务
  activeEvents: EventCard[]; // 当前生效的事件
  pendingCards: PlayerCard[]; // 等待玩家决定的卡片
}

export interface UserInfo {
  name: string;
  avatar: string;
  level: number;
}

export interface AssetType {
  id: string;
  name: string;
  shortName?: string;
  icon: string;
  type: 'sword' | 'shield' | 'forest' | 'yield' | 'golden' | 'fountain' | 'crystal' | 'magic';
  theme: string;
  allocation: number;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  content: string;
  timestamp: Date;
  type?: 'greeting' | 'feedback' | 'hint' | 'celebration';
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

export interface Mission {
  id: number;
  title: string;
  background: string;
  tip: string;
  focus: string;
  rewardStars: number;
  status?: 'pending' | 'active' | 'completed' | 'declined';
  acceptedAt?: number; // day when accepted
  completedAt?: number; // day when completed
  targetAssets?: string[]; // required assets for completion
  targetAllocation?: number; // required allocation percentage
  completionDescription?: string; // user-friendly completion criteria
}

export interface EventCard {
  id: number;
  title: string;
  description: string;
  status?: 'pending' | 'active' | 'declined';
  acceptedAt?: number;
  duration?: number; // how many days the event lasts
  effects?: {
    type: 'add' | 'mul' | 'volatility';
    value: number;
    targets: string[];
  };
}

export interface PlayerCard {
  id: string;
  type: 'mission' | 'event';
  data: Mission | EventCard;
  obtainedAt: number; // day when obtained
  isNew?: boolean;
}

export interface SettlementAsset {
  id: string;
  name: string;
  shortName?: string;
  icon?: string;
  allocation: number;
  baseReturn: number; // raw base return for the day
  adjustedReturn: number; // after events
  contributionPct: number; // allocation% * adjustedReturn
  coinDelta: number; // coins gained/lost from this asset (rounded)
}

export interface SettlementResult {
  portfolioReturn: number;
  delta: number;
  perAsset: SettlementAsset[];
}