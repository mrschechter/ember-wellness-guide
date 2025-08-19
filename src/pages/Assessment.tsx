import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AssessmentForm } from '@/components/AssessmentForm';
import { AssessmentResults } from '@/components/AssessmentResults';
import { ProtocolRecommendations } from '@/components/ProtocolRecommendations';
import { ProgressTracker } from '@/components/ProgressTracker';
import { calculateAssessmentResult } from '@/utils/assessmentCalculator';
import { type AssessmentResponse, type AssessmentResult } from '@/types/assessment';
import { Flame, FileText, TrendingUp, BarChart3, Calendar, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Assessment = () => {
  const [currentResult, setCurrentResult] = useState<AssessmentResult | null>(null);
  const [activeTab, setActiveTab] = useState('assessment');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Remove the useEffect that was handling authentication

  const handleAssessmentComplete = async (responses: AssessmentResponse) => {
    // Calculate results and show them immediately
    const result = calculateAssessmentResult(responses);
    setCurrentResult(result);
    setActiveTab('results');
    toast({
      title: "Assessment Complete!",
      description: "Your personalized results are ready."
    });
  };

  // Remove sign-in gate handlers

  const handleRestart = () => {
    setCurrentResult(null);
    setActiveTab('assessment');
  };

  const handleDownloadPDF = async () => {
    if (!currentResult) {
      toast({
        variant: "destructive",
        title: "No results available",
        description: "Please complete the assessment first."
      });
      return;
    }
    
    try {
      const { generateAssessmentPDF } = await import('@/utils/pdfGenerator');
      await generateAssessmentPDF(currentResult);
      toast({
        title: "PDF Generated",
        description: "Your assessment report has been downloaded."
      });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "Failed to generate PDF. Please try again."
      });
    }
  };

  // Remove loading state since we don't need to wait for auth


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Flame className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">The Ember Method</h1>
                <p className="text-sm text-muted-foreground">Women's Health Assessment Tool</p>
              </div>
            </div>
            
            {/* Remove conditional dashboard link */}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {!currentResult ? (
          <AssessmentForm onComplete={handleAssessmentComplete} />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="results" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Results
              </TabsTrigger>
              <TabsTrigger value="protocol" className="flex items-center gap-2">
                <Flame className="h-4 w-4" />
                Protocol
              </TabsTrigger>
              <TabsTrigger value="progress" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Progress
              </TabsTrigger>
            </TabsList>

            <TabsContent value="results" className="space-y-8">
              <div className="space-y-8">
                <AssessmentResults
                  result={currentResult}
                  onRestart={handleRestart}
                  onDownloadPDF={handleDownloadPDF}
                />
                
                {/* Course offer section */}
                <div className="mt-12">
                  <Card className="bg-gradient-to-r from-orange-50 to-pink-50 border-primary/20">
                    <div className="p-8 text-center">
                      <h3 className="text-2xl font-bold text-foreground mb-4">
                        Ready to Start Your Restoration?
                      </h3>
                      <p className="text-lg text-muted-foreground mb-6">
                        Get the complete step-by-step program to implement your personalized protocol
                      </p>
                      <Button 
                        size="lg"
                        className="text-lg px-8 py-4"
                        onClick={() => toast({
                          title: "Coming Soon!",
                          description: "Our complete restoration program will be available soon."
                        })}
                      >
                        Get Your Complete Restoration Program
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="protocol" className="space-y-8">
              <ProtocolRecommendations result={currentResult} />
            </TabsContent>

            <TabsContent value="progress" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Legacy Progress Tracker */}
                <ProgressTracker />
                
                {/* New Dashboard Preview */}
                <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Enhanced Progress Tracking
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Get detailed insights with our comprehensive dashboard featuring daily check-ins, supplement tracking, and visual progress analytics.
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>Daily check-ins with energy & mood tracking</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Target className="h-4 w-4 text-primary" />
                      <span>Supplement compliance monitoring</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <BarChart3 className="h-4 w-4 text-primary" />
                      <span>Visual progress charts & trends</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span>Weekly assessments & milestone tracking</span>
                    </div>
                  </div>
                  
                  <Link to="/dashboard">
                    <Button className="w-full">
                      Access Progress Dashboard
                    </Button>
                  </Link>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p className="mb-2">© 2024 The Ember Method. Empowering women's health through personalized wellness.</p>
            <p>This assessment is for educational purposes only and does not replace professional medical advice.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Assessment;
