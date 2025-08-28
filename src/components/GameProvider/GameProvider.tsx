import { useState } from 'react';
import type { ReactNode } from 'react';
import type { GameState, UserInfo, AssetType, ChatMessage, Mission, EventCard, SettlementResult, SettlementAsset, PlayerCard } from '../../types/game';
import { GameContext } from '../../hooks/useGameContext';
import { SIMULATED_SERIES } from '../../data/simulated-asset-series';
import { SAMPLE_EVENTS } from '../../data/sample-events';
import { DEFAULT_MARKET_CONFIG } from '../../data/asset-market-config';
import { GAME_ASSETS } from '../../data/game-assets';
import { sampleReturnForType } from '../../data/asset-return-config';
import { gamifiedAIService } from '../../services/gamified-ai-service';
import { eventManager } from '../../services/event-manager';
import type { MarketMode } from '../../data/asset-market-config';

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>({
    currentDay: 1,
    stars: 15,
    level: 1,
    mode: 'normal',
    currentScreen: 'main',
    playerCards: [],
    activeMissions: [],
    activeEvents: [],
    pendingCards: []
  });

  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: 'JAMES',
    		avatar: './assets/main-screen-1-assets/child-avatar-icon.png',
    level: 1
  });

  const mapThemeFromRisk = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'high':
        return 'gold';
      case 'medium':
        return 'orange';
      default:
        return 'blue';
    }
  };

  const defaultAllocations: AssetType[] = GAME_ASSETS.map(a => {
    // Set initial allocation: 50% Tech (sword), 50% Bonds (shield), 0% others
    let allocation = 0;
    if (a.id === 'sword') {
      allocation = 50; // Agile Sword (Technology)
    } else if (a.id === 'shield') {
      allocation = 50; // Sturdy Shield (Bonds)
    }
    
    return {
      id: a.id,
      name: a.gameName.toUpperCase(),
      shortName: a.shortName || a.gameName,
      icon: a.icon || '',
      type: a.id as any,
      theme: mapThemeFromRisk(a.risk),
      allocation: allocation
    };
  });

  const [assetAllocations, setAssetAllocations] = useState<AssetType[]>(defaultAllocations);

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [currentMission, setCurrentMission] = useState<Mission | null>(null);
  const [isCardCollectionOpen, setCardCollectionOpen] = useState(false);
  const [isBadgesOpen, setBadgesOpen] = useState(false);
  const [coins, setCoins] = useState<number>(1000); // initial money the player holds
  const [marketMode, setMarketMode] = useState<MarketMode>(DEFAULT_MARKET_CONFIG.mode);
  const [marketDayIndex, setMarketDayIndex] = useState<number>(0);
  const [marketEvents, setMarketEvents] = useState<any[]>([...SAMPLE_EVENTS]);
  
  // Store daily portfolio performance history
  const [performanceHistory, setPerformanceHistory] = useState<{
    day: number;
    portfolioReturn: number;
    totalValue: number;
    assetReturns: Record<string, number>;
  }[]>([]);

  const updateGameState = (updates: Partial<GameState>) => {
    setGameState(prev => ({ ...prev, ...updates }));
  };

  const updateUserInfo = (updates: Partial<UserInfo>) => {
    setUserInfo(prev => ({ ...prev, ...updates }));
  };

  const updateAssetAllocation = (assetId: string, allocation: number) => {
    setAssetAllocations(prev => {
      const updated = prev.map(asset => 
        asset.id === assetId ? { ...asset, allocation } : asset
      );
      
      // 在APPLY操作后触发新事件
      setTimeout(() => {
        triggerNewCards('apply');
        updateActiveCards();
      }, 100);
      
      return updated;
    });
  };

  const addMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  };

  // 触发新的事件和任务
  const triggerNewCards = (action: 'apply' | 'nextDay' | 'init') => {
    const context = {
      currentDay: gameState.currentDay,
      assetAllocations,
      activeMissions: gameState.activeMissions,
      activeEvents: gameState.activeEvents,
      lastAction: action
    };

    const newCards = eventManager.checkForNewCards(context);
    if (newCards.length > 0) {
      setGameState(prev => ({
        ...prev,
        pendingCards: [...prev.pendingCards, ...newCards]
      }));
    }
  };

  // 接受卡片
  const acceptCard = (card: PlayerCard) => {
    const updates = eventManager.acceptCard(card, gameState);
    setGameState(prev => ({ ...prev, ...updates }));
  };

  // 拒绝卡片
  const declineCard = (card: PlayerCard) => {
    const updates = eventManager.declineCard(card, gameState);
    setGameState(prev => ({ ...prev, ...updates }));
  };

  // 更新活跃的事件和任务状态
  const updateActiveCards = () => {
    const updates = eventManager.updateActiveCards(gameState, assetAllocations);
    if (Object.keys(updates).length > 0) {
      setGameState(prev => ({ ...prev, ...updates }));
    }
  };

  // 清除新卡片标志
  const clearNewCardFlags = () => {
    setGameState(prev => ({
      ...prev,
      playerCards: prev.playerCards.map(card => ({ ...card, isNew: false }))
    }));
  };

  // Simple settlement logic for "next day" based on current allocations.
  const performNextDaySettlement = (): SettlementResult => {
    const dayIndex = marketDayIndex;

    const getBaseReturn = (type: string) => {
      // simulated mode -> use series if available
      if (marketMode === 'simulated' && SIMULATED_SERIES[type]) {
        const series = SIMULATED_SERIES[type];
        const idx = dayIndex % series.length;
        return series[idx];
      }

      // fallback to centralized random baseline per type
      return sampleReturnForType(type);
    };

    // find events that apply today (including active events)
    const todaysEvents = [...marketEvents.filter(ev => ev.dayIndex === dayIndex || ev.dayIndex === 'all')];
    
    // Add active events from game state
    gameState.activeEvents.forEach(activeEvent => {
      if (activeEvent.effects) {
        todaysEvents.push({
          id: `active-${activeEvent.id}`,
          title: activeEvent.title,
          description: activeEvent.description,
          dayIndex: dayIndex,
          targets: activeEvent.effects.targets,
          effect: {
            type: activeEvent.effects.type,
            value: activeEvent.effects.value
          },
          duration: 1
        });
      }
    });

    const applyEventsToReturn = (base: number, type: string) => {
      // Apply add effects first, then mul, then volatility adjustments
      let ret = base;
      let addSum = 0;
      let mulProduct = 1;
      let volAdjust = 0;

      todaysEvents.forEach(ev => {
        const targets: string[] = ev.targets;
        if (targets.includes('all') || targets.includes(type)) {
          const eff = ev.effect || {};
          if (eff.type === 'add') addSum += (eff.value as number) || 0;
          if (eff.type === 'mul') mulProduct *= (eff.value as number) || 1;
          if (eff.type === 'volatility') volAdjust += (eff.value as number) || 0;
        }
      });

      ret = (ret + addSum) * mulProduct;
      // apply volatility as a random jitter scaled by volAdjust
      if (volAdjust !== 0) {
        ret += (Math.random() * 2 - 1) * Math.abs(volAdjust);
      }
      return ret;
    };

    // compute per-asset returns and weighted portfolio return
    const perAssetResults: SettlementAsset[] = assetAllocations.map((a) => {
      const base = getBaseReturn(a.type);
      const adjusted = applyEventsToReturn(base, a.type);
      const contributionPct = (a.allocation / 100) * adjusted;
      const coinDelta = Math.round(coins * contributionPct);
      return {
        id: a.id,
        name: a.name,
        shortName: (a as any).shortName,
        icon: a.icon,
        allocation: a.allocation,
        baseReturn: base,
        adjustedReturn: adjusted,
        contributionPct,
        coinDelta
      };
    });

    const portfolioReturn = perAssetResults.reduce((s, p) => s + p.contributionPct, 0);

    const delta = perAssetResults.reduce((s, p) => s + p.coinDelta, 0);
    setCoins(prev => prev + delta);

    // advance day counters
    setMarketDayIndex(i => i + 1);
    setGameState(prev => ({ ...prev, currentDay: prev.currentDay + 1 }));

    // Record performance history
    const newTotalValue = coins + delta;
    const assetReturns: Record<string, number> = {};
    perAssetResults.forEach(asset => {
      assetReturns[asset.id] = asset.adjustedReturn;
    });
    
    setPerformanceHistory(prev => {
      const newEntry = {
        day: gameState.currentDay + 1,
        portfolioReturn,
        totalValue: newTotalValue,
        assetReturns
      };
      // Keep only last 7 days
      const updated = [...prev, newEntry].slice(-7);
      return updated;
    });

    // Generate AI feedback about the settlement
    const aiEventFeedback = gamifiedAIService.generateEventFeedback('market settlement', portfolioReturn);
    setMessages(prev => [
      ...prev,
      {
        id: String(Date.now()),
        sender: 'ai',
        content: aiEventFeedback,
        timestamp: new Date(),
        type: 'feedback'
      }
    ]);

    // 在下一天后触发新事件
    setTimeout(() => {
      triggerNewCards('nextDay');
      updateActiveCards();
    }, 100);

    return { portfolioReturn, delta, perAsset: perAssetResults };
  };

  const triggerEvent = (eventId: string) => {
    const ev = marketEvents.find(e => e.id === eventId);
    if (!ev) return false;
    // mark event dayIndex to today's index so it applies immediately
    ev.dayIndex = marketDayIndex;
    setMarketEvents([...marketEvents]);
    return true;
  };

  return (
    <GameContext.Provider value={{
      gameState,
      userInfo,
      assetAllocations,
      messages,
      coins,
      performNextDaySettlement,
      marketMode,
      setMarketMode,
      marketDayIndex,
      marketEvents,
      triggerEvent,
      currentMission,
      missions: gameState.activeMissions, // 为了兼容性
      events: gameState.activeEvents, // 为了兼容性
      isCardCollectionOpen,
      isBadgesOpen,
      performanceHistory,
      updateGameState,
      updateUserInfo,
      updateAssetAllocation,
      addMessage,
      setCurrentMission,
      addMission: (mission: Mission) => { // 为了兼容性
        setGameState(prev => ({
          ...prev,
          activeMissions: [...prev.activeMissions, mission]
        }));
      },
      addEvent: (event: EventCard) => { // 为了兼容性
        setGameState(prev => ({
          ...prev,
          activeEvents: [...prev.activeEvents, event]
        }));
      },
      setCardCollectionOpen,
      setBadgesOpen,
      // 新的事件管理函数
      triggerNewCards,
      acceptCard,
      declineCard,
      updateActiveCards,
      clearNewCardFlags
    }}>
      {children}
    </GameContext.Provider>
  );
}