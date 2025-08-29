import { useState } from 'react';
import type { ReactNode } from 'react';
import type { GameState, UserInfo, AssetType, ChatMessage, Mission, EventCard, SettlementResult, SettlementAsset, PlayerCard } from '../../types/game';
import { GameContext } from '../../hooks/useGameContext';
import { SIMULATED_SERIES } from '../../data/simulated-asset-series';
import { EVENT_CONFIGS } from '../../data/events';
import { DEFAULT_MARKET_CONFIG } from '../../data/asset-market-config';
import { GAME_ASSETS, UI_ASSET_ORDER } from '../../data/game-assets';
import { sampleReturnForType } from '../../data/asset-return-config';
import { gamifiedAIService } from '../../services/gamified-ai-service';
import { eventManager } from '../../services/event-manager';
import { achievementChecker } from '../../services/achievement-checker';
import { achievementService } from '../../services/achievement-service';
import type { UITutorialHint } from '../../types/tutorial';
import { TutorialHint } from '../TutorialHint/TutorialHint';
import { MyCardOverlayPrompt } from '../MyCards/MyCardOverlayPrompt';
import { LevelManager } from '../../data/level-config';
import type { MarketMode } from '../../data/asset-market-config';

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>({
    currentDay: 1,
    stars: 0,
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

  // Build allocations in UI order (leftGroup then rightGroup) to match toolbar layout
  const orderedIds = [...(UI_ASSET_ORDER.leftGroup || []), ...(UI_ASSET_ORDER.rightGroup || [])];
  const orderedAssets = orderedIds.map(id => GAME_ASSETS.find(a => a.id === id)).filter(Boolean) as typeof GAME_ASSETS;

  const defaultAllocations: AssetType[] = orderedAssets.map(a => {
    // Start with zero allocation for every asset so players manually assign weights
    return {
      id: a.id,
      name: a.gameName.toUpperCase(),
      shortName: a.shortName || a.gameName,
      icon: a.icon || '',
      type: a.id as any,
      theme: mapThemeFromRisk(a.risk),
      allocation: 0
    };
  });

  const [assetAllocations, setAssetAllocations] = useState<AssetType[]>(defaultAllocations);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMission, setCurrentMission] = useState<Mission | null>(null);
  const [isCardCollectionOpen, setCardCollectionOpen] = useState(false);
  const [isBadgesOpen, setBadgesOpen] = useState(false);
  const [showWelcomeOverlay, setShowWelcomeOverlay] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [coins, setCoins] = useState<number>(1000); // initial money the player holds
  const [marketMode, setMarketMode] = useState<MarketMode>(DEFAULT_MARKET_CONFIG.mode);
  const [marketDayIndex, setMarketDayIndex] = useState<number>(0);
  const [marketEvents, setMarketEvents] = useState<any[]>([...EVENT_CONFIGS]);
  
  // Store daily portfolio performance history
  const [performanceHistory, setPerformanceHistory] = useState<{
    day: number;
    portfolioReturn: number;
    totalValue: number;
    assetReturns: Record<string, number>;
  }[]>([]);

  // 新成就状态
  const [newAchievements, setNewAchievements] = useState<string[]>([]);

  // Tutorial hint state
  const [activeHint, setActiveHint] = useState<UITutorialHint | null>(null);

  // 检查成就
  const checkAchievements = (allocations: AssetType[] = assetAllocations) => {
    const newlyUnlocked = achievementChecker.checkAchievements(allocations, gameState.stars);
    if (newlyUnlocked.length > 0) {
      setNewAchievements(prev => [...prev, ...newlyUnlocked]);
    }
  };

  // 重置成就（调试用）
  const resetAchievements = () => {
    achievementService.reset();
    setNewAchievements([]);
  };

  // 移除初始化时的成就检查，避免游戏开始时就解锁成就

  const updateGameState = (updates: Partial<GameState>) => {
    setGameState(prev => {
      const newState = { ...prev, ...updates };
      
      // 如果星星数发生变化，检查是否需要升级
      if (updates.stars !== undefined && updates.stars !== prev.stars) {
        const levelCheck = LevelManager.checkLevelUp(prev.stars, updates.stars);
        if (levelCheck.leveledUp) {
          console.log(`🎉 Level up! ${levelCheck.oldLevel} → ${levelCheck.newLevel}`);
          newState.level = levelCheck.newLevel;
          
          // TODO: 可以在这里添加升级庆祝动画或通知
          if (levelCheck.newLevelConfig) {
            console.log(`🌟 Reached ${levelCheck.newLevelConfig.title}: ${levelCheck.newLevelConfig.description}`);
          }
        }
        
        // 星星数变化时检查成就
        setTimeout(() => {
          checkAchievements(assetAllocations);
        }, 100);
      }
      
      return newState;
    });
  };

  const updateUserInfo = (updates: Partial<UserInfo>) => {
    setUserInfo(prev => ({ ...prev, ...updates }));
  };

  const updateAssetAllocation = (assetId: string, allocation: number) => {
    setAssetAllocations(prev => {
      const updated = prev.map(asset => 
        asset.id === assetId ? { ...asset, allocation } : asset
      );
      
      return updated;
    });
  };

  const addMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  };

  // 完成成就动画后的回调
  const onAchievementAnimationComplete = () => {
    setNewAchievements([]);
  };

  // 触发新的事件和任务
  const triggerNewCards = (action: 'apply' | 'nextDay' | 'init') => {
    // 检查是否有新的任务或事件需要触发
    const newCard = eventManager.checkForNewCards(gameState, action, assetAllocations);
    if (newCard) {
      setGameState(prev => ({
        ...prev,
        pendingCards: [...prev.pendingCards, {
          id: `${newCard.type}-${newCard.card.id}-${Date.now()}`,
          type: newCard.type,
          data: newCard.card,
          obtainedAt: prev.currentDay,
          isNew: true
        }]
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
  const updateActiveCards = (allocations: AssetType[] = assetAllocations) => {
    const updates = eventManager.updateActiveCards(gameState, allocations);
    if (Object.keys(updates).length > 0) {
      setGameState(prev => ({ ...prev, ...updates }));
      
      // 返回更新信息，包括完成的任务
      return updates;
    }
    return null;
  };

  // 清除新卡片标志
  const clearNewCardFlags = () => {
    setGameState(prev => ({
      ...prev,
      playerCards: prev.playerCards.map(card => ({ ...card, isNew: false }))
    }));
  };

  // Debug 测试方法
  const triggerTestMission = (missionId: number) => {
    const mission = eventManager.triggerSpecificMission(missionId);
    if (mission) {
      const newCard: PlayerCard = {
        id: `mission-${mission.id}-${Date.now()}`,
        type: 'mission',
        data: mission,
        obtainedAt: gameState.currentDay,
        isNew: true
      };

      setGameState(prev => ({
        ...prev,
        pendingCards: [...prev.pendingCards, newCard]
      }));
    }
  };

  const triggerTestEvent = (eventId: string) => {
    const event = eventManager.triggerSpecificEvent(eventId);
    if (event) {
      const newCard: PlayerCard = {
        id: `event-${event.id}-${Date.now()}`,
        type: 'event',
        data: event,
        obtainedAt: gameState.currentDay,
        isNew: true
      };

      setGameState(prev => ({
        ...prev,
        pendingCards: [...prev.pendingCards, newCard]
      }));
    }
  };

  // 等级相关函数
  const getLevelProgress = () => {
    return LevelManager.getLevelProgress(gameState.stars);
  };

  const getAllLevels = () => {
    return LevelManager.getAllLevels();
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

    // 在下一天后触发新事件和检查成就
    setTimeout(() => {
      triggerNewCards('nextDay');
      updateActiveCards();
      checkAchievements(); // 下一天时检查成就
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
      clearNewCardFlags,
      // Debug 测试方法
      triggerTestMission,
      triggerTestEvent,
      // 等级相关函数
      getLevelProgress,
      getAllLevels,
      // 成就相关函数
      newAchievements,
      checkAchievements,
      resetAchievements,
      onAchievementAnimationComplete,
      activeHint,
      setActiveHint,
      showWelcomeOverlay,
      setShowWelcomeOverlay,
      showAvatarModal,
      setShowAvatarModal
    }}>
      {children}
      <TutorialHint 
        hint={activeHint} 
        onDismiss={() => setActiveHint(null)}
      />
      <MyCardOverlayPrompt
        isOpen={showWelcomeOverlay}
        onClose={() => setShowWelcomeOverlay(false)}
        title="Welcome to Skyland Guardians"
        onOpenAvatarCustomization={() => setShowAvatarModal(true)}
        onStartPlaying={() => {
          // Trigger AI greeting when user starts playing
          const userName = localStorage.getItem('userNickname') || 'Guardian';
          const welcomeMessage = gamifiedAIService.generateWelcomeMessage(userName);
          addMessage(welcomeMessage);
        }}
      />
    </GameContext.Provider>
  );
}