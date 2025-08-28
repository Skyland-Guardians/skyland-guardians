import type { PlayerCard, Mission, EventCard } from '../../types/game';
import './MyCards.css';

interface MyCardsProps {
  isOpen: boolean;
  onClose: () => void;
  playerCards: PlayerCard[];
  activeMissions: Mission[];
  activeEvents: EventCard[];
  currentDay: number;
}

export function MyCards({ isOpen, onClose, playerCards, activeMissions, activeEvents, currentDay }: MyCardsProps) {
  if (!isOpen) return null;

  const renderMissionCard = (card: PlayerCard) => {
    const mission = card.data as Mission;
    const isActive = activeMissions.some(m => m.id === mission.id);
    
    return (
      <div key={card.id} className={`card-item mission-card ${mission.status || 'pending'}`}>
        <div className="card-icon">🗡️</div>
        <div className="card-content">
          <h4 className="card-title">{mission.title}</h4>
          <p className="card-description">{mission.background}</p>
          <div className="card-meta">
            <span className="card-focus">🎯 {mission.focus}</span>
            <span className="card-reward">⭐ {mission.rewardStars}</span>
          </div>
          <div className="card-status">
            {mission.status === 'completed' ? (
              <span className="status-completed">✅ Completed on Day {mission.completedAt}</span>
            ) : mission.status === 'active' || isActive ? (
              <span className="status-active">🔄 In Progress</span>
            ) : mission.status === 'declined' ? (
              <span className="status-declined">❌ Declined</span>
            ) : (
              <span className="status-pending">⏳ Pending</span>
            )}
          </div>
          {mission.tip && (
            <p className="card-tip">💡 {mission.tip}</p>
          )}
          {mission.completionDescription && (
            <div className="card-completion">
              <span className="completion-label">Completion Criteria:</span>
              <span className="completion-description">{mission.completionDescription}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderEventCard = (card: PlayerCard) => {
    const event = card.data as EventCard;
    const isActive = activeEvents.some(e => e.id === event.id);
    const daysRemaining = event.acceptedAt && event.duration 
      ? Math.max(0, (event.acceptedAt + event.duration) - currentDay)
      : 0;
    
    return (
      <div key={card.id} className={`card-item event-card ${event.status || 'pending'}`}>
        <div className="card-icon">⚡</div>
        <div className="card-content">
          <h4 className="card-title">{event.title}</h4>
          <p className="card-description">{event.description}</p>
          {event.effects && (
            <div className="card-effects">
              <span className="effects-label">Impact:</span>
              <span className="effects-value">
                {event.effects.type === 'add' 
                  ? (event.effects.value >= 0 ? '+' : '') 
                  : event.effects.type === 'mul' ? '×' : '~'}
                {(event.effects.value * 100).toFixed(1)}%
              </span>
              <span className="effects-targets">
                ({event.effects.targets.includes('all') ? 'All' : event.effects.targets.join(', ')})
              </span>
            </div>
          )}
          <div className="card-status">
            {event.status === 'active' || isActive ? (
              <span className="status-active">
                🔄 Active ({daysRemaining} day{daysRemaining !== 1 ? 's' : ''} left)
              </span>
            ) : event.status === 'declined' ? (
              <span className="status-declined">❌ Ignored</span>
            ) : (
              <span className="status-pending">⏳ Pending</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const sortedCards = [...playerCards].sort((a, b) => b.obtainedAt - a.obtainedAt);
  const missionCards = sortedCards.filter(card => card.type === 'mission');
  const eventCards = sortedCards.filter(card => card.type === 'event');

  return (
    <div className="my-cards-overlay">
      <div className="my-cards-modal">
        <div className="my-cards-header">
          <h3 className="my-cards-title">📦 My Cards</h3>
          <button className="my-cards-close" onClick={onClose}>×</button>
        </div>
        
        <div className="my-cards-content">
          {playerCards.length === 0 ? (
            <div className="empty-cards">
              <div className="empty-icon">📦</div>
              <p>No cards yet. Complete missions and experience events to collect cards!</p>
            </div>
          ) : (
            <div className="cards-sections">
              {missionCards.length > 0 && (
                <div className="cards-section">
                  <h4 className="section-title">🗡️ Missions ({missionCards.length})</h4>
                  <div className="cards-grid">
                    {missionCards.map(renderMissionCard)}
                  </div>
                </div>
              )}
              
              {eventCards.length > 0 && (
                <div className="cards-section">
                  <h4 className="section-title">⚡ Events ({eventCards.length})</h4>
                  <div className="cards-grid">
                    {eventCards.map(renderEventCard)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}