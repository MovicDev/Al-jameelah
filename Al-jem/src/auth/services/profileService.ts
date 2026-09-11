import type { Profile } from '../types';
import { apiRequest } from './apiClient';

export const authenticatedRequest = <T>(path: string, init?: RequestInit) => apiRequest<T>(path, init, true);

export const getProfile = async () => (await authenticatedRequest<{ profile: Profile }>('/profile')).profile;

export const updateProfile = async (fullName: string) =>
  (await authenticatedRequest<{ profile: Profile }>('/profile', { method: 'PATCH', body: JSON.stringify({ fullName }) })).profile;

export const uploadAvatar = async (avatar: File) => {
  const body = new FormData();
  body.append('avatar', avatar);
  return (await authenticatedRequest<{ profile: Profile }>('/profile/avatar', { method: 'POST', body })).profile;
};

export const changePassword = async (currentPassword: string, newPassword: string) => {
  await authenticatedRequest('/profile/password', {
    method: 'PATCH',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
};

export const verifyAdminAccess = async () =>
  (await authenticatedRequest<{ authorized: boolean }>('/admin/access')).authorized;
