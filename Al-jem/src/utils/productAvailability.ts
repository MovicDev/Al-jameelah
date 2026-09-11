import type { Product } from '../types';

type ProductAvailability = Pick<Product, 'status' | 'stockStatus'>;

export const isProductOutOfStock = (product: ProductAvailability) => (
  product.stockStatus === 'out_of_stock' || product.status === 'out_of_stock'
);
