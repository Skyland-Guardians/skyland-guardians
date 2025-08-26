import bg from '../assets/主界面1资源/背景空岛.png'
import ai from '../assets/主界面1资源/右边的AI人物.png'
import aiBubble from '../assets/主界面1资源/ai人物自动对话框.png'
import avatar from '../assets/主界面1资源/小孩头像icon.png'
import starIcon from '../assets/主界面1资源/右上标星星 可以添加文字显示星数.png'
import bottomBar from '../assets/主界面1资源/下面的框.png'
import swordIcon from '../assets/主界面1资源/剑 icon.png'
import shieldIcon from '../assets/主界面1资源/盾icon.png'
import forestIcon from '../assets/主界面1资源/森林icon.png'
import aiIcon from '../assets/主界面1资源/AI人物icon.png'
import goldIcon from '../assets/主界面1资源/黄金icon.png'
import fountainIcon from '../assets/主界面1资源/喷泉icon.png'
import crystalIcon from '../assets/主界面1资源/水晶icon.png'
import magicIcon from '../assets/主界面1资源/魔杖icon.png'
import cardsIcon from '../assets/主界面1资源/卡牌主界面icon.png'
import badgesIcon from '../assets/主界面1资源/徽章主界面icon.png'

import './MainScreen.css'

export default function MainScreen() {
  const stars = 15
  const day = 1
  const playerName = 'James'

  const actions = [
    { icon: swordIcon, label: 'Sword' },
    { icon: shieldIcon, label: 'Shield' },
    { icon: forestIcon, label: 'Forest' },
    { icon: aiIcon, label: 'Ask AI' },
    { icon: goldIcon, label: 'Gold' },
    { icon: fountainIcon, label: 'Fountain' },
    { icon: crystalIcon, label: 'Crystal' },
    { icon: magicIcon, label: 'Magic' },
  ]

  return (
    <div className="main-screen">
      <img src={bg} className="background" alt="Skyland background" />
      <div className="header-message">{playerName}, guard your fortune!</div>
      <div className="top-bar">
        <div className="avatar-area">
          <img src={avatar} alt="Player avatar" className="avatar" />
          <span className="level-text">Level 1</span>
        </div>
        <div className="status-area">
          <span className="day-text">DAY {day}</span>
          <div className="star-counter">
            <img src={starIcon} alt="Stars" className="star-icon" />
            <span className="star-text">{stars}</span>
          </div>
        </div>
      </div>
      <div className="side-menu">
        <div className="side-button">
          <img src={cardsIcon} alt="My Cards" />
          <span>My Cards</span>
        </div>
        <div className="side-button">
          <img src={badgesIcon} alt="Badges" />
          <span>Badges</span>
        </div>
      </div>
      <div className="ai-area">
        <img src={aiBubble} alt="AI bubble" className="ai-bubble" />
        <div className="ai-text">
          Good morning, little Guardian! Do you want a new challenge today?
        </div>
        <img src={ai} alt="AI companion" className="companion" />
      </div>
      <div className="bottom-area">
        <img src={bottomBar} className="bottom-bar" alt="Menu background" />
        <div className="menu">
          {actions.map((act) => (
            <div key={act.label} className="menu-item">
              <button className="menu-button">
                <img src={act.icon} alt={act.label} />
              </button>
              <span className="menu-label">{act.label}</span>
            </div>
          ))}
        </div>
        <button className="apply-button">Apply</button>
      </div>
      <div className="disclaimer">Educational/Simulation Only</div>
    </div>
  )
}
