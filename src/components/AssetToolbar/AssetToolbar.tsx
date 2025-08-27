import { useState } from 'react';
import { useGameState } from '../../hooks/useGameContext';
import { AssetButton } from './AssetButton';
import { MISSIONS } from '../../data/missions';

export function AssetToolbar() {
  const { assetAllocations, setCurrentMission } = useGameState();
  const [activeAssetId, setActiveAssetId] = useState<string | null>(null);

  const handleAssetClick = (assetId: string) => {
    setActiveAssetId(activeAssetId === assetId ? null : assetId);
  };

  const handleNextDayClick = () => {
    // Calculate total allocation
    const total = assetAllocations.reduce((sum, asset) => sum + asset.allocation, 0);
    if (Math.abs(total - 100) < 0.1) {
      setActiveAssetId(null); // Close any open sliders
      const mission = MISSIONS[Math.floor(Math.random() * MISSIONS.length)];
      setCurrentMission(mission);
    } else {
      alert(`Please adjust allocations to total 100%. Current total: ${total.toFixed(1)}%`);
    }
  };

  return (
    <div style={{
      background: '#357ABD', // Deeper blue from design specifications
      padding: '2rem 3.25rem', // Increased horizontal padding by 30% (2.5rem * 1.3)
      borderTopLeftRadius: '2.5rem', // Much larger rounded corners
      borderTopRightRadius: '2.5rem',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
      position: 'fixed',
      bottom: '6vh',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 3,
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
        {/* NEXT DAY Button */}
        <button
          onClick={handleNextDayClick}
          style={{
            background: '#f5f5dc',
            border: '2px solid rgba(255,255,255,0.5)',
            borderRadius: '0.75rem',
            padding: '0.75rem',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.25rem',
            minWidth: '16rem',
            minHeight: '7rem',
            cursor: 'pointer',
            transform: 'scale(1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
          }}
        >
          <span style={{
            fontSize: '2rem',
            fontWeight: '900',
            color: '#4a5568',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            textAlign: 'center'
          }}>
            NEXT DAY
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