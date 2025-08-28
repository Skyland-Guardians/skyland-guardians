import { useGameState } from '../../hooks/useGameContext';

export function SkylandIsland() {
  const { gameState } = useGameState();
  const isChaoMode = gameState.mode === 'chaos';

  return (
    <div
      style={{
        position: 'relative',
  width: 'min(900px, 70vw)', // 缩小响应式宽度，最大 900px
  aspectRatio: '11 / 8', // 保持宽高比，等比缩放（可根据素材调整）
  maxWidth: '900px', // 最大宽度
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto',
        pointerEvents: 'none' // 确保不阻挡鼠标事件
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
  maxWidth: '820px', // 島嶼主体最大宽度，缩小以更好匹配父容器
        height: '100%' // 使用父容器的高度（由 aspect-ratio 决定），避免硬编码
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