import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { format, startOfWeek, subWeeks } from 'date-fns';

interface WeeklyAssessmentWidgetProps {
  userId: string;
}

export function WeeklyAssessmentWidget({ userId }: WeeklyAssessmentWidgetProps) {
  const [weeklyStats, setWeeklyStats] = useState({
    energyImprovement: 0,
    complianceRate: 0,
    daysCompleted: 0,
    hasCompletedThisWeek: false,
  });

  useEffect(() => {
    const fetchWeeklyStats = async () => {
      try {
        const thisWeekStart = format(startOfWeek(new Date()), 'yyyy-MM-dd');
        const lastWeekStart = format(startOfWeek(subWeeks(new Date(), 1)), 'yyyy-MM-dd');

        // Check if weekly assessment is completed for this week
        const { data: thisWeekAssessment } = await supabase
          .from('weekly_assessments')
          .select('*')
          .eq('user_id', userId)
          .eq('week_start_date', thisWeekStart)
          .single();

        const hasCompletedThisWeek = !!thisWeekAssessment;

        // Calculate energy improvement
        const { data: thisWeekCheckins } = await supabase
          .from('daily_checkins')
          .select('energy_morning, energy_afternoon, energy_evening')
          .eq('user_id', userId)
          .gte('date', thisWeekStart);

        const { data: lastWeekCheckins } = await supabase
          .from('daily_checkins')
          .select('energy_morning, energy_afternoon, energy_evening')
          .eq('user_id', userId)
          .gte('date', lastWeekStart)
          .lt('date', thisWeekStart);

        let energyImprovement = 0;
        if (thisWeekCheckins && lastWeekCheckins && thisWeekCheckins.length > 0 && lastWeekCheckins.length > 0) {
          const thisWeekAvg = thisWeekCheckins.reduce((sum, checkin) => 
            sum + (checkin.energy_morning + checkin.energy_afternoon + checkin.energy_evening) / 3, 0
          ) / thisWeekCheckins.length;

          const lastWeekAvg = lastWeekCheckins.reduce((sum, checkin) => 
            sum + (checkin.energy_morning + checkin.energy_afternoon + checkin.energy_evening) / 3, 0
          ) / lastWeekCheckins.length;

          energyImprovement = Math.round(((thisWeekAvg - lastWeekAvg) / lastWeekAvg) * 100);
        }

        // Calculate compliance rate for this week
        const { data: supplements } = await supabase
          .from('supplement_compliance')
          .select('morning_taken, evening_taken')
          .eq('user_id', userId)
          .gte('date', thisWeekStart);

        let complianceRate = 0;
        if (supplements && supplements.length > 0) {
          const totalDoses = supplements.length * 2; // morning + evening
          const takenDoses = supplements.reduce((sum, item) => 
            sum + (item.morning_taken ? 1 : 0) + (item.evening_taken ? 1 : 0), 0
          );
          complianceRate = Math.round((takenDoses / totalDoses) * 100);
        }

        // Count days completed this week
        const daysCompleted = thisWeekCheckins?.length || 0;

        setWeeklyStats({
          energyImprovement,
          complianceRate,
          daysCompleted,
          hasCompletedThisWeek,
        });

      } catch (error) {
        console.error('Error fetching weekly stats:', error);
      }
    };

    fetchWeeklyStats();
  }, [userId]);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Weekly Review</h2>
        {weeklyStats.hasCompletedThisWeek && (
          <Badge variant="secondary">✅ Completed</Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-muted rounded-lg">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {weeklyStats.energyImprovement > 0 ? '↗️' : weeklyStats.energyImprovement < 0 ? '↘️' : '➡️'} 
            {Math.abs(weeklyStats.energyImprovement)}%
          </div>
          <div className="text-sm text-muted-foreground">Energy Change</div>
        </div>

        <div className="text-center p-4 bg-muted rounded-lg">
          <div className="text-2xl font-bold text-blue-600 mb-1">{weeklyStats.complianceRate}%</div>
          <div className="text-sm text-muted-foreground">Compliance Rate</div>
        </div>

        <div className="text-center p-4 bg-muted rounded-lg">
          <div className="text-2xl font-bold text-purple-600 mb-1">{weeklyStats.daysCompleted}</div>
          <div className="text-sm text-muted-foreground">Days Completed</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <h3 className="font-medium mb-2">This Week's Progress</h3>
          <p className="text-sm text-muted-foreground mb-3">
            {weeklyStats.daysCompleted >= 5 
              ? "Great consistency this week! You're building strong habits."
              : weeklyStats.daysCompleted >= 3
              ? "Good progress! Try to maintain consistency for better results."
              : "Let's focus on building daily habits. Small steps lead to big changes!"
            }
          </p>
          
          {weeklyStats.complianceRate >= 80 && (
            <div className="text-sm text-green-700 bg-green-100 p-2 rounded">
              🎉 Excellent supplement compliance! Your body is getting the nutrients it needs.
            </div>
          )}
        </div>

        <Link to="/dashboard/weekly-review">
          <Button 
            className="w-full" 
            variant={weeklyStats.hasCompletedThisWeek ? "outline" : "default"}
          >
            {weeklyStats.hasCompletedThisWeek 
              ? 'View Weekly Assessment' 
              : 'Complete Weekly Assessment'
            }
          </Button>
        </Link>
      </div>
    </Card>
  );
}