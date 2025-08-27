// Gamified AI Service - Game-themed responses with real asset integration

import type { ChatMessage } from '../types/game';
import type { AIPersonality } from '../data/ai-personalities';
import { AI_PERSONALITIES, DEFAULT_AI_PERSONALITY } from '../data/ai-personalities';
import { GAME_ASSETS } from '../data/game-assets';
import { findMatchingResponse } from '../data/ai-responses';

// Asset advice templates with game theming
const ASSET_ADVICE_TEMPLATES = {
  sword: {
    bullish: "Your Agile Sword is sharp and ready! Tech assets like this tend to lead market rallies. Consider increasing your position when innovation winds blow strong! ⚔️",
    bearish: "The Agile Sword feels heavy in volatile times. Tech can be choppy, but legendary warriors know patience. Maybe balance with some defensive shields? 🛡️",
    neutral: "Your Agile Sword is well-maintained. Tech assets offer growth potential but require courage. Balance is key for any noble guardian! ⚖️"
  },
  crystal: {
    bullish: "Your Mystic Crystal glows brilliantly! Crypto realms are expanding rapidly. But remember, crystals can shatter - never put all your magic in one stone! 💎",
    bearish: "The Mystic Crystal dims in uncertain times. Crypto winters test true believers. Consider reducing exposure until the crystal's power stabilizes. ❄️",
    neutral: "Your Mystic Crystal holds steady power. The crypto realm is unpredictable but full of potential. Only invest what you can afford to lose! ✨"
  },
  magic: {
    bullish: "Your Stellar Wand sparkles with innovation magic! Small-cap and thematic investments can create powerful spells of growth! 🪄",
    bearish: "The Stellar Wand's magic feels unstable. Innovation assets need patient spellcasting. Consider waiting for clearer star alignments. 🌟",
    neutral: "Your Stellar Wand maintains its mystical energy. Innovation investments are like learning new spells - exciting but requiring practice! 📚"
  },
  shield: {
    bullish: "Your Sturdy Shield holds firm and true! Bonds may not excite but they protect when battle gets fierce. Defense wins championships! 🛡️",
    bearish: "The Sturdy Shield is your faithful companion! In uncertain times, bonds provide the protection every wise guardian needs. 🏰",
    neutral: "Your Sturdy Shield remains reliable. Bond investments are like armor - not glamorous but essential for protection! ⚔️"
  }
};

// Market sentiment keywords
const SENTIMENT_KEYWORDS = {
  bullish: ['bullish', 'bull', 'rising', 'up', 'growth', 'gain', 'increase', 'buy', 'optimistic'],
  bearish: ['bearish', 'bear', 'falling', 'down', 'decline', 'loss', 'decrease', 'sell', 'pessimistic'],
  neutral: ['neutral', 'stable', 'sideways', 'hold', 'wait', 'uncertain', 'mixed']
};

// General investment wisdom responses
const GENERAL_RESPONSES = [
  "A wise guardian diversifies their treasures across different realms! 🏰",
  "Time in the market beats timing the market, noble guardian! ⏰",
  "Never invest more than you can afford to lose in your adventures! 💰",
  "The strongest portfolios are built with patience and discipline! 🗿",
  "Remember: Fortune favors the prepared guardian! 📚"
];

export class GamifiedAIService {
  private currentPersonality: AIPersonality = DEFAULT_AI_PERSONALITY;

  initialize(_gameState: any, _assetAllocations: any[], _coins: number): void {
    // Store for potential future use
    // Currently not used but may be needed for enhanced features
  }

  setPersonality(personalityId: string): void {
    const personality = AI_PERSONALITIES.find(p => p.id === personalityId);
    this.currentPersonality = personality || DEFAULT_AI_PERSONALITY;
  }

  private detectSentiment(message: string): 'bullish' | 'bearish' | 'neutral' {
    const lowerMessage = message.toLowerCase();
    
    const bullishCount = SENTIMENT_KEYWORDS.bullish.filter(keyword => 
      lowerMessage.includes(keyword)
    ).length;
    
    const bearishCount = SENTIMENT_KEYWORDS.bearish.filter(keyword => 
      lowerMessage.includes(keyword)
    ).length;
    
    if (bullishCount > bearishCount) return 'bullish';
    if (bearishCount > bullishCount) return 'bearish';
    return 'neutral';
  }

