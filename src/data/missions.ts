import type { Mission, AssetType } from '../types/game';

export interface MissionConfig {
  id: number;
  title: string;
  background: string;
  tip: string;
  focus: string;
  rewardStars: number;
  targetAssets: string[];
  targetAllocation: number;
  completionDescription: string; // 新增：用户友好的完成条件描述
  completionCheck: (assetAllocations: AssetType[]) => boolean;
}

// Mission configurations with all logic
export const MISSION_CONFIGS: MissionConfig[] = [
  {
    id: 1,
    title: 'Diversification Challenge',
    background: 'Tech stock prices are swinging wildly! Manage concentration risk by keeping individual high-risk allocations under control.',
    tip: 'Keep each high-risk asset (Tech Sword & Magic Crystal) below 40% to maintain diversification.',
    focus: 'Concentration Risk Management',
    rewardStars: 3,
    targetAssets: ['sword', 'crystal'],
    targetAllocation: 40, // 表示每个资产不超过40%
    completionDescription: '🎯 Agile Sword < 40% AND Mystic Crystal < 40%',
    completionCheck: (assetAllocations: AssetType[]) => {
      // Check that EACH high-risk asset is below 40% (diversification goal)
      const swordAsset = assetAllocations.find(a => a.id === 'sword');
      const crystalAsset = assetAllocations.find(a => a.id === 'crystal');
      
      const swordAllocation = swordAsset?.allocation || 0;
      const crystalAllocation = crystalAsset?.allocation || 0;
      
      // Both must be under 40% for diversification
      return swordAllocation < 40 && crystalAllocation < 40;
    }
  },
  {
    id: 2,
    title: 'Green Mission',
    background: 'Environmental themes are heating up. Will you add ESG assets?',
    tip: 'Allocate a portion to ESG to support sustainability.',
    focus: 'ESG Investing',
    rewardStars: 4,
    targetAssets: ['forest'],
    targetAllocation: 20,
    completionDescription: '🌳 Green Grove ≥ 20%',
    completionCheck: (assetAllocations: AssetType[]) => {
      const forestAsset = assetAllocations.find(a => a.id === 'forest');
      return (forestAsset?.allocation || 0) >= 20;
    }
  },
  {
    id: 3,
    title: 'Safe Haven Challenge',
    background: 'Market volatility is increasing. Will you add gold?',
    tip: 'Gold often provides protection during turbulent times.',
    focus: 'Safe Haven Assets',
    rewardStars: 2,
    targetAssets: ['golden', 'shield'],
    targetAllocation: 35,
    completionDescription: '🛡️ Golden Temple + Sturdy Shield ≥ 35% (combined)',
    completionCheck: (assetAllocations: AssetType[]) => {
      const safeHavenAllocation = ['golden', 'shield'].reduce((sum, assetId) => {
        const asset = assetAllocations.find(a => a.id === assetId);
        return sum + (asset?.allocation || 0);
      }, 0);
      return safeHavenAllocation >= 35;
    }
  },
  {
    id: 4,
    title: 'Keep Funds Stable',
    background: 'A market storm is coming. Will you increase stablecoins?',
    tip: 'Stablecoins have very low volatility and act as a harbor.',
    focus: 'Liquidity Management',
    rewardStars: 5,
    targetAssets: ['fountain'],
    targetAllocation: 15,
    completionDescription: '⛲ Calm Fountain ≥ 15%',
    completionCheck: (assetAllocations: AssetType[]) => {
      const fountainAsset = assetAllocations.find(a => a.id === 'fountain');
      return (fountainAsset?.allocation || 0) >= 15;
    }
  },
  {
    id: 5,
    title: 'Yield Harvest',
    background: 'The yield temple is said to generate gold automatically. Will you invest?',
    tip: 'Allocate to yield assets to experience passive income.',
    focus: 'Yield Strategy',
    rewardStars: 1,
    targetAssets: ['yield'],
    targetAllocation: 25,
    completionDescription: '🏛️ Temple of Yield ≥ 25%',
    completionCheck: (assetAllocations: AssetType[]) => {
      const yieldAsset = assetAllocations.find(a => a.id === 'yield');
      return (yieldAsset?.allocation || 0) >= 25;
    }
  }
];

// Legacy export for backward compatibility
export const MISSIONS: Mission[] = MISSION_CONFIGS.map(config => ({
  id: config.id,
  title: config.title,
  background: config.background,
  tip: config.tip,
  focus: config.focus,
  rewardStars: config.rewardStars
}));

// Mission utility functions
export class MissionManager {
  static createMission(missionId: number): Mission | null {
    const config = MISSION_CONFIGS.find(c => c.id === missionId);
    if (!config) return null;

    return {
      id: config.id,
      title: config.title,
      background: config.background,
      tip: config.tip,
      focus: config.focus,
      rewardStars: config.rewardStars,
      status: 'pending',
      targetAssets: config.targetAssets,
      targetAllocation: config.targetAllocation,
      completionDescription: config.completionDescription
    };
  }

  static checkCompletion(missionId: number, assetAllocations: AssetType[]): boolean {
    const config = MISSION_CONFIGS.find(c => c.id === missionId);
    if (!config) return false;
    return config.completionCheck(assetAllocations);
  }

  static getAllConfigs(): MissionConfig[] {
    return MISSION_CONFIGS;
  }

  static getConfig(missionId: number): MissionConfig | undefined {
    return MISSION_CONFIGS.find(c => c.id === missionId);
  }
}
