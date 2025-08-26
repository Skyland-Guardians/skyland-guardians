import React from 'react';
import { Card, CardContent } from './ui/card';

interface CharacterMessageProps {
  avatar: string;
  message: string;
}

export const CharacterMessage: React.FC<CharacterMessageProps> = ({ avatar, message }) => {
  return (
    <div className="relative flex flex-col items-center">
      <div className="w-40 h-28 mb-4">
        <img 
          src={avatar} 
          alt="Character guide"
          className="w-full h-full object-contain"
        />
      </div>
      <Card className="bg-blue-100 border-2 border-fantasy-blue rounded-lg shadow-lg max-w-xs">
        <CardContent className="p-3">
          <p className="text-black font-['Koulen'] text-sm font-normal leading-relaxed whitespace-pre-line">
            {message}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};