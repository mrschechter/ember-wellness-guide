import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { type AssessmentResult } from '@/types/assessment';
import { ShoppingCart, Clock, Target, Utensils, Activity, Moon, Droplets, Heart } from 'lucide-react';

interface ProtocolRecommendationsProps {
  result: AssessmentResult;
}

const PROTOCOL_DATA = {
  'Profile 1: Depleted High Achiever': {
    description: 'Your adrenal system is running on empty from chronic stress and perfectionism. This comprehensive protocol focuses on rebuilding your stress resilience while supporting sustainable energy production.',
    detailedDescription: 'High achievers often push through exhaustion, creating a cycle of stress hormone depletion. Your body needs specific nutrients to rebuild adrenal function and support healthy cortisol patterns.',
    supplements: [
      {
        name: 'EMBER',
        dosage: '2 capsules with breakfast',
        purpose: 'Cellular foundation and mitochondrial support',
        timing: 'Morning with food',
        benefits: 'Supports energy production at the cellular level, contains adaptogenic herbs for stress resilience'
      },
      {
        name: 'STEADY',
        dosage: '1 capsule morning and evening',
        purpose: 'Stress resilience and cortisol regulation',
        timing: 'Morning and evening with food',
        benefits: 'Helps regulate stress response, supports healthy sleep-wake cycles'
      },
      {
        name: 'CHARGE',
        dosage: '1 capsule with lunch',
        purpose: 'Sustained energy without crashes',
        timing: 'Midday with meal',
        benefits: 'Provides B-vitamins and adaptogens for sustained energy production'
      }
    ],
    lifestyle: {
      sleep: [
        'Set firm bedtime allowing 8+ hours sleep with room at 65-68°F',
        'Create a wind-down routine starting 1 hour before bed',
        'Use blackout curtains or eye mask for complete darkness',
        'Keep bedroom for sleep only - no work materials'
      ],
      stress: [
        'Say "no" to one commitment this week and delegate one task',
        'Practice the "good enough" rule - not everything needs to be perfect',
        'Schedule one 20-minute "do nothing" break daily',
        'Try the 4-7-8 breathing technique when feeling overwhelmed'
      ],
      nutrition: [
        'Take actual lunch breaks away from your desk',
        'Eat protein within 1 hour of waking to stabilize blood sugar',
        'Have a protein snack if you experience energy dips',
        'Avoid caffeine after 2 PM to protect sleep quality'
      ],
      movement: [
        '10-minute walk outside or 5-minute breathing break every afternoon',
        'Gentle stretching or yoga before bed',
        'Take stairs instead of elevators when possible',
        'Park farther away to add movement to your day'
      ]
    },
    timeline: {
      week1: 'Focus on sleep optimization and saying no to one commitment',
      week2: 'Add stress-reduction practices and protein timing',
      week4: 'Should notice improved energy stability',
      week8: 'Significant improvement in stress resilience and energy'
    },
    optional: [
      'B-complex vitamin for persistent low energy',
      'Rhodiola (200-400mg) if you prefer it over ashwagandha',
      'Magnesium glycinate (400mg) before bed for deeper sleep'
    ]
  },
  'Profile 2: Hormonal Roller Coaster': {
    description: 'Your hormonal fluctuations are creating chaos in your energy, mood, and libido. This protocol provides targeted support for hormone balance throughout your entire cycle.',
    detailedDescription: 'Hormonal imbalances often stem from stress, poor nutrition timing, and lack of cycle awareness. Supporting your body\'s natural rhythms while providing targeted nutrients can restore balance.',
    supplements: [
      {
        name: 'EMBER',
        dosage: '2 capsules with breakfast',
        purpose: 'Comprehensive hormone support',
        timing: 'Morning with food',
        benefits: 'Contains hormone-balancing herbs and nutrients that support healthy estrogen and progesterone levels'
      },
      {
        name: 'STEADY',
        dosage: '1 capsule daily (increase to 2 during luteal phase)',
        purpose: 'Mood stability and PMS support',
        timing: 'Morning, add evening dose days 22-28',
        benefits: 'Helps manage mood swings, supports healthy stress response during hormonal fluctuations'
      },
      {
        name: 'CHARGE',
        dosage: '1 capsule with breakfast',
        purpose: 'Consistent energy throughout cycle',
        timing: 'Morning with food',
        benefits: 'Provides B-vitamins crucial for hormone production and energy metabolism'
      }
    ],
    lifestyle: {
      tracking: [
        'Track your cycle and energy patterns for 3 months using an app',
        'Note mood, energy, sleep quality, and libido daily',
        'Track when you feel most creative and productive',
        'Record any PMS symptoms and their severity'
      ],
      cyclical: [
        'Schedule demanding tasks during days 8-21 (follicular/ovulation)',
        'Plan rest and self-care during days 22-28 (luteal phase)',
        'Allow for more carbohydrates during luteal phase',
        'Reduce intense exercise during menstruation'
      ],
      selfcare: [
        'Take Epsom salt baths 2-3 times per week',
        'Practice gentle self-massage with essential oils',
        'Prioritize warm, cooked foods during menstruation',
        'Create cozy evening routines during luteal phase'
      ],
      nutrition: [
        'Focus on anti-inflammatory foods especially during luteal phase',
        'Include healthy fats at every meal for hormone production',
        'Eat protein within 1 hour of waking',
        'Minimize sugar and processed foods during PMS week'
      ]
    },
    timeline: {
      week1: 'Begin cycle tracking and supplement routine',
      week4: 'Should notice some mood stability improvements',
      week12: 'Significant improvements in PMS and energy patterns',
      week24: 'Hormonal patterns should be much more balanced'
    },
    optional: [
      'DIM (100-200mg) to support estrogen metabolism',
      'Evening primrose oil (1000mg) for hormone balance',
      'Extra magnesium during luteal phase (400-600mg)',
      'Vitex (400mg) for progesterone support if needed'
    ]
  },
  'Profile 3: Medicated and Struggling': {
    description: 'Your chemical interference score suggests you need support while managing medications and reducing toxic burden.',
    detailedDescription: 'Many medications can interfere with libido and energy by depleting nutrients, affecting liver function, or disrupting hormonal balance. This protocol supports your body while you work with medications.',
    supplements: [
      {
        name: 'EMBER',
        dosage: '2 capsules morning and evening',
        purpose: 'Comprehensive support and nutrient repletion',
        timing: 'Morning and evening with food',
        benefits: 'Replaces nutrients depleted by medications, supports liver detoxification pathways'
      },
      {
        name: 'STEADY',
        dosage: '1 capsule twice daily',
        purpose: 'Natural stress response support',
        timing: 'Morning and evening with food',
        benefits: 'Supports natural stress resilience when medications may interfere with normal responses'
      },
      {
        name: 'CHARGE',
        dosage: '1 capsule with lunch',
        purpose: 'Cellular energy and mitochondrial support',
        timing: 'Midday with meal',
        benefits: 'Supports energy production when medications may cause fatigue'
      }
    ],
    lifestyle: {
      medical: [
        'Work with your doctor to discuss medication timing to minimize sexual side effects',
        'Ask about medication holidays or dose reductions when appropriate',
        'Consider working with functional medicine doctor alongside conventional doctor',
        'Keep a medication and symptom diary to track patterns'
      ],
      detox: [
        'Increase water intake by 16-32oz to your daily target',
        'Include cruciferous vegetables 3-4 times per week for liver support',
        'Add fiber-rich foods to support elimination',
        'Consider gentle lymphatic drainage massage'
      ],
      nutrition: [
        'Take supplements at least 2 hours away from medications unless directed otherwise',
        'Focus on nutrient-dense whole foods to replace what medications deplete',
        'Avoid grapefruit if on medications that interact with it',
        'Consider meal timing to optimize medication absorption'
      ],
      support: [
        'Find a healthcare team that understands medication effects on sexuality',
        'Join support groups for people managing similar health conditions',
        'Communicate openly with your partner about medication effects',
        'Practice stress reduction as medications can increase stress on the body'
      ]
    },
    timeline: {
      week1: 'Begin detox support and nutrient repletion',
      week4: 'Should notice some improvement in energy levels',
      week8: 'Liver function support should be helping with detoxification',
      week16: 'Work with doctor to assess if any medication adjustments are possible'
    },
    optional: [
      'CoQ10 if on statins, B-complex if on metformin/birth control',
      'Vitamin D3 (2000-4000 IU) if on antidepressants',
      'Milk thistle (200mg) for additional liver support',
      'Probiotics if on medications affecting gut health'
    ]
  },
  'Profile 4: Inflamed and Exhausted': {
    description: 'Your inflammatory fire score indicates you need comprehensive anti-inflammatory support and gentle healing approach.',
    detailedDescription: 'Chronic inflammation creates a cascade of problems including hormonal disruption, energy depletion, and immune dysfunction. This protocol focuses on reducing inflammation while supporting cellular repair.',
    supplements: [
      {
        name: 'EMBER',
        dosage: '2 capsules daily with meals',
        purpose: 'Anti-inflammatory support and cellular repair',
        timing: 'Morning and evening with food',
        benefits: 'Contains powerful anti-inflammatory compounds and antioxidants to reduce systemic inflammation'
      },
      {
        name: 'STEADY',
        dosage: '1 capsule twice daily',
        purpose: 'Stress-related inflammation management',
        timing: 'Morning and evening with food',
        benefits: 'Helps break the stress-inflammation cycle that perpetuates chronic inflammation'
      },
      {
        name: 'CHARGE',
        dosage: '1 capsule daily',
        purpose: 'Cellular repair and energy support',
        timing: 'Morning with food',
        benefits: 'Supports mitochondrial function and cellular repair processes'
      }
    ],
    lifestyle: {
      nutrition: [
        'Remove "Big 3" inflammatory foods for 30 days: sugar, processed foods, excess caffeine',
        'Add bone broth or collagen-rich foods to meals',
        'Focus on colorful anti-inflammatory foods (berries, leafy greens, fatty fish)',
        'Consider an elimination diet to identify personal triggers'
      ],
      movement: [
        'Focus on gentle movement only until inflammation reduces (yoga, walking)',
        'Avoid high-intensity exercise until inflammation is under control',
        'Try restorative yoga or gentle stretching daily',
        'Swimming in warm water can be soothing for inflamed joints'
      ],
      stress: [
        'Stress reduction is absolutely critical - make it your #1 priority',
        'Practice daily meditation or deep breathing exercises',
        'Consider therapy or counseling to address chronic stress patterns',
        'Create boundaries to protect your energy and reduce stressors'
      ],
      healing: [
        'Focus on sleep quality over quantity initially',
        'Consider working with functional medicine practitioner for advanced gut testing',
        'Try infrared sauna or warm baths to support detoxification',
        'Practice self-compassion as healing takes time'
      ]
    },
    timeline: {
      week1: 'Begin anti-inflammatory diet and gentle movement',
      week4: 'Should notice reduction in pain and better sleep',
      week8: 'Energy levels should start improving',
      week16: 'Significant reduction in inflammatory symptoms'
    },
    optional: [
      'Remove full "Big 8": gluten, dairy, sugar, corn, soy, eggs, nuts, nightshades',
      'Omega-3 fatty acids (2-3g daily)',
      'Curcumin with black pepper (500-1000mg)',
      'L-glutamine (5g twice daily), Probiotics (50+ billion CFU daily)'
    ]
  },
  'Profile 5: Sugar-Burning Crash Queen': {
    description: 'Your blood sugar chaos score shows you need metabolic support and blood sugar stabilization strategies.',
    detailedDescription: 'Blood sugar instability creates a roller coaster of energy, mood, and hormone disruption. Stabilizing blood sugar is foundational to restoring energy and hormonal balance.',
    supplements: [
      {
        name: 'EMBER',
        dosage: '2 capsules with breakfast',
        purpose: 'Metabolic support and insulin sensitivity',
        timing: 'Morning with food',
        benefits: 'Contains nutrients that support healthy glucose metabolism and insulin function'
      },
      {
        name: 'STEADY',
        dosage: '1 capsule daily',
        purpose: 'Stress-related blood sugar management',
        timing: 'Morning with food',
        benefits: 'Helps manage cortisol levels that can cause blood sugar swings'
      },
      {
        name: 'CHARGE',
        dosage: '1 capsule with lunch',
        purpose: 'Stable energy without crashes',
        timing: 'Midday with meal',
        benefits: 'Supports sustained energy production and prevents afternoon crashes'
      }
    ],
    lifestyle: {
      nutrition: [
        'Never eat carbohydrates alone - always pair with protein and fat',
        'Eat within 1 hour of waking, then every 3-4 hours maximum',
        'Stop eating 3 hours before bed, eat largest meals earlier in day',
        'Never skip meals, even if not hungry'
      ],
      emergency: [
        'Always carry protein snacks (nuts, seeds, hard-boiled eggs)',
        'For severe crashes: 1 tablespoon almond butter with cinnamon',
        'Keep blood sugar emergency kit: protein bar, nuts, apple with nut butter',
        'Learn to recognize early warning signs of blood sugar drops'
      ],
      planning: [
        'Plan all meals and snacks in advance',
        'Prepare emergency snacks for travel or busy days',
        'Track blood sugar patterns with food to identify triggers',
        'Consider continuous glucose monitoring for detailed insights'
      ],
      hydration: [
        'Drink water before feeling thirsty to prevent dehydration crashes',
        'Avoid sugary drinks that cause blood sugar spikes',
        'Try herbal teas between meals for sustained hydration',
        'Add electrolytes if experiencing frequent crashes'
      ]
    },
    timeline: {
      week1: 'Focus on meal timing and protein pairing',
      week2: 'Should notice fewer energy crashes',
      week4: 'Energy levels should be more stable throughout the day',
      week8: 'Blood sugar patterns should be significantly improved'
    },
    optional: [
      'Chromium (200-400mcg with meals)',
      'Alpha lipoic acid (300mg twice daily)',
      'Cinnamon extract (500mg with carbohydrate-containing meals)'
    ]
  },
  'Profile 6: Sleep-Deprived Zombie': {
    description: 'Your sleep disruption score indicates you need comprehensive sleep support and circadian rhythm restoration.',
    detailedDescription: 'Poor sleep creates a cascade of hormonal disruptions affecting cortisol, growth hormone, and sex hormones. Restoring healthy sleep patterns is crucial for energy and libido restoration.',
    supplements: [
      {
        name: 'EMBER',
        dosage: '1 capsule with breakfast, 1 capsule with dinner',
        purpose: 'Circadian rhythm support',
        timing: 'Morning and early evening with food',
        benefits: 'Contains nutrients that support healthy sleep-wake cycles and hormone production'
      },
      {
        name: 'STEADY',
        dosage: '1 capsule 2 hours before bed',
        purpose: 'Sleep quality and relaxation',
        timing: '2 hours before bedtime',
        benefits: 'Promotes relaxation and helps calm the nervous system for better sleep'
      },
      {
        name: 'CHARGE',
        dosage: '1 capsule with breakfast only',
        purpose: 'Morning energy without evening disruption',
        timing: 'Morning with food only',
        benefits: 'Provides energizing nutrients without interfering with sleep'
      }
    ],
    lifestyle: {
      environment: [
        'Room temperature 65-68°F with blackout curtains or eye mask',
        'White noise machine or earplugs for consistent sound environment',
        'Remove all electronics from bedroom or use airplane mode',
        'Invest in comfortable mattress and pillows that support good alignment'
      ],
      routine: [
        'Same sleep/wake time every day, including weekends',
        'Create a wind-down routine starting 1-2 hours before bed',
        'No screens in bedroom, use blue light blockers if must use devices in evening',
        'Try reading, gentle stretching, or meditation before bed'
      ],
      timing: [
        'No caffeine after 2 PM, exercise earlier in the day',
        'Finish eating at least 3 hours before bedtime',
        'Get morning sunlight exposure within 30 minutes of waking',
        'Dim lights in the evening to signal bedtime to your body'
      ],
      troubleshooting: [
        'Consider sleep study if snoring or breathing issues persist',
        'Track sleep patterns to identify what helps vs. hurts',
        'Address racing thoughts with journaling or brain dump before bed',
        'If you can\'t fall asleep in 20 minutes, get up and do a quiet activity'
      ]
    },
    timeline: {
      week1: 'Focus on sleep environment and routine',
      week2: 'Should notice easier time falling asleep',
      week4: 'Sleep quality and morning energy should improve',
      week8: 'Circadian rhythm should be well-established'
    },
    optional: [
      'Melatonin (0.5-3mg) 30 minutes before desired sleep time',
      'Magnesium glycinate (400-600mg before bed)',
      'L-theanine (200mg) if mind races at bedtime'
    ]
  },
  'Profile 7: Toxic and Overwhelmed': {
    description: 'Your combined chemical interference and inflammatory fire scores indicate you need gentle detox support and environmental modifications.',
    detailedDescription: 'Chemical toxins can overwhelm your body\'s natural detoxification systems, leading to hormonal disruption and chronic inflammation. This protocol supports gentle detoxification while reducing toxic burden.',
    supplements: [
      {
        name: 'EMBER',
        dosage: 'Start with 1 capsule, gradually increase to 2 daily',
        purpose: 'Gentle detox support and cellular protection',
        timing: 'With meals, start slowly',
        benefits: 'Supports liver detoxification pathways and provides antioxidant protection'
      },
      {
        name: 'STEADY',
        dosage: '1 capsule twice daily',
        purpose: 'Stress resilience during detoxification',
        timing: 'Morning and evening with food',
        benefits: 'Supports the nervous system during the stress of detoxification'
      },
      {
        name: 'CHARGE',
        dosage: '1 capsule daily',
        purpose: 'Cellular energy during healing',
        timing: 'Morning with food',
        benefits: 'Provides energy for cellular repair and detoxification processes'
      }
    ],
    lifestyle: {
      immediate: [
        'Switch to non-toxic cleaning products immediately',
        'Use glass containers instead of plastic for food storage',
        'Filter your water if possible',
        'Replace synthetic fragrances with essential oils or fragrance-free products'
      ],
      nutrition: [
        'Choose organic foods when possible, especially "Dirty Dozen" list',
        'Support liver with cruciferous vegetables and sulfur-rich foods',
        'Increase fiber intake to support elimination',
        'Stay well-hydrated to support kidney function'
      ],
      gentle: [
        'Go slowly with all changes - support your body\'s natural detox pathways',
        'Focus on gentle movement and stress reduction',
        'Don\'t overwhelm your system with aggressive detox protocols',
        'Listen to your body and rest when needed'
      ],
      professional: [
        'Work with practitioner experienced in environmental illness',
        'Consider testing for heavy metals or chemical burden',
        'May need specific detox protocols based on your toxic load',
        'Consider mold testing if you suspect environmental mold exposure'
      ]
    },
    timeline: {
      week1: 'Begin environmental changes and gentle supplement support',
      week4: 'Should notice some improvement in energy and mental clarity',
      week8: 'Detoxification pathways should be better supported',
      week16: 'Significant improvement in symptoms related to toxic burden'
    },
    optional: [
      'NAC (600mg) and milk thistle (300mg) for extra liver support',
      'Sauna or hot baths 2-3 times per week if tolerated',
      'Glutathione support if working with a practitioner',
      'Activated charcoal (away from supplements) for acute exposure'
    ]
  }
};

