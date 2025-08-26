export function LeftSidebar() {
  return (
    <aside className="w-36 p-4 flex flex-col gap-6">
      {/* MY CARDS Button */}
      <button className="bg-blue-900 hover:bg-blue-800 text-white p-4 rounded-lg transition-colors duration-200 relative overflow-hidden group">
        <div className="flex flex-col items-center gap-2">
          <img 
            src="/src/assets/主界面1资源/卡牌主界面icon.png" 
            alt="Cards"
            className="w-8 h-8"
          />
          <span className="text-xs font-bold uppercase tracking-wide">
            MY CARDS
          </span>
        </div>
        {/* Yellow accent decoration */}
        <div className="absolute top-2 right-2 w-3 h-3 bg-yellow-400 rounded-full"></div>
      </button>

      {/* BADGES Button */}
      <button className="relative group">
        <div className="w-24 h-24 mx-auto relative">
          {/* Circular badge background */}
          <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center border-4 border-yellow-400 hover:border-yellow-300 transition-colors duration-200">
            <img 
              src="/src/assets/主界面1资源/奖杯.png" 
              alt="Trophy"
              className="w-8 h-8"
            />
          </div>
          
          {/* Circular text around badge */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <defs>
                <path
                  id="circle"
                  d="M 50 50 m -20 0 a 20 20 0 1 1 40 0 a 20 20 0 1 1 -40 0"
                />
              </defs>
              <text className="fill-yellow-400 text-[6px] font-bold uppercase">
                <textPath href="#circle" startOffset="0%">
                  DIVERSIFICATION • MASTER
                </textPath>
              </text>
            </svg>
          </div>
        </div>
        
        <span className="block text-xs font-bold text-blue-900 text-center mt-2 uppercase">
          BADGES
        </span>
      </button>
    </aside>
  );
}