import { createContext, useContext } from 'react';
import type { GameState, UserInfo, AssetType, AIMessage } from '../types/game';

export interface GameContextType {
  gameState: GameState;
  userInfo: UserInfo;
  assetAllocations: AssetType[];
  currentAIMessage: AIMessage | null;
  updateGameState: (updates: Partial<GameState>) => void;
  updateUserInfo: (updates: Partial<UserInfo>) => void;
  updateAssetAllocation: (assetId: string, allocation: number) => void;
  setAIMessage: (message: AIMessage | null) => void;
}

export const GameContext = createContext<GameContextType | undefined>(undefined);

export function useGameState() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameProvider');
  }
  return context;
}