const SupplementCard = ({ supplement }: { supplement: any }) => (
  <Card className="h-full">
    <CardContent className="p-4">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-primary">{supplement.name}</h4>
        <Badge variant="outline">{supplement.timing}</Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-2">{supplement.dosage}</p>
      <p className="text-sm font-medium mb-2">{supplement.purpose}</p>
      <p className="text-xs text-muted-foreground">{supplement.benefits}</p>
    </CardContent>
  </Card>
);

const LifestyleSection = ({ title, items, icon: Icon }: { title: string; items: string[]; icon: any }) => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="text-lg flex items-center gap-2">
        <Icon className="h-5 w-5 text-primary" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
            <span className="text-sm">{item}</span>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

const TimelineCard = ({ timeline }: { timeline: any }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg flex items-center gap-2">
        <Clock className="h-5 w-5 text-primary" />
        Your Restoration Timeline
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {Object.entries(timeline).map(([period, description]) => (
          <div key={period} className="flex items-start gap-3">
            <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
              {period.replace('week', 'W')}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{description as string}</p>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

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

  const handleBuySupplements = () => {
    // This will eventually connect to Shopify
    window.open('https://shop.embermethod.com', '_blank');
  };

  return (
    <div className="space-y-8">
      {/* Header with Buy Button */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl text-primary mb-2">
                Your Personalized {result.primaryProfile} Protocol
              </CardTitle>
              <p className="text-muted-foreground mb-2">
                {protocol.description}
              </p>
              <p className="text-sm text-muted-foreground">
                {protocol.detailedDescription}
              </p>
            </div>
            <div className="flex-shrink-0">
              <Button 
                onClick={handleBuySupplements}
                size="lg"
                className="w-full lg:w-auto"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Buy Supplements
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="supplements" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="supplements">Supplements</TabsTrigger>
          <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="optional">Optional</TabsTrigger>
        </TabsList>

        <TabsContent value="supplements" className="space-y-6">
          <Alert>
            <Target className="h-4 w-4" />
            <AlertDescription>
              Start with the core supplements below. Take them consistently for at least 4 weeks to see optimal results.
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {protocol.supplements.map((supplement, index) => (
              <SupplementCard key={index} supplement={supplement} />
            ))}
          </div>
          
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Important Notes:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Take supplements with food to improve absorption</li>
                <li>• Start gradually if you have a sensitive stomach</li>
                <li>• Consistency is more important than perfect timing</li>
                <li>• Store in a cool, dry place away from direct sunlight</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lifestyle" className="space-y-6">
          <Alert>
            <Heart className="h-4 w-4" />
            <AlertDescription>
              These lifestyle changes work synergistically with your supplements to accelerate healing and restoration.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(protocol.lifestyle as any).map(([key, items]) => {
              const iconMap: any = {
                sleep: Moon, stress: Heart, nutrition: Utensils, movement: Activity,
                tracking: Target, cyclical: Moon, selfcare: Heart, hydration: Droplets,
                medical: Heart, detox: Droplets, support: Heart, emergency: Target,
                planning: Target, environment: Moon, routine: Heart, timing: Clock,
                troubleshooting: Target, immediate: Target, gentle: Heart, professional: Heart,
                healing: Heart
              };
              const titleMap: any = {
                sleep: 'Sleep Optimization', stress: 'Stress Management', nutrition: 'Nutrition Guidelines',
                movement: 'Movement & Activity', tracking: 'Tracking & Awareness', cyclical: 'Cycle-Aware Living',
                selfcare: 'Self-Care Practices', hydration: 'Hydration & Detox', medical: 'Medical Coordination',
                detox: 'Detox Support', support: 'Support Systems', emergency: 'Emergency Protocol',
                planning: 'Planning & Preparation', environment: 'Sleep Environment', routine: 'Sleep Routine',
                timing: 'Timing Guidelines', troubleshooting: 'Troubleshooting', immediate: 'Immediate Changes',
                gentle: 'Gentle Approach', professional: 'Professional Support', healing: 'Healing Focus'
              };
              return (
                <LifestyleSection 
                  key={key}
                  title={titleMap[key] || key.charAt(0).toUpperCase() + key.slice(1)} 
                  items={items as string[]} 
                  icon={iconMap[key] || Target}
                />
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              Healing takes time. This timeline shows what to expect as your body restores balance.
            </AlertDescription>
          </Alert>
          
          <TimelineCard timeline={protocol.timeline} />
        </TabsContent>

        <TabsContent value="optional" className="space-y-6">
          <Alert>
            <AlertDescription>
              Consider these additional supplements if you don't see improvement after 4 weeks of following the core protocol.
            </AlertDescription>
          </Alert>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Optional Additional Support</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {protocol.optional.map((option, index) => (
                  <li key={index} className="flex items-start gap-2 p-3 border rounded-lg">
                    <span className="w-2 h-2 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">{option}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-orange-50 to-pink-50 border-primary/20">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold mb-4">Ready to Start Your Restoration Journey?</h3>
          <p className="text-muted-foreground mb-6">
            Get your personalized supplement bundle and start feeling like yourself again.
          </p>
          <Button onClick={handleBuySupplements} size="lg" className="mr-4">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Shop Your Protocol
          </Button>
          <Button variant="outline" size="lg">
            Download Protocol PDF
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}