  async getGameResponse(userMessage: string, gameContext: {
    assets: any[];
    currentDay: number;
    stars: number;
    level: number;
    coins: number;
  }): Promise<string> {
    
    const message = userMessage.toLowerCase();
    const sentiment = this.detectSentiment(message);
    
    // Check for asset-specific questions
    for (const [assetKey, templates] of Object.entries(ASSET_ADVICE_TEMPLATES)) {
      const asset = GAME_ASSETS.find(a => a.id === assetKey);
      if (asset && (message.includes(asset.gameName.toLowerCase()) || message.includes(assetKey))) {
        const advice = templates[sentiment];
        return `${advice}\n\nReal world equivalent: ${asset.realWorld}`;
      }
    }
    
    // Portfolio analysis
    if (message.includes('portfolio') || message.includes('allocation')) {
      return this.generatePortfolioAdvice(gameContext);
    }
    
    // General market questions
    if (message.includes('market') || message.includes('invest')) {
      const randomAdvice = GENERAL_RESPONSES[Math.floor(Math.random() * GENERAL_RESPONSES.length)];
      return `${this.currentPersonality.name} says: ${randomAdvice}`;
    }
    
    // Fallback to personality-based response
    const personalityResponse = findMatchingResponse(userMessage);
    if (personalityResponse) {
      return personalityResponse;
    }
    
    // Final fallback
    return `${this.currentPersonality.name} reflects on your question... ${GENERAL_RESPONSES[Math.floor(Math.random() * GENERAL_RESPONSES.length)]}`;
  }

  private generatePortfolioAdvice(gameContext: {
    assets: any[];
    currentDay: number;
    stars: number;
    level: number;
    coins: number;
  }): string {
    const allocatedAssets = gameContext.assets.filter((a: any) => a.allocation > 0);
    
    if (allocatedAssets.length === 0) {
      return "Your treasure chest is empty! Start your investment journey by allocating to different asset types. A balanced approach serves guardians well! 🎯";
    }
    
    if (allocatedAssets.length === 1) {
      return "You've chosen a single path, brave guardian! While focus can be powerful, consider diversifying your magic across different realms for better protection! 🛡️";
    }
    
    if (allocatedAssets.length >= 4) {
      return "Excellent diversification, wise guardian! Your portfolio spans multiple realms. Remember to rebalance occasionally as the winds of fortune shift! ⚖️";
    }
    
    return `Your portfolio shows ${allocatedAssets.length} asset types. Consider adding more diversity to strengthen your defenses against market storms! 🌪️`;
  }

  generateWelcomeMessage(userName: string): ChatMessage {
    const welcomeMessages = [
      `Welcome to the Skyland Guardians, ${userName}! I'm ${this.currentPersonality.name}, ready to guide your investment journey! 🏰✨`,
      `Greetings, ${userName}! ${this.currentPersonality.name} at your service. Let's build your legendary portfolio together! ⚔️💎`,
      `Hail and well met, ${userName}! I am ${this.currentPersonality.name}, your trusted advisor in these financial realms! 🌟💰`
    ];
    
    const randomWelcome = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
    
    return {
      id: `ai-welcome-${Date.now()}`,
      sender: 'ai',
      content: randomWelcome,
      timestamp: new Date(),
      type: 'greeting'
    };
  }

  generateEventFeedback(eventType: string, portfolioChange: number): string {
    const changePercent = (portfolioChange * 100).toFixed(2);
    const isPositive = portfolioChange >= 0;
    
    const templates = [
      isPositive 
        ? `Excellent! Your portfolio performed well during ${eventType}, gaining ${changePercent}%! This shows your allocation wisdom. ⚔️`
        : `During ${eventType}, your portfolio dropped ${Math.abs(parseFloat(changePercent))}%. This is normal! The key is staying calm and not making panic adjustments. 🛡️`,
      
      isPositive
        ? `Under the influence of ${eventType}, you gained ${changePercent}%! Keep maintaining this balanced investment strategy. 💎`
        : `${eventType} brought some volatility, dropping ${Math.abs(parseFloat(changePercent))}%. Remember, investing is like a roller coaster - ups and downs are normal! 🎢`
    ];

    return templates[Math.floor(Math.random() * templates.length)];
  }
}

// Export singleton instance
export const gamifiedAIService = new GamifiedAIService();