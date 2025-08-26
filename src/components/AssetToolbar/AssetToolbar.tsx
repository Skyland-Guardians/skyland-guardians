import { useState } from 'react';
import { useGameState } from '../../hooks/useGameContext';
import { AssetButton } from './AssetButton';

export function AssetToolbar() {
  const { assetAllocations, updateGameState } = useGameState();
  const [activeAssetId, setActiveAssetId] = useState<string | null>(null);

  const handleAssetClick = (assetId: string) => {
    setActiveAssetId(activeAssetId === assetId ? null : assetId);
  };

  const handleApplyClick = () => {
    // Calculate total allocation
    const total = assetAllocations.reduce((sum, asset) => sum + asset.allocation, 0);
    if (Math.abs(total - 100) < 0.1) {
      setActiveAssetId(null); // Close any open sliders
      // TODO: Move to next step (Mission Card selection)
      alert('Ready to proceed to Mission Selection!');
    } else {
      alert(`Please adjust allocations to total 100%. Current total: ${total.toFixed(1)}%`);
    }
  };

  return (
    <div style={{
      background: '#357ABD', // Deeper blue from design specifications
      padding: '1.5rem 1rem', // Increased vertical padding
      borderTopLeftRadius: '2.5rem', // Much larger rounded corners
      borderTopRightRadius: '2.5rem',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
      position: 'relative',
      zIndex: 3,
      margin: '0 auto', // Center the toolbar
      width: 'fit-content', // Shrink to content size
      borderRadius: '2.5rem' // Make all corners rounded since it's now centered
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1.5rem', // Increased gap between buttons
        maxWidth: '80rem',
        margin: '0 auto'
      }}>
        {assetAllocations.slice(0, 4).map((asset) => (
          <AssetButton 
            key={asset.id} 
            asset={asset} 
            onClick={() => handleAssetClick(asset.id)}
            isActive={activeAssetId === asset.id}
          />
        ))}
        
        {/* APPLY Button - More prominent golden design */}
        <button 
          onClick={handleApplyClick}
          style={{
            background: 'linear-gradient(135deg, #FFD700, #FFA500)', // Golden gradient
            border: '3px solid #FFB000',
            borderRadius: '0.75rem',
            padding: '0.75rem',
            boxShadow: '0 4px 12px rgba(255, 215, 0, 0.4)', // Golden shadow
            transition: 'all 0.2s ease',
            minWidth: '12rem', // Make it wider horizontally
            minHeight: '7rem',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.25rem',
            transform: 'scale(1.1)' // Slightly larger than other buttons
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.15)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 215, 0, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 215, 0, 0.4)';
          }}
        >
          <span style={{
            fontSize: '2rem',
            fontWeight: '900',
            color: '#B8860B',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
          }}>
            APPLY
          </span>
        </button>
        
        {assetAllocations.slice(4).map((asset) => (
          <AssetButton 
            key={asset.id} 
            asset={asset} 
            onClick={() => handleAssetClick(asset.id)}
            isActive={activeAssetId === asset.id}
          />
        ))}
      </div>
    </div>
  );
}