import { 
  type AssessmentResponse, 
  type AssessmentResult, 
  type SectionScore,
  ASSESSMENT_SECTIONS,
  PROFILE_MAPPING 
} from '@/types/assessment';

export function calculateAssessmentResult(responses: AssessmentResponse): AssessmentResult {
  const sectionScores: SectionScore[] = [];

  // Calculate scores for each section
  ASSESSMENT_SECTIONS.forEach(section => {
    let totalScore = 0;
    section.questions.forEach(question => {
      totalScore += responses[question.id] || 0;
    });

    const maxScore = section.questions.length * 3; // Each question max 3 points
    
    let impactLevel: 'minimal' | 'moderate' | 'major';
    if (totalScore <= 8) {
      impactLevel = 'minimal';
    } else if (totalScore <= 16) {
      impactLevel = 'moderate';
    } else {
      impactLevel = 'major';
    }

    sectionScores.push({
      sectionId: section.id,
      title: section.title,
      score: totalScore,
      maxScore,
      impactLevel
    });
  });

  // Determine primary profile based on highest score
  const highestScoringSection = sectionScores.reduce((prev, current) => 
    prev.score > current.score ? prev : current
  );

  // Check for Profile 7: Toxic and Overwhelmed (chemical + inflammatory both high)
  const chemicalScore = sectionScores.find(s => s.sectionId === 'chemical-interference')?.score || 0;
  const inflammatoryScore = sectionScores.find(s => s.sectionId === 'inflammatory-fire')?.score || 0;
  
  let primaryProfile: string;
  if (chemicalScore >= 17 && inflammatoryScore >= 17) {
    primaryProfile = PROFILE_MAPPING['toxic-overwhelmed'];
  } else {
    primaryProfile = PROFILE_MAPPING[highestScoringSection.sectionId as keyof typeof PROFILE_MAPPING] || 
                    'Profile Assessment Complete';
  }

  return {
    sectionScores,
    primaryProfile,
    completedAt: new Date()
  };
}

export function saveAssessmentResult(result: AssessmentResult): void {
  localStorage.setItem('emberAssessmentResult', JSON.stringify(result));
}

export function loadAssessmentResult(): AssessmentResult | null {
  const stored = localStorage.getItem('emberAssessmentResult');
  if (!stored) return null;
  
  try {
    const parsed = JSON.parse(stored);
    return {
      ...parsed,
      completedAt: new Date(parsed.completedAt)
    };
  } catch {
    return null;
  }
}