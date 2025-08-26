import React from 'react';
import { Card, CardContent } from './ui/card';

interface CharacterMessageProps {
  avatar: string;
  message: string;
}

export const CharacterMessage: React.FC<CharacterMessageProps> = ({ avatar, message }) => {
  return (
    <div className="relative w-[119px]">
      {/* Outer bubble frame image */}
      <img
        src="/images/chat-bubble.png"
        alt="chat bubble"
        className="w-[119px] h-[383px]"
      />

      {/* Avatar overlapping the bubble top */}
      <img
        src={avatar}
        alt="Character guide"
        className="absolute w-[100px] h-[70px] -top-6 left-1/2 -translate-x-1/2 object-contain"
      />

      {/* Inner text background and message */}
      <div className="absolute top-[90px] left-[14px] w-[91px] h-[288px]">
        <div className="absolute top-2 left-2 right-2 text-black font-['Koulen'] text-[13px] leading-snug whitespace-pre-line">
          {message}
        </div>
      </div>
    </div>
  );
};