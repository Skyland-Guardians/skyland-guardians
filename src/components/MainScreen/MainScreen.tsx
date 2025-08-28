import { Header } from '../Header/Header';
import { LeftSidebar } from '../Sidebar/LeftSidebar';
import { SkylandIsland } from '../Island/SkylandIsland';
import { AIPanel } from '../AIPanel/AIPanel';
import { AssetToolbar } from '../AssetToolbar/AssetToolbar';
import { useGameState } from '../../hooks/useGameContext';
import { MissionCard } from '../MissionCard/MissionCard';
import { CardCollection } from '../CardCollection/CardCollection';
import { DebugPanel } from '../DebugPanel/DebugPanel';
import './Layout.css';

export function MainScreen() {
  const { gameState } = useGameState();
  const isChaoMode = gameState.mode === 'chaos';

  return (
    <>
      {/* Background decorative elements - outside main container */}
      {!isChaoMode && (
        <>
          {/* Sky Island as background element */}
          <div style={{
            position: 'fixed',
            top: '45%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '1200px', // 继续放大容器以容纳更更大的岛屿
            height: '960px', // 继续放大容器以容纳更更大的岛屿
            zIndex: -1, // 设为负值，在所有UI元素之下但在背景色块之上
            pointerEvents: 'none' // 确保不阻挡任何交互
          }}>
            <SkylandIsland />
          </div>
          
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
      
      <div className="main-game-layout" style={{
        background: isChaoMode 
          ? 'linear-gradient(135deg, rgba(30,27,75,0.9) 0%, rgba(55,65,81,0.9) 50%, rgba(30,27,75,0.9) 100%)' 
          : 'transparent', // 完全透明让背景显示
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
          {/* Content area is now transparent */}
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
          <MissionCard />
          <CardCollection />
          <DebugPanel />
        </div>
        
        {/* Chaos Mode Overlay Effects */}
        {isChaoMode && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            zIndex: 10
          }}>
            {/* Screen shake effect */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(239, 68, 68, 0.05)',
              animation: 'pulse 2s infinite'
            }}></div>
          </div>
        )}
      </div>
    </>
  );
}