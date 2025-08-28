import { describe, it, expect } from 'vitest';
import { EventManager, EVENT_CONFIGS } from '../data/events';
import type { EventCard, GameState } from '../types/game';

describe('Event System Tests', () => {
  describe('EventManager', () => {
    it('should create an event from config', () => {
      const event = EventManager.createEvent('ev-crash-1');
      
      expect(event).toBeDefined();
      expect(event?.title).toBe('Tech Market Crash');
      expect(event?.status).toBe('pending');
      expect(event?.duration).toBe(1);
      expect(event?.effects?.type).toBe('mul');
      expect(event?.effects?.value).toBe(0.5);
      expect(event?.effects?.targets).toContain('sword');
    });

    it('should return null for invalid event ID', () => {
      const event = EventManager.createEvent('invalid-event');
      expect(event).toBeNull();
    });

    it('should get random event config', () => {
      const randomEvent = EventManager.getRandomEvent();
      expect(randomEvent).toBeDefined();
      expect(randomEvent.id).toBeTruthy();
      expect(randomEvent.title).toBeTruthy();
      expect(randomEvent.effect).toBeDefined();
    });

    it('should get all event configs', () => {
      const configs = EventManager.getAllConfigs();
      expect(configs).toBeDefined();
      expect(configs.length).toBeGreaterThan(0);
      expect(configs[0]).toHaveProperty('id');
      expect(configs[0]).toHaveProperty('title');
      expect(configs[0]).toHaveProperty('effect');
    });

    it('should get events by category', () => {
      const crashEvents = EventManager.getEventsByCategory('market_crash');
      expect(crashEvents.length).toBeGreaterThan(0);
      crashEvents.forEach(event => {
        expect(event.category).toBe('market_crash');
      });
    });
  });

  describe('Event Effect Logic', () => {
    describe('Multiplicative Effects', () => {
      it('should apply multiplicative effect correctly', () => {
        const baseReturn = 0.1; // 10% return
        const effect = { type: 'mul' as const, value: 0.5 }; // 50% multiplier
        
        const result = EventManager.applyEventEffect(baseReturn, effect);
        expect(result).toBe(0.05); // 10% * 0.5 = 5%
      });

      it('should handle negative returns with multiplicative effect', () => {
        const baseReturn = -0.1; // -10% return
        const effect = { type: 'mul' as const, value: 2 }; // 2x multiplier
        
        const result = EventManager.applyEventEffect(baseReturn, effect);
        expect(result).toBe(-0.2); // -10% * 2 = -20%
      });
    });

    describe('Additive Effects', () => {
      it('should apply additive effect correctly', () => {
        const baseReturn = 0.1; // 10% return
        const effect = { type: 'add' as const, value: 0.05 }; // +5% addition
        
        const result = EventManager.applyEventEffect(baseReturn, effect);
        expect(result).toBeCloseTo(0.15, 10); // 10% + 5% = 15%
      });

      it('should handle negative additive effects', () => {
        const baseReturn = 0.1; // 10% return
        const effect = { type: 'add' as const, value: -0.03 }; // -3% addition
        
        const result = EventManager.applyEventEffect(baseReturn, effect);
        expect(result).toBe(0.07); // 10% - 3% = 7%
      });
    });

    describe('Volatility Effects', () => {
      it('should apply volatility effect with random variation', () => {
        const baseReturn = 0.1; // 10% return
        const effect = { type: 'volatility' as const, value: 0.02 }; // ±2% volatility
        
        // Run multiple times to test randomness
        const results = [];
        for (let i = 0; i < 100; i++) {
          const result = EventManager.applyEventEffect(baseReturn, effect);
          results.push(result);
        }
        
        // Check that results vary (not all the same)
        const uniqueResults = [...new Set(results)];
        expect(uniqueResults.length).toBeGreaterThan(1);
        
        // Check that all results are within expected range
        results.forEach(result => {
          expect(result).toBeGreaterThanOrEqual(0.09); // 10% - 1% (half of 2%)
          expect(result).toBeLessThanOrEqual(0.11); // 10% + 1% (half of 2%)
        });
      });
    });
  });

  describe('Event Configuration Validation', () => {
    it('should have valid configuration for all events', () => {
      EVENT_CONFIGS.forEach(config => {
        expect(config.id).toBeTruthy();
        expect(config.title).toBeTruthy();
        expect(config.description).toBeTruthy();
        expect(config.targets).toBeInstanceOf(Array);
        expect(config.targets.length).toBeGreaterThan(0);
        expect(config.effect).toBeDefined();
        expect(['mul', 'add', 'volatility']).toContain(config.effect.type);
        expect(typeof config.effect.value).toBe('number');
        expect(config.duration).toBeGreaterThan(0);
        expect(config.category).toBeTruthy();
      });
    });

    it('should have unique event IDs', () => {
      const ids = EVENT_CONFIGS.map(config => config.id);
      const uniqueIds = [...new Set(ids)];
      expect(ids.length).toBe(uniqueIds.length);
    });

    it('should have valid categories', () => {
      const validCategories = ['market_crash', 'policy', 'economic', 'technology', 'geopolitical'];
      EVENT_CONFIGS.forEach(config => {
        expect(validCategories).toContain(config.category);
      });
    });

    it('should have valid target assets', () => {
      const validAssets = ['sword', 'crystal', 'forest', 'golden', 'shield', 'fountain', 'yield', 'magic', 'all'];
      EVENT_CONFIGS.forEach(config => {
        config.targets.forEach(target => {
          expect(validAssets).toContain(target);
        });
      });
    });
  });

  describe('Event Creation Edge Cases', () => {
    it('should handle numeric ID conversion for events', () => {
      const event1 = EventManager.createEvent('ev-crash-1');
      const event2 = EventManager.createEvent('ev-ai-boom');
      
      expect(event1?.id).toBeTypeOf('number');
      expect(event2?.id).toBeTypeOf('number');
      expect(event1?.id).not.toBe(event2?.id);
    });

    it('should create events with correct effects structure', () => {
      const event = EventManager.createEvent('ev-intervene-1');
      
      expect(event?.effects).toBeDefined();
      expect(event?.effects?.type).toBe('add');
      expect(event?.effects?.value).toBe(0.25);
      expect(event?.effects?.targets).toContain('sword');
      expect(event?.effects?.targets).toContain('crystal');
    });
  });
});