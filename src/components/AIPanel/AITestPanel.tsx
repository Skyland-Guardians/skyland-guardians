import React, { useState } from 'react';
import { AIService } from '../../services/ai-service';
import { GAME_ASSETS, type GameAsset } from '../../data/game-assets';

const AI_TEST_QUESTIONS = [
  "What is portfolio diversification?",
  "Should I invest in stocks or bonds?",
  "What are ETFs?",
  "How do I manage investment risk?",
  "What's the difference between savings and investing?",
  "How much should I invest as a teenager?"
];

export const AITestPanel: React.FC = () => {
  const [responses, setResponses] = useState<Array<{ question: string; answer: string; personality: string }>>([]);
  const [customQuestion, setCustomQuestion] = useState('');
  const [selectedPersonality, setSelectedPersonality] = useState<'wise_owl' | 'smart_fox' | 'calm_panda'>('wise_owl');
  const [isLoading, setIsLoading] = useState(false);

  const aiService = new AIService();

  const handleTestQuestion = async (question: string) => {
    setIsLoading(true);
    try {
      const response = await aiService.getResponse(question);
      setResponses(prev => [...prev, { 
        question, 
        answer: response, 
        personality: selectedPersonality 
      }]);
    } catch (error) {
      console.error('Error testing AI response:', error);
      setResponses(prev => [...prev, { 
        question, 
        answer: 'Error generating response', 
        personality: selectedPersonality 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomQuestion = async () => {
    if (!customQuestion.trim()) return;
    await handleTestQuestion(customQuestion);
    setCustomQuestion('');
  };

  const testAllocationAnalysis = async () => {
    setIsLoading(true);
    try {
      // Use existing game assets for testing
      const mockAssets = Object.values(GAME_ASSETS).slice(0, 4).map((asset, index) => ({
        id: asset.id,
        name: asset.gameName,
        shortName: asset.shortName,
        icon: asset.icon || '',
        type: 'sword' as const,
        theme: asset.loreName,
        allocation: [0.4, 0.3, 0.2, 0.1][index] || 0
      }));
      
      const analysis = aiService.analyzeAllocation(mockAssets);
      setResponses(prev => [...prev, {
        question: 'Portfolio Allocation Analysis (mock data)',
        answer: analysis,
        personality: selectedPersonality
      }]);
    } catch (error) {
      console.error('Error testing allocation analysis:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const testEventFeedback = async () => {
    setIsLoading(true);
    try {
      // Use first asset from GAME_ASSETS for testing
      const testAsset = Object.values(GAME_ASSETS)[0] as GameAsset;
      
      const feedback = aiService.generateEventFeedback(
        `Market volatility affected ${testAsset.gameName}`,
        -0.05 // 5% loss
      );
      
      setResponses(prev => [...prev, {
        question: `Event Feedback for ${testAsset.gameName} (negative event)`,
        answer: feedback,
        personality: selectedPersonality
      }]);
    } catch (error) {
      console.error('Error testing event feedback:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResponses = () => {
    setResponses([]);
  };

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '20px auto', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2>AI Test Panel</h2>
      
      {/* Personality Selector */}
      <div style={{ marginBottom: '20px' }}>
        <label>AI Personality: </label>
        <select 
          value={selectedPersonality} 
          onChange={(e) => setSelectedPersonality(e.target.value as any)}
          style={{ marginLeft: '10px', padding: '5px' }}
        >
          <option value="wise_owl">Wise Owl</option>
          <option value="smart_fox">Smart Fox</option>
          <option value="calm_panda">Calm Panda</option>
        </select>
      </div>

      {/* Preset Test Questions */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Preset Questions</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {AI_TEST_QUESTIONS.map((question, index) => (
            <button
              key={index}
              onClick={() => handleTestQuestion(question)}
              disabled={isLoading}
              style={{
                padding: '8px 12px',
                backgroundColor: '#007acc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Question */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Custom Question</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            placeholder="Enter your question..."
            style={{ 
              flex: 1, 
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleCustomQuestion()}
          />
          <button
            onClick={handleCustomQuestion}
            disabled={isLoading || !customQuestion.trim()}
            style={{
              padding: '8px 16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Ask
          </button>
        </div>
      </div>

      {/* Advanced Tests */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Advanced Tests</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={testAllocationAnalysis}
            disabled={isLoading}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ffc107',
              color: 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Test Allocation Analysis
          </button>
          <button
            onClick={testEventFeedback}
            disabled={isLoading}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Test Event Feedback
          </button>
        </div>
      </div>

      {/* Clear Button */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={clearResponses}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Clear All Responses
        </button>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div style={{ 
          textAlign: 'center', 
          margin: '20px 0',
          color: '#007acc',
          fontSize: '16px'
        }}>
          Generating response...
        </div>
      )}

      {/* Responses Display */}
      <div>
        <h3>Responses ({responses.length})</h3>
        {responses.map((item, index) => (
          <div 
            key={index}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '15px',
              backgroundColor: '#f9f9f9'
            }}
          >
            <div style={{ 
              fontSize: '12px', 
              color: '#666',
              marginBottom: '5px'
            }}>
              Personality: {item.personality.replace('_', ' ').toUpperCase()}
            </div>
            <div style={{ 
              fontWeight: 'bold',
              marginBottom: '10px',
              color: '#333'
            }}>
              Q: {item.question}
            </div>
            <div style={{ 
              lineHeight: '1.5',
              color: '#555'
            }}>
              A: {item.answer}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};