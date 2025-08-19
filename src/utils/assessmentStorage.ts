import { supabase } from '@/integrations/supabase/client';
import { 
  type AssessmentResponse, 
  type AssessmentResult 
} from '@/types/assessment';
import { calculateAssessmentResult } from './assessmentCalculator';

export interface PendingAssessmentData {
  answers: AssessmentResponse;
  timestamp: string;
  result: AssessmentResult;
}

export function storePendingAssessment(responses: AssessmentResponse): void {
  const result = calculateAssessmentResult(responses);
  const pendingData: PendingAssessmentData = {
    answers: responses,
    timestamp: new Date().toISOString(),
    result
  };
  
  localStorage.setItem('pendingAssessmentResults', JSON.stringify(pendingData));
}

export function getPendingAssessment(): PendingAssessmentData | null {
  const stored = localStorage.getItem('pendingAssessmentResults');
  if (!stored) return null;
  
  try {
    const parsed = JSON.parse(stored);
    return {
      ...parsed,
      result: {
        ...parsed.result,
        completedAt: new Date(parsed.result.completedAt)
      }
    };
  } catch {
    return null;
  }
}

export function clearPendingAssessment(): void {
  localStorage.removeItem('pendingAssessmentResults');
}

export async function saveAssessmentToDatabase(
  userId: string, 
  data: PendingAssessmentData
): Promise<{ error: any }> {
  try {
    const { error } = await supabase
      .from('assessment_results')
      .insert({
        user_id: userId,
        answers: data.answers as any,
        section_scores: data.result.sectionScores as any,
        primary_profile: data.result.primaryProfile,
        completed_at: data.timestamp
      });
    
    return { error };
  } catch (error) {
    return { error };
  }
}

export async function getUserAssessmentResult(userId: string): Promise<AssessmentResult | null> {
  try {
    const { data, error } = await supabase
      .from('assessment_results')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (error || !data) return null;
    
    return {
      sectionScores: data.section_scores as any,
      primaryProfile: data.primary_profile,
      completedAt: new Date(data.completed_at)
    };
  } catch {
    return null;
  }
}

export async function markResultsViewed(userId: string): Promise<void> {
  try {
    await supabase
      .from('assessment_results')
      .update({ viewed_at: new Date().toISOString() })
      .eq('user_id', userId)
      .is('viewed_at', null);
  } catch (error) {
    console.error('Error marking results as viewed:', error);
  }
}