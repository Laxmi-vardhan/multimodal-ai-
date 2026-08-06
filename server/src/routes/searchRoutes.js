import express from 'express';
import { searchFilesAndInsights } from '../controllers/searchController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { searchQuerySchema } from '../utils/zodSchemas.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/', validate(searchQuerySchema), searchFilesAndInsights);

export default router;
