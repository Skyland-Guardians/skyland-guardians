import { MissionManager, MISSION_CONFIGS } from '../data/missions';
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
  
  static getInstance(): EventManager {
    if (!EventManager.instance) {
      EventManager.instance = new EventManager();
    }
    return EventManager.instance;
  }

  // 随机事件触发概率配置
  private readonly TRIGGER_RATES = {
    mission: {
      apply: 0.3, // 30% chance on apply
      nextDay: 0.2, // 20% chance on next day
      init: 0, // 0% chance on init
    },
    event: {
      apply: 0.25, // 25% chance on apply
      nextDay: 0.15, // 15% chance on next day
      init: 0, // 0% chance on init
    }
  };

  // 生成随机任务
  generateRandomMission(context: EventTriggerContext): Mission | null {
    const availableConfigs = MISSION_CONFIGS.filter(config => 
      !context.activeMissions.some(active => active.id === config.id)
    );

    if (availableConfigs.length === 0) return null;

    const randomConfig = availableConfigs[Math.floor(Math.random() * availableConfigs.length)];
    return MissionManager.createMission(randomConfig.id);
  }

  // 生成随机事件
  generateRandomEvent(_context: EventTriggerContext): EventCard | null {
    const randomConfig = EventDataManager.getRandomEvent();
    return EventDataManager.createEvent(randomConfig.id);
  }

  // 检查是否应该触发新的任务或事件
  checkForNewCards(context: EventTriggerContext): PlayerCard[] {
    const newCards: PlayerCard[] = [];

    // 检查任务触发
    const missionRate = this.TRIGGER_RATES.mission[context.lastAction];
    if (Math.random() < missionRate) {
      const mission = this.generateRandomMission(context);
      if (mission) {
        newCards.push({
          id: `mission-${mission.id}-${Date.now()}`,
          type: 'mission',
          data: mission,
          obtainedAt: context.currentDay,
          isNew: true
        });
      }
    }

    // 检查事件触发
    const eventRate = this.TRIGGER_RATES.event[context.lastAction];
    if (Math.random() < eventRate) {
      const event = this.generateRandomEvent(context);
      if (event) {
        newCards.push({
          id: `event-${event.id}-${Date.now()}`,
          type: 'event',
          data: event,
          obtainedAt: context.currentDay,
          isNew: true
        });
      }
    }

    return newCards;
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
      updates.activeMissions = [...gameState.activeMissions, updatedMission];
      updates.playerCards = [...gameState.playerCards, { ...card, data: updatedMission }];
    } else if (card.type === 'event') {
      const event = card.data as EventCard;
      const updatedEvent = {
        ...event,
        status: 'active' as const,
        acceptedAt: gameState.currentDay
      };
      updates.activeEvents = [...gameState.activeEvents, updatedEvent];
      updates.playerCards = [...gameState.playerCards, { ...card, data: updatedEvent }];
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
      updates.activeMissions = activeMissions.filter(m => m.status === 'active');
      updates.stars = gameState.stars + completedMissions.reduce((sum, m) => sum + m.rewardStars, 0);
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
  triggerSpecificMission(missionId: number, context: EventTriggerContext): Mission | null {
    // Check if mission is already active
    if (context.activeMissions.some(active => active.id === missionId)) {
      return null;
    }

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