import { useGameState } from '../../hooks/useGameState';

export function Header() {
  const { gameState, userInfo } = useGameState();

  return (
    <header className="flex justify-between items-center p-6 bg-gradient-to-r from-purple-100 to-blue-100">
      {/* Left side - User Info */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-200">
          <img 
            src={userInfo.avatar} 
            alt="User Avatar" 
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-lg font-bold text-blue-900 uppercase tracking-wide">
            {userInfo.name}, GUARD YOUR FORTUNE!
          </h1>
          <p className="text-sm text-blue-700 font-medium">
            LEVEL {userInfo.level}
          </p>
        </div>
      </div>

      {/* Right side - Game Status */}
      <div className="flex items-center gap-4">
        <div className="bg-blue-500 text-white px-4 py-2 rounded-full font-bold text-sm">
          DAY {gameState.currentDay}
        </div>
        <div className="bg-blue-600 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2">
          <span className="text-yellow-300">★</span>
          <span>{gameState.stars}</span>
        </div>
      </div>
    </header>
  );
}