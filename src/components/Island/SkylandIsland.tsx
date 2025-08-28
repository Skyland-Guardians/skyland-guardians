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
              top: -40,
              right: -50,
              width: '20rem',
              height: '30rem',
              zIndex: -1
            }}
          />
          <img 
            src="./assets/main-screen-2-assets/lightning-left.png"
            alt="Lightning"
            style={{
              position: 'absolute',
              top: -30,
              left: -40,
              width: '20rem',
              height: '30rem',
              zIndex: -1
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
        {/* Island image with floating animation */}
        <img 
          src="./assets/main-screen-1-assets/background-sky-island.png"
          alt="Skyland Base"
          style={{
            width: '100%',
            height: '100%',
            filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.25)) brightness(110%)',
            border: 'none',
            outline: 'none',
            boxSizing: 'content-box',
            display: 'block',
          }}
        />
      </div>
    </div>
  );
}