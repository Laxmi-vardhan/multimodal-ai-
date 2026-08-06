import fs from 'fs';
import path from 'path';
import { db } from '../db/index.js';
import { processMultimodalContent } from '../services/geminiService.js';

export const uploadFiles = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, error: 'No files uploaded.' });
    }

    const category = req.body.category || 'Personal';
    const autoAnalyze = req.body.auto_analyze === 'true' || req.body.auto_analyze === true;
    const uploadedRecords = [];

    for (const file of req.files) {
      const fileRecord = await db.createFileRecord({
        user_id: req.user.id,
        name: file.originalname,
        original_name: file.originalname,
        mime_type: file.mimetype,
        file_size: file.size,
        category,
        storage_path: file.path
      });

      // Track history
      await db.addHistory({
        user_id: req.user.id,
        action_type: 'FILE_UPLOAD',
        description: `Uploaded file: ${file.originalname} (${category})`,
        resource_id: fileRecord.id
      });

      // Run instant AI insights extraction if autoAnalyze requested
      if (autoAnalyze) {
        try {
          const aiResult = await processMultimodalContent({ files: [fileRecord] });
          fileRecord.insights_json = aiResult;
          await db.updateFileInsights(fileRecord.id, req.user.id, aiResult);
        } catch (e) {
          console.warn('Auto AI analysis failed during upload:', e.message);
        }
      }

      uploadedRecords.push(fileRecord);
    }

    return res.status(201).json({
      success: true,
      count: uploadedRecords.length,
      files: uploadedRecords
    });
  } catch (err) {
    next(err);
  }
};

export const getUserFiles = async (req, res, next) => {
  try {
    const { category } = req.query;
    const files = await db.getUserFiles(req.user.id, category);
    return res.json({ success: true, files });
  } catch (err) {
    next(err);
  }
};

export const getFileById = async (req, res, next) => {
  try {
    const file = await db.getFileById(req.params.id, req.user.id);
    if (!file) {
      return res.status(404).json({ success: false, error: 'File not found.' });
    }
    return res.json({ success: true, file });
  } catch (err) {
    next(err);
  }
};

export const serveFileContent = async (req, res, next) => {
  try {
    const file = await db.getFileById(req.params.id, req.user.id);
    if (!file || !fs.existsSync(file.storage_path)) {
      return res.status(404).json({ success: false, error: 'File content not found on disk.' });
    }
    res.setHeader('Content-Type', file.mime_type);
    res.setHeader('Content-Disposition', `inline; filename="${file.original_name}"`);
    return fs.createReadStream(file.storage_path).pipe(res);
  } catch (err) {
    next(err);
  }
};

export const deleteFile = async (req, res, next) => {
  try {
    const file = await db.getFileById(req.params.id, req.user.id);
    if (!file) {
      return res.status(404).json({ success: false, error: 'File not found.' });
    }

    if (fs.existsSync(file.storage_path)) {
      fs.unlinkSync(file.storage_path);
    }

    await db.deleteFile(file.id, req.user.id);

    await db.addHistory({
      user_id: req.user.id,
      action_type: 'FILE_DELETE',
      description: `Deleted file: ${file.original_name}`
    });

    return res.json({ success: true, message: 'File deleted successfully.' });
  } catch (err) {
    next(err);
  }
};
