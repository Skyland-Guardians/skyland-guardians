// Task objectives and rewards definitions

export interface TaskGoal {
  objective: string;
  check: (weights: { [key: string]: number }) => boolean;
  reward: { coins: number; gems: number; badge?: string };
}

export const taskGoals: Record<number, TaskGoal> = {
  1: {
    objective: '保持多元化：任何单一资产不超过50%',
    check: (w) => Math.max(...Object.values(w)) <= 50,
    reward: { coins: 20, gems: 1, badge: '分散者' },
  },
  2: {
    objective: 'ESG 配置至少20%',
    check: (w) => (w.esg || 0) >= 20,
    reward: { coins: 20, gems: 1, badge: '绿色先锋' },
  },
  3: {
    objective: '黄金配置至少20%',
    check: (w) => (w.gold || 0) >= 20,
    reward: { coins: 20, gems: 1, badge: '避险守护者' },
  },
  4: {
    objective: '稳定币配置至少20%',
    check: (w) => (w.stablecoin || 0) >= 20,
    reward: { coins: 20, gems: 1, badge: '平静守护者' },
  },
  5: {
    objective: '收益资产配置至少20%',
    check: (w) => (w.yield || 0) >= 20,
    reward: { coins: 20, gems: 1, badge: '收益智者' },
  },
};

