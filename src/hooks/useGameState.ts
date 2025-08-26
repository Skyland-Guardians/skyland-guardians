import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GameState, UserInfo, AssetType, AIMessage } from '../types';

interface GameContextType {
  gameState: GameState;
  userInfo: UserInfo;
  assetAllocations: AssetType[];
  currentAIMessage: AIMessage | null;
  updateGameState: (updates: Partial<GameState>) => void;
  updateUserInfo: (updates: Partial<UserInfo>) => void;
  updateAssetAllocation: (assetId: string, allocation: number) => void;
  setAIMessage: (message: AIMessage | null) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function useGameState() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameProvider');
  }
  return context;
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>({
    currentDay: 1,
    stars: 15,
    level: 1,
    mode: 'normal',
    currentScreen: 'main'
  });

  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: 'JAMES',
    avatar: '/src/assets/主界面1资源/小孩头像icon.png',
    level: 1
  });

  const [assetAllocations, setAssetAllocations] = useState<AssetType[]>([
    { id: 'sword', name: 'SWORD', icon: '/src/assets/主界面1资源/剑 icon.png', type: 'sword', theme: 'gold', allocation: 12.5 },
    { id: 'shield', name: 'SHIELD', icon: '/src/assets/主界面1资源/盾icon.png', type: 'shield', theme: 'orange', allocation: 12.5 },
    { id: 'forest', name: 'FOREST', icon: '/src/assets/主界面1资源/森林icon.png', type: 'forest', theme: 'green', allocation: 12.5 },
    { id: 'askali', name: 'ASK ALI', icon: '/src/assets/主界面1资源/AI人物icon.png', type: 'askali', theme: 'orange', allocation: 12.5 },
    { id: 'golden', name: 'GOLDEN', icon: '/src/assets/主界面1资源/黄金icon.png', type: 'golden', theme: 'gold', allocation: 12.5 },
    { id: 'fountain', name: 'FOUNTAIN', icon: '/src/assets/主界面1资源/喷泉icon.png', type: 'fountain', theme: 'blue', allocation: 12.5 },
    { id: 'crystal', name: 'CRYSTAL', icon: '/src/assets/主界面1资源/水晶icon.png', type: 'crystal', theme: 'blue', allocation: 12.5 },
    { id: 'magic', name: 'MAGIC', icon: '/src/assets/主界面1资源/魔杖icon.png', type: 'magic', theme: 'gold', allocation: 12.5 }
  ]);

  const [currentAIMessage, setCurrentAIMessage] = useState<AIMessage | null>({
    id: '1',
    content: 'GOOD MORNING, LITTLE GUARDIAN! THE INVESTMENT PERFORMANCE YESTERDAY WAS QUITE GOOD! DO YOU WANT TO TRY ANY NEW CHALLENGES TODAY?',
    timestamp: new Date(),
    type: 'greeting'
  });

  const updateGameState = (updates: Partial<GameState>) => {
    setGameState(prev => ({ ...prev, ...updates }));
  };

  const updateUserInfo = (updates: Partial<UserInfo>) => {
    setUserInfo(prev => ({ ...prev, ...updates }));
  };

  const updateAssetAllocation = (assetId: string, allocation: number) => {
    setAssetAllocations(prev => 
      prev.map(asset => 
        asset.id === assetId ? { ...asset, allocation } : asset
      )
    );
  };

  const setAIMessage = (message: AIMessage | null) => {
    setCurrentAIMessage(message);
  };

  return (
    <GameContext.Provider value={{
      gameState,
      userInfo,
      assetAllocations,
      currentAIMessage,
      updateGameState,
      updateUserInfo,
      updateAssetAllocation,
      setAIMessage
    }}>
      {children}
    </GameContext.Provider>
  );
}