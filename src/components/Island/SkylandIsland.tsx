import { useGameState } from '../../hooks/useGameState';

export function SkylandIsland() {
  const { gameState } = useGameState();
  const isChaoMode = gameState.mode === 'chaos';

  return (
    <div className={`relative flex-1 flex items-center justify-center transition-all duration-1000 ${
      isChaoMode 
        ? 'bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900' 
        : 'bg-gradient-to-b from-purple-100 via-blue-50 to-purple-200'
    }`}>
      
      {/* Clouds */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-10 left-20 w-16 h-8 rounded-full opacity-60 ${
          isChaoMode ? 'bg-gray-700' : 'bg-white'
        }`}></div>
        <div className={`absolute top-16 right-32 w-12 h-6 rounded-full opacity-50 ${
          isChaoMode ? 'bg-gray-600' : 'bg-white'
        }`}></div>
        <div className={`absolute top-24 left-1/3 w-20 h-10 rounded-full opacity-40 ${
          isChaoMode ? 'bg-gray-800' : 'bg-white'
        }`}></div>
      </div>

      {/* Lightning effects for chaos mode */}
      {isChaoMode && (
        <>
          <img 
            src="/src/assets/主界面2 资源/一号闪电右.png"
            alt="Lightning"
            className="absolute top-16 right-20 w-16 h-32 animate-pulse"
          />
          <img 
            src="/src/assets/主界面2 资源/二号闪电左.png"
            alt="Lightning"
            className="absolute top-12 left-24 w-12 h-28 animate-pulse delay-500"
          />
        </>
      )}

      {/* Main Island Container */}
      <div className="relative">
        {/* Island Base */}
        <div className="relative w-96 h-64">
          <img 
            src="/src/assets/主界面1资源/背景空岛.png"
            alt="Skyland Base"
            className="w-full h-full object-contain drop-shadow-2xl"
          />
          
          {/* Buildings and landscape elements positioned on the island */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-80 h-48">
              
              {/* Background buildings */}
              <div className="absolute top-8 left-16 w-8 h-16 bg-orange-400 rounded-t-sm"></div>
              <div className="absolute top-6 left-24 w-6 h-20 bg-blue-500 rounded-t-sm"></div>
              <div className="absolute top-10 left-32 w-10 h-12 bg-orange-300 rounded-t-sm"></div>
              
              {/* Main central building */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-12 h-24 bg-blue-600 rounded-t-sm">
                <div className="w-full h-2 bg-orange-400 mt-2"></div>
                <div className="w-full h-2 bg-orange-400 mt-2"></div>
                <div className="w-full h-2 bg-orange-400 mt-2"></div>
              </div>
              
              {/* Right side buildings */}
              <div className="absolute top-8 right-16 w-8 h-14 bg-orange-500 rounded-t-sm"></div>
              <div className="absolute top-12 right-24 w-6 h-10 bg-blue-400 rounded-t-sm"></div>
              
              {/* Trees */}
              <div className="absolute top-16 left-12 w-3 h-6 bg-orange-600 rounded-full"></div>
              <div className="absolute top-18 left-20 w-3 h-6 bg-blue-700 rounded-full"></div>
              <div className="absolute top-20 right-12 w-3 h-6 bg-green-600 rounded-full"></div>
              <div className="absolute top-16 right-20 w-3 h-6 bg-blue-600 rounded-full"></div>
              
              {/* Small decorative elements */}
              <div className="absolute bottom-8 left-1/4 w-2 h-4 bg-orange-400 rounded-t-full"></div>
              <div className="absolute bottom-6 right-1/4 w-2 h-4 bg-blue-500 rounded-t-full"></div>
            </div>
          </div>
          
          {/* Floating animation */}
          <div className="absolute inset-0 animate-bounce" style={{ animationDuration: '3s' }}>
            <div className="w-full h-full opacity-20 bg-gradient-to-t from-blue-400 to-transparent rounded-full blur-xl transform translate-y-8"></div>
          </div>
        </div>
      </div>
    </div>
  );
}