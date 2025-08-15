import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { type ProgressEntry } from '@/types/assessment';
import { Plus, TrendingUp } from 'lucide-react';

export function ProgressTracker() {
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    energy: 5,
    sleep: 5,
    mood: 5,
    vitality: 5
  });

  useEffect(() => {
    const stored = localStorage.getItem('emberProgressEntries');
    if (stored) {
      try {
        setEntries(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading progress entries:', error);
      }
    }
  }, []);

  const saveEntries = (newEntries: ProgressEntry[]) => {
    setEntries(newEntries);
    localStorage.setItem('emberProgressEntries', JSON.stringify(newEntries));
  };

  const handleAddEntry = () => {
    const entry: ProgressEntry = {
      date: newEntry.date,
      energy: Number(newEntry.energy),
      sleep: Number(newEntry.sleep),
      mood: Number(newEntry.mood),
      vitality: Number(newEntry.vitality)
    };

    const updatedEntries = [...entries, entry].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    saveEntries(updatedEntries);
    
    // Reset form
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      energy: 5,
      sleep: 5,
      mood: 5,
      vitality: 5
    });
  };

  const getAverageImprovement = () => {
    if (entries.length < 2) return null;
    
    const recent = entries.slice(0, 3);
    const older = entries.slice(-3);
    
    if (recent.length === 0 || older.length === 0) return null;
    
    const recentAvg = recent.reduce((sum, entry) => 
      sum + entry.energy + entry.sleep + entry.mood + entry.vitality, 0
    ) / (recent.length * 4);
    
    const olderAvg = older.reduce((sum, entry) => 
      sum + entry.energy + entry.sleep + entry.mood + entry.vitality, 0
    ) / (older.length * 4);
    
    return recentAvg - olderAvg;
  };

  const improvement = getAverageImprovement();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Progress Tracker
          </CardTitle>
          <p className="text-muted-foreground">
            Track your weekly progress to monitor improvement over time.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Entry Form */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={newEntry.date}
                onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="energy">Energy (1-10)</Label>
              <Input
                id="energy"
                type="number"
                min="1"
                max="10"
                value={newEntry.energy}
                onChange={(e) => setNewEntry({ ...newEntry, energy: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="sleep">Sleep Quality (1-10)</Label>
              <Input
                id="sleep"
                type="number"
                min="1"
                max="10"
                value={newEntry.sleep}
                onChange={(e) => setNewEntry({ ...newEntry, sleep: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="mood">Mood (1-10)</Label>
              <Input
                id="mood"
                type="number"
                min="1"
                max="10"
                value={newEntry.mood}
                onChange={(e) => setNewEntry({ ...newEntry, mood: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="vitality">Overall Vitality (1-10)</Label>
              <Input
                id="vitality"
                type="number"
                min="1"
                max="10"
                value={newEntry.vitality}
                onChange={(e) => setNewEntry({ ...newEntry, vitality: Number(e.target.value) })}
              />
            </div>
          </div>
          
          <Button onClick={handleAddEntry} className="w-full flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Entry
          </Button>

          {/* Progress Summary */}
          {improvement !== null && (
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Progress Summary</h4>
              <p className="text-sm text-muted-foreground">
                {improvement > 0 ? (
                  <span className="text-success">
                    ↗ Improvement of {improvement.toFixed(1)} points on average
                  </span>
                ) : improvement < 0 ? (
                  <span className="text-warning">
                    ↘ Decrease of {Math.abs(improvement).toFixed(1)} points on average
                  </span>
                ) : (
                  <span>→ Stable progress</span>
                )}
              </p>
            </div>
          )}

          {/* Entries Table */}
          {entries.length > 0 && (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Energy</TableHead>
                    <TableHead>Sleep</TableHead>
                    <TableHead>Mood</TableHead>
                    <TableHead>Vitality</TableHead>
                    <TableHead>Average</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.slice(0, 10).map((entry, index) => {
                    const average = (entry.energy + entry.sleep + entry.mood + entry.vitality) / 4;
                    return (
                      <TableRow key={index}>
                        <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                        <TableCell>{entry.energy}</TableCell>
                        <TableCell>{entry.sleep}</TableCell>
                        <TableCell>{entry.mood}</TableCell>
                        <TableCell>{entry.vitality}</TableCell>
                        <TableCell className="font-medium">{average.toFixed(1)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {entries.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No progress entries yet. Add your first entry to start tracking!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}