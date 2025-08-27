import { createContext, useContext } from 'react';
import type { GameState, UserInfo, AssetType, ChatMessage, Mission, EventCard, SettlementResult } from '../types/game';

export interface GameContextType {
  gameState: GameState;
  userInfo: UserInfo;
  assetAllocations: AssetType[];
  messages: ChatMessage[];
  currentMission: Mission | null;
  missions: Mission[];
  events: EventCard[];
  isCardCollectionOpen: boolean;
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
  performNextDaySettlement?: () => SettlementResult | void;
}

export const GameContext = createContext<GameContextType | undefined>(undefined);

export function useGameState() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameProvider');
  }
  return context;
}