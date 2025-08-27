import { Header } from '../Header/Header';
import { LeftSidebar } from '../Sidebar/LeftSidebar';
import { SkylandIsland } from '../Island/SkylandIsland';
import { AIPanel } from '../AIPanel/AIPanel';
import { AssetToolbar } from '../AssetToolbar/AssetToolbar';
import { useGameState } from '../../hooks/useGameContext';
import { MissionCard } from '../MissionCard/MissionCard';
import { CardCollection } from '../CardCollection/CardCollection';
import { DebugPanel } from '../DebugPanel/DebugPanel';
import { AchievementPanel } from '../AchievementPanel/AchievementPanel';
import { achievementService } from '../../services/achievement-service';

export function MainScreen() {
  const { gameState } = useGameState();
  const isChaoMode = gameState.mode === 'chaos';

  return (
    <div style={{
      height: '100vh',
      overflow: 'hidden',
      background: isChaoMode 
        ? 'linear-gradient(135deg, #1e1b4b 0%, #374151 50%, #1e1b4b 100%)' 
        : 'linear-gradient(135deg, #FDF6E3 0%, #FFF8E1 30%, #F5E6A3 70%, #E8D5A6 100%)', // Warm cream/yellow tones
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      fontFamily: 'Arial, sans-serif',
      position: 'relative'
    }}>
      
      {/* Background decorative elements */}
      {!isChaoMode && (
        <>
          {/* Bottom purple decoration - more rounded arc shape */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '40%',
            background: 'url("./assets/main-screen-1-assets/background-color-block-2.png")',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'bottom center',
            zIndex: 2
          }} />

          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            width: '100%',
            height: '50%',
            background: 'url("./assets/main-screen-1-assets/background-color-1.png")',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'bottom center',
            zIndex: 1,
          }} />
          

          

        </>
      )}
      
      {/* Header */}
      <Header />
      
      {/* Main Content Area */}
      <main style={{
        display: 'flex',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Left Sidebar */}
        <LeftSidebar />
        
        {/* Central Island Area */}
        <SkylandIsland />
        
        {/* Right AI Panel */}
        <AIPanel />
      </main>
      
      {/* Bottom Asset Toolbar - moved up to overlay 1/4 of island */}
      <div style={{
        position: 'fixed',
        bottom: '15vh', // Moved down further from 20vh
        left: 0,
        right: 0,
        zIndex: 10 // Ensure it's above the island
      }}>
        <AssetToolbar />
      </div>

      <MissionCard />
      <CardCollection />
      <DebugPanel />
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
  );
}