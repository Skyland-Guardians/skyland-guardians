import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';

vi.mock('../../utils/daily-helpers', () => ({
  resolveEventChoice: vi.fn(() => ({
    result: {
      returns: 0,
      volatility: 0,
      drawdown: 0,
      portfolioValue: 1,
      peakValue: 1,
    },
    effect: undefined,
    updatedEvent: { id: 1 },
  })),
  applyDailyRewards: vi.fn(() => ({
    coins: 0,
    gems: 0,
    stars: 0,
    newBadges: [],
    historyEntry: {},
    lastTaskResult: null,
  })),
  maybeTriggerEncounter: vi.fn(() => null),
}));

import { useGameState } from '../useGameState';

const testEvent = {
  id: 1,
  name: 'Test',
  description: 'Test event',
  affected: ['tech'],
  impactRange: { tech: [0, 0] },
  probability: 1,
  choices: [
    { text: 'opt', impactRange: { tech: [0, 0] }, effect: 'none' },
  ],
};

describe('nextDay wheelUsed reset', () => {
  it('resets wheelUsed after resolving event choice', () => {
    const { result } = renderHook(() => useGameState());

    act(() => {
      result.current.setWheelUsed(true);
      result.current.setEvent(testEvent as any);
    });

    act(() => {
      result.current.nextDay(0);
    });

    expect(result.current.wheelUsed).toBe(false);
  });

  it('resets wheelUsed when progressing without event choice', () => {
    const { result } = renderHook(() => useGameState());

    act(() => {
      result.current.setWheelUsed(true);
    });

    act(() => {
      result.current.nextDay();
    });

    expect(result.current.wheelUsed).toBe(false);
  });
});
