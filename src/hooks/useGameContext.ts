import { createContext, useContext } from 'react';
import type { GameState, UserInfo, AssetType, ChatMessage, Mission } from '../types/game';

export interface GameContextType {
  gameState: GameState;
  userInfo: UserInfo;
  assetAllocations: AssetType[];
  messages: ChatMessage[];
  currentMission: Mission | null;
  missions: Mission[];
  isMissionListOpen: boolean;
  updateGameState: (updates: Partial<GameState>) => void;
  updateUserInfo: (updates: Partial<UserInfo>) => void;
  updateAssetAllocation: (assetId: string, allocation: number) => void;
  addMessage: (message: ChatMessage) => void;
  setCurrentMission: (mission: Mission | null) => void;
  addMission: (mission: Mission) => void;
  setMissionListOpen: (open: boolean) => void;
}

export const GameContext = createContext<GameContextType | undefined>(undefined);

export function useGameState() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameProvider');
  }
  return context;
}