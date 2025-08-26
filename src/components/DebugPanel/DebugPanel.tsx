import { useGameState } from '../../hooks/useGameContext';

export function DebugPanel() {
  const { gameState, updateGameState } = useGameState();

  const toggleMode = () => {
    updateGameState({
      mode: gameState.mode === 'normal' ? 'chaos' : 'normal'
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: '1rem',
      right: '1rem',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '1rem',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      zIndex: 50,
      minWidth: '200px'
    }}>
      <div style={{
        fontWeight: 'bold',
        color: '#fde047',
        marginBottom: '0.5rem'
      }}>
        🔧 Debug Panel
      </div>
      
      <button 
        onClick={toggleMode}
        style={{
          width: '100%',
          padding: '0.5rem 0.75rem',
          borderRadius: '0.25rem',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          backgroundColor: gameState.mode === 'chaos' ? '#dc2626' : '#2563eb',
          color: 'white',
          marginBottom: '0.5rem'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = gameState.mode === 'chaos' ? '#ef4444' : '#3b82f6';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = gameState.mode === 'chaos' ? '#dc2626' : '#2563eb';
        }}
      >
        <div>Mode: {gameState.mode.toUpperCase()}</div>
        <div style={{
          fontSize: '0.75rem',
          opacity: 0.75,
          marginTop: '0.25rem'
        }}>
          Click to toggle
        </div>
      </button>
      
      <div style={{
        fontSize: '0.75rem',
        opacity: 0.75,
        borderTop: '1px solid #6b7280',
        paddingTop: '0.5rem'
      }}>
        Day: {gameState.currentDay} | Stars: {gameState.stars}
      </div>
    </div>
  );
}