import { GameProvider } from './components/GameProvider/GameProvider';
import { MainScreen } from './components/MainScreen/MainScreen';

function App() {
  return (
    <GameProvider>
      <MainScreen />
    </GameProvider>
  );
}

export default App;
