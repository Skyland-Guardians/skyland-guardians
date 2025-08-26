import React, { useState } from 'react';
import { Button } from './ui/button';
import { UserProfile } from './UserProfile';
import { ProgressTracker } from './ProgressTracker';
import { GameItem } from './GameItem';
import { SidebarSection } from './SidebarSection';
import { CharacterMessage } from './CharacterMessage';
import BottomSectionIcon from './icons/BottomSectionIcon';
import {
  mockUserProfile,
  mockProgressData,
  mockGameItems,
  mockCharacterMessage,
  mockSidebarData,
  type GameItem as GameItemType
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
          className="max-w-none h-full object-cover opacity-90"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-start p-8">
          <div className="flex flex-col gap-4">
            <UserProfile 
              name={mockUserProfile.name}
              level={mockUserProfile.level}
              avatar={mockUserProfile.avatar}
            />
            <div className="text-fantasy-navy font-['Koulen'] text-xl font-normal uppercase">
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
            icon="/images/card-deck.png" // Using same icon for badges for now
            label={mockSidebarData.badgesLabel}
            onClick={() => handleSidebarAction('badges')}
          />
        </div>

        {/* Character Message */}
        <div className="absolute right-8 top-1/2 -translate-y-1/4">
          <CharacterMessage 
            avatar={mockCharacterMessage.avatar}
            message={mockCharacterMessage.message}
          />
        </div>

        {/* Bottom Game Items Section */}
        <div className="mt-auto relative">
          <div className="relative">
            <BottomSectionIcon width="100%" height="136" color="#4A90E2" />
            
            {/* Game Items Grid */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center gap-6 px-8">
                {/* Left side items */}
                <div className="flex gap-4">
                  {mockGameItems.slice(0, 4).map((item: GameItemType) => (
                    <GameItem
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      image={item.image}
                      label={item.label}
                      isSelected={selectedItems.includes(item.id)}
                      onClick={handleItemSelect}
                    />
                  ))}
                </div>

                {/* Apply Button */}
                <Button
                  size="lg"
                  className="mx-8 bg-fantasy-blue hover:bg-fantasy-blue/90 text-white font-['Koulen'] text-3xl font-normal px-8 py-4 rounded-lg shadow-lg"
                  onClick={handleApply}
                  disabled={selectedItems.length === 0}
                >
                  APPLY
                </Button>

                {/* Right side items */}
                <div className="flex gap-4">
                  {mockGameItems.slice(4, 8).map((item: GameItemType) => (
                    <GameItem
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      image={item.image}
                      label={item.label}
                      isSelected={selectedItems.includes(item.id)}
                      onClick={handleItemSelect}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};