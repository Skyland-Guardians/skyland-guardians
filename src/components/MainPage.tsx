import React, { useState } from 'react';
import AvatarModal from './AvatarModal/AvatarModal';
import './MainPage.css';

const icons = [
  { key: 'sword', label: 'SWORD', img: '/src/assets/主界面1资源/剑 icon.png' },
  { key: 'shield', label: 'SHIELD', img: '/src/assets/主界面1资源/盾icon.png' },
  { key: 'forest', label: 'FOREST', img: '/src/assets/主界面1资源/森林icon.png' },
  { key: 'askAli', label: 'ASK ALI', img: '/src/assets/主界面1资源/AI人物icon.png' },
  // APPLY按钮插入正中间
  { key: 'apply', label: 'APPLY', img: '', center: true },
  { key: 'golden', label: 'GOLDEN', img: '/src/assets/主界面1资源/黄金icon.png' },
  { key: 'fountain', label: 'FOUNTAIN', img: '/src/assets/主界面1资源/喷泉icon.png' },
  { key: 'crystal', label: 'CRYSTAL', img: '/src/assets/主界面1资源/水晶icon.png' },
  { key: 'magic', label: 'MAGIC', img: '/src/assets/主界面1资源/魔杖icon.png' },
];

const MainPage: React.FC = () => {
  const [activeBar, setActiveBar] = useState<string | null>(null);
  const [barValue, setBarValue] = useState<number>(50);
  const [showModal, setShowModal] = useState(false);
  const [playerLevel, setPlayerLevel] = useState<number>(1);
  const [day, setDay] = useState<number>(1);
  const [stars, setStars] = useState<number>(15);
  // Avatar modal states
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [nickname, setNickname] = useState(() => localStorage.getItem('nickname') || 'JAMES');
  const [avatarUrl, setAvatarUrl] = useState(() => localStorage.getItem('avatarUrl') || '/src/assets/主界面1资源/小孩头像icon.png');

  const handleIconClick = (key: string) => {
    if (key === 'askAli') {
      // TODO: 跳转到AI界面
      return;
    }
    setActiveBar(key);
    setShowModal(true);
  };

  const handleBarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBarValue(Number(e.target.value));
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setActiveBar(null);
  };

  return (
    <div className="main-page-bg">
      {/* Top bar: avatar, level, title, day, stars */}
      <div className="main-header-bar">
        <div className="main-header-left" style={{ flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
            <img
              src={avatarUrl}
              alt="user-avatar"
              className="main-header-avatar"
              style={{ cursor: 'pointer' }}
              onClick={() => setShowAvatarModal(true)}
              tabIndex={0}
              title="Click to edit avatar"
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') setShowAvatarModal(true);
              }}
            />
            <div
              style={{ fontSize: '0.92rem', fontWeight: 500, color: '#233a5e', marginTop: '4px', cursor: 'pointer' }}
              onClick={() => setShowAvatarModal(true)}
              tabIndex={0}
              title="Click to edit nickname"
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') setShowAvatarModal(true);
              }}
            >
              {nickname}
            </div>
            <div className="main-header-level">LEVEL {playerLevel}</div>
          </div>
          <div className="main-header-title" style={{ fontSize: '0.82rem', fontWeight: 500, marginBottom: '2px', marginTop: '-16px' }}>
            {nickname.toUpperCase()}, GUARD YOUR FORTUNE!
          </div>
        </div>
      </div>

      {/* Avatar modal */}
      {showAvatarModal && (
        <AvatarModal
          avatarUrl={avatarUrl}
          nickname={nickname}
          setAvatarUrl={(url: string) => {
            setAvatarUrl(url);
            localStorage.setItem('avatarUrl', url);
          }}
          setNickname={(name: string) => {
            setNickname(name);
            localStorage.setItem('nickname', name);
          }}
          onClose={() => setShowAvatarModal(false)}
        />
      )}

      {/* 左侧卡牌和徽章区 */}
      <div className="main-left-panel">
        <div className="main-card">
          <img src="/src/assets/主界面1资源/卡牌主界面icon.png" alt="card" />
          <div>MY CARDS</div>
        </div>
        <div className="main-badge">
          <img src="/src/assets/主界面1资源/徽章主界面icon.png" alt="badge" />
          <div>BADGES</div>
        </div>
      </div>

      {/* 右侧AI提示栏 */}
      <div className="main-right-panel">
        <img src="/src/assets/主界面1资源/右边的AI人物.png" alt="ai" className="main-right-ai" />
        <div className="main-ai-msg small-msg">
          GOOD MORNING, LITTLE GUARDIAN!<br />
          THE INVESTMENT PERFORMANCE YESTERDAY WAS QUITE GOOD<br />
          DO YOU WANT TO TRY ANY NEW CHALLENGES TODAY?
        </div>
      </div>

      {/* 中间岛屿建筑区域 */}
      <div className="main-center-island">
        <img src="/src/assets/主界面1资源/背景空岛.png" alt="island" className="main-island" />
        {/* 可在此添加建筑物等元素 */}
      </div>

      {/* 底部按钮区 */}
      <div className="main-bottom-bar">
        {icons.map(icon => (
          icon.key === 'apply' ? (
            <div key={icon.key} className="main-bottom-btn main-bottom-apply" onClick={() => handleIconClick(icon.key)}>
              <div>{icon.label}</div>
            </div>
          ) : (
            <div key={icon.key} className="main-bottom-btn" onClick={() => handleIconClick(icon.key)}>
              <img src={icon.img} alt={icon.label} />
              <div>{icon.label}</div>
              {/* 柱形图bar */}
              {activeBar === icon.key && icon.key !== 'askAli' && (
                <div className="vertical-bar-container">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={10}
                    value={barValue}
                    onChange={handleBarChange}
                    className="vertical-range"
                  />
                  <span className="vertical-bar-label">{barValue}%</span>
                </div>
              )}
            </div>
          )
        ))}
      </div>

      {/* 弹窗 */}
      {showModal && activeBar && activeBar !== 'askAli' && (
        <div className="main-modal">
          <div className="main-modal-content">
            <h3>{icons.find(i => i.key === activeBar)?.label}</h3>
            <div className="vertical-bar-container">
              <input
                type="range"
                min={0}
                max={100}
                step={10}
                value={barValue}
                onChange={handleBarChange}
                className="vertical-range"
              />
              <span className="vertical-bar-label">{barValue}%</span>
            </div>
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </div>
);
};

export default MainPage;
