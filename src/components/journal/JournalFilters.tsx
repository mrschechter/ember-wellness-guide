import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Heart, Tag, Cloud } from 'lucide-react';
import { type JournalEntry, type JournalFilter, MOOD_OPTIONS, WEATHER_OPTIONS } from '@/types/journal';
import { format } from 'date-fns';

interface JournalFiltersProps {
  entries: JournalEntry[];
  filters: JournalFilter;
  onFiltersChange: (filters: JournalFilter) => void;
}

export function JournalFilters({ entries, filters, onFiltersChange }: JournalFiltersProps) {
  const [showDateRange, setShowDateRange] = useState(false);

  // Extract unique tags from all entries
  const allTags = Array.from(new Set(entries.flatMap(entry => entry.tags))).sort();

  const handleMoodToggle = (moodValue: number) => {
    const currentMoods = filters.mood || [];
    const newMoods = currentMoods.includes(moodValue)
      ? currentMoods.filter(m => m !== moodValue)
      : [...currentMoods, moodValue];
    
    onFiltersChange({
      ...filters,
      mood: newMoods.length > 0 ? newMoods : undefined
    });
  };

  const handleWeatherToggle = (weatherCondition: string) => {
    const currentWeather = filters.weather || [];
    const newWeather = currentWeather.includes(weatherCondition as any)
      ? currentWeather.filter(w => w !== weatherCondition)
      : [...currentWeather, weatherCondition as any];
    
    onFiltersChange({
      ...filters,
      weather: newWeather.length > 0 ? newWeather : undefined
    });
  };

  const handleTagToggle = (tag: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    
    onFiltersChange({
      ...filters,
      tags: newTags.length > 0 ? newTags : undefined
    });
  };

  const handleFavoritesToggle = () => {
    onFiltersChange({
      ...filters,
      favorites: filters.favorites ? undefined : true
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const activeFilterCount = [
    filters.mood?.length,
    filters.weather?.length,
    filters.tags?.length,
    filters.favorites ? 1 : 0,
    filters.dateRange ? 1 : 0
  ].filter(Boolean).reduce((sum, count) => sum + (count || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        {activeFilterCount > 0 && (
          <Button variant="outline" size="sm" onClick={clearAllFilters}>
            Clear All ({activeFilterCount})
          </Button>
        )}
      </div>

      {/* Favorites */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Heart className="h-4 w-4" />
          <span className="font-medium">Favorites</span>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="favorites"
            checked={filters.favorites || false}
            onCheckedChange={handleFavoritesToggle}
          />
          <label htmlFor="favorites" className="text-sm">
            Show only favorite entries
          </label>
        </div>
      </div>

      <Separator />

      {/* Date Range */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4" />
          <span className="font-medium">Date Range</span>
        </div>
        <Popover open={showDateRange} onOpenChange={setShowDateRange}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.dateRange
                ? `${format(filters.dateRange.start, 'MMM d')} - ${format(filters.dateRange.end, 'MMM d')}`
                : "Select date range"
              }
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={filters.dateRange ? {
                from: filters.dateRange.start,
                to: filters.dateRange.end
              } : undefined}
              onSelect={(range) => {
                if (range?.from && range?.to) {
                  onFiltersChange({
                    ...filters,
                    dateRange: { start: range.from, end: range.to }
                  });
                } else {
                  onFiltersChange({
                    ...filters,
                    dateRange: undefined
                  });
                }
                setShowDateRange(false);
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      <Separator />

      {/* Mood */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">😊</span>
          <span className="font-medium">Mood</span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {MOOD_OPTIONS.map((mood) => (
            <Button
              key={mood.value}
              variant={filters.mood?.includes(mood.value) ? "default" : "outline"}
              size="sm"
              className="h-12 flex flex-col items-center justify-center p-1"
              onClick={() => handleMoodToggle(mood.value)}
              title={mood.label}
            >
              <span className="text-lg mb-1">{mood.emoji}</span>
              <span className="text-xs">{mood.value}</span>
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Weather */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Cloud className="h-4 w-4" />
          <span className="font-medium">Weather</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {Object.entries(WEATHER_OPTIONS).map(([condition, weather]) => (
            <Button
              key={condition}
              variant={filters.weather?.includes(condition as any) ? "default" : "outline"}
              size="sm"
              className="h-12 flex flex-col items-center justify-center p-1"
              onClick={() => handleWeatherToggle(condition)}
              title={condition.replace('-', ' ')}
            >
              <span className="text-lg">{weather.emoji}</span>
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Tags */}
      {allTags.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <span className="font-medium">Tags</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <Badge
                key={tag}
                variant={filters.tags?.includes(tag) ? "default" : "outline"}
                className="cursor-pointer hover:bg-accent"
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}