import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DashboardHeaderProps {
  userId: string;
}

export function DashboardHeader({ userId }: DashboardHeaderProps) {
  const [stats, setStats] = useState({
    currentStreak: 0,
    daysOnProtocol: 0,
    overallProgress: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Calculate current streak
        const { data: checkins } = await supabase
          .from('daily_checkins')
          .select('date')
          .eq('user_id', userId)
          .order('date', { ascending: false })
          .limit(30);

        let currentStreak = 0;
        if (checkins && checkins.length > 0) {
          const today = new Date();
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          
          let checkDate = new Date(today);
          for (const checkin of checkins) {
            const checkinDate = new Date(checkin.date);
            if (checkinDate.toDateString() === checkDate.toDateString()) {
              currentStreak++;
              checkDate.setDate(checkDate.getDate() - 1);
            } else {
              break;
            }
          }
        }

        // Calculate days on protocol (total check-ins)
        const { count: totalCheckins } = await supabase
          .from('daily_checkins')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);

        // Calculate overall progress (simplified metric)
        const overallProgress = Math.min(Math.round((currentStreak / 30) * 100), 100);

        setStats({
          currentStreak,
          daysOnProtocol: totalCheckins || 0,
          overallProgress,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, [userId]);

  return (
    <Card className="p-6 mb-6 bg-gradient-to-r from-primary to-secondary text-white">
      <h1 className="text-3xl font-bold mb-4">Your Restoration Journey</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/20 rounded-lg p-4">
          <div className="text-sm opacity-90 mb-1">Current Streak</div>
          <div className="text-2xl font-bold flex items-center gap-2">
            {stats.currentStreak} days
            {stats.currentStreak >= 7 && <Badge variant="secondary" className="text-xs">🔥</Badge>}
          </div>
        </div>
        
        <div className="bg-white/20 rounded-lg p-4">
          <div className="text-sm opacity-90 mb-1">Days on Protocol</div>
          <div className="text-2xl font-bold">{stats.daysOnProtocol}</div>
        </div>
        
        <div className="bg-white/20 rounded-lg p-4">
          <div className="text-sm opacity-90 mb-1">Overall Progress</div>
          <div className="text-2xl font-bold">{stats.overallProgress}%</div>
        </div>
      </div>
    </Card>
  );
}