import { apiRequest } from '../auth/services/apiClient';
import { readSession } from '../auth/services/sessionStore';
import type { Service } from '../types';

type ServiceInput = Omit<Service, 'id'>;

export const listServices = async () => (
  await apiRequest<{ data: Service[] }>('/services', undefined, Boolean(readSession()))
).data;
export const createService = async (service: ServiceInput) => (
  await apiRequest<{ data: Service }>('/services', { method: 'POST', body: JSON.stringify(service) }, true)
).data;
export const updateService = async (id: string, updates: Partial<Service>) => (
  await apiRequest<{ data: Service }>(`/services/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(updates) }, true)
).data;
export const deleteService = (id: string) => apiRequest(`/services/${encodeURIComponent(id)}`, { method: 'DELETE' }, true);

