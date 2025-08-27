import React from 'react';

interface CharacterMessageProps {
  avatar: string;
  message: string;
}

export function CharacterMessage({ avatar, message }: CharacterMessageProps) {
  return (
    <div style={{ position: 'relative', width: '119px' }}>
      <img
        src="/assets/主界面1资源/ai人物自动对话框.png"
        alt="chat bubble"
        style={{ width: '119px', height: '383px' }}
      />
      <img
        src={avatar}
        alt="character"
        style={{
          position: 'absolute',
          width: '100px',
          height: '70px',
          top: '-6px',
          left: '50%',
          transform: 'translateX(-50%)',
          objectFit: 'contain'
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '90px',
          left: '14px',
          width: '91px',
          height: '288px'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            right: '8px',
            color: '#000',
            fontFamily: 'Koulen, sans-serif',
            fontSize: '13px',
            lineHeight: '1.2',
            whiteSpace: 'pre-line'
          }}
        >
          {message}
        </div>
      </div>
    </div>
  );
}

