import { useGameState } from '../../hooks/useGameContext';
import type { AssetType } from '../../types/game';
import { gamifiedAIService } from '../../services/gamified-ai-service';
import { GAME_ASSETS } from '../../data/game-assets';

interface AssetButtonProps {
  asset: AssetType;
  onClick?: () => void;
  isActive?: boolean;
}

export function AssetButton({ asset, onClick, isActive = false }: AssetButtonProps) {
  const { updateAssetAllocation, assetAllocations, addMessage, gameState, coins, performanceHistory } = useGameState();

  const handleSliderChange = (newValue: number) => {
    // Calculate current total allocation excluding this asset
    const otherAssetsTotal = assetAllocations
      .filter(a => a.id !== asset.id)
      .reduce((sum, a) => sum + a.allocation, 0);
    
    // Calculate what the total would be with the new value
    const potentialTotal = otherAssetsTotal + newValue;
    
    // If the potential total is less than 100%, auto-adjust to make it 100%
    // But only if the user is dragging upward (increasing allocation)
    let finalValue = newValue;
    if (potentialTotal < 100 && newValue > asset.allocation) {
      // Auto-adjust to fill up to 100%
      finalValue = 100 - otherAssetsTotal;
      // Ensure we don't exceed 100%
      finalValue = Math.min(finalValue, 100);
      // Ensure we don't go below 0%
      finalValue = Math.max(finalValue, 0);
    }
    
    updateAssetAllocation(asset.id, finalValue);
  };

  const handleDirectInput = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
      updateAssetAllocation(asset.id, numValue);
    }
  };

  const handleStepChange = (step: number) => {
    const newValue = Math.max(0, Math.min(100, asset.allocation + step));
    updateAssetAllocation(asset.id, newValue);
  };

  const handleAskAI = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent asset button click
    
    // Find the asset details from GAME_ASSETS
    const assetDetails = GAME_ASSETS.find(gameAsset => gameAsset.id === asset.id);
    
    if (!assetDetails) return;
    
    // Add thinking message
    addMessage({
      id: `ai-thinking-asset-${Date.now()}`,
      sender: 'ai',
      content: `🤔 *Looking up information about ${assetDetails.gameName}...*`,
      timestamp: new Date(),
      type: 'feedback'
    });

    try {
      const response = await gamifiedAIService.getGameResponse(
        `Explain ${assetDetails.gameName} (${assetDetails.realWorld}). What is it? 40 words max.`,
        {
          assets: assetAllocations,
          currentDay: gameState.currentDay,
          stars: gameState.stars,
          level: gameState.level,
          coins: coins || 1000,
          performanceHistory: performanceHistory
        }
      );

      // Add AI explanation
      addMessage({
        id: `ai-asset-explain-${Date.now()}`,
        sender: 'ai',
        content: response,
        timestamp: new Date(),
        type: 'feedback'
      });
    } catch (error) {
      console.error('Failed to get AI asset explanation:', error);
      // Fallback explanation
      addMessage({
        id: `ai-asset-fallback-${Date.now()}`,
        sender: 'ai',
        content: `${assetDetails.gameName} represents ${assetDetails.realWorld}. ${assetDetails.description} 📚`,
        timestamp: new Date(),
        type: 'feedback'
      });
    }
  };
  const getThemeColors = (theme: string) => {
    switch (theme) {
      case 'gold':
        return {
          background: 'linear-gradient(to bottom, #fbbf24, #d97706)',
          border: '#f59e0b',
          hoverBackground: 'linear-gradient(to bottom, #fcd34d, #f59e0b)'
        };
      case 'orange':
        return {
          background: 'linear-gradient(to bottom, #fb923c, #ea580c)',
          border: '#f97316',
          hoverBackground: 'linear-gradient(to bottom, #fdba74, #f97316)'
        };
      case 'green':
        return {
          background: 'linear-gradient(to bottom, #4ade80, #16a34a)',
          border: '#22c55e',
          hoverBackground: 'linear-gradient(to bottom, #6ee7b7, #22c55e)'
        };
      case 'blue':
        return {
          background: 'linear-gradient(to bottom, #60a5fa, #2563eb)',
          border: '#3b82f6',
          hoverBackground: 'linear-gradient(to bottom, #93c5fd, #3b82f6)'
        };
      default:
        return {
          background: 'linear-gradient(to bottom, #9ca3af, #6b7280)',
          border: '#6b7280',
          hoverBackground: 'linear-gradient(to bottom, #d1d5db, #9ca3af)'
        };
    }
  };

  const colors = getThemeColors(asset.theme);

  return (
    <div style={{ position: 'relative' }}>
      {/* Mini Slider - appears above button when active */}
      {isActive && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'white',
          borderRadius: '0.5rem',
          padding: '0.75rem',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          border: `2px solid ${colors.border}`,
          minWidth: '200px',
          marginBottom: '0.5rem',
          zIndex: 50, /* Above asset toolbar(15) */
          animation: 'slideUp 0.2s ease'
        }}>
          {/* Other Assets Overview */}
          <div style={{
            marginBottom: '0.75rem',
            padding: '0.5rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            border: '1px solid #e9ecef'
          }}>
            <div style={{
              fontSize: '11px',
              fontWeight: 'bold',
              color: '#6c757d',
              marginBottom: '0.25rem',
              textAlign: 'center'
            }}>
              Other Assets
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.25rem',
              fontSize: '10px'
            }}>
              {assetAllocations
                .filter(a => a.id !== asset.id)
                .map(otherAsset => (
                  <div 
                    key={otherAsset.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '2px 4px',
                      backgroundColor: 'white',
                      borderRadius: '2px',
                      border: '1px solid #dee2e6'
                    }}
                  >
                    <span style={{
                      color: '#495057',
                      fontWeight: '500',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '50px'
                    }}>
                      {otherAsset.shortName || otherAsset.name}
                    </span>
                    <span style={{
                      color: '#007bff',
                      fontWeight: 'bold',
                      fontSize: '10px'
                    }}>
                      {otherAsset.allocation.toFixed(1)}%
                    </span>
                  </div>
                ))
              }
            </div>
            {/* Total remaining */}
            <div style={{
              marginTop: '0.25rem',
              padding: '2px 4px',
              backgroundColor: '#e7f3ff',
              borderRadius: '2px',
              border: '1px solid #b3d9ff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{
                fontSize: '10px',
                fontWeight: 'bold',
                color: '#0056b3'
              }}>
                Total Others:
              </span>
              <span style={{
                fontSize: '10px',
                fontWeight: 'bold',
                color: '#0056b3'
              }}>
                {assetAllocations
                  .filter(a => a.id !== asset.id)
                  .reduce((sum, a) => sum + a.allocation, 0)
                  .toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Current Asset Controls */}
          <div style={{
            textAlign: 'center',
            marginBottom: '0.5rem',
            padding: '0.5rem',
            backgroundColor: '#fff3cd',
            borderRadius: '4px',
            border: '1px solid #ffeaa7'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.5rem'
            }}>
              <div style={{
                fontSize: '11px',
                fontWeight: 'bold',
                color: '#856404',
                flex: 1,
                textAlign: 'center'
              }}>
                Editing: {asset.shortName || asset.name}
              </div>
              
              {/* Ask AI button */}
              <button
                onClick={handleAskAI}
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#3b82f6',
                  border: '1px solid white',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#2563eb';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#3b82f6';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                title={`Ask AI about ${asset.name}`}
              >
                ?
              </button>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}>
              <button
                onClick={() => handleStepChange(-0.5)}
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: `1px solid ${colors.border}`,
                  backgroundColor: 'white',
                  color: colors.border,
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                −
              </button>
              
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={asset.allocation.toFixed(1)}
                onChange={(e) => handleDirectInput(e.target.value)}
                style={{
                  width: '60px',
                  padding: '4px 6px',
                  border: `2px solid ${colors.border}`,
                  borderRadius: '4px',
                  textAlign: 'center',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: colors.border
                }}
              />
              
              <span style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: colors.border
              }}>
                %
              </span>
              
              <button
                onClick={() => handleStepChange(0.5)}
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: `1px solid ${colors.border}`,
                  backgroundColor: 'white',
                  color: colors.border,
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                +
              </button>
            </div>
          </div>
          
          {/* Mini Slider */}
          <input
            type="range"
            min="0"
            max="100"
            step="0.5"
            value={asset.allocation}
            onChange={(e) => handleSliderChange(parseFloat(e.target.value))}
            style={{
              width: '100%',
              height: '6px',
              borderRadius: '3px',
              background: `linear-gradient(to right, ${colors.border} 0%, ${colors.border} ${asset.allocation}%, #e5e7eb ${asset.allocation}%, #e5e7eb 100%)`,
              outline: 'none',
              cursor: 'pointer',
              appearance: 'none',
              marginBottom: '0.5rem'
            }}
          />
          
          {/* Quick Presets */}
          <div style={{
            display: 'flex',
            gap: '0.25rem',
            marginTop: '0.25rem',
            justifyContent: 'center'
          }}>
            {[0, 12.5, 25, 37.5, 50].map((preset) => (
              <button
                key={preset}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSliderChange(preset);
                }}
                style={{
                  padding: '0.125rem 0.25rem',
                  borderRadius: '0.125rem',
                  border: `1px solid ${colors.border}`,
                  backgroundColor: Math.abs(asset.allocation - preset) < 0.1 ? colors.border : 'white',
                  color: Math.abs(asset.allocation - preset) < 0.1 ? 'white' : colors.border,
                  fontSize: '0.55rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {preset}%
              </button>
            ))}
          </div>
          
          {/* Arrow pointing down to button */}
          <div style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: `6px solid ${colors.border}`
          }}></div>
        </div>
      )}
      
      <button
      onClick={onClick}
      style={{
        background: '#f5f5dc', // Light beige color matching design
        border: isActive ? `3px solid ${colors.border}` : '2px solid rgba(255,255,255,0.5)',
        borderRadius: '0.75rem',
        padding: '0.75rem',
        boxShadow: isActive ? `0 4px 12px ${colors.border}40` : '0 2px 4px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.25rem',
        minWidth: '7rem',
        minHeight: '7rem',
        cursor: 'pointer',
        transform: isActive ? 'scale(1.05)' : 'scale(1)',
        position: 'relative' // Added for absolute positioning of text background
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.transform = 'scale(1.02)';
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        }
      }}
    >
      {/* Asset Icon */}
      <div style={{
        width: '4rem',
        height: '4rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <img 
          src={asset.icon}
          alt={asset.name}
          style={{
            width: '4rem',
            height: '4rem',
            opacity: 0.8
          }}
        />
      </div>
      
      {/* Asset Name - Black gray background covering bottom 30% of button */}
      <div
        title={asset.shortName || asset.name}
        aria-label={asset.shortName || asset.name}
        className="asset-name-ellipsis"
        style={{
          position: 'absolute',
          bottom: '-2px', // Extend slightly beyond border to eliminate white gap
          left: '-2px', // Extend slightly beyond border
          right: '-2px', // Extend slightly beyond border
          height: 'calc(30% + 2px)', // Compensate for the extended positioning
          background: '#2d3748', // Dark gray background
          color: 'white', // White text
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1rem', // Larger font size
          fontWeight: 'bold',
          textTransform: 'uppercase',
          overflow: 'hidden',
          borderBottomLeftRadius: '0.75rem',
          borderBottomRightRadius: '0.75rem'
        }}
      >
        {asset.shortName || asset.name}
      </div>
      </button>
    </div>
  );
}