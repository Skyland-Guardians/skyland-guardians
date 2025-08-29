// 成就检查器 - 用于检查和触发成就
import type { AssetType } from '../types/game';
import { achievements } from '../data/achievements';
import { achievementService } from './achievement-service';

export class AchievementChecker {
  
  // 检查单个资产分配不超过50%的成就
  private checkBalanceApprentice(allocations: AssetType[]): boolean {
    return allocations.every(asset => asset.allocation <= 50);
  }

  // 检查多样化投资（超过3种资产）的成就
  private checkDiversificationExplorer(allocations: AssetType[]): boolean {
    const activeAssets = allocations.filter(asset => asset.allocation > 0);
    return activeAssets.length >= 3;
  }

  // 检查资产组合平衡度（各资产分配相对均衡）
  private checkPortfolioBalance(allocations: AssetType[]): boolean {
    const activeAssets = allocations.filter(asset => asset.allocation > 0);
    if (activeAssets.length < 2) return false;
    
    const maxAllocation = Math.max(...activeAssets.map(a => a.allocation));
    const minAllocation = Math.min(...activeAssets.map(a => a.allocation));
    
    // 最大和最小分配的差距不超过30%
    return (maxAllocation - minAllocation) <= 30;
  }

  // 检查长期持有策略（连续多天保持相似配置）
  private checkLongTermStrategy(allocations: AssetType[]): boolean {
    // 这个需要游戏状态历史，暂时简化为检查是否有合理的长期资产配置
    const bondAssets = allocations.filter(a => 
      a.id === 'shield' || a.id === 'golden' // 债券类资产
    );
    const totalBonds = bondAssets.reduce((sum, a) => sum + a.allocation, 0);
    return totalBonds >= 25; // 债券配置超过25%
  }

  // 检查风险管理（低风险资产占比合理）
  private checkRiskManagement(allocations: AssetType[]): boolean {
    const safeAssets = allocations.filter(a => 
      a.id === 'shield' || a.id === 'golden' || a.id === 'yield' // 安全资产
    );
    const totalSafe = safeAssets.reduce((sum, a) => sum + a.allocation, 0);
    return totalSafe >= 40; // 安全资产占比40%以上
  }

  // 检查增长策略（高增长资产配置）
  private checkGrowthStrategy(allocations: AssetType[]): boolean {
    const growthAssets = allocations.filter(a => 
      a.id === 'sword' || a.id === 'forest' || a.id === 'crystal' // 增长类资产
    );
    const totalGrowth = growthAssets.reduce((sum, a) => sum + a.allocation, 0);
    return totalGrowth >= 50; // 增长资产占比50%以上
  }

  // 主要检查函数
  checkAchievements(allocations: AssetType[], stars: number = 0): string[] {
    const newAchievements: string[] = [];

    // 首先检查资产分配总和是否为100%
    const totalAllocation = allocations.reduce((sum, asset) => sum + asset.allocation, 0);
    if (Math.abs(totalAllocation - 100) > 0.1) {
      console.log(`⚠️ Achievement check skipped: Total allocation is ${totalAllocation.toFixed(1)}%, not 100%`);
      return newAchievements; // 如果总和不是100%，不检查任何成就
    }

    // 定义成就检查规则
    const achievementChecks = [
      {
        id: 'badge_1',
        check: () => this.checkBalanceApprentice(allocations),
        name: 'BALANCE APPRENTICE'
      },
      {
        id: 'badge_2', 
        check: () => this.checkDiversificationExplorer(allocations),
        name: 'DIVERSIFICATION EXPLORER'
      },
      {
        id: 'badge_3',
        check: () => this.checkPortfolioBalance(allocations),
        name: 'PORTFOLIO BALANCE MASTER'
      },
      {
        id: 'badge_4',
        check: () => this.checkLongTermStrategy(allocations),
        name: 'LONG TERM STRATEGIST'
      },
      {
        id: 'badge_5',
        check: () => this.checkRiskManagement(allocations),
        name: 'RISK MANAGER'
      },
      {
        id: 'badge_6',
        check: () => this.checkGrowthStrategy(allocations),
        name: 'GROWTH SEEKER'
      },
      {
        id: 'badge_7',
        check: () => stars >= 10,
        name: 'STAR COLLECTOR'
      },
      {
        id: 'badge_8',
        check: () => stars >= 25,
        name: 'CONSTELLATION MASTER'
      },
      {
        id: 'badge_9',
        check: () => stars >= 50,
        name: 'STELLAR LEGEND'
      },
      {
        id: 'badge_10',
        check: () => stars >= 100,
        name: 'COSMIC GUARDIAN'
      }
    ];

    // 检查每个成就
    achievementChecks.forEach(({ id, check, name }) => {
      if (!achievementService.hasAchievement(id) && check()) {
        const achievement = achievements.find(a => a.id === id);
        if (achievement) {
          achievementService.achieve(
            id, 
            achievement.starRating, 
            achievement.trophyGrade
          );
          newAchievements.push(id);
          
          console.log(`🏆 Achievement Unlocked: ${name}`);
        }
      }
    });

    return newAchievements;
  }

  // 获取所有可能的成就进度
  getAchievementProgress(allocations: AssetType[], stars: number = 0): {
    id: string;
    name: string;
    description: string;
    progress: number;
    unlocked: boolean;
  }[] {
    // 检查资产分配总和是否为100%
    const totalAllocation = allocations.reduce((sum, asset) => sum + asset.allocation, 0);
    const isValidAllocation = Math.abs(totalAllocation - 100) <= 0.1;

    return achievements.map(achievement => {
      const unlocked = achievementService.hasAchievement(achievement.id);
      let progress = 0;

      if (!unlocked && isValidAllocation) {
        // 只有在分配有效时才计算进度
        switch (achievement.id) {
          case 'badge_1': {
            const maxAllocation = Math.max(...allocations.map(a => a.allocation));
            progress = Math.max(0, 100 - (maxAllocation - 50) * 2); // 50%以下为100%进度
            break;
          }
          case 'badge_2': {
            const activeCount = allocations.filter(a => a.allocation > 0).length;
            progress = Math.min(100, (activeCount / 3) * 100);
            break;
          }
          case 'badge_7':
            progress = Math.min(100, (stars / 10) * 100);
            break;
          case 'badge_8':
            progress = Math.min(100, (stars / 25) * 100);
            break;
          case 'badge_9':
            progress = Math.min(100, (stars / 50) * 100);
            break;
          case 'badge_10':
            progress = Math.min(100, (stars / 100) * 100);
            break;
          default:
            progress = 0;
        }
      } else {
        progress = 100;
      }

      return {
        id: achievement.id,
        name: achievement.name,
        description: achievement.description,
        progress: Math.round(progress),
        unlocked
      };
    });
  }
}

export const achievementChecker = new AchievementChecker();