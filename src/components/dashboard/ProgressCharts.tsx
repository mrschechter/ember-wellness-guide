import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format, subDays, parseISO } from 'date-fns';

interface ProgressChartsProps {
  userId: string;
}

export function ProgressCharts({ userId }: ProgressChartsProps) {
  const [energyData, setEnergyData] = useState<any[]>([]);
  const [complianceData, setComplianceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        // Fetch energy data for last 30 days
        const thirtyDaysAgo = format(subDays(new Date(), 30), 'yyyy-MM-dd');
        const { data: checkins } = await supabase
          .from('daily_checkins')
          .select('date, energy_morning, energy_afternoon, energy_evening, mood_rating, sleep_quality')
          .eq('user_id', userId)
          .gte('date', thirtyDaysAgo)
          .order('date', { ascending: true });

        if (checkins) {
          const formattedEnergyData = checkins.map(checkin => ({
            date: format(parseISO(checkin.date), 'MM/dd'),
            morning: checkin.energy_morning || 0,
            afternoon: checkin.energy_afternoon || 0,
            evening: checkin.energy_evening || 0,
            mood: checkin.mood_rating || 0,
            sleep: checkin.sleep_quality || 0,
          }));
          setEnergyData(formattedEnergyData);
        }

        // Fetch compliance data for last 7 days
        const sevenDaysAgo = format(subDays(new Date(), 7), 'yyyy-MM-dd');
        const { data: supplements } = await supabase
          .from('supplement_compliance')
          .select('date, morning_taken, evening_taken')
          .eq('user_id', userId)
          .gte('date', sevenDaysAgo)
          .order('date', { ascending: true });

        if (supplements) {
          // Group by date and calculate compliance percentage
          const complianceByDate: Record<string, { total: number; taken: number }> = {};
          
          supplements.forEach(item => {
            if (!complianceByDate[item.date]) {
              complianceByDate[item.date] = { total: 0, taken: 0 };
            }
            complianceByDate[item.date].total += 2; // morning + evening
            if (item.morning_taken) complianceByDate[item.date].taken += 1;
            if (item.evening_taken) complianceByDate[item.date].taken += 1;
          });

          const formattedComplianceData = Object.entries(complianceByDate).map(([date, data]) => ({
            date: format(parseISO(date), 'MM/dd'),
            compliance: Math.round((data.taken / data.total) * 100),
          }));

          setComplianceData(formattedComplianceData);
        }
      } catch (error) {
        console.error('Error fetching progress data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, [userId]);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Progress Trends</h2>
      
      <div className="space-y-8">
        {/* Energy Levels Chart */}
        <div>
          <h3 className="font-medium mb-4">Energy Levels (Last 30 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={energyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Line type="monotone" dataKey="morning" stroke="hsl(var(--primary))" strokeWidth={2} name="Morning" />
                <Line type="monotone" dataKey="afternoon" stroke="hsl(var(--secondary))" strokeWidth={2} name="Afternoon" />
                <Line type="monotone" dataKey="evening" stroke="hsl(var(--accent))" strokeWidth={2} name="Evening" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Well-being Metrics */}
        <div>
          <h3 className="font-medium mb-4">Well-being Metrics (Last 30 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={energyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Line type="monotone" dataKey="mood" stroke="#10b981" strokeWidth={2} name="Mood" />
                <Line type="monotone" dataKey="sleep" stroke="#8b5cf6" strokeWidth={2} name="Sleep Quality" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Supplement Compliance */}
        <div>
          <h3 className="font-medium mb-4">Supplement Compliance (Last 7 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={complianceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, 'Compliance']} />
                <Bar 
                  dataKey="compliance" 
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Card>
  );
}