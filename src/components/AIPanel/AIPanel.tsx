import { useGameState } from '../../hooks/useGameState';

export function AIPanel() {
  const { currentAIMessage } = useGameState();

  return (
    <aside className="w-72 p-4 flex flex-col items-end">
      {/* AI Character */}
      <div className="relative mb-4">
        <img 
          src="/src/assets/主界面1资源/右边的AI人物.png"
          alt="AI Companion"
          className="w-24 h-24 object-contain animate-pulse"
          style={{ animationDuration: '2s' }}
        />
        
        {/* Floating animation effect */}
        <div 
          className="absolute inset-0 w-24 h-24 rounded-full bg-gradient-to-r from-orange-200 to-orange-300 opacity-20 blur-lg animate-pulse"
          style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}
        ></div>
      </div>

      {/* Chat Bubble */}
      {currentAIMessage && (
        <div className="relative max-w-64">
          {/* Speech bubble tail pointing to AI character */}
          <div className="absolute -top-3 left-8 w-6 h-6 bg-blue-100 rotate-45 border-l border-t border-blue-200"></div>
          
          {/* Main chat bubble */}
          <div className="bg-blue-100 border border-blue-200 rounded-2xl p-4 shadow-lg">
            <p className="text-sm font-medium text-blue-900 leading-relaxed">
              {currentAIMessage.content}
            </p>
            
            {/* Message timestamp */}
            <div className="mt-2 text-xs text-blue-600 opacity-75">
              {currentAIMessage.timestamp.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>

          {/* Typing indicator animation (when AI is "thinking") */}
          <div className="mt-2 flex justify-center opacity-60">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-100"></div>
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        </div>
      )}

      {/* AI status indicator */}
      <div className="mt-4 flex items-center gap-2 text-xs text-blue-600">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="font-medium">AI Guardian Online</span>
      </div>
    </aside>
  );
}