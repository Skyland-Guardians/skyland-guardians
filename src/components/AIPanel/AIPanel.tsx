import { useState, useEffect, useRef } from 'react';
import type { FormEvent } from 'react';
import { useGameState } from '../../hooks/useGameContext';

// Helper component to render rich settlement messages
const RichMessage = ({ content }: { content: string }) => {
  try {
    const data = JSON.parse(content);
    if (data.type === 'settlement') {
      return (
        <div style={{ fontSize: '0.875rem', color: '#000' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#16a34a' }}>
            {data.title}
          </div>
          <div style={{ marginBottom: '0.75rem', padding: '0.5rem', backgroundColor: '#f3f4f6', borderRadius: '0.375rem' }}>
            <div>📈 Portfolio: <strong>{(data.summary.portfolioReturn * 100).toFixed(2)}%</strong></div>
            <div>💰 Total: <strong>{formatCoins(data.summary.totalChange)}</strong></div>
          </div>
          <div style={{ display: 'grid', gap: '0.375rem' }}>
            {data.assets.map((asset: any) => (
              <div key={asset.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem', backgroundColor: '#fafafa', borderRadius: '0.25rem' }}>
                <img src={asset.icon} alt="" style={{ width: 20, height: 20, objectFit: 'contain' }} />
                <div style={{ flex: 1, fontSize: '0.8rem' }}>
                  <strong>{asset.name}</strong>: {(asset.return * 100).toFixed(2)}%
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: asset.coinDelta >= 0 ? '#16a34a' : '#dc2626' }}>
                  {formatCoins(asset.coinDelta)}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
  } catch (e) {
    // Fall back to regular text if JSON parsing fails
  }
  return <p style={{ margin: 0, fontSize: '0.875rem', color: '#000', whiteSpace: 'pre-line' }}>{content}</p>;
};

// Number formatting helper (duplicated from AssetToolbar)
const formatCoins = (amount: number): string => {
  const absAmount = Math.abs(amount);
  const sign = amount >= 0 ? '+' : '-';
  const formatted = new Intl.NumberFormat('en-US').format(absAmount);
  return `${sign}${formatted} coin${absAmount === 1 ? '' : 's'}`;
};

export function AIPanel() {
  const { messages, addMessage } = useGameState();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    addMessage({
      id: `user-${Date.now()}`,
      sender: 'user',
      content: trimmed,
      timestamp: new Date()
    });
    setInput('');
    setTimeout(() => {
      addMessage({
        id: `ai-${Date.now()}`,
        sender: 'ai',
        content: 'LET ME THINK ABOUT THAT.',
        timestamp: new Date(),
        type: 'feedback'
      });
    }, 500);
  };

  return (
    <aside
      style={{
        width: '30vw', // 占屏幕宽度30%
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        position: 'relative',
        height: '70vh' // 占屏幕高度一半
      }}
    >
      <div
        style={{
          marginTop: '1rem',
          width: '100%',
          backgroundColor: '#89CFF0',
          borderRadius: '0.5rem',
          padding: '0.5rem',
          display: 'flex',
          flexDirection: 'column',
          height: '100%', // 填满aside高度
          position: 'relative'
        }}
      >
        <img
          src="/assets/主界面1资源/右边的AI人物.png"
          alt="AI Character"
          style={{
            width: '12rem',
            height: '20rem',
            objectFit: 'contain',
            position: 'absolute',
            top: '-10rem',
            alignSelf: 'center'
          }}
        />
        <div
          style={{
            flexGrow: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            marginTop: '5rem'
          }}
        >
          {messages.map(msg => (
            <div
              key={msg.id}
              style={{
                alignSelf: msg.sender === 'ai' ? 'flex-start' : 'flex-end',
                backgroundColor: '#ffffff',
                borderRadius: '0.5rem',
                padding: '0.5rem 1rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                maxWidth: '90%'
              }}
            >
              <RichMessage content={msg.content} />
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} style={{ marginTop: '0.5rem' }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type a message..."
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              border: '1px solid #cbd5e1'
            }}
          />
        </form>
      </div>
    </aside>
  );
}
