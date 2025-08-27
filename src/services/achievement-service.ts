// 成就判定与奖励服务
import type { UserAchievement, AchievementSummary } from '../types/achievement';
import { achievements } from '../data/achievements';

export class AchievementService {
  private userAchievements: UserAchievement[] = [];

  // 用户完成成就
  achieve(achievementId: string, starRating: number, trophyGrade: 'bronze' | 'silver' | 'gold' | 'platinum') {
    const exist = this.userAchievements.find(a => a.achievementId === achievementId);
    if (!exist) {
      this.userAchievements.push({
        achievementId,
        achievedAt: new Date(),
        starRating,
        trophyGrade,
      });
    }
  }

  // 获取用户所有成就
  getUserAchievements(): UserAchievement[] {
    return this.userAchievements;
  }

  // 获取成就汇总
  getSummary(): AchievementSummary {
    const totalStars = this.userAchievements.reduce((sum, a) => sum + a.starRating, 0);
    const badges = this.userAchievements.map(a => {
      const ach = achievements.find(e => e.id === a.achievementId);
      return ach ? ach.badgeIcon : '';
    }).filter(Boolean);
    const trophyGrades: ('bronze' | 'silver' | 'gold' | 'platinum')[] = ['bronze', 'silver', 'gold', 'platinum'];
    const trophies = trophyGrades.map(grade => ({
      grade,
      count: this.userAchievements.filter(a => a.trophyGrade === grade).length
    }));
    return { totalStars, badges, trophies };
  }

  // 判断是否已获得某成就
  hasAchievement(achievementId: string): boolean {
    return this.userAchievements.some(a => a.achievementId === achievementId);
  }
}

export const achievementService = new AchievementService();
