import React from 'react';

interface ModalShellProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const ModalShell: React.FC<ModalShellProps> = ({ title, actionLabel, onAction, className, children }) => {
  return (
    <div style={{ width: '100%', height: '80%', maxHeight: '100%', boxSizing: 'border-box' }} className={className}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', fontSize: 30, letterSpacing: 2, background: 'rgba(255,255,255,0.95)', color: '#23304a', borderRadius: 14, padding: '12px 0', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>{title}</div>
      </div>
      {actionLabel && (
        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <button onClick={onAction} style={{ marginBottom: 18, padding: '8px 22px', borderRadius: 10, border: 'none', background: 'linear-gradient(90deg,#f8fafc 0%,#e0e7ef 100%)', color: '#23304a', fontWeight: 'bold', cursor: 'pointer', fontSize: 17, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>{actionLabel}</button>
        </div>
      )}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: 8 }}>
        {children}
      </div>
    </div>
  );
};
