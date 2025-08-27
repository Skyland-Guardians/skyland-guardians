import React from 'react';
import type { AchievementSummary } from '../../types/achievement';

interface AchievementPanelProps {
  summary: AchievementSummary;
}


import { achievements } from '../../data/achievements';

const trophyIcons: Record<string, string> = {
  bronze: '/public/assets/main-screen-1-assets/trophy.png',
  silver: '/public/assets/main-screen-1-assets/top-right-star.png',
  gold: '/public/assets/main-screen-1-assets/badge-main-icon.png',
  platinum: '/public/assets/main-screen-1-assets/badge-main-icon.png',
};

import { useState } from 'react';

export const AchievementPanel: React.FC<AchievementPanelProps> = ({ summary }) => {
  const [viewAll, setViewAll] = useState(false);
  // 获取已解锁奖杯详细信息
  const unlocked = achievements.filter(a => summary.badges.includes(a.badgeIcon));
  const allList = viewAll ? achievements : unlocked;
  return (
    <div className="achievement-panel" style={{ minWidth: 320 }}>
      <h2 style={{ marginBottom: 12 }}>奖杯成就 Trophy Achievements</h2>
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        {summary.trophies && summary.trophies.map(t => (
          <div key={t.grade} style={{ textAlign: 'center' }}>
            <img src={trophyIcons[t.grade]} alt={t.grade} style={{ width: 32, height: 32 }} />
            <div style={{ fontSize: 14 }}>{t.grade.toUpperCase()}</div>
            <div style={{ fontWeight: 'bold', color: '#1e3a8a' }}>{t.count}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 15, marginBottom: 8 }}>总星级：{summary.totalStars}</div>
      <button style={{ marginBottom: 8, padding: '4px 12px', borderRadius: 8, border: '1px solid #ccc', background: '#f8f8f8', cursor: 'pointer' }} onClick={() => setViewAll(v => !v)}>
        {viewAll ? '只看已解锁奖杯' : '查看全部奖杯'}
      </button>
      <div style={{ maxHeight: 220, overflowY: 'auto' }}>
        {allList.length === 0 ? (
          <div style={{ color: '#888', textAlign: 'center' }}>暂无奖杯</div>
        ) : (
          allList.map(a => (
            <div key={a.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 12, background: '#f6f6f6', borderRadius: 8, padding: 8, opacity: unlocked.includes(a) ? 1 : 0.5 }}>
              <img src={a.badgeIcon} alt={a.name} style={{ width: 40, marginRight: 12 }} />
              <div>
                <div style={{ fontWeight: 'bold', fontSize: 16 }}>{a.name}</div>
                <div style={{ fontSize: 13, color: '#555' }}>{a.description}</div>
              </div>
              <div style={{ marginLeft: 'auto', fontSize: 13, color: '#bfae5a', fontWeight: 'bold' }}>{a.trophyGrade.toUpperCase()}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
