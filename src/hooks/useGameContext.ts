import { createContext, useContext, useEffect } from 'react';
import { achievementService } from '../services/achievement-service';
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
  updateActiveCards?: () => void;
  clearNewCardFlags?: () => void;
  // Debug 测试方法
  triggerTestMission?: (missionId: number) => void;
  triggerTestEvent?: (eventId: string) => void;
}

export const GameContext = createContext<GameContextType | undefined>(undefined);

export function useGameState() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameProvider');
  }

  // BADGE 1: BALANCE APPRENTICE
  useEffect(() => {
    if (context.assetAllocations && context.assetAllocations.length > 0) {
      const maxAllocation = Math.max(...context.assetAllocations.map(a => a.allocation));
      if (maxAllocation <= 50) {
        achievementService.achieve('badge_1', 1, 'bronze');
      }
    }
  }, [context.assetAllocations]);

  // BADGE 2: DIVERSIFICATION EXPLORER
  useEffect(() => {
    if (context.assetAllocations && context.assetAllocations.length > 0) {
      const diversified = context.assetAllocations.filter(a => a.allocation > 0).length;
      if (diversified >= 3) {
        achievementService.achieve('badge_2', 2, 'silver');
      }
    }
  }, [context.assetAllocations]);

  return context;
}