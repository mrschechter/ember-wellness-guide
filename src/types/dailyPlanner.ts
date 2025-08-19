export interface DailyEntry {
  id: string;
  date: string;
  morningRoutine: MorningRoutine;
  mealPlan: MealPlan;
  wellnessMetrics: WellnessMetrics;
  eveningReflection: EveningReflection;
  completionScore: number;
  created_at: Date;
  updated_at: Date;
}

export interface MorningRoutine {
  supplements: SupplementIntake[];
  waterIntake: number; // glasses
  exercise: boolean;
  exerciseType?: string;
  exerciseDuration?: number; // minutes
  meditation: boolean;
  meditationDuration?: number; // minutes
  moodRating: number; // 1-10
  energyLevel: number; // 1-10
}

export interface SupplementIntake {
  name: string;
  taken: boolean;
  dosage: string;
  time: 'morning' | 'afternoon' | 'evening';
}

export interface MealPlan {
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snacks: Snack[];
  hungerLevels: number[]; // 1-10 scale, multiple times per day
  satietyLevels: number[]; // 1-10 scale
}

export interface Meal {
  planned: string;
  actual?: string;
  photoUrl?: string;
  protocolAligned: boolean;
  hungerBefore: number; // 1-10
  satietyAfter: number; // 1-10
}

export interface Snack {
  name: string;
  time: string;
  photoUrl?: string;
  protocolAligned: boolean;
}

export interface WellnessMetrics {
  sleepQuality: number; // 1-10
  sleepHours: number;
  stressLevel: number; // 1-10
  symptoms: Symptom[];
  cycleDay?: number;
  cyclePhase?: 'menstrual' | 'follicular' | 'ovulation' | 'luteal';
}

export interface Symptom {
  name: string;
  severity: number; // 1-10
  notes?: string;
}

export interface EveningReflection {
  dailyWins: string[];
  challenges: string[];
  tomorrowIntentions: string[];
  gratitude: string[];
  overallWellness: number; // 1-100
}

export interface ProgressStreak {
  type: 'supplements' | 'exercise' | 'meditation' | 'protocol_adherence';
  currentStreak: number;
  longestStreak: number;
  lastDate: string;
}

export interface WeeklyGoal {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  completed: boolean;
  week: string; // YYYY-Www format
}

export interface MonthlyMilestone {
  id: string;
  title: string;
  description: string;
  achievedDate?: string;
  value?: number;
  category: 'energy' | 'mood' | 'sleep' | 'symptoms' | 'weight' | 'habits';
}

export interface CalendarDay {
  date: string;
  hasEntry: boolean;
  completionScore: number;
  status: 'complete' | 'partial' | 'missed' | 'future';
  wellnessScore: number;
}

export type CalendarView = 'month' | 'week' | 'day';
export type TrackingPeriod = '90-day' | '6-month' | '1-year' | 'custom';

export interface ProgressAnalytics {
  weeklyTrends: {
    week: string;
    avgCompletion: number;
    avgWellness: number;
    avgEnergy: number;
    avgMood: number;
    avgSleep: number;
  }[];
  streaks: ProgressStreak[];
  adherenceRates: {
    supplements: number;
    exercise: number;
    meditation: number;
    protocolMeals: number;
  };
  symptomTrends: {
    symptom: string;
    trend: 'improving' | 'stable' | 'worsening';
    change: number;
  }[];
}