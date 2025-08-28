import type { PlayerCard, Mission, EventCard } from '../../types/game';
import './CardChoiceModal.css';

interface CardChoiceModalProps {
  card: PlayerCard;
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
  onClose: () => void;
}

export function CardChoiceModal({ card, isOpen, onAccept, onDecline, onClose }: CardChoiceModalProps) {
  if (!isOpen) return null;

  const renderMissionCard = (mission: Mission) => (
    <div className="card-choice-content">
      <div className="card-choice-header">
        <h3 className="card-choice-title">🎯 New Mission</h3>
        <button className="card-choice-close" onClick={onClose}>×</button>
      </div>
      
      <div className="mission-card-display">
        <div className="mission-card-placeholder">
          <div className="mission-icon">🗡️</div>
          <h4 className="mission-title">{mission.title}</h4>
          <p className="mission-background">{mission.background}</p>
          <div className="mission-details">
            <p className="mission-tip">💡 {mission.tip}</p>
            {mission.completionDescription && (
              <div className="mission-completion">
                <span className="completion-label">Completion Criteria:</span>
                <span className="completion-description">{mission.completionDescription}</span>
              </div>
            )}
            <p className="mission-focus">🎯 Focus: {mission.focus}</p>
            <div className="mission-reward">
              <span className="stars">⭐ {mission.rewardStars} Stars</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card-choice-actions">
        <button className="card-choice-btn decline" onClick={onDecline}>
          Decline
        </button>
        <button className="card-choice-btn accept" onClick={onAccept}>
          Accept Mission
        </button>
      </div>
    </div>
  );

  const renderEventCard = (event: EventCard) => (
    <div className="card-choice-content">
      <div className="card-choice-header">
        <h3 className="card-choice-title">⚡ Market Event</h3>
        <button className="card-choice-close" onClick={onClose}>×</button>
      </div>
      
      <div className="event-card-display">
        <div className="event-card-placeholder">
          <div className="event-icon">⚡</div>
          <h4 className="event-title">{event.title}</h4>
          <p className="event-description">{event.description}</p>
          {event.duration && (
            <p className="event-duration">Duration: {event.duration} day{event.duration > 1 ? 's' : ''}</p>
          )}
          {event.effects && (
            <div className="event-effects">
              <p className="effects-label">Market Impact:</p>
              <p className="effects-detail">
                {event.effects.type === 'add' ? 'Boost' : event.effects.type === 'mul' ? 'Multiply' : 'Volatility'} 
                {' '}by {Math.abs(event.effects.value * 100).toFixed(1)}%
              </p>
              <p className="effects-targets">
                Affects: {event.effects.targets.includes('all') ? 'All Assets' : event.effects.targets.join(', ')}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="card-choice-actions">
        <button className="card-choice-btn accept full-width" onClick={onAccept}>
          Continue
        </button>
      </div>
    </div>
  );

  return (
    <div className="card-choice-overlay">
      <div className="card-choice-modal">
        {card.type === 'mission' 
          ? renderMissionCard(card.data as Mission)
          : renderEventCard(card.data as EventCard)
        }
      </div>
    </div>
  );
}