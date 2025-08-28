import type { PlayerCard, Mission, EventCard } from '../../types/game';
import { useGameState } from '../../hooks/useGameContext';
import { useAIPersonality } from '../../hooks/useAIPersonality';
import { gamifiedAIService } from '../../services/gamified-ai-service';
import './CardChoiceModal.css';
import '../ModalShell/ModalShell.css';

interface CardChoiceModalProps {
  card: PlayerCard;
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
  onClose: () => void;
}

export function CardChoiceModal({ card, isOpen, onAccept, onDecline, onClose }: CardChoiceModalProps) {
  const { addMessage, gameState, assetAllocations, coins = 10000, performanceHistory } = useGameState();
  const { currentPersonality } = useAIPersonality();
  
  if (!isOpen) return null;

  const handleAskAIAboutMission = async (mission: Mission) => {
    addMessage({
      id: `ai-thinking-mission-${Date.now()}`,
      sender: 'ai',
      content: `🤔 *Analyzing mission "${mission.title}"...*`,
      timestamp: new Date(),
      type: 'feedback'
    });

    try {
      const response = await gamifiedAIService.getGameResponse(
        `Explain this mission: "${mission.title}" - ${mission.background}. Why is this important for investment strategy? Focus: ${mission.focus}. 100 words max.`,
        {
          assets: assetAllocations,
          currentDay: gameState.currentDay,
          stars: gameState.stars,
          level: gameState.level,
          coins,
          performanceHistory
        }
      );

      addMessage({
        id: `ai-mission-explain-${Date.now()}`,
        sender: 'ai',
        content: response,
        timestamp: new Date(),
        type: 'feedback'
      });
    } catch (error) {
      console.error('Failed to get AI mission explanation:', error);
      addMessage({
        id: `ai-mission-fallback-${Date.now()}`,
        sender: 'ai',
        content: `This mission focuses on ${mission.focus}. ${mission.tip} Complete it to earn ${mission.rewardStars} stars! 🌟`,
        timestamp: new Date(),
        type: 'feedback'
      });
    }
  };

  const handleAskAIAboutEvent = async (event: EventCard) => {
    addMessage({
      id: `ai-thinking-event-${Date.now()}`,
      sender: 'ai',
      content: `🤔 *Analyzing event "${event.title}"...*`,
      timestamp: new Date(),
      type: 'feedback'
    });

    try {
      const effectType = event.effects?.type === 'add' ? 'adds' : event.effects?.type === 'mul' ? 'multiplies' : 'affects volatility';
      const effectValue = event.effects ? `${effectType} ${Math.abs(event.effects.value * 100).toFixed(1)}%` : 'has market impact';
      const targets = event.effects?.targets.includes('all') ? 'all assets' : event.effects?.targets.join(', ') || 'various assets';
      
      const response = await gamifiedAIService.getGameResponse(
        `Explain market event: "${event.title}" - ${event.description}. It ${effectValue} for ${targets}. Why does this happen and how should I react? 100 words max.`,
        {
          assets: assetAllocations,
          currentDay: gameState.currentDay,
          stars: gameState.stars,
          level: gameState.level,
          coins,
          performanceHistory
        }
      );

      addMessage({
        id: `ai-event-explain-${Date.now()}`,
        sender: 'ai',
        content: response,
        timestamp: new Date(),
        type: 'feedback'
      });
    } catch (error) {
      console.error('Failed to get AI event explanation:', error);
      addMessage({
        id: `ai-event-fallback-${Date.now()}`,
        sender: 'ai',
        content: `${event.title}: ${event.description} This type of market event can create opportunities and risks. Stay diversified! 📊`,
        timestamp: new Date(),
        type: 'feedback'
      });
    }
  };

  const renderMissionCard = (mission: Mission) => (
    <div className="card-choice-content">
      <div className="card-choice-header">
        <h3 className="card-choice-title">🎯 New Mission</h3>
        <div className="header-buttons">
          <button
            onClick={() => handleAskAIAboutMission(mission)}
            className="ask-ai-btn-modal"
            title={`Ask ${currentPersonality.name} about this mission`}
          >
            <img 
              src={currentPersonality.avatar} 
              alt={`Ask ${currentPersonality.name}`}
              style={{ width: '20px', height: '20px', objectFit: 'cover' }}
            />
          </button>
          <button 
            className="card-choice-close" 
            onClick={(e) => {
              console.log('🔴 [CardChoiceModal] Mission close button clicked', e);
              e.preventDefault();
              e.stopPropagation();
              console.log('🔴 [CardChoiceModal] Calling onClose');
              onClose();
              console.log('🔴 [CardChoiceModal] onClose called');
            }}
          >
            ×
          </button>
        </div>
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
        <div className="header-buttons">
          <button
            onClick={() => handleAskAIAboutEvent(event)}
            className="ask-ai-btn-modal"
            title={`Ask ${currentPersonality.name} about this event`}
          >
            <img 
              src={currentPersonality.avatar} 
              alt={`Ask ${currentPersonality.name}`}
              style={{ width: '20px', height: '20px', objectFit: 'cover' }}
            />
          </button>
          <button 
            className="card-choice-close" 
            onClick={(e) => {
              console.log('🔴 [CardChoiceModal] Event close button clicked', e);
              e.preventDefault();
              e.stopPropagation();
              console.log('🔴 [CardChoiceModal] Calling onClose');
              onClose();
              console.log('🔴 [CardChoiceModal] onClose called');
            }}
          >
            ×
          </button>
        </div>
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