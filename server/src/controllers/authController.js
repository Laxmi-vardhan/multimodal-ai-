import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/index.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = await db.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ success: false, error: 'User with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const user = await db.createUser({
      name,
      email: email.toLowerCase(),
      password_hash
    });

    const secret = process.env.JWT_SECRET || 'omnifusion_jwt_secret_key_production_2026';
    const token = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: '7d' });

    // Track activity history
    await db.addHistory({
      user_id: user.id,
      action_type: 'USER_REGISTER',
      description: 'Account created successfully.'
    });

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar_url: user.avatar_url,
        created_at: user.created_at
      }
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const secret = process.env.JWT_SECRET || 'omnifusion_jwt_secret_key_production_2026';
    const token = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: '7d' });

    await db.addHistory({
      user_id: user.id,
      action_type: 'USER_LOGIN',
      description: 'Logged into OmniFusion AI platform.'
    });

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar_url: user.avatar_url,
        created_at: user.created_at
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await db.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }
    return res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar_url: user.avatar_url,
        created_at: user.created_at
      }
    });
  } catch (err) {
    next(err);
  }
};
