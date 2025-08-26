import { useGameState } from '../../hooks/useGameContext';

export function Header() {
  const { gameState, userInfo } = useGameState();

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1.5rem',
      backgroundColor: 'transparent',
      position: 'relative',
      zIndex: 3
    }}>
      {/* Left side - User Info */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '1rem'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <div style={{
            width: '4rem',
            height: '4rem',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '4px solid #fed7aa',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
          }}>
            <img 
              src={userInfo.avatar} 
              alt="User Avatar" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
          <p style={{
            fontSize: '1rem',
            color: '#1e40af',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            margin: 0,
            textAlign: 'center'
          }}>
            LEVEL {userInfo.level}
          </p>
        </div>
        <div>
          <h1 style={{
            fontSize: '1.25rem',
            fontWeight: '900',
            color: '#1e3a8a',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            margin: 0,
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
          }}>
            {userInfo.name}, GUARD YOUR FORTUNE!
          </h1>
        </div>
      </div>

      {/* Right side - Game Status - matching design */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <div style={{
          background: 'transparent',
          color: '#1e3a8a',
          padding: '0.75rem 1.5rem',
          fontWeight: '900',
          fontSize: '1rem'
        }}>
          DAY {gameState.currentDay}
        </div>
        <div style={{
          background: '#2563eb',
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.75rem',
          fontWeight: '900',
          fontSize: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>
          <span style={{
            color: '#fde047',
            fontSize: '1.25rem'
          }}>★</span>
          <span>{gameState.stars}</span>
        </div>
      </div>
    </header>
  );
}