import { useState } from 'react';
import { useGameState } from '../../hooks/useGameContext';
import { useAIPersonality } from '../../hooks/useAIPersonality';
import { AI_PERSONALITIES } from '../../data/ai-personalities';
import { MISSION_CONFIGS } from '../../data/missions';
import { EVENT_CONFIGS } from '../../data/events';
import { gamifiedAIService } from '../../services/gamified-ai-service';

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'nextDay' | 'aiPersonality' | 'mode' | 'events' | 'achievements' | 'reset'>('nextDay');
  const { currentPersonality, changePersonality } = useAIPersonality();
  const { 
    gameState, 
    updateGameState, 
    performNextDaySettlement, 
    addMessage, 
    assetAllocations,
    coins,
    performanceHistory,
    triggerTestMission,
    triggerTestEvent,
    checkAchievements,
    resetAchievements
  } = useGameState();

  const toggleMode = () => {
    updateGameState({
      mode: gameState.mode === 'normal' ? 'chaos' : 'normal'
    });
  };

  const handlePersonalityChange = (personalityId: string) => {
    changePersonality(personalityId, addMessage);
  };

  const handleNextDayClick = async () => {
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

          // Add AI thinking message
          addMessage({
            id: `ai-thinking-nextday-${Date.now()}`,
            sender: 'ai',
            content: '📊 *Analyzing today\'s market performance and your investment results...*',
            timestamp: new Date(),
            type: 'feedback'
          });

          // Get AI feedback on the next day settlement
          try {
            const aiFeedback = await gamifiedAIService.generateNextDayFeedback({
              assets: assetAllocations,
              currentDay: gameState.currentDay,
              stars: gameState.stars,
              level: gameState.level,
              coins: coins || 1000,
              performanceHistory: performanceHistory,
              settlementResult: res
            });

            // Add AI feedback message
            addMessage({
              id: `ai-nextday-feedback-${Date.now()}`,
              sender: 'ai',
              content: aiFeedback,
              timestamp: new Date(),
              type: 'feedback'
            });
          } catch (error) {
            console.error('Failed to get AI next day feedback:', error);
            // Add fallback message
            addMessage({
              id: `ai-nextday-fallback-${Date.now()}`,
              sender: 'ai',
              content: 'Settlement completed! Another day of learning in your investment journey. Keep observing the markets and adjusting your strategy! 📊✨',
              timestamp: new Date(),
              type: 'feedback'
            });
          }
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
        zIndex: 1000,
        /* keep this wrapper minimal so it doesn't cover other UI */
        width: '40px',
        height: '40px',
        pointerEvents: 'none'
      }}>
        <button
          onClick={() => setIsOpen(true)}
          style={{
            /* make the button itself interactive but keep wrapper non-interactive */
            padding: 0,
            width: '40px',
            height: '40px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.2s ease',
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
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
          🛠️
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
      /* ensure the open panel is interactive even though modal-container is pointer-events:none */
      pointerEvents: 'auto',
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
          onClick={() => setActiveTab('aiPersonality')}
          style={{
            flex: 1,
            padding: '10px 8px',
            border: 'none',
            backgroundColor: activeTab === 'aiPersonality' ? '#007bff' : 'transparent',
            color: activeTab === 'aiPersonality' ? 'white' : '#6c757d',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: activeTab === 'aiPersonality' ? 'bold' : 'normal'
          }}
        >
          🧠 AI Character
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
        <button
          onClick={() => setActiveTab('events')}
          style={{
            flex: 1,
            padding: '10px 8px',
            border: 'none',
            backgroundColor: activeTab === 'events' ? '#007bff' : 'transparent',
            color: activeTab === 'events' ? 'white' : '#6c757d',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: activeTab === 'events' ? 'bold' : 'normal'
          }}
        >
          🎯 Events
        </button>
        <button
          onClick={() => setActiveTab('achievements')}
          style={{
            flex: 1,
            padding: '10px 8px',
            border: 'none',
            backgroundColor: activeTab === 'achievements' ? '#007bff' : 'transparent',
            color: activeTab === 'achievements' ? 'white' : '#6c757d',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: activeTab === 'achievements' ? 'bold' : 'normal'
          }}
        >
          🏆 Badges
        </button>
        <button
          onClick={() => setActiveTab('reset')}
          style={{
            flex: 1,
            padding: '10px 8px',
            border: 'none',
            backgroundColor: activeTab === 'reset' ? '#007bff' : 'transparent',
            color: activeTab === 'reset' ? 'white' : '#6c757d',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: activeTab === 'reset' ? 'bold' : 'normal'
          }}
        >
          🔄 Reset
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
              Execute Next Day
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

        {activeTab === 'aiPersonality' && (
          <div style={{ padding: '20px' }}>
            <h4 style={{ marginTop: 0, marginBottom: '16px' }}>AI Personality</h4>
            <p style={{ 
              fontSize: '14px', 
              color: '#666', 
              marginBottom: '16px',
              lineHeight: '1.4'
            }}>
              Choose the AI character's personality and interaction style.
            </p>
            
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: '8px',
              marginBottom: '16px'
            }}>
              {AI_PERSONALITIES.map(personality => (
                <button
                  key={personality.id}
                  onClick={() => handlePersonalityChange(personality.id)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    backgroundColor: currentPersonality.id === personality.id ? '#007bff' : '#f8f9fa',
                    color: currentPersonality.id === personality.id ? 'white' : '#333',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: currentPersonality.id === personality.id ? 'bold' : 'normal',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (currentPersonality.id !== personality.id) {
                      e.currentTarget.style.backgroundColor = '#e9ecef';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPersonality.id !== personality.id) {
                      e.currentTarget.style.backgroundColor = '#f8f9fa';
                    }
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                    {personality.name}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    opacity: 0.8,
                    lineHeight: '1.3'
                  }}>
                    Risk: {personality.riskTolerance} | ID: {personality.id}
                  </div>
                </button>
              ))}
            </div>

            <div style={{
              fontSize: '14px',
              color: '#666',
              borderTop: '1px solid #eee',
              paddingTop: '16px'
            }}>
              <div><strong>Current AI:</strong> {currentPersonality.name}</div>
              <div style={{ fontSize: '12px', marginTop: '4px', fontStyle: 'italic' }}>
                Risk Tolerance: {currentPersonality.riskTolerance}
              </div>
            </div>
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

        {activeTab === 'events' && (
          <div style={{ padding: '20px' }}>
            <h4 style={{ marginTop: 0, marginBottom: '16px' }}>Test Events & Missions</h4>
            
            {/* Missions Section */}
            <div style={{ marginBottom: '24px' }}>
              <h5 style={{ marginBottom: '12px', color: '#333' }}>🎯 Trigger Mission</h5>
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '8px',
                marginBottom: '16px'
              }}>
                {MISSION_CONFIGS.slice(0, 6).map(mission => (
                  <button
                    key={mission.id}
                    onClick={() => triggerTestMission && triggerTestMission(mission.id)}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      backgroundColor: '#f8f9fa',
                      cursor: 'pointer',
                      fontSize: '12px',
                      transition: 'all 0.2s ease',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#e9ecef';
                      e.currentTarget.style.borderColor = '#007bff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8f9fa';
                      e.currentTarget.style.borderColor = '#ddd';
                    }}
                  >
                    <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
                      {mission.title}
                    </div>
                    <div style={{ fontSize: '11px', color: '#666' }}>
                      ⭐ {mission.rewardStars} stars
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Events Section */}
            <div style={{ marginBottom: '16px' }}>
              <h5 style={{ marginBottom: '12px', color: '#333' }}>⚡ Trigger Event</h5>
              <div style={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                {EVENT_CONFIGS.map(event => (
                  <button
                    key={event.id}
                    onClick={() => triggerTestEvent && triggerTestEvent(event.id)}
                    style={{
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      backgroundColor: '#fff3cd',
                      cursor: 'pointer',
                      fontSize: '13px',
                      transition: 'all 0.2s ease',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#ffeaa7';
                      e.currentTarget.style.borderColor = '#ffc107';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#fff3cd';
                      e.currentTarget.style.borderColor = '#ddd';
                    }}
                  >
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                      {event.title}
                    </div>
                    <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>
                      {event.description}
                    </div>
                    <div style={{ fontSize: '10px', color: '#999' }}>
                      Targets: {event.targets.join(', ')} | Duration: {event.duration} day(s)
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Status */}
            <div style={{
              fontSize: '12px',
              color: '#666',
              borderTop: '1px solid #eee',
              paddingTop: '12px',
              textAlign: 'center',
              fontStyle: 'italic'
            }}>
              Active: {gameState.activeMissions.length} missions, {gameState.activeEvents.length} events<br/>
              Pending: {gameState.pendingCards.length} cards
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div style={{ padding: '20px' }}>
            <h4 style={{ marginTop: 0, marginBottom: '16px' }}>🏆 Test Achievements</h4>
            
            <p style={{ 
              fontSize: '14px', 
              color: '#666', 
              marginBottom: '16px',
              lineHeight: '1.4'
            }}>
              Test achievement triggers and animations.
            </p>
            
            {/* 显示当前分配总和 */}
            <div style={{
              background: assetAllocations.reduce((sum, asset) => sum + asset.allocation, 0) === 100 ? '#d4edda' : '#f8d7da',
              border: `1px solid ${assetAllocations.reduce((sum, asset) => sum + asset.allocation, 0) === 100 ? '#c3e6cb' : '#f5c6cb'}`,
              borderRadius: '6px',
              padding: '12px',
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                Current Allocation Total: {assetAllocations.reduce((sum, asset) => sum + asset.allocation, 0).toFixed(1)}%
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {assetAllocations.reduce((sum, asset) => sum + asset.allocation, 0) === 100 
                  ? '✅ Ready for achievement checking' 
                  : '⚠️ Must equal 100% to check achievements'}
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <button
                onClick={() => checkAchievements && checkAchievements()}
                disabled={assetAllocations.reduce((sum, asset) => sum + asset.allocation, 0) !== 100}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: assetAllocations.reduce((sum, asset) => sum + asset.allocation, 0) === 100 ? '#fbbf24' : '#9ca3af',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: assetAllocations.reduce((sum, asset) => sum + asset.allocation, 0) === 100 ? 'pointer' : 'not-allowed',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  transition: 'all 0.2s ease',
                  marginBottom: '12px',
                  opacity: assetAllocations.reduce((sum, asset) => sum + asset.allocation, 0) === 100 ? 1 : 0.6
                }}
                onMouseEnter={(e) => {
                  if (assetAllocations.reduce((sum, asset) => sum + asset.allocation, 0) === 100) {
                    e.currentTarget.style.backgroundColor = '#f59e0b';
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (assetAllocations.reduce((sum, asset) => sum + asset.allocation, 0) === 100) {
                    e.currentTarget.style.backgroundColor = '#fbbf24';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
              >
                🔍 Check Achievements Now
              </button>
              
              <button
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  marginTop: '8px',
                  width: '100%',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  transition: 'background-color 0.2s, transform 0.1s'
                }}
                onClick={() => resetAchievements && resetAchievements()}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#c82333';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#dc3545';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                🧹 Reset All Achievements
              </button>
              
              <div style={{
                fontSize: '12px',
                color: '#999',
                textAlign: 'center',
                fontStyle: 'italic'
              }}>
                This will check current allocations and stars for new achievements.<br/>
                <strong>Note:</strong> Asset allocations must total exactly 100%.
              </div>
            </div>

            <div style={{
              fontSize: '14px',
              color: '#666',
              borderTop: '1px solid #eee',
              paddingTop: '16px'
            }}>
              <div><strong>Tips to trigger achievements:</strong></div>
              <ul style={{ fontSize: '12px', marginTop: '8px', paddingLeft: '20px' }}>
                <li><strong>First:</strong> Ensure allocations total 100%</li>
                <li>Balance Apprentice: Keep all assets below 50%</li>
                <li>Diversification Explorer: Use 3+ different assets</li>
                <li>Star Collector: Complete missions to earn 10+ stars</li>
                <li>Risk Manager: Keep 40%+ in safe assets (shield, golden, crystal)</li>
                <li>Growth Seeker: Allocate 50%+ to growth assets (sword, forest)</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'reset' && (
          <div style={{ padding: '20px' }}>
            <h4 style={{ marginTop: 0, marginBottom: '16px' }}>🔄 Reset Options</h4>
            
            <p style={{ 
              fontSize: '14px', 
              color: '#666', 
              marginBottom: '16px',
              lineHeight: '1.4'
            }}>
              Reset various game states and localStorage data.
            </p>
            
            <div style={{ marginBottom: '20px' }}>
              <button
                style={{
                  backgroundColor: '#6f42c1',
                  color: 'white',
                  border: 'none',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  marginBottom: '12px',
                  width: '100%',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  transition: 'background-color 0.2s, transform 0.1s'
                }}
                onClick={() => {
                  localStorage.removeItem('skyland-guardians-tutorial-seen');
                  window.location.reload();
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#563d7c';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#6f42c1';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                🎯 Reset Tutorial
              </button>

              <button
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  marginBottom: '12px',
                  width: '100%',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  transition: 'background-color 0.2s, transform 0.1s'
                }}
                onClick={() => resetAchievements && resetAchievements()}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#c82333';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#dc3545';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                🧹 Reset Achievements
              </button>

              <button
                style={{
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  marginBottom: '12px',
                  width: '100%',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  transition: 'background-color 0.2s, transform 0.1s'
                }}
                onClick={() => {
                  if (confirm('Are you sure you want to clear all localStorage data? This will reset everything!')) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#c0392b';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#e74c3c';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                🗑️ Clear All Data
              </button>
              <button
                style={{
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  marginBottom: '12px',
                  width: '100%',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
                onClick={() => {
                  const key = 'skyland-guardians-app-state-v1';
                  if (confirm(`Clear saved game state (${key})? This will reset your progress but keep other localStorage data.`)) {
                    localStorage.removeItem(key);
                    window.location.reload();
                  }
                }}
              >
                🧾 Clear Saved Game Only
              </button>
              
              <div style={{
                fontSize: '12px',
                color: '#999',
                textAlign: 'center',
                fontStyle: 'italic',
                marginTop: '16px',
                borderTop: '1px solid #eee',
                paddingTop: '12px'
              }}>
                <strong>Warning:</strong> Reset actions will reload the page and cannot be undone.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}