import { useGameState } from '../../hooks/useGameContext';

export function AIPanel() {
  const { currentAIMessage } = useGameState();
  return (
    <aside
      style={{
        width: '18rem',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        position: 'relative'
      }}
    >
      {/* AI Rabbit - positioned at top right like design */}
      <div style={{
        position: 'absolute',
        top: '0.5rem',
        right: '0.5rem',
        zIndex: 2
      }}>
        <img 
          src="/assets/主界面1资源/ai人物自动对话.png"
          alt="AI Rabbit"
          style={{
            width: '12rem',
            height: '30rem',
            objectFit: 'contain'
          }}
        />
      </div>
      {currentAIMessage && (
        <div
          style={{
            marginTop: '22rem',
            backgroundColor: '#ffffff',
            borderRadius: '0.5rem',
            padding: '0.5rem 1rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            maxWidth: '16rem'
          }}
        >
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#1e3a8a' }}>
            {currentAIMessage.content}
          </p>
        </div>
      )}
    </aside>
  );
}