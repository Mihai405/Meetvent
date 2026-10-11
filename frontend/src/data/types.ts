// Data models from the design handoff (README §5), shaped for the mock data.

export type Goal = "friends" | "dating" | "networking";

export type Category = "music" | "sport" | "art" | "tech" | "comedy" | "film";

export type Prompt = {question: string; answer: string};

export type Details = {
  job?: string;
  education?: string;
  heightCm?: number;
  zodiac?: string;
  drinking?: string;
  smoking?: string;
  sport?: string;
  languages?: string[];
};

export type Artist = {name: string; genre: string};

export type Person = {
  id: string;
  firstName: string;
  lastName?: string;
  age: number;
  city?: string;
  job?: string;
  distanceKm?: number;
  verified?: boolean;
  goals: Goal[];
  bio?: string;
  details?: Details;
  interests?: string[];
  prompts?: Prompt[];
  topArtists?: Artist[];
  pastEvents?: string[];
  goingTo?: string[];
};

export type CurrentUser = Person & {
  privacy: {showEvents: boolean; showDistance: boolean};
  profileCompletion: number;
};

export type EventItem = {
  id: string;
  category: Category;
  title: string;
  startsAt: string;
  endsAt?: string;
  venue: string;
  tags?: string[];
  priceFrom?: number;
  organizer?: {name: string; verified: boolean};
  going: number;
  compatible: number;
};

export type ChatMessage = {from: string; text: string; at: string};

export type Conversation = {
  with: string;
  eventId: string;
  unread?: number;
  messages?: ChatMessage[];
  lastMessage?: string;
  at?: string;
  icebreakers?: string[];
};
