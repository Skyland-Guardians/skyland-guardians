import { useGameState } from '../../hooks/useGameContext';

export function SkylandIsland() {
  const { gameState } = useGameState();
  const isChaoMode = gameState.mode === 'chaos';

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '400px', // Reduced from 500px
        maxWidth: '500px', // Reduced from 600px
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto'
      }}
    >

      {/* Lightning effects for chaos mode */}
      {isChaoMode && (
        <>
          <img 
            src="./assets/main-screen-2-assets/lightning-right.png"
            alt="Lightning"
            style={{
              position: 'absolute',
              top: '10%',
              right: '10%',
              width: '4rem',
              height: '8rem',
              animation: 'pulse 2s infinite',
              zIndex: 1
            }}
          />
          <img 
            src="./assets/main-screen-2-assets/lightning-left.png"
            alt="Lightning"
            style={{
              position: 'absolute',
              top: '15%',
              left: '15%',
              width: '3rem',
              height: '7rem',
              animation: 'pulse 2s infinite 0.5s',
              zIndex: 1
            }}
          />
        </>
      )}

      {/* Main Island Container */}
      <div style={{ 
        position: 'relative',
        width: '100%',
        maxWidth: '400px', // Reduced from 600px
        height: '320px' // Reduced from 400px
      }}>
        {/* Island with floating animation */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          animation: 'pulse 4s infinite'
        }}>
          <img 
            src="./assets/main-screen-1-assets/background-sky-island.png"
            alt="Skyland Base"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.25)) brightness(110%)'
            }}
          />
          
          {/* Floating glow effect */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to top, rgba(251, 146, 60, 0.3), transparent, rgba(147, 197, 253, 0.3))',
            opacity: 0.3,
            borderRadius: '50%',
            filter: 'blur(3rem)',
            animation: 'pulse 3s infinite'
          }}></div>
        </div>
        
        {/* Particle effects - positioned relative to container */}
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '15%',
          width: '0.25rem',
          height: '0.25rem',
          backgroundColor: '#93c5fd',
          borderRadius: '50%',
          opacity: 0.5,
          animation: 'ping 1s infinite 1s'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '25%',
          left: '20%',
          width: '0.375rem',
          height: '0.375rem',
          backgroundColor: '#fdba74',
          borderRadius: '50%',
          opacity: 0.6,
          animation: 'ping 1s infinite 2s'
        }}></div>
      </div>
    </div>
  );
}