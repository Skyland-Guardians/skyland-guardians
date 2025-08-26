import React from 'react';
import { Button } from './ui/button';

interface SidebarSectionProps {
  icon: string;
  label: string;
  onClick?: () => void;
}

export const SidebarSection: React.FC<SidebarSectionProps> = ({ icon, label, onClick }) => {
  return (
    <Button
      variant="ghost"
      className="flex flex-col items-center gap-2 h-auto p-4 hover:bg-fantasy-cream/30 transition-colors"
      onClick={onClick}
    >
      <div className="w-16 h-16 flex items-center justify-center">
        <img 
          src={icon} 
          alt={label}
          className="w-full h-full object-contain"
        />
      </div>
      <span className="text-fantasy-navy font-['Koulen'] text-xl font-normal uppercase">
        {label}
      </span>
    </Button>
  );
};