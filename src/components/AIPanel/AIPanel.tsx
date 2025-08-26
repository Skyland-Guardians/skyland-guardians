import { useGameState } from '../../hooks/useGameContext';

export function AIPanel() {
  const { currentAIMessage } = useGameState();

  return (
    <aside style={{
      width: '18rem',
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end'
    }}>
      {/* AI Character */}
      <div style={{
        position: 'relative',
        marginBottom: '1rem'
      }}>
        <img 
          src="/assets/主界面1资源/右边的AI人物.png"
          alt="AI Companion"
          style={{
            width: '6rem',
            height: '6rem',
            objectFit: 'contain',
            animation: 'pulse 2s infinite'
          }}
        />
        
        {/* Floating animation effect */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '6rem',
            height: '6rem',
            borderRadius: '50%',
            background: 'linear-gradient(to right, #fed7aa, #fdba74)',
            opacity: 0.2,
            filter: 'blur(1rem)',
            animation: 'pulse 2.5s infinite 0.5s'
          }}
        ></div>
      </div>

      {/* Chat Bubble */}
      {currentAIMessage && (
        <div style={{
          position: 'relative',
          maxWidth: '16rem'
        }}>
          {/* Speech bubble tail pointing to AI character */}
          <div style={{
            position: 'absolute',
            top: '-0.75rem',
            left: '2rem',
            width: '1.5rem',
            height: '1.5rem',
            backgroundColor: '#dbeafe',
            transform: 'rotate(45deg)',
            borderLeft: '1px solid #bfdbfe',
            borderTop: '1px solid #bfdbfe'
          }}></div>
          
          {/* Main chat bubble */}
          <div style={{
            backgroundColor: '#dbeafe',
            border: '1px solid #bfdbfe',
            borderRadius: '1rem',
            padding: '1rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
          }}>
            <p style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#1e3a8a',
              lineHeight: '1.625',
              margin: 0
            }}>
              {currentAIMessage.content}
            </p>
            
            {/* Message timestamp */}
            <div style={{
              marginTop: '0.5rem',
              fontSize: '0.75rem',
              color: '#2563eb',
              opacity: 0.75
            }}>
              {currentAIMessage.timestamp.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>

          {/* Typing indicator animation (when AI is "thinking") */}
          <div style={{
            marginTop: '0.5rem',
            display: 'flex',
            justifyContent: 'center',
            opacity: 0.6
          }}>
            <div style={{
              display: 'flex',
              gap: '0.25rem'
            }}>
              <div style={{
                width: '0.375rem',
                height: '0.375rem',
                backgroundColor: '#60a5fa',
                borderRadius: '50%',
                animation: 'bounce 1s infinite'
              }}></div>
              <div style={{
                width: '0.375rem',
                height: '0.375rem',
                backgroundColor: '#60a5fa',
                borderRadius: '50%',
                animation: 'bounce 1s infinite 0.1s'
              }}></div>
              <div style={{
                width: '0.375rem',
                height: '0.375rem',
                backgroundColor: '#60a5fa',
                borderRadius: '50%',
                animation: 'bounce 1s infinite 0.2s'
              }}></div>
            </div>
          </div>
        </div>
      )}

      {/* AI status indicator */}
      <div style={{
        marginTop: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.75rem',
        color: '#2563eb'
      }}>
        <div style={{
          width: '0.5rem',
          height: '0.5rem',
          backgroundColor: '#4ade80',
          borderRadius: '50%',
          animation: 'pulse 1s infinite'
        }}></div>
        <span style={{
          fontWeight: '500'
        }}>AI Guardian Online</span>
      </div>
    </aside>
  );
}