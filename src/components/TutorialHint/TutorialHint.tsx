import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { UITutorialHint } from '../../types/tutorial';
import './TutorialHint.css';

interface Props {
  hint: UITutorialHint | null;
  onDismiss?: () => void;
}

export function TutorialHint({ hint, onDismiss }: Props) {
  const [style, setStyle] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (hint) {
      const target = document.querySelector(hint.selector) as HTMLElement | null;
      if (target) {
        const rect = target.getBoundingClientRect();
        
        // Calculate position with viewport bounds checking
        let top = rect.top + rect.height / 2 - 40; // Center vertically on target
        let left = rect.left + rect.width + 12; // To the right of target
        
        // Ensure hint stays within viewport bounds
        const hintWidth = 280; // max-width from CSS
        const hintHeight = 120; // estimated height
        
        // Check right boundary - if hint would overflow, place it to the left
        if (left + hintWidth > window.innerWidth) {
          left = rect.left - hintWidth - 12;
        }
        
        // Ensure left boundary
        if (left < 12) {
          left = 12;
        }
        
        // Check bottom boundary
        if (top + hintHeight > window.innerHeight) {
          top = window.innerHeight - hintHeight - 12;
        }
        
        // Ensure top boundary
        if (top < 12) {
          top = 12;
        }
        
        setStyle({ top, left });
      } else {
        // Fallback placements for common layout selectors with viewport checks
        if (hint.selector === '.layout-left-panel') {
          const leftPanel = document.querySelector('.layout-left-panel') as HTMLElement | null;
          if (leftPanel) {
            const rect = leftPanel.getBoundingClientRect();
            const top = Math.max(12, rect.top + 60);
            const left = Math.min(rect.right + 12, window.innerWidth - 300);
            setStyle({ top, left });
          } else {
            // Safe fallback position
            setStyle({ top: 120, left: 12 });
          }
        } else if (hint.selector === '.layout-asset-toolbar') {
          const footer = document.querySelector('.layout-asset-toolbar') as HTMLElement | null;
          if (footer) {
            const rect = footer.getBoundingClientRect();
            const top = Math.max(12, rect.top - 120);
            const left = Math.max(12, Math.min(rect.left + 20, window.innerWidth - 300));
            setStyle({ top, left });
          } else {
            // Safe fallback position above bottom
            setStyle({ top: Math.max(12, window.innerHeight - 160), left: 24 });
          }
        } else {
          // If no specific placement rules matched and the target wasn't found,
          // use a safe fallback so the hint remains visible (prevents accidental disappearance).
          // Position near the bottom-left by default but keep it within viewport bounds.
          const fallbackTop = Math.max(12, window.innerHeight - 160);
          const fallbackLeft = 24;
          setStyle({ top: fallbackTop, left: fallbackLeft });
        }
      }
    } else {
      setStyle(null);
    }
  }, [hint]);

  const handleDismiss = () => {
    onDismiss?.();
  };

  if (!hint || !style) return null;

  return createPortal(
    <div className="tutorial-hint" style={{ top: style.top, left: style.left }}>
      <div className="tutorial-hint-content">
        {hint.content}
      </div>
      <button 
        className="tutorial-hint-button"
        onClick={handleDismiss}
      >
        Got it! ✨
      </button>
    </div>,
    document.body
  );
}
