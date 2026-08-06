import { db } from '../db/index.js';

export const getUserHistory = async (req, res, next) => {
  try {
    const history = await db.getUserHistory(req.user.id);
    return res.json({ success: true, history });
  } catch (err) {
    next(err);
  }
};

export const toggleFavorite = async (req, res, next) => {
  try {
    const { item_type, item_id } = req.body;
    if (!item_type || !item_id) {
      return res.status(400).json({ success: false, error: 'item_type and item_id are required.' });
    }
    const result = await db.toggleFavorite(req.user.id, item_type, item_id);
    return res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

export const getUserFavorites = async (req, res, next) => {
  try {
    const favorites = await db.getUserFavorites(req.user.id);
    return res.json({ success: true, favorites });
  } catch (err) {
    next(err);
  }
};
