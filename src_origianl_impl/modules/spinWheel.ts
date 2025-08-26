import type { Dispatch, SetStateAction } from 'react';
import { GAME_CONFIG } from '../constants/game-config';

type EffectFn = (
  setReturns: Dispatch<SetStateAction<number | null>>,
  setBadges: Dispatch<SetStateAction<string[]>>
) => void;

type EffectKey = (typeof GAME_CONFIG.WHEEL_OUTCOMES)[number]['effect'];

// Map configuration effect keys to their implementation
const EFFECTS: Record<EffectKey, EffectFn> = {
  returns_plus_10: (setReturns, _setBadges) =>
    setReturns((r) => (r !== null ? r + 10 : 10)),
  returns_minus_10: (setReturns, _setBadges) =>
    setReturns((r) => (r !== null ? r - 10 : -10)),
  badge_diversifier: (_setReturns, setBadges) =>
    setBadges((b) => (b.includes('分散者') ? b : [...b, '分散者'])),
  risk_increase: (setReturns, _setBadges) =>
    setReturns((r) => (r !== null ? r - 5 : -5)),
  badge_knowledge_master: (_setReturns, setBadges) =>
    setBadges((b) => (b.includes('知识大师') ? b : [...b, '知识大师'])),
  no_change: (_setReturns, _setBadges) => {},
};

interface SpinWheelHandlers {
  setReturns: Dispatch<SetStateAction<number | null>>;
  setBadges: Dispatch<SetStateAction<string[]>>;
  setWheelResult: Dispatch<SetStateAction<string | null>>;
  setWheelUsed: Dispatch<SetStateAction<boolean>>;
  setWheelOpen: Dispatch<SetStateAction<boolean>>;
}

// Handle the spin wheel action
export const handleSpinWheel = ({
  setReturns,
  setBadges,
  setWheelResult,
  setWheelUsed,
  setWheelOpen,
}: SpinWheelHandlers) => {
  const outcomes = GAME_CONFIG.WHEEL_OUTCOMES;
  const idx = Math.floor(Math.random() * outcomes.length);
  const outcome = outcomes[idx];
  setWheelResult(outcome.label);
  EFFECTS[outcome.effect](setReturns, setBadges);
  setWheelUsed(true);
  setTimeout(() => {
    setWheelOpen(false);
    setWheelResult(null);
  }, 1800);
};

