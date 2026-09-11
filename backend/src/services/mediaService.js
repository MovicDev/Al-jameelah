import { MediaAsset } from '../models/MediaAsset.js';
import { uploadImage } from './cloudinaryService.js';

const folders = {
  avatar: 'al-jameelah/avatars',
  product: 'al-jameelah/products',
  service: 'al-jameelah/services',
};

export const storeUpload = async ({ buffer, kind, userId }) => {
  const image = await uploadImage(buffer, folders[kind]);
  await MediaAsset.create({ ...image, kind, uploadedBy: userId });
  return image;
};

export const resolveImage = async (input) => {
  if (!input) return null;
  if (typeof input === 'object') return { url: input.url, publicId: input.publicId ?? '' };
  const media = await MediaAsset.findOne({ url: input }).lean();
  return { url: input, publicId: media?.publicId ?? '' };
};

