import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Edit, MoreHorizontal, Trash2, Heart, MapPin, Image } from 'lucide-react';
import { type JournalEntry } from '@/types/journal';
import { format, isToday, isYesterday, isSameWeek, isSameMonth } from 'date-fns';

interface JournalTimelineProps {
  entries: JournalEntry[];
  onEditEntry: (entry: JournalEntry) => void;
  onDeleteEntry: (entryId: string) => void;
}

export function JournalTimeline({ entries, onEditEntry, onDeleteEntry }: JournalTimelineProps) {
  const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    if (isSameWeek(date, new Date())) return format(date, 'EEEE');
    if (isSameMonth(date, new Date())) return format(date, 'EEEE, MMMM d');
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  const truncateContent = (content: string, limit: number = 200) => {
    if (content.length <= limit) return content;
    return content.substring(0, limit) + '...';
  };

  if (sortedEntries.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {sortedEntries.map((entry, index) => {
        const entryDate = new Date(entry.date);
        const showDateHeader = index === 0 || 
          format(entryDate, 'yyyy-MM-dd') !== format(new Date(sortedEntries[index - 1].date), 'yyyy-MM-dd');

        return (
          <div key={entry.id}>
            {showDateHeader && (
              <div className="flex items-center gap-4 mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  {getDateLabel(entryDate)}
                </h3>
                <div className="flex-1 h-px bg-border" />
              </div>
            )}

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-muted-foreground">
                        {format(entryDate, 'h:mm a')}
                      </span>
                      {entry.isFavorite && (
                        <Heart className="h-4 w-4 text-destructive fill-current" />
                      )}
                      {entry.mood && (
                        <Badge variant="outline" className="text-xs">
                          {entry.mood.emoji} {entry.mood.label}
                        </Badge>
                      )}
                      {entry.weather && (
                        <Badge variant="outline" className="text-xs">
                          {entry.weather.emoji}
                        </Badge>
                      )}
                    </div>
                    
                    {entry.title && (
                      <h4 className="font-semibold text-lg mb-2 text-card-foreground">
                        {entry.title}
                      </h4>
                    )}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEditEntry(entry)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Entry
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDeleteEntry(entry.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Entry
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="pt-0" onClick={() => onEditEntry(entry)}>
                <div className="prose prose-sm max-w-none">
                  <p className="text-card-foreground leading-relaxed whitespace-pre-wrap">
                    {truncateContent(entry.content)}
                  </p>
                </div>

                {/* Entry metadata */}
                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border">
                  {entry.location && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {entry.location}
                    </div>
                  )}
                  
                  {entry.photos.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Image className="h-3 w-3" />
                      {entry.photos.length} photo{entry.photos.length !== 1 ? 's' : ''}
                    </div>
                  )}

                  {entry.tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {entry.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {entry.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{entry.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
}