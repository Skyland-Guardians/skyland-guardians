// 成就判定与奖励服务
import type { UserAchievement, AchievementSummary } from '../types/achievement';
import { achievements } from '../data/achievements';

export class AchievementService {
  private userAchievements: UserAchievement[] = [];
  private readonly STORAGE_KEY = 'skyland-guardians-achievements-v1';

  constructor() {
    // Try to hydrate achievements from localStorage. If none present, start fresh.
    this.loadFromStorage();
  }

  // 重置所有成就（用于调试）
  reset(): void {
    this.userAchievements = [];
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (e) {
      // ignore
    }
    console.log('🧹 All achievements reset');
  }

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
      console.log(`✅ Achievement Service: Added ${achievementId}. Total: ${this.userAchievements.length}`);
      // persist after change
      this.saveToStorage();
    } else {
      console.log(`⚠️ Achievement Service: ${achievementId} already exists`);
    }
  }

  private saveToStorage(): void {
    try {
      const serializable = this.userAchievements.map(a => ({ ...a, achievedAt: a.achievedAt instanceof Date ? a.achievedAt.toISOString() : a.achievedAt }));
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(serializable));
    } catch (e) {
      console.warn('AchievementService: failed to save achievements to localStorage', e);
    }
  }

  private loadFromStorage(): void {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        this.userAchievements = parsed.map((a: any) => ({
          achievementId: a.achievementId,
          achievedAt: a.achievedAt ? new Date(a.achievedAt) : new Date(),
          starRating: a.starRating,
          trophyGrade: a.trophyGrade
        }));
        console.debug(`AchievementService: Loaded ${this.userAchievements.length} achievements from storage`);
      }
    } catch (e) {
      console.warn('AchievementService: failed to load achievements from localStorage', e);
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
    
    console.log(`📊 Achievement Summary: ${this.userAchievements.length} unlocked achievements`);
    
    return { totalStars, badges, trophies };
  }

  // 判断是否已获得某成就
  hasAchievement(achievementId: string): boolean {
    return this.userAchievements.some(a => a.achievementId === achievementId);
  }
}

export const achievementService = new AchievementService();
