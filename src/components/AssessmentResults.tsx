import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { type AssessmentResult } from '@/types/assessment';
import { 
  Download, 
  RotateCcw, 
  ChevronDown, 
  Target, 
  Heart, 
  Brain, 
  Shield, 
  Zap, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Info,
  TrendingUp,
  Calendar,
  Users,
  FileText,
  Star,
  Award,
  Lightbulb
} from 'lucide-react';

interface AssessmentResultsProps {
  result: AssessmentResult;
  onRestart: () => void;
  onDownloadPDF: () => void;
}

export function AssessmentResults({ 
  result, 
  onRestart, 
  onDownloadPDF
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

  const getSectionIcon = (sectionId: string) => {
    switch (sectionId) {
      case 'hormonal': return Heart;
      case 'cellular': return Zap;
      case 'sleep': return Clock;
      case 'chemical': return Shield;
      default: return Target;
    }
  };

  const getDetailedExplanation = (section: any) => {
    const explanations = {
      hormonal: {
        minimal: {
          meaning: "Your hormonal systems are functioning well with minimal disruption.",
          impact: "You likely experience regular cycles, stable energy, and manageable PMS symptoms.",
          potential: "Focus on maintaining your current healthy habits and optimizing nutrition for long-term hormonal health."
        },
        moderate: {
          meaning: "You're experiencing some hormonal imbalances that are affecting your daily life.",
          impact: "You might notice irregular periods, mood swings, energy crashes, or mild PMS symptoms.",
          potential: "With targeted nutrition and lifestyle changes, you could see significant improvements in 4-8 weeks."
        },
        major: {
          meaning: "Significant hormonal disruption is significantly impacting your quality of life.",
          impact: "You likely experience severe PMS, irregular cycles, persistent fatigue, mood instability, or fertility concerns.",
          potential: "A comprehensive approach addressing nutrition, stress, and sleep could lead to dramatic improvements in 8-12 weeks."
        }
      },
      cellular: {
        minimal: {
          meaning: "Your cells are getting adequate nutrition and energy production is optimal.",
          impact: "You maintain steady energy throughout the day and recover well from physical activities.",
          potential: "Continue supporting cellular health with antioxidant-rich foods and regular movement."
        },
        moderate: {
          meaning: "Your cellular energy production is compromised, affecting your vitality.",
          impact: "You might experience afternoon energy crashes, slow recovery from exercise, or brain fog.",
          potential: "Targeted mitochondrial support through nutrition and supplements could restore your energy in 6-10 weeks."
        },
        major: {
          meaning: "Severe cellular dysfunction is causing persistent fatigue and health issues.",
          impact: "You likely struggle with chronic fatigue, poor exercise tolerance, cognitive issues, or slow healing.",
          potential: "A comprehensive cellular restoration protocol could significantly improve your energy and vitality in 10-16 weeks."
        }
      },
      sleep: {
        minimal: {
          meaning: "Your sleep quality and patterns support optimal health and recovery.",
          impact: "You fall asleep easily, sleep deeply, and wake up refreshed most mornings.",
          potential: "Maintain your good sleep hygiene and consider optimizing your sleep environment further."
        },
        moderate: {
          meaning: "Sleep disruptions are affecting your energy and overall well-being.",
          impact: "You might have trouble falling asleep, wake frequently, or feel tired despite adequate sleep time.",
          potential: "Improving sleep hygiene and addressing underlying causes could restore quality sleep in 4-6 weeks."
        },
        major: {
          meaning: "Severe sleep dysfunction is significantly impacting your health and daily function.",
          impact: "You likely experience chronic insomnia, poor sleep quality, or feel exhausted regardless of sleep duration.",
          potential: "A comprehensive sleep restoration protocol could dramatically improve your sleep and energy in 8-12 weeks."
        }
      },
      chemical: {
        minimal: {
          meaning: "Your body is handling environmental toxins well with minimal burden.",
          impact: "You have good detoxification capacity and minimal symptoms from chemical exposure.",
          potential: "Continue supporting your body's natural detox processes with clean living practices."
        },
        moderate: {
          meaning: "Chemical burden is creating health challenges that need attention.",
          impact: "You might experience skin issues, digestive problems, headaches, or increased sensitivity to chemicals.",
          potential: "Reducing toxic exposure and supporting detoxification could improve symptoms in 6-8 weeks."
        },
        major: {
          meaning: "High toxic burden is significantly compromising your health and well-being.",
          impact: "You likely have multiple chemical sensitivities, chronic inflammation, or unexplained health issues.",
          potential: "A comprehensive detoxification protocol could lead to significant health improvements in 12-16 weeks."
        }
      }
    };

    return explanations[section.sectionId as keyof typeof explanations]?.[section.impactLevel as 'minimal' | 'moderate' | 'major'] || {
      meaning: "Assessment data available",
      impact: "Individual results may vary",
      potential: "Consult with healthcare provider for personalized recommendations"
    };
  };

  const getImmediateActions = (section: any) => {
    const actions = {
      hormonal: {
        moderate: [
          "Track your menstrual cycle and symptoms for 2 months",
          "Prioritize 7-9 hours of quality sleep nightly",
          "Add hormone-supporting foods like leafy greens and healthy fats"
        ],
        major: [
          "Schedule comprehensive hormone testing with your healthcare provider",
          "Eliminate processed foods and focus on whole foods nutrition",
          "Implement stress-reduction techniques like meditation or yoga"
        ]
      },
      cellular: {
        moderate: [
          "Start your day with protein and healthy fats to stabilize blood sugar",
          "Add 10-15 minutes of morning sunlight exposure",
          "Include CoQ10-rich foods like organ meats or consider supplementation"
        ],
        major: [
          "Eliminate refined sugars and processed foods completely",
          "Begin a gentle exercise routine to support mitochondrial function",
          "Consider targeted testing for nutrient deficiencies"
        ]
      },
      sleep: {
        moderate: [
          "Create a consistent bedtime routine and sleep schedule",
          "Remove blue light devices 1 hour before bed",
          "Keep your bedroom cool (65-68°F) and completely dark"
        ],
        major: [
          "Implement a strict sleep hygiene protocol immediately",
          "Consider sleep study evaluation with your healthcare provider",
          "Address potential underlying causes like sleep apnea or hormone imbalances"
        ]
      },
      chemical: {
        moderate: [
          "Switch to natural cleaning products and personal care items",
          "Filter your drinking water and increase daily water intake",
          "Choose organic produce for the 'Dirty Dozen' foods"
        ],
        major: [
          "Conduct a comprehensive home and workplace toxin audit",
          "Support liver detoxification with cruciferous vegetables",
          "Consider working with a functional medicine practitioner"
        ]
      }
    };

    return actions[section.sectionId as keyof typeof actions]?.[section.impactLevel as 'moderate' | 'major'] || [
      "Maintain current healthy habits",
      "Continue regular health monitoring",
      "Consult healthcare provider for personalized guidance"
    ];
  };

  const topPriorities = result.sectionScores
    .filter(s => s.impactLevel === 'major')
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const wellnessScore = Math.round(
    ((result.sectionScores.reduce((acc, section) => acc + section.maxScore, 0) - 
      result.sectionScores.reduce((acc, section) => acc + section.score, 0)) / 
     result.sectionScores.reduce((acc, section) => acc + section.maxScore, 0)) * 100
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header with Wellness Score */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Your Assessment Results
        </h1>
        <p className="text-muted-foreground">
          Completed on {result.completedAt.toLocaleDateString()}
        </p>
        
        {/* Overall Wellness Score */}
        <Card className="max-w-md mx-auto bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">{wellnessScore}%</div>
              <p className="text-sm text-muted-foreground">Overall Wellness Score</p>
              <div className="mt-4 flex justify-center">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(wellnessScore / 20) 
                          ? 'fill-primary text-primary' 
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
          <TabsTrigger value="actions">Action Plan</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Primary Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-primary flex items-center gap-2">
                <Award className="h-6 w-6" />
                Your Primary Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-semibold text-foreground mb-4">
                {result.primaryProfile}
              </div>
              <p className="text-muted-foreground mb-4">
                This profile is based on your highest scoring section and represents your primary health pattern.
              </p>
              <div className="bg-primary/10 p-4 rounded-lg">
                <p className="text-sm text-primary font-medium">
                  💡 Your journey to wellness starts with understanding your unique profile. 
                  Each person's path is different, and your results guide a personalized approach.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section Scores Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Health Categories Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {result.sectionScores.map((section) => {
                const Icon = getSectionIcon(section.sectionId);
                return (
                  <div key={section.sectionId} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-primary" />
                        <h3 className="font-medium text-foreground">{section.title}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {section.score}/{section.maxScore}
                        </span>
                        <Badge className={getImpactColor(section.impactLevel)}>
                          {section.impactLevel.charAt(0).toUpperCase() + section.impactLevel.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Progress 
                        value={(section.score / section.maxScore) * 100} 
                        className="h-3 animate-fade-in"
                      />
                      <p className="text-xs text-muted-foreground">
                        {getImpactLabel(section.impactLevel)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Priority Areas */}
          {topPriorities.length > 0 && (
            <Card className="border-destructive/20">
              <CardHeader>
                <CardTitle className="text-xl text-destructive flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Priority Areas for Immediate Attention
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  These areas scored 17+ points and require immediate focus for optimal health:
                </p>
                <div className="grid gap-3">
                  {topPriorities.map((section, index) => (
                    <div key={section.sectionId} className="flex items-center gap-3 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                      <div className="flex items-center justify-center w-8 h-8 bg-destructive text-destructive-foreground rounded-full font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <span className="font-medium">{section.title}</span>
                        <p className="text-sm text-muted-foreground">
                          Score: {section.score}/{section.maxScore} points - Requires immediate attention
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6">
          {result.sectionScores.map((section) => {
            const Icon = getSectionIcon(section.sectionId);
            const explanation = getDetailedExplanation(section);
            
            return (
              <Card key={section.sectionId}>
                <Collapsible>
                  <CollapsibleTrigger className="w-full">
                    <CardHeader className="hover:bg-muted/50 transition-colors">
                      <CardTitle className="text-lg flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-primary" />
                          <span>{section.title}</span>
                          <Badge className={getImpactColor(section.impactLevel)}>
                            {section.impactLevel.charAt(0).toUpperCase() + section.impactLevel.slice(1)}
                          </Badge>
                        </div>
                        <ChevronDown className="h-4 w-4" />
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        <Progress 
                          value={(section.score / section.maxScore) * 100} 
                          className="h-3"
                        />
                        
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <h4 className="font-medium flex items-center gap-2">
                              <Info className="h-4 w-4 text-primary" />
                              What This Score Means
                            </h4>
                            <p className="text-sm text-muted-foreground">{explanation.meaning}</p>
                          </div>
                          
                          <div className="space-y-2">
                            <h4 className="font-medium flex items-center gap-2">
                              <Heart className="h-4 w-4 text-primary" />
                              Real-Life Impact
                            </h4>
                            <p className="text-sm text-muted-foreground">{explanation.impact}</p>
                          </div>
                          
                          <div className="space-y-2">
                            <h4 className="font-medium flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-primary" />
                              Improvement Potential
                            </h4>
                            <p className="text-sm text-muted-foreground">{explanation.potential}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="actions" className="space-y-6">
          {result.sectionScores
            .filter(section => section.impactLevel !== 'minimal')
            .map((section) => {
              const Icon = getSectionIcon(section.sectionId);
              const actions = getImmediateActions(section);
              
              return (
                <Card key={section.sectionId}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-primary" />
                      <span>{section.title} Action Plan</span>
                      <Badge className={getImpactColor(section.impactLevel)}>
                        {section.impactLevel.charAt(0).toUpperCase() + section.impactLevel.slice(1)} Priority
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      Immediate Actions (Start This Week)
                    </h4>
                    <ul className="space-y-2">
                      {actions.map((action, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="text-primary font-bold mt-1">•</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}

          {/* Timeline Estimator */}
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Your Improvement Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-background rounded-lg">
                    <div className="text-2xl font-bold text-primary">2-4 weeks</div>
                    <p className="text-sm text-muted-foreground">Initial improvements in energy and mood</p>
                  </div>
                  <div className="text-center p-4 bg-background rounded-lg">
                    <div className="text-2xl font-bold text-primary">6-8 weeks</div>
                    <p className="text-sm text-muted-foreground">Significant changes in primary concerns</p>
                  </div>
                  <div className="text-center p-4 bg-background rounded-lg">
                    <div className="text-2xl font-bold text-primary">12+ weeks</div>
                    <p className="text-sm text-muted-foreground">Sustained transformation and new habits</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Timeline may vary based on individual factors and adherence to recommendations
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          {/* Educational Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Learn More About Your Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.sectionScores
                .filter(section => section.impactLevel !== 'minimal')
                .map((section) => (
                  <div key={section.sectionId} className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">{section.title} Deep Dive</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Understanding the science behind your {section.title.toLowerCase()} score and evidence-based solutions.
                    </p>
                    <Button variant="outline" size="sm">
                      Read Article
                    </Button>
                  </div>
                ))}
            </CardContent>
          </Card>

          {/* Healthcare Provider Sharing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Share with Healthcare Provider
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Take your results to your next appointment. We've prepared a clinical summary for healthcare discussions.
              </p>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Download Clinical Summary
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Prepare for Appointment
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Enhanced CTA Section */}
      <Card className="bg-gradient-to-r from-orange-50 to-pink-50 border-primary/20">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <h3 className="text-2xl font-bold text-foreground">
              Ready to Transform Your Health?
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your assessment reveals specific areas for improvement. Get the complete step-by-step program 
              to implement your personalized protocol and achieve lasting results.
            </p>
            
            {/* Multiple pathway options */}
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="text-center space-y-2">
                  <Target className="h-8 w-8 text-primary mx-auto" />
                  <h4 className="font-semibold">I'm Ready to Start</h4>
                  <p className="text-sm text-muted-foreground">Get your complete restoration program</p>
                  <Button className="w-full">
                    Get Full Program
                  </Button>
                </div>
              </Card>
              
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="text-center space-y-2">
                  <Brain className="h-8 w-8 text-primary mx-auto" />
                  <h4 className="font-semibold">I Want to Learn More</h4>
                  <p className="text-sm text-muted-foreground">Educational content series</p>
                  <Button variant="outline" className="w-full">
                    Free Resources
                  </Button>
                </div>
              </Card>
              
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="text-center space-y-2">
                  <Users className="h-8 w-8 text-primary mx-auto" />
                  <h4 className="font-semibold">I Need Support</h4>
                  <p className="text-sm text-muted-foreground">One-on-one consultation</p>
                  <Button variant="outline" className="w-full">
                    Book Consultation
                  </Button>
                </div>
              </Card>
            </div>

            <Separator className="my-6" />

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Button onClick={onDownloadPDF} size="lg" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download Complete Report
              </Button>
              <Button onClick={onRestart} variant="outline" size="lg" className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                Retake Assessment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}