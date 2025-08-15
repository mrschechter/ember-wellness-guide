import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { format, startOfWeek } from 'date-fns';
import { WeeklyAssessment } from '@/types/progress';

export default function WeeklyReview() {
  const [user, setUser] = useState<any>(null);
  const [assessment, setAssessment] = useState<Partial<WeeklyAssessment>>({
    profile_score_1: 12,
    profile_score_2: 12,
    profile_score_3: 12,
    profile_score_4: 12,
    profile_score_5: 12,
    profile_score_6: 12,
    profile_score_7: 12,
    weekly_wins: '',
    weekly_challenges: '',
    goals_next_week: '',
  });
  const [hasCompletedThisWeek, setHasCompletedThisWeek] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const profileCategories = [
    'Hormonal Balance',
    'Adrenal Function', 
    'Metabolic Health',
    'Digestive Wellness',
    'Sleep Quality',
    'Mental Clarity',
    'Physical Vitality'
  ];

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to access your weekly review.",
          variant: "destructive",
        });
        return;
      }
      setUser(user);
      await checkExistingAssessment(user.id);
      setLoading(false);
    };

    getUser();
  }, [toast]);

  const checkExistingAssessment = async (userId: string) => {
    const thisWeekStart = format(startOfWeek(new Date()), 'yyyy-MM-dd');
    
    const { data: existingAssessment } = await supabase
      .from('weekly_assessments')
      .select('*')
      .eq('user_id', userId)
      .eq('week_start_date', thisWeekStart)
      .single();

    if (existingAssessment) {
      setAssessment(existingAssessment);
      setHasCompletedThisWeek(true);
    }
  };

  const handleSaveAssessment = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const thisWeekStart = format(startOfWeek(new Date()), 'yyyy-MM-dd');
      
      const { error } = await supabase
        .from('weekly_assessments')
        .upsert({
          user_id: user.id,
          week_start_date: thisWeekStart,
          ...assessment,
        });

      if (error) throw error;

      setHasCompletedThisWeek(true);
      toast({
        title: "Weekly Assessment Saved!",
        description: "Your weekly review has been recorded successfully.",
      });
    } catch (error) {
      console.error('Error saving weekly assessment:', error);
      toast({
        title: "Error",
        description: "Failed to save your weekly assessment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading your weekly review...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-muted-foreground mb-4">Please log in to access your weekly review.</p>
          <Link to="/">
            <Button>Return Home</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-4xl">
        {/* Navigation */}
        <div className="mb-6">
          <Link to="/dashboard" className="inline-flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Weekly Review</h1>
          <p className="text-muted-foreground">
            Reflect on your week and assess your progress across the seven wellness categories.
          </p>
          {hasCompletedThisWeek && (
            <div className="mt-2 text-sm text-green-600 font-medium">✅ Completed for this week</div>
          )}
        </div>

        <Card className="p-6">
          <div className="space-y-8">
            {/* Profile Scores */}
            <div>
              <h2 className="text-xl font-semibold mb-6">How are you feeling in each area?</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Rate each category from 0 (very poor) to 24 (excellent). Think about this past week specifically.
              </p>
              
              <div className="space-y-6">
                {profileCategories.map((category, index) => {
                  const scoreKey = `profile_score_${index + 1}` as keyof typeof assessment;
                  const currentScore = assessment[scoreKey] as number || 12;
                  
                  return (
                    <div key={category} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label className="font-medium">{category}</Label>
                        <span className="text-sm font-medium">{currentScore}/24</span>
                      </div>
                      <Slider
                        value={[currentScore]}
                        onValueChange={(value) => setAssessment(prev => ({ 
                          ...prev, 
                          [scoreKey]: value[0] 
                        }))}
                        max={24}
                        min={0}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Very Poor</span>
                        <span>Poor</span>
                        <span>Fair</span>
                        <span>Good</span>
                        <span>Excellent</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Weekly Reflection */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Weekly Reflection</h2>
              
              <div className="space-y-2">
                <Label htmlFor="wins">🎉 What went well this week?</Label>
                <Textarea
                  id="wins"
                  placeholder="Celebrate your wins, no matter how small..."
                  value={assessment.weekly_wins || ''}
                  onChange={(e) => setAssessment(prev => ({ ...prev, weekly_wins: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="challenges">🤔 What challenges did you face?</Label>
                <Textarea
                  id="challenges"
                  placeholder="Identify areas that were difficult this week..."
                  value={assessment.weekly_challenges || ''}
                  onChange={(e) => setAssessment(prev => ({ ...prev, weekly_challenges: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goals">🎯 What are your goals for next week?</Label>
                <Textarea
                  id="goals"
                  placeholder="Set 1-3 specific, achievable goals for the coming week..."
                  value={assessment.goals_next_week || ''}
                  onChange={(e) => setAssessment(prev => ({ ...prev, goals_next_week: e.target.value }))}
                  rows={3}
                />
              </div>
            </div>

            <Button 
              onClick={handleSaveAssessment} 
              disabled={saving}
              className="w-full"
              size="lg"
            >
              {saving ? 'Saving...' : hasCompletedThisWeek ? 'Update Weekly Assessment' : 'Complete Weekly Assessment'}
            </Button>
          </div>
        </Card>

        {/* Tips Section */}
        <Card className="p-6 mt-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <h3 className="font-semibold mb-3">💡 Weekly Review Tips</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Be honest about your scores - this helps track real progress over time</li>
            <li>• Small improvements week over week are more sustainable than dramatic changes</li>
            <li>• Focus on one key area for improvement rather than trying to fix everything at once</li>
            <li>• Celebrate your wins - acknowledging progress motivates continued effort</li>
            <li>• Use challenges as learning opportunities rather than failures</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}