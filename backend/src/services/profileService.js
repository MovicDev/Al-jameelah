import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { deleteImage } from './cloudinaryService.js';
import { storeUpload } from './mediaService.js';

export const updateProfile = async (user, { fullName, phone }) => {
  if (fullName !== undefined) user.fullName = fullName;
  if (phone !== undefined) user.phone = phone;
  await user.save();
  return user;
};

export const changePassword = async (user, { currentPassword, newPassword }) => {
  const passwordUser = user.passwordHash
    ? user
    : await User.findById(user.id).select('+passwordHash');
  if (!passwordUser) throw new AppError(404, 'user_not_found', 'User not found.');
  const passwordIsValid = await passwordUser.verifyPassword(currentPassword);
  if (!passwordIsValid) throw new AppError(401, 'invalid_current_password', 'The current password is incorrect.');
  if (await passwordUser.verifyPassword(newPassword)) {
    throw new AppError(422, 'password_unchanged', 'Choose a new password that is different from the current password.');
  }
  passwordUser.passwordHash = await User.hashPassword(newPassword);
  await passwordUser.save();
};

export const replaceAvatar = async (user, file) => {
  if (!file) throw new AppError(422, 'image_required', 'Choose an image to upload.');
  const previousPublicId = user.avatar?.publicId;
  const image = await storeUpload({ buffer: file.buffer, kind: 'avatar', userId: user.id });
  user.avatar = image;
  try {
    await user.save();
  } catch (error) {
    await deleteImage(image.publicId).catch(() => undefined);
    throw error;
  }
  await deleteImage(previousPublicId);
  return user;
};

export const findUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new AppError(404, 'user_not_found', 'User not found.');
  return user;
};
