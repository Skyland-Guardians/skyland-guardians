import { Routes, Route } from 'react-router-dom';
import { GameProvider } from './components/GameProvider/GameProvider';
import { MainScreen } from './components/MainScreen/MainScreen';
import { EventManager } from './components/EventManager';
import { AchievementAnimation } from './components/AchievementAnimation';
import { ParentDashboard } from './components/ParentDashboard/ParentDashboard';
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
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path="/parent" element={<ParentDashboard />} />
      </Routes>
    </GameProvider>
  );
}

export default App;
