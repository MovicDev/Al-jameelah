import { z } from 'zod';
import { objectId } from './commonValidators.js';

const image = z.union([
  z.string().url(),
  z.object({ url: z.string().url(), publicId: z.string().max(300).optional().default('') }),
]);

const productFields = {
  name: z.string().trim().min(2).max(180),
  slug: z.string().trim().max(200).optional(),
  category: z.string().trim().min(1).max(100),
  price: z.number().nonnegative(),
  discountPrice: z.number().nonnegative().optional().nullable(),
  images: z.array(image).max(8),
  stock: z.number().int().nonnegative(),
  stockStatus: z.enum(['in_stock', 'out_of_stock', 'low_stock']).optional(),
  status: z.enum(['available', 'out_of_stock', 'hidden']),
  featured: z.boolean(),
  size: z.string().trim().max(80),
  description: z.string().trim().min(1).max(10_000),
  shortDescription: z.string().trim().max(500),
  benefits: z.array(z.string().trim().min(1).max(300)).max(30),
  ingredients: z.array(z.string().trim().min(1).max(300)).max(100),
  howToUse: z.string().trim().max(5_000),
  hairTypes: z.array(z.string().trim().min(1).max(100)).max(30),
  rating: z.number().min(0).max(5),
  reviewCount: z.number().int().nonnegative(),
  sku: z.string().trim().max(100).optional(),
};
const createProductFields = {
  ...productFields,
  images: productFields.images.default([]),
  stock: productFields.stock.default(0),
  status: productFields.status.default('available'),
  featured: productFields.featured.default(false),
  size: productFields.size.default('Standard'),
  shortDescription: productFields.shortDescription.default(''),
  benefits: productFields.benefits.default([]),
  ingredients: productFields.ingredients.default([]),
  howToUse: productFields.howToUse.default(''),
  hairTypes: productFields.hairTypes.default([]),
  rating: productFields.rating.default(0),
  reviewCount: productFields.reviewCount.default(0),
};
const validDiscount = (value) => value.discountPrice == null || value.price == null || value.discountPrice <= value.price;
const productBody = z.object(createProductFields).refine(validDiscount, {
  message: 'Discount price cannot exceed the regular price.', path: ['discountPrice'],
});

export const createProductSchema = z.object({ body: productBody, params: z.any(), query: z.any() });
export const updateProductSchema = z.object({
  body: z.object(productFields).partial()
    .refine((value) => Object.keys(value).length > 0, 'At least one field is required.')
    .refine(validDiscount, { message: 'Discount price cannot exceed the regular price.', path: ['discountPrice'] }),
  params: z.object({ id: objectId }), query: z.any(),
});
