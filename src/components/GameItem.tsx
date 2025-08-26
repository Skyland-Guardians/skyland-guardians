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
  compact?: boolean;
}

export const GameItem: React.FC<GameItemProps> = ({ 
  id, 
  name, 
  image, 
  label, 
  isSelected = false, 
  onClick,
  compact = false
}) => {
  const buttonSize = compact ? "w-16 h-16" : "w-20 h-20";
  const labelSize = compact ? "text-xs px-1 py-0.5" : "text-xs px-2 py-1";
  
  return (
    <div className="flex flex-col items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          `${buttonSize} rounded-lg p-1 border-2 transition-all duration-200`,
          isSelected 
            ? "border-accent bg-secondary shadow-lg scale-105" 
            : "border-transparent hover:border-primary hover:bg-secondary/50"
        )}
        onClick={() => onClick?.(id)}
      >
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-contain"
        />
      </Button>
      <div className={cn(
        "bg-slate-800 text-white rounded font-['Koulen'] font-normal uppercase tracking-wide",
        labelSize
      )}>
        {label}
      </div>
    </div>
  );
};