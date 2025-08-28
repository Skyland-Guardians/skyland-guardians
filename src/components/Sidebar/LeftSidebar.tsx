import { useState } from 'react';
import { useGameState } from '../../hooks/useGameContext';
import { AchievementPanel } from '../AchievementPanel/AchievementPanel';
import { achievementService } from '../../services/achievement-service';

export function LeftSidebar() {
  const { setCardCollectionOpen } = useGameState();
  const [showBadges, setShowBadges] = useState(false);
  return (
    <>
      {/* MY CARDS Button */}
      <button
        onClick={() => setCardCollectionOpen(true)}
        style={{
          backgroundColor: 'transparent',
          color: '#1e3a8a',
          padding: '0.75rem',
          borderRadius: '0.75rem',
          border: 'none',
          cursor: 'pointer',
          width: '100%',
          marginBottom: '1rem',
          transition: 'all 0.2s ease'
        }}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.25rem'
        }}>
          <img 
            src="./assets/main-screen-1-assets/card-main-icon.png" 
            alt="Cards"
            style={{
              width: '4rem',
              height: '5rem',
              objectFit: 'contain'
            }}
          />
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            MY CARDS
          </span>
        </div>
      </button>

      {/* BADGES Button */}
      <button style={{
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        padding: '0.75rem',
        width: '100%',
        borderRadius: '0.75rem'
      }}
      onClick={() => setShowBadges(true)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.25rem'
        }}>
          <img 
            src="./assets/main-screen-1-assets/badge-main-icon.png" 
            alt="Badge"
            style={{
              width: '4rem',
              height: '4rem',
              objectFit: 'contain'
            }}
          />
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 'bold',
            color: '#1e3a8a',
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            BADGES
          </span>
        </div>
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
          zIndex: 5200, /* Above other modals */
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
          onClick={() => setShowBadges(false)}
        >
          <div style={{
            background: 'transparent',
            borderRadius: 16,
            padding: 0,
            width: '540px',
            maxHeight: 'calc(100vh - 120px - 80px)', // Account for asset toolbar and header
            height: 'min(70vh, calc(100vh - 200px))',
            boxShadow: 'none',
            position: 'relative',
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'center',
          }}
            onClick={e => e.stopPropagation()}
          >
            <button style={{
              position: 'absolute',
              top: 8,
              right: 8,
              background: '#ef4444',
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
              width: 28,
              height: 28,
              fontSize: 20,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#dc2626')}
            onMouseLeave={e => (e.currentTarget.style.background = '#ef4444')}
            onClick={() => setShowBadges(false)}>&times;</button>
            <AchievementPanel summary={achievementService.getSummary()} />
          </div>
        </div>
      )}
    </>
  );
}