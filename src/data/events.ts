import type { EventCard } from '../types/game';

export interface EventConfig {
  id: string;
  title: string;
  description: string;
  dayIndex?: number; // Optional: specific day when event typically occurs
  targets: string[];
  effect: { type: 'mul' | 'add' | 'volatility', value: number };
  duration: number;
  category: 'market_crash' | 'policy' | 'economic' | 'technology' | 'geopolitical';
}

// Event configurations with all logic
export const EVENT_CONFIGS: EventConfig[] = [
  {
    id: 'ev-crash-1',
    title: 'Tech Market Crash',
    description: 'Major sell-off in tech & crypto due to sudden news.',
    dayIndex: 5,
    targets: ['sword', 'crystal', 'yield'],
    effect: { type: 'mul', value: 0.5 }, // multiply base return by 0.5 (make negative deeper)
    duration: 1,
    category: 'market_crash'
  },
  {
    id: 'ev-intervene-1',
    title: 'Government Intervention',
    description: 'Policy support introduced, markets rebound sharply.',
    dayIndex: 6,
    targets: ['sword', 'crystal'],
    effect: { type: 'add', value: 0.25 }, // add +25% (big rebound)
    duration: 2,
    category: 'policy'
  },
  {
    id: 'ev-storm-10',
    title: 'Global Economic Mist',
    description: 'Global risk-off sentiment reduces returns across the board.',
    dayIndex: 10,
    targets: ['all'],
    effect: { type: 'add', value: -0.05 },
    duration: 2,
    category: 'economic'
  },
  {
    id: 'ev-ai-boom',
    title: 'AI Revolution Surge',
    description: 'Breakthrough in AI technology drives tech stocks higher.',
    targets: ['sword', 'crystal'],
    effect: { type: 'add', value: 0.15 },
    duration: 3,
    category: 'technology'
  },
  {
    id: 'ev-safe-flight',
    title: 'Flight to Safety',
    description: 'Investors flee to safe haven assets amid uncertainty.',
    targets: ['golden', 'shield'],
    effect: { type: 'add', value: 0.08 },
    duration: 2,
    category: 'market_crash'
  },
  {
    id: 'ev-green-wave',
    title: 'Green Investment Wave',
    description: 'Climate summit sparks massive ESG investment flows.',
    targets: ['forest'],
    effect: { type: 'add', value: 0.12 },
    duration: 2,
    category: 'policy'
  }
];

// Legacy export for backward compatibility
export const SAMPLE_EVENTS = EVENT_CONFIGS;

// Event utility functions
export class EventManager {
  static createEvent(eventId: string): EventCard | null {
    const config = EVENT_CONFIGS.find(c => c.id === eventId);
    if (!config) return null;

    // Generate a numeric ID from string ID
    const numericId = parseInt(config.id.replace(/\D/g, '')) || Math.floor(Math.random() * 10000);

    return {
      id: numericId,
      title: config.title,
      description: config.description,
      status: 'pending',
      duration: config.duration,
      effects: {
        type: config.effect.type as 'add' | 'mul' | 'volatility',
        value: config.effect.value,
        targets: config.targets
      }
    };
  }

  static getRandomEvent(): EventConfig {
    return EVENT_CONFIGS[Math.floor(Math.random() * EVENT_CONFIGS.length)];
  }

  static getEventsByCategory(category: string): EventConfig[] {
    return EVENT_CONFIGS.filter(e => e.category === category);
  }

  static getAllConfigs(): EventConfig[] {
    return EVENT_CONFIGS;
  }

  static getConfig(eventId: string): EventConfig | undefined {
    return EVENT_CONFIGS.find(c => c.id === eventId);
  }

  static applyEventEffect(
    baseReturn: number, 
    eventEffect: { type: 'mul' | 'add' | 'volatility', value: number }
  ): number {
    switch (eventEffect.type) {
      case 'mul':
        return baseReturn * eventEffect.value;
      case 'add':
        return baseReturn + eventEffect.value;
      case 'volatility': {
        // Increase volatility by adding random variation
        const randomFactor = (Math.random() - 0.5) * eventEffect.value;
        return baseReturn + randomFactor;
      }
      default:
        return baseReturn;
    }
  }
}
