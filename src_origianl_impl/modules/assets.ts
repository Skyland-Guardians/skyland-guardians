// Game asset definitions with optional icons
import { Asset } from '../types';

export const assets: Asset[] = [
  {
    key: 'tech',
    name: '科技股',
    expectedReturn: 0.08,
    volatility: 0.15,
    description: '以科技行业为主题的资产',
    icon: '/images/assets/tech.png',
  },
  {
    key: 'bond',
    name: '债券',
    expectedReturn: 0.03,
    volatility: 0.05,
    description: '相对稳定的债券资产',
    icon: '/images/assets/bond.png',
  },
  {
    key: 'esg',
    name: 'ESG 资产',
    expectedReturn: 0.06,
    volatility: 0.10,
    description: '关注环境与社会责任的资产',
    icon: '/images/assets/esg.png',
  },
  {
    key: 'gold',
    name: '黄金',
    expectedReturn: 0.04,
    volatility: 0.07,
    description: '具有避险属性的黄金资产',
    icon: '/images/assets/gold.png',
  },
  {
    key: 'stablecoin',
    name: '稳定币',
    expectedReturn: 0.02,
    volatility: 0.01,
    description: '波动极低的稳定币资产',
    icon: '/images/assets/stablecoin.png',
  },
  {
    key: 'yield',
    name: '收益资产',
    expectedReturn: 0.07,
    volatility: 0.12,
    description: '提供被动收益的资产',
    icon: '/images/assets/yield.png',
  },
  {
    key: 'crypto',
    name: '加密货币',
    expectedReturn: 0.12,
    volatility: 0.25,
    description: '高波动性的加密资产',
    icon: '/images/assets/crypto.png',
  },
];

