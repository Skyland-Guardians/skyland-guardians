// Mock data for Fantasy Dashboard components

export interface GameItem {
  id: string;
  name: string;
  image: string;
  label: string;
  type: 'ability' | 'item' | 'character';
}

export interface UserProfile {
  name: string;
  level: number;
  avatar: string;
}

export interface ProgressData {
  day: number;
  stars: number;
}

export interface CharacterMessage {
  avatar: string;
  message: string;
}

// Mock data for the fantasy dashboard
export const mockUserProfile: UserProfile = {
  name: "james",
  level: 1,
  avatar: "/images/user-avatar.png"
};

export const mockProgressData: ProgressData = {
  day: 1,
  stars: 15
};

export const mockGameItems: GameItem[] = [
  {
    id: "sword",
    name: "SWORD",
    image: "/images/sword-ability.png",
    label: "SWORD",
    type: "ability"
  },
  {
    id: "shield", 
    name: "SHIELD",
    image: "/images/shield-ability.png",
    label: "SHIELD",
    type: "ability"
  },
  {
    id: "forest",
    name: "FOREST", 
    image: "/images/forest-ability.png",
    label: "FOREST",
    type: "ability"
  },
  {
    id: "ask-ali",
    name: "ASK ALI",
    image: "/images/character-ability.png", 
    label: "ASK ALI",
    type: "character"
  },
  {
    id: "golden",
    name: "GOLDEN",
    image: "/images/golden-treasure.png",
    label: "GOLDEN", 
    type: "item"
  },
  {
    id: "fountain",
    name: "FOUNTAIN",
    image: "/images/fountain-ability.png",
    label: "FOUNTAIN",
    type: "ability"
  },
  {
    id: "crystal", 
    name: "CRYSTAL",
    image: "/images/crystal-ability.png",
    label: "CRYSTAL",
    type: "item"
  },
  {
    id: "magic",
    name: "MAGIC",
    image: "/images/magic-wand.png", 
    label: "MAGIC",
    type: "ability"
  }
];

export const mockCharacterMessage: CharacterMessage = {
  avatar: "/images/character-guide.png",
  message: "Good morning, little Guardian! The investment performance yesterday was quite good\nDo you want to try any new challenges today?"
};

export const mockSidebarData = {
  cardDeck: "/images/card-deck.png",
  cardsLabel: "my cards",
  badgesLabel: "badges",
  badgeIcon: "/images/card-deck.png" // Using same for now, should be different badge icon
};