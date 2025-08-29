import { useState, useEffect, useRef } from 'react';
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
  const STORAGE_KEY = 'skyland-guardians-app-state-v1';

  // Track whether loadFromStorage found any persisted data and whether parse failed
  const loadedAnyRef = useRef(false);
  const parseErrorRef = useRef(false);

  

  // Serialize payload to JSON safely, converting Date objects to ISO strings everywhere
  const serializeForStorage = (payload: any) => {
    try {
      const replacer = (_key: string, value: any) => {
        if (value instanceof Date) return value.toISOString();
        return value;
      };

      // Try to stringify the whole payload first
      try {
        return JSON.stringify(payload, replacer);
      } catch (err) {
        console.warn('GameProvider: Full payload serialization failed, attempting per-slice serialization', err);
        // Fallback: try to serialize slices individually and keep the ones that succeed
        const safePayload: any = {};
        for (const key of Object.keys(payload)) {
          try {
            const value = payload[key];
            // Quick check: if value is undefined, skip
            if (typeof value === 'undefined') continue;
            // Attempt to stringify this slice
            JSON.stringify(value, replacer);
            safePayload[key] = value;
          } catch (sliceErr) {
            console.warn(`GameProvider: Skipping non-serializable slice for key= ${key}`, sliceErr);
          }
        }
        return JSON.stringify(safePayload, replacer);
      }
    } catch (e) {
      console.warn('Failed to serialize state for storage', e);
      return null;
    }
  };

  // Load persisted JSON and revive ISO date strings for known fields (messages.timestamp)
  const loadFromStorage = () => {
    console.log('🔄 [DEBUG] Starting loadFromStorage...');
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      console.log('📦 [DEBUG] Raw main storage data:', raw ? `${raw.length} chars` : 'null');
      let parsed: any = null;

      if (raw) {
        try {
          parsed = JSON.parse(raw);
          loadedAnyRef.current = true;
        } catch (e) {
          // If parsing the main blob fails, we don't want to blindly overwrite it later.
          console.warn('GameProvider: failed to parse main storage key', STORAGE_KEY, e);
          // Indicate parse error via ref so persistence can avoid overwriting corrupted data
          parseErrorRef.current = true;
          parsed = null;
        }
      }
      
      // Always attempt to read from fallback keys and merge with main data
      // This ensures we don't lose data even if main storage is partial or corrupted
      if (!parsed) parsed = {};
      
      const fd = localStorage.getItem('skyland-guardians-current-day');
      const fstars = localStorage.getItem('skyland-guardians-stars');
      const flevel = localStorage.getItem('skyland-guardians-level');
      const fcoins = localStorage.getItem('skyland-guardians-coins');
      const falloc = localStorage.getItem('skyland-guardians-asset-allocations');
      const fmsg = localStorage.getItem('skyland-guardians-messages');
      const fph = localStorage.getItem('skyland-guardians-performance-history');
      const fmdi = localStorage.getItem('skyland-guardians-market-day-index');
      const fmev = localStorage.getItem('skyland-guardians-market-events');
      const uname = localStorage.getItem('userNickname');
      const uavatar = localStorage.getItem('userAvatar');
      
      // Merge fallback data with main data, preferring main data when available
      if (fd && (!parsed.gameState || typeof parsed.gameState.currentDay !== 'number')) {
        parsed.gameState = { ...(parsed.gameState || {}), currentDay: Number(fd) };
        loadedAnyRef.current = true;
      }
      if (fstars && (!parsed.gameState || typeof parsed.gameState.stars !== 'number')) {
        parsed.gameState = { ...(parsed.gameState || {}), stars: Number(fstars) };
        loadedAnyRef.current = true;
      }
      if (flevel && (!parsed.gameState || typeof parsed.gameState.level !== 'number')) {
        parsed.gameState = { ...(parsed.gameState || {}), level: Number(flevel) };
        loadedAnyRef.current = true;
      }
      if (fcoins && typeof parsed.coins !== 'number') {
        const coinsValue = Number(fcoins);
        console.log('🪙 [DEBUG] Loading coins from fallback storage:', fcoins, '-> parsed as:', coinsValue);
        parsed.coins = coinsValue;
        loadedAnyRef.current = true;
      } else if (fcoins) {
        console.log('🪙 [DEBUG] Found fallback coins but main data already has coins:', parsed.coins, 'fallback value:', fcoins);
      } else {
        console.log('🪙 [DEBUG] No fallback coins data found');
      }
      if (falloc && !Array.isArray(parsed.assetAllocations)) {
        try { 
          parsed.assetAllocations = JSON.parse(falloc); 
          loadedAnyRef.current = true;
        } catch { /* ignore */ }
      }
      if (fmsg && !Array.isArray(parsed.messages)) {
        try { 
          parsed.messages = JSON.parse(fmsg); 
          loadedAnyRef.current = true;
        } catch { /* ignore */ }
      }
      if (fph && !Array.isArray(parsed.performanceHistory)) {
        try { 
          parsed.performanceHistory = JSON.parse(fph); 
          loadedAnyRef.current = true;
        } catch { /* ignore */ }
      }
      if (fmdi && typeof parsed.marketDayIndex !== 'number') {
        parsed.marketDayIndex = Number(fmdi);
        loadedAnyRef.current = true;
      }
      if (fmev && !Array.isArray(parsed.marketEvents)) {
        try { 
          parsed.marketEvents = JSON.parse(fmev); 
          loadedAnyRef.current = true;
        } catch { /* ignore */ }
      }
      if (uname || uavatar) {
        if (!parsed.userInfo) parsed.userInfo = {};
        if (uname && !parsed.userInfo.name) {
          parsed.userInfo.name = uname;
          loadedAnyRef.current = true;
        }
        if (uavatar && !parsed.userInfo.avatar) {
          parsed.userInfo.avatar = uavatar;
          loadedAnyRef.current = true;
        }
      }

      // Convert message timestamps back to Date where possible
      if (parsed && Array.isArray(parsed.messages)) {
        parsed.messages = parsed.messages.map((m: any) => ({ ...m, timestamp: m?.timestamp ? new Date(m.timestamp) : new Date() }));
      }

      // Defensive: performanceHistory may contain day numbers only, but if there are timestamps in future, revive them here
      if (parsed && Array.isArray(parsed.performanceHistory)) {
        parsed.performanceHistory = parsed.performanceHistory.map((h: any) => ({ ...h }));
      }

      console.log('📊 [DEBUG] Final parsed data summary:', {
        hasGameState: !!parsed?.gameState,
        currentDay: parsed?.gameState?.currentDay,
        stars: parsed?.gameState?.stars,
        level: parsed?.gameState?.level,
        coins: parsed?.coins,
        coinsType: typeof parsed?.coins,
        hasUserInfo: !!parsed?.userInfo,
        userName: parsed?.userInfo?.name
      });
      return parsed;
    } catch (e) {
      console.warn('Failed to load persisted state', e);
      return null;
    }
  };
  
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
    name: 'GUARDIAN',
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
  const [coins, setCoins] = useState<number>(() => {
    console.log('🪙 [DEBUG] Initializing coins state with default value: 1000');
    return 1000;
  }); // initial money the player holds
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

  // Hydration flags to avoid persisting default initial state before we've loaded existing data
  const hasHydrated = useRef(false);
  const isRestoringData = useRef(false);


  // Load persisted state once on mount
  useEffect(() => {
    console.log('🚀 [DEBUG] Starting state hydration on mount...');
    isRestoringData.current = true; // Prevent persistence during restoration
    
    const persisted = loadFromStorage();
    if (persisted) {
      console.log('✅ [DEBUG] Found persisted data, applying to state...');
      // Apply persisted slices if available
      if (persisted.gameState) {
        console.log('🎮 [DEBUG] Restoring gameState:', persisted.gameState);
        setGameState(prev => ({ ...prev, ...persisted.gameState }));
      }
      if (persisted.userInfo) {
        console.log('👤 [DEBUG] Restoring userInfo:', persisted.userInfo);
        setUserInfo(prev => ({ ...prev, ...persisted.userInfo }));
      }
      if (Array.isArray(persisted.assetAllocations)) setAssetAllocations(persisted.assetAllocations);
      if (Array.isArray(persisted.messages)) setMessages(persisted.messages);
      if (typeof persisted.coins === 'number') {
        console.log('🪙 [DEBUG] Restoring coins from persisted data:', persisted.coins);
        setCoins(persisted.coins);
      } else {
        console.log('🪙 [DEBUG] No valid coins in persisted data, keeping default 1000. Found:', persisted.coins, typeof persisted.coins);
      }
      if (persisted.marketMode) setMarketMode(persisted.marketMode);
      if (typeof persisted.marketDayIndex === 'number') setMarketDayIndex(persisted.marketDayIndex);
      if (Array.isArray(persisted.marketEvents)) setMarketEvents(persisted.marketEvents);
      if (Array.isArray(persisted.performanceHistory)) setPerformanceHistory(persisted.performanceHistory);
      console.debug('GameProvider: Hydrated state from storage', STORAGE_KEY, persisted);
      
      // Use setTimeout to ensure all state updates have been processed
      setTimeout(() => {
        isRestoringData.current = false;
        hasHydrated.current = true;
        console.log('✅ [DEBUG] State restoration complete, enabling persistence');
      }, 100);
    } else {
      console.debug('GameProvider: No persisted state found for', STORAGE_KEY);
      // Even if no data found, mark as hydrated after a short delay
      setTimeout(() => {
        isRestoringData.current = false;
        hasHydrated.current = true;
        console.log('✅ [DEBUG] No data to restore, enabling persistence');
      }, 100);
    }
  }, []);

  // Persist whenever important slices change
  useEffect(() => {
    // Don't persist until we've attempted to hydrate initial state
    if (!hasHydrated.current) {
      console.log('⏳ [DEBUG] Skipping persistence - not yet hydrated');
      return;
    }
    
    // Don't persist while we're restoring data
    if (isRestoringData.current) {
      console.log('🔄 [DEBUG] Skipping persistence - currently restoring data');
      return;
    }

    console.log('💾 [DEBUG] Starting persistence. Current coins:', coins, typeof coins);
    try {
      const payload = {
        gameState,
        userInfo,
        assetAllocations,
        messages,
        coins,
        marketMode,
        marketDayIndex,
        marketEvents,
        performanceHistory
      };
      console.log('📦 [DEBUG] Payload to persist:', {
        currentDay: gameState.currentDay,
        stars: gameState.stars,
        level: gameState.level,
        coins: coins,
        coinsType: typeof coins
      });

      const serialized = serializeForStorage(payload);
      if (serialized) {
        if (parseErrorRef.current) {
          // If the main blob existed but failed to parse, avoid overwriting it to prevent data loss.
          console.warn('GameProvider: main storage key is corrupted; skipping overwrite to avoid data loss', STORAGE_KEY);
        } else {
          localStorage.setItem(STORAGE_KEY, serialized);
        }
        // Also persist important slices under separate keys so they are easy to inspect and resilient
        try {
          console.log('💰 [DEBUG] Saving to fallback storage - coins:', coins, 'as string:', String(coins));
          localStorage.setItem('skyland-guardians-current-day', String(gameState.currentDay));
          localStorage.setItem('skyland-guardians-stars', String(gameState.stars));
          localStorage.setItem('skyland-guardians-level', String(gameState.level));
          localStorage.setItem('skyland-guardians-coins', String(coins));
          console.log('✅ [DEBUG] Saved fallback coins. Verify:', localStorage.getItem('skyland-guardians-coins'));
          localStorage.setItem('skyland-guardians-asset-allocations', JSON.stringify(assetAllocations));
          localStorage.setItem('skyland-guardians-messages', JSON.stringify(messages.map(m => ({ ...m, timestamp: m.timestamp instanceof Date ? m.timestamp.toISOString() : m.timestamp }))));
          localStorage.setItem('skyland-guardians-performance-history', JSON.stringify(performanceHistory || []));
          localStorage.setItem('skyland-guardians-market-day-index', String(marketDayIndex));
          localStorage.setItem('skyland-guardians-market-events', JSON.stringify(marketEvents || []));
          // userInfo fields are also useful
          try { localStorage.setItem('userNickname', userInfo.name || ''); } catch {}
          try { localStorage.setItem('userAvatar', userInfo.avatar || ''); } catch {}
        } catch (e) {
          console.warn('GameProvider: failed to persist per-slice storage', e);
        }

        // Debug log to help trace persistence issues
        console.debug('GameProvider: Persisted state to storage', STORAGE_KEY, {
          gameState: { currentDay: gameState.currentDay, stars: gameState.stars, level: gameState.level },
          coins,
          marketDayIndex,
          messagesCount: Array.isArray(messages) ? messages.length : 0
        });
      }
    } catch (e) {
      console.warn('Failed to persist game state', e);
    }
  }, [gameState, userInfo, assetAllocations, messages, coins, marketMode, marketDayIndex, marketEvents, performanceHistory]);

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
    console.log('💰 [DEBUG] performNextDaySettlement - updating coins. Current:', coins, 'Delta:', delta, 'New total will be:', coins + delta);
    setCoins(prev => {
      const newCoins = prev + delta;
      console.log('💰 [DEBUG] setCoins callback - prev:', prev, 'delta:', delta, 'new:', newCoins);
      return newCoins;
    });

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

  const addCoins = (amount: number) => {
    console.log('💰 [DEBUG] addCoins called with amount:', amount);
    setCoins(prev => {
      const newTotal = prev + amount;
      console.log('💰 [DEBUG] Adding coins - prev:', prev, 'amount:', amount, 'new total:', newTotal);
      return newTotal;
    });
  };

  return (
    <GameContext.Provider value={{
      gameState,
      userInfo,
      assetAllocations,
      messages,
      coins,
      addCoins,
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
        onDismiss={() => {
          // If the left hint was dismissed, show the bottom hint next
          if (activeHint && activeHint.id === 'hint-leftpanel') {
            const bottomHint = {
              id: 'hint-bottom',
              selector: '.layout-asset-toolbar',
              content: 'Use the asset toolbar to adjust allocations. Try assigning some % and hit APPLY.'
            } as UITutorialHint;
            setActiveHint(bottomHint);
            return;
          }

          // If the bottom hint was dismissed, show the money request hint next
          if (activeHint && activeHint.id === 'hint-bottom') {
            const hasUsedMoneyRequest = localStorage.getItem('hasUsedMoneyRequest');
            if (!hasUsedMoneyRequest) {
              const moneyHint = {
                id: 'hint-money-request',
                selector: 'button[title="Click to request more money from parents"]',
                content: '💰 Need more funds? Click the money button to request additional money from your parents!'
              } as UITutorialHint;
              setActiveHint(moneyHint);
              return;
            }
          }

          // Default behavior: clear active hint
          setActiveHint(null);
        }}
      />
      <MyCardOverlayPrompt
        isOpen={showWelcomeOverlay}
        onClose={() => {
          // Closing the welcome overlay counts as 'start playing' for hint flow
          setShowWelcomeOverlay(false);

          // Show the left panel hint after the user dismisses welcome
          const leftHint = { 
            id: 'hint-leftpanel', 
            selector: '.layout-left-panel', 
            content: 'Your cards and badges live here. Click MY CARDS to view your collection!' 
          } as UITutorialHint;

          // Slight delay to allow modal to fully close and layout to settle
          setTimeout(() => setActiveHint(leftHint), 300);
        }}
        title="Welcome to Skyland Guardians"
        onOpenAvatarCustomization={() => setShowAvatarModal(true)}
        onStartPlaying={() => {
          // Trigger AI greeting when user starts playing (Start Playing button)
          const userName = localStorage.getItem('userNickname') || 'Guardian';
          const welcomeMessage = gamifiedAIService.generateWelcomeMessage(userName);
          addMessage(welcomeMessage);
        }}
      />
    </GameContext.Provider>
  );
}