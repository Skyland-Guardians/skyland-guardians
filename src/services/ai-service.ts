import type { AssetType, ChatMessage } from '../types/game';
import type { AIPersonality } from '../data/ai-personalities';
import { AI_PERSONALITIES, DEFAULT_AI_PERSONALITY } from '../data/ai-personalities';
import { findMatchingResponse } from '../data/ai-responses';
import { GAME_ASSETS } from '../data/game-assets';

// Risk level mapping
const RISK_LABELS: Record<'low' | 'medium' | 'high', string> = {
	low: 'Conservative',
	medium: 'Balanced',
	high: 'Aggressive'
};

// AI Service Class
export class AIService {
	private currentPersonality: AIPersonality;
	private apiKey?: string;

	constructor(personalityId?: string) {
		this.currentPersonality = AI_PERSONALITIES.find(p => p.id === personalityId) || DEFAULT_AI_PERSONALITY;
		this.apiKey = import.meta.env.VITE_OPENAI_API_KEY;
	}

	// Switch AI companion
	setPersonality(personalityId: string): void {
		const personality = AI_PERSONALITIES.find(p => p.id === personalityId);
		if (personality) {
			this.currentPersonality = personality;
		}
	}

	// Get current AI companion info
	getCurrentPersonality(): AIPersonality {
		return this.currentPersonality;
	}

	// Generate asset allocation analysis
	analyzeAllocation(assets: AssetType[]): string {
		const nonZeroAssets = assets.filter(asset => asset.allocation > 0);
		
		// Diversification analysis
		const diversificationLevel = nonZeroAssets.length;
		let diversificationFeedback = '';
		
		if (diversificationLevel === 1) {
			diversificationFeedback = 'You have all your coins in one type of investment, which concentrates risk. Try spreading across 2-3 different asset types!';
		} else if (diversificationLevel === 2) {
			diversificationFeedback = 'Good start with diversification! Consider adding one more asset type to further reduce risk.';
		} else if (diversificationLevel >= 3) {
			diversificationFeedback = 'Excellent diversification! Your portfolio looks well-balanced.';
		}

		// Risk level analysis using GAME_ASSETS data
		const highRiskAssets = assets.filter(asset => {
			const gameAsset = GAME_ASSETS.find(ga => ga.id === asset.type);
			return gameAsset && gameAsset.risk === 'high' && asset.allocation > 30;
		});
		
		let riskFeedback = '';
		if (highRiskAssets.length > 0) {
			if (this.currentPersonality.riskTolerance === 'low') {
				riskFeedback = 'I notice you have high allocations in risky assets. As your conservative companion, I suggest adding more stable assets like bonds or stablecoins.';
			} else if (this.currentPersonality.riskTolerance === 'high') {
				riskFeedback = 'You seem willing to take risks, which can be rewarding! But remember to keep some "safety cushion" in your portfolio.';
			} else {
				riskFeedback = 'Your risk appetite looks quite active. Just remember to balance potential returns with risk management.';
			}
		}

		return `${diversificationFeedback} ${riskFeedback}`.trim();
	}

	// Generate market event feedback
	generateEventFeedback(eventType: string, portfolioChange: number): string {
		const changePercent = (portfolioChange * 100).toFixed(2);
		const isPositive = portfolioChange >= 0;
		
		const templates = [
			isPositive 
				? `Excellent! Your portfolio performed well during ${eventType}, gaining ${changePercent}%! This shows your allocation wisdom.`
				: `During ${eventType}, your portfolio dropped ${Math.abs(parseFloat(changePercent))}%. This is normal! The key is staying calm and not making panic adjustments.`,
			
			isPositive
				? `Under the influence of ${eventType}, you gained ${changePercent}%! Keep maintaining this balanced investment strategy.`
				: `${eventType} brought some volatility, dropping ${Math.abs(parseFloat(changePercent))}%. Remember, investing is like a roller coaster - ups and downs are normal!`
		];

		return templates[Math.floor(Math.random() * templates.length)];
	}	// Generate mission completion feedback
	generateMissionFeedback(missionType: string, success: boolean): string {
		if (success) {
			const successTemplates = [
				`Congratulations! You successfully completed the ${missionType} mission! This shows your investment wisdom.`,
				`Excellent! The ${missionType} mission was completed beautifully. You're becoming a true wealth guardian!`,
				`Outstanding! By completing the ${missionType} mission, you've learned another important investment skill.`
			];
			return successTemplates[Math.floor(Math.random() * successTemplates.length)];
		} else {
			const encouragementTemplates = [
				`The ${missionType} mission isn't completed yet, but that's okay! Every attempt is a learning opportunity.`,
				`This ${missionType} mission was a bit challenging, but I believe you'll do better next time!`,
				`Don't worry! ${missionType} takes some time to master. Take it slow and steady.`
			];
			return encouragementTemplates[Math.floor(Math.random() * encouragementTemplates.length)];
		}
	}

