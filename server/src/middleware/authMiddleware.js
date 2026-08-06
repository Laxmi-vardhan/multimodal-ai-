import jwt from 'jsonwebtoken';
import { db } from '../db/index.js';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ success: false, error: 'Access token required. Please log in.' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'omnifusion_jwt_secret_key_production_2026';
    const decoded = jwt.verify(token, secret);

    const user = await db.findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, error: 'User account not found or deactivated.' });
    }

    req.user = { id: user.id, email: user.email, name: user.name };
    next();
  } catch (err) {
    return res.status(403).json({ success: false, error: 'Invalid or expired access token.' });
  }
};
