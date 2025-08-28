import { useGameState } from '../../hooks/useGameContext';

export function Header() {
  const { gameState, userInfo, coins, addMessage, assetAllocations, performanceHistory, getLevelProgress } = useGameState();
  
  // 获取等级信息，如果没有getLevelProgress则使用默认值
  const levelInfo = getLevelProgress ? getLevelProgress() : {
    currentLevel: gameState.level,
    currentLevelConfig: { title: 'Guardian', description: 'Starting your journey in Skyland.' },
    nextLevelConfig: null,
    progressStars: 0,
    starsToNext: 0,
    progressPercentage: 0
  };

  const handleGameHelp = async () => {
    // Add thinking message
    addMessage({
      id: `ai-thinking-help-${Date.now()}`,
      sender: 'ai',
      content: '🤔 *Let me explain how to play this game...*',
      timestamp: new Date(),
      type: 'feedback'
    });

    try {
      const { gamifiedAIService } = await import('../../services/gamified-ai-service');
      const response = await gamifiedAIService.getGameResponse(
        'Explain how this investment game works. What should I focus on?',
        {
          assets: assetAllocations,
          currentDay: gameState.currentDay,
          stars: gameState.stars,
          level: gameState.level,
          coins: coins || 1000,
          performanceHistory: performanceHistory
        }
      );

      // Add AI explanation
      addMessage({
        id: `ai-help-explain-${Date.now()}`,
        sender: 'ai',
        content: response,
        timestamp: new Date(),
        type: 'feedback'
      });
    } catch (error) {
      console.error('Failed to get AI help:', error);
      // Fallback explanation
      addMessage({
        id: `ai-help-fallback-${Date.now()}`,
        sender: 'ai',
        content: 'Welcome to Skyland Guardians! Adjust your asset allocations, apply changes, and see how your portfolio performs. Diversification is key to managing risk! 🏰',
        timestamp: new Date(),
        type: 'feedback'
      });
    }
  };

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1.2rem 3rem',
      backgroundColor: 'transparent',
      position: 'relative'
    }}>
      {/* Left side - User Info */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <div style={{
            width: '4rem',
            height: '4rem',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '4px solid #fed7aa',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
          }}>
            <img 
              src={userInfo.avatar} 
              alt="User Avatar" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.3rem'
        }}>
          {/* Level and Title */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{
              fontSize: '0.85rem',
              color: '#1e40af',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              LEVEL {levelInfo.currentLevel}
            </span>
            <span style={{
              fontSize: '0.75rem',
              color: '#6366f1',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {levelInfo.currentLevelConfig.title}
            </span>
            {levelInfo.nextLevelConfig && (
              <span style={{
                fontSize: '0.7rem',
                color: '#fbbf24',
                fontWeight: '600'
              }}>
                ({levelInfo.starsToNext} ★ to next)
              </span>
            )}
          </div>
          {/* User Name and Description */}
          <h1 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: '#1e3a8a',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            margin: '0',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
          }}>
            {userInfo.name}, {levelInfo.currentLevelConfig.description}
          </h1>
          {/* Progress Bar */}
          {levelInfo.nextLevelConfig && (
            <div style={{
              width: '200px',
              height: '4px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '2px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${Math.min(levelInfo.progressPercentage, 100)}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #4caf50, #81c784)',
                borderRadius: '2px',
                transition: 'width 0.3s ease'
              }} />
            </div>
          )}
        </div>
      </div>

      {/* Right side - Game Status - unified design */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        {/* Coins */}
        <div style={{
          background: 'linear-gradient(145deg, #f59e0b, #ea580c)',
          color: 'white',
          padding: '0.75rem 1.25rem',
          borderRadius: '1rem',
          fontWeight: '700',
          fontSize: '1.1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
        }}>
          <span style={{ fontSize: '1.2rem' }}>💰</span>
          <span>{typeof coins === 'number' ? coins.toLocaleString() : '--'}</span>
        </div>
        
        {/* Day */}
        <div style={{
          background: 'linear-gradient(145deg, #3b82f6, #1d4ed8)',
          color: 'white',
          padding: '0.75rem 1.25rem',
          borderRadius: '1rem',
          fontWeight: '700',
          fontSize: '1.1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
        }}>
          <span style={{ fontSize: '1.2rem' }}>📅</span>
          <span>DAY {gameState.currentDay}</span>
        </div>
        
        {/* Stars */}
        <div style={{
          background: 'linear-gradient(145deg, #8b5cf6, #6d28d9)',
          color: 'white',
          padding: '0.75rem 1.25rem',
          borderRadius: '1rem',
          fontWeight: '700',
          fontSize: '1.1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
        }}>
          <span style={{ 
            color: '#fde047',
            fontSize: '1.3rem',
            textShadow: '0 0 8px rgba(253, 224, 71, 0.6)'
          }}>★</span>
          <span>{gameState.stars}</span>
        </div>
        
        {/* Game Help Button */}
        <button
          onClick={handleGameHelp}
          style={{
            background: 'linear-gradient(145deg, #10b981, #059669)',
            color: 'white',
            padding: '0.75rem 1rem',
            borderRadius: '1rem',
            fontWeight: '700',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(145deg, #059669, #047857)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(145deg, #10b981, #059669)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          title="Get game instructions"
        >
          <span style={{ fontSize: '1.2rem' }}>🎮</span>
          <span>How to Play</span>
        </button>
      </div>
    </header>
  );
}