import React from 'react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

interface GameItemProps {
  id: string;
  name: string;
  image: string;
  label: string;
  isSelected?: boolean;
  onClick?: (id: string) => void;
}

export const GameItem: React.FC<GameItemProps> = ({ 
  id, 
  name, 
  image, 
  label, 
  isSelected = false, 
  onClick 
}) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "w-20 h-20 rounded-lg p-2 border-2 transition-all duration-200",
          isSelected 
            ? "border-fantasy-orange bg-fantasy-cream shadow-lg scale-105" 
            : "border-transparent hover:border-fantasy-blue hover:bg-fantasy-cream/50"
        )}
        onClick={() => onClick?.(id)}
      >
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-contain"
        />
      </Button>
      <div className="bg-fantasy-dark text-white px-2 py-1 rounded text-xs font-['Koulen'] font-normal uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
};