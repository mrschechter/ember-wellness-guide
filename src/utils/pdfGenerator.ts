import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { type AssessmentResult } from '@/types/assessment';

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
      "Say 'no' to one commitment this week and delegate one task you usually do yourself",
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
      "Go slowly with all changes - support your body's natural detox pathways",
      'Focus on gentle movement and stress reduction',
      'Work with practitioner experienced in environmental illness'
    ],
    optional: [
      'NAC (600mg) and milk thistle (300mg) for extra liver support',
      'Sauna or hot baths 2-3 times per week if tolerated'
    ]
  }
};

export async function generateAssessmentPDF(result: AssessmentResult): Promise<void> {
  const protocol = PROTOCOL_DATA[result.primaryProfile as keyof typeof PROTOCOL_DATA];
  const topPriorities = result.sectionScores
    .filter(s => s.impactLevel === 'major')
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  // Create PDF
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  const lineHeight = 6;
  let yPosition = margin;

  // Helper function to add text with word wrapping
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10) => {
    pdf.setFontSize(fontSize);
    const lines = pdf.splitTextToSize(text, maxWidth);
    pdf.text(lines, x, y);
    return y + (lines.length * lineHeight);
  };

  // Helper function to check if we need a new page
  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
    }
  };

  // Header
  pdf.setFontSize(20);
  pdf.setTextColor(139, 92, 246); // Primary color
  pdf.text('The Ember Method Assessment Results', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  pdf.setFontSize(12);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Completed on ${result.completedAt.toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 20;

  // Primary Profile Section
  checkPageBreak(40);
  pdf.setFontSize(16);
  pdf.setTextColor(139, 92, 246);
  pdf.text('Your Primary Profile', margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  yPosition = addWrappedText(result.primaryProfile, margin, yPosition, pageWidth - 2 * margin, 14);
  yPosition += 5;

  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  yPosition = addWrappedText('This profile is based on your highest scoring section and represents your primary health pattern.', margin, yPosition, pageWidth - 2 * margin);
  yPosition += 15;

  // Section Scores
  checkPageBreak(60);
  pdf.setFontSize(16);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Section Scores', margin, yPosition);
  yPosition += 15;

  result.sectionScores.forEach((section) => {
    checkPageBreak(25);
    
    // Section title and score
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text(section.title, margin, yPosition);
    pdf.text(`${section.score}/${section.maxScore}`, pageWidth - margin - 20, yPosition, { align: 'right' });
    yPosition += 8;

    // Progress bar background
    pdf.setFillColor(229, 231, 235);
    pdf.rect(margin, yPosition - 3, pageWidth - 2 * margin - 40, 4, 'F');

    // Progress bar fill
    const fillWidth = ((section.score / section.maxScore) * (pageWidth - 2 * margin - 40));
    const fillColor = section.impactLevel === 'minimal' ? [16, 185, 129] : 
                     section.impactLevel === 'moderate' ? [245, 158, 11] : [239, 68, 68];
    pdf.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
    pdf.rect(margin, yPosition - 3, fillWidth, 4, 'F');

    yPosition += 8;

    // Impact level
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    const impactLabel = section.impactLevel === 'minimal' ? 'Minimal Impact (0-8 points)' : 
                       section.impactLevel === 'moderate' ? 'Moderate Impact (9-16 points)' : 
                       'Major Impact (17-24 points)';
    pdf.text(impactLabel, margin, yPosition);
    yPosition += 12;
  });

  // Priority Areas
  if (topPriorities.length > 0) {
    checkPageBreak(60);
    pdf.setFontSize(16);
    pdf.setTextColor(239, 68, 68);
    pdf.text('Priority Areas for Attention', margin, yPosition);
    yPosition += 10;

    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    yPosition = addWrappedText('These areas scored 17+ points and should be your primary focus:', margin, yPosition, pageWidth - 2 * margin);
    yPosition += 10;

    topPriorities.forEach((section, index) => {
      checkPageBreak(12);
      pdf.setFontSize(11);
      pdf.setTextColor(239, 68, 68);
      pdf.text(`#${index + 1}`, margin, yPosition);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`${section.title} (${section.score}/${section.maxScore} points)`, margin + 15, yPosition);
      yPosition += 8;
    });
    yPosition += 10;
  }

  // Protocol Section
  if (protocol) {
    checkPageBreak(80);
    pdf.addPage();
    yPosition = margin;

    // Protocol Header
    pdf.setFontSize(18);
    pdf.setTextColor(139, 92, 246);
    pdf.text('Your Personalized Protocol', margin, yPosition);
    yPosition += 15;

    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    yPosition = addWrappedText(protocol.description, margin, yPosition, pageWidth - 2 * margin);
    yPosition += 15;

    // Core Supplements
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Core Supplement Protocol', margin, yPosition);
    yPosition += 10;

    protocol.supplements.forEach((supplement) => {
      checkPageBreak(8);
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      pdf.text('•', margin, yPosition);
      yPosition = addWrappedText(supplement, margin + 5, yPosition, pageWidth - 2 * margin - 5);
      yPosition += 2;
    });
    yPosition += 8;

    // Lifestyle Changes
    checkPageBreak(30);
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Immediate Lifestyle Changes', margin, yPosition);
    yPosition += 10;

    protocol.lifestyle.forEach((change) => {
      checkPageBreak(8);
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      pdf.text('•', margin, yPosition);
      yPosition = addWrappedText(change, margin + 5, yPosition, pageWidth - 2 * margin - 5);
      yPosition += 2;
    });
    yPosition += 8;

    // Optional Support
    checkPageBreak(30);
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Optional Support', margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    yPosition = addWrappedText('Consider these if no improvement after following the core protocol for 2-4 weeks:', margin, yPosition, pageWidth - 2 * margin);
    yPosition += 8;

    protocol.optional.forEach((option) => {
      checkPageBreak(8);
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text('•', margin, yPosition);
      yPosition = addWrappedText(option, margin + 5, yPosition, pageWidth - 2 * margin - 5);
      yPosition += 2;
    });
  }

  // Footer
  checkPageBreak(30);
  yPosition = pageHeight - 40;
  pdf.setFontSize(9);
  pdf.setTextColor(100, 100, 100);
  pdf.text("© 2024 The Ember Method. Empowering women's health through personalized wellness.", pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 6;
  pdf.text('This assessment is for educational purposes only and does not replace professional medical advice.', pageWidth / 2, yPosition, { align: 'center' });

  // Download PDF
  const filename = `ember-method-assessment-${result.completedAt.toISOString().split('T')[0]}.pdf`;
  pdf.save(filename);
}