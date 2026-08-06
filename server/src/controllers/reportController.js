import { db } from '../db/index.js';
import { processMultimodalContent } from '../services/geminiService.js';
import { generateReportPDF } from '../services/pdfService.js';

export const generateReport = async (req, res, next) => {
  try {
    const { file_ids, title, user_prompt, userPrompt, category } = req.body;

    const allUserFiles = await db.getUserFiles(req.user.id);
    const selectedFiles = allUserFiles.filter(f => file_ids.includes(f.id));

    if (selectedFiles.length === 0) {
      return res.status(404).json({ success: false, error: 'None of the requested files were found.' });
    }

    // Call Gemini Multimodal SDK
    const aiResult = await processMultimodalContent({
      files: selectedFiles,
      userPrompt: user_prompt || userPrompt
    });

    const reportTitle = title || `Multimodal AI Synthesis — ${selectedFiles.map(f => f.original_name).join(', ')}`;

    const report = await db.createReport({
      user_id: req.user.id,
      file_ids,
      title: reportTitle,
      summary: aiResult.summary || 'Summary unavailable.',
      insights_json: aiResult.insights || [],
      keywords: aiResult.keywords || [],
      actions: aiResult.actions || [],
      flashcards_json: aiResult.flashcards || [],
      quiz_json: aiResult.quiz || [],
      references_json: aiResult.references || []
    });

    await db.addHistory({
      user_id: req.user.id,
      action_type: 'REPORT_GENERATE',
      description: `Generated AI Multimodal Report: "${reportTitle}"`,
      resource_id: report.id
    });

    return res.status(201).json({ success: true, report });
  } catch (err) {
    next(err);
  }
};

export const getUserReports = async (req, res, next) => {
  try {
    const reports = await db.getUserReports(req.user.id);
    return res.json({ success: true, reports });
  } catch (err) {
    next(err);
  }
};

export const getReportById = async (req, res, next) => {
  try {
    const report = await db.getReportById(req.params.id, req.user.id);
    if (!report) {
      return res.status(404).json({ success: false, error: 'Report not found.' });
    }
    return res.json({ success: true, report });
  } catch (err) {
    next(err);
  }
};

export const exportReportPDF = async (req, res, next) => {
  try {
    const report = await db.getReportById(req.params.id, req.user.id);
    if (!report) {
      return res.status(404).json({ success: false, error: 'Report not found.' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="OmniFusion-Report-${report.id.slice(0, 8)}.pdf"`);

    generateReportPDF(report, res);
  } catch (err) {
    next(err);
  }
};

export const deleteReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.deleteReport(id, req.user.id);
    return res.json({ success: true, message: 'Report deleted.' });
  } catch (err) {
    next(err);
  }
};
