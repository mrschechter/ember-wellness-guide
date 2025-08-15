import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { type AssessmentResult } from '@/types/assessment';
import { Download, Mail, RotateCcw } from 'lucide-react';

interface AssessmentResultsProps {
  result: AssessmentResult;
  onRestart: () => void;
  onDownloadPDF: () => void;
  onEmailResults: () => void;
}

export function AssessmentResults({ 
  result, 
  onRestart, 
  onDownloadPDF, 
  onEmailResults 
}: AssessmentResultsProps) {
  const getImpactColor = (level: string) => {
    switch (level) {
      case 'minimal': return 'bg-success text-success-foreground';
      case 'moderate': return 'bg-warning text-warning-foreground';
      case 'major': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getImpactLabel = (level: string) => {
    switch (level) {
      case 'minimal': return 'Minimal Impact (0-8 points)';
      case 'moderate': return 'Moderate Impact (9-16 points)';
      case 'major': return 'Major Impact (17-24 points)';
      default: return 'Unknown';
    }
  };

  const topPriorities = result.sectionScores
    .filter(s => s.impactLevel === 'major')
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Your Assessment Results
        </h1>
        <p className="text-muted-foreground">
          Completed on {result.completedAt.toLocaleDateString()}
        </p>
      </div>

      {/* Primary Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-primary">
            Your Primary Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-semibold text-foreground mb-4">
            {result.primaryProfile}
          </div>
          <p className="text-muted-foreground">
            This profile is based on your highest scoring section and represents your primary health pattern.
          </p>
        </CardContent>
      </Card>

      {/* Section Scores */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Section Scores</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {result.sectionScores.map((section) => (
            <div key={section.sectionId} className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-foreground">{section.title}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {section.score}/{section.maxScore}
                  </span>
                  <Badge className={getImpactColor(section.impactLevel)}>
                    {section.impactLevel.charAt(0).toUpperCase() + section.impactLevel.slice(1)}
                  </Badge>
                </div>
              </div>
              <Progress 
                value={(section.score / section.maxScore) * 100} 
                className="h-3"
              />
              <p className="text-xs text-muted-foreground">
                {getImpactLabel(section.impactLevel)}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Priority Areas */}
      {topPriorities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-destructive">
              Priority Areas for Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              These areas scored 17+ points and should be your primary focus:
            </p>
            <div className="grid gap-3">
              {topPriorities.map((section, index) => (
                <div key={section.sectionId} className="flex items-center gap-3 p-3 bg-destructive/10 rounded-lg">
                  <span className="font-bold text-destructive">#{index + 1}</span>
                  <span className="font-medium">{section.title}</span>
                  <span className="text-sm text-muted-foreground">
                    ({section.score}/{section.maxScore} points)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button onClick={onDownloadPDF} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download PDF Report
        </Button>
        <Button onClick={onEmailResults} variant="outline" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Email Results
        </Button>
        <Button onClick={onRestart} variant="outline" className="flex items-center gap-2">
          <RotateCcw className="h-4 w-4" />
          Retake Assessment
        </Button>
      </div>
    </div>
  );
}