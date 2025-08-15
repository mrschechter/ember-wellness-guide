import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AssessmentForm } from '@/components/AssessmentForm';
import { AssessmentResults } from '@/components/AssessmentResults';
import { ProtocolRecommendations } from '@/components/ProtocolRecommendations';
import { ProgressTracker } from '@/components/ProgressTracker';
import { 
  calculateAssessmentResult, 
  saveAssessmentResult, 
  loadAssessmentResult 
} from '@/utils/assessmentCalculator';
import { type AssessmentResponse, type AssessmentResult } from '@/types/assessment';
import { Flame, FileText, TrendingUp } from 'lucide-react';

const Index = () => {
  const [currentResult, setCurrentResult] = useState<AssessmentResult | null>(null);
  const [activeTab, setActiveTab] = useState('assessment');

  useEffect(() => {
    const stored = loadAssessmentResult();
    if (stored) {
      setCurrentResult(stored);
      setActiveTab('results');
    }
  }, []);

  const handleAssessmentComplete = (responses: AssessmentResponse) => {
    const result = calculateAssessmentResult(responses);
    setCurrentResult(result);
    saveAssessmentResult(result);
    setActiveTab('results');
  };

  const handleRestart = () => {
    setCurrentResult(null);
    localStorage.removeItem('emberAssessmentResult');
    setActiveTab('assessment');
  };

  const handleDownloadPDF = async () => {
    if (!currentResult) return;
    
    try {
      const { generateAssessmentPDF } = await import('@/utils/pdfGenerator');
      await generateAssessmentPDF(currentResult);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <Flame className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">The Ember Method</h1>
              <p className="text-sm text-muted-foreground">Women's Health Assessment Tool</p>
            </div>
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
              <AssessmentResults
                result={currentResult}
                onRestart={handleRestart}
                onDownloadPDF={handleDownloadPDF}
              />
            </TabsContent>

            <TabsContent value="protocol" className="space-y-8">
              <ProtocolRecommendations result={currentResult} />
            </TabsContent>

            <TabsContent value="progress" className="space-y-8">
              <ProgressTracker />
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

export default Index;
