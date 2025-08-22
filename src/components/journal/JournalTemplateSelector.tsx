import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FileText, ChevronDown } from 'lucide-react';
import { type JournalTemplate, DEFAULT_TEMPLATES } from '@/types/journal';

interface JournalTemplateSelectorProps {
  selectedTemplate: JournalTemplate | null;
  onTemplateSelect: (template: JournalTemplate) => void;
}

export function JournalTemplateSelector({ selectedTemplate, onTemplateSelect }: JournalTemplateSelectorProps) {
  const getCategoryColor = (category: JournalTemplate['category']) => {
    switch (category) {
      case 'wellness': return 'bg-success/10 text-success-foreground border-success/20';
      case 'gratitude': return 'bg-accent/10 text-accent-foreground border-accent/20';
      case 'goals': return 'bg-primary/10 text-primary-foreground border-primary/20';
      case 'reflection': return 'bg-secondary/10 text-secondary-foreground border-secondary/20';
      case 'daily': return 'bg-muted/10 text-muted-foreground border-muted/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  return (
    <div className="mb-4 pb-4 border-b border-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Journal Template</span>
          {selectedTemplate && (
            <Badge className={getCategoryColor(selectedTemplate.category)}>
              {selectedTemplate.name}
            </Badge>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <span className="text-xs">
                {selectedTemplate ? 'Change Template' : 'Use Template'}
              </span>
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {DEFAULT_TEMPLATES.map((template) => (
              <DropdownMenuItem
                key={template.id}
                onClick={() => onTemplateSelect(template)}
                className="flex flex-col items-start py-3"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{template.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {template.category}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">
                  {template.prompts.length} prompts
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {selectedTemplate && (
        <div className="mt-3 p-3 bg-muted/30 rounded-md">
          <p className="text-xs text-muted-foreground mb-2">Template prompts:</p>
          <ul className="text-xs space-y-1">
            {selectedTemplate.prompts.map((prompt, index) => (
              <li key={index} className="text-muted-foreground">
                • {prompt}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}