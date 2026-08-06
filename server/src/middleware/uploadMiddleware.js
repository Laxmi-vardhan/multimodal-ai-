import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = process.env.VERCEL ? '/tmp/uploads' : path.join(__dirname, '../../uploads');

try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (err) {
  console.warn('Upload directory creation skipped or failed:', err.message);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    // Text & PDF
    'application/pdf',
    'text/plain',
    'text/markdown',
    'text/csv',
    'application/json',
    // Images
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    // Audio
    'audio/mpeg',
    'audio/wav',
    'audio/m4a',
    'audio/mp3',
    'audio/ogg',
    'audio/webm',
    // Video
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/quicktime'
  ];

  if (allowedMimeTypes.includes(file.mimetype) || file.mimetype.startsWith('text/')) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}. Allowed: PDF, Images, Audio, Video, Text.`), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB maximum file size
  }
});
