import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { type CalendarView, type TrackingPeriod, type DailyEntry, type CalendarDay } from '@/types/dailyPlanner';

interface CalendarViewProps {
  view: CalendarView;
  selectedDate: string;
  onDateSelect: (date: string) => void;
  entries: DailyEntry[];
  trackingPeriod: TrackingPeriod;
}

export function CalendarView({ view, selectedDate, onDateSelect, entries }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date(selectedDate));

  const getCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: CalendarDay[] = [];
    const today = new Date().toISOString().split('T')[0];

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      const entry = entries.find(e => e.date === dateStr);
      const isFuture = dateStr > today;
      
      days.push({
        date: dateStr,
        hasEntry: !!entry,
        completionScore: entry?.completionScore || 0,
        status: isFuture ? 'future' : entry ? 
          (entry.completionScore >= 80 ? 'complete' : 
           entry.completionScore >= 40 ? 'partial' : 'missed') : 'missed',
        wellnessScore: entry?.eveningReflection.overallWellness || 0
      });
    }

    return days;
  };

  const getWeekDays = (): CalendarDay[] => {
    const date = new Date(selectedDate);
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());

    const days: CalendarDay[] = [];
    const today = new Date().toISOString().split('T')[0];

    for (let i = 0; i < 7; i++) {
      const weekDate = new Date(startOfWeek);
      weekDate.setDate(startOfWeek.getDate() + i);
      const dateStr = weekDate.toISOString().split('T')[0];
      
      const entry = entries.find(e => e.date === dateStr);
      const isFuture = dateStr > today;
      
      days.push({
        date: dateStr,
        hasEntry: !!entry,
        completionScore: entry?.completionScore || 0,
        status: isFuture ? 'future' : entry ? 
          (entry.completionScore >= 80 ? 'complete' : 
           entry.completionScore >= 40 ? 'partial' : 'missed') : 'missed',
        wellnessScore: entry?.eveningReflection.overallWellness || 0
      });
    }

    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'bg-success text-success-foreground';
      case 'partial': return 'bg-warning text-warning-foreground';
      case 'missed': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (view === 'month') {
    const days = getCalendarDays();
    const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{monthName}</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => (
            <Button
              key={day.date}
              variant={selectedDate === day.date ? 'default' : 'ghost'}
              className={`h-16 p-2 flex flex-col items-center justify-center relative ${
                new Date(day.date).getMonth() !== currentDate.getMonth() ? 'opacity-50' : ''
              }`}
              onClick={() => onDateSelect(day.date)}
            >
              <span className="text-sm">{new Date(day.date).getDate()}</span>
              {day.hasEntry && (
                <div className={`w-2 h-2 rounded-full ${getStatusColor(day.status)} absolute bottom-1`} />
              )}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success" />
            <span>Complete (80%+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-warning" />
            <span>Partial (40-79%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-destructive" />
            <span>Missed (&lt;40%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-muted" />
            <span>Future</span>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'week') {
    const days = getWeekDays();
    const weekStart = new Date(days[0].date);
    const weekEnd = new Date(days[6].date);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateWeek('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateWeek('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-4">
          {days.map((day) => (
            <div
              key={day.date}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedDate === day.date ? 'border-primary bg-primary/10' : 'border-border hover:bg-muted'
              }`}
              onClick={() => onDateSelect(day.date)}
            >
              <div className="text-center mb-2">
                <div className="text-xs text-muted-foreground">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="text-lg font-semibold">
                  {new Date(day.date).getDate()}
                </div>
              </div>
              
              {day.hasEntry && (
                <div className="space-y-2">
                  <div className={`w-full h-2 rounded-full ${getStatusColor(day.status)}`} />
                  <div className="text-xs text-center">
                    {day.completionScore}% complete
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}