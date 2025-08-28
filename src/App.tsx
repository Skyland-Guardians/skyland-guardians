import { GameProvider } from './components/GameProvider/GameProvider';
import { MainScreen } from './components/MainScreen/MainScreen';
import { EventManager } from './components/EventManager';
import { AchievementAnimation } from './components/AchievementAnimation';
import { useGameState } from './hooks/useGameContext';

function AppContent() {
  const { newAchievements = [], onAchievementAnimationComplete } = useGameState();

  return (
    <>
      <MainScreen />
      <EventManager />
      {newAchievements.length > 0 && (
        <AchievementAnimation 
          newAchievements={newAchievements}
          onAnimationComplete={onAchievementAnimationComplete || (() => {})}
        />
      )}
    </>
  );
}

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

export default App;
