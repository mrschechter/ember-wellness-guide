export interface JournalEntry {
  id: string;
  title?: string;
  content: string;
  date: string;
  createdAt: Date;
  updatedAt: Date;
  mood?: Mood;
  weather?: Weather;
  location?: string;
  photos: string[];
  tags: string[];
  isFavorite: boolean;
  template?: JournalTemplate;
}

export interface Mood {
  value: number; // 1-10 scale
  label: string;
  emoji: string;
  color: string;
}

export interface Weather {
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy' | 'partly-cloudy' | 'foggy';
  temperature?: number;
  emoji: string;
}

export interface JournalTemplate {
  id: string;
  name: string;
  prompts: string[];
  category: 'wellness' | 'gratitude' | 'goals' | 'reflection' | 'daily' | 'custom';
}

export interface JournalSettings {
  defaultTemplate?: string;
  reminderTime?: string;
  enableWeather: boolean;
  enableMood: boolean;
  enableLocation: boolean;
  enablePhotos: boolean;
}

export interface JournalFilter {
  dateRange?: {
    start: Date;
    end: Date;
  };
  mood?: number[];
  tags?: string[];
  weather?: Weather['condition'][];
  favorites?: boolean;
  searchTerm?: string;
}

export const MOOD_OPTIONS: Mood[] = [
  { value: 1, label: 'Terrible', emoji: '😭', color: 'hsl(0 75% 55%)' },
  { value: 2, label: 'Awful', emoji: '😢', color: 'hsl(15 75% 55%)' },
  { value: 3, label: 'Bad', emoji: '😔', color: 'hsl(30 75% 55%)' },
  { value: 4, label: 'Poor', emoji: '😕', color: 'hsl(45 65% 55%)' },
  { value: 5, label: 'Okay', emoji: '😐', color: 'hsl(60 55% 55%)' },
  { value: 6, label: 'Good', emoji: '🙂', color: 'hsl(90 60% 50%)' },
  { value: 7, label: 'Great', emoji: '😊', color: 'hsl(120 60% 50%)' },
  { value: 8, label: 'Excellent', emoji: '😄', color: 'hsl(140 65% 50%)' },
  { value: 9, label: 'Amazing', emoji: '😁', color: 'hsl(160 70% 50%)' },
  { value: 10, label: 'Incredible', emoji: '🤩', color: 'hsl(180 75% 50%)' }
];

export const WEATHER_OPTIONS: Record<Weather['condition'], Weather> = {
  'sunny': { condition: 'sunny', emoji: '☀️' },
  'partly-cloudy': { condition: 'partly-cloudy', emoji: '⛅' },
  'cloudy': { condition: 'cloudy', emoji: '☁️' },
  'rainy': { condition: 'rainy', emoji: '🌧️' },
  'stormy': { condition: 'stormy', emoji: '⛈️' },
  'snowy': { condition: 'snowy', emoji: '❄️' },
  'foggy': { condition: 'foggy', emoji: '🌫️' }
};

export const DEFAULT_TEMPLATES: JournalTemplate[] = [
  {
    id: 'daily',
    name: 'Daily Reflection',
    category: 'daily',
    prompts: [
      'How did I feel today?',
      'What were the highlights of my day?',
      'What challenges did I face?',
      'What am I grateful for today?'
    ]
  },
  {
    id: 'wellness',
    name: 'Wellness Check-in',
    category: 'wellness',
    prompts: [
      'How is my energy level today?',
      'What did I do for my physical health?',
      'How is my mental state?',
      'What can I do better tomorrow?'
    ]
  },
  {
    id: 'gratitude',
    name: 'Gratitude Practice',
    category: 'gratitude',
    prompts: [
      'Three things I\'m grateful for today:',
      'Someone who made a positive impact on my day:',
      'A moment that made me smile:',
      'Something I learned today:'
    ]
  },
  {
    id: 'goals',
    name: 'Goal Reflection',
    category: 'goals',
    prompts: [
      'Progress I made towards my goals today:',
      'Obstacles I encountered:',
      'Adjustments I need to make:',
      'Tomorrow\'s priorities:'
    ]
  }
];