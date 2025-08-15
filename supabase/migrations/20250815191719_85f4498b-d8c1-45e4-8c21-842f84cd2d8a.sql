-- Daily Check-ins Table
CREATE TABLE public.daily_checkins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  energy_morning INTEGER CHECK (energy_morning >= 1 AND energy_morning <= 10),
  energy_afternoon INTEGER CHECK (energy_afternoon >= 1 AND energy_afternoon <= 10),
  energy_evening INTEGER CHECK (energy_evening >= 1 AND energy_evening <= 10),
  mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 10),
  sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 10),
  stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 10),
  water_intake INTEGER DEFAULT 0,
  exercise_completed BOOLEAN DEFAULT FALSE,
  sunlight_exposure BOOLEAN DEFAULT FALSE,
  stress_management BOOLEAN DEFAULT FALSE,
  protein_meals INTEGER DEFAULT 0,
  screen_free_evening BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Supplement Compliance Table
CREATE TABLE public.supplement_compliance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  supplement_name VARCHAR(100) NOT NULL,
  morning_taken BOOLEAN DEFAULT FALSE,
  evening_taken BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date, supplement_name)
);

-- Weekly Assessments Table
CREATE TABLE public.weekly_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start_date DATE NOT NULL,
  profile_score_1 INTEGER CHECK (profile_score_1 >= 0 AND profile_score_1 <= 24),
  profile_score_2 INTEGER CHECK (profile_score_2 >= 0 AND profile_score_2 <= 24),
  profile_score_3 INTEGER CHECK (profile_score_3 >= 0 AND profile_score_3 <= 24),
  profile_score_4 INTEGER CHECK (profile_score_4 >= 0 AND profile_score_4 <= 24),
  profile_score_5 INTEGER CHECK (profile_score_5 >= 0 AND profile_score_5 <= 24),
  profile_score_6 INTEGER CHECK (profile_score_6 >= 0 AND profile_score_6 <= 24),
  profile_score_7 INTEGER CHECK (profile_score_7 >= 0 AND profile_score_7 <= 24),
  weekly_wins TEXT,
  weekly_challenges TEXT,
  goals_next_week TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, week_start_date)
);

-- User Progress Milestones Table
CREATE TABLE public.progress_milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  milestone_type VARCHAR(50) NOT NULL,
  milestone_value INTEGER,
  achieved_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.daily_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplement_compliance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_milestones ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for daily_checkins
CREATE POLICY "Users can view their own daily check-ins" 
ON public.daily_checkins 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own daily check-ins" 
ON public.daily_checkins 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily check-ins" 
ON public.daily_checkins 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own daily check-ins" 
ON public.daily_checkins 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for supplement_compliance
CREATE POLICY "Users can view their own supplement compliance" 
ON public.supplement_compliance 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own supplement compliance" 
ON public.supplement_compliance 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own supplement compliance" 
ON public.supplement_compliance 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own supplement compliance" 
ON public.supplement_compliance 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for weekly_assessments
CREATE POLICY "Users can view their own weekly assessments" 
ON public.weekly_assessments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own weekly assessments" 
ON public.weekly_assessments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weekly assessments" 
ON public.weekly_assessments 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weekly assessments" 
ON public.weekly_assessments 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for progress_milestones
CREATE POLICY "Users can view their own progress milestones" 
ON public.progress_milestones 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own progress milestones" 
ON public.progress_milestones 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress milestones" 
ON public.progress_milestones 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress milestones" 
ON public.progress_milestones 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_daily_checkins_updated_at
BEFORE UPDATE ON public.daily_checkins
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_supplement_compliance_updated_at
BEFORE UPDATE ON public.supplement_compliance
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_weekly_assessments_updated_at
BEFORE UPDATE ON public.weekly_assessments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();