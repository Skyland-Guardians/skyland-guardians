import { useGameState } from '../../hooks/useGameContext';
import { ModalShell } from '../ModalShell/ModalShell';

export function CardCollection() {
  const { missions, events, isCardCollectionOpen, setCardCollectionOpen } = useGameState();

  if (!isCardCollectionOpen) return null;

  return (
    <div className="panel-overlay" onClick={() => setCardCollectionOpen(false)}>
      <div className="panel-card" onClick={e => e.stopPropagation()}>
        <button className="panel-close" onClick={() => setCardCollectionOpen(false)}>X</button>
        <ModalShell title="MY CARDS">
          <div className="two-column-wrap" style={{ padding: '8px' }}>
            <div className="col">
              <h2 style={{ textAlign: 'center', color: '#1e3a8a' }}>Mission Cards</h2>
              <div className="col-scroll">
                {missions.length === 0 ? (
                  <p style={{ color: '#888', textAlign: 'center' }}>No missions yet</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {missions.map((mission, idx) => (
                      <div key={mission.id} style={{ display: 'flex', alignItems: 'center', background: '#fff', borderRadius: 14, padding: '12px 16px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                        <div style={{ fontWeight: 'bold', color: '#3b82f6', fontSize: 16, marginRight: 12, minWidth: 28, textAlign: 'center' }}>{idx + 1}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '700', color: '#23304a' }}>{mission.title}</div>
                          <div style={{ fontSize: 13, color: '#374151', opacity: 0.8 }}>{''}</div>
                        </div>
                        <div style={{ marginLeft: 12, color: '#f59e0b', fontWeight: '700' }}>⭐ {mission.rewardStars}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="col">
              <h2 style={{ textAlign: 'center', color: '#1e3a8a' }}>Event Cards</h2>
              <div className="col-scroll">
                {events.length === 0 ? (
                  <p style={{ color: '#888', textAlign: 'center' }}>No events yet</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {events.map((event, idx) => (
                      <div key={event.id} style={{ display: 'flex', alignItems: 'center', background: '#fff', borderRadius: 14, padding: '12px 16px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                        <div style={{ fontWeight: 'bold', color: '#3b82f6', fontSize: 16, marginRight: 12, minWidth: 28, textAlign: 'center' }}>{idx + 1}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '700', color: '#23304a' }}>{event.title}</div>
                          <div style={{ fontSize: 13, color: '#374151', opacity: 0.8 }}>{''}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </ModalShell>
      </div>
    </div>
  );
}
