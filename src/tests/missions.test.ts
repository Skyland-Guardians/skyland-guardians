import { describe, it, expect } from 'vitest';
import { MissionManager, MISSION_CONFIGS } from '../data/missions';
import type { AssetType } from '../types/game';

// 模拟资产配置数据
const createMockAssetAllocations = (allocations: Record<string, number>): AssetType[] => {
  const defaultAssets = [
    { id: 'sword', name: 'Tech Sword', allocation: 0 },
    { id: 'crystal', name: 'Magic Crystal', allocation: 0 },
    { id: 'forest', name: 'Green Forest', allocation: 0 },
    { id: 'golden', name: 'Golden Shield', allocation: 0 },
    { id: 'shield', name: 'Defense Shield', allocation: 0 },
    { id: 'fountain', name: 'Stable Fountain', allocation: 0 },
    { id: 'yield', name: 'Yield Temple', allocation: 0 },
    { id: 'magic', name: 'Magic Wand', allocation: 0 }
  ];

  return defaultAssets.map(asset => ({
    ...asset,
    allocation: allocations[asset.id] || 0,
    shortName: asset.name,
    icon: `${asset.id}.png`,
    type: asset.id as any,
    theme: 'default'
  }));
};

describe('Mission System Tests', () => {
  describe('MissionManager', () => {
    it('should create a mission from config', () => {
      const mission = MissionManager.createMission(1);
      
      expect(mission).toBeDefined();
      expect(mission?.id).toBe(1);
      expect(mission?.title).toBe('Diversification Challenge');
      expect(mission?.status).toBe('pending');
      expect(mission?.rewardStars).toBe(3);
    });

    it('should return null for invalid mission ID', () => {
      const mission = MissionManager.createMission(999);
      expect(mission).toBeNull();
    });

    it('should get all mission configs', () => {
      const configs = MissionManager.getAllConfigs();
      expect(configs).toBeDefined();
      expect(configs.length).toBeGreaterThan(0);
      expect(configs[0]).toHaveProperty('id');
      expect(configs[0]).toHaveProperty('title');
      expect(configs[0]).toHaveProperty('completionCheck');
    });

    it('should get specific mission config', () => {
      const config = MissionManager.getConfig(1);
      expect(config).toBeDefined();
      expect(config?.id).toBe(1);
      
      const invalidConfig = MissionManager.getConfig(999);
      expect(invalidConfig).toBeUndefined();
    });
  });

  describe('Mission Completion Logic', () => {
    describe('Mission 1: Diversification Challenge', () => {
      it('should complete when both sword and crystal are under 40%', () => {
        const allocations = createMockAssetAllocations({
          sword: 35,
          crystal: 30,
          forest: 20,
          golden: 15
        });

        const isCompleted = MissionManager.checkCompletion(1, allocations);
        expect(isCompleted).toBe(true);
      });

      it('should not complete when sword exceeds 40%', () => {
        const allocations = createMockAssetAllocations({
          sword: 45, // 超过40%
          crystal: 30,
          forest: 25
        });

        const isCompleted = MissionManager.checkCompletion(1, allocations);
        expect(isCompleted).toBe(false);
      });

      it('should not complete when crystal exceeds 40%', () => {
        const allocations = createMockAssetAllocations({
          sword: 35,
          crystal: 45, // 超过40%
          forest: 20
        });

        const isCompleted = MissionManager.checkCompletion(1, allocations);
        expect(isCompleted).toBe(false);
      });

      it('should not complete when both exceed 40%', () => {
        const allocations = createMockAssetAllocations({
          sword: 45,
          crystal: 45,
          forest: 10
        });

        const isCompleted = MissionManager.checkCompletion(1, allocations);
        expect(isCompleted).toBe(false);
      });

      it('should handle edge case exactly at 40%', () => {
        const allocations = createMockAssetAllocations({
          sword: 40, // 正好40%，应该不满足 < 40 的条件
          crystal: 30,
          forest: 30
        });

        const isCompleted = MissionManager.checkCompletion(1, allocations);
        expect(isCompleted).toBe(false);
      });
    });

    describe('Mission 2: Green Mission', () => {
      it('should complete when forest allocation >= 20%', () => {
        const allocations = createMockAssetAllocations({
          forest: 25,
          sword: 40,
          crystal: 35
        });

        const isCompleted = MissionManager.checkCompletion(2, allocations);
        expect(isCompleted).toBe(true);
      });

      it('should not complete when forest allocation < 20%', () => {
        const allocations = createMockAssetAllocations({
          forest: 15, // 小于20%
          sword: 45,
          crystal: 40
        });

        const isCompleted = MissionManager.checkCompletion(2, allocations);
        expect(isCompleted).toBe(false);
      });

      it('should handle edge case exactly at 20%', () => {
        const allocations = createMockAssetAllocations({
          forest: 20, // 正好20%，应该满足 >= 20 的条件
          sword: 40,
          crystal: 40
        });

        const isCompleted = MissionManager.checkCompletion(2, allocations);
        expect(isCompleted).toBe(true);
      });
    });

    describe('Mission 3: Safe Haven Challenge', () => {
      it('should complete when golden + shield >= 35%', () => {
        const allocations = createMockAssetAllocations({
          golden: 20,
          shield: 20, // 总共40%
          sword: 30,
          crystal: 30
        });

        const isCompleted = MissionManager.checkCompletion(3, allocations);
        expect(isCompleted).toBe(true);
      });

      it('should not complete when golden + shield < 35%', () => {
        const allocations = createMockAssetAllocations({
          golden: 15,
          shield: 15, // 总共30%
          sword: 35,
          crystal: 35
        });

        const isCompleted = MissionManager.checkCompletion(3, allocations);
        expect(isCompleted).toBe(false);
      });

      it('should handle single asset meeting requirement', () => {
        const allocations = createMockAssetAllocations({
          golden: 40, // 单个资产就满足要求
          shield: 0,
          sword: 30,
          crystal: 30
        });

        const isCompleted = MissionManager.checkCompletion(3, allocations);
        expect(isCompleted).toBe(true);
      });
    });

    describe('Mission 4: Keep Funds Stable', () => {
      it('should complete when fountain >= 15%', () => {
        const allocations = createMockAssetAllocations({
          fountain: 20,
          sword: 40,
          crystal: 40
        });

        const isCompleted = MissionManager.checkCompletion(4, allocations);
        expect(isCompleted).toBe(true);
      });

      it('should not complete when fountain < 15%', () => {
        const allocations = createMockAssetAllocations({
          fountain: 10,
          sword: 45,
          crystal: 45
        });

        const isCompleted = MissionManager.checkCompletion(4, allocations);
        expect(isCompleted).toBe(false);
      });
    });

    describe('Mission 5: Yield Harvest', () => {
      it('should complete when yield >= 25%', () => {
        const allocations = createMockAssetAllocations({
          yield: 30,
          sword: 35,
          crystal: 35
        });

        const isCompleted = MissionManager.checkCompletion(5, allocations);
        expect(isCompleted).toBe(true);
      });

      it('should not complete when yield < 25%', () => {
        const allocations = createMockAssetAllocations({
          yield: 20,
          sword: 40,
          crystal: 40
        });

        const isCompleted = MissionManager.checkCompletion(5, allocations);
        expect(isCompleted).toBe(false);
      });
    });
  });

  describe('Mission Configs Validation', () => {
    it('should have valid configuration for all missions', () => {
      MISSION_CONFIGS.forEach(config => {
        expect(config.id).toBeGreaterThan(0);
        expect(config.title).toBeTruthy();
        expect(config.background).toBeTruthy();
        expect(config.tip).toBeTruthy();
        expect(config.focus).toBeTruthy();
        expect(config.rewardStars).toBeGreaterThan(0);
        expect(config.targetAssets).toBeInstanceOf(Array);
        expect(config.targetAllocation).toBeGreaterThan(0);
        expect(typeof config.completionCheck).toBe('function');
      });
    });

    it('should have unique mission IDs', () => {
      const ids = MISSION_CONFIGS.map(config => config.id);
      const uniqueIds = [...new Set(ids)];
      expect(ids.length).toBe(uniqueIds.length);
    });
  });
});