	// Main AI response method
	async getResponse(question: string, gameContext?: {
		assets?: AssetType[];
		currentDay?: number;
		stars?: number;
		level?: number;
	}): Promise<string> {
		// 1. First check preset responses
		const presetResponse = findMatchingResponse(question);
		if (presetResponse) {
			return presetResponse;
		}

		// 2. If about asset allocation, generate dynamic response
		const lowerQuestion = question.toLowerCase();
		if ((lowerQuestion.includes('asset') || lowerQuestion.includes('allocation') || lowerQuestion.includes('portfolio') || lowerQuestion.includes('investment')) && gameContext?.assets) {
			const allocationAnalysis = this.analyzeAllocation(gameContext.assets);
			const currentAllocations = gameContext.assets
				.filter(asset => asset.allocation > 0)
				.map(asset => {
					const gameAsset = GAME_ASSETS.find(ga => ga.id === asset.type);
					const displayName = gameAsset?.gameName || asset.name;
					return `${displayName} ${asset.allocation.toFixed(1)}%`;
				})
				.join(', ');
			
			return `Your current asset allocation is: ${currentAllocations}. ${allocationAnalysis}`;
		}

		// 3. If OpenAI API is configured, call LLM
		if (this.apiKey) {
			try {
				return await this.callOpenAI(question, gameContext);
			} catch (error) {
				console.error('OpenAI API call failed:', error);
			}
		}

		// 4. Fallback responses
		const fallbackResponses = [
			'That\'s a great question! Let me think about how to explain it in simple terms.',
			'Hmm, this involves some investment concepts. I suggest starting with the basics of diversification!',
			'Very insightful question! Investment and finance have many aspects to explore. Let\'s take it step by step.',
			'This is an important question! As your AI companion, I suggest starting with understanding the relationship between risk and return.'
		];

		return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
	}

	// Call OpenAI API
	private async callOpenAI(question: string, gameContext?: any): Promise<string> {
		if (!this.apiKey) {
			throw new Error('OpenAI API Key not configured');
		}

		const contextInfo = gameContext ? `Current game state: Day ${gameContext.currentDay || 1}, Stars: ${gameContext.stars || 0}, Level: ${gameContext.level || 1}` : '';
		const assetInfo = gameContext?.assets 
			? `Current asset allocation: ${gameContext.assets.map((a: AssetType) => {
				const gameAsset = GAME_ASSETS.find(ga => ga.id === a.type);
				const displayName = gameAsset?.gameName || a.name;
				return `${displayName}: ${a.allocation.toFixed(1)}%`;
			}).join(', ')}`
			: '';

		const systemPrompt = `${this.currentPersonality.prompt} 
Your risk tolerance is ${RISK_LABELS[this.currentPersonality.riskTolerance]}.
Please answer in simple, easy-to-understand language, avoiding complex financial terms. Use relatable analogies.
${contextInfo}
${assetInfo}`;

		const response = await fetch('https://api.openai.com/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${this.apiKey}`
			},
			body: JSON.stringify({
				model: 'gpt-4o-mini',
				messages: [
					{ role: 'system', content: systemPrompt },
					{ role: 'user', content: question }
				],
				max_tokens: 200,
				temperature: 0.7
			})
		});

		if (!response.ok) {
			throw new Error(`OpenAI API error: ${response.status}`);
		}

		const data = await response.json();
		return data?.choices?.[0]?.message?.content?.trim() || 'Sorry, I\'m a bit busy right now. Please try again later!';
	}

	// Generate welcome message
	generateWelcomeMessage(userName?: string): ChatMessage {
		const welcomeMessages = [
			`Good morning${userName ? `, ${userName}` : ''}! I'm your AI investment companion ${this.currentPersonality.name}. What investment knowledge would you like to learn today?`,
			`Hi${userName ? `, ${userName}` : ''}! Welcome to the world of wealth adventure! I'm ${this.currentPersonality.name}, delighted to be your investment mentor.`,
			`Hello${userName ? `, ${userName}` : ''}! I'm ${this.currentPersonality.name}, your dedicated AI investment companion. Let's explore the mysteries of investing together!`
		];

		return {
			id: `welcome-${Date.now()}`,
			sender: 'ai',
			content: welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)],
			timestamp: new Date(),
			type: 'greeting'
		};
	}
}

// Export singleton instance
export const aiService = new AIService();