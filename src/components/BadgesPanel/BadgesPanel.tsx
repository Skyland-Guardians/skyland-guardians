import { AchievementPanel } from '../AchievementPanel/AchievementPanel';
import { achievementService } from '../../services/achievement-service';
import { useGameState } from '../../hooks/useGameContext';

export function BadgesPanel() {
  const { isBadgesOpen, setBadgesOpen } = useGameState();
  if (!isBadgesOpen) return null;

  return (
    <div className="my-cards-overlay" onClick={() => setBadgesOpen && setBadgesOpen(false)}>
      <div className="my-cards-modal" onClick={e => e.stopPropagation()}>
        <AchievementPanel summary={achievementService.getSummary()} onClose={() => setBadgesOpen && setBadgesOpen(false)} />
      </div>
    </div>
  );
}
