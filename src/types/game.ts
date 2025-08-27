export interface GameState {
  currentDay: number;
  stars: number;
  level: number;
  mode: 'normal' | 'chaos';
  currentScreen: 'main' | 'allocation' | 'mission' | 'results';
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
}

export interface EventCard {
  id: number;
  title: string;
  description: string;
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