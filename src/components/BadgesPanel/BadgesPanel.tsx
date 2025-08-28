import { AchievementPanel } from '../AchievementPanel/AchievementPanel';
import { achievementService } from '../../services/achievement-service';
import { useGameState } from '../../hooks/useGameContext';

export function BadgesPanel() {
  const { isBadgesOpen, setBadgesOpen } = useGameState();
  if (!isBadgesOpen) return null;

  return (
    <div className="panel-overlay no-backdrop" onClick={() => setBadgesOpen && setBadgesOpen(false)}>
      <div className="panel-card" onClick={e => e.stopPropagation()}>
        <button className="panel-close" onClick={() => setBadgesOpen && setBadgesOpen(false)}>×</button>
        <AchievementPanel summary={achievementService.getSummary()} />
      </div>
    </div>
  );
}
