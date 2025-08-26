import React, { useState } from 'react';
import { UserProfile } from './UserProfile';
import { ProgressTracker } from './ProgressTracker';
import { SidebarSection } from './SidebarSection';
import { CharacterMessage } from './CharacterMessage';
import { GameItemsSection } from './GameItemsSection';
import {
  mockUserProfile,
  mockProgressData,
  mockGameItems,
  mockCharacterMessage,
  mockSidebarData
} from './fantasyDashboardMockData';

export const FantasyDashboard: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleItemSelect = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleApply = () => {
    if (selectedItems.length > 0) {
      console.log('Applying selected items:', selectedItems);
      // Here you would typically handle the apply action
      alert(`Applied ${selectedItems.length} item(s): ${selectedItems.join(', ')}`);
    }
  };

  const handleSidebarAction = (action: string) => {
    console.log(`${action} clicked`);
    // Handle sidebar actions (cards, badges)
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Cityscape */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img 
          src="/images/fantasy-cityscape.png" 
          alt="Fantasy cityscape"
          className="w-4/5 h-4/5 object-contain opacity-90"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-start p-8">
          <div className="flex items-center gap-2">
            <UserProfile 
              name={mockUserProfile.name}
              level={mockUserProfile.level}
              avatar={mockUserProfile.avatar}
            />
            <div className="text-foreground font-['Koulen'] text-lg font-bold uppercase leading-none">
              {mockUserProfile.name}, guard your fortune！
            </div>
          </div>
          
          <ProgressTracker 
            day={mockProgressData.day}
            stars={mockProgressData.stars}
          />
        </header>

        {/* Sidebar */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col gap-8">
          <SidebarSection 
            icon={mockSidebarData.cardDeck}
            label={mockSidebarData.cardsLabel}
            onClick={() => handleSidebarAction('cards')}
          />
          <SidebarSection 
            icon={mockSidebarData.badgeIcon || "/images/card-deck.png"}
            label={mockSidebarData.badgesLabel}
            onClick={() => handleSidebarAction('badges')}
          />
        </div>

        {/* Character Message - narrow and attached to right side */}
        <div className="fixed right-4 top-1/2 -translate-y-1/2 z-20">
          <CharacterMessage 
            avatar={mockCharacterMessage.avatar}
            message={mockCharacterMessage.message}
          />
        </div>

        {/* Bottom Game Items Section */}
        <div className="mt-auto">
          <GameItemsSection
            gameItems={mockGameItems}
            selectedItems={selectedItems}
            onItemSelect={handleItemSelect}
            onApply={handleApply}
          />
        </div>
      </div>
    </div>
  );
};