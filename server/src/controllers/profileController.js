import bcrypt from 'bcryptjs';
import { db } from '../db/index.js';

export const updateProfile = async (req, res, next) => {
  try {
    const { name, avatar_url, password } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (avatar_url !== undefined) updates.avatar_url = avatar_url;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updates.password_hash = await bcrypt.hash(password, salt);
    }

    const updatedUser = await db.updateUser(req.user.id, updates);

    await db.addHistory({
      user_id: req.user.id,
      action_type: 'PROFILE_UPDATE',
      description: 'Profile details updated.'
    });

    return res.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar_url: updatedUser.avatar_url,
        created_at: updatedUser.created_at
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getProfileStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const files = await db.getUserFiles(userId);
    const chats = await db.getUserChats(userId);
    const reports = await db.getUserReports(userId);
    const history = await db.getUserHistory(userId);

    const totalStorageBytes = files.reduce((acc, f) => acc + (f.file_size || 0), 0);

    const categoryBreakdown = files.reduce((acc, f) => {
      acc[f.category] = (acc[f.category] || 0) + 1;
      return acc;
    }, {});

    const fileTypeBreakdown = files.reduce((acc, f) => {
      let type = 'Document';
      if (f.mime_type.startsWith('image/')) type = 'Image';
      else if (f.mime_type.startsWith('audio/')) type = 'Audio';
      else if (f.mime_type.startsWith('video/')) type = 'Video';
      else if (f.mime_type === 'application/pdf') type = 'PDF';

      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    return res.json({
      success: true,
      stats: {
        totalFiles: files.length,
        totalChats: chats.length,
        totalReports: reports.length,
        totalActivities: history.length,
        totalStorageMB: (totalStorageBytes / (1024 * 1024)).toFixed(2),
        categoryBreakdown,
        fileTypeBreakdown
      }
    });
  } catch (err) {
    next(err);
  }
};
