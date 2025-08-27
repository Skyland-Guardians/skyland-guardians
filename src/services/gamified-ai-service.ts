// Gamified AI Service - Game-themed responses with real asset integration

import type { ChatMessage } from '../types/game';
import type { AIPersonality } from '../data/ai-personalities';
import { AI_PERSONALITIES, DEFAULT_AI_PERSONALITY } from '../data/ai-personalities';
import { GAME_ASSETS } from '../data/game-assets';

// Azure Function App Configuration
const FUNCTION_APP_URL = import.meta.env.VITE_FUNCTION_APP_URL;
const FUNCTION_KEY = import.meta.env.VITE_FUNCTION_KEY;

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
  private sessionId: string = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  initialize(_gameState: any, _assetAllocations: any[], _coins: number): void {
    // Store for potential future use
    // Currently not used but may be needed for enhanced features
  }

  setPersonality(personalityId: string): void {
    const personality = AI_PERSONALITIES.find(p => p.id === personalityId);
    this.currentPersonality = personality || DEFAULT_AI_PERSONALITY;
    // Clear conversation context when changing personality
    this.clearConversationContext();
  }

  /**
   * Call Azure Function App chat endpoint
   */
  private async callFunctionApp(userMessage: string, systemPrompt?: string): Promise<string> {
    if (!FUNCTION_APP_URL) {
      throw new Error('Function App URL not configured. Please set VITE_FUNCTION_APP_URL in your .env.local file');
    }

    try {
      const requestBody = {
        message: userMessage,
        session_id: this.sessionId,
        ...(systemPrompt && { system_prompt: systemPrompt })
      };
      
      // Print system prompt for testing purposes
      if (systemPrompt) {
        console.log('System Prompt:', systemPrompt);
      }
      console.log('User Message:', userMessage);

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      // Build URL with function key as code parameter
      let url = `${FUNCTION_APP_URL}/api/chat`;
      if (FUNCTION_KEY) {
        url += `?code=${encodeURIComponent(FUNCTION_KEY)}`;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Function App Error:', response.status, errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText || 'Unknown error' };
        }
        
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ AI Response:', data.response);
      
      return data.response || 'Sorry, I cannot respond right now.';
    } catch (error) {
      console.error('💥 Function App Error:', error);
      if (error instanceof Error) {
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          throw new Error('Function App authentication failed. Please check your VITE_FUNCTION_KEY');
        }
        if (error.message.includes('404')) {
          throw new Error('Function App endpoint not found. Please check your VITE_FUNCTION_APP_URL');
        }
        if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
          throw new Error('CORS error: Function App needs CORS configuration.\n\nTo fix this:\n1. Go to Azure Portal\n2. Find your Function App\n3. Go to CORS settings\n4. Add "http://localhost:5174" and "https://skyland-guardians.github.io"\n5. Save the settings');
        }
      }
      throw new Error('AI service temporarily unavailable, please try again later');
    }
  }

  /**
   * Clear conversation context for current session
   */
  private async clearConversationContext(): Promise<void> {
    if (!FUNCTION_APP_URL) return;

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      // Build URL with function key as code parameter
      let url = `${FUNCTION_APP_URL}/api/chat/clear`;
      if (FUNCTION_KEY) {
        url += `?code=${encodeURIComponent(FUNCTION_KEY)}`;
      }

      await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({ session_id: this.sessionId })
      });
    } catch (error) {
      console.error('Error clearing conversation context:', error);
    }
  }

  /**
   * Get conversation status from Function App
   */
  async getConversationStatus(): Promise<{
    sessionId: string;
    contextSize: number;
    maxContextMessages: number;
    maxContextTokens: number;
    hasSystemPrompt: boolean;
  } | null> {
    if (!FUNCTION_APP_URL) return null;

    try {
      const headers: HeadersInit = {};

      // Build URL with session_id and code parameters
      let url = `${FUNCTION_APP_URL}/api/chat/status?session_id=${encodeURIComponent(this.sessionId)}`;
      if (FUNCTION_KEY) {
        url += `&code=${encodeURIComponent(FUNCTION_KEY)}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Error getting conversation status:', error);
    }
    return null;
  }

  /**
   * Reset session (create new session ID and clear context)
   */
  async resetSession(): Promise<void> {
    await this.clearConversationContext();
    this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getFallbackResponse(userMessage: string): string {
    const message = userMessage.toLowerCase();
    
    // Check for asset-specific questions
    for (const [assetKey, templates] of Object.entries(ASSET_ADVICE_TEMPLATES)) {
      const asset = GAME_ASSETS.find(a => a.id === assetKey);
      if (asset && (message.includes(asset.gameName.toLowerCase()) || message.includes(assetKey))) {
        const advice = templates.neutral;
        return `${advice}\n\nReal world equivalent: ${asset.realWorld}`;
      }
    }
    
    // Fallback to general advice
    return GENERAL_RESPONSES[Math.floor(Math.random() * GENERAL_RESPONSES.length)];
  }

  async getGameResponse(userMessage: string, gameContext: {
    assets: any[];
    currentDay: number;
    stars: number;
    level: number;
    coins: number;
    performanceHistory?: {
      day: number;
      portfolioReturn: number;
      totalValue: number;
      assetReturns: Record<string, number>;
    }[];
  }): Promise<string> {
    
    // Build asset mappings dynamically from game-assets.ts
    const assetMappings = GAME_ASSETS.map(asset => 
      `- ${asset.shortName || asset.gameName} (${asset.gameName}) = ${asset.realWorld}`
    ).join('\n');
    
    // Build detailed portfolio context with allocations
    const portfolioDetails = gameContext.assets.length > 0 ? 
      gameContext.assets
        .filter(a => a.allocation > 0)
        .map(a => `${a.name}: ${a.allocation.toFixed(1)}%`)
        .join(', ') : 
      'No assets allocated yet';
    
    // Build performance history context (last 7 days)
    const performanceContext = gameContext.performanceHistory && gameContext.performanceHistory.length > 0 ? 
      {
        days_of_data: gameContext.performanceHistory.length,
        daily_returns: gameContext.performanceHistory.map(h => ({
          day: h.day,
          portfolio_return_pct: (h.portfolioReturn * 100).toFixed(2),
          total_value: h.totalValue
        })),
        total_period_return_pct: gameContext.performanceHistory.length > 1 ? 
          (((gameContext.performanceHistory[gameContext.performanceHistory.length - 1].totalValue / 
             gameContext.performanceHistory[0].totalValue) - 1) * 100).toFixed(2) : '0.00'
      } : null;
    
    // Create comprehensive system prompt
    const systemPrompt = `You are ${this.currentPersonality.name} in the fantasy investment game "Skyland Guardians". 

Base personality: ${this.currentPersonality.prompt}

Game Status:
- Day: ${gameContext.currentDay}
- Level: ${gameContext.level} 
- Current Coins: ${gameContext.coins}
- Stars: ${gameContext.stars}

Current Portfolio Allocation:
${portfolioDetails}

${performanceContext ? `Recent Performance (JSON format):
${JSON.stringify(performanceContext, null, 2)}` : 'No performance history available yet.'}

Asset Mappings (Game → Real World):
${assetMappings}

IMPORTANT GUIDELINES:
- Stay focused on investment education and portfolio guidance
- If asked about non-investment topics, gently redirect: "That's interesting, but as your investment guide, let me help you with your portfolio instead! How about we discuss..."
- For personal questions, respond warmly but redirect: "I appreciate you asking! As your financial mentor, I'm here to help with your investment journey. Speaking of which..."
- Never be harsh or dismissive - always maintain a helpful, encouraging tone
- Use gentle phrases like "While that's a great question, my specialty is helping with..." or "I'd love to focus on what I do best - guiding your investments!"
- Use simple Markdown formatting when helpful: **bold** for emphasis, *italics* for gentle emphasis, bullet points for lists
- Keep formatting minimal and readable

RESPONSE LENGTH REQUIREMENTS:
- MAXIMUM 100 words total
- Be concise and direct
- Focus on 1-2 key insights only
- Use short sentences
- Avoid long explanations or lists
- Get straight to the point

Provide investment advice keeping responses under 80 words. Use fantasy-themed language while giving real investment education based on the actual asset data above.

Always end with an appropriate emoji. Focus on education and risk management.`;

    try {
      const response = await this.callFunctionApp(userMessage, systemPrompt);
      return response;
    } catch (error) {
      console.error('AI Generation Error:', error);
      return this.getFallbackResponse(userMessage);
    }
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

  /**
   * Generate AI feedback for Apply button clicks (portfolio allocation changes)
   */
  async generateApplyFeedback(gameContext: {
    assets: any[];
    currentDay: number;
    stars: number;
    level: number;
    coins: number;
    performanceHistory?: any[];
  }): Promise<string> {
    try {
      const response = await this.getGameResponse(
        `Applied! Rate my allocation. 50 words max.`,
        gameContext
      );
      return response;
    } catch (error) {
      console.error('AI Apply Feedback Error:', error);
      // Simple fallback response
      return `Portfolio allocation applied! Your investment choices will guide your journey through the Skyland realms. Keep learning and adjusting your strategy as you grow! 🎯✨`;
    }
  }

  /**
   * Generate AI feedback for Next Day operations (market settlement)
   */
  async generateNextDayFeedback(gameContext: {
    assets: any[];
    currentDay: number;
    stars: number;
    level: number;
    coins: number;
    performanceHistory?: any[];
    settlementResult?: {
      portfolioReturn: number;
      delta: number;
      perAsset: any[];
    };
  }): Promise<string> {
    const { settlementResult } = gameContext;
    
    if (!settlementResult) {
      return "Another day passes in the Skyland Guardians realm! Let's see how your investments are performing... 🌅";
    }

    const portfolioReturn = settlementResult.portfolioReturn;
    const coinChange = settlementResult.delta;
    const returnPercent = (portfolioReturn * 100).toFixed(2);
    const isPositive = portfolioReturn >= 0;

    try {
      const userMessage = `Day ended. ${isPositive ? 'Gained' : 'Lost'} ${Math.abs(parseFloat(returnPercent))}%. Quick insight. 30 words max.`;
      
      const response = await this.getGameResponse(userMessage, gameContext);
      return response;
    } catch (error) {
      console.error('AI Next Day Feedback Error:', error);
      // Fallback response based on performance
      if (isPositive) {
        return `Excellent work, guardian! Your portfolio gained ${returnPercent}% today (+${coinChange} coins). Remember, consistency beats timing the market. 🎆⭐`;
      } else {
        return `Today brought some challenges with a ${Math.abs(parseFloat(returnPercent))}% portfolio decline (${coinChange} coins). Don't worry - market volatility is normal! Your diversified approach will help weather these storms. Stay the course! 🌩️🛡️`;
      }
    }
  }
}

// Export singleton instance
export const gamifiedAIService = new GamifiedAIService();