import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { type AssessmentResult } from '@/types/assessment';

export async function generateAssessmentPDF(result: AssessmentResult): Promise<void> {
  // Create a temporary container for PDF content
  const tempContainer = document.createElement('div');
  tempContainer.style.position = 'absolute';
  tempContainer.style.top = '-9999px';
  tempContainer.style.left = '-9999px';
  tempContainer.style.width = '800px';
  tempContainer.style.backgroundColor = 'white';
  tempContainer.style.padding = '40px';
  tempContainer.style.fontFamily = 'Arial, sans-serif';
  
  // Create PDF content
  tempContainer.innerHTML = `
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #8B5CF6; font-size: 28px; margin-bottom: 10px;">The Ember Method Assessment Results</h1>
      <p style="color: #666; font-size: 14px;">Completed on ${result.completedAt.toLocaleDateString()}</p>
    </div>

    <div style="background: #F8F9FA; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
      <h2 style="color: #8B5CF6; font-size: 20px; margin-bottom: 15px;">Your Primary Profile</h2>
      <div style="font-size: 18px; font-weight: bold; color: #333; margin-bottom: 10px;">
        ${result.primaryProfile}
      </div>
      <p style="color: #666; font-size: 14px;">
        This profile is based on your highest scoring section and represents your primary health pattern.
      </p>
    </div>

    <div style="margin-bottom: 30px;">
      <h2 style="color: #333; font-size: 20px; margin-bottom: 20px;">Section Scores</h2>
      ${result.sectionScores.map(section => `
        <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #E5E7EB; border-radius: 6px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <h3 style="font-size: 16px; font-weight: 600; color: #333; margin: 0;">${section.title}</h3>
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 14px; font-weight: 500;">${section.score}/${section.maxScore}</span>
              <span style="
                padding: 4px 8px; 
                border-radius: 4px; 
                font-size: 12px; 
                font-weight: 500;
                background: ${section.impactLevel === 'minimal' ? '#10B981' : section.impactLevel === 'moderate' ? '#F59E0B' : '#EF4444'};
                color: white;
              ">
                ${section.impactLevel.charAt(0).toUpperCase() + section.impactLevel.slice(1)}
              </span>
            </div>
          </div>
          <div style="background: #E5E7EB; height: 8px; border-radius: 4px; overflow: hidden;">
            <div style="
              background: ${section.impactLevel === 'minimal' ? '#10B981' : section.impactLevel === 'moderate' ? '#F59E0B' : '#EF4444'};
              height: 100%;
              width: ${(section.score / section.maxScore) * 100}%;
              border-radius: 4px;
            "></div>
          </div>
          <p style="font-size: 12px; color: #666; margin-top: 5px; margin-bottom: 0;">
            ${section.impactLevel === 'minimal' ? 'Minimal Impact (0-8 points)' : 
              section.impactLevel === 'moderate' ? 'Moderate Impact (9-16 points)' : 
              'Major Impact (17-24 points)'}
          </p>
        </div>
      `).join('')}
    </div>

    ${result.sectionScores.filter(s => s.impactLevel === 'major').length > 0 ? `
      <div style="margin-bottom: 30px;">
        <h2 style="color: #EF4444; font-size: 20px; margin-bottom: 15px;">Priority Areas for Attention</h2>
        <p style="color: #666; font-size: 14px; margin-bottom: 15px;">
          These areas scored 17+ points and should be your primary focus:
        </p>
        ${result.sectionScores
          .filter(s => s.impactLevel === 'major')
          .sort((a, b) => b.score - a.score)
          .slice(0, 3)
          .map((section, index) => `
            <div style="display: flex; align-items: center; gap: 15px; padding: 12px; background: #FEF2F2; border-radius: 6px; margin-bottom: 8px;">
              <span style="font-weight: bold; color: #EF4444;">#${index + 1}</span>
              <span style="font-weight: 500;">${section.title}</span>
              <span style="font-size: 14px; color: #666;">(${section.score}/${section.maxScore} points)</span>
            </div>
          `).join('')}
      </div>
    ` : ''}

    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E7EB; text-align: center;">
      <p style="font-size: 12px; color: #666; margin-bottom: 5px;">
        © 2024 The Ember Method. Empowering women's health through personalized wellness.
      </p>
      <p style="font-size: 12px; color: #666; margin: 0;">
        This assessment is for educational purposes only and does not replace professional medical advice.
      </p>
    </div>
  `;

  document.body.appendChild(tempContainer);

  try {
    // Generate canvas from HTML
    const canvas = await html2canvas(tempContainer, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    // Add first page
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Download PDF
    const filename = `ember-method-assessment-${result.completedAt.toISOString().split('T')[0]}.pdf`;
    pdf.save(filename);

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF report');
  } finally {
    // Clean up
    document.body.removeChild(tempContainer);
  }
}