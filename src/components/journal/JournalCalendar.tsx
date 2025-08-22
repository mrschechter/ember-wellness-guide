import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { ChevronLeft, ChevronRight, Edit, Heart } from 'lucide-react';
import { type JournalEntry } from '@/types/journal';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';

interface JournalCalendarProps {
  entries: JournalEntry[];
  selectedDate: string;
  onDateSelect: (date: string) => void;
  onEditEntry: (entry: JournalEntry) => void;
}

export function JournalCalendar({ entries, selectedDate, onDateSelect, onEditEntry }: JournalCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const selectedDateObj = new Date(selectedDate);

  // Get entries for the current month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthEntries = entries.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate >= monthStart && entryDate <= monthEnd;
  });

  // Create a map of dates to entries
  const entriesMap = new Map<string, JournalEntry[]>();
  monthEntries.forEach(entry => {
    const dateKey = entry.date;
    if (!entriesMap.has(dateKey)) {
      entriesMap.set(dateKey, []);
    }
    entriesMap.get(dateKey)!.push(entry);
  });

  // Get entries for selected date
  const selectedDateEntries = entriesMap.get(selectedDate) || [];

  const handleDateClick = (date: Date | undefined) => {
    if (date) {
      const dateString = format(date, 'yyyy-MM-dd');
      onDateSelect(dateString);
    }
  };

  const getDayClassName = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const hasEntries = entriesMap.has(dateString);
    const isSelected = isSameDay(date, selectedDateObj);

    if (isSelected) {
      return 'bg-primary text-primary-foreground hover:bg-primary/90';
    }
    if (hasEntries) {
      return 'bg-accent text-accent-foreground hover:bg-accent/80 relative';
    }
    return '';
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Calendar */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{format(currentMonth, 'MMMM yyyy')}</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDateObj}
            onSelect={handleDateClick}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            className="w-full"
            modifiersClassNames={{
              selected: 'bg-primary text-primary-foreground hover:bg-primary/90',
            }}
            components={{
              DayContent: ({ date }) => {
                const dateString = format(date, 'yyyy-MM-dd');
                const dayEntries = entriesMap.get(dateString) || [];
                const hasFavorite = dayEntries.some(entry => entry.isFavorite);
                
                return (
                  <div className="relative w-full h-full flex items-center justify-center">
                    {date.getDate()}
                    {dayEntries.length > 0 && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                        <div className="flex items-center gap-0.5">
                          <div className="w-1 h-1 bg-current rounded-full" />
                          {dayEntries.length > 1 && (
                            <div className="w-1 h-1 bg-current rounded-full" />
                          )}
                          {hasFavorite && (
                            <Heart className="w-2 h-2 fill-current text-destructive" />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
            }}
          />
        </CardContent>
      </Card>

      {/* Selected Date Entries */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {format(selectedDateObj, 'MMM d, yyyy')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDateEntries.length > 0 ? (
            <div className="space-y-4">
              {selectedDateEntries.map(entry => (
                <div
                  key={entry.id}
                  className="p-3 rounded-lg border border-border hover:bg-accent/50 cursor-pointer transition-colors"
                  onClick={() => onEditEntry(entry)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {entry.isFavorite && (
                        <Heart className="h-3 w-3 text-destructive fill-current" />
                      )}
                      {entry.mood && (
                        <span className="text-sm">{entry.mood.emoji}</span>
                      )}
                      {entry.weather && (
                        <span className="text-sm">{entry.weather.emoji}</span>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" onClick={(e) => {
                      e.stopPropagation();
                      onEditEntry(entry);
                    }}>
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  {entry.title && (
                    <h4 className="font-medium text-sm mb-1">{entry.title}</h4>
                  )}
                  
                  <p className="text-xs text-muted-foreground line-clamp-3">
                    {entry.content}
                  </p>

                  {entry.tags.length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {entry.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {entry.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{entry.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground mb-3">
                No entries for this date
              </p>
              <Button size="sm" onClick={() => onDateSelect(selectedDate)}>
                Create Entry
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}