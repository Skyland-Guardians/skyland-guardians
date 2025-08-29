import { useGameState } from '../../hooks/useGameContext';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import HistoryModal from '../HistoryModal/HistoryModal';
import { gamifiedAIService } from '../../services/gamified-ai-service';
// import AvatarModal from '../AvatarModal/AvatarModal';

export function Header() {
  const { gameState, userInfo, coins, addMessage, assetAllocations, performanceHistory, getLevelProgress } = useGameState();
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [avatar, setAvatar] = useState(userInfo.avatar || '/src/assets/主界面1资源/小孩头像icon.png');
  const [nickname, setNickname] = useState(userInfo.name || 'JAMES');
  const [selectedBorder, setSelectedBorder] = useState(() => {
    const stored = localStorage.getItem('userAvatarBorder');
    return stored ? Number(stored) : 0;
  });
  // const [selectedPendant, setSelectedPendant] = useState(() => {
  //   const stored = localStorage.getItem('userAvatarPendant');
  //   return stored ? Number(stored) : 0;
  // });
  // 新增：边框和挂件选择
  const borderStyles = [
    { name: 'Default', style: { border: '3px solid #4a4a6a' } },
    { name: 'Pink', style: { border: '3px solid #f472b6', boxShadow: '0 0 8px #f472b6' } },
    { name: 'Blue', style: { border: '3px solid #3b82f6', boxShadow: '0 0 8px #3b82f6' } },
    { name: 'Purple', style: { border: '3px solid #8b5cf6', boxShadow: '0 0 8px #8b5cf6' } },
    { name: 'Champion', style: { border: '3px dashed #fbbf24', boxShadow: '0 0 12px #fbbf24' } },
    { name: 'Gradient', style: { border: '3px solid transparent', background: 'linear-gradient(90deg, #f472b6, #3b82f6, #8b5cf6, #fbbf24)', boxShadow: '0 0 10px #8b5cf6', backgroundClip: 'border-box' } },
    { name: 'Dotted', style: { border: '3px dotted #6366f1', boxShadow: '0 0 8px #6366f1' } },
    { name: 'Custom', style: { border: '3px double #10b981', boxShadow: '0 0 10px #10b981', background: 'linear-gradient(135deg, #10b981 0%, #fbbf24 100%)', backgroundClip: 'border-box' } },
  ];
  // pendant icons removed — pendants are not currently used in the UI
  // Duplicate state declarations removed. Already declared above.
  // 敏感词列表
  const forbiddenWords = ['admin', 'test', 'badword', '管理员', '测试'];
  // 校验昵称格式
  function validateNickname(name: string) {
    if (!name.trim()) return 'Nickname cannot be empty';
    if (name.length > 16) return 'Nickname must be at most 16 characters';
    if (forbiddenWords.some(w => name.toLowerCase().includes(w))) return 'Nickname contains forbidden words';
    // Support emoji/special chars, allow all unicode
    return '';
  }
  const nicknameError = validateNickname(nickname);
  // 读取localStorage头像和昵称
  useEffect(() => {
    const storedAvatar = localStorage.getItem('userAvatar');
    const storedNickname = localStorage.getItem('userNickname');
    const storedBorder = localStorage.getItem('userAvatarBorder');
    if (storedAvatar) setAvatar(storedAvatar);
    if (storedNickname) setNickname(storedNickname);
    if (storedBorder) setSelectedBorder(Number(storedBorder));
  }, []);
  
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
        <div
          style={{
            position: 'relative',
            width: '4rem',
            height: '4rem',
            borderRadius: '50%',
            overflow: 'hidden',
            ...borderStyles[selectedBorder].style,
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
          }}
          onClick={() => setShowAvatarModal(true)}
          tabIndex={0}
          title="Click to edit avatar and nickname"
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') setShowAvatarModal(true);
          }}
        >
          <img 
            src={avatar} 
            alt="User Avatar" 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
          {/* 挂件已移除，不再显示 */}
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
            {nickname}, {levelInfo.currentLevelConfig.description}
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
        
        {/* History Data Button */}
        <button
          onClick={() => setShowHistoryModal(true)}
          style={{
            background: 'linear-gradient(145deg, #7c3aed, #5b21b6)',
            color: 'white',
            padding: '0.75rem 1rem',
            borderRadius: '1rem',
            fontWeight: '700',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(145deg, #5b21b6, #4c1d95)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(145deg, #7c3aed, #5b21b6)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          title="View asset performance history"
        >
          <span style={{ fontSize: '1.2rem' }}>📈</span>
          <span>History</span>
        </button>
      </div>
      
      {/* History Modal */}
      {/* Avatar Modal (Portal) */}
      {showAvatarModal && createPortal(
        <div
          className="my-cards-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 99999,
            background: 'rgba(30, 30, 46, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'auto',
          }}
          onClick={() => setShowAvatarModal(false)}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="my-cards-modal"
            tabIndex={-1}
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: 480,
              minHeight: 380,
              background: 'linear-gradient(145deg, #23233e 0%, #181826 100%)',
              borderRadius: 18,
              boxShadow: '0 8px 32px rgba(0,0,0,0.28)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'center',
              padding: 0,
              margin: 0,
              position: 'fixed',
              zIndex: 100000,
              pointerEvents: 'auto',
            }}
          >
            <div className="my-cards-header" style={{ padding: '20px 24px', borderBottom: '1px solid rgba(74,74,106,0.9)', background: 'linear-gradient(145deg, #2a2a3e, #1e1e2e)', borderTopLeftRadius: 16, borderTopRightRadius: 16, width: '100%' }}>
              <h3 className="my-cards-title" style={{ fontSize: '1.3rem', color: '#fff', margin: 0 }}>Edit Avatar &amp; Nickname</h3>
              <button className="my-cards-close" style={{ fontSize: '2rem', color: '#aaa', background: 'none', border: 'none', cursor: 'pointer', width: 32, height: 32, borderRadius: '50%', position: 'absolute', top: 18, right: 18 }} onClick={() => setShowAvatarModal(false)}>×</button>
            </div>
            <div className="my-cards-content" style={{ width: '100%', padding: '32px 32px 24px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
              {/* Avatar preview with border and pendant (pendant outside top-left, 45° tilt, half over border) */}
              <div style={{ position: 'relative', width: 100, height: 100, borderRadius: '50%', overflow: 'hidden', background: '#222', ...borderStyles[selectedBorder].style, marginBottom: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }}>
                <img src={avatar} alt="avatar-preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {/* 挂件预览已移除 */}
              </div>
              {/* Border selection */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                {borderStyles.map((b, i) => (
                  <button key={b.name} type="button" style={{ width: 28, height: 28, borderRadius: '50%', border: i === selectedBorder ? '2px solid #fbbf24' : '2px solid #444', background: '#23233e', margin: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: i === selectedBorder ? '0 0 6px #fbbf24' : 'none' }} onClick={() => setSelectedBorder(i)} title={b.name}>
                    <span style={{ width: 18, height: 18, borderRadius: '50%', ...b.style, display: 'inline-block' }}></span>
                  </button>
                ))}
              </div>
              {/* 挂件选择区已移除 */}
              <label style={{ display: 'inline-block', marginBottom: 12, cursor: 'pointer' }}>
                <span style={{ padding: '7px 16px', border: '1.5px solid #4a4a6a', borderRadius: 10, background: '#23233e', color: '#fff', fontWeight: 600, fontSize: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>Choose image…</span>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => {
                        setAvatar(String(reader.result || ''));
                        localStorage.setItem('userAvatar', String(reader.result || ''));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
              <input
                type="text"
                value={nickname}
                onChange={e => {
                  setNickname(e.target.value);
                  localStorage.setItem('userNickname', e.target.value);
                }}
                placeholder="Enter nickname"
                maxLength={16}
                style={{ width: '100%', marginBottom: 4, padding: '12px 14px', borderRadius: 10, border: '1.5px solid #4a4a6a', fontSize: '1.08rem', background: '#23233e', color: '#fff', fontWeight: 500, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
              />
              {/* Nickname validation message */}
              {nicknameError && (
                <div style={{ color: '#f87171', fontSize: '0.95rem', marginBottom: 6 }}>{nicknameError}</div>
              )}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, width: '100%', marginTop: 10 }}>
                <button
                  type="button"
                  style={{ background: '#23233e', color: '#aaa', padding: '9px 18px', borderRadius: 10, border: 'none', fontWeight: 600, fontSize: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                  onClick={() => setShowAvatarModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  style={{ background: (!nickname.trim() || nickname.length > 16 || !!nicknameError) ? '#666' : '#4a4a6a', color: '#fff', padding: '9px 18px', borderRadius: 10, border: 'none', fontWeight: 600, fontSize: '1rem', cursor: (!nickname.trim() || nickname.length > 16 || !!nicknameError) ? 'not-allowed' : 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                  onClick={() => {
                    setShowAvatarModal(false);
                    localStorage.setItem('userAvatar', avatar);
                    localStorage.setItem('userNickname', nickname);
                    localStorage.setItem('userAvatarBorder', String(selectedBorder));
                    // pendant not used; ensure no stale pendant data remains
                    localStorage.removeItem('userAvatarPendant');
                  }}
                  disabled={!nickname.trim() || nickname.length > 16 || !!nicknameError}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
      <HistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        performanceHistory={performanceHistory || []}
        currentDay={gameState.currentDay}
      />
    </header>
  );
}