// Market event definitions with optional icons
import { MarketEvent } from '../types';

export const events: MarketEvent[] = [
  {
    id: 1,
    name: '科技泡沫',
    affected: ['tech', 'crypto'],
    impactRange: { tech: [-0.15, -0.05], crypto: [-0.10, -0.03] },
    probability: 0.1,
    description: '科技股和加密货币遭遇泡沫，价格大幅下跌。',
    icon: '/images/events/tech-bubble.png',
    choices: [
      {
        text: '政府出手干预',
        effect: '损失减半',
        impactRange: { tech: [-0.08, -0.04], crypto: [-0.05, -0.02] }
      },
      {
        text: '任其泡沫破裂',
        effect: '市场自由调整',
        impactRange: { tech: [-0.20, -0.10], crypto: [-0.15, -0.08] }
      }
    ],
  },
  {
    id: 2,
    name: '避险情绪升温',
    affected: ['gold'],
    impactRange: { gold: [0.02, 0.07] },
    probability: 0.08,
    description: '市场动荡，黄金作为避险资产受到追捧。',
    icon: '/images/events/gold-rally.png',
  },
  {
    id: 3,
    name: '科技牛市',
    affected: ['tech', 'crypto'],
    impactRange: { tech: [0.05, 0.15], crypto: [0.03, 0.10] },
    probability: 0.12,
    description: '科技股和加密货币迎来牛市，价格大幅上涨。',
    icon: '/images/events/tech-bull.png',
  },
  {
    id: 4,
    name: '债券利好',
    affected: ['bond'],
    impactRange: { bond: [0.02, 0.08] },
    probability: 0.10,
    description: '债券市场利好，收益提升。',
    icon: '/images/events/bond-rally.png',
  },
  {
    id: 5,
    name: '黄金暴跌',
    affected: ['gold'],
    impactRange: { gold: [-0.10, -0.04] },
    probability: 0.07,
    description: '避险情绪下降，黄金价格走弱。',
    icon: '/images/events/gold-crash.png',
  },
  {
    id: 6,
    name: '加密波动',
    affected: ['crypto'],
    impactRange: { crypto: [-0.20, 0.20] },
    probability: 0.15,
    description: '加密货币剧烈波动，风险与机会并存。',
    icon: '/images/events/crypto-swing.png',
  },
  {
    id: 7,
    name: '绿色政策利好',
    affected: ['esg'],
    impactRange: { esg: [0.03, 0.08] },
    probability: 0.07,
    description: '环保政策推动 ESG 资产上涨。',
    icon: '/images/events/esg-boom.png',
  },
  {
    id: 8,
    name: '稳定币流动性',
    affected: ['stablecoin'],
    impactRange: { stablecoin: [-0.005, 0.005] },
    probability: 0.05,
    description: '市场动荡中，稳定币表现平稳，资金涌入。',
    icon: '/images/events/stablecoin-flow.png',
  },
  {
    id: 9,
    name: '收益率飙升',
    affected: ['yield'],
    impactRange: { yield: [0.04, 0.10] },
    probability: 0.06,
    description: '收益资产年化提升，吸引更多投入。',
    icon: '/images/events/yield-boom.png',
  },
];

