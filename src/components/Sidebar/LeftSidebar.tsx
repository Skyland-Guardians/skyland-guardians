import { useState } from 'react';
import { useGameState } from '../../hooks/useGameContext';
import { AchievementPanel } from '../AchievementPanel/AchievementPanel';
import { achievementService } from '../../services/achievement-service';

export function LeftSidebar() {
  const { setCardCollectionOpen } = useGameState();
  const [showBadges, setShowBadges] = useState(false);
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
        onClick={() => setCardCollectionOpen(true)}
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
            				src="./assets/main-screen-1-assets/card-main-icon.png" 
            alt="Cards"
            style={{
              width: '9rem', // Slightly narrower
              height: '12rem' // Same height as badge
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
        transition: 'all 0.2s ease',
        padding: '0.5rem 1rem',
      }}
      onClick={() => setShowBadges(true)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}>
        <div style={{
          width: '9rem', // Increased from 6rem to 8rem
          height: '9rem',
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
              				src="./assets/main-screen-1-assets/badge-main-icon.png" 
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
      {/* BADGES 弹窗 */}
      {showBadges && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.4)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
          onClick={() => setShowBadges(false)}
        >
          <div style={{
            background: '#fff',
            borderRadius: 16,
            padding: 32,
            minWidth: 320,
            boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
            position: 'relative',
          }}
            onClick={e => e.stopPropagation()}
          >
            <button style={{
              position: 'absolute',
              top: 8,
              right: 8,
              background: 'transparent',
              border: 'none',
              fontSize: 24,
              cursor: 'pointer',
            }} onClick={() => setShowBadges(false)}>&times;</button>
            <AchievementPanel summary={achievementService.getSummary()} />
          </div>
        </div>
      )}
    </aside>
  );
}