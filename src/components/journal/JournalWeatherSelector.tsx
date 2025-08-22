import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { type Weather, WEATHER_OPTIONS } from '@/types/journal';

interface JournalWeatherSelectorProps {
  selectedWeather?: Weather;
  onWeatherSelect: (weather: Weather | undefined) => void;
}

export function JournalWeatherSelector({ selectedWeather, onWeatherSelect }: JournalWeatherSelectorProps) {
  const handleWeatherSelect = (condition: Weather['condition']) => {
    const weather = { ...WEATHER_OPTIONS[condition] };
    onWeatherSelect(weather);
  };

  const handleTemperatureChange = (temperature: string) => {
    if (selectedWeather) {
      const temp = temperature ? parseInt(temperature) : undefined;
      onWeatherSelect({
        ...selectedWeather,
        temperature: temp
      });
    }
  };

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium">What's the weather like?</h4>
      
      {selectedWeather && (
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-sm">
            {selectedWeather.emoji} {selectedWeather.condition.replace('-', ' ')}
            {selectedWeather.temperature && ` ${selectedWeather.temperature}°`}
          </Badge>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onWeatherSelect(undefined)}
            className="text-xs"
          >
            Clear
          </Button>
        </div>
      )}

      <div className="grid grid-cols-4 gap-2">
        {Object.entries(WEATHER_OPTIONS).map(([condition, weather]) => (
          <Button
            key={condition}
            variant={selectedWeather?.condition === condition ? "default" : "outline"}
            size="sm"
            className="h-12 flex flex-col items-center justify-center p-1"
            onClick={() => handleWeatherSelect(condition as Weather['condition'])}
            title={condition.replace('-', ' ')}
          >
            <span className="text-lg">{weather.emoji}</span>
          </Button>
        ))}
      </div>

      {selectedWeather && (
        <div className="pt-2">
          <Input
            type="number"
            placeholder="Temperature (°F)"
            value={selectedWeather.temperature || ''}
            onChange={(e) => handleTemperatureChange(e.target.value)}
            className="text-sm"
          />
        </div>
      )}
    </div>
  );
}