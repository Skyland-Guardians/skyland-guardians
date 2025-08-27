// ...existing code...
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
  // 获取已解锁徽章详细信息
  const unlocked = achievements.filter(a => summary.badges.includes(a.badgeIcon));
  const allList = viewAll ? achievements : unlocked;
  return (
    <div className="achievement-panel" style={{ minWidth: 600, background: '#23304a', borderRadius: 16, padding: '32px 24px', color: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}>
      <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 28, letterSpacing: 2, marginBottom: 24, background: '#fff', color: '#23304a', borderRadius: 12, padding: '8px 0' }}>BADGES GAINED</div>
      <button style={{ marginBottom: 16, padding: '6px 18px', borderRadius: 8, border: 'none', background: '#fff', color: '#23304a', fontWeight: 'bold', cursor: 'pointer', fontSize: 16 }} onClick={() => setViewAll(v => !v)}>
        {viewAll ? 'Show Unlocked Only' : 'View All Badges'}
      </button>
      <div style={{ maxHeight: 320, overflowY: 'auto', paddingRight: 8 }}>
        {allList.length === 0 ? (
          <div style={{ color: '#888', textAlign: 'center' }}>No badges yet</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {allList.map(a => (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', background: unlocked.includes(a) ? '#fff' : '#dbeafe', borderRadius: 12, padding: '18px 16px', boxShadow: unlocked.includes(a) ? '0 2px 8px rgba(0,0,0,0.08)' : 'none', opacity: unlocked.includes(a) ? 1 : 0.5 }}>
                <img src={a.badgeIcon} alt={a.name} style={{ width: 80, height: 80, marginRight: 24 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', fontSize: 18, color: '#23304a', marginBottom: 6 }}>{a.name}</div>
                  <div style={{ fontSize: 14, color: '#23304a' }}>{a.description}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
