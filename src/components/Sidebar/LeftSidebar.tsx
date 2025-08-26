export function LeftSidebar() {
  return (
    <aside style={{
      width: '12rem', // Increased width for larger buttons
      padding: '1.5rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem' // Increased gap
    }}>
      {/* MY CARDS Button - Larger size */}
      <button 
        style={{
          backgroundColor: '#1e3a8a',
          color: 'white',
          padding: '1.5rem 1rem', // Increased padding
          borderRadius: '0.75rem',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.2s ease',
          border: 'none',
          cursor: 'pointer',
          width: '100%', // Full width of sidebar
          minHeight: '5rem' // Minimum height
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#1e40af';
          e.currentTarget.style.transform = 'scale(1.02)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#1e3a8a';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <img 
            src="/assets/主界面1资源/卡牌主界面icon.png" 
            alt="Cards"
            style={{
              width: '2.5rem', // Larger icon
              height: '2.5rem'
            }}
          />
          <span style={{
            fontSize: '0.875rem', // Larger text
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            MY CARDS
          </span>
        </div>
        {/* Yellow highlight decoration matching original design */}
        <div style={{
          position: 'absolute',
          top: '0.5rem',
          right: '0.5rem',
          width: '2.5rem',
          height: '1rem',
          background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
          borderRadius: '0.5rem',
          opacity: 0.9
        }}></div>
        <div style={{
          position: 'absolute',
          top: '0.75rem',
          right: '0.75rem',
          width: '1rem',
          height: '1rem',
          backgroundColor: '#fbbf24',
          borderRadius: '50%'
        }}></div>
      </button>

      {/* BADGES Button - Larger size */}
      <button style={{
        position: 'relative',
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}>
        <div style={{
          width: '8rem', // Increased from 6rem to 8rem
          height: '8rem',
          margin: '0 auto',
          position: 'relative'
        }}>
          {/* Circular badge background */}
          <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom right, #2563eb, #1e40af)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '5px solid #fbbf24', // Thicker border
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)' // Added shadow
          }}>
            <img 
              src="/assets/主界面1资源/奖杯.png" 
              alt="Trophy"
              style={{
                width: '2.5rem', // Larger trophy
                height: '2.5rem'
              }}
            />
          </div>
          
          {/* Circular text around badge */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg 
              style={{
                width: '100%',
                height: '100%',
                transform: 'rotate(-90deg)'
              }} 
              viewBox="0 0 100 100"
            >
              <defs>
                <path
                  id="circle"
                  d="M 50 50 m -20 0 a 20 20 0 1 1 40 0 a 20 20 0 1 1 -40 0"
                />
              </defs>
              <text style={{
                fill: '#fbbf24',
                fontSize: '6px',
                fontWeight: 'bold',
                textTransform: 'uppercase'
              }}>
                <textPath href="#circle" startOffset="0%">
                  DIVERSIFICATION • MASTER
                </textPath>
              </text>
            </svg>
          </div>
        </div>
        
        <span style={{
          display: 'block',
          fontSize: '0.875rem', // Larger text
          fontWeight: 'bold',
          color: '#1e3a8a',
          textAlign: 'center',
          marginTop: '0.75rem', // More spacing
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          BADGES
        </span>
      </button>
    </aside>
  );
}