import cloudinary, { isCloudinaryConfigured } from '../config/cloudinary.js';
import { AppError } from '../utils/AppError.js';

export const uploadImage = (buffer, folder) => {
  if (!isCloudinaryConfigured()) throw new AppError(503, 'media_not_configured', 'Image storage is not configured.');
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({
      folder,
      resource_type: 'image',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      unique_filename: true,
      overwrite: false,
    }, (error, result) => {
      if (error || !result) {
        reject(new AppError(502, 'media_upload_failed', 'The image could not be uploaded.'));
        return;
      }
      resolve({ url: result.secure_url, publicId: result.public_id });
    });
    stream.end(buffer);
  });
};

export const deleteImage = async (publicId) => {
  if (!publicId || !isCloudinaryConfigured()) return;
  const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'image', invalidate: true });
  if (!['ok', 'not found'].includes(result.result)) {
    throw new AppError(502, 'media_delete_failed', 'The previous image could not be removed.');
  }
};

export const deleteImages = async (publicIds) => {
  await Promise.all([...new Set(publicIds.filter(Boolean))].map(deleteImage));
};

