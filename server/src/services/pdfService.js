import PDFDocument from 'pdfkit';

export const generateReportPDF = (reportData, res) => {
  const doc = new PDFDocument({ margin: 40, size: 'A4' });

  // Stream PDF to HTTP response
  doc.pipe(res);

  // Styling palette
  const primaryColor = '#4F46E5'; // Indigo
  const secondaryColor = '#0EA5E9'; // Sky
  const darkTextColor = '#1F2937';
  const mutedTextColor = '#4B5563';

  // Title Banner
  doc
    .fillColor(primaryColor)
    .fontSize(24)
    .font('Helvetica-Bold')
    .text('OmniFusion AI — Multimodal Analysis Report', { align: 'center' });

  doc.moveDown(0.5);

  doc
    .fillColor(mutedTextColor)
    .fontSize(10)
    .font('Helvetica')
    .text(`Report Title: ${reportData.title || 'AI Document Analysis'}`, { align: 'center' })
    .text(`Generated Date: ${new Date(reportData.created_at || Date.now()).toLocaleString()}`, { align: 'center' });

  doc.moveDown(1);
  doc.strokeColor('#E5E7EB').lineWidth(1).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
  doc.moveDown(1);

  // Executive Summary
  doc
    .fillColor(primaryColor)
    .fontSize(16)
    .font('Helvetica-Bold')
    .text('1. Executive Summary');

  doc.moveDown(0.5);

  doc
    .fillColor(darkTextColor)
    .fontSize(11)
    .font('Helvetica')
    .text(reportData.summary || 'No summary available.', { align: 'justify', lineGap: 4 });

  doc.moveDown(1.5);

  const safeArray = (val) => {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return [];
  };

  const insights = safeArray(reportData.insights_json);
  const flashcards = safeArray(reportData.flashcards_json);
  const quiz = safeArray(reportData.quiz_json);
  const keywords = safeArray(reportData.keywords);

  // Key Insights
  if (insights.length > 0) {
    doc
      .fillColor(primaryColor)
      .fontSize(16)
      .font('Helvetica-Bold')
      .text('2. Key Insights & Takeaways');

    doc.moveDown(0.5);

    insights.forEach((insight, idx) => {
      doc
        .fillColor(secondaryColor)
        .fontSize(12)
        .font('Helvetica-Bold')
        .text(`• Insight ${idx + 1}: `, { continued: true })
        .fillColor(darkTextColor)
        .font('Helvetica')
        .fontSize(11)
        .text(insight, { lineGap: 3 });
      doc.moveDown(0.3);
    });

    doc.moveDown(1);
  }

  // Actionable Items & Keywords
  if (keywords.length > 0) {
    doc
      .fillColor(primaryColor)
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('Keywords: ', { continued: true })
      .fillColor(darkTextColor)
      .font('Helvetica')
      .fontSize(11)
      .text(keywords.join(', '));
    doc.moveDown(1);
  }

  // Flashcards Section
  if (flashcards.length > 0) {
    doc
      .fillColor(primaryColor)
      .fontSize(16)
      .font('Helvetica-Bold')
      .text('3. AI Study Flashcards');

    doc.moveDown(0.5);

    flashcards.forEach((card, i) => {
      doc
        .fillColor(primaryColor)
        .fontSize(11)
        .font('Helvetica-Bold')
        .text(`Q${i + 1}: ${card.question}`);

      doc
        .fillColor(darkTextColor)
        .fontSize(10)
        .font('Helvetica')
        .text(`Ans: ${card.answer}`, { lineGap: 4 });

      doc.moveDown(0.5);
    });

    doc.moveDown(1);
  }

  // Quiz Section
  if (quiz.length > 0) {
    doc
      .fillColor(primaryColor)
      .fontSize(16)
      .font('Helvetica-Bold')
      .text('4. Multimodal Quiz & Knowledge Evaluation');

    doc.moveDown(0.5);

    quiz.forEach((q, i) => {
      doc
        .fillColor(darkTextColor)
        .fontSize(11)
        .font('Helvetica-Bold')
        .text(`Q${i + 1}: ${q.question}`);

      if (q.options) {
        q.options.forEach((opt, optIdx) => {
          doc
            .fillColor(mutedTextColor)
            .fontSize(10)
            .font('Helvetica')
            .text(`   [ ${String.fromCharCode(65 + optIdx)} ] ${opt}`);
        });
      }

      doc
        .fillColor('#059669')
        .fontSize(10)
        .font('Helvetica-Bold')
        .text(`   Correct Answer: ${q.answer}`);

      if (q.explanation) {
        doc
          .fillColor(mutedTextColor)
          .fontSize(9)
          .font('Helvetica-Oblique')
          .text(`   Explanation: ${q.explanation}`);
      }

      doc.moveDown(0.8);
    });
  }

  // Footer
  doc.moveDown(2);
  doc
    .fillColor(mutedTextColor)
    .fontSize(9)
    .font('Helvetica-Oblique')
    .text('Generated automatically by OmniFusion AI Platform.', { align: 'center' });

  doc.end();
};
