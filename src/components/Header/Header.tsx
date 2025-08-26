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
        alignItems: 'center',
        gap: '1rem'
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
          <p style={{
            fontSize: '1rem',
            color: '#1e40af',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            margin: '0.25rem 0 0 0'
          }}>
            LEVEL {userInfo.level}
          </p>
        </div>
      </div>

      {/* Right side - Game Status */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <div style={{
          background: 'linear-gradient(to right, #3b82f6, #2563eb)',
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '9999px',
          fontWeight: '900',
          fontSize: '1rem',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          border: '2px solid #60a5fa'
        }}>
          DAY {gameState.currentDay}
        </div>
        <div style={{
          background: 'linear-gradient(to right, #2563eb, #1d4ed8)',
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '9999px',
          fontWeight: '900',
          fontSize: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          border: '2px solid #3b82f6'
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