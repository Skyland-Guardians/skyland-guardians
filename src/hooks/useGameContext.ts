import { createContext, useContext } from 'react';
import type { GameState, UserInfo, AssetType, ChatMessage, Mission, EventCard, SettlementResult, PlayerCard } from '../types/game';

export interface GameContextType {
  gameState: GameState;
  userInfo: UserInfo;
  assetAllocations: AssetType[];
  messages: ChatMessage[];
  currentMission: Mission | null;
  missions: Mission[];
  events: EventCard[];
  isCardCollectionOpen: boolean;
  isBadgesOpen?: boolean;
  coins?: number;
  marketMode?: 'simulated' | 'random' | 'real';
  setMarketMode?: (mode: 'simulated' | 'random' | 'real') => void;
  marketDayIndex?: number;
  marketEvents?: any[];
  triggerEvent?: (eventId: string) => boolean;
  performanceHistory?: {
    day: number;
    portfolioReturn: number;
    totalValue: number;
    assetReturns: Record<string, number>;
  }[];
  updateGameState: (updates: Partial<GameState>) => void;
  updateUserInfo: (updates: Partial<UserInfo>) => void;
  updateAssetAllocation: (assetId: string, allocation: number) => void;
  addMessage: (message: ChatMessage) => void;
  setCurrentMission: (mission: Mission | null) => void;
  addMission: (mission: Mission) => void;
  addEvent: (event: EventCard) => void;
  setCardCollectionOpen: (open: boolean) => void;
  setBadgesOpen?: (open: boolean) => void;
  performNextDaySettlement?: () => SettlementResult | void;
  // 新的事件管理函数
  triggerNewCards?: (action: 'apply' | 'nextDay' | 'init') => void;
  acceptCard?: (card: PlayerCard) => void;
  declineCard?: (card: PlayerCard) => void;
  updateActiveCards?: (allocations?: AssetType[]) => void;
  clearNewCardFlags?: () => void;
  // Debug 测试方法
  triggerTestMission?: (missionId: number) => void;
  triggerTestEvent?: (eventId: string) => void;
  // 等级相关函数
  getLevelProgress?: () => {
    currentLevel: number;
    currentLevelConfig: any;
    nextLevelConfig: any;
    progressStars: number;
    starsToNext: number;
    progressPercentage: number;
  };
  getAllLevels?: () => any[];
  // 成就相关函数
  newAchievements?: string[];
  checkAchievements?: (allocations?: AssetType[]) => void;
  resetAchievements?: () => void;
  onAchievementAnimationComplete?: () => void;
}

export const GameContext = createContext<GameContextType | undefined>(undefined);

export function useGameState() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameProvider');
  }

  // Badge effects removed to prevent infinite loops and state instability
  // TODO: Implement badge system in a more stable way later
  // console.log('🎮 [useGameState] Hook called, context ready');

  return context;
}