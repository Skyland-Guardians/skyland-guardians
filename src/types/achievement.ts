// 成就类型定义

export type TrophyGrade = 'bronze' | 'silver' | 'gold' | 'platinum';

export type Achievement = {
  id: string;
  name: string;
  description: string;
  badgeIcon: string; // 奖杯图标路径
  starRating: number; // 星级评分，1-5
  trophyGrade: TrophyGrade; // 奖杯分级
};

export type UserAchievement = {
  achievementId: string;
  achievedAt: Date;
  starRating: number;
  trophyGrade: TrophyGrade;
};

// 用户成就汇总
export type AchievementSummary = {
  totalStars: number;
  badges: string[]; // 徽章图标路径数组
  trophies: {
    grade: TrophyGrade;
    count: number;
  }[];
};
