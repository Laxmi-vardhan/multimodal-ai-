import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { validate } from '../middleware/validateMiddleware.js';
import { registerSchema, loginSchema } from '../utils/zodSchemas.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', authenticateToken, getMe);

export default router;
