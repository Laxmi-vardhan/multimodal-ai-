import express from 'express';
import { generateReport, getUserReports, getReportById, exportReportPDF, deleteReport } from '../controllers/reportController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { generateReportSchema } from '../utils/zodSchemas.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/generate', validate(generateReportSchema), generateReport);
router.get('/', getUserReports);
router.get('/:id', getReportById);
router.get('/:id/pdf', exportReportPDF);
router.delete('/:id', deleteReport);

export default router;
