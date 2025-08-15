import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DailyCheckinWidget } from '@/components/dashboard/DailyCheckinWidget';
import { ProgressCharts } from '@/components/dashboard/ProgressCharts';
import { WeeklyAssessmentWidget } from '@/components/dashboard/WeeklyAssessmentWidget';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to access your dashboard.",
          variant: "destructive",
        });
        return;
      }
      setUser(user);
      setLoading(false);
    };

    getUser();
  }, [toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-muted-foreground mb-4">Please log in to access your progress dashboard.</p>
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
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Assessment
          </Link>
        </div>

        {/* Dashboard Header */}
        <DashboardHeader userId={user.id} />

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Check-in Widget */}
          <div className="lg:col-span-2">
            <DailyCheckinWidget userId={user.id} />
          </div>

          {/* Progress Charts */}
          <ProgressCharts userId={user.id} />

          {/* Weekly Assessment Widget */}
          <WeeklyAssessmentWidget userId={user.id} />
        </div>

        {/* Quick Navigation */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/dashboard/daily-checkin">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <h3 className="font-semibold mb-2">📝 Daily Check-in</h3>
              <p className="text-sm text-muted-foreground">Complete your daily progress tracking</p>
            </Card>
          </Link>
          
          <Link to="/dashboard/weekly-review">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <h3 className="font-semibold mb-2">📊 Weekly Review</h3>
              <p className="text-sm text-muted-foreground">Assess your weekly progress</p>
            </Card>
          </Link>
          
          <Link to="/dashboard/progress-charts">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <h3 className="font-semibold mb-2">📈 Progress Charts</h3>
              <p className="text-sm text-muted-foreground">View detailed progress analytics</p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}