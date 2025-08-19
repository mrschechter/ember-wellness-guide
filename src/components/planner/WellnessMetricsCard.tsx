import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, Moon, AlertTriangle, Plus, Calendar } from 'lucide-react';
import { type WellnessMetrics, type Symptom } from '@/types/dailyPlanner';

interface WellnessMetricsCardProps {
  metrics: WellnessMetrics;
  onUpdate: (metrics: WellnessMetrics) => void;
  disabled?: boolean;
}

export function WellnessMetricsCard({ metrics, onUpdate, disabled }: WellnessMetricsCardProps) {
  const [newSymptom, setNewSymptom] = useState('');

  const commonSymptoms = [
    'Bloating', 'Fatigue', 'Headache', 'Mood swings', 'Joint pain',
    'Brain fog', 'Insomnia', 'Digestive issues', 'Hot flashes',
    'Anxiety', 'Irritability', 'Food cravings', 'Low energy'
  ];

  const cyclePhases = [
    { value: 'menstrual', label: 'Menstrual (Days 1-5)' },
    { value: 'follicular', label: 'Follicular (Days 6-14)' },
    { value: 'ovulation', label: 'Ovulation (Days 14-16)' },
    { value: 'luteal', label: 'Luteal (Days 17-28)' }
  ];

  const updateField = (field: keyof WellnessMetrics, value: any) => {
    onUpdate({ ...metrics, [field]: value });
  };

  const addSymptom = (name: string) => {
    if (name.trim() && !metrics.symptoms.find(s => s.name === name)) {
      const symptom: Symptom = {
        name: name.trim(),
        severity: 5,
        notes: ''
      };
      onUpdate({
        ...metrics,
        symptoms: [...metrics.symptoms, symptom]
      });
      setNewSymptom('');
    }
  };

  const updateSymptom = (index: number, symptom: Symptom) => {
    const updated = [...metrics.symptoms];
    updated[index] = symptom;
    onUpdate({ ...metrics, symptoms: updated });
  };

  const removeSymptom = (index: number) => {
    const updated = metrics.symptoms.filter((_, i) => i !== index);
    onUpdate({ ...metrics, symptoms: updated });
  };

  const getSleepQualityEmoji = (quality: number) => {
    if (quality <= 3) return '😴';
    if (quality <= 6) return '😐';
    if (quality <= 8) return '😊';
    return '🌟';
  };

  const getStressLevelEmoji = (stress: number) => {
    if (stress <= 3) return '😌';
    if (stress <= 6) return '😐';
    if (stress <= 8) return '😰';
    return '🤯';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          Wellness Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sleep Quality */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center gap-2">
            <Moon className="h-4 w-4 text-blue-500" />
            Sleep Quality (Previous Night)
          </Label>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Slider
                value={[metrics.sleepQuality]}
                onValueChange={([value]) => updateField('sleepQuality', value)}
                max={10}
                min={1}
                step={1}
                disabled={disabled}
                className="w-full"
              />
            </div>
            <Badge variant="secondary" className="min-w-fit">
              {metrics.sleepQuality}/10 {getSleepQualityEmoji(metrics.sleepQuality)}
            </Badge>
          </div>
        </div>

        {/* Sleep Hours */}
        <div className="space-y-3">
          <Label htmlFor="sleep-hours">Hours of Sleep</Label>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Slider
                value={[metrics.sleepHours]}
                onValueChange={([value]) => updateField('sleepHours', value)}
                max={12}
                min={3}
                step={0.5}
                disabled={disabled}
                className="w-full"
              />
            </div>
            <Badge variant="secondary" className="min-w-fit">
              {metrics.sleepHours} hours
            </Badge>
          </div>
        </div>

        {/* Stress Level */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            Stress Level
          </Label>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Slider
                value={[metrics.stressLevel]}
                onValueChange={([value]) => updateField('stressLevel', value)}
                max={10}
                min={1}
                step={1}
                disabled={disabled}
                className="w-full"
              />
            </div>
            <Badge variant="secondary" className="min-w-fit">
              {metrics.stressLevel}/10 {getStressLevelEmoji(metrics.stressLevel)}
            </Badge>
          </div>
        </div>

        {/* Cycle Tracking */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4 text-pink-500" />
            Cycle Tracking
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="cycle-day">Cycle Day</Label>
              <Input
                id="cycle-day"
                type="number"
                placeholder="1-28"
                value={metrics.cycleDay || ''}
                onChange={(e) => updateField('cycleDay', Number(e.target.value) || undefined)}
                disabled={disabled}
                min={1}
                max={50}
              />
            </div>
            <div>
              <Label htmlFor="cycle-phase">Cycle Phase</Label>
              <Select
                value={metrics.cyclePhase || ''}
                onValueChange={(value) => updateField('cyclePhase', value)}
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select phase" />
                </SelectTrigger>
                <SelectContent>
                  {cyclePhases.map((phase) => (
                    <SelectItem key={phase.value} value={phase.value}>
                      {phase.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Symptoms Tracking */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Symptoms Tracking</Label>
          
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {commonSymptoms.map((symptom) => (
                <Button
                  key={symptom}
                  variant="outline"
                  size="sm"
                  onClick={() => addSymptom(symptom)}
                  disabled={disabled || metrics.symptoms.some(s => s.name === symptom)}
                  className="text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {symptom}
                </Button>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input
                placeholder="Add custom symptom..."
                value={newSymptom}
                onChange={(e) => setNewSymptom(e.target.value)}
                disabled={disabled}
                onKeyPress={(e) => e.key === 'Enter' && addSymptom(newSymptom)}
              />
              <Button 
                onClick={() => addSymptom(newSymptom)} 
                disabled={disabled || !newSymptom.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {metrics.symptoms.length > 0 && (
            <div className="space-y-3">
              {metrics.symptoms.map((symptom, index) => (
                <div key={index} className="p-3 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{symptom.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSymptom(index)}
                      disabled={disabled}
                      className="text-destructive hover:text-destructive"
                    >
                      Remove
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Severity (1-10)</Label>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Slider
                          value={[symptom.severity]}
                          onValueChange={([value]) => updateSymptom(index, { ...symptom, severity: value })}
                          max={10}
                          min={1}
                          step={1}
                          disabled={disabled}
                          className="w-full"
                        />
                      </div>
                      <Badge variant="outline">{symptom.severity}/10</Badge>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`symptom-notes-${index}`}>Notes (optional)</Label>
                    <Input
                      id={`symptom-notes-${index}`}
                      placeholder="Additional details..."
                      value={symptom.notes || ''}
                      onChange={(e) => updateSymptom(index, { ...symptom, notes: e.target.value })}
                      disabled={disabled}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}