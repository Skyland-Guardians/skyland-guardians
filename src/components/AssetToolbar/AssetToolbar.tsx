import { useState } from 'react';
import { useGameState } from '../../hooks/useGameContext';
import { AssetButton } from './AssetButton';
import { aiService } from '../../services/ai-service';

export function AssetToolbar() {
  const { assetAllocations, addMessage } = useGameState();
  const [activeAssetId, setActiveAssetId] = useState<string | null>(null);

  const handleAssetClick = (assetId: string) => {
    setActiveAssetId(activeAssetId === assetId ? null : assetId);
  };

  // Calculate total allocation for validation
  const totalAllocation = assetAllocations.reduce((sum, asset) => sum + asset.allocation, 0);
  const isValidAllocation = Math.abs(totalAllocation - 100) < 0.1;

  const handleApplyClick = () => {
    // Calculate total allocation
    const total = assetAllocations.reduce((sum, asset) => sum + asset.allocation, 0);
    
    if (Math.abs(total - 100) < 0.1) {
      setActiveAssetId(null); // Close any open sliders
      
      // Generate AI analysis of the allocation
      const aiAnalysis = aiService.analyzeAllocation(assetAllocations);
      
      // Generate comprehensive AI feedback
      const feedbackContent = `✅ Portfolio allocation applied successfully!\n\n${aiAnalysis}\n\nYour portfolio is now ready for the next market session!`;
      
      addMessage({
        id: `apply-${Date.now()}`,
        sender: 'ai',
        content: feedbackContent,
        timestamp: new Date(),
        type: 'feedback'
      });
    }
  };



  return (
    <>
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
        
        {/* APPLY Button */}
        <button
          onClick={handleApplyClick}
          disabled={!isValidAllocation}
          style={{
            background: isValidAllocation ? '#f5f5dc' : '#e0e0e0',
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
            cursor: isValidAllocation ? 'pointer' : 'not-allowed',
            transform: 'scale(1)',
            opacity: isValidAllocation ? 1 : 0.6
          }}
          onMouseEnter={(e) => {
            if (isValidAllocation) {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
            }
          }}
          onMouseLeave={(e) => {
            if (isValidAllocation) {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
            }
          }}
        >
          <span style={{
            fontSize: '2rem',
            fontWeight: '900',
            color: isValidAllocation ? '#4a5568' : '#9ca3af',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            textAlign: 'center'
          }}>
            APPLY
          </span>
          {!isValidAllocation && (
            <span style={{
              fontSize: '0.8rem',
              color: '#ef4444',
              textAlign: 'center',
              marginTop: '0.25rem'
            }}>
              Total: {totalAllocation.toFixed(1)}%
            </span>
          )}
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

    </>
  );
}