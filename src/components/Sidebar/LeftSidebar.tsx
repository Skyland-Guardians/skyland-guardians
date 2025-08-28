import { useGameState } from '../../hooks/useGameContext';

export function LeftSidebar() {
  const { setCardCollectionOpen, setBadgesOpen } = useGameState();
  return (
    <>
      <div className="left-action-group">
        {/* MY CARDS Button */}
        <button
          className="left-action-btn"
          onClick={() => setCardCollectionOpen(true)}
          aria-label="Open my cards"
        >
          <div className="left-action-content">
            <img
              src="./assets/main-screen-1-assets/card-main-icon.png"
              alt="Cards"
              className="left-action-icon card-icon"
            />
            <span className="left-action-label">MY CARDS</span>
          </div>
        </button>

        {/* BADGES Button */}
        <button
          className="left-action-btn"
          onClick={() => setBadgesOpen && setBadgesOpen(true)}
          aria-label="Open badges"
        >
          <div className="left-action-content">
            <img
              src="./assets/main-screen-1-assets/badge-main-icon.png"
              alt="Badge"
              className="left-action-icon badge-icon"
            />
            <span className="left-action-label">BADGES</span>
          </div>
        </button>
      </div>
      {/* BADGES is now rendered globally inside MainScreen's content area */}
    </>
  );
}