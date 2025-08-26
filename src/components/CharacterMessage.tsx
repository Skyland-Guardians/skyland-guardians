import React from 'react';
import { Card, CardContent } from './ui/card';

interface CharacterMessageProps {
  avatar: string;
  message: string;
}

export const CharacterMessage: React.FC<CharacterMessageProps> = ({ avatar, message }) => {
  return (
    <div className="relative w-48">
      {/* Blue background container for character - narrow and tall */}
      <div className="bg-blue-200 rounded-t-2xl p-4 flex justify-center items-end min-h-[100px] w-full">
        <div className="w-20 h-16">
          <img 
            src={avatar} 
            alt="Character guide"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      
      {/* White dialog box - narrow and elongated */}
      <Card className="bg-white border-2 border-gray-300 rounded-b-2xl rounded-t-none shadow-lg w-full">
        <CardContent className="p-4">
          <p className="text-black font-['Koulen'] text-xs font-medium leading-tight whitespace-pre-line text-left">
            {message}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};