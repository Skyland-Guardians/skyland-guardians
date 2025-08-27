import { SIMULATED_DAYS } from './simulated-asset-series';

export type MarketMode = 'simulated' | 'random' | 'real';

export const DEFAULT_MARKET_CONFIG = {
  mode: 'simulated' as MarketMode,
  seed: 12345,
  wrapMode: 'loop' as 'loop' | 'halt',
  simulatedDays: SIMULATED_DAYS
};
