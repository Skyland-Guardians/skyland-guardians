// ...existing code...
import type { AchievementSummary } from '../../types/achievement';

interface AchievementPanelProps {
  summary: AchievementSummary;
}


import { achievements } from '../../data/achievements';



import { useState } from 'react';

export const AchievementPanel: React.FC<AchievementPanelProps> = ({ summary }) => {
  const [viewAll, setViewAll] = useState(false);
  // 获取已解锁徽章详细信息
  const unlocked = achievements.filter(a => summary.badges.includes(a.badgeIcon));
  const allList = viewAll ? achievements : unlocked;
  return (
    <div className="achievement-panel" style={{ width: '100%', height: '80%', maxHeight: '100%', boxSizing: 'border-box', background: 'linear-gradient(135deg, #23304a 0%, #2d3e5e 100%)', borderRadius: 20, padding: '28px 24px', color: '#fff', boxShadow: '0 8px 32px rgba(0,0,0,0.18)', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', fontSize: 30, letterSpacing: 2, background: 'rgba(255,255,255,0.95)', color: '#23304a', borderRadius: 14, padding: '12px 0', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>BADGES GAINED</div>
        {/* Close button will be rendered by parent */}
      </div>
      <button style={{ marginBottom: 18, padding: '8px 22px', borderRadius: 10, border: 'none', background: 'linear-gradient(90deg,#f8fafc 0%,#e0e7ef 100%)', color: '#23304a', fontWeight: 'bold', cursor: 'pointer', fontSize: 17, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }} onClick={() => setViewAll(v => !v)}>
        {viewAll ? 'Show Unlocked Only' : 'View All Badges'}
      </button>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: 8 }}>
        {allList.length === 0 ? (
          <div style={{ color: '#888', textAlign: 'center' }}>No badges yet</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, paddingBottom: 12 }}>
            {allList.map((a, idx) => (
              <div
                key={a.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: unlocked.includes(a) ? 'rgba(255,255,255,0.98)' : 'rgba(220,230,255,0.7)',
                  borderRadius: 14,
                  padding: '18px 20px',
                  boxShadow: unlocked.includes(a) ? '0 2px 12px rgba(0,0,0,0.10)' : 'none',
                  opacity: unlocked.includes(a) ? 1 : 0.5,
                  transition: 'box-shadow 0.2s, transform 0.2s',
                  position: 'relative',
                  cursor: unlocked.includes(a) ? 'pointer' : 'default',
                }}
                onMouseEnter={e => {
                  if (unlocked.includes(a)) e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,0.18)';
                  if (unlocked.includes(a)) e.currentTarget.style.transform = 'scale(1.03)';
                }}
                onMouseLeave={e => {
                  if (unlocked.includes(a)) e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.10)';
                  if (unlocked.includes(a)) e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <div style={{ fontWeight: 'bold', color: '#3b82f6', fontSize: 18, marginRight: 18, minWidth: 32, textAlign: 'center' }}>{idx + 1}</div>
                <img src={a.badgeIcon} alt={a.name} style={{ width: 80, height: 80, marginRight: 24, borderRadius: 10, boxShadow: '0 1px 6px rgba(0,0,0,0.10)' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', fontSize: 19, color: '#23304a', marginBottom: 6 }}>{a.name}</div>
                  <div style={{ fontSize: 15, color: '#23304a', opacity: 0.85 }}>{a.description}</div>
                </div>
                <div style={{ marginLeft: 18, height: 60, borderLeft: '1.5px solid #e0e7ef', opacity: 0.7 }} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
