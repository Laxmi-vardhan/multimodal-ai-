import express from 'express';
import { uploadFiles, getUserFiles, getFileById, serveFileContent, deleteFile } from '../controllers/uploadController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/', upload.array('files', 10), uploadFiles);
router.get('/', getUserFiles);
router.get('/:id', getFileById);
router.get('/:id/view', serveFileContent);
router.delete('/:id', deleteFile);

export default router;
