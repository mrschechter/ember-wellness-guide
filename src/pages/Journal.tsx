import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { JournalTimeline } from '@/components/journal/JournalTimeline';
import { JournalCalendar } from '@/components/journal/JournalCalendar';
import { JournalEntry as JournalEntryComponent } from '@/components/journal/JournalEntry';
import { JournalFilters } from '@/components/journal/JournalFilters';
import { JournalSearch } from '@/components/journal/JournalSearch';
import { Plus, BookOpen, Calendar, Filter, Search } from 'lucide-react';
import { type JournalEntry, type JournalFilter } from '@/types/journal';

export default function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentView, setCurrentView] = useState<'timeline' | 'calendar' | 'entry'>('timeline');
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [filters, setFilters] = useState<JournalFilter>({});
  const [showFilters, setShowFilters] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // Load entries from localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem('journal-entries');
    if (savedEntries) {
      const parsed = JSON.parse(savedEntries);
      setEntries(parsed.map((entry: any) => ({
        ...entry,
        createdAt: new Date(entry.createdAt),
        updatedAt: new Date(entry.updatedAt)
      })));
    }
  }, []);

  // Save entries to localStorage
  const saveEntries = (updatedEntries: JournalEntry[]) => {
    setEntries(updatedEntries);
    localStorage.setItem('journal-entries', JSON.stringify(updatedEntries));
  };

  const handleCreateEntry = () => {
    setSelectedEntry(null);
    setCurrentView('entry');
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setCurrentView('entry');
  };

  const handleSaveEntry = (entry: JournalEntry) => {
    const updatedEntries = selectedEntry
      ? entries.map(e => e.id === entry.id ? entry : e)
      : [...entries, entry];
    
    saveEntries(updatedEntries);
    setCurrentView('timeline');
    setSelectedEntry(null);
  };

  const handleDeleteEntry = (entryId: string) => {
    const updatedEntries = entries.filter(e => e.id !== entryId);
    saveEntries(updatedEntries);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    const dayEntry = entries.find(e => e.date === date);
    if (dayEntry) {
      handleEditEntry(dayEntry);
    } else {
      handleCreateEntry();
    }
  };

  const filteredEntries = entries.filter(entry => {
    if (filters.searchTerm && !entry.content.toLowerCase().includes(filters.searchTerm.toLowerCase()) && 
        !entry.title?.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false;
    }
    if (filters.tags?.length && !filters.tags.some(tag => entry.tags.includes(tag))) {
      return false;
    }
    if (filters.mood?.length && (!entry.mood || !filters.mood.includes(entry.mood.value))) {
      return false;
    }
    if (filters.weather?.length && (!entry.weather || !filters.weather.includes(entry.weather.condition))) {
      return false;
    }
    if (filters.favorites && !entry.isFavorite) {
      return false;
    }
    if (filters.dateRange) {
      const entryDate = new Date(entry.date);
      if (entryDate < filters.dateRange.start || entryDate > filters.dateRange.end) {
        return false;
      }
    }
    return true;
  });

  if (currentView === 'entry') {
    return (
      <div className="min-h-screen bg-background">
        <JournalEntryComponent
          entry={selectedEntry}
          selectedDate={selectedDate}
          onSave={handleSaveEntry}
          onCancel={() => setCurrentView('timeline')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Journal</h1>
              <p className="text-muted-foreground">Capture your thoughts and track your wellness journey</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSearch(!showSearch)}
              className={showSearch ? "bg-accent" : ""}
            >
              <Search className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? "bg-accent" : ""}
            >
              <Filter className="h-4 w-4" />
            </Button>
            <Button onClick={handleCreateEntry} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Entry
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        {showSearch && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <JournalSearch
                onSearch={(searchTerm) => setFilters(prev => ({ ...prev, searchTerm }))}
              />
            </CardContent>
          </Card>
        )}

        {showFilters && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <JournalFilters
                entries={entries}
                filters={filters}
                onFiltersChange={setFilters}
              />
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <Tabs value={currentView} onValueChange={(value) => setCurrentView(value as any)}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Timeline
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Calendar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timeline">
            <JournalTimeline
              entries={filteredEntries}
              onEditEntry={handleEditEntry}
              onDeleteEntry={handleDeleteEntry}
            />
          </TabsContent>

          <TabsContent value="calendar">
            <JournalCalendar
              entries={filteredEntries}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              onEditEntry={handleEditEntry}
            />
          </TabsContent>
        </Tabs>

        {filteredEntries.length === 0 && (
          <Card className="mt-8">
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No journal entries found</h3>
              <p className="text-muted-foreground mb-4">
                {entries.length === 0
                  ? "Start your wellness journey by creating your first journal entry."
                  : "Try adjusting your filters or search terms to find entries."
                }
              </p>
              <Button onClick={handleCreateEntry}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Entry
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}