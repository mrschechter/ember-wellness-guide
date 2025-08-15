import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { type AssessmentResult } from '@/types/assessment';

interface ProtocolRecommendationsProps {
  result: AssessmentResult;
}

const PROTOCOL_DATA = {
  'Profile 1: Depleted High Achiever': {
    description: 'Based on your high adrenal exhaustion score, you need support for stress resilience and energy restoration.',
    supplements: [
      'EMBER: 2 capsules with breakfast for cellular foundation',
      'STEADY: 1 capsule morning and evening for stress resilience',
      'CHARGE: 1 capsule with lunch for sustained energy'
    ],
    lifestyle: [
      'Set firm bedtime allowing 8+ hours sleep with room at 65-68°F',
      'Say \'no\' to one commitment this week and delegate one task you usually do yourself',
      'Take actual lunch breaks away from your desk',
      'Practice the "good enough" rule - not everything needs to be perfect',
      'Schedule one 20-minute "do nothing" break daily',
      '10-minute walk outside or 5-minute breathing break every afternoon',
      'Protein snack if you experience energy dips'
    ],
    optional: [
      'B-complex vitamin for persistent low energy',
      'Rhodiola (200-400mg) if you prefer it over ashwagandha'
    ]
  },
  'Profile 2: Hormonal Roller Coaster': {
    description: 'Your hormonal chaos score indicates you need comprehensive hormone support and cycle-aware lifestyle adjustments.',
    supplements: [
      'EMBER: 2 capsules with breakfast for hormone support',
      'STEADY: 1 capsule daily (increase to 2 during luteal phase if PMS symptoms occur)',
      'CHARGE: 1 capsule with breakfast for consistent energy'
    ],
    lifestyle: [
      'Track your cycle and energy patterns for 3 months',
      'Schedule demanding tasks during days 8-21 (high-energy phase)',
      'Plan rest and self-care during days 22-28 (luteal phase)',
      'Take Epsom salt baths 2-3 times per week',
      'Focus on anti-inflammatory foods especially during luteal phase',
      'Firm bedtime that allows for 8+ hours of sleep',
      'STEADY with dinner instead of before bed if you have trouble winding down'
    ],
    optional: [
      'DIM (100-200mg) to support estrogen metabolism',
      'Evening primrose oil (1000mg) for hormone balance',
      'Extra magnesium during luteal phase (400-600mg)'
    ]
  },
  'Profile 3: Medicated and Struggling': {
    description: 'Your chemical interference score suggests you need support while managing medications and reducing toxic burden.',
    supplements: [
      'EMBER: 2 capsules morning and evening for comprehensive support',
      'STEADY: 1 capsule twice daily to support natural stress response',
      'CHARGE: 1 capsule with lunch for cellular energy'
    ],
    lifestyle: [
      'Work with your doctor to discuss medication timing to minimize sexual side effects',
      'Increase water intake by 16-32oz to your daily target',
      'Include cruciferous vegetables 3-4 times per week for liver support',
      'Add fiber-rich foods to support elimination',
      'Consider working with functional medicine doctor alongside conventional doctor',
      'Ask about medication holidays or dose reductions when appropriate'
    ],
    optional: [
      'CoQ10 if on statins, B-complex if on metformin/birth control',
      'Vitamin D3 (2000-4000 IU) if on antidepressants',
      'Milk thistle (200mg) for additional liver support',
      'Probiotics if on medications affecting gut health'
    ]
  },
  'Profile 4: Inflamed and Exhausted': {
    description: 'Your inflammatory fire score indicates you need comprehensive anti-inflammatory support and gentle healing approach.',
    supplements: [
      'EMBER: 2 capsules daily with meals for anti-inflammatory support',
      'STEADY: 1 capsule twice daily for stress-related inflammation',
      'CHARGE: 1 capsule daily for cellular repair'
    ],
    lifestyle: [
      'Remove "Big 3" inflammatory foods for 30 days: sugar, processed foods, excess caffeine',
      'Focus on gentle movement only until inflammation reduces (yoga, walking)',
      'Stress reduction is absolutely critical - make it your #1 priority',
      'Focus on sleep quality over quantity initially',
      'Add bone broth or collagen-rich foods to meals',
      'Consider working with functional medicine practitioner for advanced gut testing'
    ],
    optional: [
      'Remove full "Big 8": gluten, dairy, sugar, corn, soy, eggs, nuts, nightshades',
      'Omega-3 fatty acids (2-3g daily)',
      'Curcumin with black pepper (500-1000mg)',
      'L-glutamine (5g twice daily), Probiotics (50+ billion CFU daily)'
    ]
  },
  'Profile 5: Sugar-Burning Crash Queen': {
    description: 'Your blood sugar chaos score shows you need metabolic support and blood sugar stabilization strategies.',
    supplements: [
      'EMBER: 2 capsules with breakfast for metabolic support',
      'STEADY: 1 capsule daily for stress-related blood sugar swings',
      'CHARGE: 1 capsule with lunch for stable energy'
    ],
    lifestyle: [
      'Never eat carbohydrates alone - always pair with protein and fat',
      'Eat within 1 hour of waking, then every 3-4 hours maximum',
      'Always carry protein snacks (nuts, seeds, hard-boiled eggs)',
      'For severe crashes: 1 tablespoon almond butter with cinnamon',
      'Stop eating 3 hours before bed, eat largest meals earlier in day',
      'Never skip meals, even if not hungry'
    ],
    optional: [
      'Chromium (200-400mcg with meals)',
      'Alpha lipoic acid (300mg twice daily)',
      'Cinnamon extract (500mg with carbohydrate-containing meals)'
    ]
  },
  'Profile 6: Sleep-Deprived Zombie': {
    description: 'Your sleep disruption score indicates you need comprehensive sleep support and circadian rhythm restoration.',
    supplements: [
      'EMBER: 1 capsule with breakfast, 1 capsule with dinner for circadian support',
      'STEADY: 1 capsule 2 hours before bed for sleep quality',
      'CHARGE: 1 capsule with breakfast only (avoid evening to prevent sleep disruption)'
    ],
    lifestyle: [
      'Room temperature 65-68°F with blackout curtains or eye mask',
      'No screens in bedroom, use blue light blockers if must use devices in evening',
      'Same sleep/wake time every day, including weekends',
      'No caffeine after 2 PM, exercise earlier in the day',
      'White noise machine or earplugs for consistent sound environment',
      'Consider sleep study if snoring or breathing issues persist'
    ],
    optional: [
      'Melatonin (0.5-3mg) 30 minutes before desired sleep time',
      'Magnesium glycinate (400-600mg before bed)',
      'L-theanine (200mg) if mind races at bedtime'
    ]
  },
  'Profile 7: Toxic and Overwhelmed': {
    description: 'Your combined chemical interference and inflammatory fire scores indicate you need gentle detox support and environmental modifications.',
    supplements: [
      'EMBER: Start with 1 capsule, gradually increase to 2 daily with meals for detox support',
      'STEADY: 1 capsule twice daily for stress resilience during detox',
      'CHARGE: 1 capsule daily for cellular energy during healing'
    ],
    lifestyle: [
      'Switch to non-toxic cleaning products immediately',
      'Use glass containers instead of plastic for food storage',
      'Filter your water if possible',
      'Choose organic foods when possible, especially "Dirty Dozen" list',
      'Go slowly with all changes - support your body\'s natural detox pathways',
      'Focus on gentle movement and stress reduction',
      'Work with practitioner experienced in environmental illness'
    ],
    optional: [
      'NAC (600mg) and milk thistle (300mg) for extra liver support',
      'Sauna or hot baths 2-3 times per week if tolerated'
    ]
  }
};

export function ProtocolRecommendations({ result }: ProtocolRecommendationsProps) {
  const protocol = PROTOCOL_DATA[result.primaryProfile as keyof typeof PROTOCOL_DATA];

  if (!protocol) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">
            Protocol recommendations will be displayed based on your assessment results.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-primary">
            Your Personalized Protocol
          </CardTitle>
          <p className="text-muted-foreground">
            {protocol.description}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Core Supplement Protocol */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              Core Supplement Protocol
              <Badge variant="default">Start Here</Badge>
            </h3>
            <ul className="space-y-2">
              {protocol.supplements.map((supplement, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span className="text-foreground">{supplement}</span>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Lifestyle Changes */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              Immediate Lifestyle Changes
              <Badge variant="secondary">Essential</Badge>
            </h3>
            <ul className="space-y-2">
              {protocol.lifestyle.map((change, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                  <span className="text-foreground">{change}</span>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Optional Support */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              Optional Support
              <Badge variant="outline">If Needed</Badge>
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Consider these if no improvement after following the core protocol for 2-4 weeks:
            </p>
            <ul className="space-y-2">
              {protocol.optional.map((option, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">{option}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}