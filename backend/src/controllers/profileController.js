import * as profileService from '../services/profileService.js';
import { serializeProfile } from '../serializers/index.js';
import { sendSuccess } from '../utils/respond.js';

export const getProfile = async (request, response) => sendSuccess(response, 200, 'Profile loaded.', { profile: serializeProfile(request.user) });
export const updateProfile = async (request, response) => {
  const user = await profileService.updateProfile(request.user, request.validated.body);
  sendSuccess(response, 200, 'Profile updated.', { profile: serializeProfile(user) });
};
export const changePassword = async (request, response) => {
  await profileService.changePassword(request.user, request.validated.body);
  sendSuccess(response, 200, 'Password changed successfully.');
};
export const uploadAvatar = async (request, response) => {
  const user = await profileService.replaceAvatar(request.user, request.file);
  sendSuccess(response, 200, 'Avatar updated.', { profile: serializeProfile(user) });
};
