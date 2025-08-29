export interface RealWorldAssetMapping {
  gameAssetId: string;
  realWorldAssets: string[];
  maxAllocationPercentage: number;
}

export interface MoneyRequest {
  id: string;
  amount: number;
  reason: string;
  requestedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  parentResponse?: {
    interestRate: number;
    durationDays: number;
    approvedAmount: number;
    approvedAt: Date;
    dueDate: Date;
  };
}

export interface LoanStatus {
  id: string;
  principal: number;
  interestRate: number;
  totalOwed: number;
  dueDate: Date;
  status: 'active' | 'paid' | 'overdue';
}

export interface ParentControlState {
  isParentMode: boolean;
  assetMappings: RealWorldAssetMapping[];
  moneyRequests: MoneyRequest[];
  activeLoans: LoanStatus[];
}

// Real world asset options for parents to choose from
export const REAL_WORLD_ASSET_OPTIONS = [
  // ETFs
  'QQQ', 'TQQQ', 'VTI', 'SPY', 'VOO', 'VUG', 'VGT',
  // Crypto
  'BTC', 'ETH', 'SOL', 'ADA', 'DOT', 'MATIC',
  // Individual Stocks
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META',
  // Bonds
  'TLT', 'IEF', 'SHY', 'TIPS', 'HYG',
  // Commodities
  'GLD', 'SLV', 'USO', 'DBA',
  // Cash/Stable
  'USDC', 'USDT', 'HYSA'
];