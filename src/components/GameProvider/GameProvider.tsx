import { useState } from 'react';
import type { ReactNode } from 'react';
import type { GameState, UserInfo, AssetType, ChatMessage, Mission, EventCard, SettlementResult, SettlementAsset } from '../../types/game';
import { GameContext } from '../../hooks/useGameContext';
import { SIMULATED_SERIES } from '../../data/simulated-asset-series';
import { SAMPLE_EVENTS } from '../../data/sample-events';
import { DEFAULT_MARKET_CONFIG } from '../../data/asset-market-config';
import { GAME_ASSETS } from '../../data/game-assets';
import { sampleReturnForType } from '../../data/asset-return-config';
import type { MarketMode } from '../../data/asset-market-config';

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
    avatar: '/assets/主界面1资源/小孩头像icon.png',
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

  const defaultAllocations: AssetType[] = GAME_ASSETS.map(a => ({
    id: a.id,
    name: a.gameName.toUpperCase(),
    shortName: a.shortName || a.gameName,
    icon: a.icon || '',
    type: a.id as any,
    theme: mapThemeFromRisk(a.risk),
    allocation: Number((100 / GAME_ASSETS.length).toFixed(2))
  }));

  const [assetAllocations, setAssetAllocations] = useState<AssetType[]>(defaultAllocations);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      content:
        'GOOD MORNING, LITTLE GUARDIAN! THE INVESTMENT PERFORMANCE YESTERDAY WAS QUITE GOOD! DO YOU WANT TO TRY ANY NEW CHALLENGES TODAY?',
      timestamp: new Date(),
      type: 'greeting'
    }
  ]);

  const [currentMission, setCurrentMission] = useState<Mission | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [events, setEvents] = useState<EventCard[]>([]);
  const [isCardCollectionOpen, setCardCollectionOpen] = useState(false);
  const [coins, setCoins] = useState<number>(1000); // initial money the player holds
  const [marketMode, setMarketMode] = useState<MarketMode>(DEFAULT_MARKET_CONFIG.mode);
  const [marketDayIndex, setMarketDayIndex] = useState<number>(0);
  const [marketEvents, setMarketEvents] = useState<any[]>([...SAMPLE_EVENTS]);

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

  const addMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  };

  const addMission = (mission: Mission) => {
    setMissions(prev => [...prev, mission]);
  };

  const addEvent = (event: EventCard) => {
    setEvents(prev => [...prev, event]);
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

    // find events that apply today
    const todaysEvents = marketEvents.filter(ev => ev.dayIndex === dayIndex || ev.dayIndex === 'all');

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

    // message summary
    setMessages(prev => [
      ...prev,
      {
        id: String(Date.now()),
        sender: 'ai',
        content: `Day ${gameState.currentDay + 1} settlement: portfolio change ${(portfolioReturn * 100).toFixed(2)}%, ${delta >= 0 ? '+' : ''}${delta} coins.`,
        timestamp: new Date(),
        type: 'feedback'
      }
    ]);

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
      missions,
      events,
      isCardCollectionOpen,
      updateGameState,
      updateUserInfo,
      updateAssetAllocation,
      addMessage,
      setCurrentMission,
      addMission,
      addEvent,
      setCardCollectionOpen
    }}>
      {children}
    </GameContext.Provider>
  );
}