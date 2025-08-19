import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { UtensilsCrossed, Camera, Plus, Trash2 } from 'lucide-react';
import { type MealPlan, type Meal, type Snack } from '@/types/dailyPlanner';

interface MealPlanCardProps {
  mealPlan: MealPlan;
  onUpdate: (mealPlan: MealPlan) => void;
  disabled?: boolean;
}

export function MealPlanCard({ mealPlan, onUpdate, disabled }: MealPlanCardProps) {
  const updateMeal = (mealType: 'breakfast' | 'lunch' | 'dinner', meal: Meal) => {
    onUpdate({
      ...mealPlan,
      [mealType]: meal
    });
  };

  const addSnack = () => {
    const newSnack: Snack = {
      name: '',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      protocolAligned: false
    };
    onUpdate({
      ...mealPlan,
      snacks: [...mealPlan.snacks, newSnack]
    });
  };

  const updateSnack = (index: number, snack: Snack) => {
    const updated = [...mealPlan.snacks];
    updated[index] = snack;
    onUpdate({
      ...mealPlan,
      snacks: updated
    });
  };

  const removeSnack = (index: number) => {
    const updated = mealPlan.snacks.filter((_, i) => i !== index);
    onUpdate({
      ...mealPlan,
      snacks: updated
    });
  };

  const MealSection = ({ 
    title, 
    meal, 
    onMealUpdate, 
    icon 
  }: { 
    title: string; 
    meal: Meal; 
    onMealUpdate: (meal: Meal) => void;
    icon: React.ReactNode;
  }) => (
    <div className="space-y-4 p-4 border rounded-lg">
      <Label className="text-base font-medium flex items-center gap-2">
        {icon}
        {title}
      </Label>
      
      <div className="space-y-3">
        <div>
          <Label htmlFor={`${title}-planned`}>Planned</Label>
          <Textarea
            id={`${title}-planned`}
            placeholder="What are you planning to eat?"
            value={meal.planned}
            onChange={(e) => onMealUpdate({ ...meal, planned: e.target.value })}
            disabled={disabled}
            rows={2}
          />
        </div>

        {meal.planned && (
          <>
            <div>
              <Label htmlFor={`${title}-actual`}>Actual (optional)</Label>
              <Textarea
                id={`${title}-actual`}
                placeholder="What did you actually eat?"
                value={meal.actual || ''}
                onChange={(e) => onMealUpdate({ ...meal, actual: e.target.value })}
                disabled={disabled}
                rows={2}
              />
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                checked={meal.protocolAligned}
                onCheckedChange={(checked) => onMealUpdate({ ...meal, protocolAligned: !!checked })}
                disabled={disabled}
              />
              <span className="text-sm">Protocol-aligned meal</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Hunger Before (1-10)</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[meal.hungerBefore]}
                    onValueChange={([value]) => onMealUpdate({ ...meal, hungerBefore: value })}
                    max={10}
                    min={1}
                    step={1}
                    disabled={disabled}
                    className="flex-1"
                  />
                  <Badge variant="outline">{meal.hungerBefore}</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Satiety After (1-10)</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[meal.satietyAfter]}
                    onValueChange={([value]) => onMealUpdate({ ...meal, satietyAfter: value })}
                    max={10}
                    min={1}
                    step={1}
                    disabled={disabled}
                    className="flex-1"
                  />
                  <Badge variant="outline">{meal.satietyAfter}</Badge>
                </div>
              </div>
            </div>

            <Button variant="outline" size="sm" disabled={disabled}>
              <Camera className="h-4 w-4 mr-2" />
              Add Photo
            </Button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UtensilsCrossed className="h-5 w-5 text-green-500" />
          Meal Planning & Tracking
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          <MealSection
            title="Breakfast"
            meal={mealPlan.breakfast}
            onMealUpdate={(meal) => updateMeal('breakfast', meal)}
            icon={<span className="text-lg">🌅</span>}
          />
          
          <MealSection
            title="Lunch"
            meal={mealPlan.lunch}
            onMealUpdate={(meal) => updateMeal('lunch', meal)}
            icon={<span className="text-lg">☀️</span>}
          />
          
          <MealSection
            title="Dinner"
            meal={mealPlan.dinner}
            onMealUpdate={(meal) => updateMeal('dinner', meal)}
            icon={<span className="text-lg">🌙</span>}
          />
        </div>

        {/* Snacks */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">Snacks</Label>
            <Button variant="outline" size="sm" onClick={addSnack} disabled={disabled}>
              <Plus className="h-4 w-4 mr-2" />
              Add Snack
            </Button>
          </div>

          {mealPlan.snacks.length > 0 && (
            <div className="space-y-3">
              {mealPlan.snacks.map((snack, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <Input
                    placeholder="Snack name"
                    value={snack.name}
                    onChange={(e) => updateSnack(index, { ...snack, name: e.target.value })}
                    disabled={disabled}
                    className="flex-1"
                  />
                  <Input
                    type="time"
                    value={snack.time}
                    onChange={(e) => updateSnack(index, { ...snack, time: e.target.value })}
                    disabled={disabled}
                    className="w-32"
                  />
                  <Checkbox
                    checked={snack.protocolAligned}
                    onCheckedChange={(checked) => updateSnack(index, { ...snack, protocolAligned: !!checked })}
                    disabled={disabled}
                  />
                  <span className="text-sm text-muted-foreground min-w-fit">Protocol</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSnack(index)}
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

        {/* Protocol Suggestions */}
        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Protocol-Aligned Meal Ideas</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• High-protein breakfast with healthy fats</p>
            <p>• Balanced lunch with complex carbs and vegetables</p>
            <p>• Light dinner with focus on easy digestion</p>
            <p>• Anti-inflammatory spices and herbs</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}