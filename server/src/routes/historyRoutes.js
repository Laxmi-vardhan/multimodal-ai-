import express from 'express';
import { getUserHistory, toggleFavorite, getUserFavorites } from '../controllers/historyController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getUserHistory);
router.post('/favorites', toggleFavorite);
router.get('/favorites', getUserFavorites);

export default router;
