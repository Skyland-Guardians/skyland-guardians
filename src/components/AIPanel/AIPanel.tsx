import { useState, FormEvent, useEffect, useRef } from 'react';
import { useGameState } from '../../hooks/useGameContext';

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
        width: '18rem',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        position: 'relative'
      }}
    >
      <img
        src="/assets/主界面1资源/右边的AI人物.png"
        alt="AI Character"
        style={{ width: '12rem', height: '20rem', objectFit: 'contain' }}
      />
      <div
        style={{
          marginTop: '1rem',
          width: '100%',
          backgroundColor: '#89CFF0',
          borderRadius: '0.5rem',
          padding: '0.5rem',
          display: 'flex',
          flexDirection: 'column',
          height: '22rem'
        }}
      >
        <div
          style={{
            flexGrow: 1,
            overflowY: 'auto',
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
                maxWidth: '90%'
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: '0.875rem',
                  color: '#000'
                }}
              >
                {msg.content}
              </p>
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
