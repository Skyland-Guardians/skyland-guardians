// Daily flow helper functions

import type { Asset, MarketEvent, Task, GameHistory } from '../types';
import {
  calculateDailyReturns,
  checkBadgeEligibility,
  calculateResourceRewards,
  sanitizeWeights,
} from './game-logic';
import type { TaskGoal } from '../constants/task-goals';
import { EASTER_EGG_MESSAGE } from '../constants/game-config';
import { checkEasterEgg, generateRandomDilemma, generateRandomQuiz } from './game-logic';
import type { Dilemma } from '../types';

export interface ResolveEventChoiceParams {
  event: MarketEvent;
  choiceIndex: number;
  weights: Record<string, number>;
  assets: Asset[];
  portfolioValue: number;
  peakValue: number;
}

export function resolveEventChoice({
  event,
  choiceIndex,
  weights,
  assets,
  portfolioValue,
  peakValue,
}: ResolveEventChoiceParams) {
  const choice = event.choices![choiceIndex];
  const selectedEvent: MarketEvent = { ...event, impactRange: choice.impactRange, choices: undefined };
  const result = calculateDailyReturns(weights, assets, selectedEvent, portfolioValue, peakValue);
  return { result, effect: choice.effect, updatedEvent: selectedEvent };
}

export interface ApplyDailyRewardsParams {
  dayReturn: number;
  weights: Record<string, number>;
  day: number;
  task: Task;
  taskGoals: Record<number, TaskGoal>;
  badges: string[];
  history: GameHistory[];
  allowedAssets: string[];
  eventId?: number;
  effect?: string;
}

export function applyDailyRewards({
  dayReturn,
  weights,
  day,
  task,
  taskGoals,
  badges,
  history,
  allowedAssets,
  eventId,
  effect,
}: ApplyDailyRewardsParams) {
  const { coins, gems } = calculateResourceRewards(dayReturn);
  const stars = dayReturn > 0 ? 1 : 0;

  const goal = taskGoals[task.id];
  let taskCompleted = false;
  let rewardCoins = 0;
  let rewardGems = 0;
  if (goal && goal.check(weights)) {
    taskCompleted = true;
    rewardCoins = goal.reward.coins;
    rewardGems = goal.reward.gems;
  }

  const earnedBadges = checkBadgeEligibility(weights, history, dayReturn, badges);
  let newBadges = Array.from(new Set([...badges, ...earnedBadges]));
  if (goal && taskCompleted && goal.reward.badge && !newBadges.includes(goal.reward.badge)) {
    newBadges.push(goal.reward.badge);
  }

  const sanitizedWeights = sanitizeWeights(weights, allowedAssets);

  const historyEntry = {
    day: day + 1,
    weights: { ...sanitizedWeights },
    eventId,
    effect,
    returns: dayReturn,
    taskId: task.id,
    taskCompleted,
    reward: taskCompleted ? goal.reward : undefined,
  };

  const lastTaskResult = goal
    ? { title: task.title, completed: taskCompleted, reward: goal.reward }
    : null;

  return {
    coins: coins + rewardCoins,
    gems: gems + rewardGems,
    stars,
    newBadges,
    historyEntry,
    lastTaskResult,
  };
}

export interface EncounterResult {
  type: 'easterEgg' | 'dilemma' | 'quiz';
  message?: string;
  coins?: number;
  gems?: number;
  returnsBonus?: number;
  dilemma?: Dilemma;
  index?: number;
  quiz?: any;
}

export function maybeTriggerEncounter(
  dilemmas: Dilemma[],
  completed: number[],
  quizzes: any[],
): EncounterResult | null {
  if (checkEasterEgg()) {
    return {
      type: 'easterEgg',
      message: EASTER_EGG_MESSAGE,
      coins: 10,
      gems: 1,
      returnsBonus: 5,
    };
  }

  const randomDilemma = generateRandomDilemma(dilemmas, completed);
  if (randomDilemma) {
    const idx = dilemmas.indexOf(randomDilemma);
    return { type: 'dilemma', dilemma: randomDilemma, index: idx };
  }

  const randomQuiz = generateRandomQuiz(quizzes);
  if (randomQuiz) {
    return { type: 'quiz', quiz: randomQuiz };
  }

  return null;
}
