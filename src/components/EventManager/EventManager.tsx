import { useState, useEffect } from 'react';
import { useGameState } from '../../hooks/useGameContext';
import { CardChoiceModal } from '../CardChoiceModal/CardChoiceModal';
import { MyCards } from '../MyCards/MyCards';
import { MissionCompletedModal } from '../MissionCompletedModal/MissionCompletedModal';
import type { PlayerCard, Mission } from '../../types/game';
import './EventManager.css';

export function EventManager() {
  const {
    gameState,
    assetAllocations,
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
  const [processedCompletions, setProcessedCompletions] = useState<Set<number>>(new Set());

  // Initialize events on first day
  useEffect(() => {
    if (triggerNewCards && gameState.currentDay === 1 && gameState.playerCards.length === 0) {
      triggerNewCards('init');
    }
  }, [triggerNewCards, gameState.currentDay, gameState.playerCards.length]);

  // Handle pending cards
  useEffect(() => {
    if (gameState.pendingCards.length > 0 && !currentPendingCard) {
      setCurrentPendingCard(gameState.pendingCards[0]);
      setShowCardChoice(true);
    }
  }, [gameState.pendingCards, currentPendingCard]);

  // Check for mission completions
  useEffect(() => {
    const completedMissions = gameState.activeMissions.filter(
      mission => mission.status === 'completed' && !processedCompletions.has(mission.id)
    );

    if (completedMissions.length > 0) {
      const mission = completedMissions[0];
      setCompletedMission(mission);
      setShowMissionCompleted(true);
      setProcessedCompletions(prev => new Set([...prev, mission.id]));
    }
  }, [gameState.activeMissions, processedCompletions]);

  // Auto-clear new card flags after 5 seconds
  useEffect(() => {
    const newCardsCount = gameState.playerCards.filter(card => card.isNew).length;
    if (newCardsCount > 0 && clearNewCardFlags) {
      const timer = setTimeout(() => {
        clearNewCardFlags();
      }, 5000); // Clear after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [gameState.playerCards, clearNewCardFlags]);

  // Update active cards status periodically
  useEffect(() => {
    if (updateActiveCards) {
      updateActiveCards();
    }
  }, [assetAllocations, gameState.currentDay, updateActiveCards]);

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
    setShowCardChoice(false);
    setCurrentPendingCard(null);
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
        onClose={() => setCardCollectionOpen && setCardCollectionOpen(false)}
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