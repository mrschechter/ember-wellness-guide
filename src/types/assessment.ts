export interface Question {
  id: string;
  text: string;
}

export interface Section {
  id: string;
  title: string;
  questions: Question[];
}

export interface AssessmentResponse {
  [questionId: string]: number;
}

export interface SectionScore {
  sectionId: string;
  title: string;
  score: number;
  maxScore: number;
  impactLevel: 'minimal' | 'moderate' | 'major';
}

export interface AssessmentResult {
  sectionScores: SectionScore[];
  primaryProfile: string;
  completedAt: Date;
}

export interface ProgressEntry {
  date: string;
  energy: number;
  sleep: number;
  mood: number;
  vitality: number;
}

export const ASSESSMENT_SECTIONS: Section[] = [
  {
    id: 'hormonal-chaos',
    title: 'Hormonal Chaos',
    questions: [
      { id: 'hc-1', text: 'I experience mood swings or irritability' },
      { id: 'hc-2', text: 'My periods are irregular or unpredictable' },
      { id: 'hc-3', text: 'I have trouble losing weight despite diet and exercise' },
      { id: 'hc-4', text: 'I feel anxious or overwhelmed frequently' },
      { id: 'hc-5', text: 'I have low libido or sexual dysfunction' },
      { id: 'hc-6', text: 'I experience hot flashes or night sweats' },
      { id: 'hc-7', text: 'I have difficulty concentrating or brain fog' },
      { id: 'hc-8', text: 'I feel emotionally unstable or cry easily' }
    ]
  },
  {
    id: 'adrenal-exhaustion',
    title: 'Adrenal Exhaustion',
    questions: [
      { id: 'ae-1', text: 'I feel tired even after a full night of sleep' },
      { id: 'ae-2', text: 'I need caffeine to get through the day' },
      { id: 'ae-3', text: 'I feel overwhelmed by daily tasks' },
      { id: 'ae-4', text: 'I have difficulty handling stress' },
      { id: 'ae-5', text: 'I feel exhausted by 3-4 PM' },
      { id: 'ae-6', text: 'I crave salty or sweet foods' },
      { id: 'ae-7', text: 'I feel like I\'m always "running on empty"' },
      { id: 'ae-8', text: 'I get sick frequently or take longer to recover' }
    ]
  },
  {
    id: 'cellular-starvation',
    title: 'Cellular Starvation',
    questions: [
      { id: 'cs-1', text: 'I feel weak or shaky if I don\'t eat regularly' },
      { id: 'cs-2', text: 'I have cold hands and feet' },
      { id: 'cs-3', text: 'My hair is thinning or falling out' },
      { id: 'cs-4', text: 'I have brittle or ridged nails' },
      { id: 'cs-5', text: 'I feel like my metabolism is slow' },
      { id: 'cs-6', text: 'I have trouble maintaining body temperature' },
      { id: 'cs-7', text: 'I feel tired after eating' },
      { id: 'cs-8', text: 'I have digestive issues or constipation' }
    ]
  },
  {
    id: 'sleep-disruption',
    title: 'Sleep Disruption',
    questions: [
      { id: 'sd-1', text: 'I have trouble falling asleep' },
      { id: 'sd-2', text: 'I wake up frequently during the night' },
      { id: 'sd-3', text: 'I wake up feeling unrefreshed' },
      { id: 'sd-4', text: 'I rely on sleep aids or melatonin' },
      { id: 'sd-5', text: 'My mind races when I try to sleep' },
      { id: 'sd-6', text: 'I snore or have sleep apnea symptoms' },
      { id: 'sd-7', text: 'I wake up too early and can\'t fall back asleep' },
      { id: 'sd-8', text: 'I feel like I never get quality sleep' }
    ]
  },
  {
    id: 'chemical-interference',
    title: 'Chemical Interference',
    questions: [
      { id: 'ci-1', text: 'I am sensitive to chemicals, perfumes, or cleaners' },
      { id: 'ci-2', text: 'I have multiple allergies or intolerances' },
      { id: 'ci-3', text: 'I take multiple prescription medications' },
      { id: 'ci-4', text: 'I have autoimmune symptoms or conditions' },
      { id: 'ci-5', text: 'I react poorly to supplements or medications' },
      { id: 'ci-6', text: 'I live in a polluted or toxic environment' },
      { id: 'ci-7', text: 'I have had negative reactions to vaccines or drugs' },
      { id: 'ci-8', text: 'I feel worse when exposed to WiFi or electronics' }
    ]
  },
  {
    id: 'inflammatory-fire',
    title: 'Inflammatory Fire',
    questions: [
      { id: 'if-1', text: 'I have joint pain or stiffness' },
      { id: 'if-2', text: 'I experience headaches or migraines' },
      { id: 'if-3', text: 'I have skin issues like rashes or eczema' },
      { id: 'if-4', text: 'I have digestive inflammation or IBD' },
      { id: 'if-5', text: 'I feel puffy or retain water' },
      { id: 'if-6', text: 'I have chronic pain conditions' },
      { id: 'if-7', text: 'I get frequent infections' },
      { id: 'if-8', text: 'I feel like my body is "on fire" internally' }
    ]
  },
  {
    id: 'blood-sugar-chaos',
    title: 'Blood Sugar Chaos',
    questions: [
      { id: 'bsc-1', text: 'I experience energy crashes after meals' },
      { id: 'bsc-2', text: 'I crave sugar or carbohydrates frequently' },
      { id: 'bsc-3', text: 'I feel shaky or irritable when hungry' },
      { id: 'bsc-4', text: 'I need to eat every 2-3 hours' },
      { id: 'bsc-5', text: 'I have been told I\'m pre-diabetic or diabetic' },
      { id: 'bsc-6', text: 'I gain weight easily around my midsection' },
      { id: 'bsc-7', text: 'I feel tired or sleepy after eating' },
      { id: 'bsc-8', text: 'I have difficulty losing weight' }
    ]
  }
];

export const PROFILE_MAPPING = {
  'adrenal-exhaustion': 'Profile 1: Depleted High Achiever',
  'hormonal-chaos': 'Profile 2: Hormonal Roller Coaster',
  'chemical-interference': 'Profile 3: Medicated and Struggling',
  'inflammatory-fire': 'Profile 4: Inflamed and Exhausted',
  'blood-sugar-chaos': 'Profile 5: Sugar-Burning Crash Queen',
  'sleep-disruption': 'Profile 6: Sleep-Deprived Zombie',
  'toxic-overwhelmed': 'Profile 7: Toxic and Overwhelmed'
};