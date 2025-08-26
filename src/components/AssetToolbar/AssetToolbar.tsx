import { useGameState } from '../../hooks/useGameState';
import { AssetButton } from './AssetButton';

export function AssetToolbar() {
  const { assetAllocations } = useGameState();

  return (
    <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 p-4 rounded-t-3xl shadow-2xl">
      <div className="flex justify-center items-center gap-3 max-w-4xl mx-auto">
        {assetAllocations.slice(0, 4).map((asset) => (
          <AssetButton key={asset.id} asset={asset} />
        ))}
        
        {/* APPLY Button - Special styling */}
        <button className="bg-gradient-to-b from-yellow-100 to-yellow-50 hover:from-yellow-200 hover:to-yellow-100 border border-yellow-300 rounded-xl px-6 py-3 shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105">
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 flex items-center justify-center">
              <span className="text-blue-700 font-bold text-sm">✓</span>
            </div>
            <span className="text-xs font-bold text-blue-800 uppercase tracking-wide">
              APPLY
            </span>
          </div>
        </button>
        
        {assetAllocations.slice(4).map((asset) => (
          <AssetButton key={asset.id} asset={asset} />
        ))}
      </div>
      
      {/* Allocation status indicator */}
      <div className="text-center mt-3">
        <div className="inline-flex items-center gap-2 bg-white bg-opacity-20 rounded-full px-4 py-1">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-white font-medium">
            Portfolio Balanced • Ready to Trade
          </span>
        </div>
      </div>
    </div>
  );
}