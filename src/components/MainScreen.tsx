import bg from '../assets/主界面1资源/背景空岛.png'
import ai from '../assets/主界面1资源/右边的AI人物.png'
import starIcon from '../assets/主界面1资源/右上标星星 可以添加文字显示星数.png'
import bottomBar from '../assets/主界面1资源/下面的框.png'
import cardIcon from '../assets/主界面1资源/卡牌主界面icon.png'
import badgeIcon from '../assets/主界面1资源/徽章主界面icon.png'

import './MainScreen.css'

export default function MainScreen() {
  const stars = 3

  return (
    <div className="main-screen">
      <img src={bg} className="background" alt="Skyland background" />
      <div className="star-counter">
        <img src={starIcon} alt="Stars" className="star-icon" />
        <span className="star-text">{stars}</span>
      </div>
      <img src={ai} alt="AI companion" className="companion" />
      <img src={bottomBar} className="bottom-bar" alt="Menu background" />
      <div className="menu">
        <button className="menu-button">
          <img src={cardIcon} alt="Mission cards" />
        </button>
        <button className="menu-button">
          <img src={badgeIcon} alt="Badges" />
        </button>
      </div>
      <div className="disclaimer">Educational/Simulation Only</div>
    </div>
  )
}
