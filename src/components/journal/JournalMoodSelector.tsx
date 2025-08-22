import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type Mood, MOOD_OPTIONS } from '@/types/journal';

interface JournalMoodSelectorProps {
  selectedMood?: Mood;
  onMoodSelect: (mood: Mood | undefined) => void;
}

export function JournalMoodSelector({ selectedMood, onMoodSelect }: JournalMoodSelectorProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium">How are you feeling?</h4>
      
      {selectedMood && (
        <div className="flex items-center justify-between">
          <Badge 
            variant="outline" 
            className="text-sm"
            style={{ backgroundColor: `${selectedMood.color}20`, borderColor: selectedMood.color }}
          >
            {selectedMood.emoji} {selectedMood.label}
          </Badge>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onMoodSelect(undefined)}
            className="text-xs"
          >
            Clear
          </Button>
        </div>
      )}

      <div className="grid grid-cols-5 gap-2">
        {MOOD_OPTIONS.map((mood) => (
          <Button
            key={mood.value}
            variant={selectedMood?.value === mood.value ? "default" : "outline"}
            size="sm"
            className="h-12 flex flex-col items-center justify-center p-1"
            onClick={() => onMoodSelect(mood)}
            title={mood.label}
          >
            <span className="text-lg mb-1">{mood.emoji}</span>
            <span className="text-xs">{mood.value}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}