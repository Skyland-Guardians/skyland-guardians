import { useState, useCallback } from 'react';
import { AI_PERSONALITIES } from '../data/ai-personalities';
import { gamifiedAIService } from '../services/gamified-ai-service';

// Create a global state manager for AI personality
let globalPersonality = AI_PERSONALITIES[0];
let globalSetters: ((personality: any) => void)[] = [];

export function useAIPersonality() {
  const [currentPersonality, setCurrentPersonality] = useState(globalPersonality);

  // Register this setter
  useState(() => {
    globalSetters.push(setCurrentPersonality);
    return () => {
      globalSetters = globalSetters.filter(setter => setter !== setCurrentPersonality);
    };
  });

  const changePersonality = useCallback((personalityId: string, addMessage?: any) => {
    const personality = AI_PERSONALITIES.find(p => p.id === personalityId);
    if (personality) {
      globalPersonality = personality;
      gamifiedAIService.setPersonality(personalityId);
      
      // Update all components using this hook
      globalSetters.forEach(setter => setter(personality));
      
      // Add personality switch message if addMessage is provided
      if (addMessage) {
        addMessage({
          id: `personality-${Date.now()}`,
          sender: 'ai',
          content: `Hi! I'm ${personality.name}, your new AI investment companion! What investment questions would you like to explore?`,
          timestamp: new Date(),
          type: 'greeting'
        });
      }
      
      return personality;
    }
    return null;
  }, []);

  return {
    currentPersonality,
    changePersonality
  };
}