import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { JournalMoodSelector } from './JournalMoodSelector';
import { JournalWeatherSelector } from './JournalWeatherSelector';
import { JournalPhotoUpload } from './JournalPhotoUpload';
import { JournalTemplateSelector } from './JournalTemplateSelector';
import { Save, ArrowLeft, Heart, Tag, MapPin, Calendar } from 'lucide-react';
import { type JournalEntry as JournalEntryType, type Mood, type Weather, type JournalTemplate } from '@/types/journal';

interface JournalEntryProps {
  entry?: JournalEntryType | null;
  selectedDate: string;
  onSave: (entry: JournalEntryType) => void;
  onCancel: () => void;
}

export function JournalEntry({ entry, selectedDate, onSave, onCancel }: JournalEntryProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<Mood | undefined>();
  const [weather, setWeather] = useState<Weather | undefined>();
  const [location, setLocation] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<JournalTemplate | null>(null);

  useEffect(() => {
    if (entry) {
      setTitle(entry.title || '');
      setContent(entry.content);
      setMood(entry.mood);
      setWeather(entry.weather);
      setLocation(entry.location || '');
      setPhotos(entry.photos);
      setTags(entry.tags);
      setIsFavorite(entry.isFavorite);
    } else {
      // Reset for new entry
      setTitle('');
      setContent('');
      setMood(undefined);
      setWeather(undefined);
      setLocation('');
      setPhotos([]);
      setTags([]);
      setIsFavorite(false);
    }
  }, [entry]);

  const handleSave = () => {
    if (!content.trim()) return;

    const newEntry: JournalEntryType = {
      id: entry?.id || `entry-${Date.now()}`,
      title: title.trim() || undefined,
      content: content.trim(),
      date: selectedDate,
      createdAt: entry?.createdAt || new Date(),
      updatedAt: new Date(),
      mood,
      weather,
      location: location.trim() || undefined,
      photos,
      tags,
      isFavorite,
      template: selectedTemplate || undefined
    };

    onSave(newEntry);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTemplateSelect = (template: JournalTemplate) => {
    setSelectedTemplate(template);
    if (!content) {
      setContent(template.prompts.map(prompt => `${prompt}\n\n`).join(''));
    }
  };

  const dateObj = new Date(selectedDate);
  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onCancel} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Journal
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFavorite(!isFavorite)}
              className={isFavorite ? "text-destructive" : ""}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
            </Button>
            <Button onClick={handleSave} disabled={!content.trim()} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Entry
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4" />
                  {dateObj.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                  {isToday && <Badge variant="secondary">Today</Badge>}
                </div>
                <Input
                  placeholder="Give your entry a title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-xl font-semibold border-none px-0 focus-visible:ring-0"
                />
              </CardHeader>
              <CardContent>
                <JournalTemplateSelector
                  selectedTemplate={selectedTemplate}
                  onTemplateSelect={handleTemplateSelect}
                />
                
                <Textarea
                  placeholder="What's on your mind today?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[400px] resize-none border-none px-0 focus-visible:ring-0 text-base leading-relaxed"
                />
              </CardContent>
            </Card>

            {/* Photos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Photos</CardTitle>
              </CardHeader>
              <CardContent>
                <JournalPhotoUpload
                  photos={photos}
                  onPhotosChange={setPhotos}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Mood & Weather */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Mood & Weather</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <JournalMoodSelector
                  selectedMood={mood}
                  onMoodSelect={setMood}
                />
                <Separator />
                <JournalWeatherSelector
                  selectedWeather={weather}
                  onWeatherSelect={setWeather}
                />
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Where are you writing from?"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    className="flex-1"
                  />
                  <Button onClick={handleAddTag} size="sm">Add</Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}