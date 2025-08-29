import { Header } from '../Header/Header';
import { LeftSidebar } from '../Sidebar/LeftSidebar';
import { SkylandIsland } from '../Island/SkylandIsland';
import { AIPanel } from '../AIPanel/AIPanel';
import { AssetToolbar } from '../AssetToolbar/AssetToolbar';
import { useGameState } from '../../hooks/useGameContext';
import { ParentControlPanel } from '../ParentControlPanel/ParentControlPanel';

import { BadgesPanel } from '../BadgesPanel/BadgesPanel';
import { DebugPanel } from '../DebugPanel/DebugPanel';
import './Layout.css';
import { useState } from 'react';

export function MainScreen() {
  const { gameState } = useGameState();
  const [showParentControl, setShowParentControl] = useState(false);
  const isChaoMode = gameState.mode === 'chaos';

  return (
    <>
      {/* Global background based on mode */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: isChaoMode ? '#272347' : '#FFF5E5',
        zIndex: -100,
        pointerEvents: 'none'
      }} />
      
      {/* Background decorative elements - outside main container */}
      {!isChaoMode && (
        <>
          <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '60%',
            background: 'url("./assets/main-screen-1-assets/background-color-block-2.png")',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'bottom center',
            zIndex: -10,
            pointerEvents: 'none'
          }} />

          <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '70%',
            background: 'url("./assets/main-screen-1-assets/background-color-1.png")',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'bottom center',
            zIndex: -11,
            pointerEvents: 'none'
          }} />
        </>
      )}
      
      {/* Sky Island - fixed at root level so it never overlays panels */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(900px, 70vw)',
        aspectRatio: '11 / 8',
        zIndex: -3, // above background color blocks (-10/-11 and -4), below all UI
        pointerEvents: 'none',
        backgroundColor: 'transparent'
      }}>
        <SkylandIsland />
      </div>

      {/* Chaos mode background color blocks */}
      {isChaoMode && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          width: '100%',
          height: '70%',
          background: 'url("./assets/main-screen-2-assets/background-color-block3.png")',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%',
          backgroundPosition: 'bottom center',
          zIndex: -4,
          pointerEvents: 'none'
        }} />
      )}
      
      <div className="main-game-layout" style={{
        background: 'transparent', // 完全透明让背景色块显示
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        fontFamily: 'Arial, sans-serif',
        position: 'relative',
        zIndex: 1
      }}>
        
        {/* Header - spans full width, fixed height */}
        <header className="layout-header">
          <Header />
        </header>
        
        {/* Left Panel - fixed width, full height of main area */}
        <aside className="layout-left-panel">
          <LeftSidebar />
        </aside>
        
        {/* Main Content - transparent to show background */}
        <main className="layout-main-content">
          {/* Content area is transparent; island rendered at root */}
          <BadgesPanel />
        </main>
        
        {/* Right Panel - fixed width, full height of main area */}
        <aside className="layout-right-panel">
          <AIPanel />
        </aside>
        
        {/* Asset Toolbar - spans full width, fixed height */}
        <footer className="layout-asset-toolbar">
          <AssetToolbar />
        </footer>

        {/* Floating Modal Components - highest z-index */}
        <div className="modal-container">
          <DebugPanel />
        </div>
        
        {/* Parent Control Entry Button - Fixed position in bottom right */}
        <button
          onClick={() => setShowParentControl(true)}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(145deg, #6366f1, #4f46e5)',
            border: 'none',
            boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)',
            cursor: 'pointer',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 12px 35px rgba(99, 102, 241, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.4)';
          }}
          title="Parent Control Panel"
        >
          <img 
            src="./assets/main-screen-1-assets/ai-character-icon.png" 
            alt="Parent Control" 
            style={{ 
              width: '36px', 
              height: '36px',
              filter: 'brightness(0) invert(1)'
            }}
          />
        </button>

        {/* Parent Control Panel */}
        <ParentControlPanel
          isOpen={showParentControl}
          onClose={() => setShowParentControl(false)}
        />
        
      </div>
    </>
  );
}
