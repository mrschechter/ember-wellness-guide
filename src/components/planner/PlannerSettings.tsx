import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Settings, Download, Trash2, Calendar } from 'lucide-react';
import { type TrackingPeriod, type DailyEntry } from '@/types/dailyPlanner';

interface PlannerSettingsProps {
  trackingPeriod: TrackingPeriod;
  onTrackingPeriodChange: (period: TrackingPeriod) => void;
  entries: DailyEntry[];
}

export function PlannerSettings({ trackingPeriod, onTrackingPeriodChange, entries }: PlannerSettingsProps) {
  const trackingPeriods: { value: TrackingPeriod; label: string; description: string }[] = [
    { 
      value: '90-day', 
      label: '90-Day Protocol', 
      description: 'Intensive transformation period with daily tracking' 
    },
    { 
      value: '6-month', 
      label: '6-Month Journey', 
      description: 'Extended healing and habit formation' 
    },
    { 
      value: '1-year', 
      label: '1-Year Tracking', 
      description: 'Long-term lifestyle maintenance and optimization' 
    },
    { 
      value: 'custom', 
      label: 'Custom Range', 
      description: 'User-defined tracking period' 
    }
  ];

  const exportData = () => {
    const dataToExport = {
      trackingPeriod,
      entries,
      exportDate: new Date().toISOString(),
      summary: {
        totalDays: entries.length,
        avgCompletion: entries.length ? entries.reduce((sum, e) => sum + e.completionScore, 0) / entries.length : 0,
        avgWellness: entries.length ? entries.reduce((sum, e) => sum + e.eveningReflection.overallWellness, 0) / entries.length : 0
      }
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ember-wellness-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearData = () => {
    if (window.confirm('Are you sure you want to clear all your data? This action cannot be undone.')) {
      localStorage.removeItem('emberDailyEntries');
      window.location.reload();
    }
  };

  const getProgressDescription = () => {
    const startDate = entries.length > 0 ? new Date(Math.min(...entries.map(e => new Date(e.date).getTime()))) : null;
    const daysPassed = startDate ? Math.floor((new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;
    
    switch (trackingPeriod) {
      case '90-day':
        return `${daysPassed}/90 days completed (${Math.round((daysPassed / 90) * 100)}%)`;
      case '6-month':
        return `${daysPassed}/180 days completed (${Math.round((daysPassed / 180) * 100)}%)`;
      case '1-year':
        return `${daysPassed}/365 days completed (${Math.round((daysPassed / 365) * 100)}%)`;
      default:
        return `${daysPassed} days of tracking`;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Planner Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tracking Period */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Tracking Period</Label>
            <Select value={trackingPeriod} onValueChange={onTrackingPeriodChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {trackingPeriods.map((period) => (
                  <SelectItem key={period.value} value={period.value}>
                    <div>
                      <div className="font-medium">{period.label}</div>
                      <div className="text-xs text-muted-foreground">{period.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {entries.length > 0 && (
              <Badge variant="secondary" className="mt-2">
                {getProgressDescription()}
              </Badge>
            )}
          </div>

          {/* Progress Summary */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Progress Summary</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 border rounded-lg">
                <div className="text-2xl font-bold">{entries.length}</div>
                <div className="text-xs text-muted-foreground">Total Days</div>
              </div>
              
              <div className="text-center p-3 border rounded-lg">
                <div className="text-2xl font-bold">
                  {entries.length ? Math.round(entries.reduce((sum, e) => sum + e.completionScore, 0) / entries.length) : 0}%
                </div>
                <div className="text-xs text-muted-foreground">Avg Completion</div>
              </div>
              
              <div className="text-center p-3 border rounded-lg">
                <div className="text-2xl font-bold">
                  {entries.length ? Math.round(entries.reduce((sum, e) => sum + e.eveningReflection.overallWellness, 0) / entries.length) : 0}
                </div>
                <div className="text-xs text-muted-foreground">Avg Wellness</div>
              </div>
              
              <div className="text-center p-3 border rounded-lg">
                <div className="text-2xl font-bold">
                  {entries.filter(e => e.completionScore >= 80).length}
                </div>
                <div className="text-xs text-muted-foreground">Great Days</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3">
            <Button onClick={exportData} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Data (JSON)
            </Button>
            
            <Button 
              onClick={clearData} 
              variant="destructive" 
              className="flex items-center gap-2"
              disabled={entries.length === 0}
            >
              <Trash2 className="h-4 w-4" />
              Clear All Data
            </Button>
          </div>
          
          <div className="p-3 bg-muted rounded-lg text-sm text-muted-foreground">
            <p className="mb-2">🔒 Your data is stored locally on your device for privacy.</p>
            <p>Export your data regularly to prevent loss and share with healthcare providers.</p>
          </div>
        </CardContent>
      </Card>

      {/* Future Features */}
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Sync with calendar apps</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📱</span>
              <span>Mobile app notifications</span>
            </div>
            <div className="flex items-center gap-2">
              <span>👩‍⚕️</span>
              <span>Share reports with healthcare providers</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📊</span>
              <span>Advanced analytics and insights</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🏆</span>
              <span>Achievement badges and milestones</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}