import { useState, useEffect, useRef } from 'react';
import type { FormEvent } from 'react';
import { useGameState } from '../../hooks/useGameContext';
import { useAIPersonality } from '../../hooks/useAIPersonality';
import { aiService } from '../../services/ai-service';

// Helper component to render rich settlement and portfolio messages
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
    } else if (data.type === 'portfolio') {
      return (
        <div style={{ fontSize: '0.875rem', color: '#000' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#3b82f6' }}>
            {data.title}
          </div>
          <div style={{ marginBottom: '0.75rem', padding: '0.5rem', backgroundColor: '#eff6ff', borderRadius: '0.375rem' }}>
            <div>📊 Total Allocation: <strong>{data.summary.totalAllocation.toFixed(1)}%</strong></div>
            <div>🎯 Assets: <strong>{data.summary.assetCount} positions</strong></div>
          </div>
          <div style={{ display: 'grid', gap: '0.375rem' }}>
            {data.assets.map((asset: any) => (
              <div key={asset.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem', backgroundColor: '#fafafa', borderRadius: '0.25rem' }}>
                <img src={asset.icon} alt="" style={{ width: 20, height: 20, objectFit: 'contain' }} />
                <div style={{ flex: 1, fontSize: '0.8rem' }}>
                  <strong>{asset.name}</strong>
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#3b82f6' }}>
                  {asset.allocation.toFixed(1)}%
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
  const { messages, addMessage, gameState, userInfo, assetAllocations } = useGameState();
  const { currentPersonality } = useAIPersonality();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage = aiService.generateWelcomeMessage(userInfo.name);
      addMessage(welcomeMessage);
    }
  }, [messages.length, userInfo.name, addMessage]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    // Add user message
    addMessage({
      id: `user-${Date.now()}`,
      sender: 'user',
      content: trimmed,
      timestamp: new Date()
    });
    setInput('');
    setIsTyping(true);

    try {
      // Get AI response
      const response = await aiService.getResponse(trimmed, {
        assets: assetAllocations,
        currentDay: gameState.currentDay,
        stars: gameState.stars,
        level: gameState.level
      });

      // Add AI response after a short delay for natural feel
      setTimeout(() => {
        addMessage({
          id: `ai-${Date.now()}`,
          sender: 'ai',
          content: response,
          timestamp: new Date(),
          type: 'feedback'
        });
        setIsTyping(false);
      }, 800);
    } catch (error) {
      console.error('AI response error:', error);
      setTimeout(() => {
        addMessage({
          id: `ai-error-${Date.now()}`,
          sender: 'ai',
          content: 'Sorry, I\'m a bit busy right now. Please try again later!',
          timestamp: new Date(),
          type: 'feedback'
        });
        setIsTyping(false);
      }, 500);
    }
  };

  return (
    <aside
      style={{
        width: '20vw',
        padding: '1.2rem', // 减少内边距
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        position: 'relative',
        height: '70vh' // 占屏幕高度一半
      }}
    >
      <div
        style={{
          width: '100%',
          backgroundColor: '#89CFF0',
          borderRadius: '0.5rem',
          padding: '0.5rem',
          display: 'flex',
          flexDirection: 'column',
          height: '80%', // 填满aside高度
          position: 'relative'
        }}
      >
        {/* AI Character */}
        <img
          src={currentPersonality.avatar}
          alt={currentPersonality.name}
          style={{
            width: '12rem',
            height: '20rem',
            objectFit: 'contain',
            position: 'absolute',
            top: '-10rem',
            alignSelf: 'center'
          }}
        />

        {/* Messages */}
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
                padding: '0.4rem 0.8rem', // 稍微减少内边距
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                maxWidth: '95%', // 增加最大宽度占比，适应更窄的容器
                fontSize: '0.85rem' // 稍微减小字体
              }}
            >
              <RichMessage content={msg.content} />
            </div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div
              style={{
                alignSelf: 'flex-start',
                backgroundColor: '#ffffff',
                borderRadius: '0.5rem',
                padding: '0.4rem 0.8rem', // 与消息气泡保持一致
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                maxWidth: '95%', // 与消息气泡保持一致
                fontStyle: 'italic',
                color: '#666',
                fontSize: '0.85rem' // 与消息气泡保持一致
              }}
            >
              {currentPersonality.name} is thinking...
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} style={{ marginTop: '0.5rem' }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={`Ask ${currentPersonality.name}...`} // 缩短占位符文本
            disabled={isTyping}
            style={{
              width: '100%',
              padding: '0.4rem', // 稍微减少内边距
              borderRadius: '0.5rem',
              border: '1px solid #cbd5e1',
              opacity: isTyping ? 0.6 : 1,
              fontSize: '0.85rem' // 减小字体大小
            }}
          />
        </form>
      </div>
    </aside>
  );
}
