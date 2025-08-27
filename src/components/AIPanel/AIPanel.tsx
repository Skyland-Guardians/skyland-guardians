import { useState, FormEvent } from 'react';
import { useGameState } from '../../hooks/useGameContext';

export function AIPanel() {
  const { messages, addMessage } = useGameState();
  const [input, setInput] = useState('');

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
        width: '18rem',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        position: 'relative'
      }}
    >
      {/* AI Rabbit */}
      <div
        style={{
          position: 'absolute',
          top: '0.5rem',
          right: '0.5rem',
          zIndex: 2
        }}
      >
        <img
          src="/assets/主界面1资源/ai人物自动对话.png"
          alt="AI Rabbit"
          style={{ width: '12rem', height: '30rem', objectFit: 'contain' }}
        />
      </div>

      <div
        style={{
          marginTop: '22rem',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
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
              maxWidth: '16rem'
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: '0.875rem',
                color: msg.sender === 'ai' ? '#1e3a8a' : '#4a5568'
              }}
            >
              {msg.content}
            </p>
          </div>
        ))}
        <form onSubmit={handleSubmit} style={{ alignSelf: 'stretch' }}>
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
