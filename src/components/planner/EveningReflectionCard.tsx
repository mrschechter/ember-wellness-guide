import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Moon, Star, Target, Heart, Plus, Trash2 } from 'lucide-react';
import { type EveningReflection } from '@/types/dailyPlanner';

interface EveningReflectionCardProps {
  reflection: EveningReflection;
  onUpdate: (reflection: EveningReflection) => void;
  disabled?: boolean;
}

export function EveningReflectionCard({ reflection, onUpdate, disabled }: EveningReflectionCardProps) {
  const [newWin, setNewWin] = useState('');
  const [newChallenge, setNewChallenge] = useState('');
  const [newIntention, setNewIntention] = useState('');
  const [newGratitude, setNewGratitude] = useState('');

  const addItem = (type: 'dailyWins' | 'challenges' | 'tomorrowIntentions' | 'gratitude', value: string) => {
    if (value.trim()) {
      onUpdate({
        ...reflection,
        [type]: [...reflection[type], value.trim()]
      });
      
      // Reset the corresponding input
      switch (type) {
        case 'dailyWins': setNewWin(''); break;
        case 'challenges': setNewChallenge(''); break;
        case 'tomorrowIntentions': setNewIntention(''); break;
        case 'gratitude': setNewGratitude(''); break;
      }
    }
  };

  const removeItem = (type: 'dailyWins' | 'challenges' | 'tomorrowIntentions' | 'gratitude', index: number) => {
    const updated = reflection[type].filter((_, i) => i !== index);
    onUpdate({ ...reflection, [type]: updated });
  };

  const updateWellness = (value: number) => {
    onUpdate({ ...reflection, overallWellness: value });
  };

  const getWellnessColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    if (score >= 40) return 'text-orange-500';
    return 'text-destructive';
  };

  const getWellnessEmoji = (score: number) => {
    if (score >= 80) return '🌟';
    if (score >= 60) return '😊';
    if (score >= 40) return '😐';
    return '😔';
  };

  const ListSection = ({ 
    title, 
    items, 
    newValue, 
    setNewValue, 
    onAdd, 
    onRemove, 
    placeholder,
    icon 
  }: {
    title: string;
    items: string[];
    newValue: string;
    setNewValue: (value: string) => void;
    onAdd: () => void;
    onRemove: (index: number) => void;
    placeholder: string;
    icon: React.ReactNode;
  }) => (
    <div className="space-y-3">
      <Label className="text-base font-medium flex items-center gap-2">
        {icon}
        {title}
      </Label>
      
      <div className="flex gap-2">
        <Input
          placeholder={placeholder}
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          disabled={disabled}
          onKeyPress={(e) => e.key === 'Enter' && onAdd()}
        />
        <Button onClick={onAdd} disabled={disabled || !newValue.trim()}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {items.length > 0 && (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <span className="flex-1">{item}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(index)}
                disabled={disabled}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Moon className="h-5 w-5 text-blue-500" />
          Evening Reflection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Daily Wins */}
        <ListSection
          title="Daily Wins"
          items={reflection.dailyWins}
          newValue={newWin}
          setNewValue={setNewWin}
          onAdd={() => addItem('dailyWins', newWin)}
          onRemove={(index) => removeItem('dailyWins', index)}
          placeholder="What went well today?"
          icon={<Star className="h-4 w-4 text-yellow-500" />}
        />

        {/* Challenges */}
        <ListSection
          title="Challenges Faced"
          items={reflection.challenges}
          newValue={newChallenge}
          setNewValue={setNewChallenge}
          onAdd={() => addItem('challenges', newChallenge)}
          onRemove={(index) => removeItem('challenges', index)}
          placeholder="What was difficult today?"
          icon={<Target className="h-4 w-4 text-orange-500" />}
        />

        {/* Tomorrow's Intentions */}
        <ListSection
          title="Tomorrow's Intentions"
          items={reflection.tomorrowIntentions}
          newValue={newIntention}
          setNewValue={setNewIntention}
          onAdd={() => addItem('tomorrowIntentions', newIntention)}
          onRemove={(index) => removeItem('tomorrowIntentions', index)}
          placeholder="What do you want to focus on tomorrow?"
          icon={<Target className="h-4 w-4 text-blue-500" />}
        />

        {/* Gratitude */}
        <ListSection
          title="Gratitude Practice"
          items={reflection.gratitude}
          newValue={newGratitude}
          setNewValue={setNewGratitude}
          onAdd={() => addItem('gratitude', newGratitude)}
          onRemove={(index) => removeItem('gratitude', index)}
          placeholder="What are you grateful for?"
          icon={<Heart className="h-4 w-4 text-red-500" />}
        />

        {/* Overall Wellness Score */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Overall Wellness Score</Label>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Slider
                value={[reflection.overallWellness]}
                onValueChange={([value]) => updateWellness(value)}
                max={100}
                min={0}
                step={5}
                disabled={disabled}
                className="w-full"
              />
            </div>
            <Badge variant="secondary" className={`min-w-fit ${getWellnessColor(reflection.overallWellness)}`}>
              {reflection.overallWellness}/100 {getWellnessEmoji(reflection.overallWellness)}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground">
            How do you feel about your overall wellness today?
          </div>
        </div>

        {/* Wellness Insights */}
        {reflection.overallWellness > 0 && (
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Wellness Insights</h4>
            <div className="text-sm text-muted-foreground">
              {reflection.overallWellness >= 80 && (
                <p>🌟 Excellent! You're feeling great today. Keep up the fantastic work!</p>
              )}
              {reflection.overallWellness >= 60 && reflection.overallWellness < 80 && (
                <p>😊 Good day! You're on the right track. Small improvements can make a big difference.</p>
              )}
              {reflection.overallWellness >= 40 && reflection.overallWellness < 60 && (
                <p>😐 Average day. Consider what you could adjust tomorrow to feel better.</p>
              )}
              {reflection.overallWellness < 40 && (
                <p>💙 Tough day. Remember that tomorrow is a fresh start. Be gentle with yourself.</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}