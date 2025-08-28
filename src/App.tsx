import { GameProvider } from './components/GameProvider/GameProvider';
import { MainScreen } from './components/MainScreen/MainScreen';
import { EventManager } from './components/EventManager/EventManager';

function App() {
  return (
    <GameProvider>
      <MainScreen />
      <EventManager />
    </GameProvider>
  );
}

export default App;
