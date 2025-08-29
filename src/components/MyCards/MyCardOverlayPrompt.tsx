import React from 'react';
import './MyCards.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  onOpenAvatarCustomization?: () => void;
  onStartPlaying?: () => void;
}

export function MyCardOverlayPrompt({ isOpen, onClose, title = 'Welcome to Skyland Guardians!', children, onOpenAvatarCustomization, onStartPlaying }: Props) {
  if (!isOpen) return null;

  return (
    <div className="my-cards-overlay" role="dialog" aria-modal="true">
      <div className="my-cards-modal" style={{ maxWidth: 640 }}>
        <div className="my-cards-header">
          <h3 className="my-cards-title">{title}</h3>
          <button
            className="my-cards-close"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        
        <div className="my-cards-content">
          {children || (
            <div className="welcome-content">
              <h3>🏝️ Welcome to Your Island Adventure!</h3>
              <p>
                Embark on a thrilling journey in the world of asset management and financial decision-making.
                As a Guardian of Skyland, you'll learn to navigate the markets while protecting your island home.
              </p>
              
              <div className="welcome-features">
                <div className="feature-item">
                  <span className="feature-icon">🃏</span>
                  <span>Collect powerful decision cards</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🎯</span>
                  <span>Complete strategic missions</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🏆</span>
                  <span>Unlock achievements and badges</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🤖</span>
                  <span>Get guidance from AI mentors</span>
                </div>
              </div>

              <div className="welcome-actions">
                <button 
                  className="primary-action-btn"
                  onClick={() => {
                    if (onOpenAvatarCustomization) {
                      onOpenAvatarCustomization();
                    }
                  }}
                >
                  🎨 Customize Your Avatar
                </button>
                <button 
                  className="secondary-action-btn"
                  onClick={() => {
                    if (onStartPlaying) {
                      onStartPlaying();
                    }
                    onClose();
                  }}
                >
                  Start Playing
                </button>
              </div>

              <p className="welcome-tip">
                💡 <strong>Tip:</strong> You can always access your cards, achievements, and settings from the sidebar!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyCardOverlayPrompt;

const styles = `
  .welcome-actions {
    display: flex;
    gap: 12px;
    margin-top: 20px;
    justify-content: center;
  }

  .primary-action-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    font-size: 14px;
  }

  .primary-action-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  .secondary-action-btn {
    background: rgba(255, 255, 255, 0.9);
    color: #333;
    border: 2px solid #ddd;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 14px;
  }

  .secondary-action-btn:hover {
    background: white;
    border-color: #667eea;
    color: #667eea;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}
