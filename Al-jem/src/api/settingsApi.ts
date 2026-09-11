import { apiRequest } from '../auth/services/apiClient';
import type { AdminSettings } from '../types';

export const getSettings = async () => (await apiRequest<{ data: AdminSettings | null }>('/settings')).data;
export const updateSettings = async (settings: Partial<AdminSettings>) => (
  await apiRequest<{ data: AdminSettings }>('/settings', { method: 'PATCH', body: JSON.stringify(settings) }, true)
).data;

