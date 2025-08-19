import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, BarChart3, Target, Settings } from 'lucide-react';
import { CalendarView } from './CalendarView';
import { DayPlanner } from './DayPlanner';
import { ProgressDashboard } from './ProgressDashboard';
import { PlannerSettings } from './PlannerSettings';
import { type CalendarView as ViewType, type TrackingPeriod, type DailyEntry } from '@/types/dailyPlanner';

export function DailyPlanner() {
  const [currentView, setCurrentView] = useState<ViewType>('month');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [trackingPeriod, setTrackingPeriod] = useState<TrackingPeriod>('90-day');
  const [entries, setEntries] = useState<DailyEntry[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('emberDailyEntries');
    if (stored) {
      try {
        setEntries(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading daily entries:', error);
      }
    }
  }, []);

  const saveEntries = (newEntries: DailyEntry[]) => {
    setEntries(newEntries);
    localStorage.setItem('emberDailyEntries', JSON.stringify(newEntries));
  };

  const updateEntry = (entry: DailyEntry) => {
    const updatedEntries = entries.filter(e => e.date !== entry.date);
    updatedEntries.push(entry);
    saveEntries(updatedEntries);
  };

  const getEntryForDate = (date: string): DailyEntry | undefined => {
    return entries.find(entry => entry.date === date);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Daily Wellness Planner
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant={currentView === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentView('month')}
              >
                Month
              </Button>
              <Button
                variant={currentView === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentView('week')}
              >
                Week
              </Button>
              <Button
                variant={currentView === 'day' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentView('day')}
              >
                Day
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="calendar" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Calendar
              </TabsTrigger>
              <TabsTrigger value="planner" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Planner
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="calendar">
              <CalendarView
                view={currentView}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                entries={entries}
                trackingPeriod={trackingPeriod}
              />
            </TabsContent>

            <TabsContent value="planner">
              <DayPlanner
                selectedDate={selectedDate}
                entry={getEntryForDate(selectedDate)}
                onUpdateEntry={updateEntry}
              />
            </TabsContent>

            <TabsContent value="analytics">
              <ProgressDashboard
                entries={entries}
                trackingPeriod={trackingPeriod}
              />
            </TabsContent>

            <TabsContent value="settings">
              <PlannerSettings
                trackingPeriod={trackingPeriod}
                onTrackingPeriodChange={setTrackingPeriod}
                entries={entries}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}