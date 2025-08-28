import { useState, useEffect, useRef } from 'react';
import { useGameState } from '../../hooks/useGameContext';
import { CardChoiceModal } from '../CardChoiceModal/CardChoiceModal';
import { MyCards } from '../MyCards/MyCards';
import { MissionCompletedModal } from '../MissionCompletedModal/MissionCompletedModal';
import type { PlayerCard, Mission } from '../../types/game';
import './EventManager.css';

export function EventManager() {
  const {
    gameState,
    triggerNewCards,
    acceptCard,
    declineCard,
    updateActiveCards,
    setCardCollectionOpen,
    isCardCollectionOpen,
    clearNewCardFlags
  } = useGameState();

  const [currentPendingCard, setCurrentPendingCard] = useState<PlayerCard | null>(null);
  const [showCardChoice, setShowCardChoice] = useState(false);
  const [completedMission, setCompletedMission] = useState<Mission | null>(null);
  const [showMissionCompleted, setShowMissionCompleted] = useState(false);
  const processedCompletionsRef = useRef<Set<number>>(new Set());

  // Initialize events on first day
  useEffect(() => {
    console.log('🌅 [EventManager] First day init effect, currentDay:', gameState.currentDay, 'playerCards length:', gameState.playerCards.length);
    if (triggerNewCards && gameState.currentDay === 1 && gameState.playerCards.length === 0) {
      console.log('🎲 [EventManager] Triggering init cards');
      triggerNewCards('init');
    }
  }, [gameState.currentDay, gameState.playerCards.length]); // Removed triggerNewCards to prevent React.StrictMode double calls

  // Handle pending cards
  useEffect(() => {
    console.log('📋 [EventManager] Pending cards effect, pendingCards:', gameState.pendingCards.length, 'currentPendingCard:', !!currentPendingCard);
    if (gameState.pendingCards.length > 0 && !currentPendingCard) {
      console.log('📝 [EventManager] Setting current pending card');
      setCurrentPendingCard(gameState.pendingCards[0]);
      setShowCardChoice(true);
    }
  }, [gameState.pendingCards, currentPendingCard]);

  // Check for mission completions
  useEffect(() => {
    console.log('🏆 [EventManager] Mission completion check effect, activeMissions:', gameState.activeMissions.length);
    const completedMissions = gameState.activeMissions.filter(
      mission => mission.status === 'completed' && !processedCompletionsRef.current.has(mission.id)
    );

    if (completedMissions.length > 0) {
      console.log('🎉 [EventManager] Found completed missions:', completedMissions.map(m => m.id));
      const mission = completedMissions[0];
      setCompletedMission(mission);
      setShowMissionCompleted(true);
      // 使用ref避免触发useEffect重新运行
      processedCompletionsRef.current.add(mission.id);
    }
  }, [gameState.activeMissions]); // 移除processedCompletions依赖避免循环

  // Auto-clear new card flags after 5 seconds
  useEffect(() => {
    const newCardsCount = gameState.playerCards.filter(card => card.isNew).length;
    console.log('✨ [EventManager] New cards clear effect, newCardsCount:', newCardsCount);
    if (newCardsCount > 0 && clearNewCardFlags) {
      console.log('⏰ [EventManager] Setting timer to clear new card flags');
      const timer = setTimeout(() => {
        console.log('🧹 [EventManager] Clearing new card flags');
        clearNewCardFlags();
      }, 5000); // Clear after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [gameState.playerCards, clearNewCardFlags]);

  // Update active cards status only when day changes
  useEffect(() => {
    console.log('🌅 [EventManager] Day changed, updating active cards');
    if (updateActiveCards) {
      updateActiveCards();
    }
  }, [gameState.currentDay]); // Removed updateActiveCards dependency

  const handleAcceptCard = () => {
    if (currentPendingCard && acceptCard) {
      acceptCard(currentPendingCard);
      setCurrentPendingCard(null);
      setShowCardChoice(false);
      
      // Process next card in queue
      setTimeout(() => {
        const remainingCards = gameState.pendingCards.filter(c => c.id !== currentPendingCard.id);
        if (remainingCards.length > 0) {
          setCurrentPendingCard(remainingCards[0]);
          setShowCardChoice(true);
        }
      }, 500);
    }
  };

  const handleDeclineCard = () => {
    if (currentPendingCard && declineCard && acceptCard) {
      // Only missions can be declined, events are automatically accepted
      if (currentPendingCard.type === 'mission') {
        declineCard(currentPendingCard);
      } else {
        // For events, automatically accept them
        acceptCard(currentPendingCard);
      }
      setCurrentPendingCard(null);
      setShowCardChoice(false);
      
      // Process next card in queue
      setTimeout(() => {
        const remainingCards = gameState.pendingCards.filter(c => c.id !== currentPendingCard.id);
        if (remainingCards.length > 0) {
          setCurrentPendingCard(remainingCards[0]);
          setShowCardChoice(true);
        }
      }, 500);
    }
  };

  const handleCloseCardChoice = () => {
    console.log('🔴 [EventManager] handleCloseCardChoice called');
    if (currentPendingCard && declineCard && acceptCard) {
      console.log('🔴 [EventManager] Processing current pending card as declined/accepted');
      // Only missions can be declined, events are automatically accepted
      if (currentPendingCard.type === 'mission') {
        declineCard(currentPendingCard);
      } else {
        // For events, automatically accept them when closed
        acceptCard(currentPendingCard);
      }
    }
    setShowCardChoice(false);
    setCurrentPendingCard(null);
    console.log('🔴 [EventManager] handleCloseCardChoice finished');
  };

  const handleCloseMissionCompleted = () => {
    setShowMissionCompleted(false);
    setCompletedMission(null);
  };

  const handleNewCardsClick = () => {
    if (clearNewCardFlags) {
      clearNewCardFlags();
    }
    if (setCardCollectionOpen) {
      setCardCollectionOpen(true);
    }
  };

  // Show card queue notifications
  const pendingCount = gameState.pendingCards.length;
  const newCardsCount = gameState.playerCards.filter(card => card.isNew).length;

  return (
    <>
      {/* Card choice dialog */}
      {currentPendingCard && (
        <CardChoiceModal
          card={currentPendingCard}
          isOpen={showCardChoice}
          onAccept={handleAcceptCard}
          onDecline={handleDeclineCard}
          onClose={handleCloseCardChoice}
        />
      )}

      {/* Mission completion celebration */}
      <MissionCompletedModal
        mission={completedMission}
        isOpen={showMissionCompleted}
        onClose={handleCloseMissionCompleted}
      />

      {/* Card collection interface */}
      <MyCards
        isOpen={isCardCollectionOpen}
        onClose={() => {
          console.log('🔴 [EventManager] MyCards onClose called');
          setCardCollectionOpen && setCardCollectionOpen(false);
          console.log('🔴 [EventManager] setCardCollectionOpen(false) called');
        }}
        playerCards={gameState.playerCards}
        activeMissions={gameState.activeMissions}
        activeEvents={gameState.activeEvents}
        currentDay={gameState.currentDay}
      />

      {/* Floating notifications */}
      {(pendingCount > 0 || newCardsCount > 0) && (
        <div className="event-notifications">
          {pendingCount > 0 && (
            <div className="notification pending-cards">
              <span className="notification-icon">📋</span>
              <span className="notification-text">
                {pendingCount} card{pendingCount > 1 ? 's' : ''} waiting for decision
              </span>
            </div>
          )}
          {newCardsCount > 0 && (
            <div className="notification new-cards" onClick={handleNewCardsClick}>
              <span className="notification-icon">✨</span>
              <span className="notification-text">
                {newCardsCount} new card{newCardsCount > 1 ? 's' : ''} in collection
              </span>
            </div>
          )}
        </div>
      )}
    </>
  );
}