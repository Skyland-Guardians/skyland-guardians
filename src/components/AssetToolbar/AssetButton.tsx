import { AssetType } from '../../types';

interface AssetButtonProps {
  asset: AssetType;
  onClick?: () => void;
}

export function AssetButton({ asset, onClick }: AssetButtonProps) {
  const getThemeClasses = (theme: string) => {
    switch (theme) {
      case 'gold':
        return 'bg-gradient-to-b from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 border-yellow-500';
      case 'orange':
        return 'bg-gradient-to-b from-orange-400 to-orange-600 hover:from-orange-300 hover:to-orange-500 border-orange-500';
      case 'green':
        return 'bg-gradient-to-b from-green-400 to-green-600 hover:from-green-300 hover:to-green-500 border-green-500';
      case 'blue':
        return 'bg-gradient-to-b from-blue-400 to-blue-600 hover:from-blue-300 hover:to-blue-500 border-blue-500';
      default:
        return 'bg-gradient-to-b from-gray-400 to-gray-600 hover:from-gray-300 hover:to-gray-500 border-gray-500';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`
        ${getThemeClasses(asset.theme)}
        border rounded-xl p-3 shadow-lg transition-all duration-200 
        hover:shadow-xl hover:scale-105 active:scale-95
        flex flex-col items-center gap-1 min-w-[64px]
      `}
    >
      {/* Asset Icon */}
      <div className="w-8 h-8 flex items-center justify-center">
        <img 
          src={asset.icon}
          alt={asset.name}
          className="w-6 h-6 object-contain drop-shadow-sm"
        />
      </div>
      
      {/* Asset Name */}
      <span className="text-xs font-bold text-white uppercase tracking-wide drop-shadow-sm">
        {asset.name}
      </span>
      
      {/* Allocation Percentage */}
      <div className="text-xs text-white opacity-90 font-medium">
        {asset.allocation.toFixed(1)}%
      </div>
      
      {/* Selection indicator */}
      <div className="w-full h-1 bg-white bg-opacity-30 rounded-full mt-1 overflow-hidden">
        <div 
          className="h-full bg-white transition-all duration-300"
          style={{ width: `${(asset.allocation / 25) * 100}%` }}
        />
      </div>
    </button>
  );
}