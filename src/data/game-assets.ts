// Game-style asset definitions mapping to real-world asset classes.
// Each entry includes: id (matches simulated series keys), a game-friendly name,
// a lore name for UI/tooltip, real-world mapping, basic expected return and
// volatility estimates for guidance, and UI layout guidance (left = higher risk side).

export type RiskCategory = 'low' | 'medium' | 'high';

export interface GameAsset {
  id: string;
  gameName: string; // short display name in the game
  shortName?: string; // very short label for compact UI (optional)
  loreName: string; // longer lore/title used in descriptions
  realWorld: string; // examples of real-world analogues
  description: string;
  expectedReturn: number; // indicative annualized or proxy (decimal)
  volatility: number; // relative volatility indicator (0..1)
  risk: RiskCategory;
  uiSide: 'left' | 'right' | 'center';
  icon?: string;
}

export const GAME_ASSETS: GameAsset[] = [
  {
    id: 'sword',
    gameName: 'Agile Sword',
    shortName: 'Sword',
    loreName: 'Agile Sword · Tech Forest',
    realWorld: 'Technology / Broad Market ETFs (QQQ, VTI, etc.)',
    description: 'High-growth, higher-volatility assets that drive upside potential.',
    expectedReturn: 0.08,
    volatility: 0.15,
    risk: 'high',
    uiSide: 'left',
    icon: '/assets/主界面1资源/剑 icon.png'
  },
  {
    id: 'crystal',
    gameName: 'Mystic Crystal',
    shortName: 'Crystal',
    loreName: 'Mystic Crystal · Starry Isles',
    realWorld: 'Cryptocurrencies (BTC, ETH, SOL, etc.)',
    description: 'Very high volatility and high upside potential; sensitive to sentiment.',
    expectedReturn: 0.12,
    volatility: 0.25,
    risk: 'high',
    uiSide: 'left',
    icon: '/assets/主界面1资源/水晶icon.png'
  },
  {
    id: 'magic',
    gameName: 'Stellar Wand',
    shortName: 'Wand',
    loreName: 'Stellar Wand · Innovation Realm',
    realWorld: 'Thematic / small-cap / innovation assets (higher volatility)',
    description: 'Theme-driven assets with exploration upside and notable volatility.',
    expectedReturn: 0.10,
    volatility: 0.20,
    risk: 'high',
    uiSide: 'left',
    icon: '/assets/主界面1资源/魔杖icon.png'
  },
  {
    id: 'yield',
    gameName: 'Temple of Yield',
    shortName: 'Yield',
    loreName: 'Temple of Yield · Prosperity Shrine',
    realWorld: 'Yield-bearing assets / DeFi yields (AAVE, COMP, yield products)',
    description: 'Assets that generate passive yield; moderate risk with recurring returns.',
    expectedReturn: 0.07,
    volatility: 0.12,
    risk: 'medium',
    uiSide: 'left',
    icon: '/assets/主界面1资源/喷泉icon.png'
  },
  {
    id: 'forest',
    gameName: 'Green Grove',
    shortName: 'Grove',
    loreName: 'Green Grove · Life Spring',
    realWorld: 'ESG / sustainability-themed ETFs (ESGU, etc.)',
    description: 'Sustainable-themed assets with balanced growth and values-driven exposure.',
    expectedReturn: 0.06,
    volatility: 0.10,
    risk: 'medium',
    uiSide: 'right',
    icon: '/assets/主界面1资源/森林icon.png'
  },
  {
    id: 'golden',
    gameName: 'Golden Temple',
    shortName: 'Gold',
    loreName: 'Golden Temple · Haven of Safety',
    realWorld: 'Gold ETFs (GLD, etc.)',
    description: 'Traditional safe-haven asset that often cushions downside in crises.',
    expectedReturn: 0.04,
    volatility: 0.07,
    risk: 'low',
    uiSide: 'right',
    icon: '/assets/主界面1资源/黄金icon.png'
  },
  {
    id: 'shield',
    gameName: 'Sturdy Shield',
    shortName: 'Shield',
    loreName: 'Sturdy Shield · Mountain Garden',
    realWorld: 'Bond ETFs (TLT, etc.)',
    description: 'Low-volatility, defensive assets for portfolio protection.',
    expectedReturn: 0.03,
    volatility: 0.05,
    risk: 'low',
    uiSide: 'right',
    icon: '/assets/主界面1资源/盾icon.png'
  },
  {
    id: 'fountain',
    gameName: 'Calm Fountain',
    shortName: 'Fountain',
    loreName: 'Calm Fountain · Quiet Lake',
    realWorld: 'Stablecoins / cash-like assets (USDT, USDC, etc.)',
    description: 'Extremely low volatility safe harbor for capital preservation.',
    expectedReturn: 0.01,
    volatility: 0.005,
    risk: 'low',
    uiSide: 'right',
    icon: '/assets/主界面1资源/喷泉icon.png'
  }
];

// UI ordering guidance: leftGroup should contain higher risk/return assets
// that appear to the left of the NEXT DAY button; rightGroup contains
// the more stable assets.
export const UI_ASSET_ORDER = {
  leftGroup: ['sword', 'crystal', 'magic', 'yield'],
  rightGroup: ['forest', 'golden', 'shield', 'fountain']
};
