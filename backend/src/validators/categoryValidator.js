import { z } from 'zod';
import { objectId } from './commonValidators.js';

const category = z.object({
  name: z.string().trim().min(2).max(100),
  slug: z.string().trim().max(120).optional(),
  description: z.string().trim().max(500).optional().default(''),
  active: z.boolean().optional().default(true),
});
export const createCategorySchema = z.object({ body: category, params: z.any(), query: z.any() });
export const updateCategorySchema = z.object({
  body: category.partial().refine((value) => Object.keys(value).length > 0, 'At least one field is required.'),
  params: z.object({ id: objectId }), query: z.any(),
});

