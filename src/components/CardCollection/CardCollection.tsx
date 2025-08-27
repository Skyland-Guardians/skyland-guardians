import { useGameState } from '../../hooks/useGameContext';

export function CardCollection() {
  const { missions, events, isCardCollectionOpen, setCardCollectionOpen } = useGameState();

  if (!isCardCollectionOpen) return null;

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
          width: '48rem',
          maxHeight: '80vh',
          overflowY: 'auto',
          display: 'flex',
          gap: '2rem',
          position: 'relative'
        }}
      >
        <div style={{ flex: 1 }}>
          <h2 style={{ textAlign: 'center', color: '#1e3a8a', marginBottom: '1rem' }}>
            Mission Cards
          </h2>
          {missions.length === 0 ? (
            <p style={{ color: '#374151', textAlign: 'center' }}>No missions yet</p>
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
              {missions.map(mission => (
                <li
                  key={mission.id}
                  style={{
                    backgroundColor: '#fff',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
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
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ textAlign: 'center', color: '#1e3a8a', marginBottom: '1rem' }}>
            Event Cards
          </h2>
          {events.length === 0 ? (
            <p style={{ color: '#374151', textAlign: 'center' }}>No events yet</p>
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
              {events.map(event => (
                <li
                  key={event.id}
                  style={{
                    backgroundColor: '#fff',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem'
                  }}
                >
                  <span style={{ color: '#374151' }}>{event.title}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          onClick={() => setCardCollectionOpen(false)}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '0.25rem 0.75rem',
            borderRadius: '0.25rem',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          X
        </button>
      </div>
    </div>
  );
}
