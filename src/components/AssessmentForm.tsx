import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ASSESSMENT_SECTIONS, type AssessmentResponse } from '@/types/assessment';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AssessmentFormProps {
  onComplete: (responses: AssessmentResponse) => void;
}

export function AssessmentForm({ onComplete }: AssessmentFormProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [responses, setResponses] = useState<AssessmentResponse>({});

  const handleResponseChange = (questionId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: parseInt(value)
    }));
  };

  const canProceed = () => {
    const section = ASSESSMENT_SECTIONS[currentSection];
    return section.questions.every(q => responses[q.id] !== undefined);
  };

  const handleNext = () => {
    if (currentSection < ASSESSMENT_SECTIONS.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      onComplete(responses);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const progress = ((currentSection + 1) / ASSESSMENT_SECTIONS.length) * 100;
  const section = ASSESSMENT_SECTIONS[currentSection];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          The Ember Method Assessment
        </h1>
        <p className="text-muted-foreground mb-4">
          Complete this assessment to discover your personalized wellness profile and protocol.
        </p>
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-muted-foreground mt-2">
          Section {currentSection + 1} of {ASSESSMENT_SECTIONS.length}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-primary">
            {section.title}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Rate each statement based on how often it applies to you:
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {section.questions.map((question, index) => (
            <div key={question.id} className="space-y-3">
              <Label className="text-base font-medium">
                {index + 1}. {question.text}
              </Label>
              <RadioGroup
                value={responses[question.id]?.toString() || ''}
                onValueChange={(value) => handleResponseChange(question.id, value)}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="0" id={`${question.id}-0`} />
                  <Label htmlFor={`${question.id}-0`} className="text-sm">
                    Never true (0)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id={`${question.id}-1`} />
                  <Label htmlFor={`${question.id}-1`} className="text-sm">
                    Occasionally true (1)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2" id={`${question.id}-2`} />
                  <Label htmlFor={`${question.id}-2`} className="text-sm">
                    Often true (2)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3" id={`${question.id}-3`} />
                  <Label htmlFor={`${question.id}-3`} className="text-sm">
                    Almost always true (3)
                  </Label>
                </div>
              </RadioGroup>
            </div>
          ))}

          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentSection === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center gap-2"
            >
              {currentSection === ASSESSMENT_SECTIONS.length - 1 ? 'Complete Assessment' : 'Next'}
              {currentSection !== ASSESSMENT_SECTIONS.length - 1 && <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}