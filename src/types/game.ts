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
  icon: string;
  type: 'sword' | 'shield' | 'forest' | 'askali' | 'apply' | 'golden' | 'fountain' | 'crystal' | 'magic';
  theme: string;
  allocation: number;
}

export interface AIMessage {
  id: string;
  content: string;
  timestamp: Date;
  type: 'greeting' | 'feedback' | 'hint' | 'celebration';
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
}