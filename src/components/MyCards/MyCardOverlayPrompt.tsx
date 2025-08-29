import React from 'react';
import './MyCards.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
}

export function MyCardOverlayPrompt({ isOpen, onClose, title = 'Welcome to Skyland Guardians!', children }: Props) {
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

        <div className="my-cards-content" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {children || (
            <div style={{ color: '#ddd', lineHeight: 1.5 }}>
              <p style={{ marginTop: 0, fontSize: '1rem', color: '#fff' }}>
                🏰 <strong>Welcome, guardian!</strong> You're about to embark on an investment adventure through the mystical Skyland realms.
              </p>
              <div style={{ background: 'rgba(74, 144, 226, 0.1)', padding: 12, borderRadius: 8, marginBottom: 12 }}>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>
                  <strong>💡 Quick Tour:</strong><br/>
                  • <strong>Left Panel:</strong> Access your cards and badges collection<br/>
                  • <strong>Bottom Toolbar:</strong> Adjust asset allocations and press APPLY<br/>
                  • <strong>Right Panel:</strong> Chat with your AI advisor for guidance
                </p>
              </div>
              <p style={{ marginBottom: 0, fontSize: '0.9rem' }}>
                Look for the highlighted hints that will appear next to guide you through your first steps. Ready to begin your journey? ✨
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyCardOverlayPrompt;
