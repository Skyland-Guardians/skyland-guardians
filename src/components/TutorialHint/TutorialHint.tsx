import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { UITutorialHint } from '../../types/tutorial';
import './TutorialHint.css';

interface Props {
  hint: UITutorialHint | null;
}

export function TutorialHint({ hint }: Props) {
  const [style, setStyle] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (hint) {
      const target = document.querySelector(hint.selector) as HTMLElement | null;
      if (target) {
        const rect = target.getBoundingClientRect();
        setStyle({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX + rect.width + 8
        });
      } else {
        setStyle(null);
      }
    } else {
      setStyle(null);
    }
  }, [hint]);

  if (!hint || !style) return null;

  return createPortal(
    <div className="tutorial-hint" style={{ top: style.top, left: style.left }}>
      {hint.content}
    </div>,
    document.body
  );
}
