import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';

interface UserProfileProps {
  name: string;
  level: number;
  avatar: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({ name, level, avatar }) => {
  return (
    <div className="flex flex-col items-start gap-2">
      <Avatar className="w-14 h-14 border-2 border-accent rounded-full">
        <AvatarImage src={avatar} alt={`${name}'s avatar`} />
        <AvatarFallback className="bg-secondary text-foreground font-bold">
          {name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="text-foreground font-['Koulen'] text-2xl font-bold uppercase">
        Level {level}
      </div>
    </div>
  );
};