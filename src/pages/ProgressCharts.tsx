import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ProgressCharts as ProgressChartsComponent } from '@/components/dashboard/ProgressCharts';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format, subDays, parseISO } from 'date-fns';

export default function ProgressCharts() {
  const [user, setUser] = useState<any>(null);
  const [progressData, setProgressData] = useState<any>({
    weeklyScores: [],
    milestones: [],
    streakData: [],
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to access your progress charts.",
          variant: "destructive",
        });
        return;
      }
      setUser(user);
      await fetchProgressData(user.id);
      setLoading(false);
    };

    getUser();
  }, [toast]);

  const fetchProgressData = async (userId: string) => {
    try {
      // Fetch weekly assessments for trend analysis
      const { data: weeklyAssessments } = await supabase
        .from('weekly_assessments')
        .select('*')
        .eq('user_id', userId)
        .order('week_start_date', { ascending: true });

      let weeklyScores = [];
      if (weeklyAssessments) {
        weeklyScores = weeklyAssessments.map(assessment => {
          const totalScore = (
            (assessment.profile_score_1 || 0) +
            (assessment.profile_score_2 || 0) +
            (assessment.profile_score_3 || 0) +
            (assessment.profile_score_4 || 0) +
            (assessment.profile_score_5 || 0) +
            (assessment.profile_score_6 || 0) +
            (assessment.profile_score_7 || 0)
          );
          
          return {
            week: format(parseISO(assessment.week_start_date), 'MM/dd'),
            totalScore,
            hormonal: assessment.profile_score_1 || 0,
            adrenal: assessment.profile_score_2 || 0,
            metabolic: assessment.profile_score_3 || 0,
            digestive: assessment.profile_score_4 || 0,
            sleep: assessment.profile_score_5 || 0,
            mental: assessment.profile_score_6 || 0,
            vitality: assessment.profile_score_7 || 0,
          };
        });
      }

      // Fetch milestones
      const { data: milestones } = await supabase
        .from('progress_milestones')
        .select('*')
        .eq('user_id', userId)
        .order('achieved_date', { ascending: false })
        .limit(10);

      // Calculate streak data for the last 30 days
      const thirtyDaysAgo = format(subDays(new Date(), 30), 'yyyy-MM-dd');
      const { data: checkins } = await supabase
        .from('daily_checkins')
        .select('date')
        .eq('user_id', userId)
        .gte('date', thirtyDaysAgo)
        .order('date', { ascending: true });

      let streakData = [];
      if (checkins) {
        // Create a map of all dates in the last 30 days
        const dateMap: Record<string, boolean> = {};
        for (let i = 29; i >= 0; i--) {
          const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
          dateMap[date] = false;
        }

        // Mark dates with check-ins
        checkins.forEach(checkin => {
          dateMap[checkin.date] = true;
        });

        streakData = Object.entries(dateMap).map(([date, hasCheckin]) => ({
          date: format(parseISO(date), 'MM/dd'),
          completed: hasCheckin ? 1 : 0,
        }));
      }

      setProgressData({
        weeklyScores,
        milestones: milestones || [],
        streakData,
      });

    } catch (error) {
      console.error('Error fetching progress data:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading your progress charts...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-muted-foreground mb-4">Please log in to access your progress charts.</p>
          <Link to="/">
            <Button>Return Home</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Navigation */}
        <div className="mb-6">
          <Link to="/dashboard" className="inline-flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Progress Analytics</h1>
            <p className="text-muted-foreground">
              Detailed insights into your restoration journey and wellness trends.
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>

        <div className="space-y-8">
          {/* Daily Progress Charts */}
          <ProgressChartsComponent userId={user.id} />

          {/* Weekly Assessment Trends */}
          {progressData.weeklyScores.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Weekly Assessment Trends</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="font-medium mb-4">Overall Wellness Score</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={progressData.weeklyScores}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" />
                        <YAxis domain={[0, 168]} />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="totalScore" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={3}
                          name="Total Score" 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4">Category Breakdown</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={progressData.weeklyScores}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" />
                        <YAxis domain={[0, 24]} />
                        <Tooltip />
                        <Line type="monotone" dataKey="hormonal" stroke="#ff6b6b" strokeWidth={2} name="Hormonal" />
                        <Line type="monotone" dataKey="adrenal" stroke="#4ecdc4" strokeWidth={2} name="Adrenal" />
                        <Line type="monotone" dataKey="metabolic" stroke="#45b7d1" strokeWidth={2} name="Metabolic" />
                        <Line type="monotone" dataKey="digestive" stroke="#96ceb4" strokeWidth={2} name="Digestive" />
                        <Line type="monotone" dataKey="sleep" stroke="#ffeaa7" strokeWidth={2} name="Sleep" />
                        <Line type="monotone" dataKey="mental" stroke="#dda0dd" strokeWidth={2} name="Mental" />
                        <Line type="monotone" dataKey="vitality" stroke="#98d8c8" strokeWidth={2} name="Vitality" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Daily Consistency Chart */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Daily Consistency (Last 30 Days)</h2>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={progressData.streakData}>
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 1]} />
                  <Tooltip formatter={(value) => [value ? 'Completed' : 'Missed', 'Status']} />
                  <Bar 
                    dataKey="completed" 
                    fill="hsl(var(--primary))"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Milestones */}
          {progressData.milestones.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Recent Milestones</h2>
              <div className="space-y-3">
                {progressData.milestones.map((milestone: any) => (
                  <div key={milestone.id} className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                    <div className="text-2xl">🏆</div>
                    <div>
                      <div className="font-medium capitalize">
                        {milestone.milestone_type.replace('_', ' ')}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Achieved on {format(parseISO(milestone.achieved_date), 'MMM dd, yyyy')}
                      </div>
                    </div>
                    {milestone.milestone_value && (
                      <div className="ml-auto text-lg font-bold text-primary">
                        {milestone.milestone_value}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}