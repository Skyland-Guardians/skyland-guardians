// Centralized configuration for fallback/random daily return ranges per asset type.
// Each range is in decimal form (e.g., -0.03 = -3%, 0.05 = +5%).

export interface ReturnRange {
  min: number;
  max: number;
}

export const RETURN_RANGES: Record<string, ReturnRange> = {
  sword: { min: -0.03, max: 0.05 },    // tech: -3% .. +5%
  shield: { min: -0.01, max: 0.01 },   // bonds: -1% .. +1%
  forest: { min: -0.02, max: 0.03 },   // esg: -2% .. +3%
  yield: { min: -0.02, max: 0.04 },    // yield assets: -2% .. +4%
  golden: { min: -0.01, max: 0.02 },   // gold: -1% .. +2%
  fountain: { min: -0.002, max: 0.002 }, // stable: -0.2% .. +0.2%
  crystal: { min: -0.08, max: 0.10 },  // crypto: -8% .. +10%
  magic: { min: -0.03, max: 0.04 },    // thematic: -3% .. +4%
};

export function sampleReturnForType(type: string) {
  const range = RETURN_RANGES[type] || { min: -0.01, max: 0.02 };
  return Math.random() * (range.max - range.min) + range.min;
}

export default { RETURN_RANGES, sampleReturnForType };
