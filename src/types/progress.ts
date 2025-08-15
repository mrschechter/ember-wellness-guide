export interface DailyCheckin {
  id: string;
  user_id: string;
  date: string;
  energy_morning?: number;
  energy_afternoon?: number;
  energy_evening?: number;
  mood_rating?: number;
  sleep_quality?: number;
  stress_level?: number;
  water_intake?: number;
  exercise_completed?: boolean;
  sunlight_exposure?: boolean;
  stress_management?: boolean;
  protein_meals?: number;
  screen_free_evening?: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupplementCompliance {
  id: string;
  user_id: string;
  date: string;
  supplement_name: string;
  morning_taken: boolean;
  evening_taken: boolean;
  created_at: string;
  updated_at: string;
}

export interface WeeklyAssessment {
  id: string;
  user_id: string;
  week_start_date: string;
  profile_score_1?: number;
  profile_score_2?: number;
  profile_score_3?: number;
  profile_score_4?: number;
  profile_score_5?: number;
  profile_score_6?: number;
  profile_score_7?: number;
  weekly_wins?: string;
  weekly_challenges?: string;
  goals_next_week?: string;
  created_at: string;
  updated_at: string;
}

export interface ProgressMilestone {
  id: string;
  user_id: string;
  milestone_type: string;
  milestone_value?: number;
  achieved_date: string;
  created_at: string;
}

export interface UserProtocol {
  morningSupplements: Array<{
    name: string;
    dosage: string;
  }>;
  eveningSupplements: Array<{
    name: string;
    dosage: string;
  }>;
}