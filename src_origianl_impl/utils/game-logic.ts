// Legacy Guardians - Game Logic Utilities

import { GameState, GameHistory, MarketEvent, Asset } from '../types';
import { GAME_CONFIG } from '../constants/game-config';

// Simplified asset correlation matrix
const CORRELATIONS: { [key: string]: { [key: string]: number } } = {
        tech: { tech: 1, bond: -0.2, esg: 0.3, gold: 0.1, stablecoin: 0, yield: 0.2, crypto: 0.6 },
        bond: { tech: -0.2, bond: 1, esg: 0.1, gold: 0, stablecoin: 0.1, yield: -0.1, crypto: -0.3 },
        esg: { tech: 0.3, bond: 0.1, esg: 1, gold: 0.2, stablecoin: 0.1, yield: 0.2, crypto: 0.3 },
        gold: { tech: 0.1, bond: 0, esg: 0.2, gold: 1, stablecoin: 0, yield: 0.1, crypto: 0.2 },
        stablecoin: { tech: 0, bond: 0.1, esg: 0.1, gold: 0, stablecoin: 1, yield: 0, crypto: 0 },
        yield: { tech: 0.2, bond: -0.1, esg: 0.2, gold: 0.1, stablecoin: 0, yield: 1, crypto: 0.2 },
        crypto: { tech: 0.6, bond: -0.3, esg: 0.3, gold: 0.2, stablecoin: 0, yield: 0.2, crypto: 1 }
};

/**
 * Sanitize a weight map so that only allowed assets retain their values.
 * Disallowed assets are set to 0.
 */
export function sanitizeWeights(
        weights: Record<string, number>,
        allowed: string[]
): Record<string, number> {
        return Object.fromEntries(
                Object.entries(weights).map(([k, v]) => [k, allowed.includes(k) ? v : 0])
        ) as Record<string, number>;
}

/**
 * Calculate daily portfolio metrics including return, volatility and drawdown
 */
export function calculateDailyReturns(
        weights: { [key: string]: number },
        assets: Asset[],
        event: MarketEvent | null,
        portfolioValue: number,
        peakValue: number
): { returns: number; volatility: number; drawdown: number; portfolioValue: number; peakValue: number } {
        let dailyReturn = 0;
        const assetReturns: { [key: string]: number } = {};

        // Calculate base returns with simple volatility noise and event impact
        assets.forEach(asset => {
                let baseReturn = asset.expectedReturn;

                if (event && event.affected.includes(asset.key)) {
                        const range = event.impactRange[asset.key];
                        if (Array.isArray(range) && range.length === 2) {
                                const [min, max] = range;
                                const impact = min + Math.random() * (max - min);
                                baseReturn += impact;
                        }
                }

                // Add random noise based on asset volatility
                baseReturn += asset.volatility * (Math.random() - 0.5);

                assetReturns[asset.key] = baseReturn;
                dailyReturn += (weights[asset.key] / 100) * baseReturn;
        });

        // Portfolio volatility using correlations
        let variance = 0;
        for (let i = 0; i < assets.length; i++) {
                const ai = assets[i];
                const wi = (weights[ai.key] || 0) / 100;
                for (let j = i; j < assets.length; j++) {
                        const aj = assets[j];
                        const wj = (weights[aj.key] || 0) / 100;
                        const corr = CORRELATIONS[ai.key]?.[aj.key] ?? 0;
                        const cov = ai.volatility * aj.volatility * corr;
                        if (i === j) {
                                variance += wi * wj * cov;
                        } else {
                                variance += 2 * wi * wj * cov;
                        }
                }
        }
        const volatility = Math.sqrt(Math.max(variance, 0)) * 100;

        // Update portfolio value and drawdown
        const newPortfolioValue = portfolioValue * (1 + dailyReturn);
        const newPeakValue = Math.max(peakValue, newPortfolioValue);
        const drawdown = ((newPortfolioValue - newPeakValue) / newPeakValue) * 100;

        return {
                returns: Number((dailyReturn * 100).toFixed(2)),
                volatility: Number(volatility.toFixed(2)),
                drawdown: Number(drawdown.toFixed(2)),
                portfolioValue: newPortfolioValue,
                peakValue: newPeakValue
        };
}

/**
 * Check if player should receive new badges
 */
