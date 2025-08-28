import type { AchievementSummary } from '../../types/achievement';

interface AchievementPanelProps {
  summary: AchievementSummary;
}
import { achievements } from '../../data/achievements';


import { useState } from 'react';
import './AchievementPanel.css';
import '../ModalShell/ModalShell.css';

export const AchievementPanel: React.FC<AchievementPanelProps> = ({ summary }) => {
  const [viewAll, setViewAll] = useState(false);
  // 获取已解锁徽章详细信息
  const unlocked = achievements.filter(a => summary.badges.includes(a.badgeIcon));
  const allList = viewAll ? achievements : unlocked;

  return (
    <div className="achievement-panel" style={{ width: '100%', height: '80%', maxHeight: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <div className="my-cards-header">
        <h3 className="my-cards-title">🏅 Badges Gained</h3>
        {/* close button rendered by parent */}
      </div>

      <div className="my-cards-content">
        <div style={{ marginBottom: 18 }}>
          <button
            className="achievement-toggle-btn"
            onClick={() => setViewAll(v => !v)}
          >
            {viewAll ? 'Show Unlocked Only' : 'View All Badges'}
          </button>
        </div>

        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: 8 }}>
          {allList.length === 0 ? (
            <div className="empty-cards">No badges yet</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, paddingBottom: 12 }}>
              {allList.map((a, idx) => (
                <div
                  key={a.id}
                  className={`card-item ${unlocked.includes(a) ? '' : 'declined'}`}
                  title={unlocked.includes(a) ? 'Unlocked' : 'Locked'}
                >
                  <div className="badge-index" aria-hidden>
                    {idx + 1}
                  </div>

                  <img src={a.badgeIcon} alt={a.name} style={{ width: 80, height: 80, marginRight: 24, borderRadius: 10, boxShadow: '0 1px 6px rgba(0,0,0,0.10)' }} />

                  <div style={{ flex: 1 }}>
                    <div className="card-title">{a.name}</div>
                    <div className="card-description">{a.description}</div>
                  </div>

                  <div style={{ marginLeft: 18, height: 60, borderLeft: '1.5px solid rgba(255,255,255,0.06)', opacity: 0.7 }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
