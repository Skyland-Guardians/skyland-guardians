import { describe, it, expect, vi } from 'vitest';
import { resolveEventChoice, applyDailyRewards, maybeTriggerEncounter } from '../daily-helpers';
import type { MarketEvent, Asset, Dilemma } from '../../types';
import tasksData from '../../constants/tasks.json';
import { taskGoals } from '../../constants/task-goals';
import * as logic from '../game-logic';
import { EASTER_EGG_MESSAGE } from '../../constants/game-config';

describe('resolveEventChoice', () => {
  it('applies selected choice impact to returns', () => {
    const event: MarketEvent = {
      id: 1,
      name: 'test',
      description: 'desc',
      affected: ['tech'],
      impactRange: { tech: [0, 0] },
      probability: 1,
      choices: [{ text: 'boost', impactRange: { tech: [0.01, 0.01] }, effect: 'up' }],
    };
    const assets: Asset[] = [{ key: 'tech', name: 'Tech', expectedReturn: 0, volatility: 0, description: '' }];
    const res = resolveEventChoice({
      event,
      choiceIndex: 0,
      weights: { tech: 100 },
      assets,
      portfolioValue: 1000,
      peakValue: 1000,
    });
    expect(res.result.returns).toBe(1);
    expect(res.effect).toBe('up');
    expect(res.updatedEvent.choices).toBeUndefined();
  });
});

describe('applyDailyRewards', () => {
  it('calculates rewards and history entry', () => {
    const task = tasksData[0];
    const result = applyDailyRewards({
      dayReturn: 60,
      weights: { tech: 50, bond: 50 },
      day: 0,
      task,
      taskGoals,
      badges: [],
      history: [],
      allowedAssets: ['tech', 'bond'],
      eventId: 123,
      effect: 'effect',
    });
    expect(result.coins).toBe(80);
    expect(result.gems).toBe(2);
    expect(result.stars).toBe(1);
    expect(result.newBadges).toContain('分散者');
    expect(result.historyEntry).toMatchObject({
      day: 1,
      eventId: 123,
      effect: 'effect',
      returns: 60,
      taskId: task.id,
      taskCompleted: true,
    });
    expect(result.lastTaskResult).toMatchObject({ title: task.title, completed: true });
  });
});

describe('maybeTriggerEncounter', () => {
  it('returns easter egg encounter', () => {
    vi.spyOn(logic, 'checkEasterEgg').mockReturnValue(true);
    const res = maybeTriggerEncounter([], [], []);
    expect(res).toEqual({
      type: 'easterEgg',
      message: EASTER_EGG_MESSAGE,
      coins: 10,
      gems: 1,
      returnsBonus: 5,
    });
  });

  it('returns dilemma encounter', () => {
    vi.spyOn(logic, 'checkEasterEgg').mockReturnValue(false);
    const dilemma: Dilemma = { text: 'q', options: [], icon: '' };
    vi.spyOn(logic, 'generateRandomDilemma').mockReturnValue(dilemma);
    const res = maybeTriggerEncounter([dilemma], [], []);
    expect(res).toEqual({ type: 'dilemma', dilemma, index: 0 });
  });

  it('returns quiz encounter', () => {
    vi.spyOn(logic, 'checkEasterEgg').mockReturnValue(false);
    vi.spyOn(logic, 'generateRandomDilemma').mockReturnValue(null);
    const quiz = { question: 'q', options: ['a'], answer: 'a' };
    vi.spyOn(logic, 'generateRandomQuiz').mockReturnValue(quiz);
    const res = maybeTriggerEncounter([], [], [quiz]);
    expect(res).toEqual({ type: 'quiz', quiz });
  });
});
