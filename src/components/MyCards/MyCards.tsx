import type { PlayerCard, Mission, EventCard } from '../../types/game';
import { useGameState } from '../../hooks/useGameContext';
import { useAIPersonality } from '../../hooks/useAIPersonality';
import { gamifiedAIService } from '../../services/gamified-ai-service';
import './MyCards.css';
import '../ModalShell/ModalShell.css';

interface MyCardsProps {
  isOpen: boolean;
  onClose: () => void;
  playerCards: PlayerCard[];
  activeMissions: Mission[];
  activeEvents: EventCard[];
  currentDay: number;
}

export function MyCards({ isOpen, onClose, playerCards, activeMissions, activeEvents, currentDay }: MyCardsProps) {
  const { addMessage, gameState, assetAllocations, coins = 10000, performanceHistory } = useGameState();
  const { currentPersonality } = useAIPersonality();
  
  if (!isOpen) return null;

  const handleAskAIAboutMission = async (mission: Mission) => {
    // Add thinking message
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

  const renderMissionCard = (card: PlayerCard) => {
    const mission = card.data as Mission;
    const isActive = activeMissions.some(m => m.id === mission.id);
    
    return (
      <div key={card.id} className={`card-item mission-card ${mission.status || 'pending'}`}>
        <div className="card-icon">🗡️</div>
        <div className="card-content">
          <div className="card-header">
            <h4 className="card-title">{mission.title}</h4>
            <button
              onClick={() => handleAskAIAboutMission(mission)}
              className="ask-ai-btn"
              title={`Ask ${currentPersonality.name} about this mission`}
            >
              <img 
                src={currentPersonality.avatar} 
                alt={`Ask ${currentPersonality.name}`}
                style={{ width: '20px', height: '20px', objectFit: 'cover' }}
              />
            </button>
          </div>
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

  const handleAskAIAboutEvent = async (event: EventCard) => {
    // Add thinking message
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
          <div className="card-header">
            <h4 className="card-title">{event.title}</h4>
            <button
              onClick={() => handleAskAIAboutEvent(event)}
              className="ask-ai-btn"
              title={`Ask ${currentPersonality.name} about this event`}
            >
              <img 
                src={currentPersonality.avatar} 
                alt={`Ask ${currentPersonality.name}`}
                style={{ width: '20px', height: '20px', objectFit: 'cover' }}
              />
            </button>
          </div>
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
  const eventCards = sortedCards.filter(card => {
    if (card.type !== 'event') return false;
    const event = card.data as EventCard;
    // If the event was accepted and has a duration, hide it when expired
    if (event.acceptedAt && event.duration) {
      const expired = currentDay - event.acceptedAt >= event.duration;
      return !expired;
    }
    return true;
  });

  return (
    <div className="my-cards-overlay">
      <div className="my-cards-modal">
        <div className="my-cards-header">
          <h3 className="my-cards-title">📦 My Cards</h3>
          <button 
            className="my-cards-close" 
            onClick={(e) => {
              console.log('🔴 [MyCards] Close button clicked', e);
              e.preventDefault();
              e.stopPropagation();
              console.log('🔴 [MyCards] Calling onClose');
              onClose();
              console.log('🔴 [MyCards] onClose called');
            }}
          >
            ×
          </button>
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