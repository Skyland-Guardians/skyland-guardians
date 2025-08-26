import React from 'react';
import { Button } from './ui/button';
import { GameItem } from './GameItem';
import BottomSectionIcon from './icons/BottomSectionIcon';
import { type GameItem as GameItemType } from './fantasyDashboardMockData';

interface GameItemsSectionProps {
  gameItems: GameItemType[];
  selectedItems: string[];
  onItemSelect: (itemId: string) => void;
  onApply: () => void;
}

export const GameItemsSection: React.FC<GameItemsSectionProps> = ({
  gameItems,
  selectedItems,
  onItemSelect,
  onApply
}) => {
  // SVG coordinates for each box (x, y, width, height) based on the SVG viewBox="0 0 988 136"
  const itemPositions = [
    // Left side items
    { left: '15px', top: '32px', width: '85px', height: '72px' }, // First left box
    { left: '108px', top: '27px', width: '85px', height: '82px' }, // Second left box  
    { left: '201px', top: '27px', width: '85px', height: '82px' }, // Third left box
    { left: '294px', top: '21px', width: '85px', height: '94px' }, // Fourth left box
    // Right side items  
    { left: '608px', top: '24px', width: '85px', height: '88px' }, // First right box
    { left: '701px', top: '30px', width: '85px', height: '76px' }, // Second right box
    { left: '794px', top: '30px', width: '85px', height: '76px' }, // Third right box
    { left: '887px', top: '24px', width: '85px', height: '88px' }, // Fourth right box
  ];

  return (
    <div className="relative w-full max-w-[988px] mx-auto">
      {/* Background SVG */}
      <div className="w-full">
        <BottomSectionIcon width="100%" height="136" color="#5196DC" />
      </div>
      
      {/* Game Items positioned absolutely to match SVG boxes */}
      <div className="absolute inset-0">
        {gameItems.map((item: GameItemType, index) => {
          const position = itemPositions[index];
          if (!position) return null;
          
          return (
            <div 
              key={item.id}
              className="absolute flex items-center justify-center"
              style={{
                left: position.left,
                top: position.top,
                width: position.width,
                height: position.height,
              }}
            >
              <GameItem
                id={item.id}
                name={item.name}
                image={item.image}
                label={item.label}
                isSelected={selectedItems.includes(item.id)}
                onClick={onItemSelect}
                compact={true}
              />
            </div>
          );
        })}

        {/* Apply Button - positioned in the center area */}
        <div 
          className="absolute flex items-center justify-center"
          style={{
            left: '389px', // Center area x position from SVG
            top: '27px',   // Center area y position from SVG
            width: '197px', // Center area width from SVG
            height: '82px'  // Center area height from SVG
          }}
        >
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-['Koulen'] text-xl font-bold px-4 py-2 rounded-lg shadow-lg"
            onClick={onApply}
          >
            APPLY
          </Button>
        </div>
      </div>
    </div>
  );
};