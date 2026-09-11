import { z } from 'zod';
import { objectId } from './commonValidators.js';

const image = z.union([z.string().url(), z.object({ url: z.string().url(), publicId: z.string().optional().default('') })]);
const serviceBody = z.object({
  name: z.string().trim().min(2).max(180),
  slug: z.string().trim().max(200).optional(),
  price: z.number().nonnegative(),
  duration: z.string().trim().min(1).max(80),
  description: z.string().trim().min(1).max(10_000),
  benefits: z.array(z.string().trim().min(1).max(300)).max(30).default([]),
  image: image.optional().nullable(),
  available: z.boolean().default(true),
  deliverable: z.string().trim().max(500).default(''),
  popular: z.boolean().default(false),
});

export const createServiceSchema = z.object({ body: serviceBody, params: z.any(), query: z.any() });
export const updateServiceSchema = z.object({
  body: serviceBody.partial().refine((value) => Object.keys(value).length > 0, 'At least one field is required.'),
  params: z.object({ id: objectId }), query: z.any(),
});

