import type { Profile } from '../auth/types';
import { apiRequest } from '../auth/services/apiClient';

export const listRegisteredUsers = async () => (
  await apiRequest<{ data: Profile[] }>('/users', undefined, true)
).data;