export function checkBadgeEligibility(
        weights: { [key: string]: number },
        history: GameHistory[],
        currentReturns: number,
        existingBadges: string[]
): string[] {
        const newBadges: string[] = [];
        const requirements = GAME_CONFIG.BADGE_REQUIREMENTS;

        const { nonZeroCount, maxWeight } = getWeightStats(weights);

        // Check diversifier badge
        if (nonZeroCount >= requirements.DIVERSIFIER) {
                if (!existingBadges.includes('分散者')) {
                        newBadges.push('分散者');
                }
        }

        // Check long-term vision badge
        if (history.length >= 2 &&
                history.slice(-2).every(h => h.returns > 0) &&
                currentReturns > 0) {
                if (!existingBadges.includes('长远目光')) {
                        newBadges.push('长远目光');
                }
        }

        // Check risk manager badge
        if (maxWeight > requirements.RISK_MANAGER && currentReturns > 0) {
                if (!existingBadges.includes('风险管理者')) {
                        newBadges.push('风险管理者');
                }
        }

        return newBadges;
}

/**
 * Calculate resource rewards based on returns
 */
export function calculateResourceRewards(returns: number): { coins: number; gems: number } {
        const coins = Math.max(0, Math.round(returns * GAME_CONFIG.COIN_REWARD_RATIO));
        const gems = returns > GAME_CONFIG.GEM_REWARD_THRESHOLD ? 1 : 0;

        return { coins, gems };
}

/**
 * Check if game should end based on cumulative performance
 */
export function checkGameEnd(
        cumulativeReturn: number,
        badges: string[],
        maxBadges: number
): boolean {
        const wealthGoal = GAME_CONFIG.WEALTH_GOAL;
        const hasAllBadges = badges.length >= maxBadges;

        return cumulativeReturn >= wealthGoal && hasAllBadges;
}

/**
 * Maybe select a random item based on probability and optional filter
 */
export function maybeSelectRandom<T>(
        items: T[],
        probability: number,
        filter?: (idx: number) => boolean
): T | null {
        if (Math.random() > probability) {
                return null;
        }

        const indices = items
                .map((_, i) => i)
                .filter(i => (filter ? filter(i) : true));

        if (indices.length === 0) {
                return items.length === 0 ? (true as unknown as T) : null;
        }

        const randomIndex = indices[Math.floor(Math.random() * indices.length)];
        return items[randomIndex];
}

/**
 * Generate random market event
 */
export function generateRandomEvent(events: MarketEvent[]): MarketEvent | null {
        return maybeSelectRandom(events, GAME_CONFIG.DAILY_EVENT_PROBABILITY);
}

/**
 * Generate random dilemma question
 */
export function generateRandomDilemma<T>(
        questions: T[],
        askedQuestions: number[]
): T | null {
        return maybeSelectRandom(
                questions,
                GAME_CONFIG.DILEMMA_PROBABILITY,
                idx => !askedQuestions.includes(idx)
        );
}

/**
 * Generate random quiz question
 */
export function generateRandomQuiz(quizzes: any[]): any | null {
        return maybeSelectRandom(quizzes, GAME_CONFIG.QUIZ_PROBABILITY);
}

/**
 * Check if easter egg should trigger
 */
export function checkEasterEgg(): boolean {
        return maybeSelectRandom([], GAME_CONFIG.Easter_EGG_PROBABILITY) !== null;
}

/**
 * Calculate player level based on experience
 */
export function calculatePlayerLevel(experience: number): string {
	if (experience >= 1000) return 'master';
	if (experience >= 500) return 'expert';
	if (experience >= 100) return 'skilled';
	return 'novice';
}

/**
 * Validate asset allocation weights
 */
export function validateAssetWeights(weights: { [key: string]: number }): boolean {
        const total = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
        return Math.abs(total - GAME_CONFIG.TOTAL_WEIGHT) < 0.01; // Allow small floating point errors
}

/**
 * Derive basic statistics from asset weights
 */
export function getWeightStats(weights: { [key: string]: number }): {
        nonZeroCount: number;
        maxWeight: number;
        total: number;
} {
        const values = Object.values(weights);
        const nonZeroCount = values.filter(w => w > 0).length;
        const maxWeight = values.length ? Math.max(...values) : 0;
        const total = values.reduce((sum, weight) => sum + weight, 0);
        return { nonZeroCount, maxWeight, total };
}

/**
 * Get asset allocation summary
 */
export function getAssetAllocationSummary(weights: { [key: string]: number }): {
        total: number;
        distributed: number;
        concentration: number;
} {
        const { total, nonZeroCount, maxWeight } = getWeightStats(weights);

        return { total, distributed: nonZeroCount, concentration: maxWeight };
}

/**
 * Calculate portfolio risk score
 */
export function calculateRiskScore(weights: { [key: string]: number }): number {
        const { maxWeight, nonZeroCount } = getWeightStats(weights);

        // Higher concentration = higher risk, more diversification = lower risk
        let riskScore = maxWeight / 100; // 0-1 scale
        riskScore -= (nonZeroCount - 1) * 0.1; // Reduce risk for diversification
        riskScore = Math.max(0, Math.min(1, riskScore)); // Clamp to 0-1

        return Math.round(riskScore * 100); // Return as percentage
}
