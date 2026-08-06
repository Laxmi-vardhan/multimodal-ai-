import { db } from '../db/index.js';

export const searchFilesAndInsights = async (req, res, next) => {
  try {
    const query = req.body?.query || req.query?.query || '';
    const category = req.body?.category || req.query?.category;
    const mime_type = req.body?.mime_type || req.query?.mime_type;
    const q = (query || '').toLowerCase().trim();

    const userFiles = await db.getUserFiles(req.user.id);
    const userReports = await db.getUserReports(req.user.id);

    // Filter files matching query or parameters
    const matchedFiles = userFiles.filter(file => {
      const nameMatch = file.original_name.toLowerCase().includes(q);
      const categoryMatch = !category || category === 'All' || file.category === category;
      const mimeMatch = !mime_type || file.mime_type.includes(mime_type);

      let insightMatch = false;
      if (file.insights_json && typeof file.insights_json === 'object') {
        const textStr = JSON.stringify(file.insights_json).toLowerCase();
        insightMatch = textStr.includes(q);
      }

      return (nameMatch || insightMatch) && categoryMatch && mimeMatch;
    });

    // Filter AI reports matching query
    const matchedReports = userReports.filter(report => {
      const titleMatch = report.title.toLowerCase().includes(q);
      const summaryMatch = report.summary.toLowerCase().includes(q);
      const keywordMatch = report.keywords && Array.isArray(report.keywords) && report.keywords.some(k => String(k).toLowerCase().includes(q));
      return titleMatch || summaryMatch || keywordMatch;
    });

    return res.json({
      success: true,
      query,
      results: {
        filesCount: matchedFiles.length,
        reportsCount: matchedReports.length,
        files: matchedFiles,
        reports: matchedReports
      }
    });
  } catch (err) {
    next(err);
  }
};
