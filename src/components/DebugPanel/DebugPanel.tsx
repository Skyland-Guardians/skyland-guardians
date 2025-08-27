import { useState } from 'react';
import { useGameState } from '../../hooks/useGameContext';
import { AITestPanel } from '../AIPanel/AITestPanel';

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'nextDay' | 'aiTest' | 'mode'>('nextDay');
  const { 
    gameState, 
    updateGameState, 
    performNextDaySettlement, 
    addMessage, 
    assetAllocations 
  } = useGameState();

  const toggleMode = () => {
    updateGameState({
      mode: gameState.mode === 'normal' ? 'chaos' : 'normal'
    });
  };

  const handleNextDayClick = () => {
    // Calculate total allocation
    const total = assetAllocations.reduce((sum, asset) => sum + asset.allocation, 0);
    if (Math.abs(total - 100) < 0.1) {
      if (performNextDaySettlement) {
        const res = performNextDaySettlement();
        if (res && typeof res === 'object') {
          // Create rich message data for AI chat with icons
          const richContent = {
            type: 'settlement',
            title: `SETTLEMENT COMPLETE! 🎯`,
            summary: {
              portfolioReturn: res.portfolioReturn,
              totalChange: res.delta
            },
            assets: res.perAsset.map((p: any) => ({
              id: p.id,
              name: p.shortName || p.name,
              icon: p.icon,
              return: p.adjustedReturn,
              coinDelta: p.coinDelta
            }))
          };
          
          addMessage({
            id: `settlement-${Date.now()}`,
            sender: 'ai',
            content: JSON.stringify(richContent), // Store rich data as JSON
            timestamp: new Date(),
            type: 'feedback'
          });
        } else {
          addMessage({
            id: `settlement-${Date.now()}`,
            sender: 'ai',
            content: 'DAY SETTLEMENT COMPLETED. 📊',
            timestamp: new Date(),
            type: 'feedback'
          });
        }
      }
    } else {
      addMessage({
        id: `error-${Date.now()}`,
        sender: 'ai',
        content: `⚠️ ALLOCATION ERROR: Please adjust allocations to total 100%. Current total: ${total.toFixed(1)}%`,
        timestamp: new Date(),
        type: 'feedback'
      });
    }
  };

  if (!isOpen) {
    return (
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        zIndex: 1000
      }}>
        <button
          onClick={() => setIsOpen(true)}
          style={{
            padding: '12px 16px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#5a6268';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#6c757d';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          🛠️ Debug
        </button>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      width: '400px',
      maxHeight: '70vh',
      backgroundColor: 'white',
      border: '1px solid #ddd',
      borderRadius: '12px',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
      zIndex: 1000,
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        borderBottom: '1px solid #eee',
        backgroundColor: '#f8f9fa'
      }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>
          🛠️ Debug Panel
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            color: '#6c757d'
          }}
        >
          ✕
        </button>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #eee'
      }}>
        <button
          onClick={() => setActiveTab('nextDay')}
          style={{
            flex: 1,
            padding: '10px 8px',
            border: 'none',
            backgroundColor: activeTab === 'nextDay' ? '#007bff' : 'transparent',
            color: activeTab === 'nextDay' ? 'white' : '#6c757d',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: activeTab === 'nextDay' ? 'bold' : 'normal'
          }}
        >
          📅 Next Day
        </button>
        <button
          onClick={() => setActiveTab('aiTest')}
          style={{
            flex: 1,
            padding: '10px 8px',
            border: 'none',
            backgroundColor: activeTab === 'aiTest' ? '#007bff' : 'transparent',
            color: activeTab === 'aiTest' ? 'white' : '#6c757d',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: activeTab === 'aiTest' ? 'bold' : 'normal'
          }}
        >
          🤖 AI Test
        </button>
        <button
          onClick={() => setActiveTab('mode')}
          style={{
            flex: 1,
            padding: '10px 8px',
            border: 'none',
            backgroundColor: activeTab === 'mode' ? '#007bff' : 'transparent',
            color: activeTab === 'mode' ? 'white' : '#6c757d',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: activeTab === 'mode' ? 'bold' : 'normal'
          }}
        >
          🎮 Mode
        </button>
      </div>

      {/* Content */}
      <div style={{
        maxHeight: 'calc(70vh - 120px)',
        overflow: 'auto'
      }}>
        {activeTab === 'nextDay' && (
          <div style={{ padding: '20px' }}>
            <h4 style={{ marginTop: 0, marginBottom: '16px' }}>Next Day Settlement</h4>
            <p style={{ 
              fontSize: '14px', 
              color: '#666', 
              marginBottom: '16px',
              lineHeight: '1.4'
            }}>
              Execute the next day settlement logic. This will:
            </p>
            <ul style={{ 
              fontSize: '14px', 
              color: '#666',
              marginBottom: '20px',
              paddingLeft: '20px'
            }}>
              <li>Calculate portfolio returns</li>
              <li>Apply market events</li>
              <li>Update coin balance</li>
              <li>Generate AI feedback</li>
              <li>Advance to next day</li>
            </ul>
            
            <button
              onClick={handleNextDayClick}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#218838';
                e.currentTarget.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#28a745';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              � Execute Next Day
            </button>
            
            <p style={{ 
              fontSize: '12px', 
              color: '#999',
              marginTop: '12px',
              fontStyle: 'italic'
            }}>
              Note: This will trigger the same logic as the original "Next Day" button
            </p>
          </div>
        )}

        {activeTab === 'aiTest' && (
          <div style={{ padding: '0' }}>
            <AITestPanel />
          </div>
        )}

        {activeTab === 'mode' && (
          <div style={{ padding: '20px' }}>
            <h4 style={{ marginTop: 0, marginBottom: '16px' }}>Game Mode</h4>
            
            <button 
              onClick={toggleMode}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backgroundColor: gameState.mode === 'chaos' ? '#dc2626' : '#2563eb',
                color: 'white',
                marginBottom: '16px',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = gameState.mode === 'chaos' ? '#ef4444' : '#3b82f6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = gameState.mode === 'chaos' ? '#dc2626' : '#2563eb';
              }}
            >
              <div>Mode: {gameState.mode.toUpperCase()}</div>
              <div style={{
                fontSize: '12px',
                opacity: 0.8,
                marginTop: '4px'
              }}>
                Click to toggle
              </div>
            </button>
            
            <div style={{
              fontSize: '14px',
              color: '#666',
              borderTop: '1px solid #eee',
              paddingTop: '16px'
            }}>
              <div><strong>Day:</strong> {gameState.currentDay}</div>
              <div><strong>Stars:</strong> {gameState.stars}</div>
              <div><strong>Level:</strong> {gameState.level}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}