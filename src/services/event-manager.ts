import { MissionManager } from '../data/missions';
import { EventManager as EventDataManager } from '../data/events';
import type { Mission, EventCard, PlayerCard, GameState, AssetType } from '../types/game';

export interface EventTriggerContext {
  currentDay: number;
  assetAllocations: AssetType[];
  activeMissions: Mission[];
  activeEvents: EventCard[];
  lastAction: 'apply' | 'nextDay' | 'init';
}

export class EventManager {
  private static instance: EventManager;
  private lastTriggerTime: number = 0; // 上次触发的时间戳
  private cooldownPeriod: number = 2 * 24 * 60 * 60 * 1000; // 冷却时间：2天（毫秒）
  
  static getInstance(): EventManager {
    if (!EventManager.instance) {
      EventManager.instance = new EventManager();
    }
    return EventManager.instance;
  }

  // 随机事件触发概率配置
  private readonly TRIGGER_RATES = {
    mission: {
      apply: 0.15, // 15% chance on apply - 在确定分配时触发
      nextDay: 0.05, // 5% chance on next day
      init: 0, // 0% chance on init
    },
    event: {
      apply: 0.08, // 8% chance on apply - 在确定分配时触发
      nextDay: 0.03, // 3% chance on next day
      init: 0, // 0% chance on init
    }
  };

  // 检查是否应该触发新的任务或事件
  checkForNewCards(
    gameState: GameState, 
    trigger: 'apply' | 'nextDay' | 'init',
    currentAssetAllocations?: AssetType[]
  ): {
    type: 'mission' | 'event';
    card: Mission | EventCard;
  } | null {
    // 检查冷却期
    if (Date.now() - this.lastTriggerTime < this.cooldownPeriod) {
      return null;
    }

    // 检查当前是否已有未完成的任务和事件
    const hasActiveMission = gameState.activeMissions.some((m: Mission) => m.status === 'active');
    const hasActiveEvent = gameState.activeEvents.some((e: EventCard) => e.status === 'active');
    
    // 如果已经有活跃的任务和事件，降低新触发概率
    const activePenalty = (hasActiveMission && hasActiveEvent) ? 0.5 : 
                         (hasActiveMission || hasActiveEvent) ? 0.8 : 1.0;

    // 获取触发概率
    const missionRate = this.TRIGGER_RATES.mission[trigger] * activePenalty;
    const eventRate = this.TRIGGER_RATES.event[trigger] * activePenalty;

    let newCard: { type: 'mission' | 'event'; card: Mission | EventCard } | null = null;

    // 检查任务触发
    if (Math.random() < missionRate) {
      // Get available missions (ones not already active and not already completed by current allocation)
      const availableConfigs = MissionManager.getAllConfigs().filter(config => {
        // Skip if already active
        if (gameState.activeMissions.some(active => active.id === config.id)) {
          return false;
        }
        // Skip if current allocation already satisfies the mission
        if (currentAssetAllocations && config.completionCheck(currentAssetAllocations)) {
          return false;
        }
        return true;
      });
      
      if (availableConfigs.length > 0) {
        const randomConfig = availableConfigs[Math.floor(Math.random() * availableConfigs.length)];
        const mission = MissionManager.createMission(randomConfig.id);
        if (mission) {
          newCard = { type: 'mission', card: mission };
        }
      }
    }

    // 检查事件触发（如果没有任务触发）
    if (!newCard && Math.random() < eventRate) {
      const randomConfig = EventDataManager.getRandomEvent();
      const event = EventDataManager.createEvent(randomConfig.id);
      if (event) {
        newCard = { type: 'event', card: event };
      }
    }

    // 如果有新卡片，更新冷却时间
    if (newCard) {
      this.lastTriggerTime = Date.now();
    }

    return newCard;
  }

  // 检查任务完成条件
  checkMissionCompletion(mission: Mission, assetAllocations: AssetType[]): boolean {
    return MissionManager.checkCompletion(mission.id, assetAllocations);
  }

