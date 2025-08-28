import { useEffect, useState } from 'react';
import type { Mission } from '../../types/game';
import './MissionCompletedModal.css';

interface MissionCompletedModalProps {
  mission: Mission | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MissionCompletedModal({ mission, isOpen, onClose }: MissionCompletedModalProps) {
  const [animationPhase, setAnimationPhase] = useState<'enter' | 'celebrate' | 'exit'>('enter');

  useEffect(() => {
    if (isOpen && mission) {
      setAnimationPhase('enter');
      
      const celebrateTimer = setTimeout(() => {
        setAnimationPhase('celebrate');
      }, 500);

      const autoCloseTimer = setTimeout(() => {
        setAnimationPhase('exit');
        setTimeout(onClose, 300);
      }, 4000);

      return () => {
        clearTimeout(celebrateTimer);
        clearTimeout(autoCloseTimer);
      };
    }
  }, [isOpen, mission, onClose]);

  if (!isOpen || !mission) return null;

  return (
    <div className="mission-completed-overlay">
      <div className={`mission-completed-modal ${animationPhase}`}>
        <div className="celebration-animation">
          <div className="celebration-stars">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`star star-${i + 1}`}>⭐</div>
            ))}
          </div>
          <div className="celebration-fireworks">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`firework firework-${i + 1}`}>✨</div>
            ))}
          </div>
        </div>

        <div className="mission-completed-content">
          <div className="completion-icon">🎉</div>
          <h2 className="completion-title">Mission Completed!</h2>
          
          <div className="mission-info">
            <h3 className="mission-name">{mission.title}</h3>
            <p className="mission-focus">🎯 {mission.focus}</p>
          </div>

          <div className="reward-section">
            <div className="stars-earned">
              <span className="stars-label">Stars Earned:</span>
              <div className="stars-display">
                {[...Array(mission.rewardStars)].map((_, i) => (
                  <span key={i} className={`reward-star star-animate-${i}`}>⭐</span>
                ))}
              </div>
            </div>
          </div>

          <div className="completion-message">
            <p>Excellent work! You've successfully completed this mission and earned valuable experience.</p>
          </div>

          <button className="close-celebration-btn" onClick={onClose}>
            Continue Playing
          </button>
        </div>
      </div>
    </div>
  );
}