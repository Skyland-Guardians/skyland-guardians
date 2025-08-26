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
          backgroundColor: 'transparent',
          color: '#1e3a8a',
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
              width: '6rem', // Slightly narrower
              height: '8rem' // Same height as badge
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
          {/* Badge main interface image */}
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img 
              src="/assets/主界面1资源/徽章主界面icon.png" 
              alt="Badge"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
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