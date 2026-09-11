import multer from 'multer';
import { AppError } from '../utils/AppError.js';

const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const allowedExtensions = /\.(jpe?g|png|webp)$/i;

export const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_request, file, callback) => {
    const extensionIsValid = allowedExtensions.test(file.originalname);
    if (!allowedMimeTypes.has(file.mimetype) || !extensionIsValid) {
      callback(new AppError(415, 'unsupported_image', 'Only JPG, PNG, and WebP images are allowed.'));
      return;
    }
    callback(null, true);
  },
});

