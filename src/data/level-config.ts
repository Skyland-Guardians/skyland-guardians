/**
 * 等级系统配置
 * 定义星星数量和等级的关系
 */

export interface LevelConfig {
  level: number;
  requiredStars: number; // 升到这个等级需要的总星星数
  starsToNext: number; // 到下一级需要的星星数
  title: string; // 等级称号
  description: string; // 等级描述
  unlocks?: string[]; // 解锁的功能
}

// 等级配置表
export const LEVEL_CONFIGS: LevelConfig[] = [
  {
    level: 1,
    requiredStars: 0,
    starsToNext: 5,
    title: 'Novice Guardian',
    description: 'Just starting your journey in Skyland.',
    unlocks: ['Basic Asset Allocation']
  },
  {
    level: 2,
    requiredStars: 5,
    starsToNext: 8,
    title: 'Apprentice Investor',
    description: 'Learning the basics of portfolio management.',
    unlocks: ['Mission System', 'AI Advisor']
  },
  {
    level: 3,
    requiredStars: 13,
    starsToNext: 12,
    title: 'Skilled Trader',
    description: 'Developing advanced investment strategies.',
    unlocks: ['Event System', 'Market Analytics']
  },
  {
    level: 4,
    requiredStars: 25,
    starsToNext: 15,
    title: 'Expert Strategist',
    description: 'Mastering complex portfolio strategies.',
    unlocks: ['Advanced Missions', 'Risk Analytics']
  },
  {
    level: 5,
    requiredStars: 40,
    starsToNext: 20,
    title: 'Portfolio Master',
    description: 'Achieving exceptional investment performance.',
    unlocks: ['Legendary Missions', 'Market Prediction']
  },
  {
    level: 6,
    requiredStars: 60,
    starsToNext: 25,
    title: 'Financial Sage',
    description: 'Wisdom guides your every investment decision.',
    unlocks: ['Epic Events', 'Custom Strategies']
  },
  {
    level: 7,
    requiredStars: 85,
    starsToNext: 30,
    title: 'Wealth Guardian',
    description: 'Protecting and growing wealth across all markets.',
    unlocks: ['Guardian Missions', 'Market Creation']
  },
  {
    level: 8,
    requiredStars: 115,
    starsToNext: 35,
    title: 'Sky Lord',
    description: 'Ruling the financial skies with supreme skill.',
    unlocks: ['Lord Powers', 'Time Manipulation']
  },
  {
    level: 9,
    requiredStars: 150,
    starsToNext: 40,
    title: 'Legendary Investor',
    description: 'Your investment legend echoes through the ages.',
    unlocks: ['Legendary Powers', 'Reality Shaping']
  },
  {
    level: 10,
    requiredStars: 190,
    starsToNext: 0, // Max level
    title: 'Supreme Guardian',
    description: 'The ultimate master of Skyland\'s financial realm.',
    unlocks: ['Supreme Authority', 'Infinite Wisdom']
  }
];

/**
 * 等级管理器
 */
export class LevelManager {
  /**
   * 根据星星数计算当前等级
   */
  static calculateLevel(stars: number): number {
    for (let i = LEVEL_CONFIGS.length - 1; i >= 0; i--) {
      if (stars >= LEVEL_CONFIGS[i].requiredStars) {
        return LEVEL_CONFIGS[i].level;
      }
    }
    return 1; // 最低等级
  }

  /**
   * 获取等级配置
   */
  static getLevelConfig(level: number): LevelConfig | undefined {
    return LEVEL_CONFIGS.find(config => config.level === level);
  }

  /**
   * 获取当前等级的进度信息
   */
  static getLevelProgress(stars: number): {
    currentLevel: number;
    currentLevelConfig: LevelConfig;
    nextLevelConfig: LevelConfig | null;
    progressStars: number; // 当前等级已获得的星星
    starsToNext: number; // 到下一级需要的星星
    progressPercentage: number; // 进度百分比 (0-100)
  } {
    const currentLevel = this.calculateLevel(stars);
    const currentLevelConfig = this.getLevelConfig(currentLevel)!;
    const nextLevelConfig = this.getLevelConfig(currentLevel + 1);
    
    const progressStars = stars - currentLevelConfig.requiredStars;
    const starsToNext = nextLevelConfig 
      ? nextLevelConfig.requiredStars - stars 
      : 0;
    
    const progressPercentage = nextLevelConfig
      ? (progressStars / (nextLevelConfig.requiredStars - currentLevelConfig.requiredStars)) * 100
      : 100;

    return {
      currentLevel,
      currentLevelConfig,
      nextLevelConfig: nextLevelConfig || null,
      progressStars,
      starsToNext,
      progressPercentage
    };
  }

  /**
   * 检查是否升级了
   */
  static checkLevelUp(oldStars: number, newStars: number): {
    leveledUp: boolean;
    oldLevel: number;
    newLevel: number;
    newLevelConfig?: LevelConfig;
  } {
    const oldLevel = this.calculateLevel(oldStars);
    const newLevel = this.calculateLevel(newStars);
    
    return {
      leveledUp: newLevel > oldLevel,
      oldLevel,
      newLevel,
      newLevelConfig: newLevel > oldLevel ? this.getLevelConfig(newLevel) : undefined
    };
  }

  /**
   * 获取所有等级配置
   */
  static getAllLevels(): LevelConfig[] {
    return LEVEL_CONFIGS;
  }
}