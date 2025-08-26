import { Header } from '../Header/Header';
import { LeftSidebar } from '../Sidebar/LeftSidebar';
import { SkylandIsland } from '../Island/SkylandIsland';
import { AIPanel } from '../AIPanel/AIPanel';
import { AssetToolbar } from '../AssetToolbar/AssetToolbar';
import { DebugPanel } from '../DebugPanel/DebugPanel';
import { useGameState } from '../../hooks/useGameState';

export function MainScreen() {
  const { gameState } = useGameState();
  const isChaoMode = gameState.mode === 'chaos';

  return (
    <div className={`min-h-screen transition-all duration-1000 ${
      isChaoMode 
        ? 'bg-gradient-to-br from-purple-900 via-slate-800 to-purple-900' 
        : 'bg-gradient-to-br from-purple-50 via-blue-50 to-purple-100'
    }`}>
      
      {/* Header */}
      <Header />
      
      {/* Main Content Area */}
      <main className="flex-1 flex min-h-[calc(100vh-200px)]">
        {/* Left Sidebar */}
        <LeftSidebar />
        
        {/* Central Island Area */}
        <SkylandIsland />
        
        {/* Right AI Panel */}
        <AIPanel />
      </main>
      
      {/* Bottom Asset Toolbar */}
      <AssetToolbar />
      
      {/* Chaos Mode Overlay Effects */}
      {isChaoMode && (
        <div className="fixed inset-0 pointer-events-none">
          {/* Screen shake effect */}
          <div className="absolute inset-0 bg-red-500 opacity-5 animate-pulse"></div>
          
          {/* Lightning flash effect */}
          <div 
            className="absolute inset-0 bg-white opacity-0 animate-ping"
            style={{ 
              animationDuration: '0.1s', 
              animationIterationCount: '1',
              animationDelay: '2s'
            }}
          ></div>
        </div>
      )}
      
      {/* Debug Panel */}
      <DebugPanel />
      
      {/* Educational disclaimer */}
      <div className="fixed bottom-4 left-4 bg-black bg-opacity-70 text-white text-xs px-3 py-1 rounded-full">
        🎓 Educational Simulation Only
      </div>
    </div>
  );
}