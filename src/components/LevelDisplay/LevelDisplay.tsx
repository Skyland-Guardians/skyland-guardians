import { useGameState } from '../../hooks/useGameContext';
import './LevelDisplay.css';

export function LevelDisplay() {
  const { gameState, getLevelProgress } = useGameState();
  
  if (!getLevelProgress) {
    return null;
  }

  const progress = getLevelProgress();
  const { currentLevel, currentLevelConfig, nextLevelConfig, progressStars, starsToNext, progressPercentage } = progress;

  return (
    <div className="level-display-content">
      <div className="level-info">
        <div className="level-badge">
          <span className="level-number">Lv.{currentLevel}</span>
          <span className="level-title">{currentLevelConfig.title}</span>
        </div>
        
        <div className="stars-info">
          <span className="stars-count">⭐ {gameState.stars}</span>
          {nextLevelConfig && (
            <span className="stars-to-next">({starsToNext} to next)</span>
          )}
        </div>
      </div>

      {nextLevelConfig && (
        <div className="level-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
          <div className="progress-text">
            {progressStars} / {nextLevelConfig.requiredStars - currentLevelConfig.requiredStars} stars
          </div>
        </div>
      )}

      {!nextLevelConfig && (
        <div className="max-level">
          <span className="max-level-text">🏆 MAX LEVEL</span>
        </div>
      )}
      
      {/* Level Description */}
      <div className="level-description">
        <p className="description-text">{currentLevelConfig.description}</p>
      </div>
    </div>
  );
}