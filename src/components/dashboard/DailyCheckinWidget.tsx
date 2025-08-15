import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { DailyCheckin, UserProtocol } from '@/types/progress';

interface DailyCheckinWidgetProps {
  userId: string;
}

export function DailyCheckinWidget({ userId }: DailyCheckinWidgetProps) {
  const [todayCheckin, setTodayCheckin] = useState<Partial<DailyCheckin>>({
    energy_morning: 5,
    energy_afternoon: 5,
    energy_evening: 5,
    mood_rating: 5,
    sleep_quality: 5,
    stress_level: 5,
    water_intake: 0,
    exercise_completed: false,
    sunlight_exposure: false,
    stress_management: false,
    protein_meals: 0,
    screen_free_evening: false,
  });
  const [supplements, setSupplements] = useState<Record<string, { morning: boolean; evening: boolean }>>({});
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const protocol: UserProtocol = {
    morningSupplements: [
      { name: 'Vitamin D3', dosage: '5000 IU' },
      { name: 'Magnesium', dosage: '400mg' },
      { name: 'B-Complex', dosage: '1 capsule' },
    ],
    eveningSupplements: [
      { name: 'Magnesium Glycinate', dosage: '200mg' },
      { name: 'Melatonin', dosage: '3mg' },
    ],
  };

  useEffect(() => {
    const checkTodayCheckin = async () => {
      const today = new Date().toISOString().split('T')[0];
      
      // Check if user already checked in today
      const { data: checkin } = await supabase
        .from('daily_checkins')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today)
        .single();

      if (checkin) {
        setTodayCheckin(checkin);
        setHasCheckedInToday(true);
      }

      // Load supplement compliance for today
      const { data: supplementData } = await supabase
        .from('supplement_compliance')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today);

      if (supplementData) {
        const supplementMap: Record<string, { morning: boolean; evening: boolean }> = {};
        supplementData.forEach(item => {
          supplementMap[item.supplement_name] = {
            morning: item.morning_taken,
            evening: item.evening_taken,
          };
        });
        setSupplements(supplementMap);
      }
    };

    checkTodayCheckin();
  }, [userId]);

  const handleSaveCheckin = async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Save daily check-in
      const { error: checkinError } = await supabase
        .from('daily_checkins')
        .upsert({
          user_id: userId,
          date: today,
          ...todayCheckin,
        });

      if (checkinError) throw checkinError;

      // Save supplement compliance
      const allSupplements = [...protocol.morningSupplements, ...protocol.eveningSupplements];
      const supplementPromises = allSupplements.map(supplement => {
        const compliance = supplements[supplement.name] || { morning: false, evening: false };
        return supabase
          .from('supplement_compliance')
          .upsert({
            user_id: userId,
            date: today,
            supplement_name: supplement.name,
            morning_taken: compliance.morning,
            evening_taken: compliance.evening,
          });
      });

      await Promise.all(supplementPromises);

      setHasCheckedInToday(true);
      toast({
        title: "Check-in Saved!",
        description: "Your daily progress has been recorded.",
      });
    } catch (error) {
      console.error('Error saving check-in:', error);
      toast({
        title: "Error",
        description: "Failed to save your check-in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSupplement = (name: string, type: 'morning' | 'evening', taken: boolean) => {
    setSupplements(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        [type]: taken,
      }
    }));
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Today's Check-in</h2>
        {hasCheckedInToday && (
          <div className="text-sm text-green-600 font-medium">✅ Completed</div>
        )}
      </div>

      <div className="space-y-6">
        {/* Energy Levels */}
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Energy Levels</h3>
          
          <div className="space-y-3">
            <Label>Morning Energy: {todayCheckin.energy_morning}/10</Label>
            <Slider
              value={[todayCheckin.energy_morning || 5]}
              onValueChange={(value) => setTodayCheckin(prev => ({ ...prev, energy_morning: value[0] }))}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <Label>Afternoon Energy: {todayCheckin.energy_afternoon}/10</Label>
            <Slider
              value={[todayCheckin.energy_afternoon || 5]}
              onValueChange={(value) => setTodayCheckin(prev => ({ ...prev, energy_afternoon: value[0] }))}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <Label>Evening Energy: {todayCheckin.energy_evening}/10</Label>
            <Slider
              value={[todayCheckin.energy_evening || 5]}
              onValueChange={(value) => setTodayCheckin(prev => ({ ...prev, energy_evening: value[0] }))}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
          </div>
        </div>

        {/* Well-being Metrics */}
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Well-being</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Mood: {todayCheckin.mood_rating}/10</Label>
              <Slider
                value={[todayCheckin.mood_rating || 5]}
                onValueChange={(value) => setTodayCheckin(prev => ({ ...prev, mood_rating: value[0] }))}
                max={10}
                min={1}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <Label>Sleep Quality: {todayCheckin.sleep_quality}/10</Label>
              <Slider
                value={[todayCheckin.sleep_quality || 5]}
                onValueChange={(value) => setTodayCheckin(prev => ({ ...prev, sleep_quality: value[0] }))}
                max={10}
                min={1}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <Label>Stress Level: {todayCheckin.stress_level}/10</Label>
              <Slider
                value={[todayCheckin.stress_level || 5]}
                onValueChange={(value) => setTodayCheckin(prev => ({ ...prev, stress_level: value[0] }))}
                max={10}
                min={1}
                step={1}
              />
            </div>
          </div>
        </div>

        {/* Morning Supplements */}
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Morning Supplements</h3>
          <div className="space-y-2">
            {protocol.morningSupplements.map(supplement => (
              <div key={supplement.name} className="flex items-center space-x-2">
                <Checkbox
                  checked={supplements[supplement.name]?.morning || false}
                  onCheckedChange={(checked) => updateSupplement(supplement.name, 'morning', checked as boolean)}
                />
                <Label className="flex-1">
                  {supplement.name} ({supplement.dosage})
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Evening Supplements */}
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Evening Supplements</h3>
          <div className="space-y-2">
            {protocol.eveningSupplements.map(supplement => (
              <div key={supplement.name} className="flex items-center space-x-2">
                <Checkbox
                  checked={supplements[supplement.name]?.evening || false}
                  onCheckedChange={(checked) => updateSupplement(supplement.name, 'evening', checked as boolean)}
                />
                <Label className="flex-1">
                  {supplement.name} ({supplement.dosage})
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Lifestyle Habits */}
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Lifestyle Habits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={todayCheckin.sunlight_exposure || false}
                onCheckedChange={(checked) => setTodayCheckin(prev => ({ ...prev, sunlight_exposure: checked as boolean }))}
              />
              <Label>☀️ Sunlight exposure (15+ minutes)</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                checked={todayCheckin.exercise_completed || false}
                onCheckedChange={(checked) => setTodayCheckin(prev => ({ ...prev, exercise_completed: checked as boolean }))}
              />
              <Label>🚶 Movement/exercise</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                checked={todayCheckin.stress_management || false}
                onCheckedChange={(checked) => setTodayCheckin(prev => ({ ...prev, stress_management: checked as boolean }))}
              />
              <Label>🧘 Stress management practice</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                checked={todayCheckin.screen_free_evening || false}
                onCheckedChange={(checked) => setTodayCheckin(prev => ({ ...prev, screen_free_evening: checked as boolean }))}
              />
              <Label>📱 Screen-free evening</Label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="water-intake">💧 Water intake (glasses)</Label>
              <Input
                id="water-intake"
                type="number"
                value={todayCheckin.water_intake || 0}
                onChange={(e) => setTodayCheckin(prev => ({ ...prev, water_intake: parseInt(e.target.value) || 0 }))}
                min="0"
                max="20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="protein-meals">🥩 Protein-rich meals</Label>
              <Input
                id="protein-meals"
                type="number"
                value={todayCheckin.protein_meals || 0}
                onChange={(e) => setTodayCheckin(prev => ({ ...prev, protein_meals: parseInt(e.target.value) || 0 }))}
                min="0"
                max="10"
              />
            </div>
          </div>
        </div>

        <Button 
          onClick={handleSaveCheckin} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Saving...' : hasCheckedInToday ? 'Update Check-in' : 'Save Today\'s Check-in'}
        </Button>
      </div>
    </Card>
  );
}