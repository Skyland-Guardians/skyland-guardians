import { useState } from 'react';
import { useGameState } from '../../hooks/useGameContext';
import { AssetButton } from './AssetButton';
import { gamifiedAIService } from '../../services/gamified-ai-service';

export function AssetToolbar() {
  const { assetAllocations, addMessage, gameState, coins, performanceHistory, updateActiveCards, triggerNewCards, checkAchievements } = useGameState();
  const [activeAssetId, setActiveAssetId] = useState<string | null>(null);

  const handleAssetClick = (assetId: string) => {
    setActiveAssetId(activeAssetId === assetId ? null : assetId);
  };

  // Calculate total allocation for validation
  const totalAllocation = assetAllocations.reduce((sum, asset) => sum + asset.allocation, 0);
  const isValidAllocation = Math.abs(totalAllocation - 100) < 0.1;

  const handleApplyClick = async () => {
    // Calculate total allocation
    const total = assetAllocations.reduce((sum, asset) => sum + asset.allocation, 0);
    
    if (Math.abs(total - 100) < 0.1) {
      setActiveAssetId(null); // Close any open sliders
      
      // Store current allocations for consistent use throughout this function
      const currentAllocations = [...assetAllocations];
      
      // First, check for any completed missions with the new allocation
      if (updateActiveCards) {
        updateActiveCards(currentAllocations);
      }
      
      // Then, check if this action triggers any new cards (missions/events)
      if (triggerNewCards) {
        triggerNewCards('apply');
      }
      
      // 点击apply时检查成就
      if (checkAchievements) {
        setTimeout(() => {
          checkAchievements(currentAllocations);
        }, 100);
      }

      // Create rich portfolio summary message similar to settlement format
      const portfolioSummary = {
        type: 'portfolio',
        title: `PORTFOLIO APPLIED! 📋`,
        summary: {
          totalAllocation: total,
          assetCount: currentAllocations.length
        },
        assets: currentAllocations.map((asset) => ({
          id: asset.id,
          name: asset.shortName || asset.name,
          icon: asset.icon,
          allocation: asset.allocation,
          theme: asset.theme
        }))
      };
      
      addMessage({
        id: `portfolio-${Date.now()}`,
        sender: 'ai',
        content: JSON.stringify(portfolioSummary),
        timestamp: new Date(),
        type: 'feedback'
      });

      // Add AI thinking message
      addMessage({
        id: `ai-thinking-apply-${Date.now()}`,
        sender: 'ai',
        content: '🤔 *Analyzing your portfolio allocation strategy...*',
        timestamp: new Date(),
        type: 'feedback'
      });

      // Get AI feedback on the portfolio allocation
      try {
        const aiFeedback = await gamifiedAIService.generateApplyFeedback({
          assets: currentAllocations,
          currentDay: gameState.currentDay,
          stars: gameState.stars,
          level: gameState.level,
          coins: coins || 1000,
          performanceHistory: performanceHistory
        });

        // Add AI feedback message
        addMessage({
          id: `ai-apply-feedback-${Date.now()}`,
          sender: 'ai',
          content: aiFeedback,
          timestamp: new Date(),
          type: 'feedback'
        });
      } catch (error) {
        console.error('Failed to get AI feedback:', error);
        // Add fallback message
        addMessage({
          id: `ai-apply-fallback-${Date.now()}`,
          sender: 'ai',
          content: 'Portfolio allocation applied! Your investment choices will guide your journey through the Skyland realms. Keep learning and adjusting your strategy! 🎯✨',
          timestamp: new Date(),
          type: 'feedback'
        });
      }
    }
  };



  return (
    <div style={{
      background: '#5196DC', // Deeper blue from design specifications
      padding: '1.5rem 3.5rem', // Reduced padding to fit in grid
      borderTopLeftRadius: '2.5rem', // Much larger rounded corners
      borderTopRightRadius: '2.5rem',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
      position: 'relative',
      width: 'fit-content', // Shrink to content size
      borderRadius: '1.5rem', // Make all corners rounded since it's now centered
      margin: '0 auto' // Center within grid area
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
  );
}