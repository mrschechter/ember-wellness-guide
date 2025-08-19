import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Calendar, Target, Award, Flame } from 'lucide-react';
import { type DailyEntry, type TrackingPeriod, type ProgressStreak } from '@/types/dailyPlanner';

interface ProgressDashboardProps {
  entries: DailyEntry[];
  trackingPeriod: TrackingPeriod;
}

export function ProgressDashboard({ entries }: ProgressDashboardProps) {
  const analytics = useMemo(() => {
    const sortedEntries = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Weekly trends
    const weeklyTrends = [];
    for (let i = 0; i < sortedEntries.length; i += 7) {
      const weekEntries = sortedEntries.slice(i, i + 7);
      if (weekEntries.length > 0) {
        const weekStart = new Date(weekEntries[0].date);
        const avgCompletion = weekEntries.reduce((sum, e) => sum + e.completionScore, 0) / weekEntries.length;
        const avgWellness = weekEntries.reduce((sum, e) => sum + e.eveningReflection.overallWellness, 0) / weekEntries.length;
        const avgEnergy = weekEntries.reduce((sum, e) => sum + e.morningRoutine.energyLevel, 0) / weekEntries.length;
        const avgMood = weekEntries.reduce((sum, e) => sum + e.morningRoutine.moodRating, 0) / weekEntries.length;
        const avgSleep = weekEntries.reduce((sum, e) => sum + e.wellnessMetrics.sleepQuality, 0) / weekEntries.length;
        
        weeklyTrends.push({
          week: `Week ${Math.floor(i / 7) + 1}`,
          date: weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          avgCompletion: Math.round(avgCompletion),
          avgWellness: Math.round(avgWellness),
          avgEnergy: Math.round(avgEnergy * 10) / 10,
          avgMood: Math.round(avgMood * 10) / 10,
          avgSleep: Math.round(avgSleep * 10) / 10
        });
      }
    }

    // Adherence rates
    const totalDays = entries.length;
    const supplementDays = entries.filter(e => e.morningRoutine.supplements.some(s => s.taken)).length;
    const exerciseDays = entries.filter(e => e.morningRoutine.exercise).length;
    const meditationDays = entries.filter(e => e.morningRoutine.meditation).length;
    const protocolMealDays = entries.filter(e => 
      e.mealPlan.breakfast.protocolAligned || 
      e.mealPlan.lunch.protocolAligned || 
      e.mealPlan.dinner.protocolAligned
    ).length;

    const adherenceRates = {
      supplements: totalDays ? Math.round((supplementDays / totalDays) * 100) : 0,
      exercise: totalDays ? Math.round((exerciseDays / totalDays) * 100) : 0,
      meditation: totalDays ? Math.round((meditationDays / totalDays) * 100) : 0,
      protocolMeals: totalDays ? Math.round((protocolMealDays / totalDays) * 100) : 0
    };

    // Streaks calculation
    const calculateStreak = (condition: (entry: DailyEntry) => boolean): ProgressStreak => {
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;
      let lastDate = '';

      for (const entry of sortedEntries.reverse()) {
        if (condition(entry)) {
          tempStreak++;
          if (entry.date === sortedEntries[0]?.date) {
            currentStreak = tempStreak;
          }
          lastDate = entry.date;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 0;
        }
      }
      longestStreak = Math.max(longestStreak, tempStreak);

      return {
        type: 'supplements',
        currentStreak,
        longestStreak,
        lastDate
      };
    };

    const streaks = [
      { 
        ...calculateStreak(e => e.morningRoutine.supplements.some(s => s.taken)), 
        type: 'supplements' as const,
        title: 'Supplement Streak',
        icon: '💊'
      },
      { 
        ...calculateStreak(e => e.morningRoutine.exercise), 
        type: 'exercise' as const,
        title: 'Exercise Streak',
        icon: '🏃‍♀️'
      },
      { 
        ...calculateStreak(e => e.morningRoutine.meditation), 
        type: 'meditation' as const,
        title: 'Meditation Streak',
        icon: '🧘‍♀️'
      },
      { 
        ...calculateStreak(e => e.completionScore >= 80), 
        type: 'protocol_adherence' as const,
        title: 'High Completion Streak',
        icon: '⭐'
      }
    ];

    return { weeklyTrends, adherenceRates, streaks };
  }, [entries]);

  const getStreakColor = (streak: number) => {
    if (streak >= 14) return 'text-success';
    if (streak >= 7) return 'text-warning';
    if (streak >= 3) return 'text-blue-500';
    return 'text-muted-foreground';
  };

  const getAdherenceColor = (rate: number) => {
    if (rate >= 80) return 'bg-success';
    if (rate >= 60) return 'bg-warning';
    return 'bg-destructive';
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Total Days</span>
            </div>
            <div className="text-2xl font-bold">{entries.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Avg Completion</span>
            </div>
            <div className="text-2xl font-bold">
              {entries.length ? Math.round(entries.reduce((sum, e) => sum + e.completionScore, 0) / entries.length) : 0}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Avg Wellness</span>
            </div>
            <div className="text-2xl font-bold">
              {entries.length ? Math.round(entries.reduce((sum, e) => sum + e.eveningReflection.overallWellness, 0) / entries.length) : 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Best Streak</span>
            </div>
            <div className="text-2xl font-bold">
              {Math.max(...analytics.streaks.map(s => s.longestStreak))} days
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Streaks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            Current Streaks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {analytics.streaks.map((streak, index) => (
              <div key={index} className="text-center p-4 border rounded-lg">
                <div className="text-2xl mb-2">{streak.icon}</div>
                <div className="font-medium text-sm">{streak.title}</div>
                <div className={`text-2xl font-bold ${getStreakColor(streak.currentStreak)}`}>
                  {streak.currentStreak}
                </div>
                <div className="text-xs text-muted-foreground">
                  Best: {streak.longestStreak} days
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Adherence Rates */}
      <Card>
        <CardHeader>
          <CardTitle>Protocol Adherence</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Supplements</span>
              <Badge variant="secondary">{analytics.adherenceRates.supplements}%</Badge>
            </div>
            <Progress 
              value={analytics.adherenceRates.supplements} 
              className={`h-2 ${getAdherenceColor(analytics.adherenceRates.supplements)}`}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Exercise</span>
              <Badge variant="secondary">{analytics.adherenceRates.exercise}%</Badge>
            </div>
            <Progress 
              value={analytics.adherenceRates.exercise} 
              className={`h-2 ${getAdherenceColor(analytics.adherenceRates.exercise)}`}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Meditation</span>
              <Badge variant="secondary">{analytics.adherenceRates.meditation}%</Badge>
            </div>
            <Progress 
              value={analytics.adherenceRates.meditation} 
              className={`h-2 ${getAdherenceColor(analytics.adherenceRates.meditation)}`}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Protocol Meals</span>
              <Badge variant="secondary">{analytics.adherenceRates.protocolMeals}%</Badge>
            </div>
            <Progress 
              value={analytics.adherenceRates.protocolMeals} 
              className={`h-2 ${getAdherenceColor(analytics.adherenceRates.protocolMeals)}`}
            />
          </div>
        </CardContent>
      </Card>

      {/* Weekly Trends Chart */}
      {analytics.weeklyTrends.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Weekly Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.weeklyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="avgCompletion" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Completion %"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="avgWellness" 
                    stroke="hsl(var(--success))" 
                    strokeWidth={2}
                    name="Wellness Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Energy & Mood Trends */}
      {analytics.weeklyTrends.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Energy & Mood Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.weeklyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Bar dataKey="avgEnergy" fill="hsl(var(--warning))" name="Energy Level" />
                  <Bar dataKey="avgMood" fill="hsl(var(--accent))" name="Mood Rating" />
                  <Bar dataKey="avgSleep" fill="hsl(var(--muted))" name="Sleep Quality" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}