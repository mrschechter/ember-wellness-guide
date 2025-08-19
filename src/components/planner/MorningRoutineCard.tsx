import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Sun, Droplets, Dumbbell, Brain, Smile, Zap, Plus } from 'lucide-react';
import { type MorningRoutine, type SupplementIntake } from '@/types/dailyPlanner';

interface MorningRoutineCardProps {
  routine: MorningRoutine;
  onUpdate: (routine: MorningRoutine) => void;
  disabled?: boolean;
}

export function MorningRoutineCard({ routine, onUpdate, disabled }: MorningRoutineCardProps) {
  const [newSupplement, setNewSupplement] = useState('');

  const defaultSupplements: Omit<SupplementIntake, 'taken'>[] = [
    { name: 'Vitamin D3', dosage: '5000 IU', time: 'morning' },
    { name: 'Magnesium', dosage: '400mg', time: 'evening' },
    { name: 'Omega-3', dosage: '1000mg', time: 'morning' },
    { name: 'B-Complex', dosage: '1 capsule', time: 'morning' },
    { name: 'Probiotics', dosage: '1 capsule', time: 'morning' }
  ];

  const addSupplement = () => {
    if (newSupplement.trim()) {
      const supplement: SupplementIntake = {
        name: newSupplement,
        dosage: '1 dose',
        time: 'morning',
        taken: false
      };
      onUpdate({
        ...routine,
        supplements: [...routine.supplements, supplement]
      });
      setNewSupplement('');
    }
  };

  const addDefaultSupplement = (supplement: Omit<SupplementIntake, 'taken'>) => {
    const newSupplement: SupplementIntake = {
      ...supplement,
      taken: false
    };
    onUpdate({
      ...routine,
      supplements: [...routine.supplements, newSupplement]
    });
  };

  const toggleSupplement = (index: number) => {
    const updated = [...routine.supplements];
    updated[index].taken = !updated[index].taken;
    onUpdate({ ...routine, supplements: updated });
  };

  const removeSupplement = (index: number) => {
    const updated = routine.supplements.filter((_, i) => i !== index);
    onUpdate({ ...routine, supplements: updated });
  };

  const updateField = (field: keyof MorningRoutine, value: any) => {
    onUpdate({ ...routine, [field]: value });
  };

  const getMoodEmoji = (rating: number) => {
    if (rating <= 2) return '😔';
    if (rating <= 4) return '😐';
    if (rating <= 6) return '🙂';
    if (rating <= 8) return '😊';
    return '😁';
  };

  const getEnergyEmoji = (rating: number) => {
    if (rating <= 2) return '🔋';
    if (rating <= 4) return '🔋🔋';
    if (rating <= 6) return '🔋🔋🔋';
    if (rating <= 8) return '⚡';
    return '⚡⚡';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sun className="h-5 w-5 text-warning" />
          Morning Routine
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Supplements */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Supplements</Label>
          
          {routine.supplements.length === 0 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Add your protocol supplements:</p>
              <div className="flex flex-wrap gap-2">
                {defaultSupplements.map((supplement, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => addDefaultSupplement(supplement)}
                    disabled={disabled}
                    className="text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {supplement.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            {routine.supplements.map((supplement, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={supplement.taken}
                    onCheckedChange={() => toggleSupplement(index)}
                    disabled={disabled}
                  />
                  <div>
                    <div className="font-medium">{supplement.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {supplement.dosage} • {supplement.time}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSupplement(index)}
                  disabled={disabled}
                  className="text-destructive hover:text-destructive"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Add custom supplement..."
              value={newSupplement}
              onChange={(e) => setNewSupplement(e.target.value)}
              disabled={disabled}
              onKeyPress={(e) => e.key === 'Enter' && addSupplement()}
            />
            <Button onClick={addSupplement} disabled={disabled || !newSupplement.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Water Intake */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center gap-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            Water Intake
          </Label>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Slider
                value={[routine.waterIntake]}
                onValueChange={([value]) => updateField('waterIntake', value)}
                max={12}
                step={1}
                disabled={disabled}
                className="w-full"
              />
            </div>
            <Badge variant="secondary" className="min-w-fit">
              {routine.waterIntake} glasses
            </Badge>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={i}
                className={`w-6 h-8 border rounded ${
                  i < routine.waterIntake ? 'bg-blue-500' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Exercise */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center gap-2">
            <Dumbbell className="h-4 w-4 text-green-500" />
            Movement/Exercise
          </Label>
          <div className="flex items-center space-x-3">
            <Checkbox
              checked={routine.exercise}
              onCheckedChange={(checked) => updateField('exercise', checked)}
              disabled={disabled}
            />
            <span>Completed morning movement</span>
          </div>
          {routine.exercise && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="exercise-type">Type</Label>
                <Input
                  id="exercise-type"
                  placeholder="e.g., Yoga, Walk, Strength"
                  value={routine.exerciseType || ''}
                  onChange={(e) => updateField('exerciseType', e.target.value)}
                  disabled={disabled}
                />
              </div>
              <div>
                <Label htmlFor="exercise-duration">Duration (min)</Label>
                <Input
                  id="exercise-duration"
                  type="number"
                  placeholder="30"
                  value={routine.exerciseDuration || ''}
                  onChange={(e) => updateField('exerciseDuration', Number(e.target.value))}
                  disabled={disabled}
                />
              </div>
            </div>
          )}
        </div>

        {/* Meditation */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center gap-2">
            <Brain className="h-4 w-4 text-purple-500" />
            Mindfulness/Meditation
          </Label>
          <div className="flex items-center space-x-3">
            <Checkbox
              checked={routine.meditation}
              onCheckedChange={(checked) => updateField('meditation', checked)}
              disabled={disabled}
            />
            <span>Completed mindfulness practice</span>
          </div>
          {routine.meditation && (
            <div>
              <Label htmlFor="meditation-duration">Duration (min)</Label>
              <Input
                id="meditation-duration"
                type="number"
                placeholder="10"
                value={routine.meditationDuration || ''}
                onChange={(e) => updateField('meditationDuration', Number(e.target.value))}
                disabled={disabled}
              />
            </div>
          )}
        </div>

        {/* Mood Rating */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center gap-2">
            <Smile className="h-4 w-4 text-yellow-500" />
            Mood Rating
          </Label>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Slider
                value={[routine.moodRating]}
                onValueChange={([value]) => updateField('moodRating', value)}
                max={10}
                min={1}
                step={1}
                disabled={disabled}
                className="w-full"
              />
            </div>
            <Badge variant="secondary" className="min-w-fit">
              {routine.moodRating}/10 {getMoodEmoji(routine.moodRating)}
            </Badge>
          </div>
        </div>

        {/* Energy Level */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center gap-2">
            <Zap className="h-4 w-4 text-orange-500" />
            Energy Level
          </Label>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Slider
                value={[routine.energyLevel]}
                onValueChange={([value]) => updateField('energyLevel', value)}
                max={10}
                min={1}
                step={1}
                disabled={disabled}
                className="w-full"
              />
            </div>
            <Badge variant="secondary" className="min-w-fit">
              {routine.energyLevel}/10 {getEnergyEmoji(routine.energyLevel)}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}