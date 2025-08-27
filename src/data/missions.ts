import type { Mission } from '../types/game';

export const MISSIONS: Mission[] = [
  {
    id: 1,
    title: 'Tech Forest Fog',
    background: 'Unicorn stock prices swing wildly. Will you increase the allocation?',
    tip: 'Tech stocks are highly volatile. Keep your portfolio diversified.',
    focus: 'Concentration Risk',
    rewardStars: 3
  },
  {
    id: 2,
    title: 'Green Mission',
    background: 'Environmental themes are heating up. Will you add ESG assets?',
    tip: 'Allocate a portion to ESG to support sustainability.',
    focus: 'ESG Investing',
    rewardStars: 4
  },
  {
    id: 3,
    title: 'Safe Haven Challenge',
    background: 'Market volatility is increasing. Will you add gold?',
    tip: 'Gold often provides protection during turbulent times.',
    focus: 'Safe Haven Assets',
    rewardStars: 2
  },
  {
    id: 4,
    title: 'Keep Funds Stable',
    background: 'A market storm is coming. Will you increase stablecoins?',
    tip: 'Stablecoins have very low volatility and act as a harbor.',
    focus: 'Liquidity Management',
    rewardStars: 5
  },
  {
    id: 5,
    title: 'Yield Harvest',
    background: 'The yield temple is said to generate gold automatically. Will you invest?',
    tip: 'Allocate to yield assets to experience passive income.',
    focus: 'Yield Strategy',
    rewardStars: 1
  }
];
