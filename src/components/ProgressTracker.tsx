import React from 'react';
import StarIcon from './icons/StarIcon';

interface ProgressTrackerProps {
  day: number;
  stars: number;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ day, stars }) => {
  return (
    <div className="flex items-center gap-6">
      <div className="text-foreground font-['Koulen'] text-4xl font-bold uppercase">
        Day {day}
      </div>
      <div className="flex items-center gap-2 bg-primary rounded-lg px-4 py-2">
        <StarIcon width={32} height={32} color="#ffe3ab" />
        <span className="text-white font-['Koulen'] text-4xl font-bold">
          {stars}
        </span>
      </div>
    </div>
  );
};