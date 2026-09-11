import { storeUpload } from '../services/mediaService.js';
import { AppError } from '../utils/AppError.js';
import { sendSuccess } from '../utils/respond.js';

export const upload = (kind) => async (request, response) => {
  if (!request.file) throw new AppError(422, 'image_required', 'Choose an image to upload.');
  const image = await storeUpload({ buffer: request.file.buffer, kind, userId: request.user.id });
  sendSuccess(response, 201, 'Image uploaded successfully.', { image: { secureUrl: image.url, publicId: image.publicId } });
};

