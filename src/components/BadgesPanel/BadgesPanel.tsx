import { achievements } from '../../data/achievements';
import { achievementService } from '../../services/achievement-service';
import { useGameState } from '../../hooks/useGameContext';
import { createPortal } from 'react-dom';
import { useState } from 'react';
import '../MyCards/MyCards.css';

export function BadgesPanel() {
  const { isBadgesOpen, setBadgesOpen } = useGameState();
  const [viewAll, setViewAll] = useState(false);
  
  if (!isBadgesOpen) return null;

  // 直接通过成就ID检查是否已解锁，避免重复图标的问题
  const unlocked = achievements.filter(a => achievementService.hasAchievement(a.id));
  const allList = viewAll ? achievements : unlocked;

  // 调试信息
  console.log(`🏅 BadgesPanel: ${unlocked.length}/${achievements.length} unlocked, viewAll=${viewAll}`);

  const modal = (
    <div className="my-cards-overlay">
      <div className="my-cards-modal" onClick={e => e.stopPropagation()}>
        <div className="my-cards-header">
          <h3 className="my-cards-title">🏅 Badges</h3>
          <button
            className="my-cards-close"
            onClick={() => setBadgesOpen && setBadgesOpen(false)}
            aria-label="Close Badges"
          >
            ×
          </button>
        </div>

        <div className="my-cards-content">
          <button 
            style={{ 
              marginBottom: 18, 
              padding: '8px 22px', 
              borderRadius: 10, 
              border: 'none', 
              background: 'linear-gradient(90deg,#f8fafc 0%,#e0e7ef 100%)', 
              color: '#23304a', 
              fontWeight: 'bold', 
              cursor: 'pointer', 
              fontSize: 17, 
              boxShadow: '0 1px 4px rgba(0,0,0,0.07)' 
            }} 
            onClick={() => setViewAll(v => !v)}
          >
            {viewAll ? 'Show Unlocked Only' : 'View All Badges'}
          </button>
          
          <div style={{ marginBottom: 12, fontSize: 14, color: '#666', textAlign: 'center' }}>
            {viewAll ? `Showing all ${achievements.length} badges (${unlocked.length} unlocked)` : `Showing ${unlocked.length} unlocked badges`}
          </div>
          
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: 8 }}>
            {allList.length === 0 ? (
              <div style={{ color: '#888', textAlign: 'center' }}>No badges unlocked yet</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18, paddingBottom: 12 }}>
                {allList.map((a, idx) => (
                  <div
                    key={a.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: unlocked.includes(a) ? 'rgba(255,255,255,0.98)' : 'rgba(200,200,200,0.3)',
                      borderRadius: 14,
                      padding: '18px 20px',
                      boxShadow: unlocked.includes(a) ? '0 2px 12px rgba(0,0,0,0.10)' : 'none',
                      opacity: unlocked.includes(a) ? 1 : 0.4,
                      transition: 'box-shadow 0.2s, transform 0.2s',
                      position: 'relative',
                      cursor: unlocked.includes(a) ? 'pointer' : 'default',
                      border: unlocked.includes(a) ? '2px solid #22c55e' : '2px solid #e5e7eb',
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
                    <div style={{ position: 'relative', marginRight: 24 }}>
                      <img src={a.badgeIcon} alt={a.name} style={{ 
                        width: 80, 
                        height: 80, 
                        borderRadius: 10, 
                        boxShadow: '0 1px 6px rgba(0,0,0,0.10)',
                        filter: unlocked.includes(a) ? 'none' : 'grayscale(100%) brightness(0.6)'
                      }} />
                      {unlocked.includes(a) && (
                        <div style={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          background: '#22c55e',
                          color: 'white',
                          borderRadius: '50%',
                          width: 24,
                          height: 24,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 12,
                          fontWeight: 'bold'
                        }}>
                          ✓
                        </div>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        fontWeight: 'bold', 
                        fontSize: 19, 
                        color: unlocked.includes(a) ? '#23304a' : '#9ca3af', 
                        marginBottom: 6 
                      }}>
                        {a.name} {!unlocked.includes(a) && '🔒'}
                      </div>
                      <div style={{ 
                        fontSize: 15, 
                        color: unlocked.includes(a) ? '#23304a' : '#9ca3af', 
                        opacity: 0.85 
                      }}>
                        {a.description}
                      </div>
                    </div>
                    <div style={{ marginLeft: 18, height: 60, borderLeft: '1.5px solid #e0e7ef', opacity: 0.7 }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Render modal into document.body to escape layout-main-content stacking context
  if (typeof document !== 'undefined') {
    return createPortal(modal, document.body);
  }

  return modal;
}
