import { useGameState } from '../../hooks/useGameState';

export function DebugPanel() {
  const { gameState, updateGameState } = useGameState();

  const toggleMode = () => {
    updateGameState({
      mode: gameState.mode === 'normal' ? 'chaos' : 'normal'
    });
  };

  return (
    <div className="fixed top-4 right-4 bg-black bg-opacity-70 text-white p-3 rounded-lg text-sm space-y-2 z-50">
      <div className="font-bold text-yellow-300">🔧 Debug Panel</div>
      
      <button 
        onClick={toggleMode}
        className={`w-full px-3 py-1 rounded transition-colors ${
          gameState.mode === 'chaos' 
            ? 'bg-red-600 hover:bg-red-500' 
            : 'bg-blue-600 hover:bg-blue-500'
        }`}
      >
        Mode: {gameState.mode.toUpperCase()}
        <br />
        <span className="text-xs opacity-75">Click to toggle</span>
      </button>
      
      <div className="text-xs opacity-75 border-t border-gray-600 pt-2">
        Day: {gameState.currentDay} | Stars: {gameState.stars}
      </div>
    </div>
  );
}