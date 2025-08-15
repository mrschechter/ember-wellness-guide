import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { DailyCheckinWidget } from '@/components/dashboard/DailyCheckinWidget';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function DailyCheckin() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to access your daily check-in.",
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
          <p className="mt-4 text-muted-foreground">Loading your daily check-in...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-muted-foreground mb-4">Please log in to access your daily check-in.</p>
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
          <h1 className="text-3xl font-bold mb-2">Daily Check-in</h1>
          <p className="text-muted-foreground">
            Track your daily progress, supplements, and lifestyle habits. This should take about 2-3 minutes.
          </p>
        </div>

        {/* Daily Check-in Form */}
        <DailyCheckinWidget userId={user.id} />

        {/* Tips Section */}
        <Card className="p-6 mt-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <h3 className="font-semibold mb-3">💡 Daily Check-in Tips</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Rate your energy levels honestly - this helps track patterns over time</li>
            <li>• Take supplements consistently at the same time each day for best results</li>
            <li>• Even 15 minutes of sunlight exposure can make a difference</li>
            <li>• Small amounts of movement count - a walk around the block is progress</li>
            <li>• Aim for 8-10 glasses of water throughout the day</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}