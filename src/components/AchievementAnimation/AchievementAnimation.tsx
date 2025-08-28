// 成就获得动画组件
import React, { useState, useEffect } from 'react';
import { achievements } from '../../data/achievements';
import './AchievementAnimation.css';

interface NewAchievement {
  id: string;
  name: string;
  description: string;
  badgeIcon: string;
  starRating: number;
  trophyGrade: 'bronze' | 'silver' | 'gold' | 'platinum';
}

interface AchievementAnimationProps {
  newAchievements: string[];
  onAnimationComplete: () => void;
}

export const AchievementAnimation: React.FC<AchievementAnimationProps> = ({ 
  newAchievements, 
  onAnimationComplete 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<'enter' | 'display' | 'exit'>('enter');

  const achievementData = newAchievements.map(id => 
    achievements.find(a => a.id === id)
  ).filter(Boolean) as NewAchievement[];

  useEffect(() => {
    if (newAchievements.length === 0) return;

    setIsVisible(true);
    setAnimationPhase('enter');

    const timer = setTimeout(() => {
      setAnimationPhase('display');
    }, 500);

    return () => clearTimeout(timer);
  }, [newAchievements]);

  useEffect(() => {
    if (animationPhase === 'display') {
      // 移除自动播放，让用户手动控制
      // const timer = setTimeout(() => {
      //   if (currentIndex < achievementData.length - 1) {
      //     setCurrentIndex(prev => prev + 1);
      //     setAnimationPhase('enter');
      //   } else {
      //     setAnimationPhase('exit');
      //   }
      // }, 2500); // 显示2.5秒

      // return () => clearTimeout(timer);
    }
  }, [animationPhase, currentIndex, achievementData.length]);

  useEffect(() => {
    if (animationPhase === 'exit') {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setCurrentIndex(0);
        setAnimationPhase('enter');
        onAnimationComplete();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [animationPhase, onAnimationComplete]);

  // 添加键盘支持
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isVisible) {
        setAnimationPhase('exit');
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isVisible]);

  if (!isVisible || achievementData.length === 0) return null;

  const currentAchievement = achievementData[currentIndex];
  if (!currentAchievement) return null;

  const getTrophyColor = (grade: string) => {
    switch (grade) {
      case 'platinum': return '#e5e7eb';
      case 'gold': return '#fbbf24';
      case 'silver': return '#9ca3af';
      case 'bronze': return '#d97706';
      default: return '#fbbf24';
    }
  };

  const getStarColor = (rating: number) => {
    if (rating >= 5) return '#fbbf24';
    if (rating >= 4) return '#f59e0b';
    if (rating >= 3) return '#f97316';
    if (rating >= 2) return '#ef4444';
    return '#6b7280';
  };

  return (
    <div 
      className={`achievement-overlay ${animationPhase}`}
      onClick={() => setAnimationPhase('exit')}
    >
      <div className="achievement-container" onClick={e => e.stopPropagation()}>
        {/* 背景光效 */}
        <div className="achievement-glow"></div>
        
        {/* 主要内容 */}
        <div className="achievement-content">
          {/* 关闭按钮 */}
          <button 
            className="achievement-close-button"
            onClick={() => setAnimationPhase('exit')}
            aria-label="Close Achievement"
          >
            ×
          </button>
          
          {/* 标题 */}
          <div className="achievement-title">
            🏆 ACHIEVEMENT UNLOCKED!
          </div>
          
          {/* 徽章图标 */}
          <div className="achievement-badge-container">
            <img 
              src={currentAchievement.badgeIcon} 
              alt={currentAchievement.name}
              className="achievement-badge-icon"
            />
            <div className="achievement-badge-glow"></div>
          </div>
          
          {/* 成就名称 */}
          <div className="achievement-name">
            {currentAchievement.name}
          </div>
          
          {/* 成就描述 */}
          <div className="achievement-description">
            {currentAchievement.description}
          </div>
          
          {/* 星级和奖杯等级 */}
          <div className="achievement-details">
            <div className="achievement-stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <span 
                  key={i}
                  className="achievement-star"
                  style={{ 
                    color: i < currentAchievement.starRating ? getStarColor(currentAchievement.starRating) : '#374151',
                    fontSize: '24px'
                  }}
                >
                  ⭐
                </span>
              ))}
            </div>
            <div 
              className="achievement-trophy"
              style={{ color: getTrophyColor(currentAchievement.trophyGrade) }}
            >
              🏆 {currentAchievement.trophyGrade.toUpperCase()}
            </div>
          </div>
          
          {/* 进度指示器 */}
          {achievementData.length > 1 && (
            <div className="achievement-progress">
              {achievementData.map((_, i) => (
                <div 
                  key={i}
                  className={`achievement-progress-dot ${i === currentIndex ? 'active' : ''}`}
                />
              ))}
            </div>
          )}
          
          {/* 控制按钮 */}
          <div className="achievement-controls">
            {currentIndex < achievementData.length - 1 ? (
              <button 
                className="achievement-control-button next"
                onClick={() => {
                  setCurrentIndex(prev => prev + 1);
                  setAnimationPhase('enter');
                }}
              >
                Next Achievement
              </button>
            ) : (
              <button 
                className="achievement-control-button close"
                onClick={() => setAnimationPhase('exit')}
              >
                Continue Playing
              </button>
            )}
          </div>
        </div>
        
        {/* 粒子效果 */}
        <div className="achievement-particles">
          {Array.from({ length: 20 }).map((_, i) => (
            <div 
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};