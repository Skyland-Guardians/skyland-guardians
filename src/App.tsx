import { GameProvider } from './hooks/useGameState';
import { MainScreen } from './components/MainScreen/MainScreen';

function App() {
  return (
    <GameProvider>
      <MainScreen />
    </GameProvider>
  );
}

export default App;
