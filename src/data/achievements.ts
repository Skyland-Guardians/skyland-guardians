// 成就和徽章配置
import type { Achievement } from '../types/achievement';

export const achievements: Achievement[] = [
  {
    id: 'badge_1',
    name: '示例徽章 1',
    description: '获得第一个专属徽章。',
    badgeIcon: '/src/assets/badges/badge1.png',
    starRating: 1,
    trophyGrade: 'bronze',
  },
  {
    id: 'badge_2',
    name: '示例徽章 2',
    description: '获得第二个专属徽章。',
    badgeIcon: '/src/assets/badges/badge2.png',
    starRating: 2,
    trophyGrade: 'silver',
  },
  // 其余奖杯
  ...Array.from({ length: 28 }).map((_, i) => {
    const grades = ['bronze', 'silver', 'gold', 'platinum'] as const;
    const grade = grades[(i + 2) % grades.length];
    return {
      id: `badge_${i + 3}`,
      name: `奖杯 ${i + 3}`,
      description: `完成第${i + 3}项特殊挑战，解锁此奖杯。`,
      badgeIcon:
        grade === 'bronze'
          ? '/public/assets/main-screen-1-assets/trophy.png'
          : grade === 'silver'
          ? '/public/assets/main-screen-1-assets/top-right-star.png'
          : '/public/assets/main-screen-1-assets/badge-main-icon.png',
      starRating: ((i + 2) % 5) + 1,
      trophyGrade: grade,
    };
  })
];
