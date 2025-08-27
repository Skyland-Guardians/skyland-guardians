import { useGameState } from '../../hooks/useGameContext';

export function MissionCard() {
  const { currentMission, setCurrentMission, setAIMessage, addMission } = useGameState();

  if (!currentMission) return null;

  const handleAccept = () => {
    setAIMessage({
      id: `mission-${currentMission.id}`,
      content: `Mission accepted: ${currentMission.title}. Good luck!`,
      timestamp: new Date(),
      type: 'hint'
    });
    addMission(currentMission);
    setCurrentMission(null);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100
    }}>
      <div style={{
        backgroundColor: '#f5f5dc',
        padding: '2rem',
        borderRadius: '1rem',
        width: '28rem',
        boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1e3a8a' }}>
          {currentMission.title}
        </h2>
        <p style={{ marginBottom: '1rem', color: '#374151' }}>{currentMission.background}</p>
        <p style={{ marginBottom: '1rem', color: '#2563eb', fontWeight: 'bold' }}>
          Tip: {currentMission.tip}
        </p>
        <p style={{ marginBottom: '1rem', color: '#f59e0b', fontWeight: 'bold' }}>
          Reward: ⭐ {currentMission.rewardStars}
        </p>
        <button
          onClick={handleAccept}
          style={{
            marginTop: '1rem',
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '0.75rem 2rem',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Accept Mission
        </button>
      </div>
    </div>
  );
}
