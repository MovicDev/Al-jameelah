import { apiRequest } from '../auth/services/apiClient';
import type { CustomerOrderInfo, LoggedOrder } from '../types';

export const createOrder = async (input: {
  customerInfo: CustomerOrderInfo;
  items: { productId: string; size: string; quantity: number }[];
}) => (await apiRequest<{ order: LoggedOrder }>('/orders', { method: 'POST', body: JSON.stringify(input) })).order;

export const listOrders = async () => (await apiRequest<{ orders: LoggedOrder[] }>('/orders', undefined, true)).orders;

export const updateOrderStatus = async (id: string, status: LoggedOrder['status']) => (
  await apiRequest<{ order: LoggedOrder }>(`/orders/${encodeURIComponent(id)}`, {
    method: 'PATCH', body: JSON.stringify({ status }),
  }, true)
).order;

