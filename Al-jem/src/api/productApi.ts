import { apiRequest } from '../auth/services/apiClient';
import { readSession } from '../auth/services/sessionStore';
import type { Product } from '../types';
import { toCreateProductPayload } from './productPayload';

type ProductInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

export const listProducts = async () => {
  const result = await apiRequest<{ data: Product[] }>('/products?limit=100', undefined, Boolean(readSession()));
  return result.data;
};

export const createProduct = async (product: ProductInput) => (
  await apiRequest<{ data: Product }>('/products', {
    method: 'POST',
    body: JSON.stringify(toCreateProductPayload(product)),
  }, true)
).data;

export const updateProduct = async (id: string, updates: Partial<Product>) => (
  await apiRequest<{ data: Product }>(`/products/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(updates) }, true)
).data;

export const deleteProduct = (id: string) => apiRequest(`/products/${encodeURIComponent(id)}`, { method: 'DELETE' }, true);
