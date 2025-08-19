import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MorningRoutineCard } from './MorningRoutineCard';
import { MealPlanCard } from './MealPlanCard';
import { WellnessMetricsCard } from './WellnessMetricsCard';
import { EveningReflectionCard } from './EveningReflectionCard';
import { Progress } from '@/components/ui/progress';
import { Save, Calendar } from 'lucide-react';
import { type DailyEntry } from '@/types/dailyPlanner';

interface DayPlannerProps {
  selectedDate: string;
  entry?: DailyEntry;
  onUpdateEntry: (entry: DailyEntry) => void;
}

export function DayPlanner({ selectedDate, entry, onUpdateEntry }: DayPlannerProps) {
  const [currentEntry, setCurrentEntry] = useState<DailyEntry>(
    entry || {
      id: `entry-${selectedDate}`,
      date: selectedDate,
      morningRoutine: {
        supplements: [],
        waterIntake: 0,
        exercise: false,
        meditation: false,
        moodRating: 5,
        energyLevel: 5
      },
      mealPlan: {
        breakfast: { planned: '', protocolAligned: false, hungerBefore: 5, satietyAfter: 5 },
        lunch: { planned: '', protocolAligned: false, hungerBefore: 5, satietyAfter: 5 },
        dinner: { planned: '', protocolAligned: false, hungerBefore: 5, satietyAfter: 5 },
        snacks: [],
        hungerLevels: [],
        satietyLevels: []
      },
      wellnessMetrics: {
        sleepQuality: 5,
        sleepHours: 8,
        stressLevel: 5,
        symptoms: []
      },
      eveningReflection: {
        dailyWins: [],
        challenges: [],
        tomorrowIntentions: [],
        gratitude: [],
        overallWellness: 50
      },
      completionScore: 0,
      created_at: new Date(),
      updated_at: new Date()
    }
  );

  useEffect(() => {
    if (entry) {
      setCurrentEntry(entry);
    }
  }, [entry]);

  const calculateCompletionScore = (): number => {
    let totalPoints = 0;
    let earnedPoints = 0;

    // Morning routine (25 points)
    totalPoints += 25;
    if (currentEntry.morningRoutine.supplements.length > 0) earnedPoints += 5;
    if (currentEntry.morningRoutine.waterIntake > 0) earnedPoints += 5;
    if (currentEntry.morningRoutine.exercise) earnedPoints += 5;
    if (currentEntry.morningRoutine.meditation) earnedPoints += 5;
    if (currentEntry.morningRoutine.moodRating > 0) earnedPoints += 2.5;
    if (currentEntry.morningRoutine.energyLevel > 0) earnedPoints += 2.5;

    // Meal planning (25 points)
    totalPoints += 25;
    if (currentEntry.mealPlan.breakfast.planned) earnedPoints += 8;
    if (currentEntry.mealPlan.lunch.planned) earnedPoints += 8;
    if (currentEntry.mealPlan.dinner.planned) earnedPoints += 9;

    // Wellness metrics (25 points)
    totalPoints += 25;
    if (currentEntry.wellnessMetrics.sleepQuality > 0) earnedPoints += 8;
    if (currentEntry.wellnessMetrics.sleepHours > 0) earnedPoints += 8;
    if (currentEntry.wellnessMetrics.stressLevel > 0) earnedPoints += 9;

    // Evening reflection (25 points)
    totalPoints += 25;
    if (currentEntry.eveningReflection.dailyWins.length > 0) earnedPoints += 6;
    if (currentEntry.eveningReflection.challenges.length > 0) earnedPoints += 6;
    if (currentEntry.eveningReflection.tomorrowIntentions.length > 0) earnedPoints += 6;
    if (currentEntry.eveningReflection.gratitude.length > 0) earnedPoints += 7;

    return Math.round((earnedPoints / totalPoints) * 100);
  };

  const handleSave = () => {
    const completionScore = calculateCompletionScore();
    const updatedEntry: DailyEntry = {
      ...currentEntry,
      completionScore,
      updated_at: new Date()
    };
    setCurrentEntry(updatedEntry);
    onUpdateEntry(updatedEntry);
  };

  const updateMorningRoutine = (routine: typeof currentEntry.morningRoutine) => {
    setCurrentEntry(prev => ({ ...prev, morningRoutine: routine }));
  };

  const updateMealPlan = (mealPlan: typeof currentEntry.mealPlan) => {
    setCurrentEntry(prev => ({ ...prev, mealPlan }));
  };

  const updateWellnessMetrics = (metrics: typeof currentEntry.wellnessMetrics) => {
    setCurrentEntry(prev => ({ ...prev, wellnessMetrics: metrics }));
  };

  const updateEveningReflection = (reflection: typeof currentEntry.eveningReflection) => {
    setCurrentEntry(prev => ({ ...prev, eveningReflection: reflection }));
  };

  const completionScore = calculateCompletionScore();
  const dateObj = new Date(selectedDate);
  const isToday = selectedDate === new Date().toISOString().split('T')[0];
  const isFuture = new Date(selectedDate) > new Date();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {dateObj.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
              {isToday && <span className="text-primary text-sm">(Today)</span>}
              {isFuture && <span className="text-muted-foreground text-sm">(Future)</span>}
            </CardTitle>
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Progress
            </Button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Daily Completion</span>
              <span className="font-medium">{completionScore}%</span>
            </div>
            <Progress value={completionScore} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <MorningRoutineCard
          routine={currentEntry.morningRoutine}
          onUpdate={updateMorningRoutine}
          disabled={isFuture}
        />
        
        <WellnessMetricsCard
          metrics={currentEntry.wellnessMetrics}
          onUpdate={updateWellnessMetrics}
          disabled={isFuture}
        />
      </div>

      <MealPlanCard
        mealPlan={currentEntry.mealPlan}
        onUpdate={updateMealPlan}
        disabled={isFuture}
      />

      <EveningReflectionCard
        reflection={currentEntry.eveningReflection}
        onUpdate={updateEveningReflection}
        disabled={isFuture}
      />
    </div>
  );
}