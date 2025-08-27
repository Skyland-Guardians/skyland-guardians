import { useGameState } from '../../hooks/useGameContext';
import type { AssetType } from '../../types/game';

interface AssetButtonProps {
  asset: AssetType;
  onClick?: () => void;
  isActive?: boolean;
}

export function AssetButton({ asset, onClick, isActive = false }: AssetButtonProps) {
  const { updateAssetAllocations, assetAllocations } = useGameState();

  const handleSliderChange = (newValue: number) => {
    const updatedAllocations = assetAllocations.map(a => 
      a.id === asset.id ? { ...a, allocation: newValue } : a
    );
    updateAssetAllocations(updatedAllocations);
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
          minWidth: '120px',
          marginBottom: '0.5rem',
          zIndex: 30,
          animation: 'slideUp 0.2s ease'
        }}>
          {/* Percentage Display */}
          <div style={{
            textAlign: 'center',
            marginBottom: '0.5rem'
          }}>
            <span style={{
              fontSize: '1rem',
              fontWeight: 'bold',
              color: colors.border
            }}>
              {asset.allocation.toFixed(1)}%
            </span>
          </div>
          
          {/* Mini Slider */}
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={asset.allocation}
            onChange={(e) => handleSliderChange(parseFloat(e.target.value))}
            style={{
              width: '100%',
              height: '4px',
              borderRadius: '2px',
              background: `linear-gradient(to right, ${colors.border} 0%, ${colors.border} ${asset.allocation}%, #e5e7eb ${asset.allocation}%, #e5e7eb 100%)`,
              outline: 'none',
              cursor: 'pointer',
              appearance: 'none'
            }}
          />
          
          {/* Quick Presets */}
          <div style={{
            display: 'flex',
            gap: '0.25rem',
            marginTop: '0.5rem',
            justifyContent: 'center'
          }}>
            {[0, 25, 50].map((preset) => (
              <button
                key={preset}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSliderChange(preset);
                }}
                style={{
                  padding: '0.125rem 0.375rem',
                  borderRadius: '0.125rem',
                  border: `1px solid ${colors.border}`,
                  backgroundColor: asset.allocation === preset ? colors.border : 'white',
                  color: asset.allocation === preset ? 'white' : colors.border,
                  fontSize: '0.625rem',
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
      <div style={{
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
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        borderBottomLeftRadius: '0.75rem',
        borderBottomRightRadius: '0.75rem'
      }}>
        {asset.name}
      </div>
      </button>
    </div>
  );
}