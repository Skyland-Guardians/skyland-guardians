import { useGameState } from '../../hooks/useGameContext';

export function SkylandIsland() {
  const { gameState } = useGameState();
  const isChaoMode = gameState.mode === 'chaos';

  return (
    <div style={{
      position: 'relative',
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 1s ease',
      backgroundColor: 'transparent' // Remove the blue/purple background
    }}>
      
      {/* Clouds */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '2.5rem',
          left: '5rem',
          width: '4rem',
          height: '2rem',
          borderRadius: '9999px',
          opacity: 0.6,
          backgroundColor: isChaoMode ? '#374151' : 'white'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '4rem',
          right: '8rem',
          width: '3rem',
          height: '1.5rem',
          borderRadius: '9999px',
          opacity: 0.5,
          backgroundColor: isChaoMode ? '#4b5563' : 'white'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '6rem',
          left: '33%',
          width: '5rem',
          height: '2.5rem',
          borderRadius: '9999px',
          opacity: 0.4,
          backgroundColor: isChaoMode ? '#1f2937' : 'white'
        }}></div>
      </div>

      {/* Lightning effects for chaos mode */}
      {isChaoMode && (
        <>
          <img 
            src="/assets/主界面2资源/一号闪电右.png"
            alt="Lightning"
            style={{
              position: 'absolute',
              top: '4rem',
              right: '5rem',
              width: '4rem',
              height: '8rem',
              animation: 'pulse 2s infinite'
            }}
          />
          <img 
            src="/assets/主界面2资源/二号闪电左.png"
            alt="Lightning"
            style={{
              position: 'absolute',
              top: '3rem',
              left: '6rem',
              width: '3rem',
              height: '7rem',
              animation: 'pulse 2s infinite 0.5s'
            }}
          />
        </>
      )}

      {/* Main Island Container */}
      <div style={{ position: 'relative' }}>
        {/* Island with floating animation */}
        <div style={{
          position: 'relative',
          width: '80vw', // 80% of viewport width
          height: '80vh', // 80% of viewport height
          animation: 'pulse 4s infinite'
        }}>
          <img 
            src="/assets/主界面1资源/背景空岛.png"
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
        
        {/* Particle effects */}
        <div style={{
          position: 'absolute',
          top: '2.5rem',
          left: '5rem',
          width: '0.5rem',
          height: '0.5rem',
          backgroundColor: '#fde047',
          borderRadius: '50%',
          opacity: 0.7,
          animation: 'ping 1s infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '8rem',
          right: '4rem',
          width: '0.25rem',
          height: '0.25rem',
          backgroundColor: '#93c5fd',
          borderRadius: '50%',
          opacity: 0.5,
          animation: 'ping 1s infinite 1s'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '5rem',
          left: '8rem',
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