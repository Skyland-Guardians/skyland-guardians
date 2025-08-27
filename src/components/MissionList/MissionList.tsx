import { useGameState } from '../../hooks/useGameContext';

export function MissionList() {
  const { missions, isMissionListOpen, setMissionListOpen } = useGameState();

  if (!isMissionListOpen) return null;

  return (
    <div
      style={{
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
      }}
    >
      <div
        style={{
          backgroundColor: '#f5f5dc',
          padding: '2rem',
          borderRadius: '1rem',
          width: '24rem',
          maxHeight: '80vh',
          overflowY: 'auto',
          textAlign: 'center'
        }}
      >
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1e3a8a' }}>
          My Missions
        </h2>
        {missions.length === 0 ? (
          <p style={{ color: '#374151' }}>No missions yet</p>
        ) : (
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}
          >
            {missions.map((mission) => (
              <li
                key={mission.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#fff',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem'
                }}
              >
                <span style={{ color: '#374151' }}>{mission.title}</span>
                <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>
                  ⭐ {mission.rewardStars}
                </span>
              </li>
            ))}
          </ul>
        )}
        <button
          onClick={() => setMissionListOpen(false)}
          style={{
            marginTop: '1rem',
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '0.5rem 1.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

