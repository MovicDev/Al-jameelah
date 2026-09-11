import type { Product } from '../types';

export type CreateProductPayload = Pick<
  Product,
  | 'name'
  | 'category'
  | 'price'
  | 'size'
  | 'stockStatus'
  | 'shortDescription'
  | 'description'
  | 'images'
  | 'benefits'
  | 'howToUse'
  | 'hairTypes'
> & Pick<Partial<Product>, 'discountPrice'>;

export const toCreateProductPayload = (product: CreateProductPayload & Partial<Product>): CreateProductPayload => ({
  name: product.name,
  category: product.category,
  price: product.price,
  ...(product.discountPrice == null ? {} : { discountPrice: product.discountPrice }),
  size: product.size,
  stockStatus: product.stockStatus,
  shortDescription: product.shortDescription,
  description: product.description,
  images: product.images,
  benefits: product.benefits,
  howToUse: product.howToUse,
  hairTypes: product.hairTypes,
});

export const getDiscountPriceError = (price: number, discountPrice?: number) => (
  discountPrice != null && discountPrice > price
    ? 'Discount price cannot be higher than the regular price.'
    : null
);
