import express from 'express';
import { updateProfile, getProfileStats } from '../controllers/profileController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { updateProfileSchema } from '../utils/zodSchemas.js';

const router = express.Router();

router.use(authenticateToken);

router.put('/', validate(updateProfileSchema), updateProfile);
router.get('/stats', getProfileStats);

export default router;