  // 处理卡片接受
  acceptCard(card: PlayerCard, gameState: GameState): Partial<GameState> {
    const updates: Partial<GameState> = {
      pendingCards: gameState.pendingCards.filter(c => c.id !== card.id)
    };

    if (card.type === 'mission') {
      const mission = card.data as Mission;
      const updatedMission = {
        ...mission,
        status: 'active' as const,
        acceptedAt: gameState.currentDay
      };
      updates.activeMissions = gameState.activeMissions.map((m: Mission) => m.id === mission.id ? updatedMission : m);
      
      // 如果任务不在列表中，添加它
      if (!gameState.activeMissions.some((m: Mission) => m.id === mission.id)) {
        updates.activeMissions = [...gameState.activeMissions, updatedMission];
      }
      
      updates.playerCards = [...gameState.playerCards, { ...card, data: updatedMission }];
    } else if (card.type === 'event') {
      const event = card.data as EventCard;
      const updatedEvent = {
        ...event,
        status: 'active' as const,
        acceptedAt: gameState.currentDay
      };
      updates.activeEvents = gameState.activeEvents.map((e: EventCard) => e.id === event.id ? updatedEvent : e);
      
      // 如果事件不在列表中，添加它
      if (!gameState.activeEvents.some((e: EventCard) => e.id === event.id)) {
        updates.activeEvents = [...gameState.activeEvents, updatedEvent];
      }
      
      updates.playerCards = [...gameState.playerCards, { ...card, data: updatedEvent }];

      // Note: Event effects are typically applied during settlement calculation
      // rather than immediately when accepted
    }

    return updates;
  }

  // 处理卡片拒绝
  declineCard(card: PlayerCard, gameState: GameState): Partial<GameState> {
    const updatedCard = {
      ...card,
      data: { ...card.data, status: 'declined' as const }
    };

    return {
      pendingCards: gameState.pendingCards.filter(c => c.id !== card.id),
      playerCards: [...gameState.playerCards, updatedCard]
    };
  }

  // 更新活跃事件和任务状态
  updateActiveCards(gameState: GameState, assetAllocations: AssetType[]): Partial<GameState> {
    const updates: Partial<GameState> = {};

    // 检查任务完成
    const completedMissions: Mission[] = [];
    const activeMissions = gameState.activeMissions.map(mission => {
      if (mission.status === 'active' && this.checkMissionCompletion(mission, assetAllocations)) {
        const completed = {
          ...mission,
          status: 'completed' as const,
          completedAt: gameState.currentDay
        };
        completedMissions.push(completed);
        return completed;
      }
      return mission;
    });

    if (completedMissions.length > 0) {
      // 保留已完成的任务在列表中，但更新状态
      updates.activeMissions = activeMissions;
      // 给予星星奖励
      updates.stars = gameState.stars + completedMissions.reduce((sum, m) => sum + m.rewardStars, 0);
      
      // 返回完成的任务信息，用于显示完成提示
      (updates as any).completedMissions = completedMissions;
    }

    // 检查事件到期
    const activeEvents = gameState.activeEvents.filter(event => {
      if (event.acceptedAt && event.duration) {
        return gameState.currentDay - event.acceptedAt < event.duration;
      }
      return true;
    });

    if (activeEvents.length !== gameState.activeEvents.length) {
      updates.activeEvents = activeEvents;
    }

    return updates;
  }

  // Debug methods for testing
  triggerSpecificMission(missionId: number): Mission | null {
    return MissionManager.createMission(missionId);
  }

  triggerSpecificEvent(eventId: string): EventCard | null {
    return EventDataManager.createEvent(eventId);
  }

  getAllAvailableMissions() {
    return MissionManager.getAllConfigs();
  }

  getAllAvailableEvents() {
    return EventDataManager.getAllConfigs();
  }
}

export const eventManager = EventManager.getInstance();