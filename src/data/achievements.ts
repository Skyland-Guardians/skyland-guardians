// 成就和徽章配置
import type { Achievement } from '../types/achievement';

export const achievements: Achievement[] = [
  {
    id: 'badge_1',
    name: 'BALANCE APPRENTICE',
    description: 'THE PROPORTION OF A SINGLE DIVINE ARTIFACT DOES NOT EXCEED 50%',
    badgeIcon: '/src/assets/badges/badge1.png',
    starRating: 1,
    trophyGrade: 'bronze',
  },
  {
    id: 'badge_2',
    name: 'DIVERSIFICATION EXPLORER',
    description: 'INVEST IN MORE THAN THREE KINDS OF MAGICAL TOOLS SIMULTANEOUSLY',
    badgeIcon: '/src/assets/badges/badge2.png',
    starRating: 2,
    trophyGrade: 'silver',
  },
  // 仅保留8个示例徽章
  ...Array.from({ length: 8 }).map((_, i) => {
    const grades = ['bronze', 'silver', 'gold', 'platinum'] as const;
    const grade = grades[(i + 2) % grades.length];
    return {
      id: `badge_${i + 3}`,
      name: `BADGE ${i + 3}`,
      description: `Unlock this badge by completing challenge ${i + 3}.`,
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
