// Gamified AI Service - Game-themed responses with real asset integration

import OpenAI from 'openai';
import type { ChatMessage } from '../types/game';
import type { AIPersonality } from '../data/ai-personalities';
import { AI_PERSONALITIES, DEFAULT_AI_PERSONALITY } from '../data/ai-personalities';
import { GAME_ASSETS } from '../data/game-assets';

// OpenAI Configuration
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// Initialize OpenAI client
const openai = OPENAI_API_KEY ? new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Required for browser usage
}) : null;

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
  private conversationHistory: Array<{ role: string, content: string }> = [];

  initialize(_gameState: any, _assetAllocations: any[], _coins: number): void {
    // Store for potential future use
    // Currently not used but may be needed for enhanced features
  }

  setPersonality(personalityId: string): void {
    const personality = AI_PERSONALITIES.find(p => p.id === personalityId);
    this.currentPersonality = personality || DEFAULT_AI_PERSONALITY;
    // Clear conversation history when changing personality
    this.conversationHistory = [];
  }

  /**
   * Call OpenAI API with conversation context
   */
  private async callOpenAI(messages: { role: string, content: string }[]): Promise<string> {
    if (!openai) {
      throw new Error('OpenAI API key not configured. Please set VITE_OPENAI_API_KEY in your .env.local file');
    }

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
        max_tokens: 150,
        temperature: 0.8,
      });

      return completion.choices[0]?.message?.content || 'Sorry, I cannot respond right now.';
    } catch (error) {
      console.error('OpenAI API Error:', error);
      if (error instanceof Error && error.message.includes('401')) {
        throw new Error('OpenAI API key is invalid. Please check your VITE_OPENAI_API_KEY in .env.local');
      }
      throw new Error('AI service temporarily unavailable, please try again later');
    }
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
  }): Promise<string> {
    
    // Build context for AI
    const gameContextStr = `Game Day: ${gameContext.currentDay}, Level: ${gameContext.level}, Coins: ${gameContext.coins}`;
    const assetContextStr = gameContext.assets.length > 0 ? 
      `Current assets: ${gameContext.assets.map(a => a.type || 'unknown').join(', ')}` : 
      'No assets allocated yet';
    
    // Create system prompt
    const systemPrompt = `You are ${this.currentPersonality.name} in the fantasy investment game "Skyland Guardians". 

Base personality: ${this.currentPersonality.prompt}

Game Context: ${gameContextStr}
Portfolio: ${assetContextStr}

Provide investment advice keeping responses under 100 words. Use fantasy-themed language while giving real investment education. Map game assets to real investments:
- Sword (Agile Sword) = Tech ETFs/Stocks
- Crystal (Mystic Crystal) = Cryptocurrency  
- Magic (Stellar Wand) = Innovation/Small-cap investments
- Shield (Sturdy Shield) = Bonds/Stable investments

Always end with an appropriate emoji. Focus on education and risk management.`;

    try {
      // Add the user message to conversation history
      this.conversationHistory.push({ role: 'user', content: userMessage });
      
      // Create conversation messages with context and history
      const messages = [
        { role: 'system', content: systemPrompt },
        ...this.conversationHistory.slice(-10), // Keep last 10 messages for context
      ];

      const response = await this.callOpenAI(messages);
      
      // Add AI response to conversation history
      this.conversationHistory.push({ role: 'assistant', content: response });
      
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
}

// Export singleton instance
export const gamifiedAIService = new GamifiedAIService();